<template>
  <div class="control-panel">
    <div class="controls-grid">
      <div class="control-group">
        <button class="generate-btn" @click="$emit('generate')">
          🎨 ГЕНЕРИРОВАТЬ ПАЛИТРУ
        </button>
      </div>

      <div class="control-group">
        <label>Количество цветов:</label>
        <input 
          type="number" 
          :value="colorCount"
          @input="$emit('update:colorCount', Number($event.target.value))"
          min="2"
          max="20"
          class="input-number"
        />
      </div>

      <div class="control-group">
        <label>Формат:</label>
        <select 
          :value="format"
          @change="$emit('update:format', $event.target.value)"
          class="select-format"
        >
          <option value="HEX">HEX</option>
          <option value="RGB">RGB</option>
          <option value="HSL">HSL</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  colorCount: {
    type: Number,
    default: 5
  },
  format: {
    type: String,
    default: 'HEX'
  }
})

defineEmits(['generate', 'update:colorCount', 'update:format'])
</script>

<style scoped>
.control-panel {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 20px;
  align-items: flex-end;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.generate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  grid-column: 1 / -1;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.generate-btn:active {
  transform: translateY(0);
}

.input-number {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 80px;
}

.input-number:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select-format {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  min-width: 100px;
}

.select-format:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .generate-btn {
    grid-column: auto;
  }

  .input-number,
  .select-format {
    width: 100%;
  }
}
</style>
