<script setup lang="ts">
import AudioVisualiser from '@/components/AudioVisualiser.vue'
import ConfigurationPanel from '@/components/ConfigurationPanel.vue'
import AudioPreview from '@/components/AudioPreview.vue'
</script>

<template>
  <main>
    <ConfigurationPanel class="configuration-panel" />
    <AudioVisualiser class="audio-visualiser" />
    <AudioPreview class="audio-preview" />
  </main>
</template>

<style scoped>
.configuration-panel {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1;
}

.audio-preview {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translate(-50%, 0);
  min-width: 50dvw;
  max-width: 95dvw;
}
</style>
