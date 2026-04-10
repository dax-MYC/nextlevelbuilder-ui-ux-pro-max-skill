'use strict';

// ═══════════════════════════════════════════════════════════════════
//  ⚠️  CONFIGURATION — update this section with real data
// ═══════════════════════════════════════════════════════════════════

const DEPT_LABELS = {
  oap: 'Outsource Accounting & Payroll',
  ss:  'Software Solutions',
};

// Staff names per department
// ⚠️  Replace placeholder names with your actual staff list
const STAFF = {
  oap: [
    // --- ADD ACTUAL OAP STAFF NAMES HERE ---
    'OAP Staff 1',
    'OAP Staff 2',
    'OAP Staff 3',
    'OAP Staff 4',
    'OAP Staff 5',
  ],
  ss: [
    // --- ADD ACTUAL SS STAFF NAMES HERE ---
    'SS Staff 1',
    'SS Staff 2',
    'SS Staff 3',
    'SS Staff 4',
  ],
};

// KPIs per department
// Each entry: { id, label, target, unit }
//   id     — unique key (used in storage, must not change once in use)
//   label  — display name shown to staff
//   target — weekly target number (shown as a hint next to the input)
//   unit   — shown alongside the number in the log (e.g. 'hrs', 'clients', '%')
// ⚠️  Replace with your actual KPI names and weekly targets
const KPI_DATA = {
  oap: [
    // --- ADD ACTUAL OAP KPIS HERE ---
    { id: 'oap_kpi_1', label: 'OAP KPI 1 — replace me',  target: 50,  unit: 'clients'  },
    { id: 'oap_kpi_2', label: 'OAP KPI 2 — replace me',  target: 100, unit: 'invoices' },
    { id: 'oap_kpi_3', label: 'OAP KPI 3 — replace me',  target: 20,  unit: 'reports'  },
    { id: 'oap_kpi_4', label: 'OAP KPI 4 — replace me',  target: 5,   unit: 'clients'  },
    { id: 'oap_kpi_5', label: 'OAP KPI 5 — replace me',  target: 40,  unit: 'hrs'      },
  ],
  ss: [
    // --- ADD ACTUAL SS KPIS HERE ---
    { id: 'ss_kpi_1',  label: 'SS KPI 1 — replace me',   target: 25,  unit: 'tickets'  },
    { id: 'ss_kpi_2',  label: 'SS KPI 2 — replace me',   target: 4,   unit: 'features' },
    { id: 'ss_kpi_3',  label: 'SS KPI 3 — replace me',   target: 10,  unit: 'reviews'  },
    { id: 'ss_kpi_4',  label: 'SS KPI 4 — replace me',   target: 15,  unit: 'bugs'     },
    { id: 'ss_kpi_5',  label: 'SS KPI 5 — replace me',   target: 40,  unit: 'hrs'      },
  ],
};

// ═══════════════════════════════════════════════════════════════════
//  No changes needed below this line
// ═══════════════════════════════════════════════════════════════════

// ── Malaysia (UTC+8) date/week helpers ─────────────────────────────

function getMYDateStr() {
  // Returns "YYYY-MM-DD" in Malaysia local time regardless of browser timezone
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' });
}

function getMYWeekMonday() {
  // Returns a Date at UTC midnight representing Monday of the current MY week
  const myStr  = getMYDateStr();                     // e.g. "2025-04-07"
  const myDate = new Date(myStr + 'T00:00:00Z');     // parsed as UTC midnight
  const dayUTC = myDate.getUTCDay();                 // 0 = Sunday
  const diffToMon = (dayUTC + 6) % 7;               // days since last Monday
  myDate.setUTCDate(myDate.getUTCDate() - diffToMon);
  return myDate;
}

function getWeekKey() {
  return getMYWeekMonday().toISOString().slice(0, 10); // "2025-04-07"
}

function getWeekRange() {
  const mon = getMYWeekMonday();
  const fri = new Date(mon);
  fri.setUTCDate(mon.getUTCDate() + 4);
  // Format in MY timezone — since both dates sit at UTC midnight we pass
  // timeZone:'UTC' so the printed date matches the stored MY date exactly
  const fmt = d => d.toLocaleDateString('en-MY', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
  });
  return `Week of ${fmt(mon)} – ${fmt(fri)}`;
}

