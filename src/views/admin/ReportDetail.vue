<template>
  <transition name="window-pop">
    <div v-if="config" class="report-window" role="dialog" aria-modal="true">
      <!-- ================= HEADER ================= -->
      <div class="window-header">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-[#0E6A97] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-white text-[20px]">{{ config.icon }}</span>
          </div>
          <div class="min-w-0">
            <h2 class="text-white font-bold text-[16px] truncate">{{ type }}</h2>
            <p class="text-gray-300 text-[11px] truncate">{{ config.subtitle }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="period-pill">{{ config.period }}</span>
          <button
            class="w-9 h-9 rounded-lg hover:bg-white/10 transition flex items-center justify-center"
            aria-label="Fermer le détail du rapport"
            @click="$emit('close')"
          >
            <span class="material-symbols-outlined text-white">close</span>
          </button>
        </div>
      </div>

      <!-- ================= CONTENU ================= -->
      <div class="window-body">
        <!-- Cartes statistiques -->
        <div class="stats-grid">
          <div v-for="stat in config.stats" :key="stat.label" class="stat-card">
            <div class="stat-icon" :style="{ background: stat.color || '#0E6A97' }">
              <span class="material-symbols-outlined text-white text-[16px]">{{ stat.icon }}</span>
            </div>
            <div class="min-w-0">
              <p class="stat-value">{{ stat.value }}</p>
              <p class="stat-label">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <!-- Graphiques -->
        <div class="charts-row" :class="{ 'single-chart': !config.secondaryChart }">
          <div class="chart-card">
            <div class="chart-card-header">
              <h4>{{ config.primaryChart.title }}</h4>
              <span class="legend-note" v-if="config.primaryChart.note">{{ config.primaryChart.note }}</span>
            </div>
            <div class="chart-canvas-wrap">
              <canvas ref="primaryCanvas"></canvas>
            </div>
          </div>

          <div class="chart-card secondary" v-if="config.secondaryChart">
            <div class="chart-card-header">
              <h4>{{ config.secondaryChart.title }}</h4>
            </div>
            <div class="chart-canvas-wrap donut-wrap">
              <canvas ref="secondaryCanvas"></canvas>
              <div v-if="config.secondaryChart.centerText" class="donut-center">
                <span class="donut-value">{{ config.secondaryChart.centerText.value }}</span>
                <span class="donut-label">{{ config.secondaryChart.centerText.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau détaillé -->
        <div class="table-card" v-if="config.table">
          <div class="chart-card-header">
            <h4>{{ config.table.title }}</h4>
          </div>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th v-for="col in config.table.columns" :key="col">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in config.table.rows" :key="i">
                  <td v-for="(cell, j) in row" :key="j">
                    <span v-if="isBadge(cell)" class="badge" :style="badgeStyle(cell)">{{ cell.text }}</span>
                    <span v-else>{{ cell }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const BLUE = '#0E6A97'
const BLUE_LIGHT = 'rgba(14, 106, 151, 0.15)'
const RED = '#DC2626'
const ORANGE = '#F59E0B'
const GREEN = '#16A34A'
const GRAY = '#9CA3AF'

function badge(text, color) {
  return { badge: true, text, color }
}

export default {
  name: 'ReportDetail',

  props: {
    type: {
      type: String,
      default: null,
    },
  },

  emits: ['close'],

  data() {
    return {
      primaryChartInstance: null,
      secondaryChartInstance: null,
    }
  },

  computed: {
    config() {
      return this.type ? this.reportsData[this.type] : null
    },

    reportsData() {
      return {
        // ============================================================
        'Rapports de vitesse': {
          icon: 'speed',
          subtitle: 'Excès et limitation',
          period: '7 derniers jours',
          stats: [
            { icon: 'speed', label: 'Vitesse max', value: '128 km/h', color: RED },
            { icon: 'trending_up', label: 'Vitesse moyenne', value: '62 km/h', color: BLUE },
            { icon: 'report', label: 'Excès détectés', value: '5', color: ORANGE },
            { icon: 'route', label: 'Distance parcourue', value: '214 km', color: GREEN },
          ],
          primaryChart: {
            title: 'Évolution de la vitesse (km/h)',
            note: 'Limite : 90 km/h',
            type: 'line',
            labels: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h'],
            datasets: [
              {
                label: 'Vitesse',
                data: [45, 62, 88, 95, 128, 76, 54, 91, 60],
                borderColor: BLUE,
                backgroundColor: BLUE_LIGHT,
                tension: 0.35,
                fill: true,
                pointRadius: 3,
              },
              {
                label: 'Limite autorisée',
                data: [90, 90, 90, 90, 90, 90, 90, 90, 90],
                borderColor: RED,
                borderDash: [6, 6],
                pointRadius: 0,
                fill: false,
              },
            ],
          },
          table: {
            title: "Historique des excès de vitesse",
            columns: ['Heure', 'Vitesse', 'Limite', 'Lieu'],
            rows: [
              ['10:42', '95 km/h', '90 km/h', 'Route de Ouidah'],
              ['12:05', '128 km/h', '90 km/h', 'Voie express Calavi'],
              ['15:20', '91 km/h', '90 km/h', 'Route de Ouidah'],
              ['16:47', '104 km/h', '90 km/h', 'Carrefour Godomey'],
              ['17:58', '99 km/h', '90 km/h', 'Route des Pêches'],
            ],
          },
        },

        // ============================================================
        'Rapports de conduite': {
          icon: 'drive_eta',
          subtitle: 'Style de conduite',
          period: '7 derniers jours',
          stats: [
            { icon: 'military_tech', label: 'Score de conduite', value: '82 / 100', color: GREEN },
            { icon: 'front_hand', label: 'Freinages brusques', value: '6', color: RED },
            { icon: 'bolt', label: 'Accélérations brusques', value: '4', color: ORANGE },
            { icon: 'turn_right', label: 'Virages serrés', value: '3', color: BLUE },
          ],
          primaryChart: {
            title: 'Événements de conduite par jour',
            type: 'bar',
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [
              { label: 'Freinages brusques', data: [2, 1, 0, 1, 2, 0, 0], backgroundColor: RED },
              { label: 'Accélérations brusques', data: [1, 0, 1, 1, 0, 1, 0], backgroundColor: ORANGE },
              { label: 'Virages serrés', data: [0, 1, 1, 0, 1, 0, 0], backgroundColor: BLUE },
            ],
          },
          secondaryChart: {
            title: 'Score global',
            type: 'doughnut',
            labels: ['Score', 'Reste'],
            data: [82, 18],
            colors: [GREEN, '#E5E7EB'],
            centerText: { value: '82%', label: 'Conduite sûre' },
          },
          table: {
            title: 'Derniers événements',
            columns: ['Date', 'Type', 'Sévérité', 'Lieu'],
            rows: [
              ['Lun. 08:14', 'Freinage brusque', badge('Modéré', ORANGE), 'Godomey'],
              ['Mar. 17:02', 'Virage serré', badge('Faible', GREEN), 'Akpakpa'],
              ['Ven. 11:30', 'Accélération brusque', badge('Élevé', RED), 'Calavi'],
              ['Ven. 18:45', 'Freinage brusque', badge('Élevé', RED), 'Route des Pêches'],
            ],
          },
        },

        // ============================================================
        'Rapports de voyage': {
          icon: 'route',
          subtitle: 'Trajets et arrêts',
          period: 'Cette semaine',
          stats: [
            { icon: 'alt_route', label: 'Trajets effectués', value: '8', color: BLUE },
            { icon: 'straighten', label: 'Distance totale', value: '214 km', color: GREEN },
            { icon: 'schedule', label: 'Durée totale', value: '5h32', color: ORANGE },
            { icon: 'pause_circle', label: 'Arrêts', value: '12', color: GRAY },
          ],
          primaryChart: {
            title: 'Distance parcourue par trajet (km)',
            type: 'bar',
            labels: ['Trajet 1', 'Trajet 2', 'Trajet 3', 'Trajet 4', 'Trajet 5', 'Trajet 6'],
            datasets: [
              { label: 'Distance (km)', data: [18, 32, 12, 45, 27, 20], backgroundColor: BLUE },
            ],
          },
          table: {
            title: 'Détail des trajets',
            columns: ['Départ', 'Arrivée', 'Distance', 'Durée', 'Arrêts'],
            rows: [
              ['08:02 - Calavi', '08:34 - Cotonou', '18 km', '32 min', '0'],
              ['09:10 - Cotonou', '09:55 - Akpakpa', '32 km', '45 min', '2'],
              ['13:20 - Akpakpa', '13:40 - Godomey', '12 km', '20 min', '1'],
              ['15:00 - Godomey', '15:58 - Ouidah', '45 km', '58 min', '3'],
            ],
          },
        },

        // ============================================================
        Ravitaillements: {
          icon: 'water_drop',
          subtitle: 'Historique des pleins',
          period: 'Ce mois-ci',
          stats: [
            { icon: 'local_gas_station', label: 'Total ravitaillé', value: '320 L', color: BLUE },
            { icon: 'payments', label: 'Dépense totale', value: '245 000 FCFA', color: ORANGE },
            { icon: 'event_repeat', label: 'Nombre de pleins', value: '6', color: GREEN },
            { icon: 'sell', label: 'Prix moyen / L', value: '765 FCFA', color: GRAY },
          ],
          primaryChart: {
            title: 'Quantité ravitaillée par plein (L)',
            type: 'bar',
            labels: ['02/09', '07/09', '12/09', '18/09', '24/09', '30/09'],
            datasets: [{ label: 'Litres', data: [45, 60, 52, 58, 50, 55], backgroundColor: BLUE }],
          },
          table: {
            title: 'Historique des ravitaillements',
            columns: ['Date', 'Station', 'Quantité', 'Prix', 'Kilométrage'],
            rows: [
              ['02/09/2026', 'Total Calavi', '45 L', '34 425 FCFA', '12 340 km'],
              ['07/09/2026', 'Oryx Godomey', '60 L', '45 900 FCFA', '12 610 km'],
              ['12/09/2026', 'Total Cotonou', '52 L', '39 780 FCFA', '12 890 km'],
              ['18/09/2026', 'Petrolin Akpakpa', '58 L', '44 370 FCFA', '13 175 km'],
            ],
          },
        },

        // ============================================================
        'Compteur carburant': {
          icon: 'speed',
          subtitle: 'Niveau du réservoir',
          period: 'Temps réel',
          stats: [
            { icon: 'oil_barrel', label: 'Niveau actuel', value: '68 %', color: GREEN },
            { icon: 'trending_flat', label: 'Autonomie estimée', value: '210 km', color: BLUE },
            { icon: 'local_gas_station', label: 'Volume restant', value: '41 L', color: ORANGE },
          ],
          primaryChart: {
            title: 'Niveau de carburant sur 7 jours (%)',
            type: 'line',
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [
              {
                label: 'Niveau (%)',
                data: [95, 84, 78, 70, 68, 55, 68],
                borderColor: GREEN,
                backgroundColor: 'rgba(22, 163, 74, 0.15)',
                tension: 0.35,
                fill: true,
                pointRadius: 3,
              },
            ],
          },
          secondaryChart: {
            title: 'Niveau actuel',
            type: 'doughnut',
            labels: ['Plein', 'Vide'],
            data: [68, 32],
            colors: [GREEN, '#E5E7EB'],
            centerText: { value: '68%', label: '41 L restants' },
          },
        },

        // ============================================================
        'Consommation quotidienne': {
          icon: 'monitoring',
          subtitle: 'Consommation par jour',
          period: 'Cette semaine',
          stats: [
            { icon: 'local_gas_station', label: 'Conso. moyenne', value: '8.2 L/100km', color: BLUE },
            { icon: 'water_drop', label: 'Total consommé', value: '42 L', color: ORANGE },
            { icon: 'payments', label: 'Coût estimé', value: '32 130 FCFA', color: GREEN },
          ],
          primaryChart: {
            title: 'Consommation quotidienne (L/100km)',
            type: 'bar',
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [
              {
                label: 'L/100km',
                data: [7.8, 8.5, 6.9, 9.1, 8.0, 7.2, 8.8],
                backgroundColor: (ctx) => {
                  const v = ctx.raw
                  if (v >= 9) return RED
                  if (v >= 8) return ORANGE
                  return GREEN
                },
              },
            ],
          },
        },

        // ============================================================
        'Rapports des alarmes': {
          icon: 'warning',
          subtitle: 'Historique des alertes',
          period: '7 derniers jours',
          stats: [
            { icon: 'notifications', label: 'Total alertes', value: '14', color: BLUE },
            { icon: 'error', label: 'Critiques', value: '3', color: RED },
            { icon: 'warning', label: 'Moyennes', value: '6', color: ORANGE },
            { icon: 'info', label: 'Faibles', value: '5', color: GREEN },
          ],
          primaryChart: {
            title: "Alertes par jour",
            type: 'bar',
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{ label: 'Alertes', data: [1, 3, 2, 0, 4, 1, 3], backgroundColor: BLUE }],
          },
          secondaryChart: {
            title: 'Répartition par sévérité',
            type: 'doughnut',
            labels: ['Critique', 'Moyenne', 'Faible'],
            data: [3, 6, 5],
            colors: [RED, ORANGE, GREEN],
          },
          table: {
            title: 'Dernières alarmes',
            columns: ['Date', 'Véhicule', 'Type', 'Sévérité'],
            rows: [
              ['Ven. 14:02', 'Fiat Ducato (C23)', 'Batterie faible', badge('Critique', RED)],
              ['Ven. 09:11', 'Renault Kangoo (A01)', 'Excès de vitesse', badge('Moyenne', ORANGE)],
              ['Jeu. 20:44', 'Peugeot 3008 (B12)', 'Sortie de zone', badge('Moyenne', ORANGE)],
              ['Mar. 07:30', 'VW Caddy (D34)', 'Choc détecté', badge('Critique', RED)],
              ['Lun. 12:15', 'Renault Kangoo (A01)', 'Panne capteur', badge('Faible', GREEN)],
            ],
          },
        },
      }
    },
  },

  watch: {
    type() {
      this.$nextTick(() => this.renderCharts())
    },
  },

  mounted() {
    this.$nextTick(() => this.renderCharts())
  },

  beforeUnmount() {
    this.destroyCharts()
  },

  methods: {
    isBadge(cell) {
      return cell && typeof cell === 'object' && cell.badge
    },

    badgeStyle(cell) {
      return {
        color: cell.color,
        background: `${cell.color}1A`,
        border: `1px solid ${cell.color}33`,
      }
    },

    destroyCharts() {
      if (this.primaryChartInstance) {
        this.primaryChartInstance.destroy()
        this.primaryChartInstance = null
      }
      if (this.secondaryChartInstance) {
        this.secondaryChartInstance.destroy()
        this.secondaryChartInstance = null
      }
    },

    renderCharts() {
      this.destroyCharts()
      if (!this.config) return

      const p = this.config.primaryChart
      if (p && this.$refs.primaryCanvas) {
        this.primaryChartInstance = new Chart(this.$refs.primaryCanvas.getContext('2d'), {
          type: p.type,
          data: { labels: p.labels, datasets: p.datasets },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: {
                display: p.datasets.length > 1,
                position: 'bottom',
                labels: { boxWidth: 10, font: { size: 10 }, usePointStyle: true },
              },
              tooltip: { padding: 10, cornerRadius: 8 },
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 10 } } },
              y: { grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 } } },
            },
          },
        })
      }

      const s = this.config.secondaryChart
      if (s && this.$refs.secondaryCanvas) {
        this.secondaryChartInstance = new Chart(this.$refs.secondaryCanvas.getContext('2d'), {
          type: s.type,
          data: {
            labels: s.labels,
            datasets: [{ data: s.data, backgroundColor: s.colors, borderWidth: 0 }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: { boxWidth: 10, font: { size: 10 }, usePointStyle: true },
              },
            },
          },
        })
      }
    },
  },
}
</script>

