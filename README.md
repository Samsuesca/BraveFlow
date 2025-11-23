# 🚀 BraveFlow - Automatización de Navegador

<div align="center">

**Automatiza tu navegador y multiplica tu productividad**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/angelsamuelsuescarios/BraveFlow)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Brave](https://img.shields.io/badge/Brave-Compatible-orange.svg)](https://brave.com)
[![Chrome](https://img.shields.io/badge/Chrome-Compatible-yellow.svg)](https://www.google.com/chrome/)

</div>

---

## 📖 Tabla de Contenidos

- [Características](#-características-principales)
- [Instalación](#-instalación)
- [Guía de Uso](#-guía-de-uso)
- [Atajos de Teclado](#️-atajos-de-teclado)
- [Documentación](#-documentación)
- [Compatibilidad](#-compatibilidad)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎯 ¿Qué es BraveFlow?

BraveFlow es una extensión poderosa para Brave (y navegadores Chromium) que automatiza y optimiza tu flujo de trabajo con funcionalidades avanzadas de gestión de tabs, marcadores, y más.

**Características destacadas:**
- ⚡ **Tolinks**: Aliases para URLs largas (escribe `go gmail` en vez de la URL completa)
- 📌 **Auto-Pin**: Pinea tabs automáticamente según reglas
- 📁 **Auto-Group**: Agrupa tabs por categorías con colores
- 💾 **Sesiones**: Guarda y restaura sets completos de tabs
- 📋 **Clips**: Captura texto de páginas web
- ✏️ **Edición completa**: Edita tolinks, reglas, sesiones y tabs

## ✨ Características Principales

### 🔗 Tolinks (Aliases de URLs)
- Crea shortcuts personalizados para URLs largas
- Escribe `go [alias]` en la barra de direcciones para navegar instantáneamente
- Ejemplo: `go emaileconcept` → `https://mail.google.com/mail/u/0/#label/ECONCEPT/FMfcgzQcqHWDhWhFGJbVCLSdnWDXnptC`

### 📌 Auto-Pinning Inteligente
- Automáticamente pinea tabs según reglas personalizables
- Configura reglas por:
  - Dominio específico (ej: `gmail.com`)
  - Patrón de URL (ej: `dashboard`)
  - URL exacta
- Las tabs se pinean automáticamente al abrirse

### 📁 Agrupación Automática de Tabs
- Agrupa tabs automáticamente por categoría, dominio o patrón
- Asigna colores y nombres personalizados a cada grupo
- Múltiples estrategias de agrupación:
  - Por dominio (todas las tabs de YouTube juntas)
  - Por categoría (Google Apps, Dev Tools, etc.)
  - Por patrón de URL

### 💾 Plantillas de Sesiones
- Guarda conjuntos completos de tabs como plantillas
- Crea "Modos" de trabajo: Trabajo, Estudio, Casual, etc.
- Restaura sesiones completas con un click
- Abre sesiones en ventanas nuevas

### 📋 Sistema de Clips
- Guarda fragmentos de texto de cualquier página web
- Selecciona texto y presiona `Cmd/Ctrl + Shift + C`
- O usa el menú contextual que aparece al seleccionar texto
- Accede a todos tus clips guardados desde el popup

### ⚡ Acciones Rápidas
- Atajos de teclado personalizables
- Comandos desde el popup para operaciones comunes
- Integración fluida con el flujo de trabajo

## 📦 Instalación

### Paso 1: Preparar los iconos

Antes de cargar la extensión, necesitas crear los iconos. Tienes dos opciones:

**Opción A: Usar un generador online**
1. Ve a [https://www.favicon-generator.org/](https://www.favicon-generator.org/)
2. Sube una imagen o crea un icono simple (puede ser solo texto "BF" con fondo morado/azul)
3. Descarga los tamaños: 16x16, 48x48, 128x128
4. Renombra los archivos a `icon16.png`, `icon48.png`, `icon128.png`
5. Colócalos en la carpeta `BraveFlow/icons/`

**Opción B: Usar iconos temporales**
Por ahora puedes usar iconos simples de colores. La extensión funcionará perfectamente.

### Paso 2: Cargar la extensión en Brave

1. Abre Brave
2. Ve a `brave://extensions/`
3. Activa el "Modo de desarrollador" (toggle en la esquina superior derecha)
4. Haz click en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `BraveFlow`
6. ¡Listo! La extensión ya está instalada

## 🎯 Guía de Uso

### Configurar Tolinks

1. Haz click en el icono de BraveFlow en la barra de herramientas
2. Ve a la pestaña "Tolinks"
3. Ingresa un alias (ej: `gmail`) y la URL completa
4. Haz click en "+"
5. Ahora escribe `go gmail` en la barra de direcciones

**Ejemplos útiles:**
```
meet → https://meet.google.com/
drive → https://drive.google.com/
cal → https://calendar.google.com/
```

### Configurar Auto-Pinning

1. Haz click en el icono de BraveFlow
2. Haz click en "Configuración Avanzada" (al final)
3. En la sección "Auto-Pinning":
   - Activa el toggle si no está activado
   - Selecciona el tipo de regla
   - Ingresa el valor (ej: `gmail.com`)
   - Haz click en "Agregar Regla"

**Reglas recomendadas:**
- Dominio: `gmail.com` (para Gmail)
- Dominio: `calendar.google.com` (para Calendar)
- Patrón: `dashboard` (para cualquier dashboard)

### Configurar Agrupación Automática

1. En Configuración Avanzada
2. Sección "Agrupación Automática"
3. Ingresa:
   - Nombre del grupo (ej: "Google Apps")
   - Tipo: "Categoría"
   - Valor: `gmail.com,drive.google.com,calendar.google.com`
   - Color: Azul
4. Haz click en "Agregar Regla"

Luego, presiona `Cmd/Ctrl + Shift + G` para agrupar todas las tabs abiertas.

### Crear Plantillas de Sesiones

1. Abre todas las tabs que quieres en tu sesión/modo
2. Abre el popup de BraveFlow
3. Ve a la pestaña "Sesiones"
4. Ingresa un nombre (ej: "Modo Trabajo")
5. Haz click en "Guardar Actual"

Para cargar una sesión:
1. Abre el popup
2. Ve a "Sesiones"
3. Haz click en el botón 🚀 de la sesión que quieres abrir
4. Se abrirá una nueva ventana con todas las tabs

### Guardar Clips

**Método 1: Atajo de teclado**
1. Selecciona texto en cualquier página
2. Presiona `Cmd/Ctrl + Shift + C`

**Método 2: Menú contextual**
1. Selecciona texto
2. Haz click en el botón "📋 Guardar Clip" que aparece

Ver tus clips:
1. Abre el popup de BraveFlow
2. Ve a la pestaña "Clips"
3. Puedes copiar, abrir la URL original, o eliminar clips

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Cmd/Ctrl + Shift + S` | Guardar sesión actual |
| `Cmd/Ctrl + Shift + C` | Crear clip del texto seleccionado |
| `Cmd/Ctrl + Shift + G` | Agrupar tabs automáticamente |
| `go [alias]` en barra | Navegar usando tolink |

Puedes personalizar estos atajos en `brave://extensions/shortcuts`

## 🎨 Personalización

### Colores de Grupos

Colores disponibles para grupos de tabs:
- Gris, Azul, Rojo, Amarillo, Verde, Rosa, Púrpura, Cian, Naranja

### Reglas Avanzadas

**Auto-Pinning:**
- Puedes activar/desactivar reglas individuales sin eliminarlas
- Las reglas se evalúan en orden
- La primera regla que coincida se aplicará

**Agrupación:**
- Tipo "Categoría" permite múltiples dominios separados por comas
- Tipo "Patrón" busca en cualquier parte de la URL
- Tipo "Dominio" solo coincide con el dominio exacto

## 💾 Backup y Restauración

### Exportar Datos
1. Configuración Avanzada → "Gestión de Datos"
2. Haz click en "📤 Exportar Todo"
3. Se descargará un archivo JSON con todos tus datos

### Importar Datos
1. Configuración Avanzada → "Gestión de Datos"
2. Haz click en "📥 Importar"
3. Selecciona el archivo JSON previamente exportado

**⚠️ Importante:** La importación sobrescribirá tus datos actuales.

## 🔧 Solución de Problemas

### Los tolinks no funcionan
- Verifica que escribes exactamente `go [alias]` en la barra de direcciones
- Asegúrate de que el alias existe en la lista de tolinks

### Las tabs no se pinean automáticamente
- Verifica que Auto-Pinning esté activado (toggle verde)
- Revisa que las reglas estén habilitadas (toggle verde en cada regla)
- Las reglas solo aplican a tabs nuevas o al actualizar la URL

### Las tabs no se agrupan
- Presiona manualmente `Cmd/Ctrl + Shift + G` para forzar agrupación
- Verifica que Auto-Agrupación esté activada
- Revisa que las reglas coincidan con las URLs de tus tabs

### La extensión no aparece
- Ve a `brave://extensions/`
- Asegúrate de que BraveFlow esté activada
- Intenta recargar la extensión (botón de refrescar)

## 📊 Estadísticas

En el popup, pestaña "Acciones", puedes ver:
- Número de tolinks configurados
- Número de sesiones guardadas
- Número de clips guardados

En Configuración Avanzada también se muestran:
- Reglas de pinning
- Reglas de agrupación

## 🚀 Consejos de Productividad

1. **Crea sesiones temáticas:** "Modo Trabajo", "Modo Estudio", "Modo Casual"
2. **Usa tolinks para URLs largas:** Especialmente útil para enlaces de Gmail con etiquetas específicas
3. **Pinea tus herramientas esenciales:** Gmail, Calendar, Slack, etc.
4. **Agrupa por proyecto:** Crea reglas de agrupación por proyecto o cliente
5. **Guarda clips de investigación:** Usa clips para guardar información importante mientras navegas

## 🤝 Compatibilidad

Esta extensión funciona en:
- ✅ Brave Browser
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Cualquier navegador basado en Chromium

## 📝 Estructura del Proyecto

```
BraveFlow/
├── manifest.json           # Configuración de la extensión
├── js/
│   ├── background.js      # Lógica principal (tolinks, auto-pin, etc.)
│   ├── content.js         # Script para interactuar con páginas
│   ├── popup.js           # Lógica del popup
│   └── options.js         # Lógica de configuración
├── css/
│   ├── popup.css          # Estilos del popup
│   └── options.css        # Estilos de configuración
├── pages/
│   ├── popup.html         # Interfaz del popup
│   └── options.html       # Interfaz de configuración
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## 🤝 Contribuir

¿Quieres mejorar BraveFlow? ¡Las contribuciones son bienvenidas!

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Ideas para contribuir:
- 🐛 Reportar bugs
- 💡 Sugerir nuevas funcionalidades
- 📝 Mejorar la documentación
- 🎨 Mejorar el diseño de la interfaz
- 🌍 Agregar traducciones

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Créditos

Desarrollado con ❤️ por [Angel Samuel Suescarios](https://github.com/angelsamuelsuescarios)

Creado con la ayuda de Claude Code (Anthropic)

## 📮 Contacto

¿Preguntas? ¿Sugerencias? ¿Bugs?

- GitHub Issues: [Reportar un problema](https://github.com/angelsamuelsuescarios/BraveFlow/issues)
- GitHub Discussions: [Iniciar una discusión](https://github.com/angelsamuelsuescarios/BraveFlow/discussions)

---

<div align="center">

**🚀 BraveFlow v1.0.0**

Hecho con ❤️ para multiplicar tu productividad

[⭐ Star en GitHub](https://github.com/angelsamuelsuescarios/BraveFlow) • [🐛 Reportar Bug](https://github.com/angelsamuelsuescarios/BraveFlow/issues) • [💡 Solicitar Feature](https://github.com/angelsamuelsuescarios/BraveFlow/issues)

</div>
