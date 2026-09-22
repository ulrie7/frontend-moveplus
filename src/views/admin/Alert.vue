<template>
  <div class="h-screen w-full bg-[#E8E7E7] text-white flex flex-col px-7">
    <!-- ================= HEADER ================= -->
    <header
      class="sticky top-0 z-20 h-[10%] min-h-[80px] w-full shrink-0 rounded-b-lg border-b border-gray-700/80 px-5 py-3 shadow-lg shadow-black/10 backdrop-blur-md transition-colors duration-200 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
      :class="isScrolled ? 'bg-[#292929]' : 'bg-[#5A5A5A]'"
    >
      <div class="flex h-full w-[55%] min-w-0 items-center gap-2.5">
        <span class="material-symbols-outlined h-8 w-8 shrink-0 text-[#fffffff]">
          notifications_active
        </span>

        <div class="min-w-0">
          <h1 class="text-xl font-bold tracking-tight sm:text-2xl">Alertes</h1>
          <p class="mt-1 text-xs text-gray-400 sm:text-sm">
            Surveillance en temps réel de votre flotte de véhicules
          </p>
        </div>
      </div>

      <div class="relative h-[42px] w-full shrink-0 sm:max-w-[30%] min-w-[220px]">
        <span
          class="material-symbols-outlined absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 text-[#219ebc]"
        >
          search
        </span>

        <input
          v-model="search"
          type="text"
          aria-label="Rechercher une alerte"
          placeholder="Rechercher une alerte, un véhicule..."
          class="h-[42px] w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-[#219ebc] focus:border-[#219ebc] focus:ring-2 focus:ring-[#219ebc]/20"
        />

        <button
          v-if="search"
          type="button"
          aria-label="Effacer la recherche"
          @click="search = ''"
          class="material-symbols-outlined absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          close
        </button>
      </div>
    </header>

    <!-- ================= KPI ================= -->
    <section class="grid grid-cols-4 gap-3 py-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex h-[18%] min-h-[96px] w-full flex-col items-center justify-center rounded-lg border border-gray-400 bg-[#FFFFFF] p-4 text-center shadow-sm"
      >
        <p class="text-sm font-medium text-black">{{ stat.label }}</p>
        <h2 class="mt-1 text-2xl font-bold leading-none" :class="stat.className">
          {{ stat.value }}
        </h2>
      </div>
    </section>

    <!-- ================= ALERT LIST ================= -->
    <main
      ref="alertScroll"
      class="alert-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth pb-3 pr-2 space-y-2"
      @scroll="handleScroll"
    >
      <p v-if="search" class="px-1 text-xs text-gray-500">
        {{ filteredAlerts.length }} résultat{{ filteredAlerts.length > 1 ? 's' : '' }} trouvé{{
          filteredAlerts.length > 1 ? 's' : ''
        }}
      </p>
      <div
        v-for="alert in filteredAlerts"
        :key="alert.id"
        @click="selectedAlert = alert"
        class="h-[20%] min-h-[120px] w-full rounded-lg border border-gray-400 bg-[#ffffff] px-4 py-3 text-black shadow-sm transition cursor-pointer hover:brightness-105"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center"
            :class="iconColor(alert.level)"
          >
            <span class="material-symbols-outlined flex text-xl">
              {{ alert.icon }}
            </span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-semibold text-black">
                {{ alert.type }}
              </h3>

              <span class="text-xs px-2 py-1 rounded-full" :class="badgeColor(alert.level)">
                {{ alert.level }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm">
              <p class="text-gray-600">{{ alert.vehicle }}</p>
              <span class="text-gray-500">•</span>
              <p class="text-gray-600">Seuil : {{ alert.threshold }}</p>
            </div>

            <p class="text-gray-700 text-sm mt-2">
              {{ alert.message }}
            </p>
          </div>

          <div class="shrink-0 min-w-[76px] text-right">
            <p class="text-xs text-gray-500">{{ alert.date }}</p>
            <p class="text-sm text-gray-700 mt-1">{{ alert.time }}</p>

            <div
              v-if="!alert.read"
              class="inline-block w-2.5 h-2.5 bg-[#0E6A97] rounded-full mt-2"
            ></div>
          </div>
        </div>
      </div>
    </main>

    <!-- ================= DETAIL MODAL ================= -->
    <div
      v-if="selectedAlert"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        class="w-[88%] max-w-[460px] rounded-xl border border-gray-700 bg-[#111827] shadow-2xl shadow-black/30"
      >
        <!-- top -->
        <div class="flex items-center justify-between border-b border-gray-600/80 p-3.5">
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg"
              :class="iconColor(selectedAlert.level)"
            >
              <span class="material-symbols-outlined text-lg">
                {{ selectedAlert.icon }}
              </span>
            </div>

            <div class="min-w-0">
              <h2 class="truncate text-base font-bold text-white">
                {{ selectedAlert.type }}
              </h2>

              <p class="text-xs text-gray-400">
                {{ selectedAlert.vehicle }}
              </p>
            </div>
          </div>

          <button
            @click="selectedAlert = null"
            class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Fermer le détail de l'alerte"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- body -->
        <div class="space-y-3 p-3.5">
          <div class="grid grid-cols-2 gap-2.5">
            <div class="h-[74px] rounded-lg border border-gray-700 bg-[#1A2436] p-2.5">
              <p class="text-[10px] uppercase tracking-wide text-gray-400">IMEI</p>
              <h3 class="mt-1 text-sm font-semibold text-white">{{ selectedAlert.imei }}</h3>
            </div>

            <div class="h-[74px] rounded-lg border border-gray-700 bg-[#1A2436] p-2.5">
              <p class="text-[10px] uppercase tracking-wide text-gray-400">Gravité</p>
              <h3 class="mt-1 text-sm font-semibold text-white">{{ selectedAlert.level }}</h3>
            </div>

            <div class="h-[74px] rounded-lg border border-gray-700 bg-[#1A2436] p-2.5">
              <p class="text-[10px] uppercase tracking-wide text-gray-400">Seuil</p>
              <h3 class="mt-1 text-sm font-semibold text-white">{{ selectedAlert.threshold }}</h3>
            </div>

            <div class="h-[74px] rounded-lg border border-gray-700 bg-[#1A2436] p-2.5">
              <p class="text-[10px] uppercase tracking-wide text-gray-400">Générée le</p>
              <h3 class="mt-1 text-sm font-semibold text-white">{{ selectedAlert.date }}</h3>
            </div>
          </div>

          <div>
            <p class="mb-1.5 text-xs font-medium text-gray-400">Description</p>

            <div
              class="rounded-lg border border-gray-700 bg-[#1A2436] p-2.5 text-sm leading-relaxed text-gray-200"
            >
              {{ selectedAlert.message }}
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="flex justify-end gap-2 border-t border-gray-700/80 p-3.5">
          <button
            @click="selectedAlert = null"
            class="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-200 transition hover:bg-slate-700"
          >
            Fermer
          </button>

          <button
            @click="readAlert(selectedAlert)"
            class="rounded-lg bg-[#0E6A97] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#0d5c84]"
          >
            Marquer comme lue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const search = ref('')
const selectedAlert = ref(null)
const alertScroll = ref(null)
const isScrolled = ref(false)

const handleScroll = (event) => {
  isScrolled.value = event.currentTarget.scrollTop > 0
}

onMounted(() => {
  alertScroll.value.scrollTop = 0
})

const alerts = ref([
  {
    id: 1,
    type: 'Excès de vitesse détecté',
    vehicle: 'Toyota Corolla • VH-024',
    imei: '356845291785421',
    level: 'Critique',
    threshold: '100 km/h',
    message: 'Le véhicule a dépassé la limite de vitesse autorisée.',
    date: '11 Sept 2026',
    time: '10:42',
    icon: 'speed',
    read: false,
  },
  {
    id: 2,
    type: 'Batterie faible',
    vehicle: 'Hyundai Tucson • VH-011',
    imei: '356845291785422',
    level: 'Avertissement',
    threshold: '20%',
    message: 'Le niveau de batterie du GPS est inférieur à 20 %.',
    date: '11 Sept 2026',
    time: '10:18',
    icon: 'battery_alert',
    read: false,
  },
  {
    id: 3,
    type: 'Sortie de zone',
    vehicle: 'Kia Sportage • VH-008',
    imei: '356845291785423',
    level: 'Information',
    threshold: 'Zone A',
    message: 'Le véhicule a quitté la zone autorisée.',
    date: '11 Sept 2026',
    time: '09:54',
    icon: 'location_off',
    read: true,
  },
  {
    id: 4,
    type: 'Température moteur élevée',
    vehicle: 'Ford Ranger • VH-015',
    imei: '356845291785424',
    level: 'Critique',
    threshold: '105 °C',
    message: 'La température du moteur dépasse le seuil recommandé.',
    date: '11 Sept 2026',
    time: '09:32',
    icon: 'device_thermostat',
    read: false,
  },
  {
    id: 5,
    type: 'Entretien à prévoir',
    vehicle: 'Renault Duster • VH-019',
    imei: '356845291785425',
    level: 'Avertissement',
    threshold: '500 km',
    message: 'Une révision du véhicule est bientôt nécessaire.',
    date: '11 Sept 2026',
    time: '08:47',
    icon: 'build',
    read: false,
  },
  {
    id: 6,
    type: 'Véhicule immobilisé',
    vehicle: 'Peugeot 3008 • VH-006',
    imei: '356845291785426',
    level: 'Information',
    threshold: '15 min',
    message: 'Le véhicule est resté immobile pendant plus de 15 minutes.',
    date: '11 Sept 2026',
    time: '08:15',
    icon: 'directions_car',
    read: true,
  },
  {
    id: 7,
    type: 'Perte de signal GPS',
    vehicle: 'Toyota Hilux • VH-021',
    imei: '356845291785427',
    level: 'Avertissement',
    threshold: '10 min',
    message: 'Le signal GPS du véhicule est indisponible depuis 10 minutes.',
    date: '11 Sept 2026',
    time: '07:58',
    icon: 'gps_off',
    read: true,
  },
])

const critical = computed(() => alerts.value.filter((a) => a.level === 'Critique').length)
const warning = computed(() => alerts.value.filter((a) => a.level === 'Avertissement').length)
const info = computed(() => alerts.value.filter((a) => a.level === 'Information').length)
const unread = computed(() => alerts.value.filter((a) => !a.read).length)

const stats = computed(() => [
  { label: 'Critiques', value: critical.value, className: 'text-red-500' },
  { label: 'Avertissements', value: warning.value, className: 'text-amber-400' },
  { label: 'Informations', value: info.value, className: 'text-green-400' },
  { label: 'Non lues', value: unread.value, className: 'text-[#0E6A97]' },
])

const normalizeText = (value) =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const filteredAlerts = computed(() => {
  const query = normalizeText(search.value.trim())

  if (!query) return alerts.value

  return alerts.value.filter((alert) => {
    const searchableText = [
      alert.type,
      alert.vehicle,
      alert.imei,
      alert.level,
      alert.threshold,
      alert.message,
      alert.date,
      alert.time,
    ]
      .map(normalizeText)
      .join(' ')

    return searchableText.includes(query)
  })
})

const readAlert = (alert) => {
  alert.read = true
  selectedAlert.value = null
}

const levelStyles = {
  Critique: { badge: 'bg-red-500/20 text-red-400', icon: 'bg-red-500' },
  Avertissement: { badge: 'bg-amber-500/20 text-amber-300', icon: 'bg-amber-500' },
  Information: { badge: 'bg-green-500/20 text-green-300', icon: 'bg-green-500' },
}

const badgeColor = (level) => levelStyles[level]?.badge || levelStyles.Information.badge
const iconColor = (level) => levelStyles[level]?.icon || levelStyles.Information.icon
</script>

<style scoped>
.alert-scroll {
  scrollbar-width: thin;
  scrollbar-color: #475569 transparent;
  scrollbar-gutter: stable;
}

.alert-scroll::-webkit-scrollbar {
  width: 5px;
}
.alert-scroll::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 999px;
  border: 1px solid transparent;
  background-clip: padding-box;
}
.alert-scroll::-webkit-scrollbar-thumb:hover {
  background: #64748b;
  background-clip: padding-box;
}
.alert-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.material-symbols-outlined {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-variation-settings: 'FILL' 1;
}
</style>
