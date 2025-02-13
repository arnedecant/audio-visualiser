<script setup lang="ts">
import AudioVisualiser from '@/components/AudioVisualiser.vue'
import ConfigurationPanel from '@/components/ConfigurationPanel.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import { ref } from 'vue'
import ModalAbout from '@/components/modals/ModalAbout.vue'

const isModalVisible = ref(true)
</script>

<template>
  <ModalAbout v-if="isModalVisible" @close="isModalVisible = false" />
  <main v-else>
    <ConfigurationPanel class="configuration-panel" />
    <AudioVisualiser class="audio-visualiser" />
    <AudioPlayer class="audio-preview" />
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
