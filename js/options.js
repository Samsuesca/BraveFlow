// ========================================
// BRAVEFLOW - Options Page Script
// ========================================

let config = {
  autoPin: true,
  autoGroup: true,
  pinRules: [],
  groupRules: [],
  tolinks: {},
  sessions: {},
  clips: []
};

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  setupEventListeners();
  renderPinRules();
  renderGroupRules();
  updateStats();
});

async function loadConfig() {
  const data = await chrome.storage.local.get([
    'autoPin',
    'autoGroup',
    'pinRules',
    'groupRules',
    'tolinks',
    'sessions',
    'clips'
  ]);

  config = {
    autoPin: data.autoPin !== undefined ? data.autoPin : true,
    autoGroup: data.autoGroup !== undefined ? data.autoGroup : true,
    pinRules: data.pinRules || [],
    groupRules: data.groupRules || [],
    tolinks: data.tolinks || {},
    sessions: data.sessions || {},
    clips: data.clips || []
  };

  // Actualizar toggles
  document.getElementById('autoPinEnabled').checked = config.autoPin;
  document.getElementById('autoGroupEnabled').checked = config.autoGroup;
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
  // Toggles
  document.getElementById('autoPinEnabled').addEventListener('change', async (e) => {
    config.autoPin = e.target.checked;
    await chrome.storage.local.set({ autoPin: config.autoPin });
    showToast('Auto-pinning ' + (config.autoPin ? 'activado' : 'desactivado'), 'success');
  });

  document.getElementById('autoGroupEnabled').addEventListener('change', async (e) => {
    config.autoGroup = e.target.checked;
    await chrome.storage.local.set({ autoGroup: config.autoGroup });
    showToast('Auto-agrupación ' + (config.autoGroup ? 'activada' : 'desactivada'), 'success');
  });

  // Pin Rules
  document.getElementById('addPinRule').addEventListener('click', addPinRule);
  document.getElementById('pinRuleValue').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPinRule();
  });

  // Group Rules
  document.getElementById('addGroupRule').addEventListener('click', addGroupRule);
  document.getElementById('groupRuleValue').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addGroupRule();
  });

  // Data Management
  document.getElementById('exportData').addEventListener('click', exportData);
  document.getElementById('importData').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importData);
  document.getElementById('clearAllData').addEventListener('click', clearAllData);
}

// ========================================
// PIN RULES
// ========================================

async function addPinRule() {
  const type = document.getElementById('pinRuleType').value;
  const value = document.getElementById('pinRuleValue').value.trim();

  if (!value) {
    showToast('Ingresa un valor para la regla', 'error');
    return;
  }

  const rule = {
    id: Date.now(),
    type: type,
    value: value,
    enabled: true
  };

  config.pinRules.push(rule);
  await chrome.storage.local.set({ pinRules: config.pinRules });

  document.getElementById('pinRuleValue').value = '';
  renderPinRules();
  updateStats();
  showToast('Regla de pinning agregada', 'success');
}

