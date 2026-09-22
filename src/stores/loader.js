import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLoaderStore = defineStore('loader', () => {
  const isNavigationLoading = ref(false)
  const pendingRequests = ref(0)
  const isLoading = computed(() => isNavigationLoading.value || pendingRequests.value > 0)

  function showLoader() {
    isNavigationLoading.value = true
  }

  function hideLoader() {
    isNavigationLoading.value = false
  }

  function startRequest() {
    pendingRequests.value += 1
  }

  function endRequest() {
    pendingRequests.value = Math.max(0, pendingRequests.value - 1)
  }

  return { isLoading, showLoader, hideLoader, startRequest, endRequest }
})
