import { useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { useForm, ValidationError } from "@formspree/react";

// ─── SUPABASE CONFIG — REPLACE THESE TWO LINES ──────────────────
const SUPABASE_URL = "https://afhioirxrjaxcieqimlo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaGlvaXJ4cmpheGNpZXFpbWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTY5OTAsImV4cCI6MjA5MDUzMjk5MH0.FW1c42k1VfrGxGxEMooPAMNHHuaoe4EnDavdPD_Ej1E";
// ────────────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const isDemo = SUPABASE_URL.includes("YOUR_PROJECT");

// ─── DESIGN TOKENS — LIGHT PREMIUM ──────────────────────────────
const C = {
  bg:       "#F8F7F5",
  surface:  "#FFFFFF",
  raised:   "#F2F0ED",
  border:   "#E4E0DA",
  borderLt: "#D0CBC2",
  text:     "#1A1714",
  textMd:   "#6B6560",
  textDim:  "#A8A29C",
  blue:     "#2563EB",
  blueLt:   "#3B82F6",
  blueDim:  "#EFF6FF",
  navy:     "#1E3A5F",
  green:    "#16A34A",
  greenDim: "#F0FDF4",
  amber:    "#D97706",
  amberDim: "#FFFBEB",
  red:      "#DC2626",
  redDim:   "#FEF2F2",
  gold:     "#B45309",
};

// ─── ANTHROPIC ICON ──────────────────────────────────────────────
const AnthropicIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "block", flexShrink: 0 }}>
    <path d="M13.8 3L19 21h-3.4l-1-3.2H9.4L8.4 21H5L10.2 3h3.6zM12 8.2L10.2 14h3.6L12 8.2z" fill={C.blue} />
  </svg>
);

