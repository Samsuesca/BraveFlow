// ========================================
// BRAVEFLOW - Popup Script
// ========================================

let currentData = {
  tolinks: {},
  sessions: {},
  clips: []
};

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  setupEventListeners();
  setupTabs();
  updateStats();
});

// Cargar datos desde storage
async function loadData() {
  const data = await chrome.storage.local.get(['tolinks', 'sessions', 'clips']);
  currentData.tolinks = data.tolinks || {};
  currentData.sessions = data.sessions || {};
  currentData.clips = data.clips || [];

  renderTolinks();
  renderSessions();
  renderClips();
}

// ========================================
// SISTEMA DE TABS
// ========================================

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Actualizar botones
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Actualizar contenido
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
  // Botón de configuración
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Tolinks
  document.getElementById('addTolink').addEventListener('click', addTolink);
  document.getElementById('newAlias').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTolink();
  });
  document.getElementById('newUrl').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTolink();
  });

  // Sesiones
  document.getElementById('saveSession').addEventListener('click', saveSession);
  document.getElementById('newSessionName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveSession();
  });

  // Acciones rápidas
  document.getElementById('groupNow').addEventListener('click', groupTabs);
  document.getElementById('pinSelected').addEventListener('click', pinCurrentTab);
  document.getElementById('applyPinRules').addEventListener('click', applyPinRules);
  document.getElementById('saveQuickSession').addEventListener('click', saveQuickSession);
}

// ========================================
// TOLINKS
// ========================================

async function addTolink() {
  const aliasInput = document.getElementById('newAlias');
  const urlInput = document.getElementById('newUrl');

  const alias = aliasInput.value.trim().toLowerCase();
  const url = urlInput.value.trim();

  if (!alias || !url) {
    showMessage('Por favor completa ambos campos', 'error');
    return;
  }

  // Validar URL
  if (!url.match(/^https?:\/\//i) && !url.includes('.')) {
    showMessage('URL inválida', 'error');
    return;
  }

  currentData.tolinks[alias] = url;
  await chrome.storage.local.set({ tolinks: currentData.tolinks });

  aliasInput.value = '';
  urlInput.value = '';
  renderTolinks();
  updateStats();
  showMessage('Tolink agregado correctamente', 'success');
}

function renderTolinks() {
  const list = document.getElementById('tolinksList');
  list.innerHTML = '';

  const entries = Object.entries(currentData.tolinks);

  if (entries.length === 0) {
    list.innerHTML = '<p class="empty">No hay tolinks guardados</p>';
    return;
  }

  entries.forEach(([alias, url]) => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.dataset.alias = alias;
    item.innerHTML = `
      <div class="item-content">
        <span class="alias" data-original="${alias}">${alias}</span>
        <span class="url" data-original="${url}" title="${url}">${truncate(url, 40)}</span>
      </div>
      <div class="item-actions">
        <button class="btn-icon" data-action="edit" title="Editar">✏️</button>
        <button class="btn-icon" data-action="copy" title="Copiar">📋</button>
        <button class="btn-icon" data-action="delete" title="Eliminar">🗑️</button>
      </div>
    `;

    // Event listeners
    item.querySelector('[data-action="edit"]').addEventListener('click', () => {
      editTolink(item, alias, url);
    });

    item.querySelector('[data-action="copy"]').addEventListener('click', () => {
      navigator.clipboard.writeText(url);
      showMessage('URL copiada', 'success');
    });

    item.querySelector('[data-action="delete"]').addEventListener('click', () => {
      deleteTolink(alias);
    });

    list.appendChild(item);
  });
}

async function deleteTolink(alias) {
  if (!confirm(`¿Eliminar tolink "${alias}"?`)) return;

  delete currentData.tolinks[alias];
  await chrome.storage.local.set({ tolinks: currentData.tolinks });
  renderTolinks();
  updateStats();
  showMessage('Tolink eliminado', 'success');
}

