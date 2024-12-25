import { ref } from 'vue'
import { defineStore } from 'pinia'
import { UsermediaStatus } from '@/types'

export const useUsermediaStore = defineStore('usermedia', () => {
  const userStream = ref<MediaStream | null>(null)
  const status = ref(UsermediaStatus.Unknown)
  const streamDimensions = ref<[number, number]>([0, 0])
  const currentVideo = ref<HTMLVideoElement | null>(null)

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

  const setCurrentVideo = (elVideo: HTMLVideoElement) => {
    currentVideo.value = elVideo
  }

  return {
    userStream,
    requestStream,
    status,
    streamDimensions,
    setStreamDimensions,
    setCurrentVideo,
    currentVideo,
  }
})
