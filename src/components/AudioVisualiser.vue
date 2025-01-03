<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import ParticlesPlane from './ParticlesPlane.vue'
import { computed } from 'vue'
import { useUsermediaStore } from '@/stores/usermedia'

const usermedia = useUsermediaStore()
const isStreamReady = computed(() => !!usermedia.currentVideo)
// const aspectRatio = computed(() => window.innerWidth / window.innerHeight)
</script>

<template>
  <TresCanvas windowSize powerPreference="high-performance" class="canvas" :background="0x222222">
    <OrbitControls />
    <TresPerspectiveCamera
      visible
      :position="[0, 0, 700]"
      :lookAt="[0, 0, 0]"
      :fieldOfView="45"
      :nearPlane="0.1"
      :farPlane="10000"
    />
    <ParticlesPlane v-if="isStreamReady" />
  </TresCanvas>
</template>

<style scoped>
.canvas {
  background-color: var(--color-background);
}
</style>
