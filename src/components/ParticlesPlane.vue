<script setup lang="ts">
// @ts-expect-error: load shader
import fragmentShader from '@/shaders/particles/fragment.glsl'
// @ts-expect-error: load shader
import vertexShader from '@/shaders/particles/vertex.glsl'
import { useUsermediaStore } from '@/stores/usermedia'
import { AdditiveBlending, BufferGeometry, ShaderMaterial, Points } from 'three'
import { watch, onMounted, ref } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import { VisualiserPreset, type RGB } from '@/types'
import { useAudioStore } from '@/stores/audio'
import { useParticles } from '@/compositions/particles'
import { useConfigurationStore } from '@/stores/configuration'
import { storeToRefs } from 'pinia'

const { onBeforeRender } = useLoop()
const { scene } = useTresContext()
const usermedia = useUsermediaStore()
const audio = useAudioStore()
const configuration = useConfigurationStore()
const { currentTheme, currentPreset } = storeToRefs(configuration)
const uniforms = ref({
  time: { type: 'f', value: 0.0 },
  size: { type: 'f', value: 10.0 },
  density: { type: 'f', value: 0.1 },
  isPlaying: { type: 'b', value: true },
  isWebcam: { type: 'b', value: true },
})

let particles: Points | null = null
const geometry = new BufferGeometry()
const material = new ShaderMaterial({
  uniforms: uniforms.value,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: AdditiveBlending,
})

const { getGeometryData, transformPositions, clearParticles } = useParticles(scene)

const setup = () => {
  clearParticles(particles)
  uniforms.value.isWebcam.value = currentPreset.value === VisualiserPreset.Webcam
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
  const rgb: RGB = audio.getFrequencyRgb()
  const isWebcam = uniforms.value.isWebcam.value
  transformPositions(particles.geometry.attributes.position.array, frameData, rgb, isWebcam)
  uniforms.value.size.value = ((rgb.r + rgb.g + rgb.b) / 3) * 35 + 5
  particles.geometry.attributes.position.needsUpdate = true
}

onBeforeRender(({ elapsed }) => {
  const useCache = elapsed % 2 === 0
  const frameData = usermedia.getVideoFrameData(useCache)
  if (!frameData) return
  drawFrameData(frameData)
})

watch(currentTheme, setup)
watch(currentPreset, () => {
  // setup()
  window.setTimeout(setup, 500)
})
onMounted(setup)
</script>
