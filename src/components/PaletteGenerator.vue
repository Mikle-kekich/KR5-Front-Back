<template>
  <div class="palette-generator">
    <div class="header">
      <h1>🎨 Генератор цветовых палитр</h1>
      <p>Создавайте гармоничные цветовые схемы для ваших проектов</p>
    </div>

    <div class="tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'generator' }]"
        @click="activeTab = 'generator'"
      >
        📊 Генератор палитр
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'wheel' }]"
        @click="activeTab = 'wheel'"
      >
        🎡 Цветовой круг
      </button>
    </div>

    <div v-if="activeTab === 'generator'" class="tab-content">
      <ControlPanel 
        @generate="generateNewPalette"
        v-model:colorCount="colorCount"
        v-model:format="displayFormat"
      />

      <div class="palette-section">
        <h2>Текущая палитра</h2>
        <div class="palette-display">
          <ColorCard 
            v-for="(color, index) in currentPalette"
            :key="index"
            :hex="color"
            :format="displayFormat"
            :isPinned="pinnedColors.includes(color)"
            @togglePin="togglePin(color)"
          />
        </div>
      </div>

      <PreviewPanel :colors="currentPalette" />

      <div class="saved-palettes">
        <h2>Сохранённые палитры</h2>
        <div class="saved-list">
          <div 
            v-for="(palette, index) in savedPalettes"
            :key="index"
            class="saved-item"
          >
            <div class="saved-colors">
              <div 
                v-for="color in palette.colors"
                :key="color"
                :style="{ backgroundColor: color }"
                class="saved-color"
              ></div>
            </div>
            <button @click="applySavedPalette(palette.colors)" class="load-btn">Загрузить</button>
            <button @click="deletePalette(index)" class="delete-btn">Удалить</button>
          </div>
        </div>

        <button @click="savePaletteToStorage" class="save-palette-btn">💾 Сохранить текущую палитру</button>
      </div>
    </div>

    <div v-if="activeTab === 'wheel'" class="tab-content">
      <ColorWheelPanel />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ControlPanel from './ControlPanel.vue'
import ColorCard from './ColorCard.vue'
import PreviewPanel from './PreviewPanel.vue'
import ColorWheelPanel from './ColorWheelPanel.vue'
import { generatePalette } from '../utils/colorGenerator'
import { loadPalette, savePalette, loadPinnedColors, savePinnedColors } from '../utils/storageManager'

const activeTab = ref('generator')
const colorCount = ref(5)
const displayFormat = ref('HEX')
const currentPalette = ref([])
const pinnedColors = ref([])
const savedPalettes = ref([])

onMounted(() => {
  const saved = loadPalette()
  if (saved) {
    currentPalette.value = saved.colors
  } else {
    generateNewPalette()
  }

  pinnedColors.value = loadPinnedColors()
  loadSavedPalettes()
})

function generateNewPalette() {
  const newPalette = generatePalette(colorCount.value)
  const filteredPalette = newPalette.filter(color => !pinnedColors.value.includes(color))
  
  currentPalette.value = [...pinnedColors.value, ...filteredPalette]
  
  savePalette(currentPalette.value, { colorCount: colorCount.value })
}

function togglePin(color) {
  if (pinnedColors.value.includes(color)) {
    pinnedColors.value = pinnedColors.value.filter(c => c !== color)
  } else {
    pinnedColors.value.push(color)
  }
  
  savePinnedColors(pinnedColors.value)
  generateNewPalette()
}

function loadSavedPalettes() {
  try {
    const saved = localStorage.getItem('savedPalettes')
    if (saved) {
      savedPalettes.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('Ошибка при загрузке сохранённых палитр:', e)
  }
}

function savePaletteToStorage() {
  try {
    const newPalette = {
      colors: currentPalette.value,
      savedAt: new Date().toISOString()
    }
    
    savedPalettes.value.unshift(newPalette)
    
    if (savedPalettes.value.length > 10) {
      savedPalettes.value = savedPalettes.value.slice(0, 10)
    }
    
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes.value))
    alert('✅ Палитра сохранена!')
  } catch (e) {
    console.error('Ошибка при сохранении палитры:', e)
  }
}

function applySavedPalette(colors) {
  currentPalette.value = colors
  savePalette(colors)
}

function deletePalette(index) {
  savedPalettes.value.splice(index, 1)
  localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes.value))
}
</script>

<style scoped>
.palette-generator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  border-radius: 12px;
}

.header h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
}

.header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #333;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.palette-section {
  margin-bottom: 40px;
}

.palette-section h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.palette-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.saved-palettes {
  margin-top: 40px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
}

.saved-palettes h2 {
  margin-top: 0;
  font-size: 20px;
  color: #333;
}

.saved-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.saved-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.saved-colors {
  display: flex;
  gap: 8px;
}

.saved-color {
  flex: 1;
  height: 40px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.load-btn, .delete-btn, .save-palette-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.load-btn {
  background: #667eea;
  color: white;
}

.load-btn:hover {
  background: #5568d3;
}

.delete-btn {
  background: #f0f0f0;
  color: #333;
}

.delete-btn:hover {
  background: #e0e0e0;
}

.save-palette-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  width: 100%;
}

.save-palette-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .header {
    padding: 25px 15px;
  }

  .header h1 {
    font-size: 24px;
  }

  .palette-display {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .saved-list {
    grid-template-columns: 1fr;
  }
}
</style>