function editTolink(itemElement, oldAlias, oldUrl) {
  const aliasSpan = itemElement.querySelector('.alias');
  const urlSpan = itemElement.querySelector('.url');
  const actionsDiv = itemElement.querySelector('.item-actions');

  // Convertir a modo edición
  aliasSpan.innerHTML = `<input type="text" class="edit-input-small" value="${oldAlias}">`;
  urlSpan.innerHTML = `<input type="text" class="edit-input-large" value="${oldUrl}">`;

  actionsDiv.innerHTML = `
    <button class="btn-icon btn-save" title="Guardar">✓</button>
    <button class="btn-icon btn-cancel" title="Cancelar">✕</button>
  `;

  const aliasInput = aliasSpan.querySelector('input');
  const urlInput = urlSpan.querySelector('input');

  aliasInput.focus();
  aliasInput.select();

  // Guardar cambios
  const saveBtn = actionsDiv.querySelector('.btn-save');
  saveBtn.addEventListener('click', async () => {
    const newAlias = aliasInput.value.trim().toLowerCase();
    const newUrl = urlInput.value.trim();

    if (!newAlias || !newUrl) {
      showMessage('Completa ambos campos', 'error');
      return;
    }

    // Si cambió el alias, eliminar el viejo
    if (newAlias !== oldAlias) {
      delete currentData.tolinks[oldAlias];
    }

    currentData.tolinks[newAlias] = newUrl;
    await chrome.storage.local.set({ tolinks: currentData.tolinks });
    renderTolinks();
    updateStats();
    showMessage('Tolink actualizado', 'success');
  });

  // Cancelar edición
  const cancelBtn = actionsDiv.querySelector('.btn-cancel');
  cancelBtn.addEventListener('click', () => {
    renderTolinks();
  });

  // Guardar con Enter
  [aliasInput, urlInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') saveBtn.click();
      if (e.key === 'Escape') cancelBtn.click();
    });
  });
}

// ========================================
// SESIONES
// ========================================

async function saveSession() {
  const nameInput = document.getElementById('newSessionName');
  const name = nameInput.value.trim();

  if (!name) {
    showMessage('Ingresa un nombre para la sesión', 'error');
    return;
  }

  const response = await chrome.runtime.sendMessage({
    action: 'saveSession',
    name: name
  });

  if (response && response.success) {
    currentData.sessions[name] = response.session;
    nameInput.value = '';
    renderSessions();
    updateStats();
    showMessage('Sesión guardada correctamente', 'success');
  } else {
    showMessage('Error al guardar sesión', 'error');
  }
}

async function saveQuickSession() {
  const timestamp = new Date().toLocaleString('es-ES');
  const name = `Sesión ${timestamp}`;

  const response = await chrome.runtime.sendMessage({
    action: 'saveSession',
    name: name
  });

  if (response && response.success) {
    currentData.sessions[name] = response.session;
    renderSessions();
    updateStats();
    showMessage('Sesión guardada correctamente', 'success');
  }
}

function renderSessions() {
  const list = document.getElementById('sessionsList');
  list.innerHTML = '';

  const entries = Object.entries(currentData.sessions);

  if (entries.length === 0) {
    list.innerHTML = '<p class="empty">No hay sesiones guardadas</p>';
    return;
  }

  entries.forEach(([name, session]) => {
    const item = document.createElement('div');
    item.className = 'list-item';

    const date = new Date(session.timestamp).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    item.innerHTML = `
      <div class="item-content">
        <span class="session-name" data-original="${name}">${name}</span>
        <span class="session-info">${session.tabs.length} tabs · ${date}</span>
      </div>
      <div class="item-actions">
        <button class="btn-icon" data-action="view-tabs" title="Ver/Editar tabs">📋</button>
        <button class="btn-icon" data-action="edit" title="Editar nombre">✏️</button>
        <button class="btn-icon" data-action="load" title="Abrir">🚀</button>
        <button class="btn-icon" data-action="delete" title="Eliminar">🗑️</button>
      </div>
    `;

    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'session-tabs-container';
    tabsContainer.style.display = 'none';

    item.querySelector('[data-action="view-tabs"]').addEventListener('click', () => {
      toggleSessionTabs(item, tabsContainer, name, session);
    });

    item.querySelector('[data-action="edit"]').addEventListener('click', () => {
      editSessionName(item, name);
    });

    item.querySelector('[data-action="load"]').addEventListener('click', () => {
      loadSession(name);
    });

    item.querySelector('[data-action="delete"]').addEventListener('click', () => {
      deleteSession(name);
    });

    list.appendChild(item);
    list.appendChild(tabsContainer);
  });
}

