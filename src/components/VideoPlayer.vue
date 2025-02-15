<script setup lang="ts">
import { useConfigurationStore } from '@/stores/configuration'
import { useUsermediaStore } from '@/stores/usermedia'
import { VisualiserPreset } from '@/types'
import { computed, watch, useTemplateRef, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    stream?: MediaStream | null
    src?: string | null
  }>(),
  {
    stream: null,
    src: null,
  },
)

const elVideo = useTemplateRef<HTMLVideoElement>('elVideo')
const usermedia = useUsermediaStore()
const configuration = useConfigurationStore()
const isWebcam = computed(() => configuration.currentPreset === VisualiserPreset.Webcam)

const setup = () => {
  if (!elVideo.value) return
  elVideo.value.srcObject = isWebcam.value ? props.stream : null
}

watch(isWebcam, setup) // { immediate: true } doesn't work
onMounted(setup)

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
    loop
    @loadeddata="onVideoLoaded"
  >
    <source src="@/assets/video/jellyfish.mp4" type="video/mp4" />
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
