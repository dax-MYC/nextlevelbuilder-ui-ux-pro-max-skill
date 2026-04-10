'use strict';

// ═══════════════════════════════════════════════════════════════════
//  ⚠️  CONFIGURATION — update this section with real data
// ═══════════════════════════════════════════════════════════════════

// All staff — anyone can submit KPIs across any area
// ⚠️  Add more names here as the team grows
const STAFF = [
  'Dax Chew',
  'Siao Chze',
  'Meggy',
  'Verlyn',
  'Pei Pei',
  'Aliff',
];

// KPIs organised by area (shown as grouped sections in the dropdown)
// Each KPI: { id, label, target, unit }
//   id     — unique key stored in submissions; don't change once in use
//   label  — display name shown to staff
//   target — weekly target number (shown as a hint chip beside the input)
//   unit   — label shown with the number in the log (e.g. 'hrs', '%')
// ⚠️  Replace placeholder entries with your actual KPIs and targets
const KPI_DATA = {
  oap: {
    label: 'Outsource Accounting & Payroll',
    short: 'OAP',
    kpis: [
      // --- ADD ACTUAL OAP KPIS HERE ---
      { id: 'oap_kpi_1', label: 'OAP KPI 1 — replace me', target: 50,  unit: 'clients'  },
      { id: 'oap_kpi_2', label: 'OAP KPI 2 — replace me', target: 100, unit: 'invoices' },
      { id: 'oap_kpi_3', label: 'OAP KPI 3 — replace me', target: 20,  unit: 'reports'  },
      { id: 'oap_kpi_4', label: 'OAP KPI 4 — replace me', target: 5,   unit: 'clients'  },
      { id: 'oap_kpi_5', label: 'OAP KPI 5 — replace me', target: 40,  unit: 'hrs'      },
    ],
  },
  ss: {
    label: 'Software Solutions',
    short: 'SS',
    kpis: [
      // --- ADD ACTUAL SS KPIS HERE ---
      { id: 'ss_kpi_1', label: 'SS KPI 1 — replace me', target: 25, unit: 'tickets'  },
      { id: 'ss_kpi_2', label: 'SS KPI 2 — replace me', target: 4,  unit: 'features' },
      { id: 'ss_kpi_3', label: 'SS KPI 3 — replace me', target: 10, unit: 'reviews'  },
      { id: 'ss_kpi_4', label: 'SS KPI 4 — replace me', target: 15, unit: 'bugs'     },
      { id: 'ss_kpi_5', label: 'SS KPI 5 — replace me', target: 40, unit: 'hrs'      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════
//  No changes needed below this line
// ═══════════════════════════════════════════════════════════════════

// ── Malaysia (UTC+8) date/week helpers ─────────────────────────────

function getMYDateStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' });
}

function getMYWeekMonday() {
  const myDate = new Date(getMYDateStr() + 'T00:00:00Z');
  const diffToMon = (myDate.getUTCDay() + 6) % 7;
  myDate.setUTCDate(myDate.getUTCDate() - diffToMon);
  return myDate;
}

function getWeekKey() {
  return getMYWeekMonday().toISOString().slice(0, 10);
}

function getWeekRange() {
  const mon = getMYWeekMonday();
  const fri = new Date(mon);
  fri.setUTCDate(mon.getUTCDate() + 4);
  const fmt = d => d.toLocaleDateString('en-MY', { timeZone: 'UTC', day: 'numeric', month: 'short' });
  return `Week of ${fmt(mon)} – ${fmt(fri)}`;
}

// ── KPI lookup (searches all areas) ───────────────────────────────

function lookupKpi(kpiId) {
  for (const [groupKey, group] of Object.entries(KPI_DATA)) {
    const kpi = group.kpis.find(k => k.id === kpiId);
    if (kpi) return { kpi, groupKey, short: group.short, groupLabel: group.label };
  }
  return null;
}

// ── Storage ────────────────────────────────────────────────────────

const STORAGE_KEY = 'myconsult_kpi_v3';
const SESSION_KEY = 'myconsult_session_v3';

function loadSubmissions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveSubmissions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
}

function setSession(data) { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); }
function clearSession()    { localStorage.removeItem(SESSION_KEY); }

// ── Utilities ──────────────────────────────────────────────────────

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatTimeMY(iso) {
  return new Date(iso).toLocaleTimeString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

// ── Toast ──────────────────────────────────────────────────────────

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

// ── Screen management ──────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// ── Screen 1: Staff selection ──────────────────────────────────────

function initSelectScreen() {
  document.getElementById('welcome-week').textContent = getWeekRange();

  const nameSelect  = document.getElementById('select-name');
  const continueBtn = document.getElementById('continue-btn');
  const errEl       = document.getElementById('select-error');

  // Populate name dropdown
  STAFF.forEach(name => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = name;
    nameSelect.appendChild(opt);
  });

  continueBtn.addEventListener('click', () => {
    const name = nameSelect.value;
    if (!name) {
      errEl.textContent = 'Please select your name.';
      errEl.classList.remove('hidden');
      nameSelect.classList.add('error');
      return;
    }
    errEl.classList.add('hidden');
    nameSelect.classList.remove('error');
    setSession({ name });
    enterFormScreen(name);
  });
}

function resetSelectScreen() {
  document.getElementById('select-name').value = '';
  document.getElementById('select-error').classList.add('hidden');
  document.getElementById('select-name').classList.remove('error');
}

// ── Screen 2: KPI form ─────────────────────────────────────────────

function enterFormScreen(name) {
  // ── Header user pill ──────────────────────────────────────────
  const pill     = document.getElementById('user-pill');
  const avatarEl = document.getElementById('user-pill-avatar');

  avatarEl.textContent = initials(name);
  avatarEl.style.background = 'linear-gradient(135deg, #82b9d5 0%, #13598c 100%)';
  document.getElementById('user-pill-name').textContent = name;
  pill.classList.remove('hidden');

  document.getElementById('change-user-btn').onclick = () => {
    clearSession();
    pill.classList.add('hidden');
    resetSelectScreen();
    showScreen('screen-select');
  };

  // ── Week label ────────────────────────────────────────────────
  document.getElementById('week-label').textContent = getWeekRange();

  // ── KPI dropdown — all areas as optgroups ─────────────────────
  const kpiSelect = document.getElementById('kpi-name');
  kpiSelect.innerHTML = '<option value="" disabled selected>Select a KPI</option>';

  for (const [, group] of Object.entries(KPI_DATA)) {
    const optgrp = document.createElement('optgroup');
    optgrp.label = group.label;
    group.kpis.forEach(kpi => {
      const opt = document.createElement('option');
      opt.value = kpi.id;
      opt.textContent = kpi.label;
      optgrp.appendChild(opt);
    });
    kpiSelect.appendChild(optgrp);
  }

  // ── KPI change → update target chip ──────────────────────────
  const targetChip  = document.getElementById('target-chip');
  const actualInput = document.getElementById('kpi-actual');

  kpiSelect.addEventListener('change', () => {
    const result = lookupKpi(kpiSelect.value);
    const kpi    = result?.kpi;

    if (kpi?.target != null) {
      targetChip.textContent = `Target: ${kpi.target}${kpi.unit ? ' ' + kpi.unit : ''}`;
      targetChip.classList.remove('hidden');
    } else {
      targetChip.classList.add('hidden');
    }
    actualInput.value       = '';
    actualInput.placeholder = kpi?.unit ? `Enter ${kpi.unit}` : 'Enter value';
    actualInput.classList.remove('error');
    document.getElementById('form-error').classList.add('hidden');
  });

  // ── Form submit ───────────────────────────────────────────────
  document.getElementById('kpi-form').onsubmit = e => handleSubmit(e, name);

  // ── Clear button ──────────────────────────────────────────────
  document.getElementById('clear-btn').onclick = () => {
    if (confirm('Clear all submissions for this week?')) {
      saveSubmissions(loadSubmissions().filter(s => s.weekKey !== getWeekKey()));
      renderLog();
    }
  };

  renderLog();
  showScreen('screen-form');
}

// ── Form submission ────────────────────────────────────────────────

function handleSubmit(e, name) {
  e.preventDefault();

  const kpiSelect   = document.getElementById('kpi-name');
  const actualInput = document.getElementById('kpi-actual');
  const notesInput  = document.getElementById('kpi-notes');
  const errEl       = document.getElementById('form-error');

  kpiSelect.classList.remove('error');
  actualInput.classList.remove('error');
  errEl.classList.add('hidden');

  const kpiId  = kpiSelect.value;
  const actual = actualInput.value.trim();

  if (!kpiId) {
    kpiSelect.classList.add('error');
    errEl.textContent = 'Please select a KPI.';
    errEl.classList.remove('hidden');
    return;
  }
  if (actual === '' || isNaN(Number(actual))) {
    actualInput.classList.add('error');
    errEl.textContent = 'Please enter a valid actual value.';
    errEl.classList.remove('hidden');
    actualInput.focus();
    return;
  }

  const result   = lookupKpi(kpiId);
  const kpi      = result?.kpi;
  const kpiGroup = result?.groupKey ?? '';

  const submissions = loadSubmissions();
  submissions.push({
    id:       crypto.randomUUID(),
    weekKey:  getWeekKey(),
    ts:       new Date().toISOString(),
    name,
    kpiGroup,
    kpi:      kpiId,
    actual:   Number(actual),
    target:   kpi?.target ?? null,
    unit:     kpi?.unit   ?? '',
    notes:    notesInput.value.trim(),
  });
  saveSubmissions(submissions);

  // Reset (keep KPI for quick back-to-back entry)
  actualInput.value = '';
  notesInput.value  = '';
  kpiSelect.value   = '';
  targetChip_reset();

  showToast(`Submitted — ${kpi ? kpi.label : kpiId}`);
  renderLog();
}

function targetChip_reset() {
  const chip = document.getElementById('target-chip');
  chip.textContent = '';
  chip.classList.add('hidden');
  document.getElementById('kpi-actual').placeholder = 'Enter value';
}

// ── Log rendering ──────────────────────────────────────────────────

function renderLog() {
  const list    = document.getElementById('log-list');
  const weekKey = getWeekKey();
  const entries = loadSubmissions().filter(s => s.weekKey === weekKey);

  if (entries.length === 0) {
    list.innerHTML = '<p class="empty-state">No submissions yet this week.</p>';
    return;
  }

  const sorted = [...entries].sort((a, b) => new Date(b.ts) - new Date(a.ts));

  list.innerHTML = sorted.map(s => {
    const result   = lookupKpi(s.kpi);
    const kpiLabel = result?.kpi?.label ?? s.kpi;
    const areaTag  = result?.short ?? (KPI_DATA[s.kpiGroup]?.short ?? '');
    const unitStr  = s.unit ? ` ${s.unit}` : '';

    const hasTarget  = s.target != null;
    const badgeClass = hasTarget
      ? (Number(s.actual) >= Number(s.target) ? 'on-target' : 'off-target')
      : '';
    const badgeText  = hasTarget
      ? `${s.actual} / ${s.target}${unitStr}`
      : `${s.actual}${unitStr}`;

    return `
      <div class="log-item">
        <div class="log-avatar">
          ${esc(initials(s.name))}
        </div>
        <div class="log-body">
          <div class="log-name">
            ${esc(s.name)}
            ${areaTag ? `<span class="log-dept-tag">${esc(areaTag)}</span>` : ''}
          </div>
          <div class="log-kpi">${esc(kpiLabel)}</div>
          ${s.notes ? `<div class="log-notes">${esc(s.notes)}</div>` : ''}
        </div>
        <div class="log-right">
          <span class="log-badge ${badgeClass}">${esc(badgeText)}</span>
          <span class="log-time">${formatTimeMY(s.ts)}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ── Init ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  initSelectScreen();

  const session = getSession();
  if (session?.name) {
    enterFormScreen(session.name);
  } else {
    showScreen('screen-select');
  }
});
