<script setup lang="ts">
import AudioVisualiser from '@/components/AudioVisualiser.vue'
import Configuration from '@/components/Configuration.vue'
</script>

<template>
  <main>
    <Configuration class="configuration" />
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
