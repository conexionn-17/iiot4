/* ═══════════════════════════════════════════════════════
   TATA MOTORS INTELLIGENCE PLATFORM — app.js
   All charts, API calls, interactions, data rendering
   ═══════════════════════════════════════════════════════ */

'use strict';

// ── CONFIG ──────────────────────────────────────────────
const API_BASE = 'https://tata-motors-api.onrender.com'; // Replace with your Render URL
const USE_MOCK = false; // Set false when backend is live

// ── CHART DEFAULTS ──────────────────────────────────────
const GRID = 'rgba(79,142,247,0.08)';
const TICK = '#4d6a8a';
const BLUE = '#4f8ef7';
const GREEN = '#22d3a0';
const AMBER = '#f5a623';
const RED = '#f25c54';
const PURPLE = '#7c5cfc';
const TEAL = '#00d4c8';
const COLORS = [BLUE, GREEN, AMBER, PURPLE, RED, TEAL, '#e879a0', '#fbbf24'];

Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.color = TICK;
Chart.defaults.plugins.legend.labels.boxWidth = 10;
Chart.defaults.plugins.legend.labels.padding = 14;

function baseOpts(extra = {}) {
  return {
    responsive: true, maintainAspectRatio: true,
    plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
    scales: {
      x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 11 } }, border: { color: GRID } },
      y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 11 } }, border: { color: GRID } },
    },
    ...extra
  };
}

// ── MOCK DATA ────────────────────────────────────────────
let HIST_GLOBAL = [
  { year: 2015, revenue: 46.7e9, profit: 8.18e9, units: 37339963, margin: 17.50 },
  { year: 2016, revenue: 46.2e9, profit: 8.10e9, units: 37912908, margin: 17.53 },
  { year: 2017, revenue: 49.2e9, profit: 8.69e9, units: 37324956, margin: 17.67 },
  { year: 2018, revenue: 48.1e9, profit: 8.81e9, units: 37576253, margin: 18.31 },
  { year: 2019, revenue: 46.8e9, profit: 7.78e9, units: 37849255, margin: 16.60 },
  { year: 2020, revenue: 47.5e9, profit: 8.21e9, units: 37633865, margin: 17.29 },
  { year: 2021, revenue: 45.6e9, profit: 8.21e9, units: 37599158, margin: 18.02 },
  { year: 2022, revenue: 47.3e9, profit: 8.00e9, units: 37224307, margin: 16.94 },
  { year: 2023, revenue: 47.5e9, profit: 8.00e9, units: 37477554, margin: 16.83 },
  { year: 2024, revenue: 44.9e9, profit: 7.82e9, units: 37575987, margin: 17.44 },
];

