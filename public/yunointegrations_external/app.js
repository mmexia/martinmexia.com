// Yuno Integrations Catalog — tiny SPA
const COUNTRY_NAMES = {
  AR: "Argentina", AU: "Australia", AT: "Austria", BE: "Belgium", BO: "Bolivia", BR: "Brazil",
  BG: "Bulgaria", CA: "Canada", CL: "Chile", CN: "China", CO: "Colombia", CR: "Costa Rica",
  CY: "Cyprus", CZ: "Czechia", DK: "Denmark", DO: "Dominican Rep.", EC: "Ecuador", EG: "Egypt",
  SV: "El Salvador", EE: "Estonia", FI: "Finland", FR: "France", DE: "Germany", GH: "Ghana",
  GR: "Greece", GT: "Guatemala", HN: "Honduras", HK: "Hong Kong", HU: "Hungary", IN: "India",
  ID: "Indonesia", IE: "Ireland", IT: "Italy", JP: "Japan", KE: "Kenya", LV: "Latvia",
  LT: "Lithuania", LU: "Luxembourg", MY: "Malaysia", MT: "Malta", MX: "Mexico", NL: "Netherlands",
  NZ: "New Zealand", NI: "Nicaragua", NG: "Nigeria", NO: "Norway", PA: "Panama", PY: "Paraguay",
  PE: "Peru", PH: "Philippines", PL: "Poland", PT: "Portugal", PR: "Puerto Rico", RO: "Romania",
  RU: "Russia", SA: "Saudi Arabia", SG: "Singapore", SK: "Slovakia", SI: "Slovenia", SL: "Slovenia",
  ZA: "South Africa", KR: "South Korea", ES: "Spain", SE: "Sweden", CH: "Switzerland", TW: "Taiwan",
  TH: "Thailand", TR: "Türkiye", GB: "United Kingdom", US: "United States", UY: "Uruguay",
  VE: "Venezuela", VN: "Vietnam", GI: "Gibraltar", LI: "Liechtenstein", PH: "Philippines", AE: "UAE",
  IQ: "Iraq", IL: "Israel", JO: "Jordan", KW: "Kuwait", LB: "Lebanon", OM: "Oman", QA: "Qatar",
  BD: "Bangladesh", PK: "Pakistan", LK: "Sri Lanka", CI: "Côte d'Ivoire", MA: "Morocco",
  TN: "Tunisia", DZ: "Algeria", SN: "Senegal", TZ: "Tanzania", UG: "Uganda", RW: "Rwanda",
  BY: "Belarus", UA: "Ukraine", IS: "Iceland", AL: "Albania", RS: "Serbia", HR: "Croatia",
  BA: "Bosnia", MK: "N. Macedonia", MD: "Moldova", AM: "Armenia", GE: "Georgia", AZ: "Azerbaijan",
  KZ: "Kazakhstan", UZ: "Uzbekistan",
};

const OPS_ORDER = ["purchase", "capture", "refund", "cancel", "reverse", "verify", "complete",
                   "enrollment", "unenrollment", "get", "transfer", "payout", "screening", "chargeback", "dispute"];

let DATA = null;
let METHODS_BY_ID = {};
// cats starts empty but is populated with every known category in buildFilters()
// so the default is "all selected = show all". Clearing it all = show none.
// showPromised defaults to false so Zuora-promised entries are hidden until
// the user explicitly opts in.
let state = { q: "", country: "", method: "", ops: new Set(), cats: new Set(), showPromised: true };

const PW = "YunoRocks";

function initGate() {
  const gate = document.getElementById("pw-gate");
  if (!gate) return Promise.resolve();
  if (sessionStorage.getItem("yint-unlocked") === "1") {
    gate.remove();
    return Promise.resolve();
  }
  return new Promise(resolve => {
    document.getElementById("pw-form").addEventListener("submit", e => {
      e.preventDefault();
      const input = document.getElementById("pw-input");
      const err = document.getElementById("pw-err");
      if (input.value === PW) {
        sessionStorage.setItem("yint-unlocked", "1");
        gate.remove();
        resolve();
      } else {
        err.hidden = false;
        input.value = "";
        input.focus();
      }
    });
  });
}

