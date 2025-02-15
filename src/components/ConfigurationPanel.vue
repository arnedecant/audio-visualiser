<script setup lang="ts">
import { useUsermediaStore } from '@/stores/usermedia'
import { UsermediaStatus, VisualiserPreset } from '@/types'
import { watch, computed } from 'vue'
import VideoPlayer from './VideoPlayer.vue'
import { useConfigurationStore } from '@/stores/configuration'
import { storeToRefs } from 'pinia'

const usermedia = useUsermediaStore()
const configuration = useConfigurationStore()
const { isPreviewVisible, isCanvasLocked, presets, themes, currentPreset, currentTheme } =
  storeToRefs(configuration)

const userStream = computed(() => usermedia.userStream)
const usermediaStatus = computed(() => usermedia.status)
const showVideoPlayer = computed(() => {
  if (currentPreset.value === VisualiserPreset.Video) return true
  if (currentPreset.value === VisualiserPreset.Webcam && userStream.value) return true
  return false
})

const onPresetChange = async (newVal: VisualiserPreset) => {
  usermedia.stopStream()
  switch (newVal) {
    case VisualiserPreset.Webcam:
      await usermedia.requestStream()
      break
    case VisualiserPreset.Video:
      break
  }
}

watch(currentPreset, onPresetChange, { immediate: true })
</script>

<template>
  <section>
    <p v-if="usermediaStatus === UsermediaStatus.Fail">
      You did not grant permissions to access your webcam.
    </p>
    <VideoPlayer v-else-if="showVideoPlayer" v-show="isPreviewVisible" :stream="userStream" />
    <form>
      <label for="preview">Preview</label>
      <input type="checkbox" id="preview" v-model="isPreviewVisible" />
      <label for="lock">Lock</label>
      <input type="checkbox" id="lock" v-model="isCanvasLocked" />
      <label for="preset">Preset</label>
      <select id="preset" v-model="currentPreset" disabled>
        <option v-for="option of presets" :key="option" :value="option">{{ option }}</option>
      </select>
      <label for="theme">Theme</label>
      <select id="theme" v-model="currentTheme">
        <option v-for="option of themes" :key="option" :value="option">{{ option }}</option>
      </select>
    </form>
  </section>
</template>

<style scoped>
section {
  padding: 0.5rem;
  width: 12rem;
  background-color: var(--color-background);
}

form {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 0.5rem 0.25rem;
}

form > :not(label) {
  width: 100%;
  height: 100%;
  margin-left: auto;
}

form > input[type='checkbox'] {
  width: auto;
}
</style>
