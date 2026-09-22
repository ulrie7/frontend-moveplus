<script setup>
import { Vue3Lottie } from 'vue3-lottie'
import { useLoaderStore } from '@/stores/loader'
import loaderAnimation from '@/stores/loader.json'

const loader = useLoaderStore()
</script>

<template>
  <Transition name="loader-fade">
    <div v-if="loader.isLoading" class="loader-overlay" id="loader-overlay">
      <Vue3Lottie
        :animationData="loaderAnimation"
        :loop="true"
        :autoPlay="true"
        :height="120"
        :width="120"
      />
    </div>
  </Transition>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Fade transition */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.3s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>
