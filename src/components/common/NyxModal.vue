<script setup lang="ts">
import NyxButton from './NyxButton.vue'

const props = defineProps<{
  title?: string
}>()

const emit = defineEmits(['close'])

const onClose = () => emit('close')
</script>

<template>
  <dialog>
    <header v-if="props.title || !!$slots.header">
      <slot name="header">
        <h1>{{ title }}</h1>
      </slot>
    </header>
    <section>
      <slot />
    </section>
    <footer>
      <slot name="footer">
        <NyxButton @click="onClose">Close</NyxButton>
      </slot>
    </footer>
  </dialog>
</template>

<style scoped>
dialog {
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* dialog:after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background);
  z-index: -1;
} */

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-heading);
}

section p {
  margin: 0.5rem 0;
}
</style>
