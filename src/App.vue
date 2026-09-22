<script setup>
import LoaderOverlay from '@/components/LoaderOverlay.vue'
import { useLoaderStore } from '@/stores/loader'

const loader = useLoaderStore()
</script>

<template>
  <div>
    <LoaderOverlay />
    <router-view />
  </div>
</template>

<style scoped></style>