let FORECAST_DATA = {
  India: [{ year: 2025, revenue: 295.2e6, profit: 51.7e6, units: 190791, margin_pct: 17.5, ci_lower: 270.1e6, ci_upper: 320.3e6 }, { year: 2026, revenue: 302.0e6, profit: 52.9e6, units: 196348, margin_pct: 17.5, ci_lower: 276.4e6, ci_upper: 327.7e6 }, { year: 2027, revenue: 302.3e6, profit: 52.9e6, units: 201905, margin_pct: 17.5, ci_lower: 276.6e6, ci_upper: 328.0e6 }, { year: 2028, revenue: 309.8e6, profit: 54.2e6, units: 207463, margin_pct: 17.5, ci_lower: 283.5e6, ci_upper: 336.1e6 }, { year: 2029, revenue: 318.4e6, profit: 55.7e6, units: 213020, margin_pct: 17.5, ci_lower: 291.4e6, ci_upper: 345.4e6 }, { year: 2030, revenue: 321.2e6, profit: 56.2e6, units: 218578, margin_pct: 17.5, ci_lower: 293.9e6, ci_upper: 348.5e6 }, { year: 2031, revenue: 324.0e6, profit: 56.7e6, units: 224135, margin_pct: 17.5, ci_lower: 296.5e6, ci_upper: 351.6e6 }, { year: 2032, revenue: 326.9e6, profit: 57.2e6, units: 229693, margin_pct: 17.5, ci_lower: 299.1e6, ci_upper: 354.8e6 }, { year: 2033, revenue: 329.8e6, profit: 57.7e6, units: 235250, margin_pct: 17.5, ci_lower: 301.8e6, ci_upper: 357.9e6 }, { year: 2034, revenue: 329.8e6, profit: 57.7e6, units: 240808, margin_pct: 17.5, ci_lower: 301.8e6, ci_upper: 357.9e6 }],
  USA: [{ year: 2025, revenue: 316.5e6, profit: 55.4e6, units: 198200, margin_pct: 17.5, ci_lower: 289.7e6, ci_upper: 343.4e6 }, { year: 2026, revenue: 326.0e6, profit: 57.1e6, units: 204126, margin_pct: 17.5, ci_lower: 298.3e6, ci_upper: 353.7e6 }, { year: 2027, revenue: 335.7e6, profit: 58.7e6, units: 210049, margin_pct: 17.5, ci_lower: 307.1e6, ci_upper: 364.3e6 }, { year: 2028, revenue: 340.2e6, profit: 59.5e6, units: 215975, margin_pct: 17.5, ci_lower: 311.3e6, ci_upper: 369.1e6 }, { year: 2029, revenue: 344.8e6, profit: 60.3e6, units: 221901, margin_pct: 17.5, ci_lower: 315.5e6, ci_upper: 374.1e6 }, { year: 2030, revenue: 349.5e6, profit: 61.2e6, units: 227827, margin_pct: 17.5, ci_lower: 319.8e6, ci_upper: 379.2e6 }, { year: 2031, revenue: 350.1e6, profit: 61.3e6, units: 233753, margin_pct: 17.5, ci_lower: 320.4e6, ci_upper: 379.8e6 }, { year: 2032, revenue: 351.2e6, profit: 61.5e6, units: 239679, margin_pct: 17.5, ci_lower: 321.4e6, ci_upper: 381.0e6 }, { year: 2033, revenue: 352.3e6, profit: 61.7e6, units: 245605, margin_pct: 17.5, ci_lower: 322.4e6, ci_upper: 382.2e6 }, { year: 2034, revenue: 353.4e6, profit: 61.9e6, units: 251531, margin_pct: 17.5, ci_lower: 323.4e6, ci_upper: 383.4e6 }],
  Germany: [{ year: 2025, revenue: 279.8e6, profit: 49.0e6, units: 185000, margin_pct: 17.5, ci_lower: 256.0e6, ci_upper: 303.5e6 }, { year: 2026, revenue: 285.2e6, profit: 49.9e6, units: 190550, margin_pct: 17.5, ci_lower: 261.0e6, ci_upper: 309.5e6 }, { year: 2027, revenue: 290.7e6, profit: 50.9e6, units: 196100, margin_pct: 17.5, ci_lower: 266.0e6, ci_upper: 315.4e6 }, { year: 2028, revenue: 296.4e6, profit: 51.9e6, units: 201650, margin_pct: 17.5, ci_lower: 271.2e6, ci_upper: 321.6e6 }, { year: 2029, revenue: 302.1e6, profit: 52.9e6, units: 207200, margin_pct: 17.5, ci_lower: 276.4e6, ci_upper: 327.8e6 }, { year: 2030, revenue: 308.0e6, profit: 53.9e6, units: 212750, margin_pct: 17.5, ci_lower: 281.8e6, ci_upper: 334.2e6 }, { year: 2031, revenue: 310.0e6, profit: 54.3e6, units: 218300, margin_pct: 17.5, ci_lower: 283.7e6, ci_upper: 336.4e6 }, { year: 2032, revenue: 311.5e6, profit: 54.5e6, units: 223850, margin_pct: 17.5, ci_lower: 285.1e6, ci_upper: 337.9e6 }, { year: 2033, revenue: 312.9e6, profit: 54.8e6, units: 229400, margin_pct: 17.5, ci_lower: 286.4e6, ci_upper: 339.4e6 }, { year: 2034, revenue: 313.8e6, profit: 54.9e6, units: 234950, margin_pct: 17.5, ci_lower: 287.2e6, ci_upper: 340.4e6 }],
  UK: [{ year: 2025, revenue: 282.1e6, profit: 49.4e6, units: 183500, margin_pct: 17.5, ci_lower: 258.1e6, ci_upper: 306.1e6 }, { year: 2026, revenue: 287.5e6, profit: 50.3e6, units: 189005, margin_pct: 17.5, ci_lower: 263.1e6, ci_upper: 312.0e6 }, { year: 2027, revenue: 293.0e6, profit: 51.3e6, units: 194510, margin_pct: 17.5, ci_lower: 268.2e6, ci_upper: 317.9e6 }, { year: 2028, revenue: 298.6e6, profit: 52.3e6, units: 200015, margin_pct: 17.5, ci_lower: 273.3e6, ci_upper: 323.9e6 }, { year: 2029, revenue: 304.3e6, profit: 53.3e6, units: 205520, margin_pct: 17.5, ci_lower: 278.5e6, ci_upper: 330.1e6 }, { year: 2030, revenue: 310.1e6, profit: 54.3e6, units: 211025, margin_pct: 17.5, ci_lower: 283.8e6, ci_upper: 336.4e6 }, { year: 2031, revenue: 312.0e6, profit: 54.6e6, units: 216530, margin_pct: 17.5, ci_lower: 285.6e6, ci_upper: 338.5e6 }, { year: 2032, revenue: 313.2e6, profit: 54.8e6, units: 222035, margin_pct: 17.5, ci_lower: 286.7e6, ci_upper: 339.7e6 }, { year: 2033, revenue: 313.7e6, profit: 54.9e6, units: 227540, margin_pct: 17.5, ci_lower: 287.1e6, ci_upper: 340.3e6 }, { year: 2034, revenue: 314.3e6, profit: 55.0e6, units: 233045, margin_pct: 17.5, ci_lower: 287.6e6, ci_upper: 341.0e6 }],
  Australia: [{ year: 2025, revenue: 287.9e6, profit: 50.4e6, units: 187000, margin_pct: 17.5, ci_lower: 263.4e6, ci_upper: 312.5e6 }, { year: 2026, revenue: 293.5e6, profit: 51.4e6, units: 192610, margin_pct: 17.5, ci_lower: 268.6e6, ci_upper: 318.5e6 }, { year: 2027, revenue: 299.2e6, profit: 52.4e6, units: 198219, margin_pct: 17.5, ci_lower: 273.9e6, ci_upper: 324.6e6 }, { year: 2028, revenue: 305.0e6, profit: 53.4e6, units: 203828, margin_pct: 17.5, ci_lower: 279.1e6, ci_upper: 330.8e6 }, { year: 2029, revenue: 311.0e6, profit: 54.4e6, units: 209437, margin_pct: 17.5, ci_lower: 284.6e6, ci_upper: 337.3e6 }, { year: 2030, revenue: 317.0e6, profit: 55.5e6, units: 215046, margin_pct: 17.5, ci_lower: 290.1e6, ci_upper: 343.9e6 }, { year: 2031, revenue: 319.0e6, profit: 55.8e6, units: 220655, margin_pct: 17.5, ci_lower: 292.0e6, ci_upper: 346.1e6 }, { year: 2032, revenue: 320.2e6, profit: 56.0e6, units: 226264, margin_pct: 17.5, ci_lower: 293.1e6, ci_upper: 347.4e6 }, { year: 2033, revenue: 320.9e6, profit: 56.2e6, units: 231873, margin_pct: 17.5, ci_lower: 293.7e6, ci_upper: 348.1e6 }, { year: 2034, revenue: 321.5e6, profit: 56.3e6, units: 237482, margin_pct: 17.5, ci_lower: 294.2e6, ci_upper: 348.8e6 }],
  France: [{ year: 2025, revenue: 285.2e6, profit: 49.9e6, units: 185800, margin_pct: 17.5, ci_lower: 261.0e6, ci_upper: 309.4e6 }, { year: 2026, revenue: 290.7e6, profit: 50.9e6, units: 191374, margin_pct: 17.5, ci_lower: 266.0e6, ci_upper: 315.4e6 }, { year: 2027, revenue: 296.3e6, profit: 51.9e6, units: 196948, margin_pct: 17.5, ci_lower: 271.2e6, ci_upper: 321.5e6 }, { year: 2028, revenue: 302.0e6, profit: 52.9e6, units: 202522, margin_pct: 17.5, ci_lower: 276.4e6, ci_upper: 327.7e6 }, { year: 2029, revenue: 307.8e6, profit: 53.9e6, units: 208096, margin_pct: 17.5, ci_lower: 281.7e6, ci_upper: 334.0e6 }, { year: 2030, revenue: 313.8e6, profit: 54.9e6, units: 213670, margin_pct: 17.5, ci_lower: 287.2e6, ci_upper: 340.4e6 }, { year: 2031, revenue: 315.2e6, profit: 55.2e6, units: 219244, margin_pct: 17.5, ci_lower: 288.5e6, ci_upper: 341.9e6 }, { year: 2032, revenue: 315.9e6, profit: 55.3e6, units: 224818, margin_pct: 17.5, ci_lower: 289.1e6, ci_upper: 342.7e6 }, { year: 2033, revenue: 316.3e6, profit: 55.4e6, units: 230392, margin_pct: 17.5, ci_lower: 289.5e6, ci_upper: 343.1e6 }, { year: 2034, revenue: 316.7e6, profit: 55.4e6, units: 235966, margin_pct: 17.5, ci_lower: 289.8e6, ci_upper: 343.5e6 }],
  Japan: [{ year: 2025, revenue: 307.3e6, profit: 53.8e6, units: 196000, margin_pct: 17.5, ci_lower: 281.2e6, ci_upper: 333.4e6 }, { year: 2026, revenue: 315.0e6, profit: 55.1e6, units: 201880, margin_pct: 17.5, ci_lower: 288.2e6, ci_upper: 341.7e6 }, { year: 2027, revenue: 322.9e6, profit: 56.5e6, units: 207757, margin_pct: 17.5, ci_lower: 295.5e6, ci_upper: 350.3e6 }, { year: 2028, revenue: 330.9e6, profit: 57.9e6, units: 213634, margin_pct: 17.5, ci_lower: 302.8e6, ci_upper: 359.0e6 }, { year: 2029, revenue: 339.2e6, profit: 59.4e6, units: 219511, margin_pct: 17.5, ci_lower: 310.4e6, ci_upper: 368.0e6 }, { year: 2030, revenue: 347.6e6, profit: 60.8e6, units: 225388, margin_pct: 17.5, ci_lower: 318.1e6, ci_upper: 377.1e6 }, { year: 2031, revenue: 349.5e6, profit: 61.2e6, units: 231265, margin_pct: 17.5, ci_lower: 319.9e6, ci_upper: 379.2e6 }, { year: 2032, revenue: 350.4e6, profit: 61.3e6, units: 237142, margin_pct: 17.5, ci_lower: 320.7e6, ci_upper: 380.1e6 }, { year: 2033, revenue: 350.9e6, profit: 61.4e6, units: 243019, margin_pct: 17.5, ci_lower: 321.1e6, ci_upper: 380.6e6 }, { year: 2034, revenue: 351.2e6, profit: 61.5e6, units: 248896, margin_pct: 17.5, ci_lower: 321.4e6, ci_upper: 381.0e6 }],
};

let HIST_COUNTRY = [
  { year: 2024, country: 'India', revenue: 36.2e8, profit: 6.33e8, units: 5365000 },
  { year: 2024, country: 'USA', revenue: 56.8e8, profit: 9.93e8, units: 5621000 },
  { year: 2024, country: 'Germany', revenue: 51.0e8, profit: 8.93e8, units: 5487000 },
  { year: 2024, country: 'UK', revenue: 46.2e8, profit: 8.08e8, units: 5342000 },
  { year: 2024, country: 'Australia', revenue: 49.3e8, profit: 8.63e8, units: 5398000 },
  { year: 2024, country: 'France', revenue: 44.1e8, profit: 7.72e8, units: 5284000 },
  { year: 2024, country: 'Japan', revenue: 55.9e8, profit: 9.78e8, units: 5579000 },
];

let ANOMALY_DATA = [
  { year: 2020, country: 'India', actual: 5.12e9, predicted: 5.60e9, deviation: 8.6, direction: 'below' },
  { year: 2017, country: 'Germany', actual: 7.80e9, predicted: 6.71e9, deviation: 16.2, direction: 'above' },
  { year: 2022, country: 'UK', actual: 4.50e9, predicted: 5.20e9, deviation: 13.5, direction: 'below' },
  { year: 2018, country: 'USA', actual: 8.10e9, predicted: 6.85e9, deviation: 18.2, direction: 'above' },
  { year: 2019, country: 'Australia', actual: 6.30e9, predicted: 5.52e9, deviation: 14.1, direction: 'above' },
  { year: 2021, country: 'Japan', actual: 5.90e9, predicted: 6.80e9, deviation: 13.2, direction: 'below' },
  { year: 2023, country: 'France', actual: 5.10e9, predicted: 5.88e9, deviation: 13.3, direction: 'below' },
];

let MODELS_DATA = Array.from({ length: 20 }, (_, i) => ({
  model_id: i + 1,
  car_model: `TataModel_${i + 1}`,
  car_type: ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup', 'Coupe'][i % 6],
  fuel_type: ['Electric', 'Hybrid', 'Diesel', 'Petrol'][i % 4],
  price_usd: Math.round(15000 + i * 2500 + Math.random() * 5000),
  engine_cc: [0, 1500, 2000, 1200][i % 4],
  horsepower: 80 + i * 8,
  safety_rating: (3.5 + (i % 3) * 0.5).toFixed(1),
  car_img_url: '',
}));

