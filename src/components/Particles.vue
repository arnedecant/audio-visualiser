<script setup lang="ts">
import fragmentShader from '@/shaders/particles/fragment.glsl'
import vertexShader from '@/shaders/particles/vertex.glsl'
import { useUsermediaStore } from '@/stores/usermedia'
import { hexToRgb } from '@/utils/color'
import { BufferAttribute, AdditiveBlending } from 'three'
import { computed, onMounted } from 'vue'

const usermedia = useUsermediaStore()

const uniforms = {
  time: { type: 'f', value: 0.0 },
  size: { type: 'f', value: 10.0 },
  density: { type: 'f', value: 0.1 },
  isPlaying: { type: 'b', value: true },
}

const imageData = usermedia.getVideoFrameData()

const indices = []
const verticesData: number[] = []
const colorsData: number[] = []
const colorsPerFace = ['#f0932b', '#eb4d4b', '#6ab04c', '#22a6b3', '#be2edd', '#4834d4', '#130f40']

const getVertices = () => {
  if (imageData === null) return
  const step = 3
  for (let y = 0, height = imageData.height; y < height; y += step) {
    for (let x = 0, width = imageData.width; x < width; x += step) {
      const index = (x + y * width) * 4
      indices.push(index)

      const data = imageData.data
      const gray = (data[index] + data[index + 1] + data[index + 2]) / 3
      const vX = x - imageData.width / 2 // Shift in X direction since origin is center of screen
      const vY = -y + imageData.height / 2 // Shift in Y direction in the same way (you need -y)
      const vZ = gray < 300 ? gray : 10000
      verticesData.push(vX, vY, vZ)

      // let color = hexToRgb('#555555')
      const color = hexToRgb(colorsPerFace[Math.floor(Math.random() * colorsPerFace.length)])
      colorsData.push(color.r, color.g, color.b)
    }
  }
}

onMounted(getVertices)

const positionAttr = computed(() => {
  const vertices = new Float32Array(verticesData)
  return new BufferAttribute(vertices, 3)
})

const colorAttr = computed(() => {
  const colors = new Float32Array(colorsData)
  return new BufferAttribute(colors, 3)
})
</script>

<template>
  <TresPoints>
    <TresBufferGeometry :position="positionAttr" :color="colorAttr" />
    <TresShaderMaterial
      :vertexShader="vertexShader"
      :fragmentShader="fragmentShader"
      :uniforms="uniforms"
      :transparent="true"
      :depthWrite="false"
      :blending="AdditiveBlending"
    />
  </TresPoints>
</template>
