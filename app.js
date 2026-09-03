/* =====================================================
   Sokrio Sales Tracker — app.js (Dynamic Monthly)
   Each month has its own independent work plan.
   ===================================================== */

// ── Month names ──────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

// ── Default Company List (53 companies) ─────────────
const DEFAULT_COMPANIES = [
  { id: 1,  name: 'Bangladesh Edible Oil Ltd.' },
  { id: 2,  name: 'MM Ispahani' },
  { id: 3,  name: 'BRAC Dairy & Food Projects' },
  { id: 4,  name: 'Paragon Agro Limited' },
  { id: 5,  name: 'Heidelberg Cement Bangladesh Ltd.' },
  { id: 6,  name: 'Lalteer Seed Ltd' },
  { id: 7,  name: 'Lalteer Prestisides' },
  { id: 8,  name: 'Lalteer Rice' },
  { id: 9,  name: 'Tradesworth Household Ltd.' },
  { id: 10, name: 'Royal Weaving' },
  { id: 11, name: 'Popy Library' },
  { id: 12, name: 'Kitty Industries Ltd' },
  { id: 13, name: 'Fair Food & Lifestyle' },
  { id: 14, name: 'Winpower' },
  { id: 15, name: 'Chef Food Industries' },
  { id: 16, name: 'Zinix Incorporation' },
  { id: 17, name: 'Supreme Ifad Consumers Bangladesh Ltd' },
  { id: 18, name: 'TIFBD' },
  { id: 19, name: 'Paragon Feed (Chittagong Feed Limited)' },
  { id: 20, name: 'Rangpur Dairy & Food Products Limited' },
  { id: 21, name: 'Romaina' },
  { id: 22, name: 'Olympic Milk Products Ltd' },
  { id: 23, name: 'Ahmed Food Products Ltd' },
  { id: 24, name: 'Perfume Chemical Industries PLC.' },
  { id: 25, name: 'S Haque International' },
  { id: 26, name: 'M. Ahmed Tea & Lands Company Limited' },
  { id: 27, name: 'Muazuddin Steel Industries Limited' },
  { id: 28, name: 'Barakh Bites Ltd' },
  { id: 29, name: 'Sinopec' },
  { id: 30, name: 'BD Star Food & Agro' },
  { id: 31, name: 'KAI Distribution (BIR)' },
  { id: 32, name: 'Xinpeng Ceramics (BIR)' },
  { id: 33, name: 'KAI Project (BIR)' },
  { id: 34, name: 'KAI Hardware (BIR)' },
  { id: 35, name: 'BIR Metal and Engineering (BIR)' },
  { id: 36, name: 'BIR Consumer (BIR)' },
  { id: 37, name: 'KAI International (BIR)' },
  { id: 38, name: 'Celestial Tech' },
  { id: 39, name: 'Monno Medical College & Hospital' },
  { id: 40, name: 'Orient Machineries' },
  { id: 41, name: 'Amin Square Limited' },
  { id: 42, name: 'DataScape' },
  { id: 43, name: 'Smile Food Products' },
  { id: 44, name: 'Paragon CGF' },
  { id: 45, name: 'Paragon Dairy' },
  { id: 46, name: 'Linkage International' },
  { id: 47, name: 'Bengal Pipe and Wire Limited' },
  { id: 48, name: 'Rahul Group' },
  { id: 49, name: 'Min Max' },
  { id: 50, name: 'RB Agro' },
  { id: 51, name: 'Temakaw Fashion Limited' },
  { id: 52, name: 'Paragon Fertilizer' },
  { id: 53, name: 'Paragon EON Bio Science Limited' },
];

