<script setup lang="ts">
import { useUsermediaStore } from '@/stores/usermedia'
import { onMounted, useTemplateRef } from 'vue'

const props = defineProps<{
  stream: MediaStream
}>()

const elVideo = useTemplateRef<HTMLVideoElement>('elVideo')
const usermedia = useUsermediaStore()

onMounted(() => {
  if (!elVideo.value) return
  elVideo.value.srcObject = props.stream
  usermedia.setStreamDimensions(elVideo.value.videoWidth, elVideo.value.videoHeight)
})

const onVideoLoaded = () => {
  if (!elVideo.value) return
  usermedia.setStreamDimensions(elVideo.value.videoWidth, elVideo.value.videoHeight)
  usermedia.setCurrentVideoElement(elVideo.value)
}
</script>

<template>
  <video ref="elVideo" autoplay muted @loadeddata="onVideoLoaded"></video>
</template>

<style scoped>
video {
  max-width: 100%;
  transform: scaleX(-100%);
}
</style>
