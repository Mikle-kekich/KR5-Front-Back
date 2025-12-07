// storageManager.js - Работа с localStorage

const STORAGE_KEY = 'colorPalette';

/**
 * Сохранить палитру в localStorage
 * @param {string[]} colors - массив HEX цветов
 * @param {object} settings - настройки (количество цветов, формат и т.д.)
 */
export function savePalette(colors, settings = {}) {
  const data = {
    colors,
    settings,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Загрузить палитру из localStorage
 * @returns {object|null} объект {colors, settings} или null
 */
export function loadPalette() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Ошибка при загрузке палитры:', e);
    return null;
  }
}

/**
 * Очистить localStorage
 */
export function clearPalette() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Сохранить закреплённые цвета
 * @param {string[]} colors - массив HEX цветов
 */
export function savePinnedColors(colors) {
  localStorage.setItem('pinnedColors', JSON.stringify(colors));
}

/**
 * Загрузить закреплённые цвета
 * @returns {string[]} массив HEX цветов
 */
export function loadPinnedColors() {
  const data = localStorage.getItem('pinnedColors');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Ошибка при загрузке закреплённых цветов:', e);
    return [];
  }
}