initGate().then(() => {
  fetch("/yunointegrations_external/data/catalog.ui.json")
    .then(r => r.json())
    .then(d => { DATA = d; init(); })
    .catch(e => {
      document.getElementById("grid").innerHTML = `<p style="color:#ef4444">Failed to load catalog: ${e}. Run <code>python3 extract.py</code> first.</p>`;
    });
});

function init() {
  METHODS_BY_ID = Object.fromEntries(DATA.payment_methods.map(m => [m.id, m]));
  buildFilters();
  bindEvents();
  initTheme();
  renderCounters();
  render();
  document.getElementById("gen").textContent = new Date().toISOString().slice(0, 10);
}

function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const apply = () => {
    const t = document.documentElement.getAttribute("data-theme");
    btn.textContent = t === "dark" ? "🌙" : "☀️";
  };
  apply();
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    apply();
  });
}

function renderCounters() {
  const countries = new Set();
  let opsCount = 0;
  DATA.providers.forEach(p => {
    (p.countries || []).forEach(c => countries.add(c));
    (p.methods || []).forEach(m => (m.operations || []).forEach(() => opsCount++));
  });
  document.getElementById("counters").innerHTML = `
    <span><b>${DATA.providers.length}</b>Providers</span>
    <span><b>${DATA.payment_methods.length}</b>Payment methods</span>
    <span><b>${countries.size}</b>Countries</span>
    <span><b>${opsCount.toLocaleString()}</b>Operations</span>
  `;
}

function buildFilters() {
  // Countries (union across providers)
  const countries = new Set();
  DATA.providers.forEach(p => (p.countries || []).forEach(c => countries.add(c)));
  const select = document.getElementById("country");
  [...countries].sort().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = `${c} — ${COUNTRY_NAMES[c] || c}`;
    select.appendChild(opt);
  });

  // Payment methods (only those with at least one provider). Pin the common
  // ones at the top so Card / Apple Pay / Google Pay / PIX / PayPal / Boleto
  // are easy to find; rest follow alphabetically.
  const methodsWithProvider = new Set();
  DATA.providers.forEach(p => (p.methods || []).forEach(m => methodsWithProvider.add(m.id)));
  const available = DATA.payment_methods.filter(m => methodsWithProvider.has(m.id));
  const COMMON = ["CARD", "APPLE_PAY", "GOOGLE_PAY", "PIX", "PAYPAL", "BOLETO", "ACH", "SEPA"];
  const byId = Object.fromEntries(available.map(m => [m.id, m]));
  const pinned = COMMON.filter(id => byId[id]).map(id => byId[id]);
  const rest = available
    .filter(m => !COMMON.includes(m.id))
    .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));
  const msel = document.getElementById("method");
  const addOption = (m, parent) => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = `${m.name} ${m.category ? "— " + m.category : ""}`;
    parent.appendChild(opt);
  };
  if (pinned.length) {
    const g = document.createElement("optgroup");
    g.label = "Common";
    pinned.forEach(m => addOption(m, g));
    msel.appendChild(g);
  }
  if (rest.length) {
    const g = document.createElement("optgroup");
    g.label = "All methods";
    rest.forEach(m => addOption(m, g));
    msel.appendChild(g);
  }

  // Provider categories — explicit order: Processor, Payment Method, Fraud Solution, 3d secure, then anything else alphabetically
  const CAT_ORDER = ["Processor", "Payment Method", "Fraud Solution", "3d secure"];
  const cats = new Set();
  DATA.providers.forEach(p => p.category && cats.add(p.category));
  const ordered = [
    ...CAT_ORDER.filter(c => cats.has(c)),
    ...[...cats].filter(c => !CAT_ORDER.includes(c)).sort(),
  ];
  // Seed the filter state with every category selected — the grid starts
  // "all on". Clearing them all produces an empty grid (distinct from the
  // legacy "empty set means no filter" semantics).
  ordered.forEach(c => state.cats.add(c));
  const catsEl = document.getElementById("cats");
  ordered.forEach(c => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${c}" checked /> ${c}`;
    catsEl.appendChild(label);
  });
}