// ─── ICONS ───────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor", strokeWidth = 1.6 }) => {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    grid:     <svg style={s} viewBox="0 0 24 24"><rect {...p} x="3" y="3" width="7" height="7" rx="1"/><rect {...p} x="14" y="3" width="7" height="7" rx="1"/><rect {...p} x="3" y="14" width="7" height="7" rx="1"/><rect {...p} x="14" y="14" width="7" height="7" rx="1"/></svg>,
    edit:     <svg style={s} viewBox="0 0 24 24"><path {...p} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path {...p} d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    users:    <svg style={s} viewBox="0 0 24 24"><path {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle {...p} cx="9" cy="7" r="4"/><path {...p} d="M23 21v-2a4 4 0 0 0-3-3.87"/><path {...p} d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    file:     <svg style={s} viewBox="0 0 24 24"><path {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline {...p} points="14 2 14 8 20 8"/><line {...p} x1="16" y1="13" x2="8" y2="13"/><line {...p} x1="16" y1="17" x2="8" y2="17"/></svg>,
    mail:     <svg style={s} viewBox="0 0 24 24"><path {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline {...p} points="22,6 12,13 2,6"/></svg>,
    trending: <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline {...p} points="17 6 23 6 23 12"/></svg>,
    download: <svg style={s} viewBox="0 0 24 24"><path {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline {...p} points="7 10 12 15 17 10"/><line {...p} x1="12" y1="15" x2="12" y2="3"/></svg>,
    share:    <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="18" cy="5" r="3"/><circle {...p} cx="6" cy="12" r="3"/><circle {...p} cx="18" cy="19" r="3"/><line {...p} x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line {...p} x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    plus:     <svg style={s} viewBox="0 0 24 24"><line {...p} x1="12" y1="5" x2="12" y2="19"/><line {...p} x1="5" y1="12" x2="19" y2="12"/></svg>,
    arrow:    <svg style={s} viewBox="0 0 24 24"><line {...p} x1="5" y1="12" x2="19" y2="12"/><polyline {...p} points="12 5 19 12 12 19"/></svg>,
    check:    <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="20 6 9 17 4 12"/></svg>,
    x:        <svg style={s} viewBox="0 0 24 24"><line {...p} x1="18" y1="6" x2="6" y2="18"/><line {...p} x1="6" y1="6" x2="18" y2="18"/></svg>,
    leaf:     <svg style={s} viewBox="0 0 24 24"><path {...p} d="M2 22c0 0 4-2 8-6s8-10 12-14c0 0-8 0-14 6S2 22 2 22z"/></svg>,
    bar:      <svg style={s} viewBox="0 0 24 24"><line {...p} x1="18" y1="20" x2="18" y2="10"/><line {...p} x1="12" y1="20" x2="12" y2="4"/><line {...p} x1="6" y1="20" x2="6" y2="14"/></svg>,
    shield:   <svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    person:   <svg style={s} viewBox="0 0 24 24"><path {...p} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle {...p} cx="12" cy="7" r="4"/></svg>,
    info:     <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="10"/><line {...p} x1="12" y1="8" x2="12" y2="12"/><line {...p} x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    sparkle:  <svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
    predict:  <svg style={s} viewBox="0 0 24 24"><path {...p} d="M2 20h20"/><path {...p} d="M4 20V10l4-4 4 3 4-6 4 5v12"/></svg>,
    star:     <svg style={s} viewBox="0 0 24 24"><polygon {...p} points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    about:    <svg style={s} viewBox="0 0 24 24"><path {...p} d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path {...p} d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    message:  <svg style={s} viewBox="0 0 24 24"><path {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    logout:   <svg style={s} viewBox="0 0 24 24"><path {...p} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline {...p} points="16 17 21 12 16 7"/><line {...p} x1="21" y1="12" x2="9" y2="12"/></svg>,
    more:     <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="1" fill={color}/><circle {...p} cx="19" cy="12" r="1" fill={color}/><circle {...p} cx="5" cy="12" r="1" fill={color}/></svg>,
    heart:    <svg style={s} viewBox="0 0 24 24"><path {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  };
  return icons[name] || null;
};

// ─── CSS ─────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Geist+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:${C.bg};--sf:${C.surface};--rs:${C.raised};--bd:${C.border};--bdl:${C.borderLt};
    --tx:${C.text};--txm:${C.textMd};--txd:${C.textDim};
    --bl:${C.blue};--bll:${C.blueLt};--bld:${C.blueDim};
    --nv:${C.navy};--gr:${C.green};--grd:${C.greenDim};
    --am:${C.amber};--amd:${C.amberDim};--rd:${C.red};--rdd:${C.redDim};
  }
  html,body{height:100%;background:var(--bg);color:var(--tx)}
  body{font-family:'Instrument Sans',sans-serif;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}

  /* ── LAYOUT ── */
  .app{display:flex;height:100vh;overflow:hidden}
  .sidebar{width:220px;min-width:220px;background:var(--sf);border-right:1px solid var(--bd);display:flex;flex-direction:column;height:100vh;flex-shrink:0}
  .sb-logo{padding:22px 18px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:9px}
  .lm{width:28px;height:28px;background:var(--bld);border:1.5px solid var(--bl);border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--bl);flex-shrink:0}
  .ln{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:var(--tx)}
  .nav{padding:8px;flex:1;overflow-y:auto}
  .ngl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--txd);padding:10px 8px 5px}
  .ni{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;cursor:pointer;color:var(--txm);font-size:13px;border:none;background:none;width:100%;text-align:left;transition:color .12s,background .12s}
  .ni:hover{background:var(--rs);color:var(--tx)}
  .ni.active{background:var(--bld);color:var(--bl);font-weight:500}
  .sb-footer{border-top:1px solid var(--bd);padding:12px}
  .op{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;background:var(--rs);cursor:pointer;transition:background .12s;border:1px solid var(--bd)}
  .op:hover{background:var(--bd)}
  .oa{width:28px;height:28px;border-radius:6px;background:var(--bld);border:1.5px solid var(--bl);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--bl);flex-shrink:0}
  .on{font-size:12px;color:var(--tx);font-weight:500;line-height:1.3}
  .ot{font-size:10px;color:var(--txd)}

  /* ── MAIN ── */
  .main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
  .tb{height:56px;min-height:56px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:var(--sf)}
  .tbl{display:flex;align-items:baseline;gap:10px;min-width:0}
  .tbt{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--tx);white-space:nowrap}
  .tbs{font-size:11px;color:var(--txd);white-space:nowrap}
  .tbr{display:flex;align-items:center;gap:8px;flex-shrink:0}
  .content{flex:1;overflow-y:auto;padding:24px}

  /* ── BUTTONS ── */
  .btn{display:inline-flex;align-items:center;gap:6px;border:none;cursor:pointer;border-radius:7px;font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:500;padding:7px 14px;transition:all .12s;white-space:nowrap}
  .bp{background:var(--bl);color:#fff}.bp:hover{background:var(--bll)}
  .bg{background:transparent;color:var(--txm);border:1.5px solid var(--bd)}.bg:hover{border-color:var(--bdl);color:var(--tx);background:var(--rs)}
  .bs{padding:6px 12px;font-size:12px}

  /* ── CARDS ── */
  .card{background:var(--sf);border:1px solid var(--bd);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .ch{padding:16px 20px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .ct{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--tx)}
  .cs{font-size:11px;color:var(--txd);margin-top:2px}
  .cb{padding:20px}

  /* ── STAT CARDS ── */
  .sr{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
  .sc{background:var(--sf);border:1px solid var(--bd);border-radius:10px;padding:18px;position:relative;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .sa{position:absolute;top:0;left:0;right:0;height:3px;border-radius:10px 10px 0 0}
  .sl{font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:var(--txd);font-weight:500}
  .sv{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;color:var(--tx);line-height:1;margin:8px 0 5px;letter-spacing:-0.5px}
  .sd{font-size:11px;color:var(--gr);display:flex;align-items:center;gap:4px;font-weight:500}
  .sd.neg{color:var(--rd)}
  .si{position:absolute;top:16px;right:16px;color:var(--txd);opacity:.25}

  /* ── GRID LAYOUTS ── */
  .cr{display:grid;grid-template-columns:1.6fr 1fr;gap:12px;margin-bottom:16px}
  .cre{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
  .crt{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px}

  /* ── TABLE ── */
  .tbl-wrap{overflow-x:auto}
  table{width:100%;border-collapse:collapse}
  thead tr{border-bottom:1.5px solid var(--bd);background:var(--rs)}
  th{text-align:left;padding:9px 16px;font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:var(--txd);font-weight:600;white-space:nowrap}
  td{padding:12px 16px;font-size:13px;color:var(--tx);border-bottom:1px solid var(--bd)}
  tbody tr:last-child td{border-bottom:none}
  tbody tr:hover td{background:var(--rs)}
  .mono{font-family:'Geist Mono',monospace;font-size:12px;color:var(--txm)}

  /* ── BADGES ── */
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500}
  .bg2{background:var(--grd);color:var(--gr)}
  .ba2{background:var(--amd);color:var(--am)}
  .bd2{background:var(--rs);color:var(--txm);border:1px solid var(--bd)}
  .bb{background:var(--bld);color:var(--bl)}
  .bgo2{background:#FEF9C3;color:#854D0E}
  .br{background:var(--rdd);color:var(--rd)}

  /* ── FORMS ── */
  .fg{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .ff{grid-column:1/-1}
  .fd{display:flex;flex-direction:column;gap:5px}
  .fd label{font-size:11px;color:var(--txm);font-weight:500}
  input,select,textarea{padding:9px 12px;background:var(--sf);border:1.5px solid var(--bd);border-radius:7px;color:var(--tx);font-size:13px;font-family:'Instrument Sans',sans-serif;outline:none;transition:border-color .12s,box-shadow .12s;width:100%}
  input::placeholder,textarea::placeholder{color:var(--txd)}
  input:focus,select:focus,textarea:focus{border-color:var(--bl);box-shadow:0 0 0 3px rgba(37,99,235,.08)}
  select option{background:var(--sf)}
  textarea{resize:vertical;min-height:88px;line-height:1.6}

  /* ── PROGRESS ── */
  .prog{height:4px;background:var(--rs);border-radius:2px;overflow:hidden;margin-top:5px}
  .pf{height:100%;background:var(--bl);border-radius:2px;transition:width .5s ease}
  .pf-gr{height:100%;background:var(--gr);border-radius:2px}

  /* ── MODAL ── */
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px)}
  .modal{background:var(--sf);border:1px solid var(--bd);border-radius:12px;width:520px;max-width:95vw;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.15)}
  .mh{padding:22px 26px 18px;border-bottom:1px solid var(--bd)}
  .mt{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600}
  .ms{font-size:12px;color:var(--txd);margin-top:3px}
  .mb{padding:22px 26px}
  .mf{padding:14px 26px;border-top:1px solid var(--bd);display:flex;justify-content:flex-end;gap:8px}

  /* ── SCORE RING ── */
  .rw{display:flex;flex-direction:column;align-items:center;padding:4px 0 12px}
  .rl{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--txd);margin-bottom:12px;font-weight:500}
  .rsw{position:relative;width:130px;height:130px}
  .rsw svg{transform:rotate(-90deg)}
  .rc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .rv{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:700;color:var(--tx);line-height:1}
  .rdl{font-size:11px;color:var(--txd);margin-top:1px}

  /* ── TOAST ── */
  .toast{position:fixed;bottom:80px;right:20px;background:var(--tx);color:var(--sf);padding:11px 16px;border-radius:8px;font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,.2);z-index:2000;display:flex;align-items:center;gap:10px;animation:su .2s ease;max-width:300px}
  .toast.err{background:var(--rd)}
  @keyframes su{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}

  /* ── LOADER ── */
  .loader{display:flex;align-items:center;justify-content:center;padding:60px;color:var(--txd);font-size:13px;gap:10px}
  .spin{width:16px;height:16px;border:2px solid var(--bd);border-top-color:var(--bl);border-radius:50%;animation:sp .7s linear infinite}
  @keyframes sp{to{transform:rotate(360deg)}}

  /* ── SCORE BADGES ── */
  .score-badge{display:inline-flex;align-items:center;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}
  .score-a{background:#DCFCE7;color:#15803D}
  .score-b{background:#D1FAE5;color:#065F46}
  .score-c{background:var(--amd);color:#92400E}
  .score-d{background:var(--rdd);color:#991B1B}

  /* ── VOLUNTEER CARDS ── */
  .vg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .vc{background:var(--sf);border:1.5px solid var(--bd);border-radius:10px;padding:18px;transition:border-color .15s,box-shadow .15s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .vc:hover{border-color:var(--bl);box-shadow:0 4px 12px rgba(37,99,235,.08)}
  .vh{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
  .va{width:36px;height:36px;border-radius:8px;background:var(--bld);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--bl)}
  .vn{font-size:14px;font-weight:600;color:var(--tx)}
  .vr2{font-size:11px;color:var(--txd);margin-top:1px}
  .vs{display:flex;gap:20px;padding-top:12px;border-top:1px solid var(--bd);margin-top:12px}
  .vv{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--tx)}
  .vl{font-size:10px;color:var(--txd);text-transform:uppercase;letter-spacing:1px;margin-top:1px}
  .vc-actions{display:flex;gap:6px;margin-top:12px;padding-top:12px;border-top:1px solid var(--bd)}
  .vc-btn{flex:1;padding:6px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid var(--bd);background:var(--sf);color:var(--txm);font-family:'Instrument Sans',sans-serif;transition:all .12s;text-align:center}
  .vc-btn:hover{border-color:var(--bl);color:var(--bl);background:var(--bld)}
  .vc-btn.del:hover{border-color:var(--rd);color:var(--rd);background:var(--rdd)}

  /* ── AI SECTION ── */
  .ai-hero{background:linear-gradient(135deg,var(--bld),#F0F4FF);border:1.5px solid rgba(37,99,235,.15);border-radius:12px;padding:32px;text-align:center;position:relative;overflow:hidden}
  .ai-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:radial-gradient(circle,rgba(37,99,235,.08),transparent 70%);pointer-events:none}
  .ai-hero-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--tx);margin-bottom:10px}
  .ai-hero-desc{font-size:13.5px;color:var(--txm);line-height:1.75;max-width:480px;margin:0 auto 24px}
  .ai-open-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 28px;background:var(--bl);color:#fff;font-family:'Instrument Sans',sans-serif;font-size:14px;font-weight:600;border:none;border-radius:9px;cursor:pointer;transition:all .15s;box-shadow:0 4px 14px rgba(37,99,235,.3)}
  .ai-open-btn:hover{background:var(--bll);transform:translateY(-1px);box-shadow:0 8px 24px rgba(37,99,235,.35)}
  .ai-powered{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:16px;font-size:11px;color:var(--txd)}

  /* ── INSIGHTS ── */
  .insight-row{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--bd)}
  .insight-row:last-child{border-bottom:none}
  .insight-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:5px}
  .insight-text{font-size:13px;color:var(--txm);line-height:1.65}
  .pred-card{background:var(--rs);border:1px solid var(--bd);border-radius:9px;padding:18px}
  .pred-val{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:600;color:var(--tx);line-height:1;margin:6px 0 3px}
  .pred-lbl{font-size:10px;color:var(--txd);text-transform:uppercase;letter-spacing:1px;font-weight:500}
  .pred-delta{font-size:11px;margin-top:4px;display:flex;align-items:center;gap:4px;font-weight:500}

  /* ── ABOUT ── */
  .about-hero{background:linear-gradient(135deg,var(--nv),#1E3A8A);border-radius:12px;padding:44px;margin-bottom:18px;position:relative;overflow:hidden}
  .about-hero::before{content:'';position:absolute;bottom:-60px;right:-60px;width:220px;height:220px;background:radial-gradient(circle,rgba(255,255,255,.06),transparent 70%);pointer-events:none}
  .about-title{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:700;color:#fff;margin-bottom:12px;line-height:1.1}
  .about-title em{color:#93C5FD;font-style:italic}
  .about-subtitle{font-size:15px;color:rgba(255,255,255,.7);line-height:1.8;max-width:680px}
  .about-card{background:var(--sf);border:1px solid var(--bd);border-radius:9px;padding:18px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .about-card-icon{color:var(--bl);margin-bottom:10px}
  .about-card-title{font-size:13px;font-weight:600;color:var(--tx);margin-bottom:6px}
  .about-card-text{font-size:12px;color:var(--txm);line-height:1.65}
  .about-body{font-size:13.5px;color:var(--txm);line-height:1.9}

  /* ── CONTACT ── */
  .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .contact-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--bd)}
  .contact-item:last-child{border-bottom:none}
  .contact-item-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--txd);font-weight:500;margin-bottom:3px}
  .contact-item-val{font-size:13px;color:var(--tx)}
  .form-success{background:var(--grd);border:1.5px solid #86EFAC;border-radius:9px;padding:24px;text-align:center;color:var(--gr)}
  .form-error-msg{font-size:11px;color:var(--rd);margin-top:4px}

  /* ── LANDING ── */
  .landing{min-height:100vh;background:#fff;display:flex;flex-direction:column}
  .lnav{display:flex;align-items:center;justify-content:space-between;padding:18px 48px;border-bottom:1px solid var(--bd);background:#fff}
  .lhero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 32px 60px;background:linear-gradient(180deg,#fff 0%,var(--bg) 100%)}
  .ley{display:inline-flex;align-items:center;gap:7px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--bl);margin-bottom:24px;padding:5px 14px;border:1.5px solid rgba(37,99,235,.2);border-radius:20px;background:var(--bld);font-weight:600}
  .ltitle{font-family:'Cormorant Garamond',serif;font-size:clamp(42px,5.5vw,72px);font-weight:700;color:var(--tx);line-height:1.08;letter-spacing:-1.5px;margin-bottom:18px;max-width:720px}
  .ltitle em{color:var(--bl);font-style:italic}
  .ldesc{font-size:16px;color:var(--txm);max-width:480px;line-height:1.8;margin-bottom:38px}
  .lacts{display:flex;gap:12px;align-items:center}
  .bll{padding:12px 26px;font-size:14px;border-radius:8px}
  .lfeats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--bd);background:var(--bg)}
  .fc{background:var(--sf);padding:36px 32px;border-right:1px solid var(--bd);border-bottom:1px solid var(--bd)}
  .fc:last-child{border-right:none}
  .fi{color:var(--bl);margin-bottom:14px}
  .ftt{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;margin-bottom:8px;color:var(--tx)}
  .fd2{font-size:13px;color:var(--txm);line-height:1.75}
  .lfoot{padding:20px 48px;border-top:1px solid var(--bd);display:flex;justify-content:space-between;align-items:center;background:#fff}
  .lft{font-size:11px;color:var(--txd)}

  /* ── AUTH ── */
  .aw{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:24px}
  .ac{width:400px;background:var(--sf);border:1px solid var(--bd);border-radius:14px;padding:36px;box-shadow:0 8px 40px rgba(0,0,0,.08)}
  .att{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;margin-bottom:6px}
  .ats{font-size:13px;color:var(--txd);margin-bottom:22px}
  .asw{text-align:center;margin-top:16px;font-size:12px;color:var(--txd)}
  .aln{color:var(--bl);cursor:pointer;text-decoration:underline;font-weight:500}
  .aerr{background:var(--rdd);border:1px solid #FECACA;border-radius:7px;padding:10px 14px;font-size:12px;color:var(--rd);margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .demo-note{margin-top:14px;padding:11px 14px;background:var(--bld);border-radius:7px;font-size:12px;color:var(--bl);border:1px solid rgba(37,99,235,.15)}

  /* ── MOBILE BOTTOM NAV ── */
  .bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--sf);border-top:1.5px solid var(--bd);z-index:100;padding:6px 0 env(safe-area-inset-bottom,6px)}
  .bottom-nav-inner{display:flex;justify-content:space-around;align-items:center}
  .bn-item{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 8px;cursor:pointer;border:none;background:none;color:var(--txd);font-family:'Instrument Sans',sans-serif;transition:color .12s;min-width:44px}
  .bn-item.active{color:var(--bl)}
  .bn-item span{font-size:9px;font-weight:500;letter-spacing:.3px}

  /* ── MORE SHEET ── */
  .more-sheet{position:fixed;bottom:64px;left:12px;right:12px;background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:8px;box-shadow:0 8px 32px rgba(0,0,0,.12);z-index:200}
  .more-item{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;cursor:pointer;color:var(--txm);font-size:14px;font-weight:500;transition:background .1s}
  .more-item:hover,.more-item.active{background:var(--bld);color:var(--bl)}

  /* ── MISC ── */
  .divider{height:1px;background:var(--bd);margin:18px 0}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:var(--bd);border-radius:3px}

  /* ── MOBILE RESPONSIVE ── */
  @media(max-width:768px){
    .app{flex-direction:column}
    .sidebar{display:none}
    .bottom-nav{display:block}
    .main{height:100vh;padding-bottom:64px}
    .content{padding:16px}
    .tb{padding:0 16px;height:50px;min-height:50px}
    .tbs{display:none}
    .sr{grid-template-columns:1fr 1fr;gap:10px}
    .crt{grid-template-columns:1fr 1fr;gap:10px}
    .cr{grid-template-columns:1fr;gap:10px}
    .cre{grid-template-columns:1fr;gap:10px}
    .vg{grid-template-columns:1fr 1fr;gap:10px}
    .fg{grid-template-columns:1fr;gap:12px}
    .ff{grid-column:1}
    .contact-grid{grid-template-columns:1fr}
    .lnav{padding:14px 20px}
    .lhero{padding:48px 20px 36px}
    .lfeats{grid-template-columns:1fr}
    .fc{border-right:none}
    .lfoot{padding:14px 20px;flex-direction:column;gap:6px;text-align:center}
    .lacts{flex-direction:column;gap:10px}
    .toast{bottom:76px;right:10px;left:10px;max-width:100%}
    .about-hero{padding:28px 20px}
    .about-title{font-size:26px}
    .ai-hero{padding:24px 18px}
    .ai-hero-title{font-size:20px}
    .sv{font-size:28px}
  }
  @media(max-width:480px){
    .sr{grid-template-columns:1fr 1fr}
    .vg{grid-template-columns:1fr}
    .sv{font-size:24px}
    .sc{padding:14px}
  }
`;

// ─── SEED DATA ───────────────────────────────────────────────────
const SEED = {
  org: { id: "demo", name: "Shiksha Foundation", type: "Education", city: "Mumbai" },
  activities: [
    { id: 1, name: "Digital Literacy Drive", type: "Education", activity_date: "2025-03-28", volunteers: 8, beneficiaries: 120, funds_utilized: 12400, location: "Kurla", status: "Active" },
    { id: 2, name: "Health Camp — Dharavi", type: "Healthcare", activity_date: "2025-03-24", volunteers: 14, beneficiaries: 380, funds_utilized: 31200, location: "Dharavi", status: "Completed" },
    { id: 3, name: "Women's Skill Training", type: "Livelihood", activity_date: "2025-03-20", volunteers: 6, beneficiaries: 45, funds_utilized: 8750, location: "Bandra", status: "Active" },
    { id: 4, name: "Mid-Day Meal Program", type: "Education", activity_date: "2025-03-18", volunteers: 22, beneficiaries: 510, funds_utilized: 44100, location: "Govandi", status: "Completed" },
    { id: 5, name: "Free Eye Checkup Camp", type: "Healthcare", activity_date: "2025-03-12", volunteers: 9, beneficiaries: 230, funds_utilized: 19600, location: "Malad", status: "Completed" },
  ],
  volunteers: [
    { id: 1, name: "Priya Sharma", role: "Field Coordinator", email: "priya@example.com", hours_logged: 142, events_attended: 12, skills: "Teaching" },
    { id: 2, name: "Arjun Mehta", role: "Data Analyst", email: "arjun@example.com", hours_logged: 98, events_attended: 8, skills: "Data Entry" },
    { id: 3, name: "Sneha Iyer", role: "Healthcare Lead", email: "sneha@example.com", hours_logged: 210, events_attended: 17, skills: "First Aid" },
    { id: 4, name: "Rohan Das", role: "Tech Volunteer", email: "rohan@example.com", hours_logged: 76, events_attended: 6, skills: "Web" },
    { id: 5, name: "Kavya Nair", role: "Community Outreach", email: "kavya@example.com", hours_logged: 165, events_attended: 14, skills: "Communication" },
    { id: 6, name: "Vikram Singh", role: "Logistics", email: "vikram@example.com", hours_logged: 88, events_attended: 9, skills: "Planning" },
  ],
  monthly: [
    { month: "Oct", volunteers: 12, beneficiaries: 340, donations: 28000 },
    { month: "Nov", volunteers: 18, beneficiaries: 510, donations: 41000 },
    { month: "Dec", volunteers: 24, beneficiaries: 690, donations: 67000 },
    { month: "Jan", volunteers: 21, beneficiaries: 620, donations: 52000 },
    { month: "Feb", volunteers: 31, beneficiaries: 890, donations: 78000 },
    { month: "Mar", volunteers: 38, beneficiaries: 1120, donations: 94000 },
  ],
};

// ─── DB LAYER ────────────────────────────────────────────────────
const db = {
  async getOrg(uid) {
    if (isDemo) return SEED.org;
    const { data } = await supabase.from("organizations").select("*").eq("user_id", uid).single();
    return data;
  },
  async createOrg(uid, p) {
    if (isDemo) return { ...SEED.org, ...p };
    const { data } = await supabase.from("organizations").insert({ user_id: uid, ...p }).select().single();
    return data;
  },
  async getActivities(oid) {
    if (isDemo) return SEED.activities;
    const { data } = await supabase.from("activities").select("*").eq("org_id", oid).order("activity_date", { ascending: false });
    return data || [];
  },
  async logActivity(oid, p) {
    if (isDemo) return { id: Date.now(), org_id: oid, ...p };
    const { data } = await supabase.from("activities").insert({ org_id: oid, ...p }).select().single();
    return data;
  },
  async getVolunteers(oid) {
    if (isDemo) return SEED.volunteers;
    const { data } = await supabase.from("volunteers").select("*").eq("org_id", oid).order("created_at", { ascending: false });
    return data || [];
  },
  async addVolunteer(oid, p) {
    if (isDemo) return { id: Date.now(), org_id: oid, hours_logged: 0, events_attended: 0, ...p };
    const { data } = await supabase.from("volunteers").insert({ org_id: oid, ...p }).select().single();
    return data;
  },
  async updateVolunteer(id, p) {
    if (isDemo) return;
    await supabase.from("volunteers").update(p).eq("id", id);
  },
  async deleteVolunteer(id) {
    if (isDemo) return;
    await supabase.from("volunteers").delete().eq("id", id);
  },
};

// ─── RELATIVE GRADING ────────────────────────────────────────────
const gradeActivities = (activities) => {
  if (!activities.length) return {};
  const scores = activities.map(a => {
    const b = Number(a.beneficiaries) || 0;
    const v = Number(a.volunteers) || 0;
    const f = Number(a.funds_utilized) || 0;
    const cpp = b > 0 ? f / b : Infinity;
    return { id: a.id, raw: b * 0.5 + v * 10 + (cpp < 200 ? 30 : cpp < 500 ? 15 : 0) };
  });
  if (scores.length < 3) {
    const map = {};
    scores.forEach(s => { map[s.id] = s.raw > 120 ? "A" : s.raw > 60 ? "B" : s.raw > 20 ? "C" : "D"; });
    return map;
  }
  const sorted = [...scores].sort((a, b) => b.raw - a.raw);
  const map = {};
  sorted.forEach((s, i) => {
    const pct = i / sorted.length;
    map[s.id] = pct < 0.25 ? "A" : pct < 0.55 ? "B" : pct < 0.80 ? "C" : "D";
  });
  return map;
};

const gradeVolunteers = (volunteers) => {
  if (!volunteers.length) return {};
  const scores = volunteers.map(v => ({ id: v.id, raw: (v.hours_logged || 0) * 0.5 + (v.events_attended || 0) * 10 }));
  if (scores.length < 3) {
    const map = {};
    scores.forEach(s => {
      if (s.raw >= 150) map[s.id] = { label: "Top Performer", cls: "bgo2" };
      else if (s.raw >= 80) map[s.id] = { label: "Active", cls: "bg2" };
      else if (s.raw >= 30) map[s.id] = { label: "Moderate", cls: "ba2" };
      else map[s.id] = { label: "Needs Engagement", cls: "br" };
    });
    return map;
  }
  const sorted = [...scores].sort((a, b) => b.raw - a.raw);
  const map = {};
  sorted.forEach((s, i) => {
    const pct = i / sorted.length;
    if (pct < 0.20)      map[s.id] = { label: "Top Performer", cls: "bgo2" };
    else if (pct < 0.55) map[s.id] = { label: "Active", cls: "bg2" };
    else if (pct < 0.85) map[s.id] = { label: "Moderate", cls: "ba2" };
    else                 map[s.id] = { label: "Needs Engagement", cls: "br" };
  });
  return map;
};

const calcMetrics = (activities) => {
  if (!activities.length) return { costPerBeneficiary: 0, retentionRate: 0 };
  const totF = activities.reduce((s, a) => s + (Number(a.funds_utilized) || 0), 0);
  const totB = activities.reduce((s, a) => s + (Number(a.beneficiaries) || 0), 0);
  const totV = activities.reduce((s, a) => s + (Number(a.volunteers) || 0), 0);
  return {
    costPerBeneficiary: totB > 0 ? Math.round(totF / totB) : 0,
    retentionRate: Math.min(100, Math.round((totV / (activities.length * 10)) * 100)),
  };
};

const getSuggestion = (a, grade) => {
  const b = Number(a.beneficiaries) || 0;
  const v = Number(a.volunteers) || 0;
  const f = Number(a.funds_utilized) || 0;
  if (grade === "A") return "Top of your portfolio — replicate this programme model.";
  if (b < 30) return "Beneficiary reach is below your portfolio average — expand outreach.";
  if (v < 4) return "Volunteer deployment is thin — recruit more before scaling.";
  if (f > 0 && b > 0 && f / b > 500) return "Cost per beneficiary is high relative to other programmes.";
  return "Solid performance — maintain consistency and documentation.";
};

const calcPredictions = () => {
  const m = SEED.monthly;
  const last = m[m.length - 1], prev = m[m.length - 2];
  const bg = (last.beneficiaries - prev.beneficiaries) / prev.beneficiaries;
  const vg = (last.volunteers - prev.volunteers) / prev.volunteers;
  const fg = (last.donations - prev.donations) / prev.donations;
  return {
    beneficiaries: Math.round(last.beneficiaries * (1 + bg)),
    volunteers: Math.round(last.volunteers * (1 + vg)),
    funds: Math.round(last.donations * (1 + fg)),
    bGrowth: Math.round(bg * 100),
    vGrowth: Math.round(vg * 100),
    fGrowth: Math.round(fg * 100),
  };
};

// ─── SHARE HELPER ────────────────────────────────────────────────
const copyToClipboard = async (text, showToast) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.focus(); el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    showToast("Link copied to clipboard.");
  } catch { showToast("Copy the URL from your browser bar.", "err"); }
};

// ─── PDF EXPORT ──────────────────────────────────────────────────
const exportPDF = async (org, activities) => {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const doc = new jsPDF();
  const totB = activities.reduce((s, a) => s + (Number(a.beneficiaries) || 0), 0);
  const totF = activities.reduce((s, a) => s + (Number(a.funds_utilized) || 0), 0);
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, 210, 48, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20); doc.setFont("helvetica", "bold");
  doc.text(org?.name || "NGO", 14, 20);
  doc.setFontSize(11); doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  doc.text("Impact Report — Q1 2025", 14, 30);
  doc.text(`Generated by ImpactLens · ${new Date().toLocaleDateString("en-IN")}`, 14, 39);
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(11); doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, 62);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  [["Total Beneficiaries", totB.toLocaleString()], ["Funds Utilised", `INR ${totF.toLocaleString()}`], ["Programmes Run", activities.length.toString()], ["Cost per Beneficiary", totB > 0 ? `INR ${Math.round(totF / totB)}` : "N/A"]].forEach(([k, v], i) => {
    doc.setTextColor(120, 120, 120); doc.text(k, 14, 72 + i * 8);
    doc.setTextColor(40, 40, 40); doc.text(v, 90, 72 + i * 8);
  });
  autoTable(doc, {
    startY: 108,
    head: [["Programme", "Type", "Date", "Beneficiaries", "Volunteers", "Funds (INR)"]],
    body: activities.map(a => [a.name, a.type, a.activity_date, a.beneficiaries, a.volunteers, Number(a.funds_utilized).toLocaleString()]),
    headStyles: { fillColor: [30, 58, 95], textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [247, 248, 252] },
  });
  doc.save(`ImpactLens_${org?.name || "NGO"}_Q1_2025.pdf`);
};

// ─── CHART TOOLTIP ───────────────────────────────────────────────
const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.text, boxShadow: "0 4px 16px rgba(0,0,0,.1)" }}>
      <div style={{ color: C.textDim, fontSize: 11, marginBottom: 5, fontWeight: 500 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.text }}>
          {p.name}: <strong>{p.name === "donations" || p.name === "funds" ? `₹${Number(p.value).toLocaleString()}` : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ─── SCORE RING ──────────────────────────────────────────────────
const ScoreRing = ({ score = 82 }) => {
  const r = 50, cx = 65, cy = 65, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  const rows = [
    { label: "Fund Utilisation", val: "91%", pct: 91 },
    { label: "Beneficiary Reach", val: "78%", pct: 78 },
    { label: "Volunteer Hours", val: "84%", pct: 84 },
    { label: "Report Frequency", val: "75%", pct: 75 },
  ];
  return (
    <div>
      <div className="rw">
        <div className="rl">Transparency Score</div>
        <div className="rsw">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.raised} strokeWidth="9" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.blue} strokeWidth="9" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
          </svg>
          <div className="rc"><div className="rv">{score}</div><div className="rdl">/ 100</div></div>
        </div>
      </div>
      <div>
        {rows.map(row => (
          <div key={row.label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: C.textMd, fontWeight: 500 }}>{row.label}</span>
              <span style={{ color: C.blue, fontFamily: "'Geist Mono',monospace", fontSize: 11 }}>{row.val}</span>
            </div>
            <div className="prog"><div className="pf" style={{ width: `${row.pct}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── PAGE: DASHBOARD ─────────────────────────────────────────────
const Dashboard = ({ org, activities, volunteers, setPage }) => {
  const totB = activities.reduce((s, a) => s + (Number(a.beneficiaries) || 0), 0);
  const totF = activities.reduce((s, a) => s + (Number(a.funds_utilized) || 0), 0);
  const totV = activities.reduce((s, a) => s + (Number(a.volunteers) || 0), 0);
  const { costPerBeneficiary, retentionRate } = calcMetrics(activities);
  const grades = gradeActivities(activities);
  const topVols = [...volunteers].sort((a, b) => (b.hours_logged || 0) - (a.hours_logged || 0)).slice(0, 3);
  const pie = [
    { name: "Education", value: 42, color: C.blue },
    { name: "Healthcare", value: 28, color: C.green },
    { name: "Livelihood", value: 20, color: C.amber },
    { name: "Other", value: 10, color: C.textDim },
  ];
  return (
    <div className="content">
      <div className="sr">
        {[
          { label: "Total Beneficiaries", value: totB.toLocaleString(), delta: "+18% this month", icon: "users", accent: C.blue },
          { label: "Volunteers Deployed", value: totV.toString(), delta: "+7 this month", icon: "person", accent: C.green },
          { label: "Funds Utilised", value: `₹${(totF / 100000).toFixed(2)}L`, delta: "+24% vs prior month", icon: "bar", accent: C.amber },
          { label: "Programmes", value: activities.length.toString(), delta: `${activities.filter(a => a.status === "Active").length} active`, icon: "trending", accent: C.blue },
        ].map(s => (
          <div key={s.label} className="sc">
            <div className="sa" style={{ background: s.accent }} />
            <div className="si"><Icon name={s.icon} size={17} /></div>
            <div className="sl">{s.label}</div>
            <div className="sv">{s.value}</div>
            <div className="sd"><Icon name="trending" size={11} color={C.green} />{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="crt" style={{ marginBottom: 16 }}>
        {[
          { label: "Cost per Beneficiary", value: `₹${costPerBeneficiary.toLocaleString()}`, delta: "Lower is better", color: C.amber },
          { label: "Volunteer Retention", value: `${retentionRate}%`, delta: retentionRate >= 70 ? "Strong" : "Needs attention", color: retentionRate >= 50 ? C.green : C.red },
          { label: "Programmes Graded", value: activities.length.toString(), delta: "Relative ranking active", color: C.blue },
        ].map(s => (
          <div key={s.label} className="sc">
            <div className="sa" style={{ background: s.color }} />
            <div className="sl">{s.label}</div>
            <div className="sv">{s.value}</div>
            <div className="sd" style={{ color: s.color }}><Icon name="trending" size={11} color={s.color} />{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="cr">
        <div className="card">
          <div className="ch">
            <div><div className="ct">Impact Trend</div><div className="cs">Monthly beneficiaries & volunteers</div></div>
            <div style={{ display: "flex", gap: 14 }}>
              {[{ c: C.blue, l: "Beneficiaries" }, { c: C.green, l: "Volunteers" }].map(x => (
                <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.textMd }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: x.c }} />{x.l}
                </div>
              ))}
            </div>
          </div>
          <div className="cb" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={SEED.monthly}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.blue} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.green} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
                <Tooltip content={<CT />} />
                <Area type="monotone" dataKey="beneficiaries" stroke={C.blue} strokeWidth={2} fill="url(#ag)" name="beneficiaries" dot={false} />
                <Area type="monotone" dataKey="volunteers" stroke={C.green} strokeWidth={2} fill="url(#gg)" name="volunteers" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div><div className="ct">Trust Index</div><div className="cs">Donor confidence composite</div></div></div>
          <div className="cb"><ScoreRing score={82} /></div>
        </div>
      </div>
      <div className="cre">
        <div className="card">
          <div className="ch"><div><div className="ct">Fund Disbursement</div><div className="cs">Monthly utilisation (₹)</div></div></div>
          <div className="cb" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={SEED.monthly} barSize={20}>
                <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CT />} />
                <Bar dataKey="donations" fill={C.blue} radius={[3, 3, 0, 0]} name="donations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="ch">
            <div><div className="ct">Top Volunteers</div><div className="cs">By hours this quarter</div></div>
            <button className="btn bg bs" onClick={() => setPage("volunteers")}>View all</button>
          </div>
          <div>
            {topVols.map((v, i) => (
              <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", borderBottom: i < topVols.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: C.textDim, width: 18 }}>{i + 1}</div>
                <div className="va" style={{ width: 30, height: 30, fontSize: 13 }}>{v.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{v.role}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, color: C.blue, fontWeight: 500 }}>{v.hours_logged}h</div>
                  <div style={{ fontSize: 10, color: C.textDim }}>{v.events_attended} events</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="ch">
          <div className="ct">Recent Programmes</div>
          <button className="btn bp bs" onClick={() => setPage("log")}><Icon name="plus" size={13} />Log Activity</button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Programme</th><th>Type</th><th>Date</th><th>Volunteers</th><th>Beneficiaries</th><th>Cost/Person</th><th>Grade</th><th>Status</th></tr></thead>
            <tbody>
              {activities.slice(0, 5).map(a => {
                const grade = grades[a.id] || "C";
                const cpp = a.beneficiaries > 0 ? Math.round(a.funds_utilized / a.beneficiaries) : 0;
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.name}</td>
                    <td><span className="badge bd2">{a.type}</span></td>
                    <td className="mono">{a.activity_date}</td>
                    <td className="mono">{a.volunteers}</td>
                    <td className="mono">{a.beneficiaries}</td>
                    <td className="mono">₹{cpp.toLocaleString()}</td>
                    <td><span className={`score-badge score-${grade.toLowerCase()}`}>{grade}</span></td>
                    <td><span className={`badge ${a.status === "Active" ? "bb" : "bd2"}`}>{a.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: LOG ACTIVITY ──────────────────────────────────────────
const LogActivity = ({ org, onSave, setPage, showToast }) => {
  const [form, setForm] = useState({ name: "", type: "Education", activity_date: "", volunteers: "", beneficiaries: "", funds_utilized: "", location: "", description: "", status: "Active" });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async () => {
    if (!form.name || !form.activity_date) { showToast("Name and date are required.", "err"); return; }
    setLoading(true);
    try {
      const rec = await db.logActivity(org.id, { ...form, volunteers: +form.volunteers || 0, beneficiaries: +form.beneficiaries || 0, funds_utilized: +form.funds_utilized || 0 });
      onSave(rec); showToast("Activity saved."); setPage("dashboard");
    } catch { showToast("Failed to save.", "err"); }
    setLoading(false);
  };
  return (
    <div className="content">
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600 }}>Log Programme</div>
          <div style={{ fontSize: 13, color: C.textDim, marginTop: 4 }}>Record a field activity, camp, or training event</div>
        </div>
        <div className="card">
          <div className="cb">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="fd" style={{ gridColumn: "1 / -1" }}><label>Programme Name</label><input placeholder="e.g. Digital Literacy Drive — Kurla" value={form.name} onChange={e => set("name", e.target.value)} /></div>
              <div className="fd"><label>Type</label><select value={form.type} onChange={e => set("type", e.target.value)}>{["Education", "Healthcare", "Livelihood", "Environment", "Other"].map(t => <option key={t}>{t}</option>)}</select></div>
              <div className="fd"><label>Status</label><select value={form.status} onChange={e => set("status", e.target.value)}><option>Active</option><option>Completed</option><option>Planned</option></select></div>
              <div className="fd"><label>Date</label><input type="date" value={form.activity_date} onChange={e => set("activity_date", e.target.value)} /></div>
              <div className="fd"><label>Location</label><input placeholder="e.g. Dharavi, Mumbai" value={form.location} onChange={e => set("location", e.target.value)} /></div>
              <div className="fd"><label>Volunteers Deployed</label><input type="number" min="0" placeholder="0" value={form.volunteers} onChange={e => set("volunteers", e.target.value)} /></div>
              <div className="fd"><label>Beneficiaries Reached</label><input type="number" min="0" placeholder="0" value={form.beneficiaries} onChange={e => set("beneficiaries", e.target.value)} /></div>
              <div className="fd" style={{ gridColumn: "1 / -1" }}><label>Funds Utilised (₹)</label><input type="number" min="0" placeholder="0" value={form.funds_utilized} onChange={e => set("funds_utilized", e.target.value)} /></div>
              <div className="fd" style={{ gridColumn: "1 / -1" }}><label>Outcomes & Description</label><textarea placeholder="Describe key outcomes, challenges, and observations..." value={form.description} onChange={e => set("description", e.target.value)} style={{ minHeight: 100 }} /></div>
            </div>
          </div>
          <div className="mf">
            <button className="btn bg" onClick={() => setPage("dashboard")}>Cancel</button>
            <button className="btn bp" onClick={submit} disabled={loading}>{loading ? "Saving…" : <><Icon name="check" size={13} />Save Activity</>}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: VOLUNTEERS ────────────────────────────────────────────
const Volunteers = ({ org, volunteers, setVolunteers, showToast }) => {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", role: "Field Coordinator", email: "", phone: "", skills: "", hours_logged: 0, events_attended: 0 });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const volGrades = gradeVolunteers(volunteers);
  const sorted = [...volunteers].sort((a, b) => (b.hours_logged || 0) - (a.hours_logged || 0));
  const openAdd = () => { setEditing(null); setForm({ name: "", role: "Field Coordinator", email: "", phone: "", skills: "", hours_logged: 0, events_attended: 0 }); setModal(true); };
  const openEdit = (v) => { setEditing(v); setForm({ name: v.name, role: v.role || "Field Coordinator", email: v.email || "", phone: v.phone || "", skills: v.skills || "", hours_logged: v.hours_logged || 0, events_attended: v.events_attended || 0 }); setModal(true); };
  const submit = async () => {
    if (!form.name) { showToast("Name is required.", "err"); return; }
    setLoading(true);
    try {
      const payload = { ...form, hours_logged: +form.hours_logged || 0, events_attended: +form.events_attended || 0 };
      if (editing) {
        await db.updateVolunteer(editing.id, payload);
        setVolunteers(v => v.map(x => x.id === editing.id ? { ...x, ...payload } : x));
        showToast("Volunteer updated.");
      } else {
        const rec = await db.addVolunteer(org.id, payload);
        setVolunteers(v => [rec, ...v]);
        showToast("Volunteer registered.");
      }
      setModal(false);
    } catch { showToast("Failed to save.", "err"); }
    setLoading(false);
  };
  const deleteVol = async (id) => {
    if (!window.confirm("Remove this volunteer?")) return;
    try { await db.deleteVolunteer(id); setVolunteers(v => v.filter(x => x.id !== id)); showToast("Removed."); }
    catch { showToast("Failed.", "err"); }
  };
  return (
    <div className="content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600 }}>Volunteer Registry</div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 3 }}>{volunteers.length} registered · {volunteers.reduce((s, v) => s + (v.hours_logged || 0), 0).toLocaleString()} hours · Ranked relative to each other</div>
        </div>
        <button className="btn bp" onClick={openAdd}><Icon name="plus" size={13} />Register Volunteer</button>
      </div>
      <div className="vg">
        {sorted.map(v => {
          const perf = volGrades[v.id] || { label: "Moderate", cls: "ba2" };
          return (
            <div key={v.id} className="vc">
              <div className="vh">
                <div className="va">{v.name[0]}</div>
                <span className={`badge ${perf.cls}`}>{perf.label}</span>
              </div>
              <div className="vn">{v.name}</div>
              <div className="vr2">{v.role || "Volunteer"}</div>
              {v.email && <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{v.email}</div>}
              <div className="vs">
                <div><div className="vv">{v.hours_logged || 0}</div><div className="vl">Hours</div></div>
                <div><div className="vv">{v.events_attended || 0}</div><div className="vl">Events</div></div>
              </div>
              {perf.label === "Needs Engagement" && (
                <div style={{ marginTop: 10, padding: "8px 10px", background: C.amberDim, borderRadius: 6, fontSize: 11, color: C.amber, border: `1px solid #FCD34D` }}>
                  Low activity vs peers — consider reaching out to re-engage.
                </div>
              )}
              <div className="vc-actions">
                <div className="vc-btn" onClick={() => openEdit(v)}>Edit</div>
                <div className="vc-btn del" onClick={() => deleteVol(v.id)}>Remove</div>
              </div>
            </div>
          );
        })}
      </div>
      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="mh"><div className="mt">{editing ? "Edit Volunteer" : "Register Volunteer"}</div><div className="ms">{editing ? "Update details, hours and events" : "Add a new member to your registry"}</div></div>
            <div className="mb">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="fd"><label>Full Name</label><input placeholder="Full name" value={form.name} onChange={e => set("name", e.target.value)} /></div>
                <div className="fd"><label>Role</label><select value={form.role} onChange={e => set("role", e.target.value)}>{["Field Coordinator", "Healthcare Lead", "Tech Volunteer", "Data Analyst", "Community Outreach", "Logistics", "Other"].map(r => <option key={r}>{r}</option>)}</select></div>
                <div className="fd"><label>Email</label><input type="email" placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} /></div>
                <div className="fd"><label>Phone</label><input placeholder="+91 99999 99999" value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
                <div className="fd"><label>Hours Logged</label><input type="number" min="0" value={form.hours_logged} onChange={e => set("hours_logged", e.target.value)} /></div>
                <div className="fd"><label>Events Attended</label><input type="number" min="0" value={form.events_attended} onChange={e => set("events_attended", e.target.value)} /></div>
                <div className="fd" style={{ gridColumn: "1 / -1" }}><label>Skills</label><input placeholder="e.g. Teaching, First Aid, Data Entry" value={form.skills} onChange={e => set("skills", e.target.value)} /></div>
              </div>
            </div>
            <div className="mf">
              <button className="btn bg" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn bp" onClick={submit} disabled={loading}>{loading ? "Saving…" : editing ? "Update" : "Register"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PAGE: REPORTS ───────────────────────────────────────────────
const Reports = ({ org, activities, showToast }) => {
  const totB = activities.reduce((s, a) => s + (Number(a.beneficiaries) || 0), 0);
  const totF = activities.reduce((s, a) => s + (Number(a.funds_utilized) || 0), 0);
  const { costPerBeneficiary } = calcMetrics(activities);
  const grades = gradeActivities(activities);
  const [pdfLoading, setPdfLoading] = useState(false);

  const openInClaude = () => {
    const summary = activities.slice(0, 5).map(a => `${a.name} (${a.type}): ${a.beneficiaries} beneficiaries, ${a.volunteers} volunteers, ₹${a.funds_utilized} utilised`).join("; ");
    const prompt = `You are writing a donor impact narrative for ${org?.name || "an NGO"} based in ${org?.city || "India"}. Here is their Q1 2025 programme data: ${summary}. Total beneficiaries: ${totB}. Total funds utilised: ₹${totF}. Cost per beneficiary: ₹${costPerBeneficiary}. Write a compelling, concise 3-paragraph impact narrative (around 150 words) for a donor report. Be specific, human, and data-driven. No bullet points.`;
    window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, "_blank");
  };

  const handlePDF = async () => {
    setPdfLoading(true);
    try { await exportPDF(org, activities); showToast("PDF exported."); }
    catch { showToast("PDF export failed.", "err"); }
    setPdfLoading(false);
  };

  const bkd = [
    { label: "Education Programmes", amount: Math.round(totF * 0.40), pct: 40 },
    { label: "Healthcare Camps", amount: Math.round(totF * 0.28), pct: 28 },
    { label: "Livelihood Training", amount: Math.round(totF * 0.20), pct: 20 },
    { label: "Operations", amount: Math.round(totF * 0.12), pct: 12 },
  ];

  return (
    <div className="content">
      <div style={{ background: `linear-gradient(135deg,${C.navy},#1E3A8A)`, borderRadius: 12, padding: "28px 32px", marginBottom: 18, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Impact Report — Q1 2025</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>{org?.name || "NGO"} · January – March 2025</div>
          <div style={{ display: "flex", gap: 28, marginTop: 18, flexWrap: "wrap" }}>
            {[[totB.toLocaleString(), "Beneficiaries"], ["38", "Volunteers"], [`₹${(totF / 100000).toFixed(2)}L`, "Utilised"], ["82", "Trust Score"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button className="btn bs" style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,.2)" }} onClick={handlePDF} disabled={pdfLoading}><Icon name="download" size={13} />{pdfLoading ? "Exporting…" : "Export PDF"}</button>
          <button className="btn bs" style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,.2)" }} onClick={() => copyToClipboard(window.location.href, showToast)}><Icon name="share" size={13} />Share</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="ch"><div><div className="ct">AI Impact Narrative</div><div className="cs">Let Claude write your donor report from your real programme data</div></div></div>
        <div className="cb">
          <div className="ai-hero">
            <div className="ai-hero-title">Generate your donor narrative in seconds</div>
            <div className="ai-hero-desc">Click below and Claude opens with your NGO's programme data already written into the prompt — beneficiaries, funds, outcomes. Get a professional donor narrative instantly.</div>
            <button className="ai-open-btn" onClick={openInClaude}>
              <AnthropicIcon size={18} />Open in Claude
            </button>
            <div className="ai-powered">
              <AnthropicIcon size={13} />
              <span>Powered by Claude · Anthropic</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cre">
        <div className="card">
          <div className="ch"><div><div className="ct">Beneficiary Growth</div><div className="cs">Month-over-month</div></div></div>
          <div className="cb" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={SEED.monthly}>
                <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
                <Tooltip content={<CT />} />
                <Line type="monotone" dataKey="beneficiaries" stroke={C.blue} strokeWidth={2} dot={{ fill: C.blue, r: 3, strokeWidth: 0 }} name="beneficiaries" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div><div className="ct">Financial Summary</div><div className="cs">Fund utilisation by programme</div></div></div>
          <div className="cb">
            {bkd.map(row => (
              <div key={row.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: C.textMd, fontWeight: 500 }}>{row.label}</span>
                  <span className="mono">₹{row.amount.toLocaleString()}</span>
                </div>
                <div className="prog"><div className="pf" style={{ width: `${row.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="ch"><div><div className="ct">Programme Impact Scores</div><div className="cs">Graded relative to each other within your portfolio</div></div></div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Programme</th><th>Grade</th><th>Suggestion</th></tr></thead>
            <tbody>
              {activities.map(a => {
                const grade = grades[a.id] || "C";
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.name}</td>
                    <td><span className={`score-badge score-${grade.toLowerCase()}`}>{grade}</span></td>
                    <td style={{ color: C.textMd, fontSize: 12 }}>{getSuggestion(a, grade)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="ch"><div className="ct">All Programmes</div></div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Programme</th><th>Type</th><th>Date</th><th>Beneficiaries</th><th>Cost/Person</th><th>Funds</th><th>Status</th></tr></thead>
            <tbody>
              {activities.map(a => {
                const cpp = a.beneficiaries > 0 ? Math.round(a.funds_utilized / a.beneficiaries) : 0;
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.name}</td>
                    <td><span className="badge bd2">{a.type}</span></td>
                    <td className="mono">{a.activity_date}</td>
                    <td className="mono">{a.beneficiaries}</td>
                    <td className="mono">₹{cpp.toLocaleString()}</td>
                    <td className="mono">₹{Number(a.funds_utilized).toLocaleString()}</td>
                    <td><span className={`badge ${a.status === "Active" ? "bb" : "bd2"}`}>{a.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: ANALYTICS ─────────────────────────────────────────────
const Analytics = ({ activities }) => {
  const pred = calcPredictions();
  const { costPerBeneficiary, retentionRate } = calcMetrics(activities);
  const forecastData = [...SEED.monthly, { month: "Apr*", beneficiaries: pred.beneficiaries, volunteers: pred.volunteers, donations: pred.funds }];
  const insights = [
    { color: C.blue, text: `Beneficiary reach is projected to grow ${pred.bGrowth > 0 ? "+" : ""}${pred.bGrowth}% next month — on track to exceed ${Math.round(pred.beneficiaries / 100) * 100} people.` },
    { color: pred.bGrowth > 10 ? C.green : C.amber, text: `At ₹${costPerBeneficiary} per beneficiary, cost efficiency is ${costPerBeneficiary < 150 ? "excellent" : costPerBeneficiary < 300 ? "average" : "high"}. ${costPerBeneficiary > 300 ? "Consolidate smaller programmes to reduce overhead." : "Maintain current resource allocation."}` },
    { color: retentionRate >= 70 ? C.green : C.amber, text: `Volunteer retention stands at ${retentionRate}%. ${retentionRate < 70 ? "Recognition programmes and flexible scheduling improve retention significantly." : "Strong. Consider building a volunteer leadership track."}` },
    { color: C.navy, text: `Fund disbursement is trending ${pred.fGrowth > 0 ? "upward" : "downward"} at ${Math.abs(pred.fGrowth)}% month-over-month. ${pred.fGrowth > 15 ? "Strong donor confidence — a good time to approach institutional funders." : "Focus on retention through quarterly impact reports."}` },
  ];
  return (
    <div className="content">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600 }}>Predictive Analytics</div>
        <div style={{ fontSize: 12, color: C.textDim, marginTop: 3 }}>Next-month forecasts based on your 6-month trend</div>
      </div>
      <div className="crt" style={{ marginBottom: 16 }}>
        {[
          { label: "Predicted Beneficiaries", value: pred.beneficiaries.toLocaleString(), delta: `${pred.bGrowth > 0 ? "+" : ""}${pred.bGrowth}% vs this month`, color: pred.bGrowth > 0 ? C.blue : C.red },
          { label: "Predicted Volunteers", value: pred.volunteers.toString(), delta: `${pred.vGrowth > 0 ? "+" : ""}${pred.vGrowth}% vs this month`, color: pred.vGrowth > 0 ? C.green : C.red },
          { label: "Predicted Fund Need", value: `₹${(pred.funds / 1000).toFixed(0)}k`, delta: `${pred.fGrowth > 0 ? "+" : ""}${pred.fGrowth}% vs this month`, color: C.amber },
        ].map(s => (
          <div key={s.label} className="pred-card">
            <div className="pred-lbl">{s.label}</div>
            <div className="pred-val">{s.value}</div>
            <div className="pred-delta" style={{ color: s.color }}><Icon name="trending" size={11} color={s.color} />{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="ch"><div><div className="ct">6-Month Forecast</div><div className="cs">Apr* is model-generated</div></div></div>
        <div className="cb" style={{ paddingTop: 8 }}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.blue} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Area type="monotone" dataKey="beneficiaries" stroke={C.blue} strokeWidth={2} fill="url(#fg2)" name="beneficiaries"
                dot={(props) => {
                  const isLast = props.index === forecastData.length - 1;
                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={isLast ? 5 : 3} fill={isLast ? C.amber : C.blue} strokeWidth={0} />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <div className="ch"><div><div className="ct">Data-Driven Insights</div><div className="cs">Actionable recommendations from your trends</div></div></div>
        <div className="cb" style={{ padding: "6px 20px" }}>
          {insights.map((ins, i) => (
            <div key={i} className="insight-row">
              <div className="insight-dot" style={{ background: ins.color }} />
              <div className="insight-text">{ins.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: ABOUT ─────────────────────────────────────────────────
const About = () => (
  <div className="content">
    <div className="about-hero">
      <div className="about-title">Measuring what matters.<br /><em>Impact, not just intent.</em></div>
      <div className="about-subtitle">ImpactLens was built on a simple belief: India's NGOs do extraordinary work, but most lack the financial analytics tools to prove it to the donors and institutions that could scale their impact.</div>
    </div>
    <div className="cre">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card">
          <div className="ch"><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Icon name="about" size={17} color={C.blue} />Our Story</div></div>
          <div className="cb">
            <div className="about-body">
              This platform grew out of a genuine passion at the intersection of two fields — finance and technology. While exploring how financial analysis and computer science can drive better decision-making, one sector kept standing out as underserved: India's NGO community.
              <br /><br />
              These organisations work tirelessly in education, healthcare, and livelihoods. Yet many struggle to articulate their impact in the structured, data-driven language that grant committees and corporate donors actually respond to. A field coordinator running health camps in Dharavi shouldn't need to be a financial analyst to demonstrate that her programme serves 380 people at ₹82 per beneficiary. That story should tell itself. ImpactLens was built to make that happen — automatically, for any NGO, regardless of their technical capacity.
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Icon name="trending" size={17} color={C.blue} />Finance Meets Social Impact</div></div>
          <div className="cb">
            <div className="about-body">
              The most underfunded NGOs are often the most effective — they simply lack the tools to demonstrate that effectiveness in quantifiable terms. ImpactLens applies financial analysis frameworks to social sector data: cost per beneficiary, fund utilisation ratios, volunteer retention rates, programme-level impact scoring.
              <br /><br />
              Programmes are graded relative to each other — not against arbitrary benchmarks. The analytics adapt to the organisation. Predictive modelling then helps NGOs plan forward, forecasting next month's resource needs so they approach donors proactively, not reactively.
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card">
          <div className="ch"><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Icon name="shield" size={17} color={C.blue} />How ImpactLens Helps</div></div>
          <div className="cb">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: "bar", title: "Financial Transparency", text: "Fund utilisation reports that show donors exactly where every rupee went." },
                { icon: "predict", title: "Forward Planning", text: "Predictive models forecast next month's resource needs from historical trends." },
                { icon: "sparkle", title: "AI Donor Reports", text: "Claude reads your data and writes compelling donor narratives in seconds." },
                { icon: "users", title: "Volunteer Intelligence", text: "Track performance, surface top contributors, flag those needing re-engagement." },
              ].map(c => (
                <div key={c.title} className="about-card">
                  <div className="about-card-icon"><Icon name={c.icon} size={16} color={C.blue} /></div>
                  <div className="about-card-title">{c.title}</div>
                  <div className="about-card-text">{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Icon name="heart" size={17} color={C.blue} />Our Model</div></div>
          <div className="cb">
            <div className="about-body">ImpactLens is free for all NGOs — always. We operate on a pay-what-you-can philosophy because access to good financial tooling should not be a privilege. If ImpactLens helps your organisation secure more funding or deliver more impact, a voluntary contribution keeps the platform running.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── PAGE: CONTACT ───────────────────────────────────────────────
const ContactPage = () => {
  const [contactState, contactSubmit] = useForm("xpqojqze");
  const [feedbackState, feedbackSubmit] = useForm("xpqojqze");
  return (
    <div className="content">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600 }}>Get in Touch</div>
        <div style={{ fontSize: 12, color: C.textDim, marginTop: 3 }}>Reach out to onboard your NGO, ask questions, or share feedback</div>
      </div>
      <div className="contact-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="ch"><div className="ct">Contact & Enquiries</div></div>
            <div className="cb">
              {contactState.succeeded ? (
                <div className="form-success"><Icon name="check" size={22} color={C.green} /><div style={{ marginTop: 10, fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600 }}>Message received</div><div style={{ fontSize: 12, marginTop: 4 }}>We'll respond within 24 hours.</div></div>
              ) : (
                <form onSubmit={contactSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  <div className="fd"><label>Your Name</label><input type="text" name="name" placeholder="Organisation or individual name" required /></div>
                  <div className="fd"><label>Email</label><input type="email" name="email" placeholder="your@email.com" required /><ValidationError field="email" prefix="Email" errors={contactState.errors} className="form-error-msg" /></div>
                  <div className="fd"><label>Type of Enquiry</label><select name="enquiry_type"><option>Onboard my NGO</option><option>Partnership opportunity</option><option>Technical support</option><option>General question</option></select></div>
                  <div className="fd"><label>Message</label><textarea name="message" placeholder="Tell us about your NGO or what you need..." required /><ValidationError field="message" prefix="Message" errors={contactState.errors} className="form-error-msg" /></div>
                  <button type="submit" className="btn bp bs" style={{ alignSelf: "flex-start" }} disabled={contactState.submitting}><Icon name="mail" size={13} />{contactState.submitting ? "Sending…" : "Send Message"}</button>
                </form>
              )}
            </div>
          </div>
          <div className="card">
            <div className="ch"><div className="ct">Direct Contact</div></div>
            <div className="cb" style={{ padding: "12px 20px" }}>
              {[
                { label: "Platform Enquiries", val: "alisiddiq1804@gmail.com", icon: "mail" },
                { label: "For NGOs", val: "Register via the form — we respond within 24 hours", icon: "users" },
                { label: "Built with", val: "React · Supabase · Vercel", icon: "leaf" },
              ].map(item => (
                <div key={item.label} className="contact-item">
                  <div style={{ marginTop: 2 }}><Icon name={item.icon} size={15} color={C.blue} /></div>
                  <div><div className="contact-item-label">{item.label}</div><div className="contact-item-val">{item.val}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div className="ct">Platform Feedback</div></div>
          <div className="cb">
            {feedbackState.succeeded ? (
              <div className="form-success"><Icon name="check" size={22} color={C.green} /><div style={{ marginTop: 10, fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600 }}>Thank you</div><div style={{ fontSize: 12, marginTop: 4 }}>Your feedback helps us improve for every NGO.</div></div>
            ) : (
              <form onSubmit={feedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <div className="fd"><label>Email (optional)</label><input type="email" name="email" placeholder="Leave blank to stay anonymous" /></div>
                <div className="fd"><label>How would you rate ImpactLens?</label><select name="rating"><option>Excellent — exactly what NGOs need</option><option>Good — a few things could improve</option><option>Average — needs significant work</option><option>Poor — not useful yet</option></select></div>
                <div className="fd"><label>What would make ImpactLens more useful?</label><textarea name="feedback" placeholder="Features, improvements, or anything on your mind..." required /><ValidationError field="feedback" prefix="Feedback" errors={feedbackState.errors} className="form-error-msg" /></div>
                <button type="submit" className="btn bg bs" style={{ alignSelf: "flex-start" }} disabled={feedbackState.submitting}><Icon name="message" size={13} />{feedbackState.submitting ? "Sending…" : "Submit Feedback"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AUTH PAGE ───────────────────────────────────────────────────
const AuthPage = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [orgName, setOrgName] = useState(""); const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const submit = async () => {
    setErr(""); setLoading(true);
    if (isDemo) { onAuth({ id: "demo" }, SEED.org); setLoading(false); return; }
    try {
      if (mode === "login") {
        const { data, error: e } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (e) throw e;
        const org = await db.getOrg(data.user.id);
        onAuth(data.user, org);
      } else {
        const { data, error: e } = await supabase.auth.signUp({ email, password: pw });
        if (e) throw e;
        const org = await db.createOrg(data.user.id, { name: orgName, city });
        onAuth(data.user, org);
      }
    } catch (e) { setErr(e.message || "Authentication failed."); }
    setLoading(false);
  };
  return (
    <div className="aw">
      <div className="ac">
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28 }}>
          <div className="lm"><Icon name="leaf" size={14} color={C.blue} /></div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600 }}>ImpactLens</span>
        </div>
        <div className="att">{mode === "login" ? "Welcome back" : "Register your NGO"}</div>
        <div className="ats">{mode === "login" ? "Sign in to your organisation's dashboard" : "Create an account to get started"}</div>
        {err && <div className="aerr"><Icon name="info" size={14} color={C.red} />{err}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {mode === "signup" && <>
            <div className="fd"><label>Organisation Name</label><input placeholder="Shiksha Foundation" value={orgName} onChange={e => setOrgName(e.target.value)} /></div>
            <div className="fd"><label>City</label><input placeholder="Mumbai" value={city} onChange={e => setCity(e.target.value)} /></div>
          </>}
          <div className="fd"><label>Email</label><input type="email" placeholder="admin@ngo.org" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="fd"><label>Password</label><input type="password" placeholder="••••••••" value={pw} onChange={e => setPw(e.target.value)} /></div>
          <button className="btn bp" style={{ width: "100%", justifyContent: "center", padding: "11px", marginTop: 4 }} onClick={submit} disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
        {isDemo && <div className="demo-note">Demo mode — click Sign In to explore with sample data.</div>}
        <div className="asw">
          {mode === "login" ? <>No account? <span className="aln" onClick={() => setMode("signup")}>Register your NGO</span></> : <>Already registered? <span className="aln" onClick={() => setMode("login")}>Sign in</span></>}
        </div>
      </div>
    </div>
  );
};

// ─── LANDING PAGE ────────────────────────────────────────────────
const Landing = ({ onEnter }) => (
  <div className="landing">
    <nav className="lnav">
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div className="lm"><Icon name="leaf" size={14} color={C.blue} /></div>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 600, color: C.text }}>ImpactLens</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn bg bs" onClick={onEnter}>Sign in</button>
        <button className="btn bp bs" onClick={onEnter}>Get started free</button>
      </div>
    </nav>
    <div className="lhero">
      <div className="ley"><Icon name="shield" size={11} color={C.blue} />Built for Indian NGOs</div>
      <div className="ltitle">Turn your impact data into<br /><em>donor trust</em></div>
      <div className="ldesc">Log activities. Track beneficiaries. Generate transparent financial reports — and let AI write the donor narrative for you.</div>
      <div className="lacts">
        <button className="btn bp bll" onClick={onEnter}>Start free <Icon name="arrow" size={14} /></button>
        <span style={{ fontSize: 12, color: C.textDim }}>Pay what you can · No lock-in</span>
      </div>
    </div>
    <div className="lfeats">
      {[
        { icon: "sparkle", title: "AI Impact Narratives", desc: "Claude reads your programme data and writes a compelling donor report in seconds — no writing required." },
        { icon: "predict", title: "Predictive Analytics", desc: "Forecast next month's beneficiary reach, volunteer needs, and fund requirements from your real trends." },
        { icon: "bar", title: "Financial Transparency", desc: "Cost per beneficiary, fund utilisation breakdowns, and a transparency score — the numbers that move donors." },
      ].map(f => (
        <div key={f.title} className="fc">
          <div className="fi"><Icon name={f.icon} size={22} color={C.blue} /></div>
          <div className="ftt">{f.title}</div>
          <div className="fd2">{f.desc}</div>
        </div>
      ))}
    </div>
    <div className="lfoot">
      <div className="lft">© 2025 ImpactLens · Built for India's NGO sector</div>
      <div className="lft">Pay what you can · 80G eligible contributions</div>
    </div>
  </div>
);

// ─── SIGN OUT MODAL ──────────────────────────────────────────────
const SignOutModal = ({ onConfirm, onCancel }) => (
  <div className="overlay" onClick={onCancel}>
    <div className="modal" style={{ width: 360 }} onClick={e => e.stopPropagation()}>
      <div className="mh"><div className="mt">Sign out?</div><div className="ms">You'll need to sign in again to access your dashboard.</div></div>
      <div className="mf">
        <button className="btn bg" onClick={onCancel}>Cancel</button>
        <button className="btn bp" onClick={onConfirm}><Icon name="logout" size={13} />Sign out</button>
      </div>
    </div>
  </div>
);

// ─── NAV CONFIG ──────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",  icon: "grid",    label: "Overview" },
  { id: "log",        icon: "edit",    label: "Log Activity" },
  { id: "volunteers", icon: "users",   label: "Volunteers" },
  { id: "reports",    icon: "file",    label: "Reports" },
  { id: "analytics",  icon: "predict", label: "Analytics" },
  { id: "about",      icon: "about",   label: "About" },
  { id: "contact",    icon: "mail",    label: "Contact" },
];

const PAGE_META = {
  dashboard:  ["Overview",     "Q1 2025"],
  log:        ["Log Activity", "Record a new programme"],
  volunteers: ["Volunteers",   "Registry & performance"],
  reports:    ["Reports",      "AI-powered donor documents"],
  analytics:  ["Analytics",    "Predictions & insights"],
  about:      ["About",        "Our story & philosophy"],
  contact:    ["Contact",      "Get in touch"],
};

const BOTTOM_NAV = [
  { id: "dashboard",  icon: "grid",    label: "Home" },
  { id: "log",        icon: "edit",    label: "Log" },
  { id: "reports",    icon: "file",    label: "Reports" },
  { id: "analytics",  icon: "predict", label: "Analytics" },
  { id: "more",       icon: "more",    label: "More" },
];

const MORE_ITEMS = [
  { id: "volunteers", icon: "users",   label: "Volunteers" },
  { id: "about",      icon: "about",   label: "About" },
  { id: "contact",    icon: "mail",    label: "Contact" },
];

// ─── ROOT APP ────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [activities, setActivities] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const showToast = useCallback((msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const onAuth = async (u, o) => {
    setUser(u); setOrg(o); setDataLoading(true);
    const [acts, vols] = await Promise.all([db.getActivities(o.id), db.getVolunteers(o.id)]);
    setActivities(acts); setVolunteers(vols);
    setDataLoading(false); setView("app");
  };

  const onLogout = () => {
    if (!isDemo) supabase.auth.signOut();
    setUser(null); setOrg(null); setView("landing"); setPage("dashboard"); setShowSignOut(false);
  };

  const navTo = (id) => {
    setPage(id); setShowMore(false);
  };

  const onSaveActivity = rec => setActivities(prev => [rec, ...prev]);
  const [title, sub] = PAGE_META[page] || ["", ""];

  if (view === "landing") return (<><style>{css}</style><Landing onEnter={() => setView("auth")} /></>);
  if (view === "auth")    return (<><style>{css}</style><AuthPage onAuth={onAuth} /></>);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="lm"><Icon name="leaf" size={14} color={C.blue} /></div>
            <span className="ln">ImpactLens</span>
          </div>
          <nav className="nav">
            <div className="ngl">Main</div>
            {NAV.slice(0, 5).map(n => (
              <button key={n.id} className={`ni ${page === n.id ? "active" : ""}`} onClick={() => navTo(n.id)}>
                <Icon name={n.icon} size={15} color={page === n.id ? C.blue : C.textDim} />{n.label}
              </button>
            ))}
            <div className="ngl" style={{ marginTop: 6 }}>Platform</div>
            {NAV.slice(5).map(n => (
              <button key={n.id} className={`ni ${page === n.id ? "active" : ""}`} onClick={() => navTo(n.id)}>
                <Icon name={n.icon} size={15} color={page === n.id ? C.blue : C.textDim} />{n.label}
              </button>
            ))}
          </nav>
          <div className="sb-footer">
            <div className="op" onClick={() => setShowSignOut(true)}>
              <div className="oa">{org?.name?.[0] || "N"}</div>
              <div><div className="on">{org?.name || "Organisation"}</div><div className="ot">{org?.city || "NGO"} · Sign out</div></div>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="tb">
            <div className="tbl">
              <div className="tbt">{title}</div>
              <div className="tbs">{org?.name ? `${org.name} · ` : ""}{sub}</div>
            </div>
            <div className="tbr">
              <button className="btn bg bs" onClick={() => setView("landing")}>
                <Icon name="arrow" size={12} color={C.textDim} style={{ transform: "rotate(180deg)" }} />Landing
              </button>
              {page === "dashboard" && <button className="btn bp bs" onClick={() => navTo("log")}><Icon name="plus" size={13} />Log Activity</button>}
            </div>
          </div>

          {dataLoading ? (
            <div className="loader"><div className="spin" />Loading data…</div>
          ) : (
            <>
              {page === "dashboard"  && <Dashboard org={org} activities={activities} volunteers={volunteers} setPage={navTo} />}
              {page === "log"        && <LogActivity org={org} onSave={onSaveActivity} setPage={navTo} showToast={showToast} />}
              {page === "volunteers" && <Volunteers org={org} volunteers={volunteers} setVolunteers={setVolunteers} showToast={showToast} />}
              {page === "reports"    && <Reports org={org} activities={activities} showToast={showToast} />}
              {page === "analytics"  && <Analytics activities={activities} />}
              {page === "about"      && <About />}
              {page === "contact"    && <ContactPage />}
            </>
          )}
        </div>

        {/* MOBILE BOTTOM NAV */}
        <div className="bottom-nav">
          <div className="bottom-nav-inner">
            {BOTTOM_NAV.map(n => (
              <button key={n.id} className={`bn-item ${page === n.id || (n.id === "more" && showMore) ? "active" : ""}`}
                onClick={() => n.id === "more" ? setShowMore(s => !s) : navTo(n.id)}>
                <Icon name={n.icon} size={20} color={(page === n.id || (n.id === "more" && showMore)) ? C.blue : C.textDim} />
                <span>{n.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MORE SHEET */}
        {showMore && (
          <div className="more-sheet" onClick={e => e.stopPropagation()}>
            {MORE_ITEMS.map(item => (
              <div key={item.id} className={`more-item ${page === item.id ? "active" : ""}`} onClick={() => navTo(item.id)}>
                <Icon name={item.icon} size={18} color={page === item.id ? C.blue : C.textMd} />
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {showSignOut && <SignOutModal onConfirm={onLogout} onCancel={() => setShowSignOut(false)} />}

      {toast && (
        <div className={`toast ${toast.type === "err" ? "err" : ""}`}>
          <Icon name={toast.type === "err" ? "x" : "check"} size={14} color="#fff" />
          {toast.msg}
        </div>
      )}
    </>
  );
}
