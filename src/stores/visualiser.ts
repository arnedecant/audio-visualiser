import { ref } from 'vue'
import { defineStore } from 'pinia'
import { VisualiserPreset, VisualiserTheme } from '@/types'
import { Frequency } from '@/classes'

export const useVisualiserStore = defineStore('visualiser', () => {
  const isPlaying = ref(false)
  const preset = ref<VisualiserPreset>(VisualiserPreset.Webcam)
  const theme = ref<VisualiserTheme>(VisualiserTheme.Discodip)
  const frequency = ref(new Frequency())

  const uniforms = {
    time: { type: 'f', value: 0.0 },
    size: { type: 'f', value: 10.0 },
    density: { type: 'f', value: 0.1 },
    isPlaying: { type: 'b', value: true },
    isWebcam: { type: 'b', value: true },
  }

  return {
    isPlaying,
    preset,
    theme,
    frequency,
    uniforms,
  }
})
