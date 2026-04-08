/**
 * myconsult CFO Dashboard — Interactive Charts & UI
 * All charts built with SVG (zero external dependencies)
 */

"use strict";

/* ================================================================
   DATA
   ================================================================ */

const DATA = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ytdMonths: ["Jan", "Feb", "Mar", "Apr"],

  // Monthly revenue (thousands)
  revenue:  [680, 710, 750, 0],
  // Monthly expenses (thousands)
  expenses: [510, 530, 565, 0],
  // Net profit = revenue - expenses
  get profit() { return this.revenue.map((r, i) => r - this.expenses[i]); },

  // Budget vs Actual (Jan–Apr, May–Dec forecast)
  budgetRevenue:  [670, 690, 730, 710, 720, 750, 780, 800, 820, 790, 810, 840],
  actualRevenue:  [680, 710, 750, null, null, null, null, null, null, null, null, null],
  forecastRevenue:[null, null, null, 740, 755, 762, 790, 810, 835, 805, 820, 855],

  // Cash on hand monthly (thousands)
  cashHistory: [3050, 3120, 3200, 3247],

  // AR history
  arHistory: [310, 355, 390, 428],

  // Burn rate history
  burnHistory: [560, 545, 535, 524],

  // Service breakdown
  services: [
    { label: "Strategy Consulting", pct: 45, color: "#3b82f6" },
    { label: "Technology Services", pct: 30, color: "#8b5cf6" },
    { label: "Operations Advisory", pct: 15, color: "#22c55e" },
    { label: "Finance & Risk",      pct: 10, color: "#f59e0b" },
  ],
};

/* ================================================================
   UTILS
   ================================================================ */

function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
  return el;
}

function lerp(a, b, t) { return a + (b - a) * t; }

