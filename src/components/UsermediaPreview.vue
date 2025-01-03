<script setup lang="ts">
import { useConfigurationStore } from '@/stores/configuration'
import { useUsermediaStore } from '@/stores/usermedia'
import { VisualiserPreset } from '@/types'
import { computed, watch, useTemplateRef, onMounted } from 'vue'

const props = defineProps<{
  stream: MediaStream
}>()

const elVideo = useTemplateRef<HTMLVideoElement>('elVideo')
const usermedia = useUsermediaStore()
const configuration = useConfigurationStore()
const isWebcam = computed(() => configuration.currentPreset === VisualiserPreset.Webcam)

const setup = (isWebcam: boolean) => {
  if (!elVideo.value) return
  elVideo.value.srcObject = isWebcam ? props.stream : null
  usermedia.setStreamDimensions(elVideo.value.videoWidth, elVideo.value.videoHeight)
}

watch(isWebcam, setup) // { immediate: true } doesn't work
onMounted(() => setup(isWebcam.value))

const onVideoLoaded = () => {
  if (!elVideo.value) return
  usermedia.setStreamDimensions(elVideo.value.videoWidth, elVideo.value.videoHeight)
  usermedia.setCurrentVideoElement(elVideo.value)
}
</script>

<template>
  <video
    ref="elVideo"
    :class="{ 'is-webcam': isWebcam }"
    autoplay
    muted
    @loadeddata="onVideoLoaded"
  >
    <source src="@/assets/video/jellyfish.mp4" type="video/mp4" v-if="!isWebcam" />
  </video>
</template>

<style scoped>
video {
  max-width: 100%;
}

video.is-webcam {
  transform: scaleX(-100%);
}
</style>
