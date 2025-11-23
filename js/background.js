// ========================================
// BRAVEFLOW - Background Service Worker
// ========================================

// Inicializar storage con valores por defecto
chrome.runtime.onInstalled.addListener(async () => {
  const defaults = {
    tolinks: {},
    pinRules: [],
    groupRules: [],
    sessions: {},
    clips: [],
    autoGroup: true,
    autoPin: true
  };

  const existing = await chrome.storage.local.get(Object.keys(defaults));
  const toSet = {};

  for (const [key, value] of Object.entries(defaults)) {
    if (existing[key] === undefined) {
      toSet[key] = value;
    }
  }

  if (Object.keys(toSet).length > 0) {
    await chrome.storage.local.set(toSet);
  }

  console.log('BraveFlow instalado correctamente');
});

// ========================================
// TOLINKS - Aliases de URLs
// ========================================

let tolinksCache = {};

// Cargar tolinks al inicio
chrome.storage.local.get(['tolinks'], (result) => {
  tolinksCache = result.tolinks || {};
});

// Actualizar cache cuando cambian
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.tolinks) {
    tolinksCache = changes.tolinks.newValue || {};
  }
});

// Manejar entrada en omnibox
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const suggestions = [];
  const searchTerm = text.toLowerCase();

  for (const [alias, url] of Object.entries(tolinksCache)) {
    if (alias.toLowerCase().includes(searchTerm)) {
      suggestions.push({
        content: alias,
        description: `${alias} → ${url}`
      });
    }
  }

  suggest(suggestions);
});

// Navegar cuando se selecciona
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  let url = tolinksCache[text] || tolinksCache[text.toLowerCase()];

  // Si no se encuentra el alias exacto, buscar parcial
  if (!url) {
    const searchTerm = text.toLowerCase();
    const match = Object.keys(tolinksCache).find(alias =>
      alias.toLowerCase().includes(searchTerm)
    );
    if (match) {
      url = tolinksCache[match];
    }
  }

  // Si todavía no hay URL, buscar en Google
  if (!url) {
    url = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
  }

  // Asegurar que la URL tenga protocolo
  if (url && !url.match(/^https?:\/\//i)) {
    url = 'https://' + url;
  }

  // Abrir según disposición
  switch (disposition) {
    case 'currentTab':
      chrome.tabs.update({ url });
      break;
    case 'newForegroundTab':
      chrome.tabs.create({ url });
      break;
    case 'newBackgroundTab':
      chrome.tabs.create({ url, active: false });
      break;
  }
});

// ========================================
// AUTO-PINNING
// ========================================

async function checkAndPinTab(tab) {
  // Verificar que la URL sea válida
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url === '') {
    return;
  }

  const { autoPin, pinRules } = await chrome.storage.local.get(['autoPin', 'pinRules']);

  if (!autoPin || !pinRules || pinRules.length === 0) return;

  for (const rule of pinRules) {
    if (!rule.enabled) continue;

    let shouldPin = false;

    try {
      switch (rule.type) {
        case 'domain':
          const domain = new URL(tab.url).hostname;
          shouldPin = domain === rule.value || domain.endsWith('.' + rule.value);
          break;
        case 'pattern':
          shouldPin = tab.url.includes(rule.value);
          break;
        case 'exact':
          shouldPin = tab.url === rule.value;
          break;
      }

      if (shouldPin && !tab.pinned) {
        await chrome.tabs.update(tab.id, { pinned: true });
        console.log(`[BraveFlow] Tab pineada automáticamente: ${tab.url}`);
        break;
      }
    } catch (error) {
      console.error('[BraveFlow] Error al verificar regla de pinning:', error);
    }
  }
}

// Monitorear nuevas tabs
chrome.tabs.onCreated.addListener((tab) => {
  // La mayoría de las veces, la URL no está disponible en onCreated
  // Por eso confiamos más en onUpdated
  if (tab.url && tab.url !== 'chrome://newtab/' && !tab.url.startsWith('about:')) {
    checkAndPinTab(tab);
  }
});

// Monitorear actualizaciones de URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Verificar cuando cambia la URL o cuando la página termina de cargar
  if (changeInfo.url || (changeInfo.status === 'complete' && tab.url)) {
    checkAndPinTab(tab);
  }
});

// Aplicar reglas de pinning a todas las tabs abiertas
async function applyPinRulesToAllTabs() {
  const tabs = await chrome.tabs.query({});
  let pinnedCount = 0;

  for (const tab of tabs) {
    const wasPinned = tab.pinned;
    await checkAndPinTab(tab);

    // Verificar si se pineó
    const updatedTab = await chrome.tabs.get(tab.id);
    if (!wasPinned && updatedTab.pinned) {
      pinnedCount++;
    }
  }

  return pinnedCount;
}

// ========================================
// AGRUPACIÓN AUTOMÁTICA
// ========================================

