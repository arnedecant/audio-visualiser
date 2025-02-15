import { ref } from 'vue'
import { defineStore } from 'pinia'
import { UsermediaStatus, VisualiserPreset } from '@/types'
import { useConfigurationStore } from './configuration'

const configuration = useConfigurationStore()

export const useUsermediaStore = defineStore('usermedia', () => {
  const userStream = ref<MediaStream | null>(null)
  const status = ref(UsermediaStatus.Unknown)
  const streamDimensions = ref<[number, number]>([0, 0])
  const currentVideo = ref<HTMLVideoElement | null>(null)
  const hiddenCanvas = document.createElement('canvas')
  const hiddenCanvasCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true })
  const currentVideoFrame = ref<ImageData | null>(null)

  const requestStream = async (
    constraints: MediaStreamConstraints = { video: true, audio: false },
  ) => {
    try {
      userStream.value = await navigator.mediaDevices.getUserMedia(constraints)
      status.value = UsermediaStatus.Success
    } catch (e) {
      console.error(e)
      status.value = UsermediaStatus.Fail
    }
  }

  const stopStream = () => {
    if (!userStream.value) return
    userStream.value.getTracks().forEach((track) => track.stop())
    userStream.value = null
    status.value = UsermediaStatus.None
  }

  const setStreamDimensions = (width: number, height: number) => {
    streamDimensions.value = [width, height]
  }

  const setCurrentVideoElement = (elVideo: HTMLVideoElement) => {
    currentVideo.value = elVideo
  }

  const getVideoFrameData = (useCache: boolean = false) => {
    if (!currentVideo.value || !hiddenCanvasCtx) return null
    if (useCache && currentVideoFrame.value) return currentVideoFrame.value
    const w = currentVideo.value.videoWidth
    const h = currentVideo.value.videoHeight
    setStreamDimensions(w, h)
    if (w === 0 && h === 0) return currentVideoFrame.value
    hiddenCanvas.width = w
    hiddenCanvas.height = h
    if (configuration.currentPreset === VisualiserPreset.Webcam) {
      hiddenCanvasCtx.translate(w, 0)
      hiddenCanvasCtx.scale(-1, 1)
    }
    hiddenCanvasCtx.drawImage(currentVideo.value, 0, 0)
    currentVideoFrame.value = hiddenCanvasCtx.getImageData(0, 0, w, h)
    return currentVideoFrame.value
  }

  return {
    currentVideo,
    currentVideoFrame,
    getVideoFrameData,
    requestStream,
    setCurrentVideoElement,
    setStreamDimensions,
    status,
    stopStream,
    streamDimensions,
    userStream,
  }
})