// ── STATE ────────────────────────────────────────────────
const state = {
  currentSection: 'overview',
  histYears: 10,
  fcCountry: 'India',
  fcYears: 5,
  wiChart: null,
  chartInstances: {},
  activeHistCountries: new Set(['India', 'USA', 'Germany', 'UK']),
};

// ── UTILS ────────────────────────────────────────────────
function fmt(val, unit = 'B') {
  if (unit === 'B') return '$' + (val / 1e9).toFixed(1) + 'B';
  if (unit === 'M') return '$' + (val / 1e6).toFixed(1) + 'M';
  if (unit === 'K') return (val / 1e3).toFixed(0) + 'K';
  return val.toLocaleString();
}
function fmtM(val) { return '$' + (val / 1e6).toFixed(1) + 'M'; }
function pct(val) { const v = parseFloat(val); return (v >= 0 ? '+' : '') + v.toFixed(1) + '%'; }

function destroyChart(id) {
  if (state.chartInstances[id]) {
    state.chartInstances[id].destroy();
    delete state.chartInstances[id];
  }
}
function makeChart(id, config) {
  destroyChart(id);
  const ctx = document.getElementById(id);
  if (!ctx) return null;
  const c = new Chart(ctx, config);
  state.chartInstances[id] = c;
  return c;
}

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function animateCounter(el, target, prefix = '', suffix = '', decimals = 1) {
  const start = 0, duration = 1200;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + (start + (target - start) * ease).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── API / MOCK ───────────────────────────────────────────
async function apiCall(endpoint, method = 'GET', body = null) {
  if (USE_MOCK) return null; // use inline data
  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API_BASE + endpoint, opts);
    return await res.json();
  } catch (e) {
    console.warn('API error:', e);
    return null;
  }
}

// ── NAVIGATION ───────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');
  const nav = document.querySelector(`[data-section="${id}"]`);
  if (nav) nav.classList.add('active');
  state.currentSection = id;
  renderSection(id);
  // Close mobile sidebar
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function renderSection(id) {
  const renderers = {
    'overview': renderOverview,
    'historical': renderHistorical,
    'forecast': renderForecast,
    'worldmap': renderWorldMap,
    'whatif': () => { },
    'compare': renderCompare,
    'elasticity': renderElasticity,
    'goal': () => { },
    'segment': () => { },
    'filters': renderFilters,
    'models-grid': renderModelsGrid,
    'threats': renderThreats,
    'anomalies': renderAnomalies,
    'model-perf': renderModelPerf,
    'methodology': renderMethodology,
  };
  if (renderers[id]) renderers[id]();
}

// ── OVERVIEW ─────────────────────────────────────────────
function renderOverview() {
  const latest = HIST_GLOBAL[HIST_GLOBAL.length - 1];
  const prev = HIST_GLOBAL[HIST_GLOBAL.length - 2];

  // KPIs
  const kpiRevEl = document.getElementById('kpiRevenue');
  if (kpiRevEl) animateCounter(kpiRevEl, latest.revenue / 1e9, '$', 'B');
  const kpiProfEl = document.getElementById('kpiProfit');
  if (kpiProfEl) animateCounter(kpiProfEl, latest.profit / 1e9, '$', 'B');

  const unitsEl = document.getElementById('kpiUnits');
  if (unitsEl) animateCounter(unitsEl, latest.units / 1e6, '', 'M');

  const marginEl = document.getElementById('kpiMargin');
  if (marginEl) animateCounter(marginEl, latest.margin, '', '%');

  const fcEl = document.getElementById('kpiForecast');
  const fc25 = FORECAST_DATA['India'][0];
  if (fcEl) animateCounter(fcEl, fc25.revenue / 1e6, '$', 'M');

  const rd = ((latest.revenue - prev.revenue) / prev.revenue * 100);
  const pd = ((latest.profit - prev.profit) / prev.profit * 100);
  const setDelta = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = pct(val) + ' vs 2023';
    el.className = 'kpi-delta ' + (val >= 0 ? 'positive' : 'negative');
  };
  setDelta('kpiRevDelta', rd);
  setDelta('kpiProfitDelta', pd);
  const mEl = document.getElementById('kpiMarginDelta');
  if (mEl) { mEl.textContent = 'Avg across all markets'; mEl.className = 'kpi-delta neutral'; }

  // Revenue chart
  renderOverviewRevChart(10);
  renderCountryDonut();
  renderFuelDonut();
  renderChannelDonut();
  renderTopModelsChart();
  renderLeaderboard();

  document.getElementById('overviewTimeToggle')?.querySelectorAll('.tt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#overviewTimeToggle .tt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderOverviewRevChart(parseInt(btn.dataset.years));
    });
  });
}

function renderOverviewRevChart(years) {
  const data = HIST_GLOBAL.slice(-years);
  const labels = data.map(d => d.year);
  makeChart('chartOverviewRevenue', {
    type: 'line',
    data: {
      labels, datasets: [
        {
          label: 'Revenue ($B)', data: data.map(d => +(d.revenue / 1e9).toFixed(1)),
          borderColor: BLUE, backgroundColor: 'rgba(79,142,247,0.10)', tension: .4, fill: true, pointRadius: 4, borderWidth: 2.5, yAxisID: 'y'
        },
        {
          label: 'Profit ($B)', data: data.map(d => +(d.profit / 1e9).toFixed(2)),
          borderColor: GREEN, backgroundColor: 'rgba(34,211,160,0.08)', tension: .4, fill: true, pointRadius: 4, borderWidth: 2, yAxisID: 'y1'
        },
      ]
    },
    options: {
      ...baseOpts(), scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 11 } }, border: { color: GRID } },
        y: { position: 'left', grid: { color: GRID }, ticks: { color: TICK, font: { size: 11 }, callback: v => '$' + v + 'B' }, border: { color: GRID } },
        y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: TICK, font: { size: 11 }, callback: v => '$' + v + 'B' }, border: { color: GRID } },
      }, plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } }
    }
  });
}

function renderCountryDonut() {
  makeChart('chartCountryDonut', {
    type: 'doughnut',
    data: {
      labels: HIST_COUNTRY.map(c => c.country),
      datasets: [{ data: HIST_COUNTRY.map(c => +(c.revenue / 1e8).toFixed(1)), backgroundColor: COLORS, borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '65%',
      plugins: { legend: { position: 'right', labels: { color: TICK, font: { size: 11 }, padding: 12 } } }
    }
  });
}

function renderFuelDonut() {
  makeChart('chartFuelDonut', {
    type: 'doughnut',
    data: { labels: ['Hybrid', 'Electric', 'Diesel', 'Petrol'], datasets: [{ data: [38, 32, 16, 14], backgroundColor: [BLUE, GREEN, RED, AMBER], borderWidth: 0, hoverOffset: 6 }] },
    options: { responsive: true, maintainAspectRatio: true, cutout: '65%', plugins: { legend: { position: 'right', labels: { color: TICK, font: { size: 10 }, padding: 10 } } } }
  });
}

function renderChannelDonut() {
  makeChart('chartChannelDonut', {
    type: 'doughnut',
    data: { labels: ['Fleet', 'Direct', 'Online', 'Dealership'], datasets: [{ data: [25, 25, 25, 25], backgroundColor: [PURPLE, BLUE, TEAL, AMBER], borderWidth: 0, hoverOffset: 6 }] },
    options: { responsive: true, maintainAspectRatio: true, cutout: '65%', plugins: { legend: { position: 'right', labels: { color: TICK, font: { size: 10 }, padding: 10 } } } }
  });
}

function renderTopModelsChart() {
  const labels = ['Model 29', 'Model 22', 'Model 10', 'Model 15', 'Model 8'];
  const values = [12.39, 11.27, 11.00, 10.85, 10.62];
  makeChart('chartTopModels', {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Revenue ($B)', data: values, backgroundColor: BLUE + 'cc', borderRadius: 6 }] },
    options: {
      ...baseOpts(), indexAxis: 'y', plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 11 }, callback: v => '$' + v + 'B' }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 11 } }, border: { color: GRID } }
      }
    }
  });
}

function renderLeaderboard() {
  const el = document.getElementById('leaderboardContainer');
  if (!el) return;
  const countries = [...HIST_COUNTRY].sort((a, b) => b.revenue - a.revenue);
  const maxRev = countries[0].revenue;
  const rankIcon = ['gold', 'silver', 'bronze'];

  const makeSection = (title, items, valueKey, valueFmt) => `
    <div class="lb-section">
      <h4>${title}</h4>
      ${items.map((item, i) => {
    const val = item[valueKey];
    const pctWidth = (val / items[0][valueKey] * 100).toFixed(0);
    return `<div class="lb-row">
          <span class="lb-rank ${rankIcon[i] || ''}">#${i + 1}</span>
          <span class="lb-name">${item.country || item.car_model || '—'}</span>
          <div class="lb-bar-wrap"><div class="lb-bar-fill" style="width:${pctWidth}%"></div></div>
          <span class="lb-val">${valueFmt(val)}</span>
        </div>`;
  }).join('')}
    </div>`;

  el.innerHTML =
    makeSection('Top Countries by Revenue', countries.slice(0, 5), 'revenue', v => fmtM(v)) +
    makeSection('Top Countries by Units', [...HIST_COUNTRY].sort((a, b) => b.units - a.units).slice(0, 5), 'units', v => (v / 1e6).toFixed(1) + 'M');
}

