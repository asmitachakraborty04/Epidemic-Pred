// Dashboard.jsx
// Props from App.jsx:
//   region  — the region/continent typed by user (e.g. "South Asia", "Europe")
//   risk    — "High" | "Medium" | "Low"
//   predictionTarget — "nextdaycases" | "risks"
//   predictedCases — numeric predicted cases when available
//   hotspotLevel — 0 | 1 | 2
//   onBack  — optional callback to return to input page

import { useState, useEffect } from "react";

// ─── CSS ─────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .db-page {
    min-height: 100vh;
    width: 100%;
    background: #0b0f1a;
    padding: 40px 20px 60px;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow-x: hidden;
  }
  .db-page::before {
    content: '';
    position: fixed;
    top: -160px; left: -160px;
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .db-page::after {
    content: '';
    position: fixed;
    bottom: -180px; right: -140px;
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .db-inner {
    max-width: 1040px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* Back */
  .db-back {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #4b5675; font-size: 11.5px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase;
    padding: 7px 18px; border-radius: 20px;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: all 0.15s; margin-bottom: 32px;
  }
  .db-back:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #818cf8; }

  /* Header */
  .db-header { text-align: center; margin-bottom: 36px; }
  .db-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(99,102,241,0.15); color: #818cf8;
    font-size: 10.5px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; padding: 5px 14px;
    border-radius: 20px; border: 1px solid rgba(99,102,241,0.25);
    margin-bottom: 14px;
  }
  .db-tag-dot {
    width: 6px; height: 6px; background: #818cf8; border-radius: 50%;
    animation: db-pulse 2s ease-in-out infinite;
  }
  @keyframes db-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.4; transform:scale(0.75); }
  }
  .db-title { font-size: 30px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 8px; }
  .db-title span { color: #818cf8; }
  .db-subtitle { font-size: 13px; color: #4b5675; font-weight: 400; }

  /* Summary */
  .db-summary { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
  .db-stat {
    flex: 1 1 110px;
    background: #131929; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 16px 18px;
    display: flex; flex-direction: column; gap: 4px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.35);
  }
  .db-stat-value { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }
  .db-stat-label { font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #4b5675; margin-top: 2px; }

  /* Chart toggle */
  .db-chart-toggle { display: flex; gap: 8px; margin-bottom: 20px; }
  .db-toggle-btn {
    padding: 7px 18px; border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent; color: #4b5675;
    font-size: 11.5px; font-weight: 600; letter-spacing: 1px;
    text-transform: uppercase; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .db-toggle-btn:hover { border-color: rgba(99,102,241,0.35); color: #818cf8; background: rgba(99,102,241,0.08); }
  .db-toggle-btn.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.35); color: #818cf8; }

  /* Chart container */
  .db-chart-wrap {
    background: #131929; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 28px 24px; margin-bottom: 28px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.4);
    position: relative;
  }
  .db-chart-wrap::before {
    content: '';
    position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }
  .db-chart-title { font-size: 13px; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 20px; }

  /* Bar chart */
  .bar-chart { display: flex; flex-direction: column; gap: 10px; }
  .bar-row { display: flex; align-items: center; gap: 12px; }
  .bar-label { width: 130px; font-size: 12px; font-weight: 500; color: #94a3b8; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; }
  .bar-track { flex: 1; background: rgba(255,255,255,0.05); border-radius: 99px; height: 22px; overflow: hidden; position: relative; }
  .bar-fill {
    height: 100%; border-radius: 99px;
    display: flex; align-items: center; padding-left: 10px;
    font-size: 11px; font-weight: 700; color: rgba(0,0,0,0.7);
    transition: width 1s cubic-bezier(0.22,1,0.36,1);
    min-width: 36px;
  }
  .bar-pct { width: 38px; font-size: 12px; font-weight: 700; flex-shrink: 0; }

  /* Pie chart (SVG-based) */
  .pie-wrap { display: flex; align-items: center; gap: 36px; flex-wrap: wrap; justify-content: center; }
  .pie-svg-wrap { flex-shrink: 0; }
  .pie-legend { display: flex; flex-direction: column; gap: 10px; min-width: 200px; }
  .pie-legend-item { display: flex; align-items: center; gap: 10px; }
  .pie-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .pie-legend-name { font-size: 12px; font-weight: 500; color: #94a3b8; flex: 1; }
  .pie-legend-pct { font-size: 12px; font-weight: 700; }

  /* Filter bar */
  .db-filter-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
  .db-filter-label { font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #2e3a52; margin-right: 4px; }
  .db-filter-btn {
    padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);
    background: transparent; color: #4b5675; font-size: 11.5px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .db-filter-btn:hover { border-color: rgba(99,102,241,0.35); color: #818cf8; background: rgba(99,102,241,0.08); }
  .db-filter-btn.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.35); color: #818cf8; }
  .db-sort {
    margin-left: auto; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; color: #818cf8; font-size: 12px; font-family: 'Inter', sans-serif;
    padding: 6px 12px; cursor: pointer; outline: none;
  }
  .db-sort option { background: #131929; }

  /* Grid */
  .db-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }

  /* Country card */
  .db-card {
    background: #131929; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 20px 18px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.35);
    position: relative; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s, background 0.18s;
    cursor: default; overflow: hidden;
  }
  .db-card::before {
    content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }
  .db-card:hover { transform: translateY(-3px); background: #161d2e; }
  .db-card.h-high:hover   { border-color: rgba(239,68,68,0.35);  box-shadow: 0 12px 36px rgba(239,68,68,0.14),  0 0 0 1px rgba(255,255,255,0.04) inset; }
  .db-card.h-medium:hover { border-color: rgba(245,158,11,0.35); box-shadow: 0 12px 36px rgba(245,158,11,0.12), 0 0 0 1px rgba(255,255,255,0.04) inset; }
  .db-card.h-low:hover    { border-color: rgba(34,197,94,0.30);  box-shadow: 0 12px 36px rgba(34,197,94,0.10),  0 0 0 1px rgba(255,255,255,0.04) inset; }

  .db-card-flag { font-size: 26px; margin-bottom: 10px; display: block; line-height: 1; }
  .db-card-name { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 14px; }
  .db-bar-track { background: rgba(255,255,255,0.05); border-radius: 99px; height: 5px; margin-bottom: 14px; overflow: hidden; }
  .db-bar-fill-sm { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(0.22,1,0.36,1); }
  .db-card-bottom { display: flex; align-items: center; justify-content: space-between; }
  .db-pct { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }

  /* Badges */
  .badge { font-size: 10.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; display: flex; align-items: center; gap: 5px; }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; }
  .badge-high   { background: rgba(239,68,68,0.15);  color: #f87171; border: 1px solid rgba(239,68,68,0.3);  }
  .badge-high   .badge-dot { background: #f87171; }
  .badge-medium { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
  .badge-medium .badge-dot { background: #fbbf24; }
  .badge-low    { background: rgba(34,197,94,0.12);  color: #4ade80; border: 1px solid rgba(34,197,94,0.28); }
  .badge-low    .badge-dot { background: #4ade80; }

  /* Empty / not found */
  .db-empty { text-align: center; padding: 60px 20px; }
  .db-empty strong { display: block; font-size: 18px; margin-bottom: 8px; color: #3d4f6b; }
  .db-empty p { font-size: 14px; color: #2e3a52; line-height: 1.7; }

  .db-case-panel {
    background: #131929;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.4);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .db-case-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 12px 14px;
  }

  .db-case-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    color: #4b5675;
    font-weight: 700;
  }

  .db-case-value {
    margin-top: 6px;
    font-size: 18px;
    font-weight: 800;
    color: #f1f5f9;
  }

  /* Footer */
  .db-footer { text-align: center; margin-top: 48px; font-size: 11px; color: #1e2535; letter-spacing: 0.5px; }
  .db-footer span { color: #818cf8; }

  @media (max-width: 900px) {
    .db-page {
      padding: 78px 12px 32px;
    }

    .db-back {
      margin-bottom: 18px;
      padding: 7px 14px;
    }

    .db-title {
      font-size: 24px;
    }

    .db-summary {
      gap: 10px;
    }

    .db-stat {
      flex: 1 1 calc(50% - 10px);
      padding: 14px;
    }

    .db-chart-wrap {
      padding: 18px 14px;
    }

    .db-filter-bar {
      gap: 6px;
    }

    .db-sort {
      margin-left: 0;
      width: 100%;
      min-height: 38px;
    }

    .db-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  @media (max-width: 640px) {
    .db-page {
      padding: 72px 10px 22px;
    }

    .db-title {
      font-size: 21px;
      line-height: 1.25;
    }

    .db-subtitle {
      font-size: 12px;
    }

    .db-summary {
      margin-bottom: 18px;
    }

    .db-stat {
      flex: 1 1 100%;
    }

    .db-stat-value {
      font-size: 22px;
    }

    .db-chart-toggle {
      width: 100%;
    }

    .db-toggle-btn {
      flex: 1;
      min-height: 36px;
      padding: 7px 8px;
    }

    .bar-row {
      align-items: flex-start;
      flex-direction: column;
      gap: 6px;
    }

    .bar-label {
      width: 100%;
      text-align: left;
    }

    .bar-track {
      width: 100%;
    }

    .bar-pct {
      width: auto;
    }

    .pie-wrap {
      gap: 18px;
    }

    .pie-legend {
      min-width: 100%;
    }

    .db-filter-label {
      width: 100%;
      margin-right: 0;
      margin-bottom: 4px;
    }

    .db-filter-btn {
      min-height: 34px;
      padding: 6px 12px;
    }

    .db-card {
      padding: 16px 14px;
    }

    .db-case-panel {
      grid-template-columns: 1fr;
      padding: 14px;
    }
  }
`;

// ─── Region → Countries data ──────────────────────────────────────────
const REGION_DATA = {
  "south asia": [
    { name: "India",       flag: "🇮🇳" },
    { name: "Pakistan",    flag: "🇵🇰" },
    { name: "Bangladesh",  flag: "🇧🇩" },
    { name: "Nepal",       flag: "🇳🇵" },
    { name: "Sri Lanka",   flag: "🇱🇰" },
    { name: "Afghanistan", flag: "🇦🇫" },
    { name: "Bhutan",      flag: "🇧🇹" },
    { name: "Maldives",    flag: "🇲🇻" },
  ],
  "southeast asia": [
    { name: "Indonesia",   flag: "🇮🇩" },
    { name: "Vietnam",     flag: "🇻🇳" },
    { name: "Thailand",    flag: "🇹🇭" },
    { name: "Philippines", flag: "🇵🇭" },
    { name: "Malaysia",    flag: "🇲🇾" },
    { name: "Myanmar",     flag: "🇲🇲" },
    { name: "Cambodia",    flag: "🇰🇭" },
    { name: "Laos",        flag: "🇱🇦" },
    { name: "Singapore",   flag: "🇸🇬" },
    { name: "Brunei",      flag: "🇧🇳" },
    { name: "Timor-Leste", flag: "🇹🇱" },
  ],
  "east asia": [
    { name: "China",       flag: "🇨🇳" },
    { name: "Japan",       flag: "🇯🇵" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "North Korea", flag: "🇰🇵" },
    { name: "Taiwan",      flag: "🇹🇼" },
    { name: "Mongolia",    flag: "🇲🇳" },
    { name: "Hong Kong",   flag: "🇭🇰" },
  ],
  "europe": [
    { name: "Germany",        flag: "🇩🇪" },
    { name: "France",         flag: "🇫🇷" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Italy",          flag: "🇮🇹" },
    { name: "Spain",          flag: "🇪🇸" },
    { name: "Poland",         flag: "🇵🇱" },
    { name: "Netherlands",    flag: "🇳🇱" },
    { name: "Belgium",        flag: "🇧🇪" },
    { name: "Sweden",         flag: "🇸🇪" },
    { name: "Norway",         flag: "🇳🇴" },
    { name: "Switzerland",    flag: "🇨🇭" },
    { name: "Austria",        flag: "🇦🇹" },
    { name: "Portugal",       flag: "🇵🇹" },
    { name: "Greece",         flag: "🇬🇷" },
    { name: "Romania",        flag: "🇷🇴" },
    { name: "Ukraine",        flag: "🇺🇦" },
    { name: "Czech Republic", flag: "🇨🇿" },
    { name: "Hungary",        flag: "🇭🇺" },
    { name: "Denmark",        flag: "🇩🇰" },
    { name: "Finland",        flag: "🇫🇮" },
  ],
  "west africa": [
    { name: "Nigeria",       flag: "🇳🇬" },
    { name: "Ghana",         flag: "🇬🇭" },
    { name: "Senegal",       flag: "🇸🇳" },
    { name: "Côte d'Ivoire", flag: "🇨🇮" },
    { name: "Mali",          flag: "🇲🇱" },
    { name: "Burkina Faso",  flag: "🇧🇫" },
    { name: "Guinea",        flag: "🇬🇳" },
    { name: "Niger",         flag: "🇳🇪" },
    { name: "Benin",         flag: "🇧🇯" },
    { name: "Togo",          flag: "🇹🇬" },
    { name: "Sierra Leone",  flag: "🇸🇱" },
    { name: "Liberia",       flag: "🇱🇷" },
    { name: "Gambia",        flag: "🇬🇲" },
    { name: "Cape Verde",    flag: "🇨🇻" },
  ],
  "east africa": [
    { name: "Ethiopia",   flag: "🇪🇹" },
    { name: "Kenya",      flag: "🇰🇪" },
    { name: "Tanzania",   flag: "🇹🇿" },
    { name: "Uganda",     flag: "🇺🇬" },
    { name: "Rwanda",     flag: "🇷🇼" },
    { name: "Somalia",    flag: "🇸🇴" },
    { name: "Sudan",      flag: "🇸🇩" },
    { name: "Eritrea",    flag: "🇪🇷" },
    { name: "Djibouti",   flag: "🇩🇯" },
    { name: "Burundi",    flag: "🇧🇮" },
    { name: "Mozambique", flag: "🇲🇿" },
    { name: "Zimbabwe",   flag: "🇿🇼" },
    { name: "Zambia",     flag: "🇿🇲" },
    { name: "Malawi",     flag: "🇲🇼" },
    { name: "Madagascar", flag: "🇲🇬" },
  ],
  "north africa": [
    { name: "Egypt",     flag: "🇪🇬" },
    { name: "Algeria",   flag: "🇩🇿" },
    { name: "Morocco",   flag: "🇲🇦" },
    { name: "Tunisia",   flag: "🇹🇳" },
    { name: "Libya",     flag: "🇱🇾" },
    { name: "Sudan",     flag: "🇸🇩" },
    { name: "Mauritania",flag: "🇲🇷" },
  ],
  "southern africa": [
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Zimbabwe",     flag: "🇿🇼" },
    { name: "Zambia",       flag: "🇿🇲" },
    { name: "Botswana",     flag: "🇧🇼" },
    { name: "Namibia",      flag: "🇳🇦" },
    { name: "Mozambique",   flag: "🇲🇿" },
    { name: "Angola",       flag: "🇦🇴" },
    { name: "Lesotho",      flag: "🇱🇸" },
    { name: "Eswatini",     flag: "🇸🇿" },
  ],
  "middle east": [
    { name: "Saudi Arabia",  flag: "🇸🇦" },
    { name: "Iran",          flag: "🇮🇷" },
    { name: "Iraq",          flag: "🇮🇶" },
    { name: "Israel",        flag: "🇮🇱" },
    { name: "UAE",           flag: "🇦🇪" },
    { name: "Jordan",        flag: "🇯🇴" },
    { name: "Lebanon",       flag: "🇱🇧" },
    { name: "Syria",         flag: "🇸🇾" },
    { name: "Yemen",         flag: "🇾🇪" },
    { name: "Oman",          flag: "🇴🇲" },
    { name: "Kuwait",        flag: "🇰🇼" },
    { name: "Qatar",         flag: "🇶🇦" },
    { name: "Bahrain",       flag: "🇧🇭" },
    { name: "Palestine",     flag: "🇵🇸" },
    { name: "Turkey",        flag: "🇹🇷" },
  ],
  "north america": [
    { name: "United States", flag: "🇺🇸" },
    { name: "Canada",        flag: "🇨🇦" },
    { name: "Mexico",        flag: "🇲🇽" },
    { name: "Cuba",          flag: "🇨🇺" },
    { name: "Haiti",         flag: "🇭🇹" },
    { name: "Dominican Rep.",flag: "🇩🇴" },
    { name: "Guatemala",     flag: "🇬🇹" },
    { name: "Honduras",      flag: "🇭🇳" },
    { name: "El Salvador",   flag: "🇸🇻" },
    { name: "Nicaragua",     flag: "🇳🇮" },
    { name: "Costa Rica",    flag: "🇨🇷" },
    { name: "Panama",        flag: "🇵🇦" },
    { name: "Jamaica",       flag: "🇯🇲" },
  ],
  "south america": [
    { name: "Brazil",    flag: "🇧🇷" },
    { name: "Colombia",  flag: "🇨🇴" },
    { name: "Argentina", flag: "🇦🇷" },
    { name: "Peru",      flag: "🇵🇪" },
    { name: "Venezuela", flag: "🇻🇪" },
    { name: "Chile",     flag: "🇨🇱" },
    { name: "Ecuador",   flag: "🇪🇨" },
    { name: "Bolivia",   flag: "🇧🇴" },
    { name: "Paraguay",  flag: "🇵🇾" },
    { name: "Uruguay",   flag: "🇺🇾" },
    { name: "Guyana",    flag: "🇬🇾" },
    { name: "Suriname",  flag: "🇸🇷" },
  ],
  "central asia": [
    { name: "Kazakhstan",   flag: "🇰🇿" },
    { name: "Uzbekistan",   flag: "🇺🇿" },
    { name: "Tajikistan",   flag: "🇹🇯" },
    { name: "Kyrgyzstan",   flag: "🇰🇬" },
    { name: "Turkmenistan", flag: "🇹🇲" },
  ],
  "oceania": [
    { name: "Australia",      flag: "🇦🇺" },
    { name: "New Zealand",    flag: "🇳🇿" },
    { name: "Papua New Guinea",flag:"🇵🇬" },
    { name: "Fiji",           flag: "🇫🇯" },
    { name: "Solomon Islands",flag: "🇸🇧" },
    { name: "Vanuatu",        flag: "🇻🇺" },
    { name: "Samoa",          flag: "🇼🇸" },
    { name: "Tonga",          flag: "🇹🇴" },
  ],
  "caribbean": [
    { name: "Cuba",            flag: "🇨🇺" },
    { name: "Haiti",           flag: "🇭🇹" },
    { name: "Dominican Rep.",  flag: "🇩🇴" },
    { name: "Jamaica",         flag: "🇯🇲" },
    { name: "Trinidad & Tobago",flag:"🇹🇹" },
    { name: "Barbados",        flag: "🇧🇧" },
    { name: "Bahamas",         flag: "🇧🇸" },
  ],
  "central africa": [
    { name: "DR Congo",            flag: "🇨🇩" },
    { name: "Cameroon",            flag: "🇨🇲" },
    { name: "Congo",               flag: "🇨🇬" },
    { name: "Central African Rep.",flag: "🇨🇫" },
    { name: "Chad",                flag: "🇹🇩" },
    { name: "Gabon",               flag: "🇬🇦" },
    { name: "Equatorial Guinea",   flag: "🇬🇶" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────
function hashRisk(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return 20 + (Math.abs(h) % 79);
}

function getRiskLevel(pct) {
  if (pct >= 67) return "High";
  if (pct >= 40) return "Medium";
  return "Low";
}

const BAR_COLOR   = { High: "#f87171", Medium: "#fbbf24", Low: "#4ade80" };
const HOVER_CLASS = { High: "db-card h-high", Medium: "db-card h-medium", Low: "db-card h-low" };
const BADGE_CLASS = { High: "badge badge-high", Medium: "badge badge-medium", Low: "badge badge-low" };

function resolveRegion(input) {
  if (!input) return null;
  const key = input.trim().toLowerCase();
  if (REGION_DATA[key]) return { label: toTitle(key), countries: REGION_DATA[key] };
  const found = Object.keys(REGION_DATA).find(k => k.includes(key) || key.includes(k));
  if (found) return { label: toTitle(found), countries: REGION_DATA[found] };
  return null;
}

function toTitle(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function getHotspotMeta(level) {
  if (level === 2) return { label: "High Hotspot", short: "High", color: "#f87171" };
  if (level === 1) return { label: "Watchlist Hotspot", short: "Watch", color: "#fbbf24" };
  if (level === 0) return { label: "No Hotspot", short: "Clear", color: "#4ade80" };
  return { label: "Unknown", short: "—", color: "#94a3b8" };
}

// ─── Pie chart (pure SVG) ─────────────────────────────────────────────
function PieChart({ data }) {
  const SIZE  = 180;
  const CX    = SIZE / 2;
  const CY    = SIZE / 2;
  const R     = 70;
  const INNER = 38; // donut hole
  const [hovered, setHovered] = useState(null);

  const total = data.reduce((a, d) => a + d.pct, 0);

  const slices = data.reduce((acc, d) => {
    const angle = (d.pct / total) * 360;
    const start = acc.cursor;
    const end = start + angle;

    const toRad = deg => (deg * Math.PI) / 180;
    const x1 = CX + R * Math.cos(toRad(start));
    const y1 = CY + R * Math.sin(toRad(start));
    const x2 = CX + R * Math.cos(toRad(end));
    const y2 = CY + R * Math.sin(toRad(end));
    const xi1 = CX + INNER * Math.cos(toRad(start));
    const yi1 = CY + INNER * Math.sin(toRad(start));
    const xi2 = CX + INNER * Math.cos(toRad(end));
    const yi2 = CY + INNER * Math.sin(toRad(end));
    const large = angle > 180 ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
      `L ${xi2} ${yi2}`,
      `A ${INNER} ${INNER} 0 ${large} 0 ${xi1} ${yi1}`,
      "Z",
    ].join(" ");

    acc.slices.push({ ...d, path, color: BAR_COLOR[d.level] });
    return { cursor: end, slices: acc.slices };
  }, { cursor: -90, slices: [] }).slices;

  // show top 10 in legend
  const legendItems = [...data].sort((a, b) => b.pct - a.pct).slice(0, 10);

  return (
    <div className="pie-wrap">
      <div className="pie-svg-wrap">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {slices.map((s, idx) => (
            <path
              key={s.name}
              d={s.path}
              fill={s.color}
              opacity={hovered === null || hovered === idx ? 1 : 0.35}
              stroke="#0b0f1a"
              strokeWidth="2"
              style={{ transition: "opacity 0.2s", cursor: "pointer" }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          {/* Center label */}
          <text x={CX} y={CY - 6}  textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="Inter,sans-serif">
            {hovered !== null ? slices[hovered].name.split(" ")[0] : "Countries"}
          </text>
          <text x={CX} y={CY + 10} textAnchor="middle" fill="#f1f5f9" fontSize="14" fontWeight="800" fontFamily="Inter,sans-serif">
            {hovered !== null ? `${slices[hovered].pct}%` : data.length}
          </text>
        </svg>
      </div>
      <div className="pie-legend">
        {legendItems.map(d => (
          <div className="pie-legend-item" key={d.name}>
            <span className="pie-dot" style={{ background: BAR_COLOR[d.level] }} />
            <span className="pie-legend-name">{d.flag} {d.name}</span>
            <span className="pie-legend-pct" style={{ color: BAR_COLOR[d.level] }}>{d.pct}%</span>
          </div>
        ))}
        {data.length > 10 && (
          <span style={{ fontSize: 11, color: "#2e3a52", paddingLeft: 20 }}>+ {data.length - 10} more</span>
        )}
      </div>
    </div>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────
function BarChart({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const sorted = [...data].sort((a, b) => b.pct - a.pct);

  return (
    <div className="bar-chart">
      {sorted.map(d => (
        <div className="bar-row" key={d.name}>
          <div className="bar-label">{d.flag} {d.name}</div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: mounted ? `${d.pct}%` : "0%",
                background: BAR_COLOR[d.level],
              }}
            >
              {d.pct > 18 && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.65)" }}>{d.pct}%</span>
              )}
            </div>
          </div>
          <span className="bar-pct" style={{ color: BAR_COLOR[d.level] }}>{d.pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Country card ─────────────────────────────────────────────────────
function CountryCard({ name, flag, pct, level }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={hovered ? HOVER_CLASS[level] : "db-card"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="db-card-flag">{flag}</span>
      <div className="db-card-name">{name}</div>
      <div className="db-bar-track">
        <div className="db-bar-fill-sm" style={{ width: `${pct}%`, background: BAR_COLOR[level] }} />
      </div>
      <div className="db-card-bottom">
        <span className="db-pct" style={{ color: BAR_COLOR[level] }}>{pct}%</span>
        <span className={BADGE_CLASS[level]}>
          <span className="badge-dot" />
          {level}
        </span>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────
export default function Dashboard({
  region,
  risk,
  predictionTarget = "risks",
  predictedCases = null,
  hotspotLevel = null,
  backendConnected = null,
  regions = [],
  onBack,
}) {
  const isRiskMode = predictionTarget === "risks";
  const [chartType, setChartType] = useState("bar"); // "bar" | "pie"
  const [filter,    setFilter]    = useState("All");
  const [sort,      setSort]      = useState("risk-high");

  const resolved = resolveRegion(region);

  const allData = (() => {
    if (backendConnected === false) {
      // backend down: show chart with all 0 values
      const expensiveList = resolved ? resolved.countries : Object.values(REGION_DATA).flat();
      return expensiveList.map(c => ({ ...c, pct: 0, level: "Low" }));
    }

    if (backendConnected === true && Array.isArray(regions) && regions.length > 0) {
      return regions.map(c => {
        const pct = Number.isFinite(c.risk) ? Math.max(0, Math.min(100, c.risk)) : hashRisk(c.name + (region || ""));
        const level = getRiskLevel(pct);
        return { ...c, pct, level };
      });
    }

    if (resolved) {
      return resolved.countries.map(c => {
        const pct = hashRisk(c.name + (region || ""));
        const level = getRiskLevel(pct);
        return { ...c, pct, level };
      });
    }

    return [];
  })();

  // Summary stats
  const high   = allData.filter(c => c.level === "High").length;
  const medium = allData.filter(c => c.level === "Medium").length;
  const low    = allData.filter(c => c.level === "Low").length;
  const avg    = allData.length
    ? Math.round(allData.reduce((a, c) => a + c.pct, 0) / allData.length)
    : 0;

  // Filter
  let visible = filter === "All" ? allData : allData.filter(c => c.level === filter);

  // Sort
  if (sort === "name")       visible = [...visible].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "risk-high")  visible = [...visible].sort((a, b) => b.pct - a.pct);
  if (sort === "risk-low")   visible = [...visible].sort((a, b) => a.pct - b.pct);

  const displayTitle = backendConnected === true
    ? (region ? toTitle(region) : "Risk Prediction")
    : (resolved ? resolved.label : toTitle(region || "Unknown Region"));
  const metricLabel = predictionTarget === "nextdaycases" ? "Next Day Cases" : "Risk Level";
  const metricValue = predictionTarget === "nextdaycases"
    ? (typeof predictedCases === "number" ? Math.round(predictedCases).toLocaleString() : "—")
    : (risk || "—");
  const hotspotMeta = getHotspotMeta(hotspotLevel);

  const notFound = backendConnected === true ? false : !resolved;
  const showResult = backendConnected === true && (isRiskMode ? Boolean(risk) : typeof predictedCases === "number");

  const SUPPORTED = Object.keys(REGION_DATA).map(toTitle).join(", ");

  return (
    <>
      <style>{css}</style>
      <div className="db-page">
        <div className="db-inner">

          {/* Back */}
          {onBack && (
            <button className="db-back" onClick={onBack}>← Back to Search</button>
          )}

          {/* Header */}
          <div className="db-header">
            <div className="db-tag">
              <span className="db-tag-dot" />
              AI · Epidemiology
            </div>
            <h1 className="db-title">
              OutbreakX Dashboard<br />
              <span>{displayTitle}</span>
            </h1>
            <p className="db-subtitle">
              {backendConnected === false
                ? "Backend connection failed; showing all values as 0."
                : notFound
                  ? `Region not found. Try: South Asia, Europe, Middle East, West Africa…`
                  : showResult
                    ? `Prediction complete: ${metricLabel} = ${metricValue}. Hotspot detection: ${hotspotMeta.label}.`
                    : (isRiskMode
                      ? `${allData.length} countries · epidemic risk is simulated`
                      : "Projected next day cases and hotspot detection are shown below.")}
            </p>
          </div>

          {/* ── Content only when resolved ── */}
          {notFound ? (
            <div className="db-empty">
              <strong>Region not recognised</strong>
              <p>
                Supported regions:<br />
                {SUPPORTED}
              </p>
            </div>
          ) : (
            <>
              {backendConnected !== false && (
                <div className="db-summary">
                  {[
                    ...(isRiskMode
                      ? [
                          { label: "Type",        value: "Risks",        color: "#60a5fa" },
                          { label: metricLabel,    value: metricValue,      color: "#fbbf24" },
                          { label: "Hotspot",     value: hotspotMeta.short, color: hotspotMeta.color },
                          { label: "Countries",   value: allData.length,   color: "#818cf8" },
                          { label: "High Risk",   value: high,             color: "#f87171" },
                          { label: "Medium Risk", value: medium,           color: "#fbbf24" },
                          { label: "Low Risk",    value: low,              color: "#4ade80" },
                          { label: "Avg Risk",    value: `${avg}%`,        color: "#a78bfa" },
                        ]
                      : [
                          { label: "Type",           value: "Cases", color: "#60a5fa" },
                          { label: "Next Day Cases", value: metricValue, color: "#22d3ee" },
                          { label: "Hotspot",        value: hotspotMeta.short, color: hotspotMeta.color },
                          { label: "Region",         value: displayTitle, color: "#818cf8" },
                        ]),
                  ].map(s => (
                    <div className="db-stat" key={s.label}>
                      <span className="db-stat-value" style={{ color: s.color }}>{s.value}</span>
                      <span className="db-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {backendConnected === false && (
                <div className="db-empty">
                  <strong>Backend not connected</strong>
                  <p>Unable to retrieve live results. Displaying zeroed chart data.</p>
                </div>
              )}

              {isRiskMode ? (
                <div className="db-chart-wrap">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                    <p className="db-chart-title">Risk Distribution — {displayTitle}</p>
                    <div className="db-chart-toggle">
                      <button className={`db-toggle-btn${chartType === "bar" ? " active" : ""}`} onClick={() => setChartType("bar")}>
                        ▬ Bar
                      </button>
                      <button className={`db-toggle-btn${chartType === "pie" ? " active" : ""}`} onClick={() => setChartType("pie")}>
                        ◉ Pie
                      </button>
                    </div>
                  </div>

                  {chartType === "bar"
                    ? <BarChart data={allData} />
                    : <PieChart data={allData} />
                  }
                </div>
              ) : (
                <div className="db-case-panel">
                  <div className="db-case-item">
                    <div className="db-case-label">Projected Next Day Cases</div>
                    <div className="db-case-value">{metricValue}</div>
                  </div>
                  <div className="db-case-item">
                    <div className="db-case-label">Hotspot Detection</div>
                    <div className="db-case-value" style={{ color: hotspotMeta.color }}>{hotspotMeta.label}</div>
                  </div>
                </div>
              )}

              {backendConnected !== false && isRiskMode && (
                <>
                  {/* Filter + sort */}
                  <div className="db-filter-bar">
                    <span className="db-filter-label">Filter:</span>
                    {["All","High","Medium","Low"].map(f => (
                      <button key={f} className={`db-filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
                    ))}
                    <select className="db-sort" value={sort} onChange={e => setSort(e.target.value)}>
                      <option value="name">Name A–Z</option>
                      <option value="risk-high">Risk: High first</option>
                      <option value="risk-low">Risk: Low first</option>
                    </select>
                  </div>

                  {/* Cards */}
                  {visible.length === 0 ? (
                    <div className="db-empty"><p>No countries match this filter.</p></div>
                  ) : (
                    <div className="db-grid">
                      {visible.map(c => (
                        <CountryCard key={c.name} name={c.name} flag={c.flag} pct={c.pct} level={c.level} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <p className="db-footer">
            Powered by <span>Anagha</span> Health Intelligence &nbsp;·&nbsp; Data is simulated
          </p>

        </div>
      </div>
    </>
  );
}