// Dynamic getter — always reads from state if available
function getCompanies() {
  if (typeof state !== 'undefined' && state.companies && state.companies.length > 0) {
    return state.companies;
  }
  return DEFAULT_COMPANIES;
}
// Alias for convenience
let GLOBAL_COMPANIES = DEFAULT_COMPANIES; // will be refreshed after state loads

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
  getCompanies().forEach(c => {
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
  DEFAULT_COMPANIES.forEach(c => {
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

// ── Existing Client Follow-up Config & Default Data ──────
const EXISTING_CLIENT_COMPANIES = [
  'Bangladesh Edible Oil Ltd.',
  'MM Ispahani',
  'BRAC Dairy & Food Projects',
  'Paragon Agro Limited',
  'Heidelberg Cement Bangladesh Ltd.',
  'Lalteer Seed Ltd',
  'Lalteer Prestisides',
  'Lalteer Rice',
  'Tradesworth Household Ltd.',
  'Royal Weaving',
  'Popy Library',
  'Kitty Industries Ltd',
  'Fair Food & Lifestyle',
  'Winpower',
  'Chef Food Industries',
  'Zinix Incorporation',
  'Supreme Ifad Consumers Bangladesh Ltd',
  'TIFBD',
  'Paragon Feed (Chittagong Feed Limited)',
  'Rangpur Dairy & Food Products Limited',
  'Romaina',
  'Olympic Milk Products Ltd',
  'Ahmed Food Products Ltd',
  'Perfume Chemical Industries PLC.',
  'S Haque International',
  'M. Ahmed Tea & Lands Company Limited',
  'Muazuddin Steel Industries Limited',
  'Barakh Bites Ltd',
  'Sinopec',
  'BD Star Food & Agro',
  'KAI Distribution (BIR)',
  'Xinpeng Ceramics (BIR)',
  'KAI Project (BIR)',
  'KAI Hardware (BIR)',
  'BIR Metal and Engineering (BIR)',
  'BIR Consumer (BIR)',
  'KAI International (BIR)',
  'Celestial Tech',
  'Monno Medical College & Hospital',
  'Orient Machineries',
  'Amin Square Limited',
  'DataScape',
  'Smile Food Products',
  'Paragon CGF',
  'Paragon Dairy',
  'Linkage International',
  'Bengal Pipe and Wire Limited',
  'Rahul Group',
  'Min Max',
  'RB Agro',
  'Temakaw Fashion Limited',
  'Paragon Fertilizer',
  'Paragon EON Bio Science Limited'
];

const CLIENT_FOLLOWUP_TYPES = [
  'General Follow-up',
  'Payment/Bill Due',
  'Service/Support Issue',
  'Software Problem',
  'Feature/Change Request',
  'Feedback',
  'Renewal/Subscription',
  'Other'
];

const CLIENT_CALL_RESULTS = [
  { key: 'Connected',     icon: '📞', color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.15)' },
  { key: 'Not Connected', icon: '📵', color: 'var(--accent-rose)',    bg: 'rgba(244,63,94,0.15)'  },
  { key: 'Busy',          icon: '⏳', color: 'var(--accent-amber)',   bg: 'rgba(245,158,11,0.15)' },
  { key: 'Switched Off',  icon: '📴', color: 'var(--text-muted)',     bg: 'rgba(148,163,184,0.15)'}
];

const CLIENT_FOLLOWUP_STATUSES = [
  { key: 'Positive',    icon: '✨', color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.15)' },
  { key: 'Issue Found', icon: '⚠️', color: 'var(--accent-rose)',    bg: 'rgba(244,63,94,0.15)'  },
  { key: 'Pending',     icon: '⏳', color: 'var(--accent-amber)',   bg: 'rgba(245,158,11,0.15)' },
  { key: 'Resolved',    icon: '✅', color: 'var(--accent-blue)',    bg: 'rgba(59,130,246,0.15)' },
  { key: 'No Response', icon: '🚫', color: 'var(--text-muted)',     bg: 'rgba(148,163,184,0.15)'}
];

const DEFAULT_CLIENT_FOLLOWUPS = [
  {
    id: 1001,
    clientName: 'Bangladesh Edible Oil Ltd.',
    contactPerson: 'Mr. Jahangir (Sr. Admin)',
    contactNumber: '01730-325353',
    contactEmail: 'jahangir.alam@beol-bd.com',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Routine check-in call with Admin team regarding depot order dispatch and tracking.',
    actionTaken: 'Shared operational updates. Connected with Jr. Admin Mr. Rasel.',
    nextFollowUpDate: '2026-09-02',
    remarks: 'Jr. Admin: Mr. Rasel (01773-101788), Shahin (01705-883565). Sales Head: Amit Banerjee.',
    employee: 'Saimom'
  },
  {
    id: 1002,
    clientName: 'MM Ispahani',
    contactPerson: 'Mr. Amit Paul (Sr. Manager, IT)',
    contactNumber: '01770-004154',
    contactEmail: 'amit.paul@ispahanibd.com',
    followUpDate: '2026-08-25',
    followUpType: 'Service/Support Issue',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Reviewed field force synchronization performance and IT system health.',
    actionTaken: 'Coordinated with technical team to optimize server sync routine.',
    nextFollowUpDate: '2026-09-05',
    remarks: 'IT Executive: Ms. Sema Das (01990-072192), Head of IT: Mr. Jahirul Islam.',
    employee: 'Farhan'
  },
  {
    id: 1003,
    clientName: 'BRAC Dairy & Food Projects',
    contactPerson: 'Faes (MIS)',
    contactNumber: '01729-070838',
    contactEmail: 'faes.a@brac.net',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Monthly MIS data flow review and distributor reporting status across zones.',
    actionTaken: 'Verified reporting sync with Shazedur Rahman and Apurba.',
    nextFollowUpDate: '2026-09-08',
    remarks: 'MIS: Shazedur (01799-985686), Sales Admin: Apurba (01730-784158).',
    employee: 'Tanvir'
  },
  {
    id: 1004,
    clientName: 'Paragon Agro Limited',
    contactPerson: 'Mr. Asfakul (Head of IT)',
    contactNumber: '01313-714894',
    contactEmail: 'asfakul@paragon.com.bd',
    followUpDate: '2026-08-25',
    followUpType: 'Software Problem',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Followed up on Agro division mobile reporting sync and regional depot logs.',
    actionTaken: 'Aligned with Mir Zubaer Ahmed (MIS) on query resolution.',
    nextFollowUpDate: '2026-09-06',
    remarks: 'MIS: Mir Zubaer (01324-413135), Abu Bokor Rizhvi (01326-710524).',
    employee: 'Saimom'
  },
  {
    id: 1005,
    clientName: 'Heidelberg Cement Bangladesh Ltd.',
    contactPerson: 'Shafayet (Admin)',
    contactNumber: '01321-125656',
    contactEmail: 'mdshafayet.hossain@heidelbergcement.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Discussed field force administration, user accounts, and account privileges.',
    actionTaken: 'Sent updated license allocation details to Admin desk.',
    nextFollowUpDate: '2026-09-04',
    remarks: 'Shafayet confirmed all regional accounts active and operational.',
    employee: 'Farhan'
  },
  {
    id: 1006,
    clientName: 'Lalteer Seed Ltd',
    contactPerson: 'Ms. Sharmin (Admin)',
    contactNumber: '01730-004930',
    contactEmail: 'sharmin.sultana@multimodebd.com',
    followUpDate: '2026-08-25',
    followUpType: 'Renewal/Subscription',
    callResult: 'Connected',
    status: 'Pending',
    discussion: 'Follow-up regarding seed division annual license renewal and contract terms.',
    actionTaken: 'Emailed official commercial renewal quotation to Multimode Admin.',
    nextFollowUpDate: '2026-09-01',
    remarks: 'Multimode group admin reviewing contract documents.',
    employee: 'Tanvir'
  },
  {
    id: 1007,
    clientName: 'Lalteer Prestisides',
    contactPerson: 'Ms. Sharmin (Admin)',
    contactNumber: '01730-004930',
    contactEmail: 'sharmin.sultana@multimodebd.com',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Routine check on pesticide territory sales tracking and field visits.',
    actionTaken: 'Confirmed user access credentials for field sales officers.',
    nextFollowUpDate: '2026-09-10',
    remarks: 'Territory managers satisfied with reporting speed.',
    employee: 'Saimom'
  },
  {
    id: 1008,
    clientName: 'Lalteer Rice',
    contactPerson: 'Ms. Sharmin (Admin)',
    contactNumber: '01730-004930',
    contactEmail: 'sharmin.sultana@multimodebd.com',
    followUpDate: '2026-08-25',
    followUpType: 'Feedback',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Collected feedback from Rice distribution unit and depot coordinators.',
    actionTaken: 'Shared tips on mobile offline sync mode for remote field areas.',
    nextFollowUpDate: '2026-09-12',
    remarks: 'Smooth operation reported across North Bengal distributors.',
    employee: 'Farhan'
  },
  {
    id: 1009,
    clientName: 'Tradesworth Household Ltd.',
    contactPerson: 'Dipongkar',
    contactNumber: '01844-558123',
    contactEmail: 'dipongkar.surveillance@tradesworthgroup.com',
    followUpDate: '2026-08-24',
    followUpType: 'Payment/Bill Due',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Followed up on invoice payment status and billing reconciliation.',
    actionTaken: 'Invoice copy resent to dipongkar.surveillance@tradesworthgroup.com.',
    nextFollowUpDate: '2026-08-30',
    remarks: 'Payment voucher under approval; will disburse this week.',
    employee: 'Saimom'
  },
  {
    id: 1010,
    clientName: 'Royal Weaving',
    contactPerson: 'Md. Yeasir Arafat (Admin)',
    contactNumber: '01647-380650',
    contactEmail: 'royalpolycoat.arafat@gmail.com',
    followUpDate: '2026-08-23',
    followUpType: 'Service/Support Issue',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'User permissions and role management setup assistance for factory team.',
    actionTaken: 'Assisted Yeasir Bhai in configuring admin accounts.',
    nextFollowUpDate: '2026-09-07',
    remarks: 'HR: 01896-037110, GM: royalpolycoat.sales.gm@gmail.com.',
    employee: 'Tanvir'
  },
  {
    id: 1011,
    clientName: 'Popy Library',
    contactPerson: 'Mr. Saigal (Head of Accounts)',
    contactNumber: '01966-604605',
    contactEmail: 'accsaigal.hbd@gmail.com',
    followUpDate: '2026-08-25',
    followUpType: 'Payment/Bill Due',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Subscription billing and monthly invoice reconciliation.',
    actionTaken: 'Sent statement of accounts to Mr. Saigal and Rumi.',
    nextFollowUpDate: '2026-09-02',
    remarks: 'Admin: Rumi (01966-604610).',
    employee: 'Saimom'
  },
  {
    id: 1012,
    clientName: 'Kitty Industries Ltd',
    contactPerson: 'Rifat Uddin Ahmed (Sr. Manager, HR & Admin)',
    contactNumber: '01819-445480',
    contactEmail: 'rifat.eg@gmail.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Monthly review on factory operations and field order tracking.',
    actionTaken: 'Connected with Shamim Khan (Sales Admin) for user roster update.',
    nextFollowUpDate: '2026-09-05',
    remarks: 'Sales Admin: Shamim Khan (01987-006123, shamim.kitty@gmail.com). Jasim Uddin, Kamal Hossain.',
    employee: 'Farhan'
  },
  {
    id: 1013,
    clientName: 'Fair Food & Lifestyle',
    contactPerson: 'Mr. Kazi Akidul (Sales Admin)',
    contactNumber: '01964-400555',
    contactEmail: 'akidul.islam@ffl.com.bd',
    followUpDate: '2026-08-25',
    followUpType: 'Feature/Change Request',
    callResult: 'Connected',
    status: 'Pending',
    discussion: 'Discussed custom sales performance report requirements and target filters.',
    actionTaken: 'Shared report specs with technical product team.',
    nextFollowUpDate: '2026-08-29',
    remarks: 'MIS: Ms. Saudia Afroj (saudia.afroj@ffl.com.bd), Admin: Abdus Salam.',
    employee: 'Saimom'
  },
  {
    id: 1014,
    clientName: 'Winpower',
    contactPerson: 'Mr. Aunoy (HR Admin)',
    contactNumber: '01324-743410',
    contactEmail: 'winpowerh@gmail.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Routine check on system adoption among sales representatives.',
    actionTaken: 'Sent quick start manual to Mr. Atik (IT) and Mr. Ismail (HR).',
    nextFollowUpDate: '2026-09-04',
    remarks: 'IT: Mr. Atik (01782-638215), HR: Mr. Ismail (01738-335115).',
    employee: 'Tanvir'
  },
  {
    id: 1015,
    clientName: 'Chef Food Industries',
    contactPerson: 'Md Sobur (HR Admin)',
    contactNumber: '01799-987476',
    contactEmail: 'cfi.hr.sabur@gmail.com',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Check-in on distribution pipeline and field reporting accuracy.',
    actionTaken: 'Updated user credentials for regional depot managers.',
    nextFollowUpDate: '2026-09-08',
    remarks: 'MD: Mohammad Safiq (01717-086753, mohammad.safiq@yahoo.com).',
    employee: 'Farhan'
  },
  {
    id: 1016,
    clientName: 'Zinix Incorporation',
    contactPerson: 'Atiqur (IT)',
    contactNumber: '01329-630680',
    contactEmail: 'atiqur@alfatahbd.com',
    followUpDate: '2026-08-23',
    followUpType: 'Service/Support Issue',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Technical query on data export and daily summary report view.',
    actionTaken: 'Demonstrated automated report export feature to IT desk.',
    nextFollowUpDate: '2026-09-06',
    remarks: 'Sales Admin: Ashraful Islam (01792-626577, ashrafulislam.iu@gmail.com). Kamrul, Salehin.',
    employee: 'Saimom'
  },
  {
    id: 1017,
    clientName: 'Supreme Ifad Consumers Bangladesh Ltd',
    contactPerson: 'Ahmad Ullah (Admin)',
    contactNumber: '01335-102554',
    contactEmail: 'adit@supremeifad.com',
    followUpDate: '2026-08-25',
    followUpType: 'Renewal/Subscription',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Quarterly subscription review and additional user license allocation.',
    actionTaken: 'Shared expansion quotation for additional 15 licenses.',
    nextFollowUpDate: '2026-09-03',
    remarks: 'Admin Ahmad Ullah processing approval with commercial team.',
    employee: 'Tanvir'
  },
  {
    id: 1018,
    clientName: 'TIFBD',
    contactPerson: 'Hr Sajib (Head of HR)',
    contactNumber: '01301-701751',
    contactEmail: 'hr@savory.com.bd',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Followed up with HR & Management on employee activity tracking.',
    actionTaken: 'Shared performance analytics report with Sajib Bhai.',
    nextFollowUpDate: '2026-09-07',
    remarks: 'CEO: Mr Liton (01794-800000, ceo@savory.com.bd). Savory Food division.',
    employee: 'Saimom'
  },
  {
    id: 1019,
    clientName: 'Paragon Feed (Chittagong Feed Limited)',
    contactPerson: 'Mr. Asfakul (Head of IT)',
    contactNumber: '01313-714894',
    contactEmail: 'asfakul@paragon.com.bd',
    followUpDate: '2026-08-25',
    followUpType: 'Software Problem',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Feed division order dispatch and inventory reporting validation.',
    actionTaken: 'Resolved minor latency issue in evening sync.',
    nextFollowUpDate: '2026-09-09',
    remarks: 'MIS: Mir Zubaer Ahmed (01324-413135), Abu Bokor Rizhvi (01326-710524).',
    employee: 'Farhan'
  },
  {
    id: 1020,
    clientName: 'Rangpur Dairy & Food Products Limited',
    contactPerson: 'Nazmul (MIS)',
    contactNumber: '01978-090813',
    contactEmail: 'nazmulrahman.info@gmail.com',
    followUpDate: '2026-08-25',
    followUpType: 'Feedback',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Monthly review on Dairy route tracking and invoice validation.',
    actionTaken: 'Shared tips on customized Excel exports with Nazmul Bhai.',
    nextFollowUpDate: '2026-09-11',
    remarks: 'Nazmul confirmed system is functioning smoothly across all milk collection points.',
    employee: 'Saimom'
  },
  {
    id: 1021,
    clientName: 'Romaina',
    contactPerson: 'Mr. Anamul Kabir (Primary Project Coordinator)',
    contactNumber: '01811-447539',
    contactEmail: 'it4@bengal.com.bd',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Followed up on Romania Food & Beverage sales team adoption.',
    actionTaken: 'Reviewed monthly tracking metrics with Mr. Anamul Kabir.',
    nextFollowUpDate: '2026-09-05',
    remarks: 'Mr. Helmi Hasan (01966-614157), Imran Bhai (Manager-IT), Mr. Kabir (Sales Operation).',
    employee: 'Tanvir'
  },
  {
    id: 1022,
    clientName: 'Olympic Milk Products Ltd',
    contactPerson: 'Md Aftab (Higher Management)',
    contactNumber: '01753-660119',
    contactEmail: 'aftab.02aa@gmail.com',
    followUpDate: '2026-08-25',
    followUpType: 'Payment/Bill Due',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Followed up regarding invoice clearance for Olympic Milk Food Packaging.',
    actionTaken: 'Sent billing details to Sharfuddin Sheikh (MIS).',
    nextFollowUpDate: '2026-08-31',
    remarks: 'MIS: Sharfuddin Sheikh (01847-282349, sharfuddinsheikh2019@gmail.com).',
    employee: 'Saimom'
  },
  {
    id: 1023,
    clientName: 'Ahmed Food Products Ltd',
    contactPerson: 'MD AL Mamun (HR Head & Admin)',
    contactNumber: '01711-000000',
    contactEmail: 'hasanalmamun5261@gmail.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'General check-in call with HR & Admin on sales force performance.',
    actionTaken: 'Sent user management guide to Mamun Bhai via email.',
    nextFollowUpDate: '2026-09-08',
    remarks: 'Email: hasanalmamun5261@gmail.com. Requested demo on upcoming features.',
    employee: 'Farhan'
  },
  {
    id: 1024,
    clientName: 'Perfume Chemical Industries PLC.',
    contactPerson: 'Nur Alam (Sales Admin)',
    contactNumber: '01896-047221',
    contactEmail: 'mohammadnuralamn@gmail.com',
    followUpDate: '2026-08-25',
    followUpType: 'Service/Support Issue',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Assisted in resolving user login reset issue for area supervisor.',
    actionTaken: 'Reset password and confirmed successful supervisor login.',
    nextFollowUpDate: '2026-09-10',
    remarks: 'Nur Alam Bhai confirmed all territory teams active.',
    employee: 'Saimom'
  },
  {
    id: 1025,
    clientName: 'S Haque International',
    contactPerson: 'Md. Sayeedul Hoque Jewel (CMD)',
    contactNumber: '01819-222426',
    contactEmail: 'sayeedul.hoque@s-hoque.com',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Executive review call with CMD regarding commercial operations.',
    actionTaken: 'Aligned with Alamin (HR) on monthly employee active list.',
    nextFollowUpDate: '2026-09-06',
    remarks: 'HR: Alamin (01841-123400, sales@s-hoque.com).',
    employee: 'Tanvir'
  },
  {
    id: 1026,
    clientName: 'M. Ahmed Tea & Lands Company Limited',
    contactPerson: 'Mostaqun Nabi (Marketing Manager / Admin)',
    contactNumber: '01713-485374',
    contactEmail: 'matlcdhaka@gmail.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Reviewed tea estate sales outreach and dealer network coverage.',
    actionTaken: 'Shared summary dashboard report with Mostaqun Nabi.',
    nextFollowUpDate: '2026-09-05',
    remarks: 'Management: Fahima (01741-338289, fahima@m-ahmedgroup.com).',
    employee: 'Farhan'
  },
  {
    id: 1027,
    clientName: 'Muazuddin Steel Industries Limited',
    contactPerson: 'Karim (HR)',
    contactNumber: '01958-040018',
    contactEmail: 'it.karim@muazuddinknitfashion.com',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Discussed employee attendance and territory sales tracking.',
    actionTaken: 'Shared user manual on report exports with Karim Bhai.',
    nextFollowUpDate: '2026-09-07',
    remarks: 'System running smoothly for steel division distribution team.',
    employee: 'Saimom'
  },
  {
    id: 1028,
    clientName: 'Barakh Bites Ltd',
    contactPerson: 'Md. Masud Rana (Tech & Audit)',
    contactNumber: '01750-505193',
    contactEmail: 'tech.audit.ing@gmail.com',
    followUpDate: '2026-08-23',
    followUpType: 'Feature/Change Request',
    callResult: 'Connected',
    status: 'Pending',
    discussion: 'Requested audit trail export formatting for monthly internal reviews.',
    actionTaken: 'Documented audit spec requirements with technical team.',
    nextFollowUpDate: '2026-08-30',
    remarks: 'Other contacts: Mr. Murad, Mr. Russel.',
    employee: 'Tanvir'
  },
  {
    id: 1029,
    clientName: 'Sinopec',
    contactPerson: 'Commercial Operations Support',
    contactNumber: '01711-223344',
    contactEmail: 'operations@sinopec.com.bd',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Routine check on lubricants distribution tracking & order logs.',
    actionTaken: 'Verified daily activity report generation.',
    nextFollowUpDate: '2026-09-04',
    remarks: 'Client satisfied with real-time field visibility.',
    employee: 'Farhan'
  },
  {
    id: 1030,
    clientName: 'BD Star Food & Agro',
    contactPerson: 'Md. Afjal Hossain (Managing Director)',
    contactNumber: '01736-348311',
    contactEmail: 'bdstaragrofoods2017@gmail.com',
    followUpDate: '2026-08-25',
    followUpType: 'Renewal/Subscription',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Followed up with MD on subscription renewal and expansion.',
    actionTaken: 'Sent formal renewal invoice and discount package.',
    nextFollowUpDate: '2026-09-02',
    remarks: 'Afjal Bhai confirmed payment will be initiated next week.',
    employee: 'Saimom'
  },
  {
    id: 1031,
    clientName: 'KAI Distribution (BIR)',
    contactPerson: 'Shahreen Tasneem (HR)',
    contactNumber: '01704-168865',
    contactEmail: 'hrd@birgh.com',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Followed up on BIR Group KAI Distribution team user management.',
    actionTaken: 'Provided active user roster breakdown to Shahreen Apu.',
    nextFollowUpDate: '2026-09-06',
    remarks: 'BIR Group central HR managing accounts for all KAI entities.',
    employee: 'Farhan'
  },
  {
    id: 1032,
    clientName: 'Xinpeng Ceramics (BIR)',
    contactPerson: 'Shahreen Tasneem (HR)',
    contactNumber: '01704-168865',
    contactEmail: 'hrd@birgh.com',
    followUpDate: '2026-08-24',
    followUpType: 'Service/Support Issue',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Ceramics division field staff profile updates and reassignments.',
    actionTaken: 'Updated territory assignments for 6 sales executives.',
    nextFollowUpDate: '2026-09-08',
    remarks: 'All profiles active and synced with central database.',
    employee: 'Tanvir'
  },
  {
    id: 1033,
    clientName: 'KAI Project (BIR)',
    contactPerson: 'Shahreen Tasneem (HR)',
    contactNumber: '01704-168865',
    contactEmail: 'hrd@birgh.com',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Project sales tracking and milestone verification call.',
    actionTaken: 'Confirmed report generation working as expected.',
    nextFollowUpDate: '2026-09-09',
    remarks: 'BIR Group Project division reporting high usability.',
    employee: 'Saimom'
  },
  {
    id: 1034,
    clientName: 'KAI Hardware (BIR)',
    contactPerson: 'Shahreen Tasneem (HR)',
    contactNumber: '01704-168865',
    contactEmail: 'hrd@birgh.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Hardware sales team visit logs and check-in routine verification.',
    actionTaken: 'Shared tips on optimizing map view and route efficiency.',
    nextFollowUpDate: '2026-09-05',
    remarks: 'Hardware division managers happy with tracking accuracy.',
    employee: 'Farhan'
  },
  {
    id: 1035,
    clientName: 'BIR Metal and Engineering (BIR)',
    contactPerson: 'Shahreen Tasneem (HR)',
    contactNumber: '01704-168865',
    contactEmail: 'hrd@birgh.com',
    followUpDate: '2026-08-25',
    followUpType: 'Payment/Bill Due',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Consolidated invoice for Metal and Engineering enterprise accounts.',
    actionTaken: 'Submitted combined statement to BIR Group finance.',
    nextFollowUpDate: '2026-09-01',
    remarks: 'Finance manager confirmed check will be released shortly.',
    employee: 'Saimom'
  },
  {
    id: 1036,
    clientName: 'BIR Consumer (BIR)',
    contactPerson: 'Shahreen Tasneem (HR)',
    contactNumber: '01704-168865',
    contactEmail: 'hrd@birgh.com',
    followUpDate: '2026-08-25',
    followUpType: 'Feedback',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Consumer goods dispatch and dealer ordering routine feedback.',
    actionTaken: 'Logged feedback regarding faster search filters in app.',
    nextFollowUpDate: '2026-09-12',
    remarks: 'Consumer division operations performing steadily.',
    employee: 'Tanvir'
  },
  {
    id: 1037,
    clientName: 'KAI International (BIR)',
    contactPerson: 'Shahreen Tasneem (HR)',
    contactNumber: '01704-168865',
    contactEmail: 'hrd@birgh.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'KAI International corporate outreach and commercial client visits.',
    actionTaken: 'Verified executive access permissions on mobile portal.',
    nextFollowUpDate: '2026-09-07',
    remarks: 'All 7 BIR Group entities actively monitored.',
    employee: 'Saimom'
  },
  {
    id: 1038,
    clientName: 'Celestial Tech',
    contactPerson: 'Farhad Ahmed (Admin)',
    contactNumber: '01537-667713',
    contactEmail: 'farhad.ahmed@celestial-tech.net',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Admin check-in on technical staff reporting and project tracking.',
    actionTaken: 'Connected with Pratik Deb (AM) for dashboard review.',
    nextFollowUpDate: '2026-09-04',
    remarks: 'Assistant Manager: Pratik Deb (01753-498453, pratik.deb@celestial-tech.net).',
    employee: 'Farhan'
  },
  {
    id: 1039,
    clientName: 'Monno Medical College & Hospital',
    contactPerson: 'Rony Bhai',
    contactNumber: '01819-161856',
    contactEmail: 'arpotaka@gmail.com',
    followUpDate: '2026-08-25',
    followUpType: 'Service/Support Issue',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Medical representatives route tracking and depot log sync.',
    actionTaken: 'Verified server connectivity with IT department (it@monnomch.edu.bd).',
    nextFollowUpDate: '2026-09-06',
    remarks: 'IT Department: 01977-866020 (it@monnomch.edu.bd).',
    employee: 'Saimom'
  },
  {
    id: 1040,
    clientName: 'Orient Machineries',
    contactPerson: 'Salman Farid (Sales Head)',
    contactNumber: '01934-888111',
    contactEmail: 'salmanfarid94@gmail.com',
    followUpDate: '2026-08-25',
    followUpType: 'Feedback',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Discussion on machinery quotation pipeline and lead stages.',
    actionTaken: 'Demonstrated stage filtering and deal tracking workflows.',
    nextFollowUpDate: '2026-09-08',
    remarks: 'Salman Bhai praised the intuitive stage progression interface.',
    employee: 'Tanvir'
  },
  {
    id: 1041,
    clientName: 'Amin Square Limited',
    contactPerson: 'Mr. Sovon',
    contactNumber: '01716-599485',
    contactEmail: 'shovon.asbd2016@gmail.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Routine follow-up with Sovon Bhai on daily sales force logs.',
    actionTaken: 'Shared updated monthly calendar workplan template.',
    nextFollowUpDate: '2026-09-03',
    remarks: 'Email: shovon.asbd2016@gmail.com.',
    employee: 'Saimom'
  },
  {
    id: 1042,
    clientName: 'DataScape',
    contactPerson: 'Mehedi (Head of Sales)',
    contactNumber: '01719-303021',
    contactEmail: 'mahedi@datascape-bd.com',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Quarterly review on Family Crafts / DataScape sales tracking.',
    actionTaken: 'Connected with Rakib (Factory Director) for factory log review.',
    nextFollowUpDate: '2026-09-07',
    remarks: 'Factory Director: Rakib (01730-584440, rakib@datascape-bd.com).',
    employee: 'Farhan'
  },
  {
    id: 1043,
    clientName: 'Smile Food Products',
    contactPerson: 'Mahmud Hasan (MIS)',
    contactNumber: '01958-356886',
    contactEmail: 'shakil@smilefoodbd.com',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'August workplan and order collection speed review.',
    actionTaken: 'Shared performance report with MD Shumsuddha Shakil (Sales Ops).',
    nextFollowUpDate: '2026-09-05',
    remarks: 'Sales Ops Manager: MD Shumsuddha Shakil.',
    employee: 'Saimom'
  },
  {
    id: 1044,
    clientName: 'Paragon CGF',
    contactPerson: 'Mr. Asfakul (Head of IT)',
    contactNumber: '01313-714894',
    contactEmail: 'asfakul@paragon.com.bd',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Consumer goods field force reporting and territory routing.',
    actionTaken: 'Confirmed live data sync with Mir Zubaer Ahmed (MIS).',
    nextFollowUpDate: '2026-09-06',
    remarks: 'MIS Team: Mir Zubaer (01324-413135), Abu Bokor Rizhvi (01326-710524).',
    employee: 'Tanvir'
  },
  {
    id: 1045,
    clientName: 'Paragon Dairy',
    contactPerson: 'Mr. Asfakul (Head of IT)',
    contactNumber: '01313-714894',
    contactEmail: 'asfakul@paragon.com.bd',
    followUpDate: '2026-08-25',
    followUpType: 'Service/Support Issue',
    callResult: 'Connected',
    status: 'Resolved',
    discussion: 'Dairy division morning route check-in log verification.',
    actionTaken: 'Verified instant sync for regional field supervisors.',
    nextFollowUpDate: '2026-09-10',
    remarks: 'MIS: Mir Zubaer Ahmed (01324-413135), Abu Bokor (01326-710524).',
    employee: 'Saimom'
  },
  {
    id: 1046,
    clientName: 'Linkage International',
    contactPerson: 'Mosrur (Admin)',
    contactNumber: '01601-702240',
    contactEmail: 'commercial.linkageiltd@gmail.com',
    followUpDate: '2026-08-23',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Routine check on commercial division client visits and pipeline.',
    actionTaken: 'Assisted Mosrur Bhai with weekly visit report extraction.',
    nextFollowUpDate: '2026-09-02',
    remarks: 'Email: commercial.linkageiltd@gmail.com.',
    employee: 'Farhan'
  },
  {
    id: 1047,
    clientName: 'Bengal Pipe and Wire Limited',
    contactPerson: 'Mr. Anamul Kabir (Primary Project Coordinator)',
    contactNumber: '01811-447539',
    contactEmail: 'it4@bengal.com.bd',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Bengal Polymer Wares / Pipe and Wire project coordination review.',
    actionTaken: 'Reviewed user access roles with Imran Bhai (Manager-IT).',
    nextFollowUpDate: '2026-09-07',
    remarks: 'Mr. Helmi Hasan (01966-614157), Imran Bhai (it6@bengal.com.bd).',
    employee: 'Saimom'
  },
  {
    id: 1048,
    clientName: 'Rahul Group',
    contactPerson: 'Manjurul Bhai (IT Admin)',
    contactNumber: '01701-212900',
    contactEmail: 'manjurul.rg3073@gmail.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Routine monthly call regarding IT user administration and logs.',
    actionTaken: 'Confirmed all Rahul Group active field accounts.',
    nextFollowUpDate: '2026-09-05',
    remarks: 'IT Admin: Manjurul Bhai (01701-212900, manjurul.rg3073@gmail.com).',
    employee: 'Tanvir'
  },
  {
    id: 1049,
    clientName: 'Min Max',
    contactPerson: 'Abdullah Al Nizam (HR Admin)',
    contactNumber: '01955-576998',
    contactEmail: 'hr_admin@minmaxbd.net',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'MinMax Consumer Care monthly attendance and sales tracking review.',
    actionTaken: 'Provided updated user manual to Nizam Bhai.',
    nextFollowUpDate: '2026-09-04',
    remarks: 'HR Admin: Abdullah Al Nizam (01955-576998, hr_admin@minmaxbd.net).',
    employee: 'Farhan'
  },
  {
    id: 1050,
    clientName: 'RB Agro',
    contactPerson: 'Mr. Asaduzzaman (Managing Director)',
    contactNumber: '01891-761330',
    contactEmail: 'asad.shimizu@gmail.com',
    followUpDate: '2026-08-25',
    followUpType: 'Payment/Bill Due',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Follow-up regarding July workplan and subscription invoice.',
    actionTaken: 'Coordinated with Mr. Aman Ullah (Sales Admin) on voucher processing.',
    nextFollowUpDate: '2026-08-29',
    remarks: 'Sales Admin: Mr. Aman Ullah (01981-877786, sales.ragroupbd@gmail.com).',
    employee: 'Saimom'
  },
  {
    id: 1051,
    clientName: 'Temakaw Fashion Limited',
    contactPerson: 'Syed Rahman',
    contactNumber: '01914-232229',
    contactEmail: 'sayedur.rahman@temakaw.com',
    followUpDate: '2026-08-24',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Fashion division merchandiser and client visit tracking review.',
    actionTaken: 'Connected with Badrul (IT Head) for IT system health check.',
    nextFollowUpDate: '2026-09-06',
    remarks: 'IT Head: Badrul (01718-944444, badrul@temakaw.com). MD: Harunur Rashid.',
    employee: 'Tanvir'
  },
  {
    id: 1052,
    clientName: 'Paragon Fertilizer',
    contactPerson: 'Mr. Asfakul (Head of IT)',
    contactNumber: '01313-714894',
    contactEmail: 'asfakul@paragon.com.bd',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Fertilizer division distribution monitoring and field visit logs.',
    actionTaken: 'Confirmed monthly reporting accuracy with MIS team.',
    nextFollowUpDate: '2026-09-08',
    remarks: 'MIS: Mir Zubaer Ahmed (01324-413135), Abu Bokor (01326-710524).',
    employee: 'Saimom'
  },
  {
    id: 1053,
    clientName: 'Paragon EON Bio Science Limited',
    contactPerson: 'Mr. Asfakul (Head of IT)',
    contactNumber: '01313-714894',
    contactEmail: 'asfakul@paragon.com.bd',
    followUpDate: '2026-08-25',
    followUpType: 'General Follow-up',
    callResult: 'Connected',
    status: 'Positive',
    discussion: 'Bio Science division reporting and dealer supply chain tracking.',
    actionTaken: 'Confirmed smooth operation across all regional hubs.',
    nextFollowUpDate: '2026-09-10',
    remarks: 'MIS: Mir Zubaer Ahmed (01324-413135), Abu Bokor (01326-710524).',
    employee: 'Farhan'
  }
];

// ── Storage & Live URL State Sync ──────────────────────
const STORAGE_KEY = 'sokrio_tracker_v5';

function encodeStateToHash(st) {
  try {
    const payload = {
      y: st.activeYear,
      m: st.activeMonth,
      p: st.plans,
      c: st.callLogs,
      cf: st.clientFollowups,
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
      clientFollowups: payload.cf || DEFAULT_CLIENT_FOLLOWUPS,
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
  // Only reset companies if missing or empty — never overwrite a user's custom company list
  if (!loadedState.companies || loadedState.companies.length === 0) {
    loadedState.companies = JSON.parse(JSON.stringify(DEFAULT_COMPANIES));
  }
  const isOldMockData = loadedState.clientFollowups && loadedState.clientFollowups.some(f => f.clientName === 'Akij Food & Beverage Ltd' || f.clientName === 'Square Toiletries Ltd');
  if (!loadedState.clientFollowups || loadedState.clientFollowups.length === 0 || isOldMockData) {
    loadedState.clientFollowups = JSON.parse(JSON.stringify(DEFAULT_CLIENT_FOLLOWUPS));
  }
  return loadedState;
}

let isPushingCloud = false;
const CLOUD_CONFIG_KEY = 'sokrio_cloud_config';

function getCloudConfig() {
  try {
    const saved = localStorage.getItem(CLOUD_CONFIG_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

function saveCloudConfig(cfg) {
  try {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cfg));
  } catch (e) {}
}

function updateSyncStatusBadge(status, text) {
  const badge = document.getElementById('sync-status-badge');
  const dot = badge ? badge.querySelector('.sync-dot') : null;
  const label = document.getElementById('sync-status-text');
  if (!badge || !dot || !label) return;

  dot.className = `sync-dot ${status}`;
  label.textContent = text;
}

function pushStateToCloud() {
  if (isPushingCloud) return;
  isPushingCloud = true;
  updateSyncStatusBadge('syncing', 'Syncing...');

  const cloudCfg = getCloudConfig();

  // 1. Direct Client-to-JSONBin Sync if configured
  if (cloudCfg.jsonBinId && cloudCfg.jsonBinKey) {
    fetch(`https://api.jsonbin.io/v3/b/${cloudCfg.jsonBinId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': cloudCfg.jsonBinKey
      },
      body: JSON.stringify(state)
    }).catch(err => console.error('Direct JSONBin save error:', err));
  }

  // 2. Direct Client-to-Upstash KV Sync if configured
  if (cloudCfg.upstashUrl && cloudCfg.upstashToken) {
    fetch(`${cloudCfg.upstashUrl}/set/sokrio_tracker_state`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cloudCfg.upstashToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSON.stringify(state))
    }).catch(err => console.error('Direct Upstash save error:', err));
  }

  // 3. Built-in Backend Endpoint (/api/state)
  fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  }).then(res => res.json()).then(resData => {
    isPushingCloud = false;
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    if (resData && resData.source === 'local-disk') {
      updateSyncStatusBadge('connected', `Disk Saved (${now})`);
    } else if (resData && (resData.storage === 'kv' || resData.storage === 'jsonbin')) {
      updateSyncStatusBadge('connected', `Cloud Synced (${now})`);
    } else {
      updateSyncStatusBadge('connected', `Saved (${now})`);
    }
  }).catch(() => {
    isPushingCloud = false;
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    updateSyncStatusBadge('connected', `Local Saved (${now})`);
  });
}

function fetchCloudState() {
  const cloudCfg = getCloudConfig();

  // 1. If direct Upstash configured, fetch from it
  if (cloudCfg.upstashUrl && cloudCfg.upstashToken) {
    fetch(`${cloudCfg.upstashUrl}/get/sokrio_tracker_state`, {
      headers: { Authorization: `Bearer ${cloudCfg.upstashToken}` }
    }).then(res => res.json()).then(json => {
      if (json && json.result) {
        const cloudData = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
        applySyncedState(cloudData, 'Upstash Cloud');
      }
    }).catch(() => {});
    return;
  }

  // 2. If direct JSONBin configured, fetch from it
  if (cloudCfg.jsonBinId && cloudCfg.jsonBinKey) {
    fetch(`https://api.jsonbin.io/v3/b/${cloudCfg.jsonBinId}/latest`, {
      headers: { 'X-Master-Key': cloudCfg.jsonBinKey }
    }).then(res => res.json()).then(json => {
      if (json && json.record && json.record.plans) {
        applySyncedState(json.record, 'JSONBin Cloud');
      }
    }).catch(() => {});
    return;
  }

  // 3. Default: fetch from /api/state
  fetch('/api/state')
    .then(res => res.json())
    .then(cloudData => {
      if (cloudData && !cloudData.empty && cloudData.plans) {
        const sourceLabel = cloudData._source === 'kv' ? 'Cloud KV' 
          : cloudData._source === 'jsonbin' ? 'JSONBin Cloud' 
          : 'Server Disk';
        applySyncedState(cloudData, sourceLabel);
      } else {
        const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        updateSyncStatusBadge('connected', `Ready (${now})`);
      }
    })
    .catch(() => {
      const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      updateSyncStatusBadge('connected', `Local Storage (${now})`);
    });
}

function applySyncedState(cloudData, sourceName) {
  const cloudStr = JSON.stringify(cloudData);
  const localStr = JSON.stringify(state);
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (cloudStr !== localStr) {
    state = cloudData;
    // Ensure companies list is always present after cloud sync
    if (!state.companies || state.companies.length === 0) {
      state.companies = JSON.parse(JSON.stringify(DEFAULT_COMPANIES));
    }
    GLOBAL_COMPANIES = state.companies;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
    refreshAll();
  }
  updateSyncStatusBadge('connected', `${sourceName} (${now})`);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch(e) {}
  pushStateToCloud();
}

function openCloudModal() {
  const modal = document.getElementById('modal-container');
  const overlay = document.getElementById('modal-overlay');
  const cfg = getCloudConfig();
  overlay.classList.add('active');

  modal.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-title">☁️ Cloud Storage & Database Sync</div>
        <div class="modal-sub">Keep your sales outreach pipeline synchronized across all devices</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="cloud-modal-content">
        <div class="cloud-status-banner">
          <div class="cs-icon">⚡</div>
          <div class="cs-text">
            <div class="cs-title">Active Multi-Tier Persistence</div>
            <div class="cs-subtitle">Your data is automatically saved locally in browser Cache and synchronized via API.</div>
          </div>
          <button class="btn-secondary" style="padding:6px 12px;font-size:0.78rem" onclick="syncNow()">🔄 Sync Now</button>
        </div>

        <div class="cloud-options-grid">
          <!-- Option 1: Upstash / Vercel KV REST API -->
          <div class="cloud-option-card">
            <div class="cloud-opt-header">
              <div class="cloud-opt-title">🚀 Upstash / Vercel KV (Free Cloud Redis)</div>
              <span class="status-tag in-progress">Recommended</span>
            </div>
            <div class="cloud-opt-desc">
              Connect to free Upstash Redis (10,000 req/day free) to sync data permanently across unlimited browsers.
            </div>
            <div class="cloud-opt-inputs">
              <input type="text" id="cfg-upstash-url" class="input-styled" placeholder="REST URL: https://...upstash.io" value="${escapeHtml(cfg.upstashUrl || '')}">
              <input type="password" id="cfg-upstash-token" class="input-styled" placeholder="REST Token: AXXX..." value="${escapeHtml(cfg.upstashToken || '')}">
            </div>
          </div>

          <!-- Option 2: JSONBin.io -->
          <div class="cloud-option-card">
            <div class="cloud-opt-header">
              <div class="cloud-opt-title">📦 JSONBin.io (Zero-Config Cloud Storage)</div>
            </div>
            <div class="cloud-opt-desc">
              Store state on JSONBin.io for instant free cloud persistence.
            </div>
            <div class="cloud-opt-inputs">
              <input type="text" id="cfg-jsonbin-id" class="input-styled" placeholder="Bin ID: 64b..." value="${escapeHtml(cfg.jsonBinId || '')}">
              <input type="password" id="cfg-jsonbin-key" class="input-styled" placeholder="X-Master-Key: $2a$10$..." value="${escapeHtml(cfg.jsonBinKey || '')}">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="clearCloudSettings()">Reset Settings</button>
      <button class="btn-primary" onclick="saveCloudSettings()">Save &amp; Connect</button>
    </div>
  `;
}

function saveCloudSettings() {
  const upstashUrl = document.getElementById('cfg-upstash-url')?.value.trim() || '';
  const upstashToken = document.getElementById('cfg-upstash-token')?.value.trim() || '';
  const jsonBinId = document.getElementById('cfg-jsonbin-id')?.value.trim() || '';
  const jsonBinKey = document.getElementById('cfg-jsonbin-key')?.value.trim() || '';

  saveCloudConfig({ upstashUrl, upstashToken, jsonBinId, jsonBinKey });
  showToast('Cloud settings saved ✓');
  closeModal();
  pushStateToCloud();
}

function clearCloudSettings() {
  if (confirm('Clear custom cloud provider credentials?')) {
    localStorage.removeItem(CLOUD_CONFIG_KEY);
    showToast('Cloud credentials cleared', 'warn');
    closeModal();
    fetchCloudState();
  }
}

function syncNow() {
  pushStateToCloud();
  fetchCloudState();
  showToast('Sync initiated ⚡');
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
// Sync GLOBAL_COMPANIES alias after state is loaded
if (!state.companies || state.companies.length === 0) {
  state.companies = JSON.parse(JSON.stringify(DEFAULT_COMPANIES));
}
GLOBAL_COMPANIES = state.companies;

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
  // Always keep dashboard data fresh in the background
  if (state.currentView !== 'dashboard') {
    const dashEl = document.getElementById('view-dashboard');
    if (dashEl) renderView('dashboard', dashEl);
  }
}

// ── Add / Delete Company ─────────────────────────────
function openAddCompanyModal() {
  const modal = document.getElementById('modal-container');
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('active');

  const now = new Date();
  const yyyy = state.activeYear || now.getFullYear();
  const mm = String(state.activeMonth || (now.getMonth() + 1)).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const defaultDate = `${yyyy}-${mm}-${dd}`;

  modal.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-title">➕ Add New Company</div>
        <div class="modal-sub">Company will be added to the pipeline and monthly work plan</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-field-group" style="margin-bottom:16px">
        <label style="display:block;margin-bottom:6px;color:var(--text-muted);font-size:0.85rem">Company Name <span style="color:var(--accent-rose)">*</span></label>
        <input type="text" id="new-company-name" class="input-styled" placeholder="e.g. Acme Foods Ltd." style="width:100%" autofocus
          onkeydown="if(event.key==='Enter') document.getElementById('new-company-date')?.focus()">
      </div>
      <div class="form-field-group" style="margin-bottom:16px">
        <label style="display:block;margin-bottom:6px;color:var(--text-muted);font-size:0.85rem">Initial Call Date 📅 (Optional)</label>
        <input type="date" id="new-company-date" class="input-styled" value="${defaultDate}" style="width:100%"
          onkeydown="if(event.key==='Enter') saveNewCompany()">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveNewCompany()">➕ Add Company</button>
    </div>
  `;
  setTimeout(() => document.getElementById('new-company-name')?.focus(), 100);
}

function saveNewCompany() {
  const nameInput = document.getElementById('new-company-name');
  const dateInput = document.getElementById('new-company-date');
  const name = nameInput?.value.trim();
  const initDate = dateInput?.value || null;
  if (!name) { showToast('Please enter a company name', 'warn'); return; }

  // Check duplicate
  if (getCompanies().some(c => c.name.toLowerCase() === name.toLowerCase())) {
    showToast('Company already exists!', 'warn'); return;
  }

  // Generate new id (max existing + 1)
  const newId = Math.max(...getCompanies().map(c => c.id), 0) + 1;
  const newCompany = { id: newId, name };

  // Add to state (ensure companies array exists)
  if (!state.companies) state.companies = JSON.parse(JSON.stringify(DEFAULT_COMPANIES));
  state.companies.push(newCompany);
  GLOBAL_COMPANIES = state.companies;

  const currentMonthKey = monthKey(state.activeYear, state.activeMonth);
  if (!state.plans) state.plans = {};
  if (!state.plans[currentMonthKey]) state.plans[currentMonthKey] = {};

  // Set for current active month with the chosen date for Initial Call
  state.plans[currentMonthKey][newId] = STAGES.map((s, idx) => ({
    stage: s.key,
    date: (idx === 0 && initDate) ? initDate : null,
    day: (idx === 0 && initDate) ? getDayName(initDate) : '',
    status: 'Pending',
    note: ''
  }));

  // Add to other existing month plans if any
  Object.keys(state.plans).forEach(key => {
    if (key !== currentMonthKey) {
      state.plans[key][newId] = STAGES.map(s => ({
        stage: s.key, date: null, day: '', status: 'Pending', note: ''
      }));
    }
  });

  saveState();
  closeModal();
  showToast(`✅ "${name}" added to pipeline!`);
  refreshAll();
}

function confirmDeleteCompany(companyId) {
  openDeleteCompanyModal(companyId);
}

function openDeleteCompanyModal(companyId) {
  const company = getCompanies().find(c => c.id === companyId);
  if (!company) return;
  const modal = document.getElementById('modal-container');
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('active');
  modal.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-title" style="color:var(--accent-rose)">🗑️ Delete Company</div>
        <div class="modal-sub">Confirm removal of company from your pipeline</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div style="padding:4px 0 10px 0;font-size:0.92rem;color:var(--text-primary);line-height:1.6">
        Are you sure you want to remove <strong style="color:var(--accent-amber)">"${escapeHtml(company.name)}"</strong> from the pipeline?
        <div style="margin:10px 0;font-size:0.8rem;color:var(--text-muted);background:rgba(239,68,68,0.08);padding:8px 12px;border-radius:var(--radius-sm);border:1px solid rgba(239,68,68,0.2)">
          ⚠️ This will remove all work plan dates, stages, and status records for this company across all months.
        </div>
      </div>

      <div class="form-field-group" style="margin-bottom:12px">
        <label style="display:block;margin-bottom:6px;color:var(--text-muted);font-size:0.85rem;font-weight:500">
          Reason / Remarks for Deletion 💬 <span style="color:var(--accent-rose)">*</span>
        </label>
        
        <!-- Quick Reason Chips -->
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">
          <span class="quick-chip" onclick="document.getElementById('delete-reason-input').value='Client not interested';document.getElementById('delete-reason-input').focus()" style="background:var(--bg-glass-card);border:1px solid var(--border-color);padding:4px 10px;border-radius:var(--radius-full);font-size:0.75rem;cursor:pointer;color:var(--text-muted)">Client not interested</span>
          <span class="quick-chip" onclick="document.getElementById('delete-reason-input').value='Budget constraint';document.getElementById('delete-reason-input').focus()" style="background:var(--bg-glass-card);border:1px solid var(--border-color);padding:4px 10px;border-radius:var(--radius-full);font-size:0.75rem;cursor:pointer;color:var(--text-muted)">Budget constraint</span>
          <span class="quick-chip" onclick="document.getElementById('delete-reason-input').value='Duplicate entry';document.getElementById('delete-reason-input').focus()" style="background:var(--bg-glass-card);border:1px solid var(--border-color);padding:4px 10px;border-radius:var(--radius-full);font-size:0.75rem;cursor:pointer;color:var(--text-muted)">Duplicate entry</span>
          <span class="quick-chip" onclick="document.getElementById('delete-reason-input').value='Wrong contact info';document.getElementById('delete-reason-input').focus()" style="background:var(--bg-glass-card);border:1px solid var(--border-color);padding:4px 10px;border-radius:var(--radius-full);font-size:0.75rem;cursor:pointer;color:var(--text-muted)">Wrong contact info</span>
        </div>

        <textarea id="delete-reason-input" class="input-styled" placeholder="Write reason why this company is being removed..." rows="3" style="width:100%;resize:vertical;font-family:inherit;padding:8px 12px;font-size:0.88rem"></textarea>
      </div>
    </div>
    <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center">
      <button class="btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn-danger" style="background:var(--gradient-danger);color:#fff;border:none;border-radius:var(--radius-full);padding:9px 20px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px" onclick="executeDeleteCompany(${companyId})">
        🗑️ Confirm Delete
      </button>
    </div>
  `;
  setTimeout(() => document.getElementById('delete-reason-input')?.focus(), 100);
}

function executeDeleteCompany(companyId) {
  const company = getCompanies().find(c => c.id === companyId);
  const companyName = company ? company.name : 'Company';
  const reasonInput = document.getElementById('delete-reason-input');
  const reason = reasonInput?.value.trim() || 'No specific remarks';

  // Ensure state.companies exists
  if (!state.companies) {
    state.companies = JSON.parse(JSON.stringify(DEFAULT_COMPANIES));
  }

  // Record in deletedCompanies history cache
  if (!state.deletedCompanies) state.deletedCompanies = [];
  state.deletedCompanies.unshift({
    id: companyId,
    name: companyName,
    reason: reason,
    deletedAt: new Date().toISOString(),
    year: state.activeYear,
    month: state.activeMonth
  });

  // Also log into activities so user can see it in Activity Log
  if (!state.activities) state.activities = [];
  state.activities.unshift({
    id: Date.now(),
    type: 'delete',
    timestamp: new Date().toISOString(),
    year: state.activeYear,
    month: state.activeMonth,
    company: companyName,
    stage: 'Company Deleted',
    reason: reason,
    from: 'Active',
    to: 'Removed'
  });
  if (state.activities.length > 150) state.activities.pop();

  // Remove from companies list
  state.companies = state.companies.filter(c => c.id !== companyId);
  GLOBAL_COMPANIES = state.companies;

  // Remove from all month plans
  if (state.plans) {
    Object.keys(state.plans).forEach(key => {
      if (state.plans[key]) {
        delete state.plans[key][companyId];
      }
    });
  }

  saveState();
  closeModal();
  showToast(`🗑️ "${companyName}" deleted & remarks recorded!`, 'warn');
  refreshAll();
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
  getCompanies().forEach(c => {
    newPlan[c.id] = (prevPlan[c.id] || []).map(s => ({ ...s, status: 'Pending', note: '' }));
  });
  state.plans[activeKey()] = newPlan;
  saveState();
  showToast(`Copied plan from ${MONTH_NAMES[prevMonth - 1]} ${prevYear}!`);
  refreshAll();
}

// ── Navigation ────────────────────────────────────────
const VIEWS = [
  { id: 'dashboard',        label: 'Dashboard',                 icon: '📊' },
  { id: 'client-followup',  label: 'Existing Client Follow-up', icon: '🤝' },
  { id: 'pipeline',         label: 'Sokrio Pipeline Board',     icon: '🗂️' },
  { id: 'monthly-plan',     label: 'Call Log',                  icon: '📞' },
  { id: 'companies',        label: 'Companies',                 icon: '🏢' },
  { id: 'activity-log',     label: 'Activity Log',              icon: '📋' },
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
  if (footerEl) footerEl.textContent = `${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear} · ${getCompanies().length} Companies`;
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
    case 'dashboard':        renderDashboard(el);        break;
    case 'client-followup':  renderClientFollowup(el);   break;
    case 'pipeline':         renderPipeline(el);         break;
    case 'monthly-plan':     renderMonthlyPlan(el);      break;
    case 'companies':        renderCompanies(el);        break;
    case 'activity-log':     renderActivityLog(el);      break;
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
  const avgProgress   = Math.round(GLOBAL_COMPANIES.reduce((a, c) => a + getCompanyProgress(c.id), 0) / (GLOBAL_COMPANIES.length || 1));
  const inProgress    = GLOBAL_COMPANIES.filter(c => { const p = getCompanyProgress(c.id); return p > 0 && p < 100; }).length;
  const lostCount     = GLOBAL_COMPANIES.filter(c => getCompanyStages(c.id).find(s => s.stage === 'Deal Lost' && s.status === 'Done')).length;
  const pendingCount  = GLOBAL_COMPANIES.filter(c => getCompanyProgress(c.id) === 0).length;

  // Existing Client Follow-up Call Metrics
  const cFollowups = state.clientFollowups || [];
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCalls = cFollowups.filter(f => f.followUpDate === todayStr);
  const todayTotalCalls = todayCalls.length;
  const todayConnected = todayCalls.filter(f => f.callResult === 'Connected').length;
  const pendingFollowups = cFollowups.filter(f => f.status === 'Pending').length;
  const paymentFollowups = cFollowups.filter(f => f.followUpType === 'Payment/Bill Due').length;
  const openIssues = cFollowups.filter(f => f.status === 'Issue Found' || f.followUpType === 'Software Problem' || f.followUpType === 'Service/Support Issue').length;
  const resolvedIssues = cFollowups.filter(f => f.status === 'Resolved').length;

  // Employee Performance breakdown
  const empStats = {};
  cFollowups.forEach(f => {
    const emp = f.employee || 'Unassigned';
    if (!empStats[emp]) empStats[emp] = { total: 0, connected: 0, resolved: 0, payment: 0 };
    empStats[emp].total++;
    if (f.callResult === 'Connected') empStats[emp].connected++;
    if (f.status === 'Resolved') empStats[emp].resolved++;
    if (f.followUpType === 'Payment/Bill Due') empStats[emp].payment++;
  });

  el.innerHTML = `
    <div class="view-header">
      <div>
        <div class="view-title">Dashboard</div>
        <div class="view-subtitle">Sokrio — ${MONTH_NAMES[state.activeMonth - 1]} ${state.activeYear} Sales Outreach &amp; Client Support</div>
      </div>
      ${monthHeaderBadge()}
    </div>

    <!-- Pipeline KPI Cards -->
    <div class="kpi-grid">
      ${kpiCard('🏢', 'Total Companies', getCompanies().length, 'Target pipeline', 'indigo')}
      ${kpiCard('🏆', 'Deals Won', wonCount, `${getCompanies().length - wonCount} remaining`, 'emerald')}
      ${kpiCard('📄', 'Proposals Sent', proposalCount, 'At proposal stage', 'blue')}
      ${kpiCard('📈', 'Avg. Progress', avgProgress + '%', 'Across all companies', 'violet')}
    </div>

    <!-- Existing Client Call Count & Follow-up Section -->
    <div class="dash-cf-section">
      <div class="dash-cf-header">
        <div class="dash-cf-title">
          <span>🤝 Existing Client Call Count &amp; Daily Tracking</span>
          <span class="dash-cf-badge">${cFollowups.length} Total Client Follow-ups</span>
        </div>
        <button class="btn-primary" style="font-size:0.82rem;padding:7px 16px;display:flex;align-items:center;gap:6px" onclick="navigate('client-followup')">
          <span>🤝</span> Open Existing Client Follow-up →
        </button>
      </div>

      <div class="cf-kpi-grid">
        <div class="cf-kpi-card">
          <div class="cf-kpi-icon" style="background:var(--gradient-primary);color:#fff">📞</div>
          <div>
            <div class="cf-kpi-val">${todayTotalCalls}</div>
            <div class="cf-kpi-lbl">Today's Total Calls</div>
          </div>
        </div>
        <div class="cf-kpi-card">
          <div class="cf-kpi-icon" style="background:var(--gradient-success);color:#fff">🟢</div>
          <div>
            <div class="cf-kpi-val">${todayConnected}</div>
            <div class="cf-kpi-lbl">Today's Connected</div>
          </div>
        </div>
        <div class="cf-kpi-card">
          <div class="cf-kpi-icon" style="background:var(--gradient-warning);color:#fff">⏳</div>
          <div>
            <div class="cf-kpi-val">${pendingFollowups}</div>
            <div class="cf-kpi-lbl">Pending Follow-ups</div>
          </div>
        </div>
        <div class="cf-kpi-card">
          <div class="cf-kpi-icon" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff">💳</div>
          <div>
            <div class="cf-kpi-val">${paymentFollowups}</div>
            <div class="cf-kpi-lbl">Payment/Bill Due</div>
          </div>
        </div>
        <div class="cf-kpi-card">
          <div class="cf-kpi-icon" style="background:var(--gradient-danger);color:#fff">⚠️</div>
          <div>
            <div class="cf-kpi-val">${openIssues}</div>
            <div class="cf-kpi-lbl">Open Issues</div>
          </div>
        </div>
        <div class="cf-kpi-card">
          <div class="cf-kpi-icon" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff">✅</div>
          <div>
            <div class="cf-kpi-val">${resolvedIssues}</div>
            <div class="cf-kpi-lbl">Resolved Issues</div>
          </div>
        </div>
      </div>

      <!-- Employee Performance Cards -->
      <div class="glass-card" style="margin-top:14px;padding:16px 20px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <div class="card-title" style="margin-bottom:0">👥 Follow-up Performance by Employee / User</div>
          <button class="btn-secondary" style="padding:4px 12px;font-size:0.78rem" onclick="openClientFollowupModal()">➕ Record Follow-up Call</button>
        </div>
        <div class="dash-emp-grid">
          ${Object.keys(empStats).map(emp => `
            <div class="dash-emp-card">
              <div>
                <div class="dash-emp-name">${escapeHtml(emp)}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">
                  🟢 ${empStats[emp].connected} Connected · ✅ ${empStats[emp].resolved} Resolved · 💳 ${empStats[emp].payment} Payment
                </div>
              </div>
              <div class="dash-emp-calls">${empStats[emp].total} Calls</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Pipeline Funnel & Company List Grid -->
    <div class="dashboard-grid" style="margin-top:24px">
      <div class="glass-card">
        <div class="card-title">Sokrio Pipeline Board</div>
        <div class="funnel-list">
          ${STAGES.map(s => {
            const doneCount = GLOBAL_COMPANIES.filter(c => getCompanyStages(c.id).find(st => st.stage === s.key && st.status === 'Done')).length;
            const pct = Math.round((doneCount / (GLOBAL_COMPANIES.length || 1)) * 100);
            return `
              <div class="funnel-item">
                <div class="funnel-label">
                  <span>${s.icon} ${s.key}</span>
                  <span class="funnel-count">${doneCount}/${GLOBAL_COMPANIES.length}</span>
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
                  <div class="company-mini-name">${escapeHtml(c.name)}</div>
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

// ── EXISTING CLIENT FOLLOW-UP MODULE ──────────────────
let cfSearchQuery = '';
let cfTypeFilter = 'all';
let cfResultFilter = 'all';
let cfStatusFilter = 'all';
let cfTimeFilter = 'all';
let cfEmpFilter = 'all';

function renderClientFollowup(el) {
  if (!state.clientFollowups) state.clientFollowups = JSON.parse(JSON.stringify(DEFAULT_CLIENT_FOLLOWUPS));
  const list = state.clientFollowups || [];

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate Metrics from full dataset
  const totalCalls = list.length;
  const connectedCalls = list.filter(f => f.callResult === 'Connected').length;
  const notConnectedCalls = list.filter(f => f.callResult !== 'Connected').length;
  const issuesReported = list.filter(f => f.status === 'Issue Found' || f.followUpType === 'Software Problem' || f.followUpType === 'Service/Support Issue').length;
  const issuesResolved = list.filter(f => f.status === 'Resolved').length;
  const paymentFollowups = list.filter(f => f.followUpType === 'Payment/Bill Due').length;
  const pendingFollowups = list.filter(f => f.status === 'Pending').length;

  // Filter list
  const filteredList = list.filter(f => {
    // Search
    if (cfSearchQuery) {
      const q = cfSearchQuery.toLowerCase();
      const matchName = (f.clientName || '').toLowerCase().includes(q);
      const matchPerson = (f.contactPerson || '').toLowerCase().includes(q);
      const matchNumber = (f.contactNumber || '').toLowerCase().includes(q);
      const matchDisc = (f.discussion || '').toLowerCase().includes(q);
      const matchAct = (f.actionTaken || '').toLowerCase().includes(q);
      const matchRemarks = (f.remarks || '').toLowerCase().includes(q);
      const matchEmp = (f.employee || '').toLowerCase().includes(q);
      if (!matchName && !matchPerson && !matchNumber && !matchDisc && !matchAct && !matchRemarks && !matchEmp) return false;
    }
    // Type Filter
    if (cfTypeFilter !== 'all' && f.followUpType !== cfTypeFilter) return false;
    // Call Result Filter
    if (cfResultFilter !== 'all' && f.callResult !== cfResultFilter) return false;
    // Status Filter
    if (cfStatusFilter !== 'all' && f.status !== cfStatusFilter) return false;
    // Employee Filter
    if (cfEmpFilter !== 'all' && f.employee !== cfEmpFilter) return false;
    // Time Filter
    if (cfTimeFilter === 'today') {
      if (f.followUpDate !== todayStr) return false;
    } else if (cfTimeFilter === 'pending_next') {
      if (!f.nextFollowUpDate || f.status === 'Resolved') return false;
    }
    return true;
  });

  // Extract unique employees
  const employees = Array.from(new Set(list.map(f => f.employee).filter(Boolean)));

  el.innerHTML = `
    <div class="view-header">
      <div>
        <div class="view-title">🤝 Existing Client Follow-up</div>
        <div class="view-subtitle">Routine follow-up, feedback, problem solving &amp; payment recovery for active clients</div>
      </div>
      <div class="cf-header-actions">
        <button class="btn-ghost" onclick="exportClientFollowupsCsv()" title="Download CSV report">📥 Export CSV</button>
        <button class="btn-primary" onclick="openClientFollowupModal()">➕ Record Client Follow-up</button>
      </div>
    </div>

    <!-- Daily Performance Tracking KPI Grid -->
    <div class="cf-kpi-grid">
      <div class="cf-kpi-card" onclick="setCfFilters('all','all','all','all')" style="cursor:pointer" title="View all calls">
        <div class="cf-kpi-icon" style="background:var(--gradient-primary);color:#fff">📞</div>
        <div>
          <div class="cf-kpi-val">${totalCalls}</div>
          <div class="cf-kpi-lbl">Total Calls</div>
        </div>
      </div>
      <div class="cf-kpi-card" onclick="setCfFilters('all','Connected','all','all')" style="cursor:pointer" title="Filter connected calls">
        <div class="cf-kpi-icon" style="background:var(--gradient-success);color:#fff">🟢</div>
        <div>
          <div class="cf-kpi-val">${connectedCalls}</div>
          <div class="cf-kpi-lbl">Connected Calls</div>
        </div>
      </div>
      <div class="cf-kpi-card" onclick="setCfFilters('all','Not Connected','all','all')" style="cursor:pointer" title="Filter not connected calls">
        <div class="cf-kpi-icon" style="background:rgba(244,63,94,0.2);color:var(--accent-rose)">📵</div>
        <div>
          <div class="cf-kpi-val">${notConnectedCalls}</div>
          <div class="cf-kpi-lbl">Not Connected</div>
        </div>
      </div>
      <div class="cf-kpi-card" onclick="setCfFilters('all','all','Issue Found','all')" style="cursor:pointer" title="Filter issues reported">
        <div class="cf-kpi-icon" style="background:var(--gradient-danger);color:#fff">⚠️</div>
        <div>
          <div class="cf-kpi-val">${issuesReported}</div>
          <div class="cf-kpi-lbl">Issues Reported</div>
        </div>
      </div>
      <div class="cf-kpi-card" onclick="setCfFilters('all','all','Resolved','all')" style="cursor:pointer" title="Filter resolved issues">
        <div class="cf-kpi-icon" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff">✅</div>
        <div>
          <div class="cf-kpi-val">${issuesResolved}</div>
          <div class="cf-kpi-lbl">Issues Resolved</div>
        </div>
      </div>
      <div class="cf-kpi-card" onclick="setCfFilters('Payment/Bill Due','all','all','all')" style="cursor:pointer" title="Filter payment follow-ups">
        <div class="cf-kpi-icon" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff">💳</div>
        <div>
          <div class="cf-kpi-val">${paymentFollowups}</div>
          <div class="cf-kpi-lbl">Payment Due</div>
        </div>
      </div>
      <div class="cf-kpi-card" onclick="setCfFilters('all','all','Pending','all')" style="cursor:pointer" title="Filter pending follow-ups">
        <div class="cf-kpi-icon" style="background:var(--gradient-warning);color:#fff">⏳</div>
        <div>
          <div class="cf-kpi-val">${pendingFollowups}</div>
          <div class="cf-kpi-lbl">Pending Follow-ups</div>
        </div>
      </div>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="cf-controls-bar">
      <div class="cf-controls-row">
        <div class="cf-search-box">
          <span class="cf-search-icon">🔍</span>
          <input type="text" id="cf-search-input" placeholder="Search by Client name, Contact person, Phone, or Remarks..."
            value="${escapeHtml(cfSearchQuery)}" oninput="handleCfSearch(this.value)">
        </div>

        <div class="cf-filters-wrap">
          <!-- Type Filter -->
          <select class="cf-select-filter" onchange="cfTypeFilter=this.value; refreshCfView()">
            <option value="all" ${cfTypeFilter === 'all' ? 'selected' : ''}>📁 All Follow-up Types</option>
            ${CLIENT_FOLLOWUP_TYPES.map(t => `<option value="${t}" ${cfTypeFilter === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>

          <!-- Call Result Filter -->
          <select class="cf-select-filter" onchange="cfResultFilter=this.value; refreshCfView()">
            <option value="all" ${cfResultFilter === 'all' ? 'selected' : ''}>📞 All Call Results</option>
            ${CLIENT_CALL_RESULTS.map(r => `<option value="${r.key}" ${cfResultFilter === r.key ? 'selected' : ''}>${r.icon} ${r.key}</option>`).join('')}
          </select>

          <!-- Status Filter -->
          <select class="cf-select-filter" onchange="cfStatusFilter=this.value; refreshCfView()">
            <option value="all" ${cfStatusFilter === 'all' ? 'selected' : ''}>🏷️ All Statuses</option>
            ${CLIENT_FOLLOWUP_STATUSES.map(s => `<option value="${s.key}" ${cfStatusFilter === s.key ? 'selected' : ''}>${s.icon} ${s.key}</option>`).join('')}
          </select>

          <!-- Timeframe Filter -->
          <select class="cf-select-filter" onchange="cfTimeFilter=this.value; refreshCfView()">
            <option value="all" ${cfTimeFilter === 'all' ? 'selected' : ''}>📅 All Time</option>
            <option value="today" ${cfTimeFilter === 'today' ? 'selected' : ''}>📆 Today's Follow-ups</option>
            <option value="pending_next" ${cfTimeFilter === 'pending_next' ? 'selected' : ''}>⏰ Upcoming Next Follow-ups</option>
          </select>

          <!-- Employee Filter -->
          <select class="cf-select-filter" onchange="cfEmpFilter=this.value; refreshCfView()">
            <option value="all" ${cfEmpFilter === 'all' ? 'selected' : ''}>👤 All Employees</option>
            ${employees.map(e => `<option value="${e}" ${cfEmpFilter === e ? 'selected' : ''}>${e}</option>`).join('')}
          </select>

          ${(cfSearchQuery || cfTypeFilter !== 'all' || cfResultFilter !== 'all' || cfStatusFilter !== 'all' || cfTimeFilter !== 'all' || cfEmpFilter !== 'all') ? `
            <button class="btn-ghost" style="padding:6px 12px;font-size:0.8rem;color:var(--accent-rose)" onclick="resetCfFilters()">✕ Clear</button>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- Client Follow-up Records Table -->
    <div class="cf-table-card">
      ${filteredList.length === 0 ? `
        <div style="text-align:center;padding:48px 20px;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:10px">🤝</div>
          <div style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:6px">No Follow-up Records Found</div>
          <div style="font-size:0.85rem">Try adjusting your filters or click below to record a new client follow-up call.</div>
          <button class="btn-primary" style="margin-top:16px" onclick="openClientFollowupModal()">➕ Record Follow-up Call</button>
        </div>
      ` : `
        <div style="overflow-x:auto">
          <table class="cf-table">
            <thead>
              <tr>
                <th>Client &amp; Contact</th>
                <th>Date &amp; Type</th>
                <th>Call Result</th>
                <th>Status</th>
                <th>Issue / Discussion &amp; Action Taken</th>
                <th>Next Follow-up &amp; Remarks</th>
                <th style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredList.map(f => {
                const resInfo = CLIENT_CALL_RESULTS.find(r => r.key === f.callResult) || CLIENT_CALL_RESULTS[0];
                const statusInfo = CLIENT_FOLLOWUP_STATUSES.find(s => s.key === f.status) || CLIENT_FOLLOWUP_STATUSES[0];
                const isOverdue = f.nextFollowUpDate && f.nextFollowUpDate < todayStr && f.status !== 'Resolved';
                
                return `
                  <tr>
                    <td>
                      <div class="cf-client-cell">
                        <div class="cf-client-name">${escapeHtml(f.clientName)}</div>
                        <div class="cf-contact-info">
                          <span>👤 ${escapeHtml(f.contactPerson || 'Contact Person')}</span>
                          ${f.contactNumber ? `
                            <span>·</span>
                            <a class="cf-phone-link" href="tel:${f.contactNumber}" title="Click to call">
                              📞 ${escapeHtml(f.contactNumber)}
                            </a>
                          ` : ''}
                          ${f.contactEmail ? `
                            <span>·</span>
                            <a class="cf-phone-link" href="mailto:${f.contactEmail}" title="Send email" style="color:var(--accent-cyan)">
                              ✉️ ${escapeHtml(f.contactEmail)}
                            </a>
                          ` : ''}
                        </div>
                        ${f.employee ? `
                          <div style="font-size:0.75rem;color:var(--accent-indigo);margin-top:2px">
                            🏷️ Handler: <strong>${escapeHtml(f.employee)}</strong>
                          </div>
                        ` : ''}
                      </div>
                    </td>

                    <td>
                      <div style="font-weight:600;font-size:0.88rem;color:var(--text-heading);margin-bottom:4px">
                        ${fmtDate(f.followUpDate)}
                      </div>
                      <span class="cf-badge cf-type-badge">${escapeHtml(f.followUpType || 'General')}</span>
                    </td>

                    <td>
                      <span class="cf-badge" style="background:${resInfo.bg};color:${resInfo.color};border:1px solid ${resInfo.color}30">
                        ${resInfo.icon} ${f.callResult}
                      </span>
                    </td>

                    <td>
                      <span class="cf-badge" style="background:${statusInfo.bg};color:${statusInfo.color};border:1px solid ${statusInfo.color}30">
                        ${statusInfo.icon} ${f.status}
                      </span>
                    </td>

                    <td>
                      <div class="cf-disc-box">
                        <div>${escapeHtml(f.discussion || '—')}</div>
                        ${f.actionTaken ? `
                          <div class="cf-action-box">
                            <strong>⚡ Action:</strong> ${escapeHtml(f.actionTaken)}
                          </div>
                        ` : ''}
                      </div>
                    </td>

                    <td>
                      <div style="font-size:0.84rem">
                        ${f.nextFollowUpDate ? `
                          <div style="margin-bottom:4px">
                            <span class="cf-next-date-badge ${isOverdue ? 'overdue' : ''}">
                              📅 Next: ${fmtDate(f.nextFollowUpDate)} ${isOverdue ? '(Overdue)' : ''}
                            </span>
                          </div>
                        ` : '<div style="color:var(--text-muted);font-size:0.78rem">No next date set</div>'}
                        ${f.remarks ? `
                          <div style="color:var(--text-secondary);font-size:0.8rem;font-style:italic">
                            "${escapeHtml(f.remarks)}"
                          </div>
                        ` : ''}
                      </div>
                    </td>

                    <td>
                      <div class="cf-actions-cell">
                        <button class="cf-action-btn" onclick="openClientFollowupModal(${f.id})" title="Edit follow-up record">✏️ Edit</button>
                        <button class="cf-action-btn delete" onclick="deleteClientFollowup(${f.id})" title="Delete follow-up record">🗑️</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

function handleCfSearch(val) {
  cfSearchQuery = val;
  refreshCfView();
}

function setCfFilters(type, result, status, time) {
  if (type !== 'all') cfTypeFilter = type;
  if (result !== 'all') cfResultFilter = result;
  if (status !== 'all') cfStatusFilter = status;
  if (time !== 'all') cfTimeFilter = time;
  refreshCfView();
}

function resetCfFilters() {
  cfSearchQuery = '';
  cfTypeFilter = 'all';
  cfResultFilter = 'all';
  cfStatusFilter = 'all';
  cfTimeFilter = 'all';
  cfEmpFilter = 'all';
  refreshCfView();
}

function refreshCfView() {
  const viewEl = document.getElementById('view-client-followup');
  if (viewEl && viewEl.classList.contains('active')) {
    renderClientFollowup(viewEl);
  }
}

// ── MODAL: ADD / EDIT CLIENT FOLLOW-UP ─────────────────
function openClientFollowupModal(followupId = null) {
  const modal = document.getElementById('modal-container');
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('active');

  const isEdit = Boolean(followupId);
  const item = isEdit ? (state.clientFollowups || []).find(f => f.id === followupId) : null;

  const todayStr = new Date().toISOString().split('T')[0];

  const clientName = item ? item.clientName : '';
  const contactPerson = item ? item.contactPerson : '';
  const contactNumber = item ? item.contactNumber : '';
  const contactEmail = item ? (item.contactEmail || '') : '';
  const followUpDate = item ? item.followUpDate : todayStr;
  const followUpType = item ? item.followUpType : 'General Follow-up';
  const callResult = item ? item.callResult : 'Connected';
  const status = item ? item.status : 'Positive';
  const discussion = item ? item.discussion : '';
  const actionTaken = item ? item.actionTaken : '';
  const nextFollowUpDate = item ? (item.nextFollowUpDate || '') : '';
  const remarks = item ? item.remarks : '';
  const employee = item ? item.employee : 'Saimom';

  // Client suggestions datalist from 53 existing client companies and general companies
  const companySuggestions = Array.from(new Set([
    ...(typeof EXISTING_CLIENT_COMPANIES !== 'undefined' ? EXISTING_CLIENT_COMPANIES : []),
    ...getCompanies().map(c => c.name)
  ]));

  modal.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-title">${isEdit ? '✏️ Edit Client Follow-up' : '➕ Record Client Follow-up'}</div>
        <div class="modal-sub">Routine follow-up, feedback, problem solving &amp; payment recovery</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>

    <div class="modal-body" style="max-height:75vh;overflow-y:auto;padding-right:8px">
      <!-- Client & Contact Row -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Client / Company Name <span style="color:var(--accent-rose)">*</span></label>
          <input type="text" id="cf-modal-name" class="input-styled" placeholder="e.g. Bangladesh Edible Oil Ltd." value="${escapeHtml(clientName)}" list="cf-client-list" style="width:100%" autofocus>
          <datalist id="cf-client-list">
            ${companySuggestions.map(n => `<option value="${escapeHtml(n)}"></option>`).join('')}
          </datalist>
        </div>

        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Contact Person &amp; Designation</label>
          <input type="text" id="cf-modal-person" class="input-styled" placeholder="e.g. Mr. Jahangir (Sr. Admin)" value="${escapeHtml(contactPerson)}" style="width:100%">
        </div>
      </div>

      <!-- Phone Number & Email Row -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Contact Phone Number</label>
          <input type="tel" id="cf-modal-number" class="input-styled" placeholder="e.g. 01730-325353" value="${escapeHtml(contactNumber)}" style="width:100%">
        </div>

        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Contact Email Address</label>
          <input type="email" id="cf-modal-email" class="input-styled" placeholder="e.g. contact@beol-bd.com" value="${escapeHtml(contactEmail)}" style="width:100%">
        </div>
      </div>

      <!-- Follow-up Date & Employee & Type -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px">
        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Follow-up Date <span style="color:var(--accent-rose)">*</span></label>
          <input type="date" id="cf-modal-date" class="input-styled" value="${followUpDate}" style="width:100%">
        </div>

        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Employee / Caller</label>
          <input type="text" id="cf-modal-emp" class="input-styled" placeholder="e.g. Saimom" value="${escapeHtml(employee)}" style="width:100%">
        </div>

        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Follow-up Type <span style="color:var(--accent-rose)">*</span></label>
          <select id="cf-modal-type" class="select-styled" style="width:100%">
            ${CLIENT_FOLLOWUP_TYPES.map(t => `<option value="${t}" ${t === followUpType ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Call Result & Status -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Call Result <span style="color:var(--accent-rose)">*</span></label>
          <select id="cf-modal-result" class="select-styled" style="width:100%">
            ${CLIENT_CALL_RESULTS.map(r => `<option value="${r.key}" ${r.key === callResult ? 'selected' : ''}>${r.icon} ${r.key}</option>`).join('')}
          </select>
        </div>

        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Status <span style="color:var(--accent-rose)">*</span></label>
          <select id="cf-modal-status" class="select-styled" style="width:100%">
            ${CLIENT_FOLLOWUP_STATUSES.map(s => `<option value="${s.key}" ${s.key === status ? 'selected' : ''}>${s.icon} ${s.key}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Issue / Discussion Notes -->
      <div class="form-field-group" style="margin-bottom:14px">
        <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Issue / Discussion Summary</label>
        <textarea id="cf-modal-disc" class="input-styled" rows="3" placeholder="Describe the discussion, problems found, client situation, or feedback collected..." style="width:100%;resize:vertical">${escapeHtml(discussion)}</textarea>
      </div>

      <!-- Action Taken & Next Follow-up Date -->
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-bottom:14px">
        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Action Taken / Solution Provided</label>
          <input type="text" id="cf-modal-action" class="input-styled" placeholder="e.g. Sent invoice copy, escalated bug to dev team, or shared video guide" value="${escapeHtml(actionTaken)}" style="width:100%">
        </div>

        <div>
          <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Next Follow-up Date (Optional)</label>
          <input type="date" id="cf-modal-next-date" class="input-styled" value="${nextFollowUpDate}" style="width:100%">
        </div>
      </div>

      <!-- General Remarks -->
      <div class="form-field-group">
        <label style="display:block;margin-bottom:5px;font-size:0.83rem;color:var(--text-muted)">Remarks / Next Steps / Additional Contacts</label>
        <input type="text" id="cf-modal-remarks" class="input-styled" placeholder="e.g. Additional contacts, alternate phone numbers, or special instructions" value="${escapeHtml(remarks)}" style="width:100%">
      </div>
    </div>

    <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center">
      <button class="btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveClientFollowup(${isEdit ? followupId : 'null'})">
        ${isEdit ? '💾 Update Record' : '➕ Save Follow-up'}
      </button>
    </div>
  `;
}

function saveClientFollowup(followupId) {
  const name = document.getElementById('cf-modal-name')?.value.trim();
  const person = document.getElementById('cf-modal-person')?.value.trim() || '';
  const number = document.getElementById('cf-modal-number')?.value.trim() || '';
  const email = document.getElementById('cf-modal-email')?.value.trim() || '';
  const date = document.getElementById('cf-modal-date')?.value || new Date().toISOString().split('T')[0];
  const type = document.getElementById('cf-modal-type')?.value || 'General Follow-up';
  const result = document.getElementById('cf-modal-result')?.value || 'Connected';
  const status = document.getElementById('cf-modal-status')?.value || 'Positive';
  const disc = document.getElementById('cf-modal-disc')?.value.trim() || '';
  const action = document.getElementById('cf-modal-action')?.value.trim() || '';
  const nextDate = document.getElementById('cf-modal-next-date')?.value || '';
  const remarks = document.getElementById('cf-modal-remarks')?.value.trim() || '';
  const emp = document.getElementById('cf-modal-emp')?.value.trim() || 'Saimom';

  if (!name) {
    showToast('Please enter the client / company name', 'warn');
    return;
  }

  if (!state.clientFollowups) state.clientFollowups = [];

  if (followupId) {
    // Edit existing
    const idx = state.clientFollowups.findIndex(f => f.id === followupId);
    if (idx !== -1) {
      state.clientFollowups[idx] = {
        ...state.clientFollowups[idx],
        clientName: name,
        contactPerson: person,
        contactNumber: number,
        contactEmail: email,
        followUpDate: date,
        followUpType: type,
        callResult: result,
        status: status,
        discussion: disc,
        actionTaken: action,
        nextFollowUpDate: nextDate,
        remarks: remarks,
        employee: emp
      };
      showToast(`✅ "${name}" follow-up updated!`);
    }
  } else {
    // New entry
    const newId = Date.now();
    const newRecord = {
      id: newId,
      clientName: name,
      contactPerson: person,
      contactNumber: number,
      contactEmail: email,
      followUpDate: date,
      followUpType: type,
      callResult: result,
      status: status,
      discussion: disc,
      actionTaken: action,
      nextFollowUpDate: nextDate,
      remarks: remarks,
      employee: emp
    };
    state.clientFollowups.unshift(newRecord);
    showToast(`✅ "${name}" follow-up recorded!`);
  }

  saveState();
  closeModal();
  refreshAll();
  // Force-refresh dashboard so KPI metrics update immediately
  const _dashEl = document.getElementById('view-dashboard');
  if (_dashEl) renderView('dashboard', _dashEl);
}

function deleteClientFollowup(followupId) {
  const item = (state.clientFollowups || []).find(f => f.id === followupId);
  if (!item) return;

  if (!confirm(`Are you sure you want to delete the follow-up record for "${item.clientName}"?`)) return;

  state.clientFollowups = state.clientFollowups.filter(f => f.id !== followupId);
  saveState();
  showToast(`🗑️ Follow-up for "${item.clientName}" deleted`, 'warn');
  refreshAll();
  // Force-refresh dashboard so KPI metrics update immediately
  const _dashEl2 = document.getElementById('view-dashboard');
  if (_dashEl2) renderView('dashboard', _dashEl2);
}

function exportClientFollowupsCsv() {
  const list = state.clientFollowups || [];
  if (list.length === 0) {
    showToast('No client follow-up records to export', 'warn');
    return;
  }

  const headers = ['ID', 'Client Name', 'Contact Person', 'Contact Number', 'Contact Email', 'Follow-up Date', 'Follow-up Type', 'Call Result', 'Status', 'Discussion', 'Action Taken', 'Next Follow-up Date', 'Remarks', 'Employee'];
  const rows = list.map(f => [
    f.id,
    `"${(f.clientName||'').replace(/"/g, '""')}"`,
    `"${(f.contactPerson||'').replace(/"/g, '""')}"`,
    `"${(f.contactNumber||'').replace(/"/g, '""')}"`,
    `"${(f.contactEmail||'').replace(/"/g, '""')}"`,
    f.followUpDate || '',
    `"${(f.followUpType||'').replace(/"/g, '""')}"`,
    f.callResult || '',
    f.status || '',
    `"${(f.discussion||'').replace(/"/g, '""')}"`,
    `"${(f.actionTaken||'').replace(/"/g, '""')}"`,
    f.nextFollowUpDate || '',
    `"${(f.remarks||'').replace(/"/g, '""')}"`,
    `"${(f.employee||'').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `existing_client_followups_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📥 Follow-up CSV exported successfully!');
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
      <div style="display:flex;align-items:center;gap:10px">
        ${monthHeaderBadge()}
        <button class="btn-add-company" onclick="openAddCompanyModal()" title="Add new company to pipeline">
          <span style="font-size:1.1rem">➕</span> Add Company
        </button>
      </div>
    </div>
    <div class="pipeline-board">
      ${STAGES.map(s => {
        const companiesHere = getCompanies().filter(c => {
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
                      <button class="pc-delete-btn" onclick="event.stopPropagation();confirmDeleteCompany(${c.id})" title="Remove company">🗑️</button>
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

          if (a.type === 'delete' || a.stage === 'Company Deleted') {
            return `
              <div class="activity-item" style="border-left:3px solid var(--accent-rose)">
                <div class="act-icon" style="background:rgba(244,63,94,0.15);color:var(--accent-rose)">🗑️</div>
                <div class="act-body">
                  <div class="act-title"><strong style="color:var(--accent-rose)">${escapeHtml(a.company)}</strong> — Deleted from Pipeline</div>
                  <div class="act-change" style="color:var(--text-muted);font-size:0.85rem">
                    💬 Reason: <span style="color:var(--accent-amber);font-style:italic">"${escapeHtml(a.reason || 'No remarks provided')}"</span>
                  </div>
                  <div class="act-month-tag">${MONTH_NAMES[(a.month||7)-1]} ${a.year||2026}</div>
                </div>
                <div class="act-time">${date} · ${time}</div>
              </div>`;
          }

          const stageInfo = STAGES.find(s => s.key === a.stage) || STAGES[0];
          return `
            <div class="activity-item">
              <div class="act-icon" style="background:${stageInfo.color}20;color:${stageInfo.color}">${stageInfo.icon}</div>
              <div class="act-body">
                <div class="act-title"><strong>${escapeHtml(a.company)}</strong> — ${a.stage}</div>
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
    <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;gap:8px">
        <button class="btn-ghost" onclick="editNote(${companyId}, -1)">📝 General Note</button>
        <button class="btn-ghost" style="color:var(--accent-rose);border-color:rgba(244,63,94,0.3)" onclick="openDeleteCompanyModal(${companyId})">🗑️ Delete Company</button>
      </div>
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
