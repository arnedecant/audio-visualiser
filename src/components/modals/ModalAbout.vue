<script setup lang="ts">
import { NyxModal } from '../common'
const emit = defineEmits(['close'])
const onClose = () => emit('close')
</script>

<template>
  <NyxModal title="About" @close="onClose">
    <p>
      This app uses your camera to visualize the video stream on a particle system. Each particle is
      animated according to the color of that particular pixel on your webcam and the song being
      played. This means this app needs both your permission to capture your camera and play music.
    </p>
    <p>
      Some browsers require user interaction before any audio can be played. By clicking "okay" this
      app has the necessary user interaction to play music.
    </p>
    <p><strong>Important:</strong> I do not store anything from your camera on the server!</p>
    <p>As with most of my web experiments, use Google Chrome for an optimal user experience.</p>
  </NyxModal>
</template>

<style scoped>
p {
  margin: 0.5rem 0;
}
</style>
