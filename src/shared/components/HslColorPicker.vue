<template>
  <div class="hsl-picker">
    <div class="hsl-picker__preview" :style="{ backgroundColor: hexValue }" />

    <div class="hsl-picker__slider">
      <label class="hsl-picker__label">Hue ({{ hue }}°)</label>
      <ion-range
        :value="hue"
        :min="0"
        :max="360"
        :pin="true"
        class="hsl-picker__range hsl-picker__range--hue"
        @ion-input="hue = ($event.detail.value as number)"
      />
    </div>

    <div class="hsl-picker__slider">
      <label class="hsl-picker__label">Saturation ({{ saturation }}%)</label>
      <ion-range
        :value="saturation"
        :min="0"
        :max="100"
        :pin="true"
        @ion-input="saturation = ($event.detail.value as number)"
      />
    </div>

    <div class="hsl-picker__slider">
      <label class="hsl-picker__label">Lightness ({{ lightness }}%)</label>
      <ion-range
        :value="lightness"
        :min="0"
        :max="100"
        :pin="true"
        @ion-input="lightness = ($event.detail.value as number)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { IonRange } from '@ionic/vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const hue = ref(200);
const saturation = ref(70);
const lightness = ref(50);

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [200, 70, 50];

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

const hexValue = ref(props.modelValue);

onMounted(() => {
  const [h, s, l] = hexToHsl(props.modelValue);
  hue.value = h;
  saturation.value = s;
  lightness.value = l;
});

watch([hue, saturation, lightness], () => {
  hexValue.value = hslToHex(hue.value, saturation.value, lightness.value);
  emit('update:modelValue', hexValue.value);
});
</script>

<style scoped>
.hsl-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
}

.hsl-picker__preview {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--color-outline);
}

.hsl-picker__slider {
  display: flex;
  flex-direction: column;
}

.hsl-picker__label {
  font-size: 12px;
  color: var(--color-on-surface-variant);
  padding-left: 16px;
}

.hsl-picker__range--hue {
  --bar-background: linear-gradient(
    to right,
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  );
}
</style>
