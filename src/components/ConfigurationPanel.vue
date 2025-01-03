<script setup lang="ts">
import { useUsermediaStore } from '@/stores/usermedia'
import { UsermediaStatus } from '@/types'
import { onMounted, computed } from 'vue'
import UsermediaPreview from './UsermediaPreview.vue'
import { useConfigurationStore } from '@/stores/configuration'
import { storeToRefs } from 'pinia'

const usermedia = useUsermediaStore()
const configuration = useConfigurationStore()
const { isPreviewVisible, presets, themes, currentPreset, currentTheme } =
  storeToRefs(configuration)

const userStream = computed(() => usermedia.userStream)
const usermediaStatus = computed(() => usermedia.status)

onMounted(() => usermedia.requestStream())
</script>

<template>
  <section>
    <p v-if="usermediaStatus === UsermediaStatus.Fail">
      You did not grant permissions to access your webcam.
    </p>
    <UsermediaPreview v-else-if="userStream !== null && isPreviewVisible" :stream="userStream" />
    <form>
      <label for="preview">Preview</label>
      <input type="checkbox" id="preview" v-model="isPreviewVisible" />
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