function scaleValue(val, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

function formatK(val) {
  if (val >= 1000) return `$${(val / 1000).toFixed(2)}M`;
  return `$${val}K`;
}

/* ================================================================
   SPARKLINES
   ================================================================ */

function renderSparkline(svgId, data, color, fill) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const W = 100, H = 32, P = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);

  const pts = data.map((v, i) => {
    const x = P + (i / (data.length - 1)) * (W - P * 2);
    const y = H - P - scaleValue(v, min, max, 0, H - P * 2);
    return [x, y];
  });

  const pathD = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  if (fill) {
    const area = `${pathD} L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;
    const fillPath = svgEl("path", {
      d: area,
      fill: color,
      opacity: "0.12",
    });
    svg.appendChild(fillPath);
  }

  const line = svgEl("path", {
    d: pathD,
    fill: "none",
    stroke: color,
    "stroke-width": "1.5",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  });
  svg.appendChild(line);

  // Terminal dot
  const [lx, ly] = pts[pts.length - 1];
  const dot = svgEl("circle", { cx: lx, cy: ly, r: "2.5", fill: color });
  svg.appendChild(dot);
}

/* ================================================================
   REVENUE VS EXPENSES LINE CHART
   ================================================================ */

function renderTrendChart() {
  const svg = document.getElementById("chart-trend");
  if (!svg) return;

  const W = 620, H = 240;
  const PAD = { top: 16, right: 24, bottom: 36, left: 56 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  const months = DATA.ytdMonths;
  const rev = DATA.revenue.slice(0, months.length);
  const exp = DATA.expenses.slice(0, months.length);
  const pro = DATA.profit.slice(0, months.length);

  const allVals = [...rev, ...exp, ...pro].filter(v => v !== null && v !== 0 || v === 0);
  const minY = 0;
  const maxY = Math.max(...allVals) * 1.15;

  function ptX(i) { return PAD.left + (i / (months.length - 1)) * cW; }
  function ptY(v) { return PAD.top + cH - scaleValue(v, minY, maxY, 0, cH); }

  // Grid lines
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const v = minY + (i / yTicks) * maxY;
    const y = ptY(v);
    const line = svgEl("line", {
      x1: PAD.left, y1: y, x2: W - PAD.right, y2: y,
      stroke: "var(--color-border)", "stroke-width": "1",
      "stroke-dasharray": i === 0 ? "none" : "4,4"
    });
    svg.appendChild(line);

    const label = svgEl("text", {
      x: PAD.left - 8, y: y + 4,
      "text-anchor": "end",
      "font-size": "10",
      fill: "var(--color-text-3)",
    });
    label.textContent = `$${Math.round(v)}K`;
    svg.appendChild(label);
  }

  // Draw filled area under revenue
  const revPts = rev.map((v, i) => [ptX(i), ptY(v)]);
  const areaD = revPts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
    + ` L${revPts[revPts.length - 1][0].toFixed(1)},${ptY(0)} L${revPts[0][0].toFixed(1)},${ptY(0)} Z`;

  const areaFill = svgEl("path", { d: areaD, fill: "var(--chart-1)", opacity: "0.07" });
  svg.appendChild(areaFill);

  // Draw lines
  function drawLine(data, color, dashed) {
    const pts = data.map((v, i) => [ptX(i), ptY(v)]);
    const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const attrs = {
      d,
      fill: "none",
      stroke: color,
      "stroke-width": "2.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    };
    if (dashed) attrs["stroke-dasharray"] = "6,3";
    svg.appendChild(svgEl("path", attrs));
    return pts;
  }

  const revPoints = drawLine(rev, "var(--chart-1)");
  const expPoints = drawLine(exp, "var(--chart-2)");
  const proPoints = drawLine(pro, "var(--chart-3)");

  // X-axis labels + interactive points
  months.forEach((m, i) => {
    const x = ptX(i);
    const label = svgEl("text", {
      x, y: H - PAD.bottom + 16,
      "text-anchor": "middle",
      "font-size": "11",
      fill: "var(--color-text-2)",
    });
    label.textContent = m;
    svg.appendChild(label);

    // Invisible hit area for tooltip
    const hitArea = svgEl("rect", {
      x: x - 20, y: PAD.top,
      width: 40, height: cH,
      fill: "transparent",
      style: "cursor: crosshair",
    });

    const tooltip = document.getElementById("tooltip");
    hitArea.addEventListener("mouseenter", (e) => {
      showTooltip(
        e,
        `<strong>${m} 2026</strong><br>
         Revenue: $${rev[i]}K<br>
         Expenses: $${exp[i]}K<br>
         Net Profit: $${pro[i]}K`
      );
      // vertical guide line
      const guide = svgEl("line", {
        id: "chart-guide",
        x1: x, y1: PAD.top,
        x2: x, y2: H - PAD.bottom,
        stroke: "var(--color-border)",
        "stroke-width": "1",
        "stroke-dasharray": "4,2",
      });
      svg.insertBefore(guide, svg.firstChild.nextSibling);
    });
    hitArea.addEventListener("mousemove", moveTooltip);
    hitArea.addEventListener("mouseleave", () => {
      hideTooltip();
      const guide = document.getElementById("chart-guide");
      if (guide) guide.remove();
    });
    svg.appendChild(hitArea);

    // Dots
    [[revPoints, "var(--chart-1)"], [expPoints, "var(--chart-2)"], [proPoints, "var(--chart-3)"]].forEach(([pts, color]) => {
      const dot = svgEl("circle", {
        cx: pts[i][0], cy: pts[i][1],
        r: "4", fill: color,
        stroke: "var(--color-surface)", "stroke-width": "2",
      });
      svg.appendChild(dot);
    });
  });
}

/* ================================================================
   DONUT CHART
   ================================================================ */

function renderDonutChart() {
  const svg = document.getElementById("chart-donut");
  const legendEl = $(".donut-legend");
  if (!svg || !legendEl) return;

  const cx = 110, cy = 110, outerR = 80, innerR = 52;
  let startAngle = -Math.PI / 2;

  const tooltip = document.getElementById("tooltip");

  DATA.services.forEach(({ label, pct, color }, idx) => {
    const angle = (pct / 100) * 2 * Math.PI;
    const endAngle = startAngle + angle;

    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const d = [
      `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      `L ${ix1.toFixed(2)} ${iy1.toFixed(2)}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)}`,
      "Z",
    ].join(" ");

    const path = svgEl("path", {
      d, fill: color, opacity: "0.9",
      style: "cursor: pointer; transition: opacity 0.15s ease;",
    });

    path.addEventListener("mouseenter", (e) => {
      path.setAttribute("opacity", "1");
      const revenue = Math.round(2140 * pct / 100);
      showTooltip(e, `<strong>${label}</strong><br>${pct}% — $${revenue}K`);
    });
    path.addEventListener("mousemove", moveTooltip);
    path.addEventListener("mouseleave", () => {
      path.setAttribute("opacity", "0.9");
      hideTooltip();
    });

    svg.appendChild(path);
    startAngle = endAngle;

    // Legend item
    const item = document.createElement("div");
    item.className = "donut-legend-item";
    item.innerHTML = `
      <div class="donut-legend-left">
        <div class="donut-legend-dot" style="background:${color}"></div>
        <span class="donut-legend-label">${label}</span>
      </div>
      <span class="donut-legend-pct">${pct}%</span>
    `;
    legendEl.appendChild(item);
  });

  // Center label
  const cLabel = svgEl("text", {
    x: cx, y: cy - 6,
    "text-anchor": "middle",
    "font-size": "20",
    "font-weight": "800",
    fill: "var(--color-text)",
  });
  cLabel.textContent = "$2.14M";
  svg.appendChild(cLabel);

  const cSub = svgEl("text", {
    x: cx, y: cy + 14,
    "text-anchor": "middle",
    "font-size": "10",
    fill: "var(--color-text-2)",
  });
  cSub.textContent = "Total Revenue";
  svg.appendChild(cSub);
}

