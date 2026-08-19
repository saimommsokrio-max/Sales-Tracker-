/* =====================================================
   Sokrio Sales Tracker — app.js (Dynamic Monthly)
   Each month has its own independent work plan.
   ===================================================== */

// ── Month names ──────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

// ── Global Company List (13 companies, fixed) ────────
const GLOBAL_COMPANIES = [
  { id: 1,  name: 'RB Agro' },
  { id: 2,  name: 'Kitty Industries Ltd' },
  { id: 3,  name: 'Fair Food & Lifestyle Supreme' },
  { id: 4,  name: 'Ifad Consumers Bangladesh Ltd' },
  { id: 5,  name: 'TIFBD' },
  { id: 6,  name: 'Olympic Milk Products Ltd' },
  { id: 7,  name: 'Smile Food Products' },
  { id: 8,  name: 'Mariners Group' },
  { id: 9,  name: 'Romaina' },
  { id: 10, name: 'Tradesworth Household Ltd.' },
  { id: 11, name: 'Royal Weaving' },
  { id: 12, name: 'Heidelberg Cement Bangladesh Ltd.' },
  { id: 13, name: 'Rahul Group' },
];

// ── Pipeline Stage Config ────────────────────────────
const STAGES = [
  { key: 'Initial Call',    color: 'var(--stage-initial-call)', icon: '📞', short: 'Call'     },
  { key: 'Sales Pitch',     color: 'var(--stage-sales-pitch)',  icon: '🎯', short: 'Pitch'    },
  { key: 'Demo Video Send', color: 'var(--stage-demo-video)',   icon: '🎬', short: 'Demo'     },
  { key: 'Proposal Sent',   color: 'var(--stage-proposal)',     icon: '📄', short: 'Proposal' },
  { key: 'Deal Won',        color: 'var(--stage-won)',          icon: '🏆', short: 'Won'      },
  { key: 'Deal Lost',       color: 'var(--stage-lost)',         icon: '❌', short: 'Lost'     },
];

// ── Status config ────────────────────────────────────
const STATUS_OPTIONS = ['Pending', 'Done', 'Skipped'];
const STATUS_COLORS  = { 'Pending': 'var(--accent-amber)', 'Done': 'var(--accent-emerald)', 'Skipped': 'var(--text-muted)' };
const STATUS_ICONS   = { 'Pending': '⏳', 'Done': '✅', 'Skipped': '⏭️' };

// ── July 2026 pre-loaded plan (from Excel) ───────────
// Dates converted from Excel serials to YYYY-MM-DD
const JULY_2026_DEFAULT = {
  1:  [['2026-07-02','Wednesday'],['2026-07-07','Monday'],   ['2026-07-09','Wednesday'],['2026-07-14','Monday'],   [null,'-'],[null,'-']],
  2:  [['2026-07-02','Wednesday'],['2026-07-07','Monday'],   ['2026-07-09','Wednesday'],['2026-07-14','Monday'],   [null,'-'],[null,'-']],
  3:  [['2026-07-03','Thursday'], ['2026-07-08','Tuesday'],  ['2026-07-10','Thursday'], ['2026-07-15','Tuesday'],  [null,'-'],[null,'-']],
  4:  [['2026-07-03','Thursday'], ['2026-07-08','Tuesday'],  ['2026-07-10','Thursday'], ['2026-07-15','Tuesday'],  [null,'-'],[null,'-']],
  5:  [['2026-07-06','Sunday'],   ['2026-07-09','Wednesday'],['2026-07-13','Sunday'],   ['2026-07-16','Wednesday'],[null,'-'],[null,'-']],
  6:  [['2026-07-06','Sunday'],   ['2026-07-09','Wednesday'],['2026-07-13','Sunday'],   ['2026-07-16','Wednesday'],[null,'-'],[null,'-']],
  7:  [['2026-07-07','Monday'],   ['2026-07-10','Thursday'], ['2026-07-14','Monday'],   ['2026-07-17','Thursday'], [null,'-'],[null,'-']],
  8:  [['2026-07-07','Monday'],   ['2026-07-10','Thursday'], ['2026-07-14','Monday'],   ['2026-07-17','Thursday'], [null,'-'],[null,'-']],
  9:  [['2026-07-08','Tuesday'],  ['2026-07-13','Sunday'],   ['2026-07-15','Tuesday'],  ['2026-07-20','Sunday'],   [null,'-'],[null,'-']],
  10: [['2026-07-08','Tuesday'],  ['2026-07-13','Sunday'],   ['2026-07-15','Tuesday'],  ['2026-07-20','Sunday'],   [null,'-'],[null,'-']],
  11: [['2026-07-09','Wednesday'],['2026-07-14','Monday'],   ['2026-07-16','Wednesday'],['2026-07-21','Monday'],   [null,'-'],[null,'-']],
  12: [['2026-07-09','Wednesday'],['2026-07-14','Monday'],   ['2026-07-16','Wednesday'],['2026-07-21','Monday'],   [null,'-'],[null,'-']],
  13: [['2026-07-10','Thursday'], ['2026-07-15','Tuesday'],  ['2026-07-17','Thursday'], ['2026-07-22','Tuesday'],  [null,'-'],[null,'-']],
};

function buildDefaultPlan(year, month) {
  const plan = {};
  GLOBAL_COMPANIES.forEach(c => {
    plan[c.id] = STAGES.map((s, idx) => ({
      stage: s.key,
      date: null,
      day: '',
      status: 'Pending',
      note: ''
    }));
  });
  return plan;
}

function buildJulyPlan() {
  const plan = {};
  GLOBAL_COMPANIES.forEach(c => {
    plan[c.id] = STAGES.map((s, idx) => {
      const [date, day] = JULY_2026_DEFAULT[c.id][idx] || [null, ''];
      return { stage: s.key, date: date, day: day || '', status: 'Pending', note: '' };
    });
  });
  return plan;
}

// ── Date helpers ─────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}
function getDayName(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long' });
}

