<script setup lang="ts">
// @ts-expect-error: load shader
import fragmentShader from '@/shaders/particles/fragment.glsl'
// @ts-expect-error: load shader
import vertexShader from '@/shaders/particles/vertex.glsl'
import { useUsermediaStore } from '@/stores/usermedia'
import { AdditiveBlending, BufferGeometry, ShaderMaterial, Points } from 'three'
import { watch } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import type { RGB } from '@/types'
import { useAudioStore } from '@/stores/audio'
import { useParticles } from '@/compositions/particles'
import { useConfigurationStore } from '@/stores/configuration'
import { storeToRefs } from 'pinia'

const { onBeforeRender } = useLoop()
const { scene } = useTresContext()
const usermedia = useUsermediaStore()
const audio = useAudioStore()
const configuration = useConfigurationStore()
const { currentTheme } = storeToRefs(configuration)
const uniforms = {
  time: { type: 'f', value: 0.0 },
  size: { type: 'f', value: 10.0 },
  density: { type: 'f', value: 0.1 },
  isPlaying: { type: 'b', value: true },
  isWebcam: { type: 'b', value: true },
}

const geometry = new BufferGeometry()
const material = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: AdditiveBlending,
})
let particles: Points | null = null
const { getGeometryData, transformPositions, clearParticles } = useParticles(scene)

const setup = () => {
  clearParticles(particles)
  const imageData = usermedia.getVideoFrameData()
  if (imageData === null) return
  const { position, color } = getGeometryData(imageData)
  geometry.setAttribute('position', position)
  geometry.setAttribute('color', color)
  particles = new Points(geometry, material)
  scene.value.add(particles)
}

const drawFrameData = (frameData: ImageData) => {
  if (!particles?.geometry) return
  uniforms.time.value += 0.5
  const rgb: RGB = audio.getFrequencyRgb()
  const isRenderAllowed = uniforms.isWebcam.value
  transformPositions(particles.geometry.attributes.position.array, frameData, rgb, isRenderAllowed)
  uniforms.size.value = ((rgb.r + rgb.g + rgb.b) / 3) * 35 + 5
  particles.geometry.attributes.position.needsUpdate = true
}

onBeforeRender(({ elapsed }) => {
  const useCache = elapsed % 2 === 0
  const frameData = usermedia.getVideoFrameData(useCache)
  if (!frameData) return
  drawFrameData(frameData)
})

watch(currentTheme, setup, { immediate: true })
</script>
