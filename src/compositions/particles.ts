import { useConfigurationStore } from '@/stores/configuration'
import { VisualiserTheme, type RGB } from '@/types'
import { hexToRgb } from '@/utils/color'
import { storeToRefs } from 'pinia'
import { BufferAttribute, Points, Scene, type TypedArray } from 'three'
import type { Ref } from 'vue'

const step = 3
const configuration = useConfigurationStore()
const { currentTheme } = storeToRefs(configuration)

export const useParticles = (scene: Ref<Scene>) => {
  let indices: number[] = []

  const getBufferAttribute = (data: number[]) => {
    const arr = new Float32Array(data)
    return new BufferAttribute(arr, 3)
  }

  const getGeometryData = (frameData: ImageData) => {
    const verticesData: number[] = []
    const colorData: number[] = []
    const colorsPerFace = [
      '#f0932b',
      '#eb4d4b',
      '#6ab04c',
      '#22a6b3',
      '#be2edd',
      '#4834d4',
      '#130f40',
    ]

    for (let y = 0, height = frameData.height; y < height; y += step) {
      for (let x = 0, width = frameData.width; x < width; x += step) {
        const index = (x + y * width) * 4
        indices.push(index)

        const data = frameData.data
        const gray = (data[index] + data[index + 1] + data[index + 2]) / 3
        const vX = x - frameData.width / 2 // Shift in X direction since origin is center of screen
        const vY = -y + frameData.height / 2 // Shift in Y direction in the same way (you need -y)
        const vZ = gray < 300 ? gray : 10000
        verticesData.push(vX, vY, vZ)

        let color = hexToRgb('#555555')
        if (currentTheme.value === VisualiserTheme.Discodip) {
          color = hexToRgb(colorsPerFace[Math.floor(Math.random() * colorsPerFace.length)])
        }

        colorData.push(color.r, color.g, color.b)
      }
    }

    return {
      position: getBufferAttribute(verticesData),
      color: getBufferAttribute(colorData),
    }
  }

  // const drawFrameData = (particles: Points, uniforms: object, frameData: ImageData) => {}

  const transformPositions = (
    positions: TypedArray,
    frameData: ImageData,
    rgb: RGB,
    isRenderAllowed: boolean = true,
  ) => {
    // const spread = 2
    const threshold = 300
    const multiplier = 3
    const skip = 2
    let count = 0
    for (let i = 0; i < positions.length; i += 3) {
      // Take an average of RGB and make it a gray value.
      const index = indices[count]
      const gray =
        (frameData.data[index] + frameData.data[index + 1] + frameData.data[index + 2]) / 3
      const shouldRender = isRenderAllowed || i % skip === 0
      if (gray < threshold && shouldRender) {
        if (gray < threshold / 3) {
          positions[i + 2] = gray * rgb.r * multiplier
        } else if (gray < threshold / 2) {
          positions[i + 2] = gray * rgb.g * multiplier
        } else {
          positions[i + 2] = gray * rgb.b * multiplier
        }
      } else {
        positions[i + 2] = 10000
      }
      count++
    }
  }

  const clearParticles = (particles: Points | null) => {
    indices = []
    if (particles === null) return
    particles.geometry.dispose()
    if (Array.isArray(particles.material)) {
      for (const material of particles.material) {
        material.dispose()
      }
    } else {
      particles.material.dispose()
    }
    scene.value.remove(particles)
  }

  return {
    getBufferAttribute,
    getGeometryData,
    transformPositions,
    clearParticles,
  }
}
