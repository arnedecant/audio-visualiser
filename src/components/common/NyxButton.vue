<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'button',
  },
)

const emit = defineEmits(['click'])
</script>

<template>
  <button :type="props.type" @click="emit('click')">
    <slot />
  </button>
</template>

<style scoped>
button {
  all: unset;
  cursor: pointer;
  background-color: var(--color-primary);
  color: var(--color-primary--darker);
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: var(--color-primary--light);
}
</style>
