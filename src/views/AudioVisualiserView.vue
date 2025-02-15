<script setup lang="ts">
import AudioVisualiser from '@/components/AudioVisualiser.vue'
import ConfigurationPanel from '@/components/ConfigurationPanel.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import { ref } from 'vue'
import ModalAbout from '@/components/modals/ModalAbout.vue'
import { useAudioStore } from '@/stores/audio'

const { setUserInteracted } = useAudioStore()

const isModalVisible = ref(true)
const onCloseModalAbout = () => {
  isModalVisible.value = false
  setUserInteracted(true)
}
</script>

<template>
  <ModalAbout v-if="isModalVisible" @close="onCloseModalAbout" />
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