async function loadSession(name) {
  const response = await chrome.runtime.sendMessage({
    action: 'loadSession',
    name: name
  });

  if (response && response.success) {
    showMessage('Sesión cargada', 'success');
    window.close();
  } else {
    showMessage('Error al cargar sesión', 'error');
  }
}

async function deleteSession(name) {
  if (!confirm(`¿Eliminar sesión "${name}"?`)) return;

  delete currentData.sessions[name];
  await chrome.storage.local.set({ sessions: currentData.sessions });
  renderSessions();
  updateStats();
  showMessage('Sesión eliminada', 'success');
}

function editSessionName(itemElement, oldName) {
  const nameSpan = itemElement.querySelector('.session-name');
  const actionsDiv = itemElement.querySelector('.item-actions');
  const sessionData = currentData.sessions[oldName];

  // Convertir a modo edición
  nameSpan.innerHTML = `<input type="text" class="edit-input-large" value="${oldName}">`;

  actionsDiv.innerHTML = `
    <button class="btn-icon btn-save" title="Guardar">✓</button>
    <button class="btn-icon btn-cancel" title="Cancelar">✕</button>
  `;

  const nameInput = nameSpan.querySelector('input');
  nameInput.focus();
  nameInput.select();

  // Guardar cambios
  const saveBtn = actionsDiv.querySelector('.btn-save');
  saveBtn.addEventListener('click', async () => {
    const newName = nameInput.value.trim();

    if (!newName) {
      showMessage('El nombre no puede estar vacío', 'error');
      return;
    }

    // Si cambió el nombre
    if (newName !== oldName) {
      // Copiar data con nuevo nombre
      currentData.sessions[newName] = { ...sessionData, name: newName };
      delete currentData.sessions[oldName];
      await chrome.storage.local.set({ sessions: currentData.sessions });
      renderSessions();
      updateStats();
      showMessage('Sesión renombrada', 'success');
    } else {
      renderSessions();
    }
  });

  // Cancelar edición
  const cancelBtn = actionsDiv.querySelector('.btn-cancel');
  cancelBtn.addEventListener('click', () => {
    renderSessions();
  });

  // Guardar con Enter, cancelar con Escape
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveBtn.click();
    if (e.key === 'Escape') cancelBtn.click();
  });
}

function toggleSessionTabs(itemElement, tabsContainer, sessionName, session) {
  const viewBtn = itemElement.querySelector('[data-action="view-tabs"]');

  if (tabsContainer.style.display === 'none') {
    // Mostrar tabs
    renderSessionTabs(tabsContainer, sessionName, session);
    tabsContainer.style.display = 'block';
    viewBtn.textContent = '🔼';
    viewBtn.title = 'Ocultar tabs';
  } else {
    // Ocultar tabs
    tabsContainer.style.display = 'none';
    viewBtn.textContent = '📋';
    viewBtn.title = 'Ver/Editar tabs';
  }
}

function renderSessionTabs(container, sessionName, session) {
  container.innerHTML = `
    <div class="session-tabs-header">
      <h4>Tabs de la sesión (${session.tabs.length})</h4>
      <button class="btn-add-tab">+ Agregar Tab</button>
    </div>
    <div class="session-tabs-list"></div>
  `;

  const tabsList = container.querySelector('.session-tabs-list');
  const addBtn = container.querySelector('.btn-add-tab');

  // Renderizar cada tab
  session.tabs.forEach((tab, index) => {
    const tabItem = document.createElement('div');
    tabItem.className = 'session-tab-item';
    tabItem.innerHTML = `
      <div class="tab-item-content">
        <span class="tab-title">${truncate(tab.title || tab.url, 30)}</span>
        <span class="tab-url">${truncate(tab.url, 35)}</span>
      </div>
      <div class="tab-item-actions">
        <button class="btn-icon-small" data-action="edit-tab" data-index="${index}" title="Editar">✏️</button>
        <button class="btn-icon-small" data-action="delete-tab" data-index="${index}" title="Eliminar">🗑️</button>
      </div>
    `;

    tabItem.querySelector('[data-action="edit-tab"]').addEventListener('click', () => {
      editSessionTab(tabItem, sessionName, session, index);
    });

    tabItem.querySelector('[data-action="delete-tab"]').addEventListener('click', () => {
      deleteSessionTab(sessionName, session, index);
    });

    tabsList.appendChild(tabItem);
  });

  // Botón para agregar nueva tab
  addBtn.addEventListener('click', () => {
    addTabToSession(sessionName, session, container);
  });
}