// ── Default Call Logs ─────────────────────────────────
const DEFAULT_CALL_LOGS = [
  {
    id: 101,
    startDate: '2026-08-17',
    startTime: '05:55 PM',
    duration: 60,
    durationUnit: 'hours',
    endDate: '2026-08-20',
    endTime: '05:55 PM',
    subject: 'Follow-up regarding July Workplan & Custom Report',
    companyId: 1,
    companyName: 'RB Agro',
    remarks: 'Scheduled follow-up call to review custom report feedback, confirm initial order quantity, and align on next steps.',
    status: 'Follow-up Pending',
    createdAt: '2026-08-17 10:30',
    completedAt: null,
    completionRemarks: ''
  },
  {
    id: 102,
    startDate: '2026-08-15',
    startTime: '02:30 PM',
    duration: 45,
    durationUnit: 'minutes',
    endDate: '2026-08-15',
    endTime: '03:15 PM',
    subject: 'Proposal Review & Commercial Terms',
    companyId: 4,
    companyName: 'Ifad Consumers Bangladesh Ltd',
    remarks: 'Sent updated proposal v2. Client confirmed agreement on key SLA points. Final sign-off expected next week.',
    status: 'Completed',
    createdAt: '2026-08-15 14:00',
    completedAt: '2026-08-15 15:30',
    completionRemarks: 'Deal agreed in principle. Forwarded to legal team.'
  }
];

// ── Storage & Live URL State Sync ──────────────────────
const STORAGE_KEY = 'sokrio_tracker_v2';

function encodeStateToHash(st) {
  try {
    const payload = {
      y: st.activeYear,
      m: st.activeMonth,
      p: st.plans,
      c: st.callLogs,
      a: st.activities
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  } catch(e) {
    return '';
  }
}

function decodeStateFromHash(hashStr) {
  try {
    const cleanHash = hashStr.replace(/^#data=/, '').replace(/^#/, '');
    if (!cleanHash) return null;
    const jsonStr = decodeURIComponent(escape(atob(cleanHash)));
    const payload = JSON.parse(jsonStr);
    return {
      activeYear: payload.y || 2026,
      activeMonth: payload.m || 7,
      plans: payload.p || { '2026-7': buildJulyPlan() },
      callLogs: payload.c || DEFAULT_CALL_LOGS,
      activities: payload.a || [],
      currentView: 'dashboard'
    };
  } catch(e) {
    return null;
  }
}

function loadState() {
  let loadedState;
  // 1. Try localStorage first (local cache)
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) loadedState = JSON.parse(saved);
  } catch(e) {}

  // 2. Try URL hash only if localStorage is empty
  if (!loadedState && window.location.hash && window.location.hash.includes('data=')) {
    loadedState = decodeStateFromHash(window.location.hash);
  }

  // 3. Fallback to default
  if (!loadedState) {
    loadedState = {
      activeYear: 2026,
      activeMonth: 7,
      plans: { '2026-7': buildJulyPlan() },
      activities: [],
      currentView: 'dashboard'
    };
  }
  if (!loadedState.plans || !loadedState.plans['2026-7']) {
    if (!loadedState.plans) loadedState.plans = {};
    loadedState.plans['2026-7'] = buildJulyPlan();
  }
  if (!loadedState.callLogs || loadedState.callLogs.length === 0) {
    loadedState.callLogs = DEFAULT_CALL_LOGS;
  }
  return loadedState;
}

let isPushingCloud = false;

function pushStateToCloud() {
  if (isPushingCloud) return;
  isPushingCloud = true;
  fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  }).then(res => res.json()).then(() => {
    isPushingCloud = false;
  }).catch(() => {
    isPushingCloud = false;
  });
}

function fetchCloudState() {
  fetch('/api/state')
    .then(res => res.json())
    .then(cloudData => {
      if (cloudData && !cloudData.empty && cloudData.plans) {
        const cloudStr = JSON.stringify(cloudData);
        const localStr = JSON.stringify(state);
        if (cloudStr !== localStr) {
          state = cloudData;
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
          refreshAll();
        }
      }
    })
    .catch(() => {});
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch(e) {}
  pushStateToCloud();
}

function copyShareableUrl() {
  saveState();
  const encoded = encodeStateToHash(state);
  const url = window.location.origin + window.location.pathname + (encoded ? '#data=' + encoded : '');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('🔗 Live Shareable URL copied to clipboard!');
    }).catch(() => {
      prompt('Copy this Live Share URL to open on any browser:', url);
    });
  } else {
    prompt('Copy this Live Share URL to open on any browser:', url);
  }
}

function exportStateJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `sokrio_sales_tracker_backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('📥 Backup JSON exported successfully!');
}

function triggerImportJson() {
  const input = document.getElementById('import-json-input');
  if (input) input.click();
}

function handleImportJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported && imported.plans) {
        state = imported;
        saveState();
        refreshAll();
        showToast('📤 State imported & loaded successfully!');
      } else {
        showToast('Invalid JSON backup file!', 'danger');
      }
    } catch(err) {
      showToast('Error parsing JSON file!', 'danger');
    }
  };
  reader.readAsText(file);
}

function resetToDefaultData() {
  if (confirm('Are you sure you want to reset all data back to the default July 2026 Excel workplan?')) {
    localStorage.removeItem(STORAGE_KEY);
    history.replaceState(null, '', window.location.pathname);
    state = {
      activeYear: 2026,
      activeMonth: 7,
      plans: { '2026-7': buildJulyPlan() },
      activities: [],
      callLogs: DEFAULT_CALL_LOGS,
      currentView: 'dashboard'
    };
    saveState();
    refreshAll();
    showToast('🔄 Restored default July 2026 Workplan!');
  }
}

let state = loadState();

// ── Month key ─────────────────────────────────────────
function monthKey(year, month) { return `${year}-${month}`; }
function activeKey() { return monthKey(state.activeYear, state.activeMonth); }

function getActivePlan() {
  const key = activeKey();
  if (!state.plans[key]) {
    state.plans[key] = buildDefaultPlan(state.activeYear, state.activeMonth);
    saveState();
  }
  return state.plans[key];
}

function hasAnyPlan() {
  const plan = getActivePlan();
  return Object.values(plan).some(stages =>
    stages.some(s => s.date !== null || s.status === 'Done')
  );
}

// ── Company plan helpers ──────────────────────────────
function getCompanyStages(companyId) {
  const plan = getActivePlan();
  return plan[companyId] || [];
}

function getCompanyProgress(companyId) {
  const stages = getCompanyStages(companyId).slice(0, 4);
  const done = stages.filter(s => s.status === 'Done').length;
  return Math.round((done / 4) * 100);
}

function getCompanyCurrentStageIdx(companyId) {
  const stages = getCompanyStages(companyId);
  const doneIdx = [...stages].reverse().findIndex(s => s.status === 'Done');
  if (doneIdx === -1) return 0;
  return Math.min(stages.length - 1 - doneIdx + 1, stages.length - 1);
}

// ── Activity log ──────────────────────────────────────
function logActivity(companyName, stageName, oldStatus, newStatus) {
  state.activities.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    year: state.activeYear,
    month: state.activeMonth,
    company: companyName,
    stage: stageName,
    from: oldStatus,
    to: newStatus
  });
  if (state.activities.length > 150) state.activities.pop();
}

// ── Month navigation ──────────────────────────────────
function prevMonth() {
  if (state.activeMonth === 1) { state.activeMonth = 12; state.activeYear--; }
  else state.activeMonth--;
  saveState();
  refreshAll();
}
function nextMonth() {
  if (state.activeMonth === 12) { state.activeMonth = 1; state.activeYear++; }
  else state.activeMonth++;
  saveState();
  refreshAll();
}

function refreshAll() {
  buildSidebar();
  const viewEl = document.getElementById(`view-${state.currentView}`);
  if (viewEl) renderView(state.currentView, viewEl);
}

// ── Copy from previous month ──────────────────────────
function copyFromPrevMonth() {
  let prevYear = state.activeYear, prevMonth = state.activeMonth - 1;
  if (prevMonth === 0) { prevMonth = 12; prevYear--; }
  const prevKey = monthKey(prevYear, prevMonth);
  const prevPlan = state.plans[prevKey];
  if (!prevPlan) {
    showToast(`No plan found for ${MONTH_NAMES[prevMonth - 1]} ${prevYear}`, 'warn');
    return;
  }
  // Deep copy stages structure, reset status/notes, keep dates
  const newPlan = {};
  GLOBAL_COMPANIES.forEach(c => {
    newPlan[c.id] = (prevPlan[c.id] || []).map(s => ({ ...s, status: 'Pending', note: '' }));
  });
  state.plans[activeKey()] = newPlan;
  saveState();
  showToast(`Copied plan from ${MONTH_NAMES[prevMonth - 1]} ${prevYear}!`);
  refreshAll();
}

// ── Navigation ────────────────────────────────────────
const VIEWS = [
  { id: 'dashboard',    label: 'Dashboard',      icon: '📊' },
  { id: 'pipeline',     label: 'Sokrio Pipeline Board',  icon: '🗂️' },
  { id: 'monthly-plan', label: 'Call Log',        icon: '📞' },
  { id: 'companies',    label: 'Companies',       icon: '🏢' },
  { id: 'activity-log', label: 'Activity Log',    icon: '📋' },
];

function navigate(viewId) {
  state.currentView = viewId;
  saveState();
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById(`nav-${viewId}`);
  if (navEl) navEl.classList.add('active');
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  const viewEl = document.getElementById(`view-${viewId}`);
  if (viewEl) {
    viewEl.classList.add('active');
    renderView(viewId, viewEl);
  }
}

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = VIEWS.map(v => `
    <div class="nav-item ${state.currentView === v.id ? 'active' : ''}"
         onclick="navigate('${v.id}')" id="nav-${v.id}">
      <span class="nav-icon">${v.icon}</span>
      <span>${v.label}</span>
    </div>
  `).join('');

  // Month switcher
  const switcher = document.getElementById('month-switcher');
  if (switcher) {
    switcher.innerHTML = `
      <button class="month-nav-btn" onclick="prevMonth()">&#8249;</button>
      <div class="month-display">
        <div class="month-name">${MONTH_NAMES[state.activeMonth - 1]}</div>
        <div class="month-year">${state.activeYear}</div>
      </div>
      <button class="month-nav-btn" onclick="nextMonth()">&#8250;</button>
    `;
  }

  const footerEl = document.getElementById('footer-text');
  if (footerEl) footerEl.textContent = `${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear} · 13 Companies`;
}

// ── Toast ─────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3200);
}

// ── Render dispatcher ─────────────────────────────────
function renderView(viewId, el) {
  switch (viewId) {
    case 'dashboard':    renderDashboard(el);   break;
    case 'pipeline':     renderPipeline(el);    break;
    case 'monthly-plan': renderMonthlyPlan(el); break;
    case 'companies':    renderCompanies(el);   break;
    case 'activity-log': renderActivityLog(el); break;
  }
}

// ── Empty month banner ────────────────────────────────
function emptyMonthBanner(viewTitle, viewSub) {
  return `
    <div class="view-header">
      <div>
        <div class="view-title">${viewTitle}</div>
        <div class="view-subtitle">${viewSub}</div>
      </div>
      ${monthHeaderBadge()}
    </div>
    <div class="empty-month-card">
      <div class="em-icon">📅</div>
      <div class="em-title">No plan set for ${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear}</div>
      <div class="em-sub">Set up this month's work plan to start tracking</div>
      <div class="em-actions">
        <button class="btn-primary" onclick="navigate('companies')">🏢 Setup Companies Plan</button>
        <button class="btn-secondary" onclick="copyFromPrevMonth()">📋 Copy from Previous Month</button>
      </div>
    </div>
  `;
}

function monthHeaderBadge() {
  return `<div class="month-header-badge">
    <button class="mbtn" onclick="prevMonth()">&#8249;</button>
    <span>${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear}</span>
    <button class="mbtn" onclick="nextMonth()">&#8250;</button>
  </div>`;
}

// ── DASHBOARD ─────────────────────────────────────────
function renderDashboard(el) {
  const hasPlan = hasAnyPlan();
  if (!hasPlan) { el.innerHTML = emptyMonthBanner('Dashboard', `Sokrio — ${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear} Sales Outreach`); return; }

  const wonCount      = GLOBAL_COMPANIES.filter(c => getCompanyStages(c.id).find(s => s.stage === 'Deal Won' && s.status === 'Done')).length;
  const proposalCount = GLOBAL_COMPANIES.filter(c => getCompanyStages(c.id).find(s => s.stage === 'Proposal Sent' && s.status === 'Done')).length;
  const avgProgress   = Math.round(GLOBAL_COMPANIES.reduce((a, c) => a + getCompanyProgress(c.id), 0) / GLOBAL_COMPANIES.length);
  const inProgress    = GLOBAL_COMPANIES.filter(c => { const p = getCompanyProgress(c.id); return p > 0 && p < 100; }).length;
  const lostCount     = GLOBAL_COMPANIES.filter(c => getCompanyStages(c.id).find(s => s.stage === 'Deal Lost' && s.status === 'Done')).length;
  const pendingCount  = GLOBAL_COMPANIES.filter(c => getCompanyProgress(c.id) === 0).length;

  el.innerHTML = `
    <div class="view-header">
      <div>
        <div class="view-title">Dashboard</div>
        <div class="view-subtitle">Sokrio — ${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear} Sales Outreach</div>
      </div>
      ${monthHeaderBadge()}
    </div>

    <div class="kpi-grid">
      ${kpiCard('🏢', 'Total Companies', 13, 'Target pipeline', 'indigo')}
      ${kpiCard('🏆', 'Deals Won', wonCount, `${13 - wonCount} remaining`, 'emerald')}
      ${kpiCard('📄', 'Proposals Sent', proposalCount, 'At proposal stage', 'blue')}
      ${kpiCard('📈', 'Avg. Progress', avgProgress + '%', 'Across all companies', 'violet')}
    </div>

    <div class="dashboard-grid">
      <div class="glass-card">
        <div class="card-title">Sokrio Pipeline Board</div>
        <div class="funnel-list">
          ${STAGES.map(s => {
            const doneCount = GLOBAL_COMPANIES.filter(c => getCompanyStages(c.id).find(st => st.stage === s.key && st.status === 'Done')).length;
            const pct = Math.round((doneCount / 13) * 100);
            return `
              <div class="funnel-item">
                <div class="funnel-label">
                  <span>${s.icon} ${s.key}</span>
                  <span class="funnel-count">${doneCount}/13</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${pct}%; background:${s.color}"></div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <div class="glass-card">
        <div class="card-title">Company Status Summary</div>
        <div class="status-legend">
          <div class="legend-item"><span class="dot" style="background:var(--accent-emerald)"></span>Won — ${wonCount}</div>
          <div class="legend-item"><span class="dot" style="background:var(--accent-rose)"></span>Lost — ${lostCount}</div>
          <div class="legend-item"><span class="dot" style="background:var(--accent-blue)"></span>In Progress — ${inProgress}</div>
          <div class="legend-item"><span class="dot" style="background:var(--accent-amber)"></span>Pending — ${pendingCount}</div>
        </div>
        <div class="company-mini-list">
          ${GLOBAL_COMPANIES.map(c => {
            const prog = getCompanyProgress(c.id);
            const idx  = getCompanyCurrentStageIdx(c.id);
            const stageName = getCompanyStages(c.id)[idx]?.stage || 'Initial Call';
            const stageInfo = STAGES.find(s => s.key === stageName) || STAGES[0];
            return `
              <div class="company-mini-item" onclick="openCompanyModal(${c.id})">
                <div class="company-mini-avatar" style="background:${stageInfo.color}20; border-color:${stageInfo.color}40">${c.name.charAt(0)}</div>
                <div class="company-mini-info">
                  <div class="company-mini-name">${c.name}</div>
                  <div class="company-mini-stage">${stageInfo.icon} ${stageName}</div>
                </div>
                <div class="mini-ring">
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3"/>
                    <circle cx="18" cy="18" r="15" fill="none" stroke="${stageInfo.color}" stroke-width="3"
                      stroke-dasharray="${Math.round(prog * 0.942)} 94.2"
                      stroke-linecap="round" transform="rotate(-90 18 18)"/>
                  </svg>
                  <span class="ring-label">${prog}%</span>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function kpiCard(icon, label, value, sub, accent) {
  const gradMap = { indigo: 'var(--gradient-primary)', emerald: 'var(--gradient-success)', blue: 'var(--gradient-info)', violet: 'linear-gradient(135deg,#a78bfa,#7c3aed)' };
  return `
    <div class="kpi-card">
      <div class="kpi-icon" style="background:${gradMap[accent]}">${icon}</div>
      <div class="kpi-body">
        <div class="kpi-value">${value}</div>
        <div class="kpi-label">${label}</div>
        <div class="kpi-sub">${sub}</div>
      </div>
    </div>`;
}

// ── PIPELINE BOARD ────────────────────────────────────
function renderPipeline(el) {
  if (!hasAnyPlan()) { el.innerHTML = emptyMonthBanner('Sokrio Pipeline Board', `${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear} pipeline stages`); return; }

  el.innerHTML = `
    <div class="view-header">
      <div>
        <div class="view-title">Sokrio Pipeline Board</div>
        <div class="view-subtitle">${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear} — Click a card to update status</div>
      </div>
      ${monthHeaderBadge()}
    </div>
    <div class="pipeline-board">
      ${STAGES.map(s => {
        const companiesHere = GLOBAL_COMPANIES.filter(c => {
          const idx = getCompanyCurrentStageIdx(c.id);
          return getCompanyStages(c.id)[idx]?.stage === s.key;
        });
        return `
          <div class="pipeline-column">
            <div class="pipeline-col-header" style="border-top:3px solid ${s.color}">
              <span>${s.icon} ${s.key}</span>
              <span class="stage-badge" style="background:${s.color}20;color:${s.color}">${companiesHere.length}</span>
            </div>
            <div class="pipeline-cards">
              ${companiesHere.length === 0 ? `<div class="pipeline-empty">No companies</div>` :
                companiesHere.map(c => {
                  const stageData = getCompanyStages(c.id).find(st => st.stage === s.key);
                  return `
                    <div class="pipeline-card" onclick="openCompanyModal(${c.id})">
                      <div class="pc-name">${c.name}</div>
                      <div class="pc-date">${stageData?.date ? fmtDate(stageData.date) : '—'}</div>
                      <div class="pc-status" style="color:${STATUS_COLORS[stageData?.status||'Pending']}">${STATUS_ICONS[stageData?.status||'Pending']} ${stageData?.status||'Pending'}</div>
                    </div>`;
                }).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ── CALL LOG & FOLLOW-UP MANAGER ──────────────────────

let callLogFilter = 'all';
let expandedLogIds = new Set([101]);

function renderMonthlyPlan(el) {
  renderCallLogView(el);
}

function renderCallLogView(el) {
  if (!state.callLogs) state.callLogs = DEFAULT_CALL_LOGS;

  const logs = state.callLogs || [];
  const filteredLogs = logs.filter(l => {
    if (callLogFilter === 'pending') return l.status === 'Follow-up Pending';
    if (callLogFilter === 'completed') return l.status === 'Completed';
    return true;
  });

  const pendingCount = logs.filter(l => l.status === 'Follow-up Pending').length;
  const completedCount = logs.filter(l => l.status === 'Completed').length;

  el.innerHTML = `
    <div class="view-header">
      <div>
        <div class="view-title">📞 Call Log & Follow-up Manager</div>
        <div class="view-subtitle">Log client calls, track follow-up schedules, record meeting remarks, and expand history details</div>
      </div>
      ${monthHeaderBadge()}
    </div>

    <div class="call-log-container">
      <!-- Call Log Entry Form (matching uploaded mockup) -->
      <div class="call-log-card call-log-form-card">
        <div class="form-header-row">
          <div class="form-title-text">
            <span>📞 Log Call & Follow-up Event</span>
          </div>
          <a href="#" class="toggle-more-link" onclick="toggleCallLogMoreOptions(event)" id="cl-more-toggle">fewer options ▲</a>
        </div>

        <form id="call-log-form" onsubmit="handleCreateCallLog(event)">
          <div class="form-grid-layout">
            <!-- Row 1: Event Start, Duration, Event End -->
            <div class="form-inline-fields">
              <div class="field-item">
                <label>Event date and time:</label>
                <div style="display:flex;gap:6px">
                  <input type="date" id="cl-start-date" class="input-styled" value="${new Date().toISOString().split('T')[0]}" onchange="calcCallEndTime()">
                  <select id="cl-start-time" class="select-styled" onchange="calcCallEndTime()">
                    ${generateTimeOptions('05:55 PM')}
                  </select>
                </div>
              </div>

              <div class="field-item">
                <label>Duration:</label>
                <div style="display:flex;gap:6px">
                  <input type="number" id="cl-duration" class="input-styled" style="width:70px" value="60" min="1" onchange="calcCallEndTime()">
                  <select id="cl-duration-unit" class="select-styled" onchange="calcCallEndTime()">
                    <option value="hours" selected>hours</option>
                    <option value="minutes">minutes</option>
                  </select>
                </div>
              </div>

              <div class="field-item">
                <label>Event end date and time:</label>
                <div style="display:flex;gap:6px">
                  <input type="date" id="cl-end-date" class="input-styled" value="${new Date().toISOString().split('T')[0]}">
                  <select id="cl-end-time" class="select-styled">
                    ${generateTimeOptions('05:55 PM')}
                  </select>
                </div>
              </div>
            </div>

            <!-- Row 2: Subject -->
            <div class="form-field-group">
              <label>Subject:</label>
              <input type="text" id="cl-subject" class="input-styled" placeholder="Enter call subject or follow-up reason..." required>
            </div>

            <!-- Row 3: With (Company) & Status -->
            <div class="form-inline-fields">
              <div class="field-item" style="flex:1;min-width:240px">
                <label>With Company:</label>
                <select id="cl-company-id" class="select-styled" style="width:100%" required>
                  <option value="">-- Select Company --</option>
                  ${GLOBAL_COMPANIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>

              <div class="field-item" style="width:200px">
                <label>Call Status:</label>
                <select id="cl-status" class="select-styled" style="width:100%">
                  <option value="Follow-up Pending">⏳ Follow-up Pending</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>
            </div>

            <!-- Row 4: Description / Remarks -->
            <div class="form-field-group" id="cl-extra-fields">
              <label>Description / Remarks:</label>
              <textarea id="cl-remarks" class="textarea-styled" rows="3" placeholder="Enter detailed remarks, call feedback, client requirements, or next steps..."></textarea>
            </div>

            <!-- Action Buttons -->
            <div style="display:flex;gap:12px;margin-top:8px">
              <button type="submit" class="btn-primary">💾 Save Call Log & Follow-up</button>
              <button type="button" class="btn-ghost" onclick="resetCallLogForm()">🔄 Reset Form</button>
            </div>
          </div>
        </form>
      </div>

      <!-- History & Deepdown Section -->
      <div class="history-section-title">
        <div class="history-title-text">📋 Call Log History & Follow-ups (${filteredLogs.length})</div>
        <div class="history-filter-tabs">
          <button class="filter-tab-btn ${callLogFilter === 'all' ? 'active' : ''}" onclick="setCallLogFilter('all')">All (${logs.length})</button>
          <button class="filter-tab-btn ${callLogFilter === 'pending' ? 'active' : ''}" onclick="setCallLogFilter('pending')">⏳ Follow-up Pending (${pendingCount})</button>
          <button class="filter-tab-btn ${callLogFilter === 'completed' ? 'active' : ''}" onclick="setCallLogFilter('completed')">✅ Completed (${completedCount})</button>
        </div>
      </div>

      <div class="deepdown-card-list">
        ${filteredLogs.length === 0 ? `
          <div class="empty-state" style="padding:30px;background:var(--bg-card);border:1px dashed var(--border);border-radius:var(--radius-lg)">
            <div class="empty-icon">📞</div>
            <div class="empty-title">No call logs found</div>
            <div class="empty-sub">Fill out the form above to record your first call log or follow-up activity.</div>
          </div>
        ` : filteredLogs.map(item => {
          const isExpanded = expandedLogIds.has(item.id);
          const isPending = item.status === 'Follow-up Pending';
          return `
            <div class="deepdown-card ${isExpanded ? 'expanded' : ''}" id="log-card-${item.id}">
              <div class="deepdown-header" onclick="toggleDeepdownLog(${item.id})">
                <div class="deepdown-header-main">
                  <span class="deepdown-badge ${isPending ? 'pending' : 'completed'}">
                    ${isPending ? '⏳ Follow-up Pending' : '✅ Completed'}
                  </span>
                  <div class="deepdown-subject">${escapeHtml(item.subject)}</div>
                  <span class="deepdown-company-tag">🏢 ${escapeHtml(item.companyName)}</span>
                </div>
                <div class="deepdown-meta">
                  <span class="deepdown-time-str">📅 ${fmtDateShort(item.startDate)} ${item.startTime || ''}</span>
                  <span class="deepdown-arrow">▼</span>
                </div>
              </div>

              <div class="deepdown-body">
                <div class="deepdown-details-grid">
                  <div class="deepdown-detail-item">
                    <span class="deepdown-detail-label">Start Date & Time</span>
                    <span class="deepdown-detail-val">${fmtDate(item.startDate)} at ${item.startTime || '—'}</span>
                  </div>
                  <div class="deepdown-detail-item">
                    <span class="deepdown-detail-label">Duration</span>
                    <span class="deepdown-detail-val">${item.duration} ${item.durationUnit || 'minutes'}</span>
                  </div>
                  <div class="deepdown-detail-item">
                    <span class="deepdown-detail-label">End Date & Time</span>
                    <span class="deepdown-detail-val">${fmtDate(item.endDate)} at ${item.endTime || '—'}</span>
                  </div>
                  <div class="deepdown-detail-item">
                    <span class="deepdown-detail-label">Company</span>
                    <span class="deepdown-detail-val">${escapeHtml(item.companyName)}</span>
                  </div>
                </div>

                <div class="deepdown-detail-item" style="margin-bottom:8px">
                  <span class="deepdown-detail-label">Description / Remarks</span>
                </div>
                <div class="deepdown-remarks-box">${escapeHtml(item.remarks || 'No remarks added.')}</div>

                ${item.completedAt ? `
                  <div style="font-size:0.8rem;color:var(--accent-emerald);margin-bottom:12px;padding:8px;background:rgba(16,185,129,0.1);border-radius:var(--radius-sm)">
                    <strong>✅ Completed on:</strong> ${item.completedAt}
                    ${item.completionRemarks ? `<br><em>"${escapeHtml(item.completionRemarks)}"` : ''}
                  </div>
                ` : ''}

                <div class="deepdown-actions">
                  ${isPending ? `
                    <button class="btn-success-sm" onclick="completeCallLog(${item.id})">✅ Finish & Mark Completed</button>
                  ` : `
                    <button class="btn-secondary-sm" onclick="reopenCallLog(${item.id})">↩️ Re-open Follow-up</button>
                  `}
                  <button class="btn-secondary-sm" onclick="editCallLogRemarks(${item.id})">✏️ Edit Remarks</button>
                  <button class="btn-danger-sm" onclick="deleteCallLog(${item.id})">🗑️ Delete</button>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function generateTimeOptions(selectedTime) {
  const times = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '05:55 PM', '06:00 PM', '06:30 PM', '07:00 PM', '08:00 PM'
  ];
  return times.map(t => `<option value="${t}" ${t === selectedTime ? 'selected' : ''}>${t}</option>`).join('');
}

function toggleCallLogMoreOptions(e) {
  if (e) e.preventDefault();
  const extra = document.getElementById('cl-extra-fields');
  const toggleBtn = document.getElementById('cl-more-toggle');
  if (extra.style.display === 'none') {
    extra.style.display = 'flex';
    toggleBtn.textContent = 'fewer options ▲';
  } else {
    extra.style.display = 'none';
    toggleBtn.textContent = 'more options ▼';
  }
}

function calcCallEndTime() {
  const startDateVal = document.getElementById('cl-start-date').value;
  const durationVal = parseInt(document.getElementById('cl-duration').value) || 1;
  const unitVal = document.getElementById('cl-duration-unit').value;
  if (!startDateVal) return;

  const startD = new Date(startDateVal + 'T00:00:00');
  if (unitVal === 'hours') {
    startD.setDate(startD.getDate() + Math.floor(durationVal / 24));
  } else {
    startD.setMinutes(startD.getMinutes() + durationVal);
  }
  const yyyy = startD.getFullYear();
  const mm = String(startD.getMonth() + 1).padStart(2, '0');
  const dd = String(startD.getDate()).padStart(2, '0');
  document.getElementById('cl-end-date').value = `${yyyy}-${mm}-${dd}`;
}

function handleCreateCallLog(e) {
  e.preventDefault();
  const startDate = document.getElementById('cl-start-date').value;
  const startTime = document.getElementById('cl-start-time').value;
  const duration = parseInt(document.getElementById('cl-duration').value) || 60;
  const durationUnit = document.getElementById('cl-duration-unit').value;
  const endDate = document.getElementById('cl-end-date').value;
  const endTime = document.getElementById('cl-end-time').value;
  const subject = document.getElementById('cl-subject').value.trim();
  const companyId = parseInt(document.getElementById('cl-company-id').value);
  const status = document.getElementById('cl-status').value;
  const remarks = document.getElementById('cl-remarks').value.trim();

  if (!subject) { showToast('Please enter a call subject', 'warn'); return; }
  if (!companyId) { showToast('Please select a company', 'warn'); return; }

  const company = GLOBAL_COMPANIES.find(c => c.id === companyId);
  const companyName = company ? company.name : 'Unknown';

  const newLog = {
    id: Date.now(),
    startDate,
    startTime,
    duration,
    durationUnit,
    endDate,
    endTime,
    subject,
    companyId,
    companyName,
    remarks,
    status,
    createdAt: new Date().toLocaleString(),
    completedAt: status === 'Completed' ? new Date().toLocaleString() : null,
    completionRemarks: ''
  };

  if (!state.callLogs) state.callLogs = [];
  state.callLogs.unshift(newLog);
  expandedLogIds.add(newLog.id);
  saveState();
  showToast(`Call log "${subject}" saved!`, 'success');

  const viewEl = document.getElementById(`view-${state.currentView}`);
  if (viewEl) renderView(state.currentView, viewEl);
}

function resetCallLogForm() {
  document.getElementById('call-log-form').reset();
}

function setCallLogFilter(filter) {
  callLogFilter = filter;
  const viewEl = document.getElementById(`view-${state.currentView}`);
  if (viewEl) renderView(state.currentView, viewEl);
}

function toggleDeepdownLog(logId) {
  if (expandedLogIds.has(logId)) {
    expandedLogIds.delete(logId);
  } else {
    expandedLogIds.add(logId);
  }
  const card = document.getElementById(`log-card-${logId}`);
  if (card) card.classList.toggle('expanded');
}

function completeCallLog(logId) {
  const log = (state.callLogs || []).find(l => l.id === logId);
  if (!log) return;

  const notes = prompt(`Mark "${log.subject}" as Completed.\nEnter completion remarks / call summary:`, log.completionRemarks || '');
  if (notes !== null) {
    log.status = 'Completed';
    log.completedAt = new Date().toLocaleString();
    log.completionRemarks = notes.trim();
    saveState();
    showToast(`Call completed: ${log.subject}`, 'success');
    const viewEl = document.getElementById(`view-${state.currentView}`);
    if (viewEl) renderView(state.currentView, viewEl);
  }
}

function reopenCallLog(logId) {
  const log = (state.callLogs || []).find(l => l.id === logId);
  if (!log) return;
  log.status = 'Follow-up Pending';
  log.completedAt = null;
  saveState();
  showToast(`Reopened follow-up for: ${log.subject}`);
  const viewEl = document.getElementById(`view-${state.currentView}`);
  if (viewEl) renderView(state.currentView, viewEl);
}

function editCallLogRemarks(logId) {
  const log = (state.callLogs || []).find(l => l.id === logId);
  if (!log) return;
  const newRemarks = prompt(`Edit remarks for "${log.subject}":`, log.remarks || '');
  if (newRemarks !== null) {
    log.remarks = newRemarks.trim();
    saveState();
    showToast('Remarks updated ✓');
    const viewEl = document.getElementById(`view-${state.currentView}`);
    if (viewEl) renderView(state.currentView, viewEl);
  }
}

function deleteCallLog(logId) {
  if (!confirm('Are you sure you want to delete this call log history item?')) return;
  state.callLogs = (state.callLogs || []).filter(l => l.id !== logId);
  expandedLogIds.delete(logId);
  saveState();
  showToast('Call log deleted', 'warn');
  const viewEl = document.getElementById(`view-${state.currentView}`);
  if (viewEl) renderView(state.currentView, viewEl);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── COMPANIES ─────────────────────────────────────────
function renderCompanies(el) {
  el.innerHTML = `
    <div class="view-header">
      <div>
        <div class="view-title">Companies</div>
        <div class="view-subtitle">${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear} — Click a company to set dates & update status</div>
      </div>
      <div class="header-right-group">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="company-search" placeholder="Search..." oninput="filterCompanies(this.value)">
        </div>
        ${monthHeaderBadge()}
      </div>
    </div>
    <div class="month-actions-bar">
      <button class="btn-secondary" onclick="copyFromPrevMonth()">📋 Copy from Previous Month</button>
      <button class="btn-ghost" onclick="clearMonthPlan()">🗑️ Clear This Month</button>
    </div>
    <div class="companies-table-wrapper">
      <table class="companies-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Company</th>
            <th>📞 Initial Call</th>
            <th>🎯 Sales Pitch</th>
            <th>🎬 Demo Video</th>
            <th>📄 Proposal</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="companies-tbody">
          ${GLOBAL_COMPANIES.map(c => companyRow(c)).join('')}
        </tbody>
      </table>
    </div>`;
}

function companyRow(c) {
  const stages   = getCompanyStages(c.id);
  const prog     = getCompanyProgress(c.id);
  const idx      = getCompanyCurrentStageIdx(c.id);
  const curStage = stages[idx]?.stage || 'Initial Call';
  const stageInfo = STAGES.find(s => s.key === curStage) || STAGES[0];
  const won = stages.find(s => s.stage === 'Deal Won' && s.status === 'Done');
  const lost = stages.find(s => s.stage === 'Deal Lost' && s.status === 'Done');
  let statusTag = won  ? `<span class="status-tag won">🏆 Won</span>`
    : lost ? `<span class="status-tag lost">❌ Lost</span>`
    : prog === 0 ? `<span class="status-tag pending">⏳ Pending</span>`
    : `<span class="status-tag in-progress" style="border-color:${stageInfo.color}40;color:${stageInfo.color}">${stageInfo.icon} ${stageInfo.short}</span>`;

  return `
    <tr class="company-row" onclick="openCompanyModal(${c.id})">
      <td class="td-num">${c.id}</td>
      <td class="td-name">${c.name}</td>
      ${stages.slice(0,4).map(s => `
        <td>
          <span class="stage-status-pill" style="color:${STATUS_COLORS[s.status]}">${STATUS_ICONS[s.status]} ${s.status}</span>
          ${s.date ? `<div class="stage-date-tiny">${fmtDateShort(s.date)}</div>` : '<div class="stage-date-tiny no-date">No date</div>'}
        </td>`).join('')}
      <td>
        <div class="progress-bar-sm"><div class="progress-fill" style="width:${prog}%;background:${stageInfo.color}"></div></div>
        <div class="prog-pct">${prog}%</div>
      </td>
      <td>${statusTag}</td>
    </tr>`;
}

function filterCompanies(query) {
  const tbody = document.getElementById('companies-tbody');
  if (!tbody) return;
  const q = query.toLowerCase();
  tbody.innerHTML = GLOBAL_COMPANIES.filter(c => c.name.toLowerCase().includes(q)).map(c => companyRow(c)).join('');
}

function clearMonthPlan() {
  if (!confirm(`Clear all plan data for ${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear}?`)) return;
  state.plans[activeKey()] = buildDefaultPlan(state.activeYear, state.activeMonth);
  saveState();
  showToast('Month plan cleared', 'warn');
  refreshAll();
}

// ── ACTIVITY LOG ──────────────────────────────────────
function renderActivityLog(el) {
  el.innerHTML = `
    <div class="view-header">
      <div>
        <div class="view-title">Activity Log</div>
        <div class="view-subtitle">All status changes across all months</div>
      </div>
      ${state.activities.length > 0 ? `<button class="btn-ghost" onclick="clearLog()">Clear Log</button>` : ''}
    </div>
    ${state.activities.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-title">No activities yet</div>
        <div class="empty-sub">Update a company's stage status to see activity here</div>
      </div>
    ` : `
      <div class="activity-list">
        ${state.activities.map(a => {
          const d = new Date(a.timestamp);
          const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
          const stageInfo = STAGES.find(s => s.key === a.stage) || STAGES[0];
          return `
            <div class="activity-item">
              <div class="act-icon" style="background:${stageInfo.color}20;color:${stageInfo.color}">${stageInfo.icon}</div>
              <div class="act-body">
                <div class="act-title"><strong>${a.company}</strong> — ${a.stage}</div>
                <div class="act-change">
                  <span style="color:${STATUS_COLORS[a.from]}">${STATUS_ICONS[a.from]} ${a.from}</span>
                  <span class="act-arrow">→</span>
                  <span style="color:${STATUS_COLORS[a.to]}">${STATUS_ICONS[a.to]} ${a.to}</span>
                </div>
                <div class="act-month-tag">${MONTH_NAMES[(a.month||7)-1]} ${a.year||2026}</div>
              </div>
              <div class="act-time">${date} · ${time}</div>
            </div>`;
        }).join('')}
      </div>`}`;
}

function clearLog() {
  state.activities = [];
  saveState();
  navigate('activity-log');
}

// ── COMPANY MODAL (with date editing) ────────────────
function openCompanyModal(companyId) {
  const company = GLOBAL_COMPANIES.find(c => c.id === companyId);
  if (!company) return;
  const stages = getCompanyStages(companyId);

  const modal   = document.getElementById('modal-container');
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('active');

  modal.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-title">${company.name}</div>
        <div class="modal-sub">${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear} — Set dates & update stage status</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-stages">
        ${stages.map((s, idx) => {
          const stageInfo = STAGES.find(st => st.key === s.stage) || STAGES[0];
          const isDone = s.status === 'Done';
          return `
            <div class="modal-stage-card ${isDone ? 'stage-done' : ''}" style="border-color:${isDone ? stageInfo.color : 'transparent'}">
              <div class="ms-icon" style="background:${stageInfo.color}20;color:${stageInfo.color}">${stageInfo.icon}</div>
              <div class="ms-body">
                <div class="ms-name">${s.stage}</div>
                <div class="ms-date-row">
                  <input type="date"
                    class="date-input"
                    value="${s.date || ''}"
                    onchange="updateStageDate(${companyId}, ${idx}, this.value)"
                    title="Set date for this stage">
                  ${s.date ? `<span class="ms-day">${getDayName(s.date)}</span>` : ''}
                </div>
                ${s.note ? `<div class="ms-note">"${s.note}"</div>` : ''}
              </div>
              <div class="ms-actions">
                <button class="status-cycle-btn"
                  style="background:${STATUS_COLORS[s.status]}20;color:${STATUS_COLORS[s.status]};border-color:${STATUS_COLORS[s.status]}40"
                  onclick="cycleStatus(${companyId}, ${idx})">
                  ${STATUS_ICONS[s.status]} ${s.status}
                </button>
                <button class="note-btn" onclick="editNote(${companyId}, ${idx})" title="Add note">📝</button>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="editNote(${companyId}, -1)">📝 General Note</button>
      <button class="btn-primary" onclick="closeModal()">Done</button>
    </div>`;
}

function updateStageDate(companyId, stageIdx, newDate) {
  const plan = getActivePlan();
  if (!plan[companyId]) return;
  plan[companyId][stageIdx].date = newDate || null;
  plan[companyId][stageIdx].day = newDate ? getDayName(newDate) : '';
  saveState();
  showToast('Date updated ✓', 'success');
  // Refresh modal to show day name
  openCompanyModal(companyId);
}

function cycleStatus(companyId, stageIdx) {
  const company = GLOBAL_COMPANIES.find(c => c.id === companyId);
  const plan = getActivePlan();
  if (!company || !plan[companyId]) return;
  const stage = plan[companyId][stageIdx];
  const oldStatus = stage.status;
  const nextIdx = (STATUS_OPTIONS.indexOf(stage.status) + 1) % STATUS_OPTIONS.length;
  stage.status = STATUS_OPTIONS[nextIdx];
  logActivity(company.name, stage.stage, oldStatus, stage.status);
  saveState();
  showToast(`${company.name} · ${stage.stage} → ${stage.status}`);
  openCompanyModal(companyId);
}

function editNote(companyId, stageIdx) {
  const company = GLOBAL_COMPANIES.find(c => c.id === companyId);
  const plan = getActivePlan();
  if (!company || !plan[companyId]) return;
  const target = stageIdx >= 0 ? plan[companyId][stageIdx] : null;
  const label = stageIdx >= 0 ? `${company.name} — ${plan[companyId][stageIdx].stage}` : `${company.name} — General Note`;
  const currentNote = target ? target.note : '';
  const newNote = prompt(`Note for ${label}:`, currentNote);
  if (newNote !== null && target) {
    target.note = newNote.trim();
    saveState();
    openCompanyModal(companyId);
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  const viewEl = document.getElementById(`view-${state.currentView}`);
  if (viewEl) renderView(state.currentView, viewEl);
}

document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── INIT ──────────────────────────────────────────────
function init() {
  // Inject month switcher into sidebar
  const sidebar = document.querySelector('.sidebar-logo');
  if (sidebar) {
    const switcherDiv = document.createElement('div');
    switcherDiv.id = 'month-switcher';
    switcherDiv.className = 'month-switcher';
    sidebar.after(switcherDiv);
  }

  buildSidebar();

  // Show active view
  const viewEl = document.getElementById(`view-${state.currentView}`);
  if (viewEl) {
    viewEl.classList.add('active');
    renderView(state.currentView, viewEl);
  }

  // Fetch initial cloud state & setup real-time background sync
  fetchCloudState();
  setInterval(fetchCloudState, 6000);
}

init();