function renderPinRules() {
  const list = document.getElementById('pinRulesList');
  list.innerHTML = '';

  if (config.pinRules.length === 0) {
    list.innerHTML = '<p class="empty">No hay reglas configuradas</p>';
    return;
  }

  config.pinRules.forEach(rule => {
    const item = document.createElement('div');
    item.className = 'rule-item';

    const typeLabel = {
      domain: 'Dominio',
      pattern: 'Patrón',
      exact: 'Exacta'
    }[rule.type];

    item.innerHTML = `
      <label class="rule-toggle">
        <input type="checkbox" ${rule.enabled ? 'checked' : ''} data-id="${rule.id}">
        <span class="toggle-slider small"></span>
      </label>
      <div class="rule-info">
        <span class="rule-type" data-type="${rule.type}">${typeLabel}</span>
        <span class="rule-value" data-original="${rule.value}">${rule.value}</span>
      </div>
      <button class="btn-edit" data-id="${rule.id}">✏️</button>
      <button class="btn-delete" data-id="${rule.id}">🗑️</button>
    `;

    // Toggle enable/disable
    item.querySelector('input[type="checkbox"]').addEventListener('change', async (e) => {
      const ruleToUpdate = config.pinRules.find(r => r.id === rule.id);
      if (ruleToUpdate) {
        ruleToUpdate.enabled = e.target.checked;
        await chrome.storage.local.set({ pinRules: config.pinRules });
        showToast('Regla ' + (e.target.checked ? 'activada' : 'desactivada'), 'success');
      }
    });

    // Edit
    item.querySelector('.btn-edit').addEventListener('click', () => {
      editPinRule(item, rule);
    });

    // Delete
    item.querySelector('.btn-delete').addEventListener('click', async () => {
      if (confirm('¿Eliminar esta regla?')) {
        config.pinRules = config.pinRules.filter(r => r.id !== rule.id);
        await chrome.storage.local.set({ pinRules: config.pinRules });
        renderPinRules();
        updateStats();
        showToast('Regla eliminada', 'success');
      }
    });

    list.appendChild(item);
  });
}

function editPinRule(itemElement, rule) {
  const ruleInfo = itemElement.querySelector('.rule-info');
  const typeSpan = ruleInfo.querySelector('.rule-type');
  const valueSpan = ruleInfo.querySelector('.rule-value');
  const editBtn = itemElement.querySelector('.btn-edit');
  const deleteBtn = itemElement.querySelector('.btn-delete');

  // Guardar contenido original
  const originalHTML = ruleInfo.innerHTML;

  // Crear inputs de edición
  ruleInfo.innerHTML = `
    <select class="edit-select">
      <option value="domain" ${rule.type === 'domain' ? 'selected' : ''}>Dominio</option>
      <option value="pattern" ${rule.type === 'pattern' ? 'selected' : ''}>Patrón</option>
      <option value="exact" ${rule.type === 'exact' ? 'selected' : ''}>Exacta</option>
    </select>
    <input type="text" class="edit-input" value="${rule.value}">
  `;

  // Reemplazar botones
  editBtn.textContent = '✓';
  editBtn.className = 'btn-save';
  deleteBtn.textContent = '✕';
  deleteBtn.className = 'btn-cancel';

  const typeSelect = ruleInfo.querySelector('.edit-select');
  const valueInput = ruleInfo.querySelector('.edit-input');

  valueInput.focus();
  valueInput.select();

  // Función para guardar
  const save = async () => {
    const newType = typeSelect.value;
    const newValue = valueInput.value.trim();

    if (!newValue) {
      showToast('El valor no puede estar vacío', 'error');
      return;
    }

    // Actualizar regla
    const ruleToUpdate = config.pinRules.find(r => r.id === rule.id);
    if (ruleToUpdate) {
      ruleToUpdate.type = newType;
      ruleToUpdate.value = newValue;
      await chrome.storage.local.set({ pinRules: config.pinRules });
      renderPinRules();
      showToast('Regla actualizada', 'success');
    }
  };

  // Función para cancelar
  const cancel = () => {
    renderPinRules();
  };

  // Event listeners
  editBtn.removeEventListener('click', editBtn._clickHandler);
  editBtn.addEventListener('click', save);

  deleteBtn.removeEventListener('click', deleteBtn._clickHandler);
  deleteBtn.addEventListener('click', cancel);

  valueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  });
}

// ========================================
// GROUP RULES
// ========================================

async function addGroupRule() {
  const name = document.getElementById('groupRuleName').value.trim();
  const type = document.getElementById('groupRuleType').value;
  const value = document.getElementById('groupRuleValue').value.trim();
  const color = document.getElementById('groupRuleColor').value;

  if (!name || !value) {
    showToast('Completa todos los campos', 'error');
    return;
  }

  const rule = {
    id: Date.now(),
    name: name,
    type: type,
    value: value,
    color: color,
    enabled: true
  };

  // Si es categoría, convertir a array de dominios
  if (type === 'category') {
    rule.domains = value.split(',').map(d => d.trim());
  }

  config.groupRules.push(rule);
  await chrome.storage.local.set({ groupRules: config.groupRules });

  document.getElementById('groupRuleName').value = '';
  document.getElementById('groupRuleValue').value = '';
  renderGroupRules();
  updateStats();
  showToast('Regla de agrupación agregada', 'success');
}

