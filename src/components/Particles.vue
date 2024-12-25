<script setup lang="ts">
import fragmentShader from '@/shaders/particles.frag.glsl'
import vertexShader from '@/shaders/particles.vert.glsl'

const uniforms = {
  time: { type: 'f', value: 0.0 },
  size: { type: 'f', value: 10.0 },
  density: { type: 'f', value: 0.1 },
  isPlaying: { type: 'b', value: true },
}
</script>

<template>
  <TresPoints>
    <TresShaderMaterial
      :vertexShader="vertexShader"
      :fragmentShader="fragmentShader"
      :uniforms="uniforms"
    />
  </TresPoints>
</template>
