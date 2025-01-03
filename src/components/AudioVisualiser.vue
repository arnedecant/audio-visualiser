<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import ParticlesPlane from './ParticlesPlane.vue'
import { computed } from 'vue'
import { useUsermediaStore } from '@/stores/usermedia'
import { Vector3 } from 'three'

const usermedia = useUsermediaStore()
const isStreamReady = computed(() => !!usermedia.currentVideo)
const cameraPosition = computed<Vector3>(() => {
  return new Vector3(0, 0, usermedia.streamDimensions[0] * 1.2)
})
</script>

<template>
  <TresCanvas windowSize powerPreference="high-performance" class="canvas" :background="0x000000">
    <OrbitControls />
    <TresPerspectiveCamera
      visible
      :position="cameraPosition"
      :lookAt="[0, 0, 0]"
      :fieldOfView="45"
      :nearPlane="0.1"
      :farPlane="10000"
    />
    <ParticlesPlane v-if="isStreamReady" />
  </TresCanvas>
</template>

<style scoped></style>