function editSessionTab(tabElement, sessionName, session, tabIndex) {
  const tab = session.tabs[tabIndex];
  const contentDiv = tabElement.querySelector('.tab-item-content');
  const actionsDiv = tabElement.querySelector('.tab-item-actions');

  contentDiv.innerHTML = `
    <input type="text" class="edit-input-large" placeholder="URL" value="${tab.url}">
  `;

  actionsDiv.innerHTML = `
    <button class="btn-icon-small btn-save" title="Guardar">✓</button>
    <button class="btn-icon-small btn-cancel" title="Cancelar">✕</button>
  `;

  const urlInput = contentDiv.querySelector('input');
  urlInput.focus();
  urlInput.select();

  const saveBtn = actionsDiv.querySelector('.btn-save');
  const cancelBtn = actionsDiv.querySelector('.btn-cancel');

  const save = async () => {
    const newUrl = urlInput.value.trim();

    if (!newUrl) {
      showMessage('La URL no puede estar vacía', 'error');
      return;
    }

    // Actualizar tab
    session.tabs[tabIndex].url = newUrl;
    currentData.sessions[sessionName] = session;
    await chrome.storage.local.set({ sessions: currentData.sessions });

    // Re-renderizar
    const container = tabElement.closest('.session-tabs-container');
    renderSessionTabs(container, sessionName, session);
    showMessage('Tab actualizada', 'success');
  };

  const cancel = () => {
    const container = tabElement.closest('.session-tabs-container');
    renderSessionTabs(container, sessionName, session);
  };

  saveBtn.addEventListener('click', save);
  cancelBtn.addEventListener('click', cancel);

  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  });
}

async function deleteSessionTab(sessionName, session, tabIndex) {
  if (!confirm('¿Eliminar esta tab de la sesión?')) return;

  session.tabs.splice(tabIndex, 1);
  currentData.sessions[sessionName] = session;
  await chrome.storage.local.set({ sessions: currentData.sessions });

  // Re-renderizar sesiones completas para actualizar contador
  renderSessions();
  showMessage('Tab eliminada', 'success');
}

async function addTabToSession(sessionName, session, container) {
  const tabsList = container.querySelector('.session-tabs-list');

  // Crear elemento temporal para agregar nueva tab
  const newTabItem = document.createElement('div');
  newTabItem.className = 'session-tab-item new-tab';
  newTabItem.innerHTML = `
    <div class="tab-item-content">
      <input type="text" class="edit-input-large" placeholder="Ingresa la URL de la nueva tab">
    </div>
    <div class="tab-item-actions">
      <button class="btn-icon-small btn-save" title="Agregar">✓</button>
      <button class="btn-icon-small btn-cancel" title="Cancelar">✕</button>
    </div>
  `;

  const urlInput = newTabItem.querySelector('input');
  const saveBtn = newTabItem.querySelector('.btn-save');
  const cancelBtn = newTabItem.querySelector('.btn-cancel');

  const save = async () => {
    const url = urlInput.value.trim();

    if (!url) {
      showMessage('Ingresa una URL', 'error');
      return;
    }

    // Agregar nueva tab a la sesión
    session.tabs.push({
      url: url,
      title: url,
      pinned: false
    });

    currentData.sessions[sessionName] = session;
    await chrome.storage.local.set({ sessions: currentData.sessions });

    // Re-renderizar
    renderSessionTabs(container, sessionName, session);
    renderSessions(); // Actualizar contador en lista principal
    showMessage('Tab agregada', 'success');
  };

  const cancel = () => {
    newTabItem.remove();
  };

  saveBtn.addEventListener('click', save);
  cancelBtn.addEventListener('click', cancel);

  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  });

  tabsList.appendChild(newTabItem);
  urlInput.focus();
}