// ── Storage ────────────────────────────────────────────────────────

const STORAGE_KEY = 'myconsult_kpi_v2';
const SESSION_KEY = 'myconsult_session_v2';

function loadSubmissions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveSubmissions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
}

function setSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ── Utilities ──────────────────────────────────────────────────────

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTimeMY(iso) {
  return new Date(iso).toLocaleTimeString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function lookupKpi(dept, kpiId) {
  return (KPI_DATA[dept] || []).find(k => k.id === kpiId) || null;
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

let pendingDept = null;

function initSelectScreen() {
  document.getElementById('welcome-week').textContent = getWeekRange();

  const deptBtns   = document.querySelectorAll('.dept-btn');
  const nameField  = document.getElementById('name-field');
  const nameSelect = document.getElementById('select-name');
  const continueBtn = document.getElementById('continue-btn');
  const errEl      = document.getElementById('select-error');

  deptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deptBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pendingDept = btn.dataset.dept;
      errEl.classList.add('hidden');

      // Populate name dropdown for selected department
      nameSelect.innerHTML = '<option value="" disabled selected>Select your name</option>';
      (STAFF[pendingDept] || []).forEach(name => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = name;
        nameSelect.appendChild(opt);
      });

      nameField.classList.remove('hidden');
      continueBtn.classList.remove('hidden');
    });
  });

  continueBtn.addEventListener('click', () => {
    const name = nameSelect.value;

    if (!pendingDept) {
      errEl.textContent = 'Please select your department.';
      errEl.classList.remove('hidden');
      return;
    }
    if (!name) {
      errEl.textContent = 'Please select your name.';
      errEl.classList.remove('hidden');
      nameSelect.classList.add('error');
      return;
    }

    errEl.classList.add('hidden');
    nameSelect.classList.remove('error');

    setSession({ dept: pendingDept, name });
    enterFormScreen(pendingDept, name);
  });
}

