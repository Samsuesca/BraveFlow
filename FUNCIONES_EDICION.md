# ✏️ Funciones de Edición - BraveFlow

## ✅ Nuevas Funcionalidades Agregadas

He agregado edición completa para todas las secciones de BraveFlow. Ahora puedes **editar** cualquier elemento después de crearlo.

---

## 📝 Cómo Editar

### 1. **Tolinks** (Popup → Pestaña "Tolinks")

**Botón:** ✏️ junto a cada tolink

**Se puede editar:**
- Alias (nombre del shortcut)
- URL completa

**Cómo usar:**
1. Click en ✏️ junto al tolink que quieres editar
2. Los campos se convierten en inputs editables
3. Modifica el alias o la URL
4. Click en ✓ (verde) para guardar o ✕ (rojo) para cancelar
5. También puedes presionar **Enter** para guardar o **Escape** para cancelar

**Ejemplo:**
```
Antes:  gmail → https://mail.google.com
Editar: ✏️
        [gmail] [https://mail.google.com]
        ✓ ✕
Después: work-email → https://mail.google.com/mail/u/1
```

---

### 2. **Sesiones** (Popup → Pestaña "Sesiones")

**Botón:** ✏️ junto a cada sesión

**Se puede editar:**
- Nombre de la sesión

**Cómo usar:**
1. Click en ✏️ junto a la sesión
2. El nombre se convierte en input editable
3. Escribe el nuevo nombre
4. Click en ✓ para guardar o ✕ para cancelar
5. **Enter** guarda, **Escape** cancela

**Ejemplo:**
```
Antes:  Sesión 23/11/2025, 15:30
        8 tabs
Editar: ✏️
        [Modo Trabajo - Cliente X]
        ✓ ✕
Después: Modo Trabajo - Cliente X
         8 tabs
```

---

### 3. **Reglas de Auto-Pin** (Configuración Avanzada)

**Botón:** ✏️ junto a cada regla

**Se puede editar:**
- Tipo de regla (Dominio / Patrón / Exacta)
- Valor de la regla

**Cómo usar:**
1. Abre Configuración Avanzada
2. Sección "Auto-Pinning de Tabs"
3. Click en ✏️ junto a la regla que quieres editar
4. Aparecen un selector y un input
5. Cambia el tipo o el valor
6. Click en ✓ para guardar o ✕ para cancelar
7. **Enter** guarda, **Escape** cancela

**Ejemplo:**
```
Antes:  DOMINIO
        mail.google.com
Editar: ✏️
        [Dominio ▼] [gmail.com]
        ✓ ✕
Después: DOMINIO
         gmail.com
```

---

### 4. **Reglas de Agrupación** (Configuración Avanzada)

**Botón:** ✏️ junto a cada regla

**Se puede editar:**
- Nombre del grupo
- Tipo (Dominio / Patrón / Categoría)
- Valor o dominios
- Color del grupo

**Cómo usar:**
1. Abre Configuración Avanzada
2. Sección "Agrupación Automática"
3. Click en ✏️ junto a la regla
4. Aparecen 4 inputs: nombre, tipo, valor, color
5. Modifica lo que necesites
6. Click en ✓ para guardar o ✕ para cancelar
7. **Enter** guarda, **Escape** cancela

**Ejemplo:**
```
Antes:  YouTube
        🔵 Dominio: youtube.com
Editar: ✏️
        [Videos] [Dominio ▼] [youtube.com] [Rojo ▼]
        ✓ ✕
Después: Videos
         🔴 Dominio: youtube.com
```

---

## ⌨️ Atajos de Teclado (durante edición)

| Tecla | Acción |
|-------|--------|
| **Enter** | Guardar cambios ✓ |
| **Escape** | Cancelar y volver ✕ |
| **Tab** | Navegar entre campos (en reglas) |

---

## 🎨 Indicadores Visuales

Cuando estás editando:
- **Inputs con borde azul** → Modo edición activo
- **Botón ✓ verde** → Guardar cambios
- **Botón ✕ rojo** → Cancelar edición
- **Focus automático** → El campo se selecciona para editar

---

## 💡 Consejos

### Tolinks:
- Si cambias el alias, el viejo alias se eliminará automáticamente
- Puedes usar el mismo URL con diferentes aliases

### Sesiones:
- Solo puedes editar el nombre, no las tabs dentro
- Para modificar tabs de una sesión, abre la sesión, haz cambios y guarda una nueva

### Reglas de Auto-Pin:
- Recuerda: sin `https://`, solo el dominio (ej: `gmail.com`)
- Cambia de "Dominio" a "Patrón" si quieres buscar en la URL completa

### Reglas de Agrupación:
- Para categorías, separa dominios con comas: `gmail.com,drive.google.com`
- Los colores se aplican inmediatamente al guardar
- Puedes cambiar el nombre sin afectar qué tabs se agrupan

---

## 🔄 Cómo Probar

1. **Recarga la extensión:** `brave://extensions/` → Click en 🔄 Recargar
2. **Abre el popup** o **Configuración Avanzada**
3. **Click en ✏️** junto a cualquier elemento
4. **Edita** y presiona **Enter** o click en ✓
5. **Verás los cambios** inmediatamente

---

## 🐛 Solución de Problemas

**Los botones ✏️ no aparecen:**
- Recarga la extensión en `brave://extensions/`
- Cierra y abre el popup nuevamente

**Los cambios no se guardan:**
- Asegúrate de hacer click en ✓ o presionar Enter
- Si cancelas (✕ o Escape), los cambios se descartan

**El input no se ve bien:**
- Los estilos están optimizados para el tamaño normal del popup
- Si algo se ve cortado, intenta hacer el popup más grande

---

¡Disfruta de la edición completa en BraveFlow! 🚀