// ========================================
// CLIPS
// ========================================

function renderClips() {
  const list = document.getElementById('clipsList');
  list.innerHTML = '';

  if (currentData.clips.length === 0) {
    list.innerHTML = '<p class="empty">No hay clips guardados</p>';
    return;
  }

  // Mostrar los más recientes primero
  const sortedClips = [...currentData.clips].reverse();

  sortedClips.forEach((clip, index) => {
    const item = document.createElement('div');
    item.className = 'list-item clip-item';

    const date = new Date(clip.timestamp).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    item.innerHTML = `
      <div class="item-content">
        <div class="clip-content">${truncate(clip.content, 80)}</div>
        <div class="clip-meta">
          <span class="clip-url" title="${clip.url}">${truncate(clip.title || clip.url, 50)}</span>
          <span class="clip-date">${date}</span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-icon" data-action="copy" title="Copiar">📋</button>
        <button class="btn-icon" data-action="open" title="Abrir URL">🔗</button>
        <button class="btn-icon" data-action="delete" title="Eliminar">🗑️</button>
      </div>
    `;

    item.querySelector('[data-action="copy"]').addEventListener('click', () => {
      navigator.clipboard.writeText(clip.content);
      showMessage('Contenido copiado', 'success');
    });

    item.querySelector('[data-action="open"]').addEventListener('click', () => {
      chrome.tabs.create({ url: clip.url });
    });

    item.querySelector('[data-action="delete"]').addEventListener('click', () => {
      deleteClip(clip.id);
    });

    list.appendChild(item);
  });
}

async function deleteClip(clipId) {
  currentData.clips = currentData.clips.filter(c => c.id !== clipId);
  await chrome.storage.local.set({ clips: currentData.clips });
  renderClips();
  updateStats();
  showMessage('Clip eliminado', 'success');
}

// ========================================
// ACCIONES RÁPIDAS
// ========================================

async function groupTabs() {
  const response = await chrome.runtime.sendMessage({ action: 'groupTabs' });

  if (response && response.success) {
    showMessage('Tabs agrupadas correctamente', 'success');
  } else {
    showMessage('Error al agrupar tabs', 'error');
  }
}

async function pinCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.update(tab.id, { pinned: !tab.pinned });
  showMessage(tab.pinned ? 'Tab despineada' : 'Tab pineada', 'success');
}

async function applyPinRules() {
  const response = await chrome.runtime.sendMessage({ action: 'applyPinRules' });

  if (response && response.success) {
    const count = response.count || 0;
    if (count > 0) {
      showMessage(`${count} tab${count !== 1 ? 's' : ''} pineada${count !== 1 ? 's' : ''}`, 'success');
    } else {
      showMessage('No hay tabs que coincidan con las reglas', 'info');
    }
  } else {
    showMessage('Error al aplicar reglas', 'error');
  }
}

// ========================================
// ESTADÍSTICAS
// ========================================

function updateStats() {
  document.getElementById('tolinksCount').textContent = Object.keys(currentData.tolinks).length;
  document.getElementById('sessionsCount').textContent = Object.keys(currentData.sessions).length;
  document.getElementById('clipsCount').textContent = currentData.clips.length;
}

// ========================================
// UTILIDADES
// ========================================

function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

function showMessage(message, type = 'info') {
  // Crear toast notification
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Escuchar cambios en storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.tolinks) {
      currentData.tolinks = changes.tolinks.newValue || {};
      renderTolinks();
      updateStats();
    }
    if (changes.sessions) {
      currentData.sessions = changes.sessions.newValue || {};
      renderSessions();
      updateStats();
    }
    if (changes.clips) {
      currentData.clips = changes.clips.newValue || [];
      renderClips();
      updateStats();
    }
  }
});
