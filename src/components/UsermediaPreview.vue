<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const props = defineProps<{
  stream: MediaStream
}>()

const elVideo = useTemplateRef<HTMLVideoElement>('elVideo')

onMounted(() => {
  if (!elVideo.value) return
  elVideo.value.srcObject = props.stream
})
</script>

<template>
  <video ref="elVideo" autoplay muted></video>
</template>

<style scoped>
video {
  max-width: 100%;
}
</style>
