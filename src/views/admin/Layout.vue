<template>
  <div class="h-[100vh] w-[vw] flex flex-col">
    <!-- Topbar -->
    <div class="h-[8%] w-full bg-[#0E6A97] flex items-center justify-center">
      <Topbar class="h-[90%] w-full flex items-center justify-between" />
    </div>

    <!-- Corps principal -->
    <div class="h-[92%] w-full flex">
      <!-- Navbar latérale -->
      <div class="h-full w-[6%] flex items-center justify-center">
        <Navbar class="h-full w-full bg-white border-r-4 border-r-black" />
      </div>

      <!-- Zone de contenu -->
      <div class="h-full w-[94%] relative overflow-hidden">
        <router-view v-slot="{ Component }" class="relative z-10">
          <component :is="Component" class="relative z-10" :active-report="selectedReport" @select-report="onSelectReport" />
        </router-view>

        <!-- 🗺️ Carte Leaflet en fond -->
        <div
          ref="mapContainer"
          class="absolute inset-0 z-0 transition-opacity duration-300"
          :class="{ 'opacity-0 pointer-events-none': isMapHidden, 'opacity-100': !isMapHidden }"
        />

        <!-- 🪟 Fenêtre de détail du rapport sélectionné, au-dessus de la carte -->
        <ReportDetail
          v-if="$route.name === 'Report'"
          :type="selectedReport"
          @close="selectedReport = null"
        />

        <!-- Badge coordonnées -->
        <div
          v-show="!isMapHidden && $route.name !== 'Vehicles' && $route.name !== 'Report'"
          class="absolute top-3 left-3 z-[1000] bg-[#081228]/80 backdrop-blur-sm text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 shadow pointer-events-none"
        >
          📍 {{ coords.lat }} / {{ coords.lng }} — zoom {{ coords.zoom }}
        </div>

        <!-- Bouton recentrer -->
        <button
          v-show="!isMapHidden && !selectedReport"
          @click="resetView"
          class="absolute bottom-4 right-4 z-[1000] bg-[#0E6A97] hover:bg-[#0b567c] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 active:scale-95"
        >
          ⌖ Recentrer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

import Navbar from '@/components/Navbar.vue'
import Topbar from '@/components/Topbar.vue'
import ReportDetail from '@/views/admin/ReportDetail.vue'

const DEFAULT_LAT = 6.3654
const DEFAULT_LNG = 2.4183
const DEFAULT_ZOOM = 13

export default {
  name: 'Layout',
  components: { Navbar, Topbar, ReportDetail },

  data() {
    return {
      map: null,
      coords: {
        lat: DEFAULT_LAT.toFixed(4),
        lng: DEFAULT_LNG.toFixed(4),
        zoom: DEFAULT_ZOOM,
      },
      selectedReport: null,
    }
  },

  watch: {
    '$route.name'(name) {
      // On réinitialise le rapport sélectionné dès qu'on quitte la page Rapports
      if (name !== 'Report') {
        this.selectedReport = null
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.map = L.map(this.$refs.mapContainer, {
        center: [DEFAULT_LAT, DEFAULT_LNG],
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(this.map)

      // déplacer le contrôle de zoom par défaut vers la droite
      L.control.zoom({ position: 'topright' }).addTo(this.map)

      L.marker([DEFAULT_LAT, DEFAULT_LNG])
        .addTo(this.map)
        .bindPopup('<b>📍 Cotonou, Bénin</b>')
        .openPopup()

      this.map.on('moveend zoomend', () => {
        const c = this.map.getCenter()
        this.coords = {
          lat: c.lat.toFixed(4),
          lng: c.lng.toFixed(4),
          zoom: this.map.getZoom(),
        }
      })
    })
  },

  beforeUnmount() {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  },

  computed: {
    isDashboard() {
      return this.$route.name === 'Dashboard'
    },
    isMapHidden() {
      return this.isDashboard || this.$route.name === 'Alert'
    },
  },

  methods: {
    resetView() {
      this.map.setView([DEFAULT_LAT, DEFAULT_LNG], DEFAULT_ZOOM)
    },

    onSelectReport(report) {
      this.selectedReport = report
    },
  },
}
</script>
