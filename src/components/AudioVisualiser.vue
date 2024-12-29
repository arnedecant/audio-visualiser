<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import UsermediaPlane from './UsermediaPlane.vue'
import Particles from './Particles.vue'
</script>

<template>
  <TresCanvas windowSize powerPreference="high-performance" class="canvas">
    <OrbitControls />
    <TresPerspectiveCamera visible :position="[0, 1, 0]" />
    <UsermediaPlane />
  </TresCanvas>
</template>

<style scoped>
.canvas {
  background-color: var(--color-background);
}
</style>
