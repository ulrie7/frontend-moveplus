<template>
  <div class="h-[90%] w-[90%] flex items-center justify-between">
    <div class="h-[100%] w-[20%] flex items-center justify-start pl-2">
      <img src="@/assets/Images/Move+ Blanc.png" alt="Logo" class="w-[180px] max-w-[160px] object-contain mr-[60px]" />
    </div>
    <div class="h-[100%] w-[20%] flex items-center justify-end pr-[50px]">
      <div class="relative">
        <button
          type="button"
          class="flex items-center space-x-2 cursor-pointer"
          aria-label="Ouvrir le menu du profil"
          :aria-expanded="isProfileMenuOpen"
          aria-haspopup="menu"
          @click="toggleProfileMenu"
        >
          <img
            src="@/assets/Images/Professional Business Woman Outfit ideas.jpg"
            alt="Profil"
            class="w-10 h-10 rounded-full object-cover border border-gray-300 object-center"
            style="object-position: center top"
          />
          <span class="font-semibold text-gray-800">Niriella DOE</span>
          <span class="material-symbols-outlined text-2xl text-gray-800">expand_more</span>
        </button>

        <div
          v-if="isProfileMenuOpen"
          class="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
          role="menu"
        >
          <button
            type="button"
            class="flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
            role="menucomposant"
            @click="isProfileMenuOpen = false"
          >
            <span class="material-symbols-outlined mr-3 text-xl ">manage_accounts</span>
            Modifier le profil
          </button>
          <button
            type="button"
            class="flex w-full items-center px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
            role="menucomposant"
            @click="logout"
          >
            <span class="material-symbols-outlined mr-3 text-xl ">logout</span>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isProfileMenuOpen = ref(false)

const toggleProfileMenu = () => (isProfileMenuOpen.value = !isProfileMenuOpen.value)

const logout = () => {
  localStorage.removeItem('accessToken') 
  router.push({ name: 'LogIn' })
}
</script>
