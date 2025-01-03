<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useAudioStore } from '@/stores/audio'

const isPlaying = ref(false)
const audio = useAudioStore()
const elAudio = useTemplateRef<HTMLAudioElement>('elAudio')

const onAudioLoaded = () => {
  if (!elAudio.value) return
  audio.setCurrentAudioElement(elAudio.value)
}

const onClickPlay = () => {
  if (!elAudio.value) return
  if (isPlaying.value) {
    elAudio.value.pause()
  } else {
    elAudio.value.play()
  }
  isPlaying.value = !isPlaying.value
}
</script>

<template>
  <audio ref="elAudio" src="@/assets/audio/two.mp3" controls loop @loadeddata="onAudioLoaded" />
</template>