function bindEvents() {
  document.getElementById("q").addEventListener("input", e => { state.q = e.target.value.toLowerCase(); render(); });
  document.getElementById("country").addEventListener("change", e => { state.country = e.target.value; render(); });
  document.getElementById("method").addEventListener("change", e => { state.method = e.target.value; render(); });
  document.getElementById("ops").addEventListener("change", e => {
    state.ops.clear();
    document.querySelectorAll("#ops input:checked").forEach(i => state.ops.add(i.value));
    render();
  });
  document.getElementById("cats").addEventListener("change", e => {
    state.cats.clear();
    document.querySelectorAll("#cats input:checked").forEach(i => state.cats.add(i.value));
    render();
  });
  const _spt = document.getElementById("show-promised");
  if (_spt) _spt.addEventListener("change", e => {
    state.showPromised = e.target.checked;
    render();
  });
  document.getElementById("clear").addEventListener("click", () => {
    state = { q: "", country: "", method: "", ops: new Set(), cats: new Set(), showPromised: true };
    document.getElementById("q").value = "";
    document.getElementById("country").value = "";
    document.getElementById("method").value = "";
    // Reset operations: all unchecked
    document.querySelectorAll("#ops input").forEach(i => (i.checked = false));
    // Reset categories: all checked (+ rehydrate state)
    document.querySelectorAll("#cats input").forEach(i => {
      i.checked = true;
      state.cats.add(i.value);
    });
    const pt = document.getElementById("show-promised");
    if (pt) pt.checked = false;
    render();
  });
  document.getElementById("close-drawer").addEventListener("click", closeDrawer);
  document.getElementById("drawer").addEventListener("click", e => { if (e.target.id === "drawer") closeDrawer(); });
}

function providerMatches(p) {
  // Zuono-promised filter: when OFF, hide fully-promised providers and require
  // a non-promised match for any selected payment method.
  if (!state.showPromised) {
    if (p._promised) return false;
    if (state.method) {
      const m = (p.methods || []).find(x => x.id === state.method);
      if (m && m._promised) return false;
    }
  }
  if (state.q) {
    const hay = (p.name + " " + p.id + " " + (p.description || "")).toLowerCase();
    if (!hay.includes(state.q)) return false;
  }
  if (state.country && !(p.countries || []).includes(state.country)) return false;
  if (state.method && !(p.methods || []).some(m => m.id === state.method)) return false;
  if (state.ops.size) {
    const allOps = new Set();
    (p.methods || []).forEach(m => (m.operations || []).forEach(o => allOps.add(o)));
    for (const op of state.ops) if (!allOps.has(op)) return false;
  }
  if (!state.cats.has(p.category)) return false;
  return true;
}

function render() {
  const matched = DATA.providers.filter(providerMatches);
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  // Method-first view: when a payment method is selected, lead with a banner
  // then render each provider in a processor-focused variant.
  if (state.method) {
    const meta = METHODS_BY_ID[state.method];
    if (meta) grid.appendChild(methodBanner(meta, matched.length));
  }
  matched.forEach(p => grid.appendChild(card(p)));
  document.getElementById("stats").textContent =
    `${matched.length} provider${matched.length === 1 ? "" : "s"} · ${DATA.payment_methods.length} payment methods`;
}

function methodBanner(method, count) {
  const el = document.createElement("div");
  el.className = "method-banner";
  const logo = method.icon
    ? `<img src="${method.icon}" alt="${escape(method.name)}" onerror="this.style.visibility='hidden'"/>`
    : "";
  const cat = method.category ? `<span class="pm-cat">${escape(method.category)}</span>` : "";
  el.innerHTML = `
    <div class="method-banner-head">
      ${logo}
      <div class="method-banner-title">
        <h3>${escape(method.name)}</h3>
        <div class="method-banner-sub">
          <code>${escape(method.id)}</code>
          ${cat}
        </div>
      </div>
    </div>
    <p class="method-banner-count">${count} processor${count === 1 ? "" : "s"} supporting this payment method</p>
  `;
  return el;
}