/* ================================================================
   BUDGET VS ACTUAL BAR CHART
   ================================================================ */

function renderBudgetChart() {
  const svg = document.getElementById("chart-budget");
  if (!svg) return;

  const W = 880, H = 200;
  const PAD = { top: 16, right: 16, bottom: 32, left: 56 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  const months = DATA.months;
  const budget = DATA.budgetRevenue;
  const actual = DATA.actualRevenue;
  const forecast = DATA.forecastRevenue;

  const maxY = Math.max(...budget, ...forecast.filter(Boolean), ...actual.filter(Boolean)) * 1.15;
  const minY = 0;

  function scaleH(v) { return scaleValue(v, minY, maxY, 0, cH); }
  function barY(v) { return PAD.top + cH - scaleH(v); }

  const slotW = cW / months.length;
  const barW = slotW * 0.28;
  const gap = barW * 0.25;

  // Grid
  for (let i = 0; i <= 4; i++) {
    const v = (i / 4) * maxY;
    const y = barY(v);
    svg.appendChild(svgEl("line", {
      x1: PAD.left, y1: y, x2: W - PAD.right, y2: y,
      stroke: "var(--color-border)", "stroke-width": "1",
      "stroke-dasharray": i === 0 ? "none" : "3,3"
    }));
    const label = svgEl("text", {
      x: PAD.left - 8, y: y + 4,
      "text-anchor": "end", "font-size": "10",
      fill: "var(--color-text-3)",
    });
    label.textContent = `$${Math.round(v)}K`;
    svg.appendChild(label);
  }

  months.forEach((m, i) => {
    const centerX = PAD.left + i * slotW + slotW / 2;

    // Budget bar (grey, slightly behind)
    const bH = scaleH(budget[i]);
    const budgetBar = svgEl("rect", {
      x: centerX - barW - gap / 2,
      y: barY(budget[i]),
      width: barW, height: bH,
      rx: 3,
      fill: "var(--color-border)",
    });
    svg.appendChild(budgetBar);

    // Actual or forecast bar
    const isActual = actual[i] !== null;
    const val = isActual ? actual[i] : forecast[i];
    const barColor = isActual ? "var(--chart-1)" : "var(--amber-400)";

    if (val !== null) {
      const vH = scaleH(val);
      const bar = svgEl("rect", {
        x: centerX + gap / 2,
        y: barY(val),
        width: barW, height: vH,
        rx: 3,
        fill: barColor,
        opacity: isActual ? "0.85" : "0.6",
        style: "cursor: pointer; transition: opacity 0.15s ease;",
      });

      bar.addEventListener("mouseenter", (e) => {
        bar.setAttribute("opacity", "1");
        const label = isActual ? "Actual" : "Forecast";
        const variance = val - budget[i];
        const sign = variance >= 0 ? "+" : "";
        showTooltip(e,
          `<strong>${m} 2026</strong><br>
           Budget: $${budget[i]}K<br>
           ${label}: $${val}K<br>
           Variance: ${sign}$${variance}K`
        );
      });
      bar.addEventListener("mousemove", moveTooltip);
      bar.addEventListener("mouseleave", () => {
        bar.setAttribute("opacity", isActual ? "0.85" : "0.6");
        hideTooltip();
      });

      svg.appendChild(bar);
    }

    // X-axis label
    const xLabel = svgEl("text", {
      x: centerX, y: H - PAD.bottom + 14,
      "text-anchor": "middle", "font-size": "10",
      fill: "var(--color-text-2)",
    });
    xLabel.textContent = m;
    svg.appendChild(xLabel);

    // "Now" indicator
    if (i === 3) {
      const nowLine = svgEl("line", {
        x1: centerX + barW * 0.5 + gap,
        y1: PAD.top,
        x2: centerX + barW * 0.5 + gap,
        y2: H - PAD.bottom,
        stroke: "var(--color-primary)",
        "stroke-width": "1.5",
        "stroke-dasharray": "4,3",
        opacity: "0.5",
      });
      svg.appendChild(nowLine);
      const nowLabel = svgEl("text", {
        x: centerX + barW * 0.5 + gap + 4,
        y: PAD.top + 10,
        "font-size": "9",
        fill: "var(--color-primary)",
        "font-weight": "600",
      });
      nowLabel.textContent = "TODAY";
      svg.appendChild(nowLabel);
    }
  });
}

/* ================================================================
   TOOLTIP
   ================================================================ */

const tooltip = document.getElementById("tooltip");

function showTooltip(e, html) {
  if (!tooltip) return;
  tooltip.innerHTML = html;
  tooltip.setAttribute("aria-hidden", "false");
  moveTooltip(e);
}

function moveTooltip(e) {
  if (!tooltip) return;
  const x = e.clientX + 14;
  const y = e.clientY - 10;
  const ttW = 200;
  const left = x + ttW > window.innerWidth ? e.clientX - ttW - 10 : x;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${y}px`;
}

function hideTooltip() {
  if (!tooltip) return;
  tooltip.setAttribute("aria-hidden", "true");
  tooltip.innerHTML = "";
}

/* ================================================================
   DARK MODE TOGGLE
   ================================================================ */

function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  const html = document.documentElement;

  const stored = localStorage.getItem("mc-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(stored);

  btn.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("mc-theme", next);
  });

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }
}

/* ================================================================
   PERIOD SELECTOR
   ================================================================ */

function initPeriodSelector() {
  const btns = $$(".period-btn");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => {
        b.classList.remove("period-btn--active");
        b.removeAttribute("aria-pressed");
      });
      btn.classList.add("period-btn--active");
      btn.setAttribute("aria-pressed", "true");
    });
  });
}

/* ================================================================
   NAV LINKS
   ================================================================ */

function initNav() {
  const links = $$(".nav-link");
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      links.forEach(l => {
        l.classList.remove("nav-link--active");
        l.removeAttribute("aria-current");
      });
      link.classList.add("nav-link--active");
      link.setAttribute("aria-current", "page");
    });
  });
}

/* ================================================================
   INIT — run all renderers after DOM ready
   ================================================================ */

function init() {
  // Sparklines
  renderSparkline("sparkline-revenue",  [590, 620, 645, 680, 710, 750], "#3b82f6", true);
  renderSparkline("sparkline-profit",   [130, 145, 148, 160, 174, 185], "#22c55e", true);
  renderSparkline("sparkline-expenses", [540, 520, 530, 520, 510, 530], "#ef4444", false);
  renderSparkline("sparkline-cash",     [2900, 3000, 3050, 3120, 3200, 3247], "#8b5cf6", true);
  renderSparkline("sparkline-ar",       [270, 295, 310, 355, 390, 428], "#f59e0b", false);
  renderSparkline("sparkline-burn",     [560, 555, 548, 545, 535, 524], "#6b7280", false);

  // Charts
  renderTrendChart();
  renderDonutChart();
  renderBudgetChart();

  // UI
  initThemeToggle();
  initPeriodSelector();
  initNav();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