async function autoGroupTabs() {
  const { autoGroup, groupRules } = await chrome.storage.local.get(['autoGroup', 'groupRules']);

  if (!autoGroup || !groupRules || groupRules.length === 0) {
    console.log('[BraveFlow] Auto-agrupación desactivada o sin reglas');
    return;
  }

  const tabs = await chrome.tabs.query({ currentWindow: true, pinned: false });
  const groupMap = new Map();

  console.log(`[BraveFlow] Intentando agrupar ${tabs.length} tabs`);

  for (const tab of tabs) {
    // Validar URL
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
      continue;
    }

    let grouped = false;

    for (const rule of groupRules) {
      if (!rule.enabled) continue;

      let matches = false;

      try {
        switch (rule.type) {
          case 'domain':
            const domain = new URL(tab.url).hostname;
            // Permitir coincidencia exacta o con subdominio
            matches = domain === rule.value || domain.endsWith('.' + rule.value);
            break;
          case 'pattern':
            matches = tab.url.includes(rule.value);
            break;
          case 'category':
            matches = rule.domains && rule.domains.some(d => {
              const tabDomain = new URL(tab.url).hostname;
              return tabDomain === d || tabDomain.endsWith('.' + d) || tab.url.includes(d);
            });
            break;
        }

        if (matches) {
          console.log(`[BraveFlow] Tab coincide con regla "${rule.name}": ${tab.url}`);
          if (!groupMap.has(rule.name)) {
            groupMap.set(rule.name, {
              tabs: [],
              color: rule.color || 'grey',
              name: rule.name
            });
          }
          groupMap.get(rule.name).tabs.push(tab.id);
          grouped = true;
          break;
        }
      } catch (error) {
        console.error('[BraveFlow] Error al verificar regla de agrupación:', error);
      }
    }
  }

  // Crear/actualizar grupos (incluso con 1 sola tab para testing)
  for (const [groupName, groupData] of groupMap) {
    if (groupData.tabs.length > 0) {
      try {
        const groupId = await chrome.tabs.group({ tabIds: groupData.tabs });
        await chrome.tabGroups.update(groupId, {
          title: groupData.name,
          color: groupData.color
        });
        console.log(`[BraveFlow] Grupo "${groupName}" creado con ${groupData.tabs.length} tab(s)`);
      } catch (error) {
        console.error(`[BraveFlow] Error al crear grupo "${groupName}":`, error);
      }
    }
  }
}

// ========================================
// GESTIÓN DE SESIONES
// ========================================

async function saveCurrentSession(name) {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const session = {
    name: name,
    timestamp: Date.now(),
    tabs: tabs.map(tab => ({
      url: tab.url,
      title: tab.title,
      pinned: tab.pinned,
      groupId: tab.groupId
    }))
  };

  const { sessions } = await chrome.storage.local.get(['sessions']);
  sessions[name] = session;
  await chrome.storage.local.set({ sessions });

  return session;
}

async function loadSession(sessionName) {
  const { sessions } = await chrome.storage.local.get(['sessions']);
  const session = sessions[sessionName];

  if (!session) {
    console.error('Sesión no encontrada:', sessionName);
    return;
  }

  // Crear nueva ventana con las tabs de la sesión
  const window = await chrome.windows.create({ focused: true });

  // Cerrar la tab vacía inicial
  const [emptyTab] = await chrome.tabs.query({ windowId: window.id });

  // Crear todas las tabs
  const createdTabs = [];
  for (const tabInfo of session.tabs) {
    const tab = await chrome.tabs.create({
      windowId: window.id,
      url: tabInfo.url,
      pinned: tabInfo.pinned,
      active: false
    });
    createdTabs.push(tab);
  }

  // Cerrar tab vacía
  if (emptyTab) {
    await chrome.tabs.remove(emptyTab.id);
  }

  // Activar primera tab
  if (createdTabs.length > 0) {
    await chrome.tabs.update(createdTabs[0].id, { active: true });
  }
}

// ========================================
// COMANDOS DE TECLADO
// ========================================

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case 'save-session':
      const timestamp = new Date().toLocaleString('es-ES');
      await saveCurrentSession(`Sesión ${timestamp}`);
      // Mostrar notificación
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Sesión Guardada',
        message: 'Tu sesión actual ha sido guardada'
      });
      break;

    case 'group-tabs':
      await autoGroupTabs();
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Tabs Agrupadas',
        message: 'Las tabs han sido agrupadas automáticamente'
      });
      break;

    case 'quick-clip':
      // Enviar mensaje a content script para crear clip
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, { action: 'createQuickClip' });
      break;
  }
});

// ========================================
// MENSAJES DESDE POPUP Y CONTENT SCRIPTS
// ========================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case 'saveSession':
          const session = await saveCurrentSession(request.name);
          sendResponse({ success: true, session });
          break;

        case 'loadSession':
          await loadSession(request.name);
          sendResponse({ success: true });
          break;

        case 'groupTabs':
          await autoGroupTabs();
          sendResponse({ success: true });
          break;

        case 'applyPinRules':
          const pinnedCount = await applyPinRulesToAllTabs();
          sendResponse({ success: true, count: pinnedCount });
          break;

        case 'saveClip':
          const { clips } = await chrome.storage.local.get(['clips']);
          clips.push({
            id: Date.now(),
            url: request.url,
            title: request.title,
            content: request.content,
            type: request.type,
            timestamp: Date.now()
          });
          await chrome.storage.local.set({ clips });
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Acción desconocida' });
      }
    } catch (error) {
      console.error('Error en background:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();

  return true; // Mantener canal abierto para respuesta asíncrona
});

console.log('BraveFlow background service worker iniciado');
