// colorWheelUtils.js - Утилиты для работы с цветовым кругом

/**
 * Генерирует комплементарный цвет (противоположный на круге)
 * @param {number} hue - hue (0-360)
 * @returns {number} комплементарный hue
 */
export function getComplementary(hue) {
  return (hue + 180) % 360;
}

/**
 * Генерирует аналогичные цвета (рядом на круге)
 * @param {number} hue - базовый hue (0-360)
 * @param {number} offset - смещение в градусах (обычно 30-60)
 * @returns {number[]} массив hue значений
 */
export function getAnalogous(hue, offset = 30) {
  return [
    (hue - offset + 360) % 360,
    hue,
    (hue + offset) % 360
  ];
}

/**
 * Генерирует триадные цвета (равномерно на 120 градусов)
 * @param {number} hue - базовый hue (0-360)
 * @returns {number[]} массив 3 hue значений
 */
export function getTriadic(hue) {
  return [
    hue,
    (hue + 120) % 360,
    (hue + 240) % 360
  ];
}

/**
 * Генерирует тетрадные цвета (квадрат на круге)
 * @param {number} hue - базовый hue (0-360)
 * @returns {number[]} массив 4 hue значений
 */
export function getTetradic(hue) {
  return [
    hue,
    (hue + 90) % 360,
    (hue + 180) % 360,
    (hue + 270) % 360
  ];
}

/**
 * Генерирует шестиугольные цвета (гексада)
 * @param {number} hue - базовый hue (0-360)
 * @returns {number[]} массив 6 hue значений
 */
export function getSplitComplementary(hue) {
  return [
    hue,
    (hue + 150) % 360,
    (hue + 210) % 360
  ];
}

/**
 * Генерирует оттенки одного цвета (монохромная палитра)
 * @param {number} hue - hue (0-360)
 * @param {number} saturation - насыщенность (0-100)
 * @returns {object[]} массив {hue, saturation, lightness}
 */
export function getMonochromatic(hue, saturation = 70) {
  return [
    { hue, saturation, lightness: 20 },
    { hue, saturation, lightness: 35 },
    { hue, saturation, lightness: 50 },
    { hue, saturation, lightness: 65 },
    { hue, saturation, lightness: 80 }
  ];
}

/**
 * Получить цветовую схему по типу
 * @param {number} hue - базовый hue
 * @param {string} schemeType - тип схемы: 'complementary', 'analogous', 'triadic', 'tetradic', 'splitComplementary'
 * @returns {number[]} массив hue значений
 */
export function getColorScheme(hue, schemeType = 'complementary') {
  switch (schemeType) {
    case 'analogous':
      return getAnalogous(hue);
    case 'triadic':
      return getTriadic(hue);
    case 'tetradic':
      return getTetradic(hue);
    case 'splitComplementary':
      return getSplitComplementary(hue);
    case 'complementary':
    default:
      return [hue, getComplementary(hue)];
  }
}

/**
 * Получить название схемы на русском
 * @param {string} schemeType - тип схемы
 * @returns {string} название
 */
export function getSchemeTypeName(schemeType) {
  const names = {
    'complementary': 'Комплементарная',
    'analogous': 'Аналогичная',
    'triadic': 'Триадная',
    'tetradic': 'Тетрадная',
    'splitComplementary': 'Расщеплённо-комплементарная',
    'monochromatic': 'Монохромная'
  };
  return names[schemeType] || schemeType;
}

/**
 * Получить тон цвета (тёплый/холодный)
 * @param {number} hue - hue (0-360)
 * @returns {string} 'тёплый' или 'холодный'
 */
export function getColorTone(hue) {
  // 0-60: красный (тёплый)
  // 60-180: жёлто-зелёный (тёплый до нейтрального)
  // 180-300: синий (холодный)
  // 300-360: розовый (тёплый)
  if (hue < 60 || hue >= 300) return 'тёплый';
  if (hue >= 180 && hue < 300) return 'холодный';
  return 'нейтральный';
}

/**
 * Получить название цвета по hue
 * @param {number} hue - hue (0-360)
 * @returns {string} название цвета
 */
export function getHueName(hue) {
  const names = [
    'Красный',
    'Оранжевый',
    'Жёлтый',
    'Жёлто-зелёный',
    'Зелёный',
    'Голубой',
    'Синий',
    'Фиолетовый',
    'Пурпурный',
    'Розовый'
  ];
  
  const index = Math.round(hue / 36) % 10;
  return names[index];
}