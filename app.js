'use strict';

// ── KPI label map ──────────────────────────────────────────────
const KPI_LABELS = {
  billable_hours:     'Billable Hours',
  revenue_collected:  'Revenue Collected ($)',
  proposals_sent:     'Proposals Sent',
  new_clients:        'New Clients Acquired',
  client_satisfaction:'Client Satisfaction (1–10)',
  client_meetings:    'Client Meetings Held',
  projects_completed: 'Projects Completed',
  on_time_delivery:   'On-Time Delivery (%)',
  tasks_closed:       'Tasks Closed',
  training_hours:     'Training Hours',
  team_nps:           'Team NPS',
};

// ── Storage helpers ────────────────────────────────────────────
const STORAGE_KEY = 'myconsult_kpi_submissions';

function loadSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSubmissions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Week helpers ───────────────────────────────────────────────
function getWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 Sun
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7));
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  const fmt = d => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  return `Week of ${fmt(mon)} – ${fmt(fri)}`;
}

function getWeekKey() {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7));
  return mon.toISOString().slice(0, 10);
}

// ── Initials from name ─────────────────────────────────────────
function initials(name) {
  return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

// ── Format timestamp ───────────────────────────────────────────
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ── Render log ─────────────────────────────────────────────────
function renderLog() {
  const list = document.getElementById('log-list');
  const submissions = loadSubmissions().filter(s => s.weekKey === getWeekKey());

  if (submissions.length === 0) {
    list.innerHTML = '<p class="empty-state">No submissions yet.</p>';
    return;
  }

  // Newest first
  const sorted = [...submissions].sort((a, b) => new Date(b.ts) - new Date(a.ts));

  list.innerHTML = sorted.map(s => {
    const hasTarget = s.target !== '' && s.target !== null && s.target !== undefined;
    let badgeClass = '';
    if (hasTarget) {
      badgeClass = Number(s.actual) >= Number(s.target) ? 'over-target' : 'under-target';
    }
    const targetText = hasTarget ? ` / ${s.target}` : '';

    return `
      <div class="log-item">
        <div class="log-avatar">${initials(s.name)}</div>
        <div class="log-body">
          <div class="log-name">${esc(s.name)}</div>
          <div class="log-kpi">${esc(KPI_LABELS[s.kpi] || s.kpi)}</div>
          ${s.notes ? `<div class="log-notes">${esc(s.notes)}</div>` : ''}
        </div>
        <div class="log-right">
          <span class="log-badge ${badgeClass}">${esc(String(s.actual))}${esc(targetText)}</span>
          <span class="log-time">${formatTime(s.ts)}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ── Escape HTML ────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

// ── Form submission ────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();

  const nameEl   = document.getElementById('staff-name');
  const kpiEl    = document.getElementById('kpi-name');
  const actualEl = document.getElementById('kpi-actual');
  const targetEl = document.getElementById('kpi-target');
  const notesEl  = document.getElementById('kpi-notes');
  const errEl    = document.getElementById('form-error');

  // Clear previous errors
  [nameEl, kpiEl, actualEl].forEach(el => el.classList.remove('error'));
  errEl.classList.add('hidden');

  const name   = nameEl.value.trim();
  const kpi    = kpiEl.value.trim();
  const actual = actualEl.value.trim();
  const target = targetEl.value.trim();
  const notes  = notesEl.value.trim();

  const errors = [];
  if (!name)   { nameEl.classList.add('error');   errors.push('Please select your name.'); }
  if (!kpi)    { kpiEl.classList.add('error');    errors.push('Please select a KPI.'); }
  if (!actual) { actualEl.classList.add('error'); errors.push('Please enter your actual value.'); }

  if (errors.length) {
    errEl.textContent = errors[0];
    errEl.classList.remove('hidden');
    errEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  const submissions = loadSubmissions();
  submissions.push({
    id:      crypto.randomUUID(),
    weekKey: getWeekKey(),
    ts:      new Date().toISOString(),
    name,
    kpi,
    actual:  Number(actual),
    target:  target !== '' ? Number(target) : null,
    notes,
  });
  saveSubmissions(submissions);

  // Reset form (keep name selected for convenience)
  kpiEl.value    = '';
  actualEl.value = '';
  targetEl.value = '';
  notesEl.value  = '';

  showToast('KPI submitted successfully!');
  renderLog();
}

// ── Clear all ──────────────────────────────────────────────────
function handleClear() {
  const submissions = loadSubmissions().filter(s => s.weekKey !== getWeekKey());
  saveSubmissions(submissions);
  renderLog();
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('week-label').textContent = getWeekRange();
  document.getElementById('year').textContent = new Date().getFullYear();

  document.getElementById('kpi-form').addEventListener('submit', handleSubmit);
  document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('Clear all submissions for this week?')) handleClear();
  });

  renderLog();
});
