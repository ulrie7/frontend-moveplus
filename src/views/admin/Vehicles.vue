<template>
  <div class="relative h-full w-full flex justify-between">
    <div
      class="container-vehicles h-full w-[33%] bg-[#E8E7E7] relative z-10 flex flex-col justify-between border-l border-r border-gray-800"
    >
      <!-- En-tête -->
      <div class="h-[8%] w-[100%] bg-[#595959] flex justify-between">
        <div class="h-[100%] w-[40%] flex">
          <div class="h-[100%] w-[20%] flex justify-center items-center">
            <span class="material-symbols-outlined text-white">directions_car</span>
          </div>
          <div class="h-[100%] w-[80%] flex justify-start items-center">
            <span class="font-semibold text-[18px] text-white">Véhicules</span>
          </div>
        </div>

        <div class="h-[100%] w-[20%] flex">
          <button
            type="button"
            class="h-full w-1/2 flex justify-center items-center cursor-pointer"
            @click="openModal"
          >
            <span class="material-symbols-outlined text-white">add_circle</span>
          </button>

          <button
            type="button"
            class="h-full w-1/2 bg-red-500 flex justify-center items-center cursor-pointer"
            @click="closeVehicles"
          >
            <span class="material-symbols-outlined text-white">close</span>
          </button>
        </div>
      </div>

      <!-- Recherche -->
      <div class="h-[12%] w-full flex justify-center items-center">
        <div class="h-[60%] w-[80%] flex">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Numéro d'appareil, IMEI, Numéro de téléphone"
            class="h-full w-[90%] px-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button class="h-full w-[10%] bg-[#595959] flex justify-center items-center">
            <span class="material-symbols-outlined text-white">search</span>
          </button>
        </div>
      </div>

      <!-- ============ ONGLETS DE FILTRE (style ALL / DRIVING / PARKED) ============ -->
      <div class="h-[9%] w-full flex justify-center items-center border-b border-gray-600 bg-white">
        <div class="h-full w-[95%] flex items-stretch">
          <button
            type="button"
            class="filter-tab"
            :class="activeFilter === 'all' ? 'filter-tab-active' : ''"
            @click="activeFilter = 'all'"
          >
            Tous ({{ totalVehiclesCount }})
          </button>

          <button
            type="button"
            class="filter-tab"
            :class="activeFilter === 'online' ? 'filter-tab-active' : ''"
            @click="activeFilter = 'online'"
          >
            En ligne ({{ onlineVehiclesCount }})
          </button>

          <button
            type="button"
            class="filter-tab"
            :class="activeFilter === 'offline' ? 'filter-tab-active' : ''"
            @click="activeFilter = 'offline'"
          >
            Hors ligne ({{ offlineVehiclesCount }})
          </button>
        </div>
      </div>
      <!-- ============ FIN ONGLETS DE FILTRE ============ -->

      <!-- ================= LISTE FILTRÉE ================= -->
      <div class="h-[69%] w-full overflow-y-auto px-4 py-3">
        <ul v-if="filteredVehicles.length" class="space-y-3">
          <li
            v-for="(savedVehicle, index) in filteredVehicles"
            :key="`${savedVehicle.immatriculation}-${index}`"
            class="vehicle-card w-full bg-gray-200 border border-gray-300 rounded-lg px-4 py-3 flex items-start justify-between gap-3 cursor-pointer"
            @click="openVehicleActions(savedVehicle)"
          >
            <!-- Icône + nom + sous-titre date/heure -->
            <div class="flex items-start gap-3 min-w-0">
              <div
                class="vehicle-icon-avatar"
                :class="
                  savedVehicle.status === 'online'
                    ? 'vehicle-icon-avatar-online'
                    : 'vehicle-icon-avatar-offline'
                "
              >
                <span class="material-symbols-outlined">directions_car</span>
              </div>

              <div class="min-w-0 pt-0.5">
                <p class="font-semibold text-gray-900 text-sm truncate">
                  {{
                    savedVehicle.name ||
                    `${savedVehicle.brand || 'Marque inconnue'} ${savedVehicle.modele || 'Modèle inconnu'}`
                  }}
                </p>
                <p class="text-xs text-gray-400 truncate">
                  {{ savedVehicle.lastUpdate ? formatDate(savedVehicle.lastUpdate) : '--' }} /
                  {{ savedVehicle.lastUpdate ? formatTime(savedVehicle.lastUpdate) : '--' }}
                </p>
              </div>
            </div>

            <!-- Triangle d'alerte + badge de statut façon "TRIP" -->
            <div class="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
              <span
                v-if="savedVehicle.hasWarning"
                class="material-symbols-outlined text-amber-500 text-[16px] leading-none"
                title="Alerte sur ce véhicule"
              >
                warning
              </span>

              <button
                type="button"
                class="trip-pill"
                title="Recentrer la carte sur ce véhicule"
                @click.stop="recenterOnVehicle(savedVehicle)"
              >
                TRIP
              </button>
            </div>
          </li>
        </ul>

        <div
          v-else
          class="h-full w-full flex flex-col items-center justify-center text-gray-500 gap-2 pt-6"
        >
          <span class="material-symbols-outlined text-3xl">directions_car_off</span>
          <p class="text-sm">
            {{
              vehiclesError ||
              (isLoadingVehicles ? 'Chargement des véhicules...' : 'Aucun véhicule à afficher')
            }}
          </p>
        </div>
      </div>
      <!-- ============== FIN LISTE FILTRÉE ============== -->

      <!-- ============ MODAL AJOUT / MODIFICATION VÉHICULE (partagé) ============ -->
      <Transition name="modal">
        <div
          v-if="isModalOpen"
          class="popup-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          @click.self="closeModal"
        >
          <div
            class="flex max-h-[min(720px,calc(100vh-48px))] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-modal-title"
          >
            <div
              class="flex items-center justify-between border-b border-slate-200 bg-[#595959] px-6 py-4"
            >
              <div>
                <h2 id="vehicle-modal-title" class="text-base font-semibold text-white sm:text-lg">
                  {{ isEditingVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule' }}
                </h2>
              </div>
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-full text-slate-200 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Fermer la fenêtre"
                @click="closeModal"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="overflow-y-auto bg-slate-50/70 px-5 py-5 sm:px-8 sm:py-6">
              <div class="mb-5 border-b border-slate-200 pb-4">
                <h3 class="text-sm font-semibold text-slate-800">Informations du véhicule</h3>
                <p class="mt-1 text-xs text-slate-500">
                  Renseignez les caractéristiques principales du véhicule.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label
                    for="vehicle-imei"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    IMEI
                  </label>
                  <input
                    id="vehicle-imei"
                    v-model.number="vehicle.imei"
                    type="number"
                    required
                    inputmode="numeric"
                    autocomplete="off"
                    placeholder="Ex. 356845291785421"
                    :aria-invalid="Boolean(imeiError)"
                    :aria-describedby="imeiError ? 'vehicle-imei-error' : undefined"
                    @input="imeiError = ''"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                  <p v-if="imeiError" id="vehicle-imei-error" class="mt-1.5 text-xs text-red-600">
                    {{ imeiError }}
                  </p>
                </div>

                <div class="sm:col-span-2">
                  <label
                    for="vehicle-name"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Nom du véhicule
                  </label>
                  <input
                    id="vehicle-name"
                    v-model.trim="vehicle.name"
                    required
                    placeholder="Ex. Véhicule de livraison Nord"
                    :aria-invalid="Boolean(nameError)"
                    :aria-describedby="nameError ? 'vehicle-name-error' : undefined"
                    @input="nameError = ''"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                  <p v-if="nameError" id="vehicle-name-error" class="mt-1.5 text-xs text-red-600">
                    {{ nameError }}
                  </p>
                  <p v-else class="mt-1.5 text-xs text-slate-500">
                    Choisissez le nom qui sera affiché dans la liste.
                  </p>
                </div>

                <div>
                  <label
                    for="vehicle-registration"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Immatriculation
                  </label>
                  <input
                    id="vehicle-registration"
                    v-model="vehicle.immatriculation"
                    placeholder="Ex. AB-123-CD"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div>
                  <label
                    for="vehicle-type"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Type
                  </label>
                  <input
                    id="vehicle-type"
                    v-model="vehicle.type_vehicule"
                    placeholder="Ex. Berline"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div>
                  <label
                    for="vehicle-brand"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Marque
                  </label>
                  <input
                    id="vehicle-brand"
                    v-model="vehicle.brand"
                    placeholder="Ex. Toyota"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div>
                  <label
                    for="vehicle-model"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Modèle
                  </label>
                  <input
                    id="vehicle-model"
                    v-model="vehicle.modele"
                    placeholder="Ex. Corolla"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div>
                  <label
                    for="vehicle-color"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Couleur
                  </label>
                  <input
                    id="vehicle-color"
                    v-model="vehicle.color"
                    placeholder="Ex. Blanc"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div>
                  <label
                    for="vehicle-year"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Année
                  </label>
                  <input
                    id="vehicle-year"
                    v-model.number="vehicle.year"
                    type="number"
                    min="1900"
                    :max="new Date().getFullYear() + 1"
                    placeholder="Ex. 2024"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label
                    for="vehicle-image"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Photo du véhicule
                  </label>
                  <input
                    id="vehicle-image"
                    type="file"
                    accept="image/*"
                    @change="handleImageChange"
                    class="block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-white text-sm text-slate-500 shadow-sm file:mr-4 file:border-0 file:bg-teal-50 file:px-4 file:py-2.5 file:font-medium file:text-teal-700 hover:border-teal-400 hover:bg-teal-50/40"
                  />
                  <img
                    v-if="vehicle.imageUrl && !vehicle.image"
                    :src="vehicle.imageUrl"
                    alt="Photo actuelle du véhicule"
                    class="mt-3 h-24 w-32 rounded-lg border border-slate-200 object-cover"
                  />
                  <p
                    v-if="isEditingVehicle && vehicle.imageUrl && !vehicle.image"
                    class="mt-1.5 text-xs text-slate-500"
                  >
                    Une photo est déjà enregistrée. Choisissez un fichier pour la remplacer.
                  </p>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end sm:px-8"
            >
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-300/40"
                @click="closeModal"
              >
                Annuler
              </button>
              <button
                type="button"
                class="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/25"
                @click="submitModal"
              >
                {{ isEditingVehicle ? 'Enregistrer les modifications' : 'Enregistrer le véhicule' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
      <!-- ============ FIN MODAL AJOUT / MODIFICATION VÉHICULE ============ -->

      <!-- ============ POPUP DÉTAILS D'UN VÉHICULE (modifier / supprimer) ============ -->
      <Transition name="modal">
        <div
          v-if="isActionModalOpen"
          class="popup-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          @click.self="closeActionModal"
        >
          <div
            class="flex max-h-[min(720px,calc(100vh-48px))] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-action-title"
          >
            <div
              class="flex items-center justify-between border-b border-slate-200 bg-[#595959] px-6 py-4"
            >
              <h2 id="vehicle-action-title" class="text-base font-semibold text-white sm:text-lg">
                {{ selectedVehicle?.name || 'Détails du véhicule' }}
              </h2>
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-full text-slate-200 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Fermer la fenêtre"
                @click="closeActionModal"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="overflow-y-auto bg-slate-50/70 px-5 py-5 sm:px-8 sm:py-6">
              <div v-if="selectedVehicle" class="space-y-3 text-sm text-slate-700">
                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p>
                    <span class="font-semibold text-slate-500">Immatriculation :</span>
                    {{ selectedVehicle.immatriculation || '--' }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-500">Type :</span>
                    {{ selectedVehicle.type_vehicule || '--' }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-500">Marque :</span>
                    {{ selectedVehicle.brand || '--' }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-500">Modèle :</span>
                    {{ selectedVehicle.modele || '--' }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-500">Couleur :</span>
                    {{ selectedVehicle.color || '--' }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-500">Année :</span>
                    {{ selectedVehicle.year || '--' }}
                  </p>
                  <p class="col-span-2">
                    <span class="font-semibold text-slate-500">Statut :</span>
                    {{ selectedVehicle.status === 'online' ? 'En ligne' : 'Hors ligne' }}
                  </p>
                </div>

                <p
                  v-if="deleteConfirm"
                  class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
                >
                  Confirmer la suppression de ce véhicule ? Cette action est irréversible.
                </p>
              </div>
            </div>

            <!-- ===== Actions du popup ===== -->
            <div
              class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end sm:px-8"
            >
              <button
                v-if="!deleteConfirm"
                type="button"
                class="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                @click="deleteConfirm = true"
              >
                Supprimer
              </button>
              <template v-else>
                <button
                  type="button"
                  class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white"
                  @click="deleteConfirm = false"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                  @click="confirmDeleteVehicle"
                >
                  Confirmer la suppression
                </button>
              </template>

              <button
                v-if="!deleteConfirm"
                type="button"
                class="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                @click="openEditModal(selectedVehicle)"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </Transition>
      <!-- ============ FIN POPUP DÉTAILS D'UN VÉHICULE ============ -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Vehicles',

  data() {
    return {
      isModalOpen: false,
      nameError: '',
      imeiError: '',
      searchQuery: '',
      activeFilter: 'all', // 'all' | 'online' | 'offline'
      vehicles: [],
      isLoadingVehicles: false,
      vehiclesError: '',
      vehicle: {
        name: '',
        immatriculation: '',
        imei: null,
        type_vehicule: '',
        brand: '',
        modele: '',
        color: '',
        year: null,
        image: '',
        imageUrl: '',
      },

      trackingIntervalId: null,
      trackingIntervalMs: 5000,

      // ===== Modal ajout / modification (partagé) =====
      isEditingVehicle: false,
      editingVehicleRef: null, // référence directe vers l'objet dans this.vehicles en cours d'édition

      // ===== Popup détails (modifier / supprimer) =====
      isActionModalOpen: false,
      selectedVehicle: null,
      deleteConfirm: false,
    }
  },

  computed: {
    totalVehiclesCount() {
      return this.vehicles.length
    },

    onlineVehiclesCount() {
      return this.vehicles.filter((v) => v.status === 'online').length
    },

    offlineVehiclesCount() {
      return this.vehicles.filter((v) => v.status !== 'online').length
    },

    // Applique le filtre d'onglet (Tous / En ligne / Hors ligne)
    // puis la recherche texte, comme le fait le panneau "ALL/DRIVING/PARKED" de la maquette.
    filteredVehicles() {
      let list = this.vehicles

      if (this.activeFilter === 'online') {
        list = list.filter((v) => v.status === 'online')
      } else if (this.activeFilter === 'offline') {
        list = list.filter((v) => v.status !== 'online')
      }

      const query = this.searchQuery.trim().toLowerCase()
      if (query) {
        list = list.filter((v) => {
          const name = (v.name || '').toLowerCase()
          const immat = (v.immatriculation || '').toLowerCase()
          return name.includes(query) || immat.includes(query)
        })
      }

      return list
    },
  },

  mounted() {
    this.fetchVehicles()
    this.startPositionTracking()
  },

  beforeUnmount() {
    this.stopPositionTracking()
  },

  methods: {
    async fetchVehicles() {
      this.isLoadingVehicles = true
      this.vehiclesError = ''

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/vehicle`)
        const payload = response.data
        const vehicles = Array.isArray(payload) ? payload : payload?.vehicles || payload?.data || []

        this.vehicles = Array.isArray(vehicles)
          ? vehicles.map((vehicle) => this.normalizeVehicle(vehicle))
          : []
      } catch (error) {
        console.error('Erreur lors du chargement des véhicules :', error)
        this.vehiclesError = 'Impossible de charger les véhicules.'
      } finally {
        this.isLoadingVehicles = false
      }
    },

    getVehicleId(vehicle) {
      return vehicle?.id || vehicle?._id?.$oid || vehicle?._id || null
    },

    getVehicleImage(vehicle) {
      const image = vehicle?.imageUrl || vehicle?.image
      if (!image) return ''
      if (/^https?:\/\//i.test(image)) return image

      const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
      return `${apiUrl}/${String(image).replace(/^\//, '')}`
    },

    normalizeVehicle(vehicle) {
      return {
        ...vehicle,
        id: this.getVehicleId(vehicle),
        imageUrl: this.getVehicleImage(vehicle),
        status: String(vehicle.status || 'offline').toLowerCase(),
        lastUpdate: vehicle.lastUpdate || vehicle.updated_at || Date.now(),
      }
    },

    closeVehicles() {
      if (this.$router) this.$router.push('/')
    },

    resetVehicleForm() {
      this.vehicle = {
        name: '',
        immatriculation: '',
        imei: null,
        type_vehicule: '',
        brand: '',
        modele: '',
        color: '',
        year: '',
        image: '',
        imageUrl: '',
      }
    },

    openModal() {
      // Ouverture en mode "ajout"
      this.nameError = ''
      this.isEditingVehicle = false
      this.editingVehicleRef = null
      this.resetVehicleForm()
      this.isModalOpen = true
    },

    openEditModal(savedVehicle) {
      // Ouverture du même modal, pré-rempli, en mode "modification"
      this.nameError = ''
      this.isEditingVehicle = true
      this.editingVehicleRef = savedVehicle
      this.vehicle = {
        name: savedVehicle.name || '',
        immatriculation: savedVehicle.immatriculation || '',
        imei: savedVehicle.imei ? Number(savedVehicle.imei) : null,
        type_vehicule: savedVehicle.type_vehicule || '',
        brand: savedVehicle.brand || '',
        modele: savedVehicle.modele || '',
        color: savedVehicle.color || '',
        year: savedVehicle.year || '',
        image: '',
        imageUrl: this.getVehicleImage(savedVehicle),
      }

      this.isActionModalOpen = false
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
      this.isEditingVehicle = false
      this.editingVehicleRef = null
      this.resetVehicleForm()
    },

    closeActionModal() {
      this.isActionModalOpen = false
      this.selectedVehicle = null
      this.deleteConfirm = false
    },

    handleImageChange(event) {
      this.vehicle.image = event.target.files?.[0] || null
    },

    async addVehicle() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/vehicle`, {
          name: this.vehicle.name,
          immatriculation: this.vehicle.immatriculation,
          imei: Number(this.vehicle.imei),
          type_vehicule: this.vehicle.type_vehicule,
          brand: this.vehicle.brand,
          modele: this.vehicle.modele,
          color: this.vehicle.color,
          year:
            this.vehicle.year === null || this.vehicle.year === ''
              ? null
              : String(this.vehicle.year),
          image: this.vehicle.image ? URL.createObjectURL(this.vehicle.image) : '',
          status: 'offline',
        })

        // this.vehicles.push(newVehicle)
        // this.$emit('vehicle-created', { ...newVehicle })
        this.fetchVehicles()
        this.closeModal()
        this.$notify.success('Véhicule ajouté', 'Le véhicule a été ajouté avec succès.')
      } catch (error) {
        console.error("Erreur lors de l'ajout du véhicule :", error)
        this.$notify.error('Erreur', "Impossible d'ajouter le véhicule. Veuillez réessayer.")
      }
    },

    async updateVehicle() {
      const vehicleId = this.getVehicleId(this.editingVehicleRef)

      if (!vehicleId) {
        this.$notify.error('Erreur', 'Impossible de modifier ce véhicule : identifiant manquant.')
        return
      }

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/vehicle/${vehicleId}`,
          {
            name: this.vehicle.name,
            immatriculation: this.vehicle.immatriculation,
            imei: Number(this.vehicle.imei),
            type_vehicule: this.vehicle.type_vehicule,
            brand: this.vehicle.brand,
            modele: this.vehicle.modele,
            color: this.vehicle.color,
            year:
              this.vehicle.year === null || this.vehicle.year === ''
                ? null
                : String(this.vehicle.year),
            image: this.vehicle.image
              ? URL.createObjectURL(this.vehicle.image)
              : this.vehicle.imageUrl || '',
          },
        )

        // Mettre à jour le véhicule dans la liste
        const updatedVehicle = this.normalizeVehicle(response.data?.data || response.data)
        const index = this.vehicles.findIndex((v) => this.getVehicleId(v) === vehicleId)
        if (index !== -1) {
          this.vehicles[index] = updatedVehicle
          this.selectedVehicle = { ...updatedVehicle }
        }

        this.$emit('vehicle-updated', { ...updatedVehicle })
        this.$notify.success(
          'Véhicule mis à jour',
          'Les modifications ont été enregistrées avec succès.',
        )
        this.closeModal()
      } catch (error) {
        console.error('Erreur lors de la mise à jour du véhicule :', error)
        this.$notify.error('Erreur', 'Impossible de mettre à jour le véhicule. Veuillez réessayer.')
      }
    },

    async submitModal() {
      if (!Number.isFinite(this.vehicle.imei)) {
        this.imeiError = "Veuillez renseigner l'IMEI du véhicule."
        return
      }

      if (!this.vehicle.name.trim()) {
        this.nameError = 'Veuillez donner un nom à ce véhicule.'
        return
      }

      if (this.isEditingVehicle && this.editingVehicleRef) {
        // ===== Mise à jour d'un véhicule existant =====
        const index = this.vehicles.findIndex((v) => v === this.editingVehicleRef)
        if (index !== -1) {
          await this.updateVehicle()

          this.selectedVehicle = this.vehicles[index]
        }

        this.$emit('vehicle-updated', { ...this.vehicles[index] })
      } else {
        // ===== Création d'un nouveau véhicule =====
        await this.addVehicle()

        // this.vehicles.push(savedVehicle)
        // this.$emit('vehicle-created', { ...savedVehicle })
      }
    },

    startPositionTracking() {
      if (this.trackingIntervalId) return

      this.trackingIntervalId = setInterval(() => {
        this.refreshVehiclesStatus()
      }, this.trackingIntervalMs)
    },

    stopPositionTracking() {
      if (this.trackingIntervalId) {
        clearInterval(this.trackingIntervalId)
        this.trackingIntervalId = null
      }
    },

    async refreshVehiclesStatus() {
      await Promise.all(
        this.vehicles.map(async (savedVehicle) => {
          savedVehicle.status = await this.fetchVehicleStatus(savedVehicle)
          savedVehicle.lastUpdate = Date.now()
        }),
      )
    },

    async fetchVehicleStatus() {
      const isOnline = Math.random() > 0.15
      return isOnline ? 'online' : 'offline'
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    formatDate(timestamp) {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      })
    },

    recenterOnVehicle(savedVehicle) {
      // Émet l'événement vers le composant parent (ex: la carte) pour recentrer sur ce véhicule
      this.$emit('recenter-vehicle', savedVehicle)
    },

    // ===== Popup détails (modifier / supprimer) =====

    openVehicleActions(savedVehicle) {
      this.selectedVehicle = savedVehicle
      this.deleteConfirm = false
      this.isActionModalOpen = true
    },

    async confirmDeleteVehicle() {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/v1/vehicle/${this.selectedVehicle.id}`,
        )
        const index = this.vehicles.findIndex((v) => v === this.selectedVehicle)
        if (index !== -1) {
          this.vehicles.splice(index, 1)
        }

        this.$emit('vehicle-deleted', { ...this.selectedVehicle })
        this.closeActionModal()
      } catch (error) {
        console.error('Erreur de suppression :', error)
      }
    },
  },
}
</script>

<style scoped>
.container-vehicles {
  font-family: 'Century Gothic';
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

/* Onglets de filtre façon "ALL / DRIVING / PARKED" de la maquette */
.filter-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #8b8b8b;
  border-bottom: 3px solid transparent;
  background: transparent;
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.filter-tab:hover {
  color: #4a4a4a;
}

.filter-tab-active {
  color: #17a673;
  border-bottom-color: #17a673;
}

/* Carte véhicule */
.vehicle-card {
  transition: box-shadow 0.15s ease;
}

.vehicle-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.vehicle-icon-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  border: 2px solid transparent;
  background-color: transparent;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s ease;
}

.vehicle-icon-avatar .material-symbols-outlined {
  font-size: 18px;
  color: #ffffff;
}

.vehicle-icon-avatar-online {
  border-color: #2563eb;
}

.vehicle-icon-avatar-offline {
  border-color: #dc2626;
}

.trip-pill {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #ffffff;
  background-color: #595959;
  border-radius: 4px;
  padding: 3px 8px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.trip-pill:hover {
  background-color: #454545;
}
</style>