function renderGroupRules() {
  const list = document.getElementById('groupRulesList');
  list.innerHTML = '';

  if (config.groupRules.length === 0) {
    list.innerHTML = '<p class="empty">No hay reglas configuradas</p>';
    return;
  }

  config.groupRules.forEach(rule => {
    const item = document.createElement('div');
    item.className = 'rule-item';

    const typeLabel = {
      domain: 'Dominio',
      pattern: 'Patrón',
      category: 'Categoría'
    }[rule.type];

    const displayValue = rule.type === 'category'
      ? `${rule.domains.length} dominios`
      : rule.value;

    item.innerHTML = `
      <label class="rule-toggle">
        <input type="checkbox" ${rule.enabled ? 'checked' : ''} data-id="${rule.id}">
        <span class="toggle-slider small"></span>
      </label>
      <div class="rule-info">
        <span class="rule-name">${rule.name}</span>
        <span class="rule-meta">
          <span class="color-badge" style="background: var(--${rule.color})"></span>
          ${typeLabel}: ${displayValue}
        </span>
      </div>
      <button class="btn-edit" data-id="${rule.id}">✏️</button>
      <button class="btn-delete" data-id="${rule.id}">🗑️</button>
    `;

    // Toggle enable/disable
    item.querySelector('input[type="checkbox"]').addEventListener('change', async (e) => {
      const ruleToUpdate = config.groupRules.find(r => r.id === rule.id);
      if (ruleToUpdate) {
        ruleToUpdate.enabled = e.target.checked;
        await chrome.storage.local.set({ groupRules: config.groupRules });
        showToast('Regla ' + (e.target.checked ? 'activada' : 'desactivada'), 'success');
      }
    });

    // Edit
    item.querySelector('.btn-edit').addEventListener('click', () => {
      editGroupRule(item, rule);
    });

    // Delete
    item.querySelector('.btn-delete').addEventListener('click', async () => {
      if (confirm('¿Eliminar esta regla?')) {
        config.groupRules = config.groupRules.filter(r => r.id !== rule.id);
        await chrome.storage.local.set({ groupRules: config.groupRules });
        renderGroupRules();
        updateStats();
        showToast('Regla eliminada', 'success');
      }
    });

    list.appendChild(item);
  });
}

