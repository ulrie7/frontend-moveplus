<template>
  <div class="container-dashboard h-full w-full bg-[#E8E7E7] flex  justify-center items-center ">
    <div class="h-[95%] w-[95%] flex flex-col justify-between ">
      <div class="h-[8%] w-[97%] bg-[white] flex items-center ml-4 rounded-lg">
        <div
          class="h-[80%] w-[15%] flex justify-center items-center rounded-lg"
        >
          <div class="icon h-[100%] w-[20%] flex justify-center items-center">
            <span class="material-symbols-outlined"> dashboard </span>
          </div>
          <div class="text h-[100%] w-[80%]  flex justify-start items-center">
            <span class="font-semibold text-[20px]">Dashboard</span>
          </div>
        </div>
      </div> 
      <div class="h-[17%] w-[100%] flex justify-between gap-4 px-4">
        <div class="h-[100%] w-[22%] bg-[green] rounded-lg shadow-sm">
          <div
            class="h-[35%] w-[100%] bg-[#219ebc] flex justify-center items-center rounded-t-lg text-white font-semibold"
          >
            TOUS LES VEHICULES
          </div>
          <div
            class="h-[65%] w-[100%] bg-[white] flex justify-center items-center text-2xl font-bold rounded-b-lg"
          >
            12
          </div>
        </div>
        <div class="h-[100%] w-[22%] bg-[green] rounded-lg shadow-sm">
          <div
            class="h-[35%] w-[100%] bg-[#219ebc] flex justify-center items-center rounded-t-lg text-white font-semibold"
          >
            EN MOUVEMENT 
          </div>
          <div
            class="h-[65%] w-[100%] bg-[white] flex justify-center items-center text-2xl font-bold rounded-b-lg"
          >
            7
          </div>
        </div>
        <div class="h-[100%] w-[22%] bg-[green] rounded-lg shadow-sm">
          <div
            class="h-[35%] w-[100%] bg-[#219ebc] flex justify-center items-center rounded-t-lg text-white font-semibold"
          >
            DISTANCE AUJOURD'HUI
          </div>
          <div
            class="h-[65%] w-[100%] bg-[white] flex justify-center items-center text-2xl font-bold rounded-b-lg"
          >
            375Km
          </div>
        </div>
        <div class="h-[100%] w-[22%] bg-[green] rounded-lg shadow-sm">
          <div
            class="h-[35%] w-[100%] bg-[#219ebc] flex justify-center items-center rounded-t-lg text-white font-semibold"
          >
            VEHICULES EN ALERTES
          </div>
          <div
            class="h-[65%] w-[100%] bg-[white] flex justify-center items-center text-2xl font-bold rounded-b-lg"
          >
            3
          </div>
        </div>
      </div>

      <div class="h-[65%] w-[100%]  flex items-stretch justify-between gap-4 px-4 pb-4">
        <div
          class="relative h-full min-h-0 w-[48%] rounded-[8px] overflow-hidden shadow-lg "
        >
          <router-view
            class="relative z-[10] flex h-full flex-col justify-center items-center p-4"
          />
          <div
            ref="mapContainer"
            class="absolute inset-0 z-0 transition-opacity duration-300"
          ></div>

          <div
            class="absolute top-3 left-3 z-[1000] bg-[#081228]/80 backdrop-blur-sm text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 shadow"
          >
            📍 {{ coords.lat }} / {{ coords.lng }} — zoom {{ coords.zoom }}
          </div>

          <button
            @click="resetView"
            class="absolute bottom-4 right-4 z-[1000] bg-[#0E6A97] hover:bg-[#0b567c] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 active:scale-95"
          >
            ⌖ Recentrer
          </button>
        </div>

        <div class="h-full min-h-0 w-[48%] bg-[white] rounded-[8px] shadow-lg overflow-hidden">
          <div class="h-full flex flex-col">
            <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h2 class="text-xl font-semibold text-slate-900">Liste des véhicules</h2>
              <p class="mt-1 text-sm text-slate-500">
                Suivi des statuts, niveaux de batterie et vitesse.
              </p>
            </div>
            <div class="flex-1 min-h-0 overflow-auto">
              <div class="h-full w-full bg-slate-100 p-4">
                <table class="min-w-full divide-y divide-slate-200">
                  <thead class="bg-slate-100">
                    <tr>
                      <th
                        class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Véhicule
                      </th>
                      <th
                        class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Statut
                      </th>
                      <th
                        class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Batterie
                      </th>
                      <th
                        class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Vitesse
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 bg-white">
                    <tr
                      v-for="(vehicle, index) in vehicles"
                      :key="index"
                      class="transition-colors duration-150 hover:bg-slate-50"
                    >
                      <td class="px-4 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-slate-900">{{ vehicle.name }}</div>
                        <div class="text-xs text-slate-500">{{ vehicle.id }}</div>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-center">
                        <span
                          :class="
                            vehicle.status === 'EN LIGNE'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-100 text-rose-700 border border-rose-200'
                          "
                          class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                        >
                          {{ vehicle.status }}
                        </span>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-center text-sm text-slate-900">
                        {{ vehicle.battery }}%
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-center text-sm text-slate-700">
                        {{ vehicle.speed }} km/h
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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

const DEFAULT_LAT = 6.3654
const DEFAULT_LNG = 2.4183
const DEFAULT_ZOOM = 13

export default {
  name: 'Dashboard',

  data() {
    return {
      map: null,
      coords: {
        lat: DEFAULT_LAT.toFixed(4),
        lng: DEFAULT_LNG.toFixed(4),
        zoom: DEFAULT_ZOOM,
      },
      vehicles: [
        { id: 'A01', name: 'Renault Kangoo', status: 'EN LIGNE', battery: 84, speed: 56 },
        { id: 'B12', name: 'Peugeot 3008', status: 'EN LIGNE', battery: 62, speed: 44 },
        { id: 'C23', name: 'Fiat Ducato', status: 'HORS LIGNE', battery: 0, speed: 0 },
        { id: 'D34', name: 'Volkswagen Caddy', status: 'EN LIGNE', battery: 49, speed: 28 },
      ],
    }
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

      L.control.zoom({ position: 'topright' }).addTo(this.map)

      L.marker([DEFAULT_LAT, DEFAULT_LNG])
        .addTo(this.map)
        .bindPopup('<b>📍 Cotonou, Bénin</b>')
        .openPopup()

      this.map.on('moveend zoomend', () => {
        const center = this.map.getCenter()
        this.coords = {
          lat: center.lat.toFixed(4),
          lng: center.lng.toFixed(4),
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

  methods: {
    resetView() {
      if (this.map) {
        this.map.setView([DEFAULT_LAT, DEFAULT_LNG], DEFAULT_ZOOM)
      }
    },
  },
}
</script>

<style scoped>
.container-dashboard {
  font-family: 'Century Gothic', 'CenturyGothic', Arial, sans-serif;
}
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

</style>
