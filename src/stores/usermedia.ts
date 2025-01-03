import { ref } from 'vue'
import { defineStore } from 'pinia'
import { UsermediaStatus } from '@/types'

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
    hiddenCanvas.width = w
    hiddenCanvas.height = h
    hiddenCanvasCtx.translate(w, 0)
    hiddenCanvasCtx.scale(-1, 1)
    hiddenCanvasCtx.drawImage(currentVideo.value, 0, 0)
    currentVideoFrame.value = hiddenCanvasCtx.getImageData(0, 0, w, h)
    return currentVideoFrame.value
  }

  return {
    userStream,
    requestStream,
    status,
    streamDimensions,
    setStreamDimensions,
    setCurrentVideoElement,
    currentVideo,
    getVideoFrameData,
    currentVideoFrame,
  }
})