function card(p) {
  const el = document.createElement("div");
  el.className = "card" + (p._promised ? " promised" : "");
  const logo = p.icon ? `<img class="logo" src="${p.icon}" alt="${p.name}" loading="lazy" onerror="this.style.visibility='hidden'"/>` : `<div class="logo" style="background:#1b2027"></div>`;
  const promisedBadge = p._promised ? `<span class="promised-badge" title="Zuora-promised, not yet built">Zuora promised</span>` : "";

  // When filtering by a payment method, show that method's operations for this provider
  // instead of the generic payment-method preview.
  let featureRow = "";
  if (state.method) {
    const m = (p.methods || []).find(x => x.id === state.method);
    const ops = (m?.operations || []).slice().sort((a, b) => OPS_ORDER.indexOf(a) - OPS_ORDER.indexOf(b));
    featureRow = ops.length
      ? `<div class="ops">${ops.map(o => `<span class="op ${o}">${o}</span>`).join("")}</div>`
      : `<div class="ops"><span class="op none">operations not detected</span></div>`;
  } else {
    const preview = (p.methods || []).slice(0, 6).map(m => {
      const name = METHODS_BY_ID[m.id]?.name || m.id;
      return `<span class="pm-badge">${escape(name)}</span>`;
    }).join("");
    const more = (p.methods || []).length > 6 ? `<span class="pm-badge">+${p.methods.length - 6}</span>` : "";
    featureRow = `<div class="pm-preview">${preview}${more}</div>`;
  }

  el.innerHTML = `
    ${promisedBadge}
    <div class="head">
      ${logo}
      <div>
        <div class="title">${escape(p.name)}</div>
        <div class="cat">${escape(p.category || "")}</div>
      </div>
    </div>
    ${featureRow}
  `;
  el.addEventListener("click", () => openDrawer(p));
  return el;
}

function openDrawer(p) {
  const body = document.getElementById("drawer-body");
  const logo = p.icon ? `<img src="${p.icon}" onerror="this.style.visibility='hidden'"/>` : "";
  const countriesHtml = (p.countries || []).length
    ? `<div class="country-list">${(p.countries || []).sort().map(c => `<span title="${COUNTRY_NAMES[c] || c}">${c}</span>`).join("")}</div>`
    : `<p class="sub">No country data available.</p>`;
  const currenciesHtml = (p.currencies || []).length
    ? `<div class="cur-list">${[...new Set(p.currencies)].sort().map(c => `<span>${c}</span>`).join("")}</div>`
    : `<p class="sub">No currency data.</p>`;
  const pmHtml = (p.methods || []).length ? (p.methods || []).map(m => {
    const meta = METHODS_BY_ID[m.id] || { name: m.id, category: "" };
    const ops = (m.operations || []).slice().sort((a, b) => OPS_ORDER.indexOf(a) - OPS_ORDER.indexOf(b));
    const opsHtml = ops.length
      ? `<div class="ops">${ops.map(o => `<span class="op ${o}">${o}</span>`).join("")}</div>`
      : `<div class="ops"><span class="op none">operations not detected</span></div>`;
    const flow = m.flow ? `<span class="pm-cat">flow: ${m.flow}</span>` : "";
    const promisedPill = m._promised ? `<span class="pm-cat promised-pill" title="Zuora-promised">Zuora promised</span>` : "";
    return `
      <div class="pm-row${m._promised ? " promised" : ""}">
        <div class="pm-head">
          <div>
            <div class="pm-name">${escape(meta.name)}</div>
            <div class="pm-id">${escape(meta.id)}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end">
            ${meta.category ? `<span class="pm-cat">${meta.category}</span>` : ""}
            ${flow}
            ${promisedPill}
          </div>
        </div>
        ${opsHtml}
      </div>
    `;
  }).join("") : `<p class="sub">No payment methods recorded.</p>`;

  body.innerHTML = `
    <h2>${logo}<span>${escape(p.name)}</span></h2>
    <div class="sub">${escape(p.category || "")} · ID <code>${escape(p.id)}</code>${p.website ? ` · <a href="${p.website}" target="_blank" rel="noopener">website</a>` : ""}</div>
    ${p.description ? `<p>${escape(p.description)}</p>` : ""}
    <h3>Countries (${(p.countries || []).length})</h3>
    ${countriesHtml}
    <h3>Currencies</h3>
    ${currenciesHtml}
    <h3>Payment methods (${(p.methods || []).length})</h3>
    ${pmHtml}
  `;
  document.getElementById("drawer").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  document.getElementById("drawer").hidden = true;
  document.body.style.overflow = "";
}

function escape(s) { return (s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
