# Generación de Iconos para BraveFlow

## Opción 1: Usar generador online (MÁS FÁCIL)

1. Ve a [https://www.favicon-generator.org/](https://www.favicon-generator.org/)
2. Sube el archivo `icon.svg` de esta carpeta
3. Descarga los PNG generados en tamaños 16x16, 48x48, 128x128
4. Renombra los archivos a:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
5. Colócalos en esta carpeta (`BraveFlow/icons/`)

## Opción 2: Usar una herramienta de diseño

### Con Figma (gratis)
1. Importa `icon.svg` en Figma
2. Exporta como PNG en los tamaños: 16x16, 48x48, 128x128
3. Guarda con los nombres correctos

### Con Photoshop/GIMP
1. Abre `icon.svg`
2. Exporta en los 3 tamaños necesarios
3. Guarda con los nombres correctos

### Con Inkscape (gratis)
1. Abre `icon.svg`
2. Archivo → Exportar PNG
3. Cambia el tamaño y exporta 3 veces

## Opción 3: Usar ImageMagick (línea de comandos)

Si tienes ImageMagick instalado:

```bash
# Instalar ImageMagick (si no lo tienes)
# macOS:
brew install imagemagick

# Generar iconos
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

## Opción 4: Usar un icono temporal simple

Mientras generas los iconos, puedes usar cualquier imagen PNG cuadrada:
1. Encuentra cualquier imagen PNG cuadrada
2. Renómbrala como `icon16.png`, `icon48.png`, `icon128.png`
3. La extensión funcionará igual

## Verificación

Asegúrate de tener estos archivos en `BraveFlow/icons/`:
- ✅ icon16.png (16x16 píxeles)
- ✅ icon48.png (48x48 píxeles)
- ✅ icon128.png (128x128 píxeles)

Una vez que tengas los 3 archivos PNG, recarga la extensión en `brave://extensions/`
