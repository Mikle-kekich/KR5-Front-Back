<template>
  <div class="color-wheel-panel">
    <div class="wheel-container">
      <h3>🎨 Цветовой Круг</h3>
      
      <!-- Интерактивный цветовой круг -->
      <div class="wheel-wrapper">
        <canvas 
          ref="wheelCanvas" 
          class="color-wheel"
          @click="handleWheelClick"
          :width="wheelSize"
          :height="wheelSize"
        ></canvas>
        <div class="wheel-center" :style="{ backgroundColor: currentHexColor }"></div>
      </div>

      <!-- Выбор схемы -->
      <div class="scheme-selector">
        <label>Тип схемы:</label>
        <select v-model="selectedScheme" @change="generateScheme">
          <option value="complementary">Комплементарная (2 цвета)</option>
          <option value="analogous">Аналогичная (3 цвета)</option>
          <option value="triadic">Триадная (3 цвета)</option>
          <option value="tetradic">Тетрадная (4 цвета)</option>
          <option value="splitComplementary">Расщеплённо-комплементарная (3 цвета)</option>
          <option value="monochromatic">Монохромная (5 оттенков)</option>
        </select>
      </div>

      <!-- Информация о цвете -->
      <div class="color-info">
        <div class="info-item">
          <span class="label">HUE:</span>
          <input 
            v-model.number="currentHue" 
            type="range" 
            min="0" 
            max="360" 
            @input="updateFromHue"
            class="hue-slider"
          >
          <span class="value">{{ Math.round(currentHue) }}°</span>
        </div>
        
        <div class="info-item">
          <span class="label">Цвет:</span>
          <span class="color-name">{{ colorName }}</span>
        </div>

        <div class="info-item">
          <span class="label">Тон:</span>
          <span class="tone">{{ colorTone }}</span>
        </div>
      </div>

      <!-- Генерированная схема -->
      <div class="scheme-colors" v-if="schemeColors.length > 0">
        <div class="scheme-title">Сгенерированная палитра</div>
        <div class="colors-grid">
          <div 
            v-for="(color, index) in schemeColors" 
            :key="index"
            class="scheme-color-card"
            :style="{ backgroundColor: color.hex }"
            @click="copyToClipboard(color.hex)"
          >
            <div class="color-hex">{{ color.hex }}</div>
            <div class="color-name-small">{{ color.name }}</div>
          </div>
        </div>
      </div>

      <!-- Экспорт -->
      <div class="export-section">
        <button @click="exportAsCSS" class="export-btn">📋 Экспорт CSS</button>
        <button @click="exportAsJSON" class="export-btn">📄 Экспорт JSON</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { hslToHex, hexToHsl } from '../utils/colorGenerator'
import { getContrastColor } from '../utils/colorConverter'
import { 
  getColorScheme, 
  getSchemeTypeName, 
  getHueName, 
  getColorTone,
  getMonochromatic,
  getAnalogous,
  getTriadic,
  getTetradic,
  getSplitComplementary
} from '../utils/colorWheelUtils'

const wheelCanvas = ref(null)
const wheelSize = 250
const selectedScheme = ref('complementary')
const currentHue = ref(0)
const currentSaturation = ref(70)
const currentLightness = ref(50)
const schemeColors = ref([])

const currentHexColor = computed(() => {
  return hslToHex(currentHue.value, currentSaturation.value, currentLightness.value)
})

const colorName = computed(() => getHueName(currentHue.value))
const colorTone = computed(() => getColorTone(currentHue.value))

onMounted(() => {
  drawColorWheel()
  generateScheme()
})

function drawColorWheel() {
  const canvas = wheelCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const centerX = wheelSize / 2
  const centerY = wheelSize / 2
  const radius = wheelSize / 2 - 10

  // Очистить холст
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, wheelSize, wheelSize)

  // Нарисовать цветовой круг
  for (let angle = 0; angle < 360; angle += 1) {
    const startAngle = (angle - 90) * (Math.PI / 180)
    const endAngle = (angle + 1 - 90) * (Math.PI / 180)

    const hue = angle
    const color = hslToHex(hue, 100, 50)

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fill()
  }

  // Нарисовать границу
  ctx.strokeStyle = '#ccc'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.stroke()

  // Нарисовать указатель текущего цвета
  const angle = (currentHue.value - 90) * (Math.PI / 180)
  const pointerX = centerX + radius * Math.cos(angle)
  const pointerY = centerY + radius * Math.sin(angle)

  ctx.fillStyle = getContrastColor(currentHexColor.value)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(pointerX, pointerY, 8, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fill()
}

function handleWheelClick(event) {
  const canvas = wheelCanvas.value
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left - wheelSize / 2
  const y = event.clientY - rect.top - wheelSize / 2

  const angle = Math.atan2(y, x) * (180 / Math.PI) + 90
  currentHue.value = (angle + 360) % 360

  drawColorWheel()
  generateScheme()
}

function updateFromHue() {
  drawColorWheel()
  generateScheme()
}

function generateScheme() {
  let hues = []

  if (selectedScheme.value === 'monochromatic') {
    const monoColors = getMonochromatic(currentHue.value, currentSaturation.value)
    schemeColors.value = monoColors.map(color => ({
      hex: hslToHex(color.hue, color.saturation, color.lightness),
      name: getHueName(color.hue),
      hsl: color
    }))
  } else {
    hues = getColorScheme(currentHue.value, selectedScheme.value)
    schemeColors.value = hues.map(hue => ({
      hex: hslToHex(hue, currentSaturation.value, currentLightness.value),
      name: getHueName(hue),
      hsl: { hue, saturation: currentSaturation.value, lightness: currentLightness.value }
    }))
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  alert(`Скопировано: ${text}`)
}

function exportAsCSS() {
  const cssVars = schemeColors.value
    .map((color, i) => `--color-${i + 1}: ${color.hex};`)
    .join('\n')

  const css = `:root {\n${cssVars}\n}`
  copyToClipboard(css)
}

function exportAsJSON() {
  const json = JSON.stringify({
    scheme: selectedScheme.value,
    baseHue: currentHue.value,
    colors: schemeColors.value
  }, null, 2)
  copyToClipboard(json)
}
</script>

<style scoped>
.color-wheel-panel {
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wheel-container h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
}

.wheel-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.color-wheel {
  border-radius: 50%;
  cursor: crosshair;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.2s;
}

.color-wheel:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.scheme-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.scheme-selector label {
  font-weight: 500;
  color: #333;
}

.scheme-selector select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.color-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.value, .color-name, .tone {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.hue-slider {
  cursor: pointer;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, 
    hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%),
    hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  );
  -webkit-appearance: none;
  appearance: none;
}

.hue-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 2px solid #333;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hue-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 2px solid #333;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.scheme-colors {
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.scheme-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
}

.scheme-color-card {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.scheme-color-card:hover {
  transform: scale(1.05);
}

.color-hex {
  font-weight: 600;
  margin-bottom: 4px;
}

.color-name-small {
  font-size: 11px;
  opacity: 0.9;
}

.export-section {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.export-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.export-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .color-info {
    grid-template-columns: 1fr;
  }

  .colors-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }
}
</style>
