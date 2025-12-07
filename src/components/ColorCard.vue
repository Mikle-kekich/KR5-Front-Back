<template>
  <div class="color-card" :style="{ backgroundColor: hex || '#cccccc' }">
    <div class="color-content">
      <div class="color-display" :style="{ backgroundColor: hex || '#cccccc' }"></div>
      
      <div class="color-info">
        <div class="hex-value">{{ displayValue }}</div>
      </div>

      <div class="button-group">
        <button 
          class="btn pin-btn"
          :class="{ pinned: isPinned }"
          @click="$emit('togglePin')"
          title="Закрепить цвет"
        >
          📌
        </button>
        
        <button 
          class="btn copy-btn"
          @click="copyToClipboard"
          title="Копировать цвет"
        >
          📋
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { hexToRgb } from '../utils/colorConverter'

const props = defineProps({
  hex: {
    type: String,
    required: true,
    default: '#000000'
  },
  format: {
    type: String,
    default: 'HEX'
  },
  isPinned: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['togglePin'])

const rgbValue = computed(() => {
  if (!props.hex) return 'rgb(0, 0, 0)'
  try {
    return hexToRgb(props.hex)
  } catch (e) {
    return 'rgb(0, 0, 0)'
  }
})

const displayValue = computed(() => {
  if (props.format === 'RGB') {
    return rgbValue.value
  }
  return props.hex || '#000000'
})

function copyToClipboard() {
  try {
    const text = displayValue.value
    navigator.clipboard.writeText(text)
    alert(`✅ Скопировано: ${text}`)
  } catch (e) {
    console.error('Ошибка при копировании:', e)
    alert('❌ Ошибка при копировании')
  }
}
</script>

<style scoped>
.color-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 180px;
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.color-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  background: white;
}

.color-display {
  height: 80px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-info {
  flex: 1;
  margin-bottom: 12px;
}

.hex-value {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  word-break: break-all;
}

.button-group {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

.pin-btn.pinned {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.copy-btn {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.copy-btn:hover {
  background: #5568d3;
  border-color: #5568d3;
}

@media (max-width: 768px) {
  .color-card {
    min-height: 150px;
  }

  .color-display {
    height: 60px;
  }

  .hex-value {
    font-size: 12px;
  }
}
</style>