// ── HISTORICAL ───────────────────────────────────────────
function renderHistorical() {
  const years = state.histYears;
  const data = HIST_GLOBAL.slice(-years);
  const labels = data.map(d => d.year);

  const lineOpts = {
    responsive: true, maintainAspectRatio: true,
    plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
    scales: {
      x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
      y: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } }
    }
  };

  makeChart('chartHistRevenue', {
    type: 'bar',
    data: {
      labels, datasets: [{
        label: 'Revenue ($B)', data: data.map(d => +(d.revenue / 1e9).toFixed(1)),
        backgroundColor: data.map((_, i) => i === data.length - 1 ? BLUE : BLUE + '66'), borderRadius: 6
      }]
    },
    options: {
      ...lineOpts, plugins: { legend: { display: false } }, scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'B' }, border: { color: GRID } }
      }
    }
  });

  makeChart('chartHistProfit', {
    type: 'bar',
    data: {
      labels, datasets: [{
        label: 'Profit ($B)', data: data.map(d => +(d.profit / 1e9).toFixed(2)),
        backgroundColor: GREEN + '88', borderRadius: 6
      }]
    },
    options: {
      ...lineOpts, plugins: { legend: { display: false } }, scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'B' }, border: { color: GRID } }
      }
    }
  });

  makeChart('chartHistUnits', {
    type: 'line',
    data: {
      labels, datasets: [{
        label: 'Units (M)', data: data.map(d => +(d.units / 1e6).toFixed(1)),
        borderColor: PURPLE, backgroundColor: 'rgba(124,92,252,0.10)', tension: .4, fill: true, pointRadius: 4, borderWidth: 2.5
      }]
    },
    options: lineOpts
  });

  makeChart('chartHistMargin', {
    type: 'line',
    data: {
      labels, datasets: [{
        label: 'Margin %', data: data.map(d => +d.margin.toFixed(2)),
        borderColor: AMBER, backgroundColor: 'rgba(245,166,35,0.10)', tension: .4, fill: true, pointRadius: 4, borderWidth: 2.5
      }]
    },
    options: {
      ...lineOpts, scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { min: 15, max: 20, grid: { color: GRID }, ticks: { color: TICK, callback: v => v + '%' }, border: { color: GRID } }
      }
    }
  });

  renderHistCountryChart();
  renderHistCountryFilter();

  // Time toggle
  document.getElementById('histTimeToggle')?.querySelectorAll('.tt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#histTimeToggle .tt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.histYears = parseInt(btn.dataset.years);
      renderHistorical();
    });
  });
}

function renderHistCountryFilter() {
  const el = document.getElementById('histCountryFilter');
  if (!el) return;
  const countries = ['India', 'USA', 'Germany', 'UK', 'Australia', 'France', 'Japan'];
  el.innerHTML = countries.map(c => `
    <button class="country-chip ${state.activeHistCountries.has(c) ? 'active' : ''}" data-c="${c}">${c}</button>
  `).join('');
  el.querySelectorAll('.country-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const c = chip.dataset.c;
      if (state.activeHistCountries.has(c)) state.activeHistCountries.delete(c);
      else state.activeHistCountries.add(c);
      chip.classList.toggle('active');
      renderHistCountryChart();
    });
  });
}

function renderHistCountryChart() {
  const countries = [...state.activeHistCountries];
  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const baseRevs = { India: 3.62, USA: 5.68, Germany: 5.10, UK: 4.62, Australia: 4.93, France: 4.41, Japan: 5.59 };
  const datasets = countries.map((c, i) => ({
    label: c,
    data: years.map((yr, j) => {
      const base = baseRevs[c] || 4.5;
      const noise = Math.sin(j * 0.7 + i) * 0.3;
      return +(base + noise + j * 0.02).toFixed(2);
    }),
    borderColor: COLORS[i], backgroundColor: 'transparent',
    tension: .4, pointRadius: 3, borderWidth: 2,
  }));

  makeChart('chartHistCountry', {
    type: 'line',
    data: { labels: years, datasets },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'B' }, border: { color: GRID } }
      }
    }
  });
}

// ── FORECAST ─────────────────────────────────────────────
function renderForecast() {
  const country = document.getElementById('fcCountry')?.value || 'India';
  const years = state.fcYears;
  state.fcCountry = country;

  document.getElementById('fcChartTitle').textContent = `${country} — Revenue Forecast with Confidence Bands`;

  const fc = FORECAST_DATA[country].slice(0, years);
  const fcLabels = fc.map(d => d.year);

  // Mini KPIs
  const rev25 = fc[0]?.revenue || 0;
  const peak = Math.max(...fc.map(d => d.revenue));
  const cagr = fc.length > 1 ? ((fc[fc.length - 1].revenue / fc[0].revenue) ** (1 / (fc.length - 1)) - 1) * 100 : 0;

  const setKpi = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setKpi('fcRev2025', fmtM(rev25));
  setKpi('fcRevPeak', fmtM(peak));
  setKpi('fcCAGR', pct(cagr) + '/yr');

  // Main forecast chart with CI bands
  makeChart('chartForecastMain', {
    type: 'line',
    data: {
      labels: fcLabels, datasets: [
        {
          label: 'CI Upper', data: fc.map(d => +(d.ci_upper / 1e6).toFixed(1)),
          borderColor: 'transparent', backgroundColor: 'rgba(79,142,247,0.15)', fill: true, pointRadius: 0, tension: .4
        },
        {
          label: 'Predicted Revenue ($M)', data: fc.map(d => +(d.revenue / 1e6).toFixed(1)),
          borderColor: BLUE, backgroundColor: 'transparent', fill: false, pointRadius: 5, pointBackgroundColor: BLUE, tension: .4, borderWidth: 2.5
        },
        {
          label: 'CI Lower', data: fc.map(d => +(d.ci_lower / 1e6).toFixed(1)),
          borderColor: 'transparent', backgroundColor: 'rgba(79,142,247,0.15)', fill: '-2', pointRadius: 0, tension: .4
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: TICK, font: { size: 11 }, filter: item => item.text !== 'CI Upper' && item.text !== 'CI Lower' } } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'M' }, border: { color: GRID } }
      }
    }
  });

  // All countries 5Y
  const countries = Object.keys(FORECAST_DATA);
  makeChart('chartForecastAllCountries', {
    type: 'bar',
    data: {
      labels: ['2025', '2026', '2027', '2028', '2029'],
      datasets: countries.map((c, i) => ({
        label: c,
        data: FORECAST_DATA[c].slice(0, 5).map(d => +(d.revenue / 1e6).toFixed(1)),
        backgroundColor: COLORS[i] + 'aa', borderRadius: 4,
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: TICK, font: { size: 10 } } } },
      scales: {
        x: { stacked: false, grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'M' }, border: { color: GRID } }
      }
    }
  });

  // Profit forecast
  makeChart('chartForecastProfit', {
    type: 'line',
    data: {
      labels: fcLabels, datasets: [{
        label: 'Profit Forecast ($M)', data: fc.map(d => +(d.profit / 1e6).toFixed(1)),
        borderColor: GREEN, backgroundColor: 'rgba(34,211,160,0.10)', fill: true, tension: .4, pointRadius: 4, borderWidth: 2.5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'M' }, border: { color: GRID } }
      }
    }
  });

  // Wire up controls
  document.getElementById('fcCountry')?.addEventListener('change', () => { state.fcCountry = document.getElementById('fcCountry').value; renderForecast(); });
  document.getElementById('fcTimeToggle')?.querySelectorAll('.tt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#fcTimeToggle .tt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.fcYears = parseInt(btn.dataset.years);
      renderForecast();
    });
  });
}