function editGroupRule(itemElement, rule) {
  const ruleInfo = itemElement.querySelector('.rule-info');
  const editBtn = itemElement.querySelector('.btn-edit');
  const deleteBtn = itemElement.querySelector('.btn-delete');

  // Crear inputs de edición
  const valueForInput = rule.type === 'category' ? rule.domains.join(',') : rule.value;

  ruleInfo.innerHTML = `
    <input type="text" class="edit-input" placeholder="Nombre" value="${rule.name}">
    <select class="edit-select-small">
      <option value="domain" ${rule.type === 'domain' ? 'selected' : ''}>Dominio</option>
      <option value="pattern" ${rule.type === 'pattern' ? 'selected' : ''}>Patrón</option>
      <option value="category" ${rule.type === 'category' ? 'selected' : ''}>Categoría</option>
    </select>
    <input type="text" class="edit-input" placeholder="Valor" value="${valueForInput}">
    <select class="edit-select-small">
      <option value="grey" ${rule.color === 'grey' ? 'selected' : ''}>Gris</option>
      <option value="blue" ${rule.color === 'blue' ? 'selected' : ''}>Azul</option>
      <option value="red" ${rule.color === 'red' ? 'selected' : ''}>Rojo</option>
      <option value="yellow" ${rule.color === 'yellow' ? 'selected' : ''}>Amarillo</option>
      <option value="green" ${rule.color === 'green' ? 'selected' : ''}>Verde</option>
      <option value="pink" ${rule.color === 'pink' ? 'selected' : ''}>Rosa</option>
      <option value="purple" ${rule.color === 'purple' ? 'selected' : ''}>Púrpura</option>
      <option value="cyan" ${rule.color === 'cyan' ? 'selected' : ''}>Cian</option>
      <option value="orange" ${rule.color === 'orange' ? 'selected' : ''}>Naranja</option>
    </select>
  `;

  // Reemplazar botones
  editBtn.textContent = '✓';
  editBtn.className = 'btn-save';
  deleteBtn.textContent = '✕';
  deleteBtn.className = 'btn-cancel';

  const inputs = ruleInfo.querySelectorAll('input, select');
  const [nameInput, typeSelect, valueInput, colorSelect] = inputs;

  nameInput.focus();
  nameInput.select();

  // Función para guardar
  const save = async () => {
    const newName = nameInput.value.trim();
    const newType = typeSelect.value;
    const newValue = valueInput.value.trim();
    const newColor = colorSelect.value;

    if (!newName || !newValue) {
      showToast('Completa todos los campos', 'error');
      return;
    }

    // Actualizar regla
    const ruleToUpdate = config.groupRules.find(r => r.id === rule.id);
    if (ruleToUpdate) {
      ruleToUpdate.name = newName;
      ruleToUpdate.type = newType;
      ruleToUpdate.color = newColor;

      if (newType === 'category') {
        ruleToUpdate.domains = newValue.split(',').map(d => d.trim());
        ruleToUpdate.value = newValue;
      } else {
        ruleToUpdate.value = newValue;
        delete ruleToUpdate.domains;
      }

      await chrome.storage.local.set({ groupRules: config.groupRules });
      renderGroupRules();
      showToast('Regla actualizada', 'success');
    }
  };

  // Función para cancelar
  const cancel = () => {
    renderGroupRules();
  };

  // Event listeners
  editBtn.removeEventListener('click', editBtn._clickHandler);
  editBtn.addEventListener('click', save);

  deleteBtn.removeEventListener('click', deleteBtn._clickHandler);
  deleteBtn.addEventListener('click', cancel);

  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') cancel();
    });
  });
}

// ========================================
// DATA MANAGEMENT
// ========================================

async function exportData() {
  const allData = await chrome.storage.local.get(null);
  const dataStr = JSON.stringify(allData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `braveflow-backup-${Date.now()}.json`;
  a.click();

  URL.revokeObjectURL(url);
  showToast('Datos exportados correctamente', 'success');
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (confirm('¿Importar datos? Esto sobrescribirá la configuración actual.')) {
      await chrome.storage.local.set(data);
      await loadConfig();
      renderPinRules();
      renderGroupRules();
      updateStats();
      showToast('Datos importados correctamente', 'success');
    }
  } catch (error) {
    console.error('Error al importar:', error);
    showToast('Error al importar datos', 'error');
  }

  event.target.value = '';
}

async function clearAllData() {
  if (!confirm('¿BORRAR TODOS LOS DATOS? Esta acción no se puede deshacer.')) {
    return;
  }

  if (!confirm('¿Estás completamente seguro? Se borrarán todos los tolinks, sesiones, clips y reglas.')) {
    return;
  }

  await chrome.storage.local.clear();
  await loadConfig();
  renderPinRules();
  renderGroupRules();
  updateStats();
  showToast('Todos los datos han sido borrados', 'success');
}

// ========================================
// STATS
// ========================================

function updateStats() {
  document.getElementById('statsTolinks').textContent = Object.keys(config.tolinks).length;
  document.getElementById('statsSessions').textContent = Object.keys(config.sessions).length;
  document.getElementById('statsClips').textContent = config.clips.length;
  document.getElementById('statsPinRules').textContent = config.pinRules.length;
  document.getElementById('statsGroupRules').textContent = config.groupRules.length;
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    loadConfig().then(() => {
      renderPinRules();
      renderGroupRules();
      updateStats();
    });
  }
});
