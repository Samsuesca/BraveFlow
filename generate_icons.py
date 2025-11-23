#!/usr/bin/env python3
"""
Script para generar iconos PNG para BraveFlow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_gradient_background(size):
    """Crea un fondo con gradiente de azul-morado"""
    image = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(image)

    # Colores del gradiente
    color_start = (102, 126, 234)  # #667eea
    color_end = (118, 75, 162)     # #764ba2

    for y in range(size):
        # Interpolar entre los colores
        ratio = y / size
        r = int(color_start[0] * (1 - ratio) + color_end[0] * ratio)
        g = int(color_start[1] * (1 - ratio) + color_end[1] * ratio)
        b = int(color_start[2] * (1 - ratio) + color_end[2] * ratio)

        draw.line([(0, y), (size, y)], fill=(r, g, b))

    return image

def add_text(image, text, size):
    """Añade texto centrado a la imagen"""
    draw = ImageDraw.Draw(image)

    # Calcular tamaño de fuente apropiado
    font_size = int(size * 0.4)

    font = None
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/SFNSDisplay.ttf",
    ]

    for font_path in font_paths:
        try:
            font = ImageFont.truetype(font_path, font_size)
            break
        except:
            continue

    if font is None:
        # Si no se encuentra ninguna fuente, dibujar manualmente
        # Solo para el icono de 16px
        return image

    # Obtener tamaño del texto
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # Calcular posición centrada
        x = (size - text_width) // 2
        y = (size - text_height) // 2 - int(size * 0.05)  # Ligeramente más arriba

        # Dibujar texto con sombra
        shadow_offset = max(1, size // 64)
        draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=(0, 0, 0, 128))
        draw.text((x, y), text, font=font, fill=(255, 255, 255))
    except:
        # Si falla, simplemente retornar la imagen sin texto
        pass

    return image

def add_lightning(image, size):
    """Añade un símbolo de rayo/flujo"""
    draw = ImageDraw.Draw(image)

    # Escalar el rayo según el tamaño
    scale = size / 128

    # Coordenadas del rayo (escaladas)
    lightning = [
        (int(70 * scale), int(30 * scale)),
        (int(50 * scale), int(60 * scale)),
        (int(62 * scale), int(60 * scale)),
        (int(55 * scale), int(90 * scale)),
        (int(75 * scale), int(58 * scale)),
        (int(63 * scale), int(58 * scale))
    ]

    # Dibujar rayo con sombra
    shadow_offset = max(1, int(2 * scale))
    shadow_lightning = [(x + shadow_offset, y + shadow_offset) for x, y in lightning]
    draw.polygon(shadow_lightning, fill=(0, 0, 0, 64))
    draw.polygon(lightning, fill=(255, 255, 255))

    return image

def create_icon(size, include_details=True):
    """Crea un icono del tamaño especificado"""
    # Crear fondo con gradiente
    image = create_gradient_background(size)

    # Para iconos grandes, añadir rayo
    if include_details and size >= 48:
        image = add_lightning(image, size)

    # Para iconos muy pequeños, solo el gradiente con letras
    if size <= 32:
        image = add_text(image, "BF", size)

    return image

def main():
    """Generar los 3 iconos necesarios"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(script_dir, 'icons')

    # Asegurar que existe el directorio
    os.makedirs(icons_dir, exist_ok=True)

    # Generar iconos
    sizes = [
        (16, False),   # Pequeño, sin detalles
        (48, True),    # Mediano, con detalles
        (128, True)    # Grande, con detalles
    ]

    for size, details in sizes:
        print(f"Generando icon{size}.png...")
        icon = create_icon(size, details)
        icon_path = os.path.join(icons_dir, f'icon{size}.png')
        icon.save(icon_path, 'PNG')
        print(f"✓ Guardado: {icon_path}")

    print("\n¡Iconos generados exitosamente!")
    print("Los iconos están en la carpeta 'icons/'")

if __name__ == '__main__':
    main()
