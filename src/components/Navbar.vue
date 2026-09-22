<template>
  <div class="h-full w-full bg-white border-r-4 border-r-transparent">
    <div class="h-[35%] w-full flex flex-col items-center justify-start">
      <router-link
        to="/dashboard"
        class="nav-link h-[21.5%] w-full flex items-center justify-center transition-colors border-l-4 border-l-transparent hover:border-l-[#0E6A97] border-b border-black/40"
        active-class="active-nav-link"
      >
        <span class="material-symbols-outlined text-4xl text-black">dashboard</span>
      </router-link>
      <router-link
        to="/vehicles"
        class="nav-link h-[21.5%] w-full flex items-center justify-center transition-colors border-l-4 border-l-transparent hover:border-l-[#0E6A97] border-b border-black/40"
        active-class="active-nav-link"
      >
        <span class="material-symbols-outlined text-4xl text-black">directions_car</span>
      </router-link>
      <router-link
        to="/report"
        class="nav-link h-[21.5%] w-full flex items-center justify-center transition-colors border-l-4 border-l-transparent hover:border-l-[#0E6A97] border-b border-black/40"
        active-class="active-nav-link"
      >
        <span class="material-symbols-outlined text-4xl text-black">finance</span>
      </router-link>
      <router-link
        to="/alert"
        class="nav-link h-[21.5%] w-full flex items-center justify-center transition-colors border-l-4 border-l-transparent hover:border-l-[#0E6A97] border-b border-black/40"
        active-class="active-nav-link"
      >
        <span class="material-symbols-outlined text-4xl text-black">notifications</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>

<style scoped>
.nav-link {
  border-left: 4px solid transparent;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.active-nav-link {
  border-left-color: #0E6A97;

}
</style>
