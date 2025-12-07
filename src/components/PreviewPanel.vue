<template>
  <div class="preview-section">
    <h2 class="preview-title">📱 Превью палитры в интерфейсе</h2>
    
    <div class="theme-toggle">
      <button 
        :class="['theme-btn', { active: theme === 'light' }]"
        @click="theme = 'light'"
      >
        ☀️ Светлая тема
      </button>
      <button 
        :class="['theme-btn', { active: theme === 'dark' }]"
        @click="theme = 'dark'"
      >
        🌙 Тёмная тема
      </button>
    </div>

    <div class="preview-grid">
      <!-- Кнопки -->
      <div :class="['preview-card', theme]">
        <h3 class="preview-heading" :style="{ color: colors[0] }">Кнопки</h3>
        <button 
          class="preview-button"
          :style="{ 
            backgroundColor: colors[0],
            color: getContrastColor(colors[0])
          }"
        >
          Основная кнопка
        </button>
        <button 
          class="preview-button"
          :style="{ 
            backgroundColor: colors[1],
            color: getContrastColor(colors[1]),
            marginTop: '10px'
          }"
        >
          Дополнительная кнопка
        </button>
      </div>

      <!-- Карточка -->
      <div 
        :class="['preview-card', theme]"
        :style="{ borderLeftColor: colors[2], borderLeftWidth: '4px' }"
      >
        <h3 class="preview-heading" :style="{ color: colors[2] }">Карточка</h3>
        <p class="preview-text">Это пример карточки с использованием палитры цветов. Цвета применены к заголовку и граням карточки.</p>
      </div>

      <!-- Теги/Labels -->
      <div :class="['preview-card', theme]">
        <h3 class="preview-heading">Теги и бейджи</h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span 
            v-for="(color, index) in colors"
            :key="index"
            :style="{ 
              backgroundColor: color,
              color: getContrastColor(color),
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }"
          >
            Tag {{ index + 1 }}
          </span>
        </div>
      </div>

      <!-- Прогресс-бар -->
      <div :class="['preview-card', theme]">
        <h3 class="preview-heading">Прогресс</h3>
        <div style="display: flex; gap: 4px;">
          <div 
            v-for="(color, index) in colors"
            :key="index"
            :style="{ 
              flex: 1,
              height: '8px',
              backgroundColor: color,
              borderRadius: '4px'
            }"
          />
        </div>
      </div>

      <!-- Текстовые уровни -->
      <div :class="['preview-card', theme]">
        <h3 class="preview-heading" :style="{ color: colors[0] }">Иерархия текста</h3>
        <p :style="{ color: colors[0], fontWeight: '700', marginBottom: '8px' }">Основной заголовок</p>
        <p :style="{ color: colors[1], fontWeight: '600', marginBottom: '8px' }">Вторичный заголовок</p>
        <p :style="{ color: colors[2], marginBottom: '8px' }">Основной текст</p>
        <p :style="{ color: colors[3], fontSize: '0.9rem' }">Дополнительный текст</p>
      </div>

      <!-- Акценты -->
      <div :class="['preview-card', theme]">
        <h3 class="preview-heading">Акцентные элементы</h3>
        <div 
          :style="{ 
            backgroundColor: colors[4],
            color: getContrastColor(colors[4]),
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '10px'
          }"
        >
          ⚡ Акцентный блок
        </div>
        <div 
          :style="{ 
            borderLeft: `4px solid ${colors[5] || colors[0]}`,
            paddingLeft: '15px',
            fontSize: '0.95rem'
          }"
        >
          Блок с левым акцентом
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getContrastColor } from '../utils/colorConverter';

const props = defineProps({
  colors: {
    type: Array,
    required: true
  }
});

const theme = ref('light');

const computedTheme = computed(() => {
  return theme.value === 'dark' 
    ? { background: '#1a1a1a', color: '#fff' }
    : { background: '#f5f5f5', color: '#333' };
});
</script>

<style scoped>
.preview-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 2px solid #eee;
}

.preview-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.theme-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.theme-btn {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.theme-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.preview-card {
  border-radius: 8px;
  padding: 20px;
  border: 2px solid #ddd;
  transition: all 0.3s ease;
}

.preview-card.light {
  background: #f5f5f5;
  color: #333;
}

.preview-card.dark {
  background: #1a1a1a;
  color: #fff;
  border-color: #333;
}

.preview-heading {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.preview-text {
  margin-bottom: 15px;
  line-height: 1.6;
}

.preview-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
