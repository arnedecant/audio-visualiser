<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import ParticlesPlane from './ParticlesPlane.vue'
import { computed, ref, watch } from 'vue'
import { useUsermediaStore } from '@/stores/usermedia'
import { Vector3 } from 'three'
import { useConfigurationStore } from '@/stores/configuration'
import { storeToRefs } from 'pinia'
import { VisualiserPreset } from '@/types'

const usermedia = useUsermediaStore()
const configuration = useConfigurationStore()

const { streamDimensions, currentVideo, currentVideoFrame } = storeToRefs(usermedia)
const { currentPreset, isCanvasLocked } = storeToRefs(configuration)

const cameraLookAt = ref<[number, number, number]>([0, 0, 0])
const cameraPosition = ref<[number, number, number]>([0, 0, 700])
const isStreamReady = computed(() => !!currentVideo.value || !!currentVideoFrame.value)

watch(currentPreset, () => {
  const x: number = cameraPosition.value[0]
  const y: number = cameraPosition.value[1]
  const z: number = currentPreset.value === VisualiserPreset.Webcam ? 700 : 1500
  // const z: number = Math.max(...streamDimensions.value)
  cameraPosition.value = [x, y, z]
})
</script>

<template>
  <TresCanvas windowSize powerPreference="high-performance" class="canvas">
    <TresPerspectiveCamera
      visible
      :position="cameraPosition"
      :lookAt="cameraLookAt"
      :fieldOfView="45"
      :nearPlane="0.1"
      :farPlane="10000"
    />
    <ParticlesPlane v-if="isStreamReady" />
    <OrbitControls v-if="!isCanvasLocked" />
  </TresCanvas>
</template>

<style scoped>
.canvas {
  background: #000000;
}
</style>
