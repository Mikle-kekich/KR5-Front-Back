// colorGenerator.js - Функции генерации гармоничных цветов

/**
 * Генерирует случайный HEX цвет
 */
export function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

/**
 * Генерирует палитру случайных гармоничных цветов
 * @param {number} count - количество цветов в палитре
 * @returns {string[]} массив HEX цветов
 */
export function generatePalette(count = 5) {
  const colors = [];
  const baseHue = Math.random() * 360;
  const saturation = 70 + Math.random() * 20;
  const lightness = 50 + Math.random() * 15;

  for (let i = 0; i < count; i++) {
    const hue = (baseHue + (i * (360 / count))) % 360;
    const color = hslToHex(hue, saturation, lightness);
    colors.push(color);
  }

  return colors;
}

/**
 * Генерирует дополнительный цвет (complementary)
 * @param {string} hex - HEX цвет
 * @returns {string} дополнительный HEX цвет
 */
export function getComplementaryColor(hex) {
  const [h, s, l] = hexToHsl(hex);
  const complementaryHue = (h + 180) % 360;
  return hslToHex(complementaryHue, s, l);
}

/**
 * Преобразование HSL в HEX
 * @param {number} h - hue (0-360)
 * @param {number} s - saturation (0-100)
 * @param {number} l - lightness (0-100)
 * @returns {string} HEX цвет
 */
export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0').toUpperCase()).join('');
}

/**
 * Преобразование HEX в HSL
 * @param {string} hex - HEX цвет
 * @returns {number[]} массив [h, s, l]
 */
export function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [h * 360, s * 100, l * 100];
}