// ── WORLD MAP ─────────────────────────────────────────────
function renderWorldMap() {
  const container = document.getElementById('worldMapContainer');
  if (!container) return;
  const countries = [
    { name: 'Australia', rev: 287.9, flag: '🇦🇺', color: '#4f8ef7' },
    { name: 'France', rev: 285.2, flag: '🇫🇷', color: '#7c5cfc' },
    { name: 'Germany', rev: 279.8, flag: '🇩🇪', color: '#22d3a0' },
    { name: 'India', rev: 295.2, flag: '🇮🇳', color: '#f5a623' },
    { name: 'Japan', rev: 307.3, flag: '🇯🇵', color: '#f25c54' },
    { name: 'UK', rev: 282.1, flag: '🇬🇧', color: '#00d4c8' },
    { name: 'USA', rev: 316.5, flag: '🇺🇸', color: '#e879a0' },
  ];
  const maxRev = Math.max(...countries.map(c => c.rev));

  container.innerHTML = countries.map(c => {
    const size = 60 + (c.rev / maxRev) * 80;
    return `<div class="map-country" onclick="drillCountry('${c.name}')">
      <div class="map-bubble" style="width:${size}px;height:${size}px;background:${c.color}33;border:2px solid ${c.color}66;box-shadow:0 0 20px ${c.color}44">
        <span style="font-size:${size * 0.35}px">${c.flag}</span>
      </div>
      <div class="map-label">${c.name}</div>
      <div class="map-value">$${c.rev.toFixed(0)}M</div>
    </div>`;
  }).join('');

  // Country ranking chart
  const sorted = [...countries].sort((a, b) => b.rev - a.rev);
  makeChart('chartCountryRank', {
    type: 'bar',
    data: {
      labels: sorted.map(c => c.name),
      datasets: [{
        label: '2025 Forecast ($M)', data: sorted.map(c => c.rev),
        backgroundColor: sorted.map(c => c.color + 'cc'), borderRadius: 6
      }]
    },
    options: {
      ...baseOpts(), indexAxis: 'y', plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'M' }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } }
      }
    }
  });

  // Historical vs forecast by country
  const cLabels = countries.map(c => c.name);
  makeChart('chartCountryCompare', {
    type: 'bar',
    data: {
      labels: cLabels, datasets: [
        { label: '2024 Actual ($M)', data: [362, 568, 510, 462, 493, 441, 559], backgroundColor: BLUE + '88', borderRadius: 4 },
        { label: '2025 Forecast ($M)', data: countries.map(c => c.rev), backgroundColor: GREEN + '88', borderRadius: 4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'M' }, border: { color: GRID } }
      }
    }
  });
}

window.drillCountry = function (country) {
  document.getElementById('fcCountry').value = country;
  showSection('forecast');
  toast(`Viewing forecast for ${country}`, 'success');
};

// ── COMPARE ──────────────────────────────────────────────
function renderCompare() {
  const a = document.getElementById('cmpA')?.value || 'India';
  const b = document.getElementById('cmpB')?.value || 'Germany';
  renderCompareCharts(a, b);
}

function renderCompareCharts(a, b) {
  const fcA = FORECAST_DATA[a]?.slice(0, 5) || [];
  const fcB = FORECAST_DATA[b]?.slice(0, 5) || [];
  const labels = fcA.map(d => d.year);

  makeChart('chartCompare', {
    type: 'line',
    data: {
      labels, datasets: [
        { label: `${a} Revenue ($M)`, data: fcA.map(d => +(d.revenue / 1e6).toFixed(1)), borderColor: BLUE, backgroundColor: 'rgba(79,142,247,0.08)', fill: true, tension: .4, pointRadius: 4, borderWidth: 2.5 },
        { label: `${b} Revenue ($M)`, data: fcB.map(d => +(d.revenue / 1e6).toFixed(1)), borderColor: AMBER, backgroundColor: 'rgba(245,166,35,0.08)', fill: true, tension: .4, pointRadius: 4, borderWidth: 2.5, borderDash: [6, 3] },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'M' }, border: { color: GRID } }
      }
    }
  });

  // Summary tables
  const mkTable = (country, fc, colId) => {
    const el = document.getElementById(colId);
    if (!el) return;
    const total = fc.reduce((s, d) => s + d.revenue, 0);
    const cagr = fc.length > 1 ? ((fc[fc.length - 1].revenue / fc[0].revenue) ** (1 / (fc.length - 1)) - 1) * 100 : 0;
    el.innerHTML = `<div class="cmp-table-inner">
      <div class="cmp-table-title">${country}</div>
      <table class="data-table">
        <thead><tr><th>Year</th><th>Revenue ($M)</th><th>Profit ($M)</th><th>Margin</th></tr></thead>
        <tbody>${fc.map(d => `<tr><td>${d.year}</td><td>${(d.revenue / 1e6).toFixed(1)}</td><td>${(d.profit / 1e6).toFixed(1)}</td><td>${d.margin_pct}%</td></tr>`).join('')}</tbody>
      </table>
      <div style="margin-top:12px;font-size:12px;color:var(--text-muted)">5Y Total: <strong>${(total / 1e6).toFixed(0)}M</strong> &nbsp;·&nbsp; CAGR: <strong style="color:var(--green)">${cagr.toFixed(1)}%</strong></div>
    </div>`;
  };
  mkTable(a, fcA, 'cmpTableA');
  mkTable(b, fcB, 'cmpTableB');
}

window.runCompare = function () {
  const a = document.getElementById('cmpA')?.value;
  const b = document.getElementById('cmpB')?.value;
  if (a === b) { toast('Please select different countries', 'warning'); return; }
  renderCompareCharts(a, b);
};

// ── ELASTICITY ───────────────────────────────────────────
async function renderElasticity() {
  const country = document.getElementById('elasCountry')?.value || 'India';
  const changes = [-20, -15, -10, -5, 0, 5, 10, 15, 20];
  
  let rows = [];
  let basePrice = 28000, baseUnits = 190000;
  
  if (!USE_MOCK) {
    const changesStr = changes.join(',');
    const res = await apiCall(`/elasticity/1?country=${country}&price_changes=${changesStr}`);
    if (res && res.elasticity) {
      rows = res.elasticity;
      const zeroRow = rows.find(r => r.pct === 0) || rows[4];
      if (zeroRow) {
         basePrice = zeroRow.new_price_usd;
         baseUnits = zeroRow.estimated_units;
      }
    }
  }

  if (rows.length === 0) {
    // mock fallback
    const elasticity = -1.2;
    rows = changes.map(pct => {
      const np = basePrice * (1 + pct / 100);
      const nu = baseUnits * (1 + elasticity * (pct / 100));
      const nr = np * nu;
      return { pct, new_price_usd: np, estimated_units: nu, estimated_revenue: nr };
    });
  }

  makeChart('chartElasticity', {
    type: 'line',
    data: {
      labels: changes.map(c => (c >= 0 ? '+' : '') + c + '%'), datasets: [
        {
          label: 'Revenue ($M)', data: rows.map(r => +(r.estimated_revenue / 1e6).toFixed(1)),
          borderColor: BLUE, backgroundColor: 'rgba(79,142,247,0.1)', fill: true, tension: .3, pointRadius: 5, borderWidth: 2.5, yAxisID: 'y'
        },
        {
          label: 'Units Sold (K)', data: rows.map(r => +(r.estimated_units / 1e3).toFixed(1)),
          borderColor: AMBER, backgroundColor: 'transparent', fill: false, tension: .3, pointRadius: 5, borderWidth: 2, yAxisID: 'y1'
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { position: 'left', grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'M' }, border: { color: GRID } },
        y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: TICK, callback: v => v + 'K' }, border: { color: GRID } },
      }
    }
  });

  const tableEl = document.getElementById('elasticityTable');
  if (tableEl) {
    tableEl.innerHTML = `<div style="padding:4px">
      <table class="data-table">
        <thead><tr><th>Price Change</th><th>New Price ($)</th><th>Est. Units</th><th>Est. Revenue ($M)</th><th>Impact</th></tr></thead>
        <tbody>${rows.map(r => `<tr>
          <td><span class="pill ${r.pct < 0 ? 'pill-down' : r.pct > 0 ? 'pill-amber' : 'pill-blue'}">${r.pct >= 0 ? '+' : ''}${r.pct}%</span></td>
          <td>$${r.new_price_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          <td>${(r.estimated_units / 1e3).toFixed(1)}K</td>
          <td>$${(r.estimated_revenue / 1e6).toFixed(1)}M</td>
          <td><span class="pill ${r.estimated_revenue >= basePrice * baseUnits ? 'pill-up' : 'pill-down'}">${r.estimated_revenue >= basePrice * baseUnits ? '▲' : '▼'}</span></td>
        </tr>`).join('')}</tbody>
      </table></div>`;
  }

  document.getElementById('elasCountry')?.addEventListener('change', renderElasticity);
}

// ── WHAT-IF ──────────────────────────────────────────────
function initWhatIf() {
  const sliders = [
    { id: 'wiCost', valId: 'wiCostVal' },
    { id: 'wiRnd', valId: 'wiRndVal' },
    { id: 'wiMkt', valId: 'wiMktVal' },
    { id: 'wiUnits', valId: 'wiUnitsVal' },
  ];
  sliders.forEach(({ id, valId }) => {
    const el = document.getElementById(id);
    const vl = document.getElementById(valId);
    if (!el || !vl) return;
    el.addEventListener('input', () => {
      const v = parseInt(el.value);
      vl.textContent = (v >= 0 ? '+' : '') + v + '%';
      const pct = (v + 20) / 40 * 100;
      el.style.setProperty('--pct', pct + '%');
    });
  });
}

