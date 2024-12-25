<script setup lang="ts">
import { computed, watch, onBeforeUnmount, ref } from 'vue'
import { useUsermediaStore } from '@/stores/usermedia'
import { VideoTexture } from 'three'

const usermedia = useUsermediaStore()
const streamDimensions = computed(() => usermedia.streamDimensions)
const elVideo = computed(() => usermedia.currentVideo)
const videoTexture = ref<VideoTexture | null>(null)

const normalizedPlaneDimensions = computed<[number, number]>(() => {
  const width = streamDimensions.value[0]
  const height = streamDimensions.value[1]

  if (width > height) {
    return [1, height / width]
  } else if (height > width) {
    return [width / height, 1]
  } else {
    return [1, 1]
  }
})

watch(
  elVideo,
  (newVal) => {
    if (!newVal) return
    videoTexture.value = new VideoTexture(newVal)
  },
  { immediate: true },
)
</script>

<template>
  <TresMesh v-if="videoTexture" :position="[0, 0, 0]" :rotation="[1.57, 0, 3.14]">
    <TresPlaneGeometry :args="normalizedPlaneDimensions" />
    <TresMeshBasicMaterial :map="videoTexture" :side="2" />
  </TresMesh>
</template>