function resetSelectScreen() {
  pendingDept = null;
  document.querySelectorAll('.dept-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('name-field').classList.add('hidden');
  document.getElementById('continue-btn').classList.add('hidden');
  document.getElementById('select-name').value = '';
  document.getElementById('select-error').classList.add('hidden');
}

// ── Screen 2: KPI form ─────────────────────────────────────────────

function enterFormScreen(dept, name) {
  // ── Header user pill ──────────────────────────────────────────
  const pill = document.getElementById('user-pill');
  const avatarEl = document.getElementById('user-pill-avatar');

  avatarEl.textContent = initials(name);
  avatarEl.style.background = dept === 'oap'
    ? 'linear-gradient(135deg, #82b9d5 0%, #13598c 100%)'
    : 'linear-gradient(135deg, #e86f82 0%, #13598c 100%)';

  document.getElementById('user-pill-name').textContent = name;
  document.getElementById('user-pill-dept').textContent =
    dept === 'oap' ? 'OAP' : 'Software Solutions';

  pill.classList.remove('hidden');

  document.getElementById('change-user-btn').onclick = () => {
    clearSession();
    pill.classList.add('hidden');
    resetSelectScreen();
    showScreen('screen-select');
  };

  // ── Week label ────────────────────────────────────────────────
  document.getElementById('week-label').textContent = getWeekRange();

  // ── KPI dropdown ──────────────────────────────────────────────
  const kpiSelect = document.getElementById('kpi-name');
  kpiSelect.innerHTML = '<option value="" disabled selected>Select a KPI</option>';

  (KPI_DATA[dept] || []).forEach(kpi => {
    const opt = document.createElement('option');
    opt.value = kpi.id;
    opt.textContent = kpi.label;
    kpiSelect.appendChild(opt);
  });

  // ── KPI change → update target chip ──────────────────────────
  const targetChip = document.getElementById('target-chip');
  const actualInput = document.getElementById('kpi-actual');

  kpiSelect.addEventListener('change', () => {
    const kpi = lookupKpi(dept, kpiSelect.value);
    if (kpi && kpi.target != null) {
      targetChip.textContent = `Target: ${kpi.target}${kpi.unit ? ' ' + kpi.unit : ''}`;
      targetChip.classList.remove('hidden');
    } else {
      targetChip.classList.add('hidden');
    }
    actualInput.placeholder = kpi?.unit ? `Enter ${kpi.unit}` : 'Enter value';
    actualInput.value = '';
    actualInput.classList.remove('error');
    document.getElementById('form-error').classList.add('hidden');
  });

  // ── Form submit ───────────────────────────────────────────────
  document.getElementById('kpi-form').onsubmit = e => handleSubmit(e, dept, name);

  // ── Clear button ──────────────────────────────────────────────
  document.getElementById('clear-btn').onclick = () => {
    if (confirm('Clear all submissions for this week?')) {
      const kept = loadSubmissions().filter(s => s.weekKey !== getWeekKey());
      saveSubmissions(kept);
      renderLog();
    }
  };

  renderLog();
  showScreen('screen-form');
}

// ── Form submission ────────────────────────────────────────────────

function handleSubmit(e, dept, name) {
  e.preventDefault();

  const kpiSelect  = document.getElementById('kpi-name');
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

  const kpi = lookupKpi(dept, kpiId);

  const submissions = loadSubmissions();
  submissions.push({
    id:      crypto.randomUUID(),
    weekKey: getWeekKey(),
    ts:      new Date().toISOString(),
    dept,
    name,
    kpi:     kpiId,
    actual:  Number(actual),
    target:  kpi?.target ?? null,
    unit:    kpi?.unit   ?? '',
  });
  saveSubmissions(submissions);

  // Reset form fields (keep KPI selected for quick multi-entry)
  actualInput.value = '';
  notesInput.value  = '';
  document.getElementById('target-chip').classList.add('hidden');
  kpiSelect.value = '';
  actualInput.placeholder = 'Enter value';

  showToast(`Submitted — ${kpi ? kpi.label : kpiId}`);
  renderLog();
}

// ── Log rendering ──────────────────────────────────────────────────

function renderLog() {
  const list = document.getElementById('log-list');
  const weekKey = getWeekKey();
  const entries = loadSubmissions().filter(s => s.weekKey === weekKey);

  if (entries.length === 0) {
    list.innerHTML = '<p class="empty-state">No submissions yet this week.</p>';
    return;
  }

  // Newest first
  const sorted = [...entries].sort((a, b) => new Date(b.ts) - new Date(a.ts));

  list.innerHTML = sorted.map(s => {
    const kpi = lookupKpi(s.dept, s.kpi);
    const kpiLabel = kpi ? kpi.label : s.kpi;
    const unitStr  = s.unit ? ` ${s.unit}` : '';
    const deptTag  = s.dept === 'oap' ? 'OAP' : 'SS';

    const hasTarget = s.target != null;
    const badgeClass = hasTarget
      ? (Number(s.actual) >= Number(s.target) ? 'on-target' : 'off-target')
      : '';
    const badgeText = hasTarget
      ? `${s.actual} / ${s.target}${unitStr}`
      : `${s.actual}${unitStr}`;

    const avatarGradient = s.dept === 'oap'
      ? 'linear-gradient(135deg,#82b9d5,#13598c)'
      : 'linear-gradient(135deg,#e86f82,#13598c)';

    return `
      <div class="log-item">
        <div class="log-avatar" style="background:${avatarGradient}">
          ${esc(initials(s.name))}
        </div>
        <div class="log-body">
          <div class="log-name">
            ${esc(s.name)}
            <span class="log-dept-tag">${esc(deptTag)}</span>
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

  // Resume session if one exists
  const session = getSession();
  if (session?.dept && session?.name) {
    // Restore dept-btn active state for visual consistency if user goes back
    const deptBtn = document.querySelector(`.dept-btn[data-dept="${session.dept}"]`);
    if (deptBtn) deptBtn.classList.add('active');
    enterFormScreen(session.dept, session.name);
  } else {
    showScreen('screen-select');
  }
});