window.runWhatIf = async function () {
  const country = document.getElementById('wiCountry')?.value || 'India';
  const year = parseInt(document.getElementById('wiYear')?.value || '2025');
  const costD = parseInt(document.getElementById('wiCost')?.value || '0');
  const rndD = parseInt(document.getElementById('wiRnd')?.value || '0');
  const mktD = parseInt(document.getElementById('wiMkt')?.value || '0');
  const unitsD = parseInt(document.getElementById('wiUnits')?.value || '0');

  let baseRev, adjRev, delta, deltaPct, costImpact, rndImpact, mktImpact, unitsImpact;

  if (!USE_MOCK) {
    const res = await apiCall('/what-if', 'POST', {
      country, year, model_id: 1,
      cost_ratio_delta: costD, rnd_delta: rndD, marketing_delta: mktD, units_delta: unitsD
    });
    if (res) {
      baseRev = res.baseline_revenue;
      adjRev = res.adjusted_revenue;
      delta = res.delta;
      deltaPct = res.delta_pct;
      
      const impacts = res.levers_applied || {};
      costImpact = (impacts.cost_ratio_delta || 0) * -0.00689;
      rndImpact = (impacts.rnd_delta || 0) * 0.00023;
      mktImpact = (impacts.marketing_delta || 0) * 0.00015;
      unitsImpact = (impacts.units_delta || 0) * 0.00105;
    }
  }
  
  if (baseRev === undefined) {
    const fc = FORECAST_DATA[country];
    const yearFc = fc?.find(d => d.year === year) || fc?.[0];
    if (!yearFc) return;

    costImpact = -costD * 0.689 * 0.01;
    rndImpact = rndD * 0.023 * 0.01;
    mktImpact = mktD * 0.015 * 0.01;
    unitsImpact = unitsD * 0.105 * 0.01;
    const totalDelta = (costImpact + rndImpact + mktImpact + unitsImpact);
    
    baseRev = yearFc.revenue;
    adjRev = baseRev * (1 + totalDelta);
    delta = adjRev - baseRev;
    deltaPct = (delta / baseRev) * 100;
  }

  const resultEl = document.getElementById('wiResult');
  if (resultEl) {
    resultEl.innerHTML = `<div class="wi-result-card">
      <div class="wi-stat"><div class="wi-stat-label">Baseline Revenue</div><div class="wi-stat-val">${fmtM(baseRev)}</div></div>
      <div class="wi-stat"><div class="wi-stat-label">Adjusted Revenue</div><div class="wi-stat-val" style="color:${delta >= 0 ? 'var(--green)' : 'var(--red)'}">${fmtM(adjRev)}</div></div>
      <div class="wi-stat"><div class="wi-stat-label">Delta</div><div class="wi-stat-val" style="color:${delta >= 0 ? 'var(--green)' : 'var(--red)'}">${delta >= 0 ? '+' : ''}${fmtM(delta)}</div></div>
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:8px">
      ${country} · ${year} · YoY impact: <strong style="color:${delta >= 0 ? 'var(--green)' : 'var(--red)'}">${delta >= 0 ? '+' : ''}${deltaPct.toFixed(1)}%</strong>
    </div>`;
  }

  const levers = ['Cost Ratio', 'R&D Spend', 'Marketing', 'Units Sold'];
  const impacts = [costImpact, rndImpact, mktImpact, unitsImpact].map(v => +(v * 100).toFixed(2));
  makeChart('chartWiResult', {
    type: 'bar',
    data: {
      labels: levers, datasets: [{
        label: 'Revenue Impact (%)',
        data: impacts,
        backgroundColor: impacts.map(v => v >= 0 ? GREEN + 'aa' : RED + 'aa'), borderRadius: 6
      }]
    },
    options: {
      ...baseOpts(), plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => v + '%' }, border: { color: GRID } }
      }
    }
  });
  toast('Simulation complete', 'success');
};

window.resetWhatIf = function () {
  ['wiCost', 'wiRnd', 'wiMkt', 'wiUnits'].forEach(id => {
    const el = document.getElementById(id); if (el) { el.value = 0; el.style.setProperty('--pct', '50%'); }
  });
  ['wiCostVal', 'wiRndVal', 'wiMktVal', 'wiUnitsVal'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = '0%';
  });
  const r = document.getElementById('wiResult');
  if (r) r.innerHTML = '<div class="wi-result-placeholder">Adjust levers and click Run Simulation</div>';
  destroyChart('chartWiResult');
};

// ── GOAL TRACKER ─────────────────────────────────────────
window.runGoalTracker = async function () {
  const country = document.getElementById('goalCountry')?.value || 'India';
  const year = parseInt(document.getElementById('goalYear')?.value || '2026');
  const target = parseFloat(document.getElementById('goalTarget')?.value || 350) * 1e6;

  let gap, costLvr, progress, achievable, fcRev;

  if (!USE_MOCK) {
    const res = await apiCall('/goal-tracker', 'POST', { country, year, target_revenue: target });
    if (res) {
      fcRev = res.forecast_revenue;
      gap = res.gap;
      costLvr = res.required_levers?.cost_ratio_reduction_pct || 0;
      progress = Math.min(fcRev / target * 100, 100);
      achievable = res.is_achievable;
    }
  }

  if (fcRev === undefined) {
    const fc = FORECAST_DATA[country]?.find(d => d.year === year);
    if (!fc) return;
    fcRev = fc.revenue;
    gap = target - fcRev;
    const gapPct = (gap / fcRev) * 100;
    costLvr = gapPct / 0.689;
    progress = Math.min(fcRev / target * 100, 100);
    achievable = Math.abs(costLvr) < 15;
  }

  document.getElementById('goalResult').innerHTML = `<div class="goal-result-inner">
    <div class="card-header"><h3>Gap Analysis — ${country} ${year}</h3></div>
    <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${progress.toFixed(0)}%"></div></div>
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px">${progress.toFixed(0)}% of target achieved (forecast)</div>
    <div class="goal-metric"><span class="gm-label">Target Revenue</span><span class="gm-val">${fmtM(target)}</span></div>
    <div class="goal-metric"><span class="gm-label">Forecast Revenue</span><span class="gm-val">${fmtM(fcRev)}</span></div>
    <div class="goal-metric"><span class="gm-label">Gap</span><span class="gm-val" style="color:${gap <= 0 ? 'var(--green)' : 'var(--red)'}">${gap <= 0 ? '✓ Exceeded' : fmtM(Math.abs(gap)) + ' shortfall'}</span></div>
    <div class="goal-metric"><span class="gm-label">Required Cost Reduction</span><span class="gm-val">${costLvr.toFixed(1)}%</span></div>
    <div class="goal-metric"><span class="gm-label">Achievable?</span><span class="gm-val" style="color:${achievable ? 'var(--green)' : 'var(--red)'}">${achievable ? '✓ Yes' : '✗ Stretch target'}</span></div>
  </div>`;
};

// ── SEGMENT PREDICT ──────────────────────────────────────
window.runSegment = async function () {
  const country = document.getElementById('segCountry')?.value || 'India';
  const fuel = document.getElementById('segFuel')?.value || 'Electric';
  const carType = document.getElementById('segCarType')?.value || 'SUV';
  const price = parseFloat(document.getElementById('segPrice')?.value || 25000);

  let seg;

  if (!USE_MOCK) {
    const res = await apiCall('/segment-predict', 'POST', { country, fuel_type: fuel, car_type: carType, price_usd: price });
    if (res && res.predicted_segment) {
      const ps = res.predicted_segment;
      seg = { age: ps.age_group, income: ps.income_group, prof: ps.profession, loyalty: ps.loyalty_score, churn: ps.churn_risk, test_drive: ps.test_drive_prob, ftb: ps.first_time_buyer_prob, payment: ps.payment_mode };
    }
  }

  if (!seg) {
    const segMap = {
      Electric: { age: '30–45', income: 'High', prof: 'Tech / Engineer', loyalty: 0.72, churn: 'Low', test_drive: 0.68, ftb: 0.31, payment: price > 20000 ? 'Loan' : 'Cash' },
      Hybrid:   { age: '45–60', income: 'High', prof: 'Business / Finance', loyalty: 0.66, churn: 'Low', test_drive: 0.68, ftb: 0.31, payment: price > 20000 ? 'Loan' : 'Cash' },
      Petrol:   { age: '30–45', income: 'Medium', prof: 'Service / Sales', loyalty: 0.54, churn: 'Medium', test_drive: 0.68, ftb: 0.31, payment: price > 20000 ? 'Loan' : 'Cash' },
      Diesel:   { age: '45–60', income: 'Medium', prof: 'Transport / Logistics', loyalty: 0.49, churn: 'Medium', test_drive: 0.68, ftb: 0.31, payment: price > 20000 ? 'Loan' : 'Cash' },
    };
    seg = segMap[fuel] || segMap['Petrol'];
  }

  document.getElementById('segResult').innerHTML = `<div class="seg-grid">
    <div class="seg-item"><div class="si-label">Age Group</div><div class="si-val">${seg.age}</div></div>
    <div class="seg-item"><div class="si-label">Income</div><div class="si-val">${seg.income}</div></div>
    <div class="seg-item"><div class="si-label">Profession</div><div class="si-val">${seg.prof}</div></div>
    <div class="seg-item"><div class="si-label">Payment Mode</div><div class="si-val">${seg.payment}</div></div>
    <div class="seg-item"><div class="si-label">Loyalty Score</div><div class="si-val" style="color:var(--green)">${(seg.loyalty * 100).toFixed(0)}%</div></div>
    <div class="seg-item"><div class="si-label">Churn Risk</div><div class="si-val" style="color:${seg.churn === 'Low' ? 'var(--green)' : 'var(--amber)'}">${seg.churn}</div></div>
    <div class="seg-item"><div class="si-label">Test Drive Prob.</div><div class="si-val">${(seg.test_drive * 100).toFixed(0)}%</div></div>
    <div class="seg-item"><div class="si-label">First-Time Buyer</div><div class="si-val">${(seg.ftb * 100).toFixed(0)}%</div></div>
  </div>`;
  toast('Segment prediction complete', 'success');
};

