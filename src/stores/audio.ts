import type { RGB } from '@/types'
import { getFrequencyRangeValue } from '@/utils/audio'
import { defineStore } from 'pinia'
import { Audio, AudioAnalyser, AudioListener } from 'three'
import { ref } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  const hasUserInteracted = ref(false)
  const elAudio = ref<HTMLAudioElement | null>(null)
  const src = ref<string | null>(null)
  const fftSize = 2048
  const listener = new AudioListener()
  const audio = new Audio(listener)

  const frequencyRange = {
    bass: [20, 140],
    lowMid: [140, 400],
    mid: [400, 2600],
    highMid: [2600, 5200],
    treble: [5200, 14000],
  }

  const analyser = new AudioAnalyser(audio, fftSize)

  const setCurrentAudioElement = (newEl: HTMLAudioElement) => {
    elAudio.value = newEl
    src.value = newEl.src
    audio.setMediaElementSource(newEl)
  }

  const getFrequencyRgb = (): RGB => {
    const data = analyser.getFrequencyData()
    const bass = getFrequencyRangeValue(data, frequencyRange.bass)
    const mid = getFrequencyRangeValue(data, frequencyRange.mid)
    const treble = getFrequencyRangeValue(data, frequencyRange.treble)
    return { r: bass, g: mid, b: treble }
  }

  const setUserInteracted = (newVal: boolean = true) => {
    hasUserInteracted.value = newVal
    if (newVal && elAudio.value) elAudio.value.play()
  }

  return {
    analyser,
    frequencyRange,
    hasUserInteracted,
    setCurrentAudioElement,
    getFrequencyRgb,
    setUserInteracted,
    elAudio,
  }
})
