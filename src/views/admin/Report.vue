<template>
  <div
    class="container-report h-full w-[35%] bg-[#E8E7E7] relative z-10 flex flex-col border-l border-r border-gray-800 shadow-lg"
  >
    <!-- ================= HEADER ================= -->
    <div
      class="w-full bg-[#5A5A5A] flex items-center justify-between px-4 py-4 border-b border-black/10"
    >
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-[#0E6A97] flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-[20px]"> bar_chart </span>
        </div>

        <div>
          <h2 class="text-white font-bold text-[17px]">Rapports</h2>
          <p class="text-gray-300 text-[11px]">Historique & analyses de la flotte</p>
        </div>
      </div>

      <button
        @click="closeReport"
        aria-label="Fermer les rapports"
        class="w-9 h-9 rounded-lg hover:bg-white/10 transition flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-white">close</span>
      </button>
    </div>

    <!-- ================= CONTENU ================= -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      <!-- Rapport vitesse -->
      <button
        class="report-item"
        :class="{ 'report-item-active': activeReport === 'Rapports de vitesse' }"
        @click="selectReport('Rapports de vitesse')"
      >
        <div class="icon-box bg-[#0E6A97]">
          <span class="material-symbols-outlined text-white text-[18px]">speed</span>
        </div>

        <div class="flex-1 text-left">
          <h3>Rapports de vitesse</h3>
          <p>Excès et limitation</p>
        </div>

        <span class="material-symbols-outlined text-gray-400"> chevron_right </span>
      </button>

      <!-- Rapport conduite -->
      <button
        class="report-item"
        :class="{ 'report-item-active': activeReport === 'Rapports de conduite' }"
        @click="selectReport('Rapports de conduite')"
      >
        <div class="icon-box bg-[#0E6A97]">
          <span class="material-symbols-outlined text-white text-[18px]">drive_eta</span>
        </div>

        <div class="flex-1 text-left">
          <h3>Rapports de conduite</h3>
          <p>Style de conduite</p>
        </div>

        <span class="material-symbols-outlined text-gray-400"> chevron_right </span>
      </button>

      <!-- Rapport voyage -->
      <button
        class="report-item"
        :class="{ 'report-item-active': activeReport === 'Rapports de voyage' }"
        @click="selectReport('Rapports de voyage')"
      >
        <div class="icon-box bg-[#0E6A97]">
          <span class="material-symbols-outlined text-white text-[18px]">route</span>
        </div>

        <div class="flex-1 text-left">
          <h3>Rapports de voyage</h3>
          <p>Trajets et arrêts</p>
        </div>

        <span class="material-symbols-outlined text-gray-400"> chevron_right </span>
      </button>

      <!-- ================= PETROLIER ================= -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <button
          class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
          @click="petrolOpen = !petrolOpen"
        >
          <div class="flex items-center gap-3">
            <div class="icon-box bg-[#0E6A97]">
              <span class="material-symbols-outlined text-white text-[18px]">
                local_gas_station
              </span>
            </div>

            <div class="text-left">
              <h3 class="font-semibold text-[14px] text-gray-800">Rapports pétroliers</h3>
              <p class="text-[11px] text-gray-500">Carburant & consommation</p>
            </div>
          </div>

          <span
            class="material-symbols-outlined text-gray-500 transition duration-300"
            :class="petrolOpen ? 'rotate-180' : ''"
          >
            expand_more
          </span>
        </button>

        <transition name="expand">
          <div v-if="petrolOpen" class="px-3 pb-3 space-y-1">
            <button
              class="sub-item"
              :class="{ 'sub-item-active': activeReport === 'Ravitaillements' }"
              @click="selectReport('Ravitaillements')"
            >
              <span class="sub-item-icon material-symbols-outlined text-[14px]"> water_drop </span>
              Ravitaillements
            </button>

            <button
              class="sub-item"
              :class="{ 'sub-item-active': activeReport === 'Compteur carburant' }"
              @click="selectReport('Compteur carburant')"
            >
              <span class="sub-item-icon material-symbols-outlined text-[14px]"> speed </span>
              Compteur carburant
            </button>

            <button
              class="sub-item"
              :class="{ 'sub-item-active': activeReport === 'Consommation quotidienne' }"
              @click="selectReport('Consommation quotidienne')"
            >
              <span class="sub-item-icon material-symbols-outlined text-[14px]"> monitoring </span>
              Consommation quotidienne
            </button>
          </div>
        </transition>
      </div>

      <!-- Alarmes -->
      <button
        class="report-item"
        :class="{ 'report-item-active': activeReport === 'Rapports des alarmes' }"
        @click="selectReport('Rapports des alarmes')"
      >
        <div class="icon-box bg-[#0E6A97]">
          <span class="material-symbols-outlined text-white text-[18px]">warning</span>
        </div>

        <div class="flex-1 text-left">
          <h3>Rapports des alarmes</h3>
          <p>Historique des alertes</p>
        </div>

        <span class="material-symbols-outlined text-gray-400"> chevron_right </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Report',

  props: {
    activeReport: {
      type: String,
      default: null,
    },
  },

  emits: ['close', 'select-report'],

  data() {
    return {
      petrolOpen: true,
    }
  },

  methods: {
    closeReport() {
      this.$emit('close')
      this.$router.push('/dashboard')
    },

    selectReport(report) {
      this.$emit('select-report', report)
    },
  },
}
</script>

<style scoped>
/* Scroll */
.container-report::-webkit-scrollbar {
  width: 6px;
}

.container-report::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 10px;
}

.container-report::-webkit-scrollbar-track {
  background: transparent;
}

/* Carte principale */
.report-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px;
  transition: 0.25s ease;
  text-align: left;
}

.report-item:hover {
  transform: translateY(-2px);
  border-color: #0e6a97;
  box-shadow: 0 8px 20px rgba(14, 106, 151, 0.12);
}

.report-item-active {
  border-color: #0e6a97;
  background: #eef8fc;
  box-shadow: 0 8px 20px rgba(14, 106, 151, 0.16);
}

.report-item h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.report-item p {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

/* Icônes */
.icon-box {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-box .material-symbols-outlined {
  font-size: 18px;
}

/* Sous-menu */
.sub-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  color: #374151;
  font-size: 12px;
  transition: 0.2s;
}

.sub-item:hover {
  background: #eef8fc;
  color: #0e6a97;
}

.sub-item-icon {
  color: #5a5a5a;
}

.sub-item:hover .sub-item-icon {
  color: #0e6a97;
}

.sub-item-active {
  background: #eef8fc;
  color: #0e6a97;
  font-weight: 600;
}

.sub-item-active .sub-item-icon {
  color: #0e6a97;
}

/* Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
  opacity: 1;
}
</style>