// ── MODELS GRID ──────────────────────────────────────────
function renderModelsGrid() {
  const el = document.getElementById('modelsGridFull');
  if (el) el.innerHTML = buildModelCards(MODELS_DATA);
}

function renderFilters() {
  const el = document.getElementById('modelsGrid');
  if (el) el.innerHTML = buildModelCards(MODELS_DATA);
}

window.applyFilters = function () {
  const fuel = document.getElementById('filterFuel')?.value || '';
  const type = document.getElementById('filterType')?.value || '';
  const minP = parseFloat(document.getElementById('filterMinPrice')?.value) || 0;
  const maxP = parseFloat(document.getElementById('filterMaxPrice')?.value) || 1e9;
  const filtered = MODELS_DATA.filter(m =>
    (!fuel || m.fuel_type === fuel) &&
    (!type || m.car_type === type) &&
    m.price_usd >= minP && m.price_usd <= maxP
  );
  const el = document.getElementById('modelsGrid');
  if (el) el.innerHTML = buildModelCards(filtered);
};

function buildModelCards(models) {
  const fuelClass = { Electric: 'tag-ev', Hybrid: 'tag-hybrid', Petrol: 'tag-petrol', Diesel: 'tag-diesel' };
  return models.map(m => `
    <div class="model-card">
      <div class="model-img">
        ${m.car_img_url ? `<img src="${m.car_img_url}" alt="${m.car_model}" onerror="this.parentElement.innerHTML='<div class=\\'model-img-placeholder\\'>🚗</div>'"/>` : '<div class="model-img-placeholder">🚗</div>'}
      </div>
      <div class="model-name">${m.car_model}</div>
      <div class="model-type">${m.car_type}</div>
      <div class="model-tags">
        <span class="model-tag ${fuelClass[m.fuel_type] || 'tag-hybrid'}">${m.fuel_type}</span>
        <span class="model-tag tag-type">${m.car_type}</span>
      </div>
      <div class="model-price">$${m.price_usd.toLocaleString()}</div>
    </div>`).join('');
}

// ── THREATS ──────────────────────────────────────────────
function renderThreats() {
  const threats = [
    {
      sev: 'high', title: 'EV Competition Intensification', body: 'BYD and Tesla aggressively entering Tata\'s core markets. India, UK, Germany face EV price pressure 20–30% below comparable Tata models. Structural margin threat from 2026.',
      mitigation: 'Accelerate Curvv & Harrier EV launches. Joint battery manufacturing to cut per-unit cost 15–20%. Build on Nexon EV brand equity.'
    },
    {
      sev: 'high', title: 'FX & Currency Volatility', body: 'Operations span 6 currencies (GBP, INR, JPY, EUR, AUD, USD). 10% INR depreciation vs USD inflates import duty ~$253/unit. Post-Brexit GBP volatility impacts JLR-linked revenue.',
      mitigation: 'Expand natural hedging via local manufacturing. Forward contracts covering 60–70% FX exposure. Increase India-sourced components in global models.'
    },
    {
      sev: 'high', title: 'Profit Margin Compression', body: 'Margin declined from 18.3% (2018) to 17.4% (2024) — 90bps over 6 years. Cost ratio is the #1 model predictor (68.9% importance). Rising R&D and warranty costs add structural pressure.',
      mitigation: 'Target 5% cost ratio reduction via supply chain consolidation. Long-term raw material contracts. Improved QC to reduce warranty claims.'
    },
    {
      sev: 'medium', title: 'Regulatory & Emission Compliance', body: 'EU 2035 ICE ban and India CAFE Phase II tightening. Tata\'s 16% Diesel portfolio faces phase-out. Tax rates vary 0–35%+ creating uneven global cost structures.',
      mitigation: 'Accelerate diesel-to-EV transitions. Invest in hydrogen fuel cell R&D as hedge. Engage regulators for phased compliance timelines.'
    },
    {
      sev: 'medium', title: 'Supply Chain Disruption', body: 'Semiconductor shortages 2020–2022 caused delivery time spikes to 29+ days. Concentration in Asian semiconductor supply and limited lithium geographies creates production fragility.',
      mitigation: 'Dual-source critical components. 60-day strategic inventory buffers. Partner with Indian semiconductor fabs under PLI scheme.'
    },
    {
      sev: 'medium', title: 'Customer Loyalty Erosion', body: 'Only 25% of customers are loyalty program members. Feedback scores range 2.68–7.82 indicating inconsistent service quality. Large conquest-sale base may not be sticky.',
      mitigation: 'Strengthen loyalty rewards with service credits. CRM targeting for high-income returning customers. Standardise dealership service experience.'
    },
    {
      sev: 'medium', title: 'Geographic Revenue Concentration', body: 'Despite 7 markets, each accounts for only ~14% of sales. Tata lacks a dominant home-market advantage. Germany economic slowdown poses direct downside risk.',
      mitigation: 'India-first premium strategy. Southeast Asian expansion (Vietnam, Indonesia). Increase Australian fleet sales for diversification.'
    },
    {
      sev: 'low', title: 'Dealer Channel Disruption', body: 'Online and Dealership channels each at 25% of sales. Tesla D2C model shifting buyer expectations. Dealer commission ~9% avg may become uncompetitive.',
      mitigation: 'Pilot D2C model in metro markets. Performance-linked dealer commission renegotiation.'
    },
    {
      sev: 'low', title: 'Demographic Demand Shift', body: 'Under-30 buyers are the smallest segment (22.8%). As they mature into peak earning years, subscription-based mobility and ultra-compact EVs may challenge traditional unit-sale models.',
      mitigation: 'MaaS pilot programmes. Compact EV sub-$15K segment to capture Gen-Z loyalty early.'
    },
    {
      sev: 'low', title: 'Salesperson Churn Risk', body: '371+ unique salesperson IDs in dataset indicates significant frontline workforce dependency. Individual effectiveness variance creates key-person risk at dealership level.',
      mitigation: 'Standardise digital sales playbooks. AI-assisted tools to reduce individual dependency.'
    },
  ];

  const el = document.getElementById('threatsContainer');
  if (!el) return;
  el.innerHTML = ['high', 'medium', 'low'].map(sev => {
    const t = threats.filter(x => x.sev === sev);
    return `<h3 style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin:20px 0 10px">${sev.toUpperCase()} SEVERITY</h3>` +
      t.map(t => `<div class="threat-card ${t.sev}">
      <div class="threat-card-header">
        <span class="threat-badge ${t.sev}">${t.sev}</span>
        <span class="threat-title">${t.title}</span>
      </div>
      <div class="threat-body">${t.body}</div>
      <div class="threat-mitigation"><strong>Mitigation:</strong> ${t.mitigation}</div>
    </div>`).join('');
  }).join('');
}

// ── ANOMALIES ─────────────────────────────────────────────
function renderAnomalies() {
  const data = ANOMALY_DATA;
  makeChart('chartAnomalies', {
    type: 'bar',
    data: {
      labels: data.map(d => `${d.country} ${d.year}`),
      datasets: [
        { label: 'Actual ($B)', data: data.map(d => +(d.actual / 1e9).toFixed(2)), backgroundColor: BLUE + 'aa', borderRadius: 4 },
        { label: 'Predicted ($B)', data: data.map(d => +(d.predicted / 1e9).toFixed(2)), backgroundColor: AMBER + 'aa', borderRadius: 4, borderDash: [4, 2] },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 11 } }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => '$' + v + 'B' }, border: { color: GRID } }
      }
    }
  });

  const tableEl = document.getElementById('anomalyTable');
  if (tableEl) {
    tableEl.innerHTML = `<table class="data-table">
      <thead><tr><th>Year</th><th>Country</th><th>Actual</th><th>Predicted</th><th>Deviation</th><th>Direction</th></tr></thead>
      <tbody>${data.map(r => `<tr>
        <td>${r.year}</td><td>${r.country}</td>
        <td>$${(r.actual / 1e9).toFixed(2)}B</td>
        <td>$${(r.predicted / 1e9).toFixed(2)}B</td>
        <td><strong>${r.deviation.toFixed(1)}%</strong></td>
        <td><span class="pill ${r.direction === 'above' ? 'pill-up' : 'pill-down'}">${r.direction === 'above' ? '▲ Above' : '▼ Below'}</span></td>
      </tr>`).join('')}</tbody>
    </table>`;
  }
}

