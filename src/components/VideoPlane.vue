<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue'
import { useUsermediaStore } from '@/stores/usermedia'
import { VideoTexture } from 'three'

const usermedia = useUsermediaStore()
const streamDimensions = computed(() => usermedia.streamDimensions)
const elVideo = computed(() => usermedia.currentVideo)
const videoTexture = ref<VideoTexture | null>(null)

const setup = () => {
  if (!elVideo.value) return
  videoTexture.value = new VideoTexture(elVideo.value)
}

watch(elVideo, setup)
onMounted(setup)
</script>

<template>
  <TresMesh v-if="videoTexture" :position="[0, 0, 0]" :rotation="[1.57, 0, 3.14]">
    <TresPlaneGeometry :args="streamDimensions" />
    <TresMeshBasicMaterial :map="videoTexture" :side="2" />
  </TresMesh>
</template>
