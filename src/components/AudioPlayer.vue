<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useAudioStore } from '@/stores/audio'

const audio = useAudioStore()
const elAudio = useTemplateRef<HTMLAudioElement>('elAudio')

const onAudioLoaded = () => {
  if (!elAudio.value) return
  audio.setCurrentAudioElement(elAudio.value)
  window.setTimeout(() => elAudio.value?.play(), 500)
}
</script>

<template>
  <audio ref="elAudio" src="@/assets/audio/two.mp3" controls loop @loadeddata="onAudioLoaded" />
</template>