// ── MODEL PERFORMANCE ─────────────────────────────────────
function renderModelPerf() {
  const features = ['cost_ratio', 'rnd_ratio', 'units_sold', 'rev_per_unit', 'opex_ratio', 'mkt_per_unit', 'r_and_d_exp', 'mfg_cost', 'marketing'];
  const importance = [29.5, 22.9, 12.4, 11.9, 11.4, 8.8, 0.9, 0.9, 0.9];

  makeChart('chartFeatureImp', {
    type: 'bar',
    data: {
      labels: features, datasets: [{
        label: 'Importance %', data: importance,
        backgroundColor: importance.map((v, i) => COLORS[i % COLORS.length] + 'cc'), borderRadius: 6
      }]
    },
    options: {
      ...baseOpts(), indexAxis: 'y', plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, callback: v => v + '%' }, border: { color: GRID } },
        y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 11 } }, border: { color: GRID } }
      }
    }
  });

  makeChart('chartModelComp', {
    type: 'bar',
    data: {
      labels: ['R² Score', 'CV R²'],
      datasets: [
        { label: 'GBR (XGBoost)', data: [0.9953, 0.9939], backgroundColor: BLUE + 'cc', borderRadius: 6 },
        { label: 'Random Forest', data: [0.9897, 0.9871], backgroundColor: AMBER + 'cc', borderRadius: 6 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK }, border: { color: GRID } },
        y: { min: 0.98, max: 1.0, grid: { color: GRID }, ticks: { color: TICK, callback: v => v.toFixed(3) }, border: { color: GRID } }
      }
    }
  });
}

// ── METHODOLOGY ──────────────────────────────────────────
function renderMethodology() {
  const el = document.getElementById('methodologyContent');
  if (!el) return;
  const steps = [
    { title: 'Data Collection & Cleaning', body: 'Processed 250,000 sales records across 3 datasets: <code>tata_car_sales.csv</code>, <code>tata_car_finance.csv</code>, <code>tata_car_specs.csv</code>. Handled 62K+ missing values in promotion and previous car model fields. Normalised currencies across 6 exchange rates.' },
    { title: 'Exploratory Data Analysis (EDA)', body: 'Computed annual aggregates for revenue, profit, units and margin. Identified cost ratio as the dominant predictor through correlation analysis. Discovered 70% EV/Hybrid portfolio composition and perfectly balanced 25% channel distribution.' },
    { title: 'Feature Engineering', body: 'Created 7 derived features: <code>cost_ratio</code>, <code>rev_per_unit</code>, <code>rnd_ratio</code>, <code>opex_ratio</code>, <code>mkt_per_unit</code>, <code>warranty_ratio</code>, <code>capex_ratio</code>. Label-encoded country. Final feature set: 16 variables across revenue model, 19 for profit model.' },
    { title: 'Model Selection & Training', body: 'Compared Random Forest (R²=0.9897) vs Gradient Boosting Regressor (R²=0.9953). GBR selected as winner due to superior R², lower MAE ($5.36M vs $7.54M), lower MAPE (8.45% vs 11.19%), and more stable 5-fold CV (±0.0013 vs ±0.0017). Trained separate models for revenue, profit, and margin.' },
    { title: 'Forecasting Engine', body: 'Forecasts generated for 2025–2034 using trained GBR model with 3% annual volume growth and 2% price escalation assumptions per country. Confidence intervals computed as ±MAPE bands (~±8.5%). Revenue forecasts range from $279M (Germany) to $353M (USA) by 2034.' },
    { title: 'Threat Analysis & Anomaly Detection', body: 'Anomaly detection flags historical records with >15% deviation between actual and model-predicted revenue. 20 anomalies identified including 2017 Germany (+16.2%) and 2018 USA (+18.2%). Threat scoring based on model-derived feature importance and external market data.' },
    { title: 'Deployment Architecture', body: 'FastAPI backend deployed on Render with 15 REST endpoints. Frontend served via Vercel. Model loaded once at startup from <code>model_bundle.pkl</code>. CORS enabled for cross-origin calls. Health check endpoint monitors uptime and model status.' },
  ];

  el.innerHTML = steps.map((s, i) => `
    <div class="method-step" style="animation-delay:${i * 0.1}s">
      <div class="method-num">${i + 1}</div>
      <div class="method-body">
        <h4>${s.title}</h4>
        <p>${s.body}</p>
      </div>
    </div>`).join('');
}

// ── API STATUS ────────────────────────────────────────────
async function checkApiStatus() {
  const dot = document.querySelector('.status-dot');
  const text = document.getElementById('apiStatusText');
  if (!dot || !text) return;
  if (USE_MOCK) {
    dot.classList.add('online');
    text.textContent = 'Mock Mode';
    return;
  }
  try {
    const res = await fetch(API_BASE + '/health', { signal: AbortSignal.timeout(5000) });
    if (res.ok) { dot.classList.add('online'); text.textContent = 'API Live'; toast('Backend connected', 'success'); }
    else throw new Error();
  } catch { dot.classList.add('offline'); text.textContent = 'Offline (Mock)'; }
}

// ── SEARCH ────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('headerSearch');
  if (!input) return;
  const map = {
    'overview': 'overview', 'historical': 'historical', 'forecast': 'forecast',
    'prediction': 'forecast', 'world map': 'worldmap', 'map': 'worldmap',
    'what if': 'whatif', 'simulator': 'whatif', 'compare': 'compare',
    'elasticity': 'elasticity', 'price': 'elasticity', 'goal': 'goal',
    'segment': 'segment', 'customer': 'segment', 'models': 'models-grid',
    'cars': 'models-grid', 'filter': 'filters', 'threat': 'threats',
    'risk': 'threats', 'anomaly': 'anomalies', 'model performance': 'model-perf',
    'methodology': 'methodology',
  };
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const q = input.value.toLowerCase().trim();
    const match = Object.keys(map).find(k => q.includes(k));
    if (match) { showSection(map[match]); input.value = ''; toast(`Navigated to ${match}`, 'success'); }
    else toast('No matching section found', 'warning');
  });
}

// ── THEME TOGGLE ─────────────────────────────────────────
function initTheme() {
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('light');
  });
}

// ── SIDEBAR TOGGLE ────────────────────────────────────────
function initSidebar() {
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    const mw = document.getElementById('mainWrapper');
    sb.classList.toggle('collapsed');
    mw.classList.toggle('expanded');
  });
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => showSection(item.dataset.section));
  });
}

// ── EXPORT PDF ────────────────────────────────────────────
window.exportPDF = function () {
  toast('PDF export — use browser Print → Save as PDF', 'success');
  window.print();
};

// ── DATA INIT ─────────────────────────────────────────────
async function initData() {
  if (USE_MOCK) return;
  try {
    const [hist, fc, cntry, anom, mods, alerts] = await Promise.all([
      apiCall('/historical?view=global&years=10'),
      apiCall('/forecast-all?years=10'),
      apiCall('/historical?view=country&years=1'),
      apiCall('/anomalies'),
      apiCall('/models'),
      apiCall('/alerts')
    ]);
    if (hist && hist.data && hist.data.length) HIST_GLOBAL = hist.data;
    if (fc && fc.forecasts && Object.keys(fc.forecasts).length) FORECAST_DATA = fc.forecasts;
    if (cntry && cntry.data && cntry.data.length) HIST_COUNTRY = cntry.data;
    if (anom && anom.anomalies && anom.anomalies.length) ANOMALY_DATA = anom.anomalies;
    if (mods && mods.models && mods.models.length) MODELS_DATA = mods.models;
    if (alerts && alerts.alerts && alerts.alerts.length) {
      alerts.alerts.forEach((alert, i) => {
        setTimeout(() => toast((alert.type === 'danger' || alert.type === 'warning') ? '⚠ ' + alert.message : '✓ ' + alert.message, alert.type), 2000 + i * 2000);
      });
    }
  } catch(e) {
    console.error("Data load failed, using mock data.", e);
  }
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initSidebar();
  initSearch();
  initTheme();
  initWhatIf();
  checkApiStatus();
  
  await initData();
  
  showSection('overview');

  if (USE_MOCK) {
    // Alerts
    setTimeout(() => toast('⚠ Germany revenue forecast flagged — cost ratio trending up', 'warning'), 2000);
    setTimeout(() => toast('✓ India 2026 forecast: +3.8% YoY growth projected', 'success'), 4000);
  }
});
