<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'

const onClick = () => console.log('click')
</script>

<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera />
    <TresMesh @click="onClick">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshNormalMaterial />
    </TresMesh>
  </TresCanvas>
</template>

<style scoped></style>
