import { ref } from 'vue'
import { defineStore } from 'pinia'
import { UsermediaStatus } from '@/types'

export const useUsermediaStore = defineStore('usermedia', () => {
  const userStream = ref<MediaStream | null>(null)
  const status = ref(UsermediaStatus.Unknown)

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

  return {
    userStream,
    requestStream,
    status,
  }
})