<style scoped>
.report-window {
  position: absolute;
  top: 16px;
  bottom: 16px;
  left: calc(35% + 16px);
  right: 16px;
  z-index: 20;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.window-header {
  flex-shrink: 0;
  background: #5a5a5a;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.period-pill {
  font-size: 11px;
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.12);
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.window-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f5f6f7;
}

.window-body::-webkit-scrollbar {
  width: 6px;
}
.window-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

/* Stat cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.1;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
}

.charts-row.single-chart {
  grid-template-columns: 1fr;
}

.chart-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chart-card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.chart-card-header h4 {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.legend-note {
  font-size: 10px;
  color: #ef4444;
  font-weight: 600;
}

.chart-canvas-wrap {
  position: relative;
  height: 220px;
}

.donut-wrap {
  height: 200px;
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  top: -14px;
}

.donut-value {
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
}

.donut-label {
  font-size: 10px;
  color: #6b7280;
}

/* Table */
.table-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

thead th {
  text-align: left;
  padding: 8px 10px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.03em;
  border-bottom: 2px solid #f1f5f9;
  white-space: nowrap;
}

tbody td {
  padding: 9px 10px;
  color: #374151;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

tbody tr:hover {
  background: #f8fafc;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

/* Animation d'apparition de la fenêtre */
.window-pop-enter-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}
.window-pop-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.window-pop-enter-from,
.window-pop-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(6px);
}
</style>
