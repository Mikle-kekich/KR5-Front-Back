// colorConverter.js - Преобразование цветов

/**
 * Преобразование HEX в RGB
 * @param {string} hex - HEX цвет (например, #FF6B6B)
 * @returns {string} RGB строка (например, rgb(255, 107, 107))
 */
export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Преобразование RGB в HEX
 * @param {number} r - красный канал (0-255)
 * @param {number} g - зелёный канал (0-255)
 * @param {number} b - синий канал (0-255)
 * @returns {string} HEX цвет
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0').toUpperCase()).join('');
}

/**
 * Получить RGB значения из HEX
 * @param {string} hex - HEX цвет
 * @returns {object} объект {r, g, b}
 */
export function getRgbValues(hex) {
  // защита от undefined / пустых строк / некорректного формата
  if (!hex || typeof hex !== 'string' || !/^#[0-9A-F]{6}$/i.test(hex)) {
    // вернём чёрный по умолчанию
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}


/**
 * Расчет яркости цвета (для определения контраста)
 * @param {string} hex - HEX цвет
 * @returns {number} значение яркости (0-255)
 */
export function getLuminance(hex) {
  const { r, g, b } = getRgbValues(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b);
}

/**
 * Получить контрастный цвет (черный или белый)
 * @param {string} hex - HEX цвет
 * @returns {string} #000000 или #FFFFFF
 */
export function getContrastColor(hex) {
  return getLuminance(hex) > 128 ? '#000000' : '#FFFFFF';
}

/**
 * Валидация HEX цвета
 * @param {string} hex - HEX строка
 * @returns {boolean} валидный ли цвет
 */
export function isValidHex(hex) {
  return /^#[0-9A-F]{6}$/i.test(hex);
}