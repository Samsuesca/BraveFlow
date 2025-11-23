// ========================================
// BRAVEFLOW - Content Script
// ========================================

// Escuchar mensajes desde background y popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'createQuickClip':
      createQuickClip();
      sendResponse({ success: true });
      break;

    case 'getSelection':
      const selection = window.getSelection().toString();
      sendResponse({ selection });
      break;
  }
  return true;
});

// ========================================
// SISTEMA DE CLIPS RÁPIDOS
// ========================================

function createQuickClip() {
  const selection = window.getSelection().toString().trim();

  if (!selection) {
    showNotification('Selecciona texto primero', 'warning');
    return;
  }

  // Guardar clip
  chrome.runtime.sendMessage({
    action: 'saveClip',
    url: window.location.href,
    title: document.title,
    content: selection,
    type: 'text'
  }, (response) => {
    if (response && response.success) {
      showNotification('Clip guardado correctamente', 'success');
    } else {
      showNotification('Error al guardar clip', 'error');
    }
  });
}

// ========================================
// NOTIFICACIONES EN PÁGINA
// ========================================

function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `braveflow-notification braveflow-${type}`;
  notification.textContent = message;

  // Estilos inline para evitar conflictos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999999;
    animation: braveflow-slide-in 0.3s ease;
  `;

  // Añadir animación
  if (!document.getElementById('braveflow-animations')) {
    const style = document.createElement('style');
    style.id = 'braveflow-animations';
    style.textContent = `
      @keyframes braveflow-slide-in {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes braveflow-slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'braveflow-slide-out 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ========================================
// MENÚ CONTEXTUAL PARA SELECCIÓN
// ========================================

let contextMenu = null;

document.addEventListener('mouseup', (e) => {
  // Remover menú existente
  if (contextMenu) {
    contextMenu.remove();
    contextMenu = null;
  }

  const selection = window.getSelection().toString().trim();

  if (!selection || selection.length < 3) return;

  // Crear menú contextual
  setTimeout(() => {
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    contextMenu = document.createElement('div');
    contextMenu.className = 'braveflow-context-menu';
    contextMenu.innerHTML = `
      <button class="braveflow-btn-clip" title="Guardar como clip">
        📋 Guardar Clip
      </button>
    `;

    contextMenu.style.cssText = `
      position: absolute;
      top: ${window.scrollY + rect.top - 40}px;
      left: ${window.scrollX + rect.left}px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    const btn = contextMenu.querySelector('.braveflow-btn-clip');
    btn.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    `;

    btn.addEventListener('click', () => {
      createQuickClip();
      contextMenu.remove();
      contextMenu = null;
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#2563eb';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#3b82f6';
    });

    document.body.appendChild(contextMenu);
  }, 10);
});

// Remover menú al hacer click fuera
document.addEventListener('mousedown', (e) => {
  if (contextMenu && !contextMenu.contains(e.target)) {
    contextMenu.remove();
    contextMenu = null;
  }
});

console.log('BraveFlow content script cargado');
