<script setup lang="ts">
import AudioVisualiser from '@/components/AudioVisualiser.vue'
import ConfigurationPanel from '@/components/ConfigurationPanel.vue'
</script>

<template>
  <main>
    <ConfigurationPanel class="configuration" />
    <AudioVisualiser class="audiovisualiser" />
  </main>
</template>

<style scoped>
.configuration {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1;
  background-color: pink;
}
</style>
