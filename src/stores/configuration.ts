import { VisualiserPreset, VisualiserTheme } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigurationStore = defineStore('configuration', () => {
  const isPreviewVisible = ref(true)
  const presets = ref(Object.values(VisualiserPreset))
  const themes = ref(Object.values(VisualiserTheme))
  const currentPreset = ref(VisualiserPreset.Webcam)
  const currentTheme = ref(VisualiserTheme.Discodip)

  return {
    isPreviewVisible,
    presets,
    themes,
    currentPreset,
    currentTheme,
  }
})
