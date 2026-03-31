import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ─── SUPABASE CONFIG ────────────────────────────────────────────
// Replace these with your own project URL and anon key from supabase.com
const SUPABASE_URL = "https://afhioirxrjaxcieqimlo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaGlvaXJ4cmpheGNpZXFpbWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTY5OTAsImV4cCI6MjA5MDUzMjk5MH0.FW1c42k1VfrGxGxEMooPAMNHHuaoe4EnDavdPD_Ej1E";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── DESIGN TOKENS ─────────────────────────────────────────────
const C = {
  bg:       "#0E0F0F",
  surface:  "#161818",
  raised:   "#1C1E1E",
  border:   "#272A2A",
  borderLt: "#313535",
  text:     "#F0EDE8",
  textMd:   "#9A9690",
  textDim:  "#5C5A57",
  green:    "#4E9D6B",
  greenLt:  "#6BBF87",
  greenDim: "#1E3328",
  amber:    "#C8892A",
  amberDim: "#2E2010",
  red:      "#C04A3C",
  blue:     "#3E7CB1",
};

// ─── SVG ICON LIBRARY ───────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor", strokeWidth = 1.5 }) => {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    grid:    <svg style={s} viewBox="0 0 24 24"><rect {...p} x="3" y="3" width="7" height="7" rx="1"/><rect {...p} x="14" y="3" width="7" height="7" rx="1"/><rect {...p} x="3" y="14" width="7" height="7" rx="1"/><rect {...p} x="14" y="14" width="7" height="7" rx="1"/></svg>,
    edit:    <svg style={s} viewBox="0 0 24 24"><path {...p} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path {...p} d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    users:   <svg style={s} viewBox="0 0 24 24"><path {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle {...p} cx="9" cy="7" r="4"/><path {...p} d="M23 21v-2a4 4 0 0 0-3-3.87"/><path {...p} d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    file:    <svg style={s} viewBox="0 0 24 24"><path {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline {...p} points="14 2 14 8 20 8"/><line {...p} x1="16" y1="13" x2="8" y2="13"/><line {...p} x1="16" y1="17" x2="8" y2="17"/></svg>,
    heart:   <svg style={s} viewBox="0 0 24 24"><path {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    trending:<svg style={s} viewBox="0 0 24 24"><polyline {...p} points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline {...p} points="17 6 23 6 23 12"/></svg>,
    download:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline {...p} points="7 10 12 15 17 10"/><line {...p} x1="12" y1="15" x2="12" y2="3"/></svg>,
    share:   <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="18" cy="5" r="3"/><circle {...p} cx="6" cy="12" r="3"/><circle {...p} cx="18" cy="19" r="3"/><line {...p} x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line {...p} x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    plus:    <svg style={s} viewBox="0 0 24 24"><line {...p} x1="12" y1="5" x2="12" y2="19"/><line {...p} x1="5" y1="12" x2="19" y2="12"/></svg>,
    arrow:   <svg style={s} viewBox="0 0 24 24"><line {...p} x1="5" y1="12" x2="19" y2="12"/><polyline {...p} points="12 5 19 12 12 19"/></svg>,
    check:   <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="20 6 9 17 4 12"/></svg>,
    x:       <svg style={s} viewBox="0 0 24 24"><line {...p} x1="18" y1="6" x2="6" y2="18"/><line {...p} x1="6" y1="6" x2="18" y2="18"/></svg>,
    leaf:    <svg style={s} viewBox="0 0 24 24"><path {...p} d="M2 22c0 0 4-2 8-6s8-10 12-14c0 0-8 0-14 6S2 22 2 22z"/></svg>,
    bar:     <svg style={s} viewBox="0 0 24 24"><line {...p} x1="18" y1="20" x2="18" y2="10"/><line {...p} x1="12" y1="20" x2="12" y2="4"/><line {...p} x1="6" y1="20" x2="6" y2="14"/></svg>,
    shield:  <svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    person:  <svg style={s} viewBox="0 0 24 24"><path {...p} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle {...p} cx="12" cy="7" r="4"/></svg>,
    info:    <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="10"/><line {...p} x1="12" y1="8" x2="12" y2="12"/><line {...p} x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  };
  return icons[name] || null;
};

// ─── CSS ────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Geist+Mono:wght@300;400;500&family=Instrument+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:${C.bg};--sf:${C.surface};--rs:${C.raised};--bd:${C.border};--bdl:${C.borderLt};--tx:${C.text};--txm:${C.textMd};--txd:${C.textDim};--gr:${C.green};--grl:${C.greenLt};--grd:${C.greenDim};--am:${C.amber};--rd:${C.red};--bl:${C.blue}}
  html,body{height:100%;background:var(--bg);color:var(--tx)}
  body{font-family:'Instrument Sans',sans-serif;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
  .app{display:flex;height:100vh;overflow:hidden}
  .sidebar{width:220px;min-width:220px;background:var(--sf);border-right:1px solid var(--bd);display:flex;flex-direction:column;height:100vh}
  .sb-logo{padding:22px 18px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:10px}
  .lm{width:28px;height:28px;background:var(--grd);border:1px solid var(--gr);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--gr);flex-shrink:0}
  .ln{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:var(--tx)}
  .nav{padding:10px 8px;flex:1;overflow-y:auto}
  .ngl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--txd);padding:10px 10px 5px}
  .ni{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:6px;cursor:pointer;color:var(--txm);font-size:13px;border:none;background:none;width:100%;text-align:left;transition:color .15s,background .15s}
  .ni:hover{background:var(--rs);color:var(--tx)}
  .ni.active{background:var(--grd);color:var(--grl);font-weight:500}
  .sb-footer{border-top:1px solid var(--bd);padding:12px}
  .op{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:6px;background:var(--rs);cursor:pointer}
  .oa{width:28px;height:28px;border-radius:5px;background:var(--grd);border:1px solid var(--gr);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--grl);flex-shrink:0}
  .on{font-size:12px;color:var(--tx);font-weight:500;line-height:1.3}
  .ot{font-size:10px;color:var(--txd)}
  .main{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .tb{height:56px;min-height:56px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;padding:0 26px;background:var(--sf)}
  .tbl{display:flex;align-items:baseline;gap:12px}
  .tbt{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--tx)}
  .tbs{font-size:11px;color:var(--txd)}
  .tbr{display:flex;align-items:center;gap:8px}
  .content{flex:1;overflow-y:auto;padding:26px}
  .btn{display:inline-flex;align-items:center;gap:6px;border:none;cursor:pointer;border-radius:6px;font-family:'Instrument Sans',sans-serif;font-size:12.5px;font-weight:500;padding:7px 14px;transition:all .15s;letter-spacing:.2px;white-space:nowrap}
  .bp{background:var(--gr);color:#fff}.bp:hover{background:var(--grl)}
  .bg{background:transparent;color:var(--txm);border:1px solid var(--bd)}.bg:hover{border-color:var(--bdl);color:var(--tx)}
  .bs{padding:5px 10px;font-size:11.5px}
  .card{background:var(--sf);border:1px solid var(--bd);border-radius:10px}
  .ch{padding:16px 20px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between}
  .ct{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--tx)}
  .cs{font-size:11px;color:var(--txd);margin-top:2px}
  .cb{padding:20px}
  .sr{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
  .sc{background:var(--sf);border:1px solid var(--bd);border-radius:10px;padding:18px;position:relative;overflow:hidden}
  .sa{position:absolute;bottom:0;left:0;right:0;height:2px;border-radius:0 0 10px 10px}
  .sl{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--txd)}
  .sv{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;color:var(--tx);line-height:1;margin:8px 0 5px;letter-spacing:-1px}
  .sd{font-size:11px;color:var(--gr);display:flex;align-items:center;gap:4px}
  .si{position:absolute;top:16px;right:16px;color:var(--txd);opacity:.4}
  .cr{display:grid;grid-template-columns:1.6fr 1fr;gap:12px;margin-bottom:18px}
  .cre{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
  table{width:100%;border-collapse:collapse}
  thead tr{border-bottom:1px solid var(--bd)}
  th{text-align:left;padding:9px 16px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--txd);font-weight:500;white-space:nowrap}
  td{padding:12px 16px;font-size:13px;color:var(--tx);border-bottom:1px solid rgba(39,42,42,.5)}
  tbody tr:last-child td{border-bottom:none}
  tbody tr{transition:background .1s}
  tbody tr:hover td{background:var(--rs)}
  .mono{font-family:'Geist Mono',monospace;font-size:12px}
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:10.5px;font-weight:500;letter-spacing:.3px}
  .bg2{background:var(--grd);color:var(--grl);border:1px solid rgba(78,157,107,.2)}
  .ba{background:var(--amberDim);color:var(--am);border:1px solid rgba(200,137,42,.2)}
  .bd2{background:var(--rs);color:var(--txm);border:1px solid var(--bd)}
  .fg{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .ff{grid-column:1/-1}
  .fd{display:flex;flex-direction:column;gap:5px}
  .fd label{font-size:10px;color:var(--txd);letter-spacing:1px;font-weight:500;text-transform:uppercase}
  input,select,textarea{padding:9px 12px;background:var(--rs);border:1px solid var(--bd);border-radius:6px;color:var(--tx);font-size:13px;font-family:'Instrument Sans',sans-serif;outline:none;transition:border-color .15s;width:100%}
  input::placeholder{color:var(--txd)}
  input:focus,select:focus,textarea:focus{border-color:var(--gr)}
  select option{background:var(--rs)}
  textarea{resize:vertical;min-height:84px;line-height:1.6}
  .prog{height:3px;background:var(--bd);border-radius:2px;overflow:hidden;margin-top:5px}
  .pf{height:100%;background:var(--gr);border-radius:2px;transition:width .6s ease}
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(6px)}
  .modal{background:var(--sf);border:1px solid var(--bdl);border-radius:12px;width:520px;max-width:95vw;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,.6)}
  .mh{padding:22px 26px 18px;border-bottom:1px solid var(--bd)}
  .mt{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600}
  .ms{font-size:12px;color:var(--txd);margin-top:3px}
  .mb{padding:22px 26px}
  .mf{padding:14px 26px;border-top:1px solid var(--bd);display:flex;justify-content:flex-end;gap:8px}
  .rw{display:flex;flex-direction:column;align-items:center;padding:6px 0 14px}
  .rl{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--txd);margin-bottom:12px}
  .rsw{position:relative;width:130px;height:130px}
  .rsw svg{transform:rotate(-90deg)}
  .rc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .rv{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:700;color:var(--tx);line-height:1}
  .rd{font-size:11px;color:var(--txd);margin-top:1px}
  .toast{position:fixed;bottom:24px;right:24px;background:var(--rs);border:1px solid var(--bdl);border-left:3px solid var(--gr);color:var(--tx);padding:11px 16px;border-radius:8px;font-size:13px;box-shadow:0 8px 32px rgba(0,0,0,.4);z-index:2000;display:flex;align-items:center;gap:10px;animation:su .25s ease;max-width:320px}
  .toast.err{border-left-color:var(--rd)}
  @keyframes su{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
  .divider{height:1px;background:var(--bd);margin:18px 0}
  .loader{display:flex;align-items:center;justify-content:center;padding:60px;color:var(--txd);font-size:13px;gap:10px}
  .spin{width:16px;height:16px;border:2px solid var(--bd);border-top-color:var(--gr);border-radius:50%;animation:sp .7s linear infinite}
  @keyframes sp{to{transform:rotate(360deg)}}
  .landing{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
  .lnav{display:flex;align-items:center;justify-content:space-between;padding:20px 48px;border-bottom:1px solid var(--bd)}
  .lhero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 32px 60px}
  .ley{display:inline-flex;align-items:center;gap:7px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gr);margin-bottom:28px;padding:6px 14px;border:1px solid rgba(78,157,107,.25);border-radius:20px;background:var(--grd)}
  .ltitle{font-family:'Cormorant Garamond',serif;font-size:clamp(44px,6vw,78px);font-weight:600;color:var(--tx);line-height:1.07;letter-spacing:-1.5px;margin-bottom:20px;max-width:760px}
  .ltitle em{color:var(--grl);font-style:normal}
  .ldesc{font-size:16px;color:var(--txm);max-width:480px;line-height:1.75;margin-bottom:40px}
  .lacts{display:flex;gap:12px;align-items:center}
  .bll{padding:12px 26px;font-size:14px;border-radius:8px}
  .lfeats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--bd);border-top:1px solid var(--bd);border-bottom:1px solid var(--bd)}
  .fc{background:var(--bg);padding:36px 32px}
  .fi{color:var(--gr);margin-bottom:16px}
  .ftt{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;margin-bottom:10px}
  .fd2{font-size:13px;color:var(--txm);line-height:1.7}
  .lfoot{padding:20px 48px;border-top:1px solid var(--bd);display:flex;justify-content:space-between;align-items:center}
  .lft{font-size:11px;color:var(--txd)}
  .aw{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:24px}
  .ac{width:400px;background:var(--sf);border:1px solid var(--bd);border-radius:14px;padding:36px;box-shadow:0 24px 80px rgba(0,0,0,.4)}
  .att{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;margin-bottom:6px}
  .ats{font-size:13px;color:var(--txd);margin-bottom:22px}
  .asw{text-align:center;margin-top:16px;font-size:12px;color:var(--txd)}
  .aln{color:var(--gr);cursor:pointer;text-decoration:underline}
  .aerr{background:#2a1515;border:1px solid rgba(192,74,60,.3);border-radius:6px;padding:10px 14px;font-size:12px;color:var(--rd);margin-bottom:14px;display:flex;align-items:center;gap:8px}
  .vg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
  .vc{background:var(--sf);border:1px solid var(--bd);border-radius:10px;padding:18px;transition:border-color .2s}
  .vc:hover{border-color:var(--bdl)}
  .vh{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
  .va{width:34px;height:34px;border-radius:7px;background:var(--grd);border:1px solid rgba(78,157,107,.25);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:var(--grl)}
  .vn{font-size:14px;font-weight:500;color:var(--tx)}
  .vr{font-size:11px;color:var(--txd);margin-top:2px}
  .vs{display:flex;gap:20px;padding-top:12px;border-top:1px solid var(--bd);margin-top:10px}
  .vv{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--tx)}
  .vl{font-size:10px;color:var(--txd);text-transform:uppercase;letter-spacing:1px;margin-top:1px}
  .ag{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}
  .ab{padding:10px 8px;background:var(--rs);border:1px solid var(--bd);border-radius:7px;color:var(--tx);font-family:'Geist Mono',monospace;font-size:13px;cursor:pointer;text-align:center;transition:all .15s}
  .ab:hover{border-color:var(--bdl)}
  .ab.sel{border-color:var(--gr);background:var(--grd);color:var(--grl)}
  .rh{background:var(--sf);border:1px solid var(--bd);border-radius:10px;padding:28px;margin-bottom:18px;display:flex;align-items:flex-start;justify-content:space-between}
  .rtt{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;margin-bottom:4px}
  .rs2{font-size:12px;color:var(--txd)}
  .rst{display:flex;gap:36px;margin-top:18px}
  .rv2{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;color:var(--tx);line-height:1}
  .rl2{font-size:10px;color:var(--txd);text-transform:uppercase;letter-spacing:1px;margin-top:4px}
  .tt{background:var(--rs);border:1px solid var(--bdl);border-radius:7px;padding:10px 14px;font-size:12px;color:var(--tx);box-shadow:0 8px 24px rgba(0,0,0,.4)}
  .ttl{color:var(--txd);font-size:11px;margin-bottom:5px}
  .dm{background:#1a2030;border:1px solid rgba(62,124,177,.25);border-radius:8px;padding:12px 16px;font-size:12px;color:${C.blue};margin-top:16px;display:flex;align-items:center;gap:8px}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:var(--bd);border-radius:3px}
`;

// ─── SCHEMA ─────────────────────────────────────────────────────
const SCHEMA_SQL = `-- Run in Supabase → SQL Editor → New Query

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null, type text, city text,
  created_at timestamptz default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations not null,
  name text not null, type text, activity_date date,
  volunteers int default 0, beneficiaries int default 0,
  funds_utilized numeric default 0, location text,
  description text, status text default 'Active',
  created_at timestamptz default now()
);

create table public.volunteers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations not null,
  name text not null, role text, email text, phone text,
  skills text, hours_logged int default 0,
  events_attended int default 0,
  created_at timestamptz default now()
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations not null,
  donor_name text, amount numeric not null, message text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.organizations enable row level security;
alter table public.activities enable row level security;
alter table public.volunteers enable row level security;
alter table public.donations enable row level security;

-- Policies
create policy "own_org" on public.organizations
  for all using (auth.uid() = user_id);
create policy "org_acts" on public.activities
  for all using (org_id in (select id from organizations where user_id = auth.uid()));
create policy "org_vols" on public.volunteers
  for all using (org_id in (select id from organizations where user_id = auth.uid()));
create policy "org_don" on public.donations
  for all using (org_id in (select id from organizations where user_id = auth.uid()));
create policy "pub_don_insert" on public.donations
  for insert with check (true);`;

// ─── SEED DATA ──────────────────────────────────────────────────
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
    { id: 1, name: "Priya Sharma", role: "Field Coordinator", email: "priya@example.com", hours_logged: 142, events_attended: 12 },
    { id: 2, name: "Arjun Mehta", role: "Data Analyst", email: "arjun@example.com", hours_logged: 98, events_attended: 8 },
    { id: 3, name: "Sneha Iyer", role: "Healthcare Lead", email: "sneha@example.com", hours_logged: 210, events_attended: 17 },
    { id: 4, name: "Rohan Das", role: "Tech Volunteer", email: "rohan@example.com", hours_logged: 76, events_attended: 6 },
    { id: 5, name: "Kavya Nair", role: "Community Outreach", email: "kavya@example.com", hours_logged: 165, events_attended: 14 },
    { id: 6, name: "Vikram Singh", role: "Logistics", email: "vikram@example.com", hours_logged: 88, events_attended: 9 },
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

const isDemo = SUPABASE_URL.includes("YOUR_PROJECT");

// ─── DB LAYER ───────────────────────────────────────────────────
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
  async addDonation(oid, p) {
    if (isDemo) return { id: Date.now(), org_id: oid, ...p };
    const { data } = await supabase.from("donations").insert({ org_id: oid, ...p }).select().single();
    return data;
  },
};

// ─── CHART TOOLTIP ──────────────────────────────────────────────
const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tt">
      <div className="ttl">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.text }}>
          {p.name}: <strong>{p.name === "donations" ? `₹${Number(p.value).toLocaleString()}` : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ─── SCORE RING ─────────────────────────────────────────────────
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
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="8" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.green} strokeWidth="8"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
          </svg>
          <div className="rc"><div className="rv">{score}</div><div className="rd">/ 100</div></div>
        </div>
      </div>
      <div style={{ padding: "0 2px" }}>
        {rows.map(r => (
          <div key={r.label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: C.textMd }}>{r.label}</span>
              <span style={{ color: C.greenLt, fontFamily: "'Geist Mono',monospace", fontSize: 11 }}>{r.val}</span>
            </div>
            <div className="prog"><div className="pf" style={{ width: `${r.pct}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── PAGE: DASHBOARD ────────────────────────────────────────────
const Dashboard = ({ org, activities, setPage }) => {
  const totB = activities.reduce((s, a) => s + (a.beneficiaries || 0), 0);
  const totF = activities.reduce((s, a) => s + (a.funds_utilized || 0), 0);
  const totV = activities.reduce((s, a) => s + (a.volunteers || 0), 0);
  const pie  = [
    { name: "Education", value: 42, color: C.green },
    { name: "Healthcare", value: 28, color: C.amber },
    { name: "Livelihood", value: 20, color: C.blue },
    { name: "Other", value: 10, color: C.textDim },
  ];

  return (
    <div className="content">
      <div className="sr">
        {[
          { label: "Total Beneficiaries", value: totB.toLocaleString(), delta: "+18% this month", icon: "users", accent: C.green },
          { label: "Volunteers Deployed", value: totV.toString(), delta: "+7 this month", icon: "person", accent: C.amber },
          { label: "Funds Utilised", value: `₹${(totF / 100000).toFixed(2)}L`, delta: "+24% vs prior month", icon: "bar", accent: C.blue },
          { label: "Programmes", value: activities.length.toString(), delta: `${activities.filter(a => a.status === "Active").length} active`, icon: "trending", accent: C.green },
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

      <div className="cr">
        <div className="card">
          <div className="ch">
            <div><div className="ct">Impact Trend</div><div className="cs">Monthly beneficiaries & volunteers</div></div>
            <div style={{ display: "flex", gap: 14 }}>
              {[{ c: C.green, l: "Beneficiaries" }, { c: C.amber, l: "Volunteers" }].map(x => (
                <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.textMd }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: x.c }} />{x.l}
                </div>
              ))}
            </div>
          </div>
          <div className="cb" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={SEED.monthly}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.green} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.amber} stopOpacity={0.13} />
                    <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
                <Tooltip content={<CT />} />
                <Area type="monotone" dataKey="beneficiaries" stroke={C.green} strokeWidth={1.5} fill="url(#ag)" name="beneficiaries" dot={false} />
                <Area type="monotone" dataKey="volunteers" stroke={C.amber} strokeWidth={1.5} fill="url(#aa)" name="volunteers" dot={false} />
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
                <Bar dataKey="donations" fill={C.green} radius={[3, 3, 0, 0]} name="donations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div><div className="ct">Programme Mix</div><div className="cs">Budget by sector</div></div></div>
          <div className="cb" style={{ paddingTop: 0 }}>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={pie} cx="50%" cy="50%" innerRadius={36} outerRadius={54} paddingAngle={2} dataKey="value">
                  {pie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} contentStyle={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 10px", marginTop: 6 }}>
              {pie.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.textMd }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: d.color, flexShrink: 0 }} />
                  {d.name} — {d.value}%
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="ch">
          <div className="ct">Recent Programmes</div>
          <button className="btn bp bs" onClick={() => setPage("log")}><Icon name="plus" size={13} />Log Activity</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead><tr>
              <th>Programme</th><th>Type</th><th>Date</th><th>Volunteers</th><th>Beneficiaries</th><th>Funds</th><th>Status</th>
            </tr></thead>
            <tbody>
              {activities.slice(0, 5).map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.name}</td>
                  <td><span className="badge bd2">{a.type}</span></td>
                  <td className="mono" style={{ color: C.textMd }}>{a.activity_date}</td>
                  <td className="mono">{a.volunteers}</td>
                  <td className="mono">{a.beneficiaries}</td>
                  <td className="mono">₹{Number(a.funds_utilized).toLocaleString()}</td>
                  <td><span className={`badge ${a.status === "Active" ? "bg2" : "bd2"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: LOG ACTIVITY ─────────────────────────────────────────
const LogActivity = ({ org, onSave, setPage, showToast }) => {
  const [form, setForm] = useState({ name: "", type: "Education", activity_date: "", volunteers: "", beneficiaries: "", funds_utilized: "", location: "", description: "", status: "Active" });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.activity_date) { showToast("Programme name and date are required.", "err"); return; }
    setLoading(true);
    try {
      const rec = await db.logActivity(org.id, { ...form, volunteers: +form.volunteers || 0, beneficiaries: +form.beneficiaries || 0, funds_utilized: +form.funds_utilized || 0 });
      onSave(rec); showToast("Activity saved."); setPage("dashboard");
    } catch { showToast("Failed to save.", "err"); }
    setLoading(false);
  };

  return (
    <div className="content" style={{ maxWidth: 660 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600 }}>Log Programme</div>
        <div style={{ fontSize: 12, color: C.textDim, marginTop: 3 }}>Record a field activity, camp, or training event</div>
      </div>
      <div className="card">
        <div className="cb">
          <div className="fg">
            <div className="fd ff"><label>Programme Name</label><input placeholder="e.g. Digital Literacy Drive — Kurla" value={form.name} onChange={e => set("name", e.target.value)} /></div>
            <div className="fd"><label>Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)}>
                {["Education", "Healthcare", "Livelihood", "Environment", "Other"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="fd"><label>Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}>
                <option>Active</option><option>Completed</option><option>Planned</option>
              </select>
            </div>
            <div className="fd"><label>Date</label><input type="date" value={form.activity_date} onChange={e => set("activity_date", e.target.value)} /></div>
            <div className="fd"><label>Location</label><input placeholder="e.g. Dharavi, Mumbai" value={form.location} onChange={e => set("location", e.target.value)} /></div>
            <div className="fd"><label>Volunteers Deployed</label><input type="number" min="0" placeholder="0" value={form.volunteers} onChange={e => set("volunteers", e.target.value)} /></div>
            <div className="fd"><label>Beneficiaries Reached</label><input type="number" min="0" placeholder="0" value={form.beneficiaries} onChange={e => set("beneficiaries", e.target.value)} /></div>
            <div className="fd ff"><label>Funds Utilised (₹)</label><input type="number" min="0" placeholder="0" value={form.funds_utilized} onChange={e => set("funds_utilized", e.target.value)} /></div>
            <div className="fd ff"><label>Outcomes & Description</label><textarea placeholder="Describe key outcomes, challenges, and observations..." value={form.description} onChange={e => set("description", e.target.value)} /></div>
          </div>
        </div>
        <div className="mf">
          <button className="btn bg" onClick={() => setPage("dashboard")}>Cancel</button>
          <button className="btn bp" onClick={submit} disabled={loading}>
            {loading ? "Saving…" : <><Icon name="check" size={13} />Save Activity</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: VOLUNTEERS ───────────────────────────────────────────
const Volunteers = ({ org, volunteers, setVolunteers, showToast }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Field Coordinator", email: "", phone: "", skills: "" });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name) { showToast("Name is required.", "err"); return; }
    setLoading(true);
    try {
      const rec = await db.addVolunteer(org.id, form);
      setVolunteers(v => [rec, ...v]);
      setModal(false); setForm({ name: "", role: "Field Coordinator", email: "", phone: "", skills: "" });
      showToast("Volunteer registered.");
    } catch { showToast("Failed to save.", "err"); }
    setLoading(false);
  };

  return (
    <div className="content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600 }}>Volunteer Registry</div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 3 }}>{volunteers.length} registered · {volunteers.reduce((s, v) => s + (v.hours_logged || 0), 0).toLocaleString()} total hours</div>
        </div>
        <button className="btn bp" onClick={() => setModal(true)}><Icon name="plus" size={13} />Register Volunteer</button>
      </div>
      <div className="vg">
        {volunteers.map(v => (
          <div key={v.id} className="vc">
            <div className="vh">
              <div className="va">{v.name[0]}</div>
              <span className="badge bd2">{v.role || "Volunteer"}</span>
            </div>
            <div className="vn">{v.name}</div>
            {v.email && <div className="vr">{v.email}</div>}
            <div className="vs">
              <div><div className="vv">{v.hours_logged || 0}</div><div className="vl">Hours</div></div>
              <div><div className="vv">{v.events_attended || 0}</div><div className="vl">Events</div></div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="mh"><div className="mt">Register Volunteer</div><div className="ms">Add a new member to your registry</div></div>
            <div className="mb">
              <div className="fg">
                <div className="fd"><label>Full Name</label><input placeholder="Full name" value={form.name} onChange={e => set("name", e.target.value)} /></div>
                <div className="fd"><label>Role</label>
                  <select value={form.role} onChange={e => set("role", e.target.value)}>
                    {["Field Coordinator", "Healthcare Lead", "Tech Volunteer", "Data Analyst", "Community Outreach", "Logistics", "Other"].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="fd"><label>Email</label><input type="email" placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} /></div>
                <div className="fd"><label>Phone</label><input placeholder="+91 99999 99999" value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
                <div className="fd ff"><label>Skills</label><input placeholder="e.g. Teaching, First Aid, Data Entry" value={form.skills} onChange={e => set("skills", e.target.value)} /></div>
              </div>
            </div>
            <div className="mf">
              <button className="btn bg" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn bp" onClick={submit} disabled={loading}>{loading ? "Saving…" : "Register"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PAGE: REPORTS ──────────────────────────────────────────────
const Reports = ({ activities, showToast }) => {
  const totB = activities.reduce((s, a) => s + (a.beneficiaries || 0), 0);
  const totF = activities.reduce((s, a) => s + (a.funds_utilized || 0), 0);
  const bkd  = [
    { label: "Education Programmes", amount: Math.round(totF * 0.40), pct: 40 },
    { label: "Healthcare Camps",     amount: Math.round(totF * 0.28), pct: 28 },
    { label: "Livelihood Training",  amount: Math.round(totF * 0.20), pct: 20 },
    { label: "Operations",           amount: Math.round(totF * 0.12), pct: 12 },
  ];
  return (
    <div className="content">
      <div className="rh">
        <div>
          <div className="rtt">Impact Report — Q1 2025</div>
          <div className="rs2">Shiksha Foundation · January – March 2025</div>
          <div className="rst">
            {[[totB.toLocaleString(), "Beneficiaries"], ["38", "Volunteers"], [`₹${(totF / 100000).toFixed(2)}L`, "Utilised"], ["82", "Trust Score"]].map(([v, l]) => (
              <div key={l}><div className="rv2">{v}</div><div className="rl2">{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <button className="btn bg bs" onClick={() => showToast("PDF export requires backend setup.")}><Icon name="download" size={13} />Export PDF</button>
          <button className="btn bp bs" onClick={() => showToast("Shareable link copied.")}><Icon name="share" size={13} />Share</button>
        </div>
      </div>
      <div className="cre">
        <div className="card">
          <div className="ch"><div><div className="ct">Beneficiary Growth</div><div className="cs">Month-over-month</div></div></div>
          <div className="cb" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={SEED.monthly}>
                <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.textDim }} axisLine={false} tickLine={false} />
                <Tooltip content={<CT />} />
                <Line type="monotone" dataKey="beneficiaries" stroke={C.green} strokeWidth={2} dot={{ fill: C.green, r: 3, strokeWidth: 0 }} name="beneficiaries" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div><div className="ct">Financial Summary</div><div className="cs">Fund utilisation by programme</div></div></div>
          <div className="cb">
            {bkd.map(r => (
              <div key={r.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: C.textMd }}>{r.label}</span>
                  <span className="mono">₹{r.amount.toLocaleString()}</span>
                </div>
                <div className="prog"><div className="pf" style={{ width: `${r.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">All Programmes</div></div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>Programme</th><th>Type</th><th>Date</th><th>Beneficiaries</th><th>Funds</th><th>Status</th></tr></thead>
            <tbody>
              {activities.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.name}</td>
                  <td><span className="badge bd2">{a.type}</span></td>
                  <td className="mono" style={{ color: C.textMd }}>{a.activity_date}</td>
                  <td className="mono">{a.beneficiaries}</td>
                  <td className="mono">₹{Number(a.funds_utilized).toLocaleString()}</td>
                  <td><span className={`badge ${a.status === "Active" ? "bg2" : "bd2"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: DONATE ────────────────────────────────────────────────
const Donate = ({ org, showToast }) => {
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");
  const [donor, setDonor] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const presets = [250, 500, 1000, 2500, 5000, 10000];
  const final = custom ? +custom : amount;

  const submit = async () => {
    if (!final) return;
    setLoading(true);
    try {
      await db.addDonation(org.id, { amount: final, donor_name: donor || null, message: msg || null });
      showToast(`Contribution of ₹${final.toLocaleString()} recorded. Thank you.`);
      setCustom(""); setDonor(""); setMsg(""); setAmount(500);
    } catch { showToast("Failed to record.", "err"); }
    setLoading(false);
  };

  return (
    <div className="content" style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600 }}>Support Our Work</div>
        <div style={{ fontSize: 13, color: C.textMd, marginTop: 6, lineHeight: 1.75 }}>Pay what you can. Every rupee reaches our programmes directly.</div>
      </div>
      <div className="card">
        <div className="cb">
          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.textDim, marginBottom: 10 }}>Select Amount</div>
          <div className="ag">
            {presets.map(p => (
              <button key={p} className={`ab ${amount === p && !custom ? "sel" : ""}`} onClick={() => { setAmount(p); setCustom(""); }}>
                ₹{p.toLocaleString()}
              </button>
            ))}
          </div>
          <div className="fd" style={{ marginBottom: 12 }}><label>Custom Amount</label><input type="number" placeholder="₹ Enter amount" value={custom} onChange={e => setCustom(e.target.value)} /></div>
          <div className="fd" style={{ marginBottom: 12 }}><label>Your Name (optional)</label><input placeholder="Anonymous" value={donor} onChange={e => setDonor(e.target.value)} /></div>
          <div className="fd" style={{ marginBottom: 18 }}><label>Message (optional)</label><textarea placeholder="A note for the team…" rows={2} value={msg} onChange={e => setMsg(e.target.value)} /></div>
          <div style={{ background: C.raised, borderRadius: 8, padding: "14px 16px", marginBottom: 18, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.textDim, marginBottom: 10 }}>What this funds</div>
            {[["₹250", "Stationery for 5 children for one month"], ["₹500", "Meals for 20 beneficiaries for one day"], ["₹1,000", "Health consultation for 3 families"], ["₹5,000", "Full livelihood training cohort materials"]].map(([a, d]) => (
              <div key={a} style={{ display: "flex", gap: 12, marginBottom: 7, fontSize: 12 }}>
                <span style={{ color: C.green, fontFamily: "'Geist Mono',monospace", minWidth: 52, flexShrink: 0 }}>{a}</span>
                <span style={{ color: C.textMd }}>{d}</span>
              </div>
            ))}
          </div>
          <button className="btn bp" style={{ width: "100%", justifyContent: "center", padding: "11px" }} onClick={submit} disabled={loading}>
            {loading ? "Processing…" : `Contribute ₹${final.toLocaleString()}`}
          </button>
          <div style={{ fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 10 }}>
            Transparent quarterly reports · 80G eligible
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: SCHEMA / SETUP ────────────────────────────────────────
const Schema = () => (
  <div className="content" style={{ maxWidth: 740 }}>
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600 }}>Backend Setup</div>
      <div style={{ fontSize: 12, color: C.textDim, marginTop: 3 }}>Three steps to connect your live Supabase database</div>
    </div>
    {[
      { title: "Step 1 — Create a Supabase Project", body: <ol style={{ paddingLeft: 18, fontSize: 13, color: C.textMd, lineHeight: 2 }}><li>Go to <strong style={{ color: C.text }}>supabase.com</strong> and create a free account</li><li>Create a new project — choose any region</li><li>Copy your <strong style={{ color: C.text }}>Project URL</strong> and <strong style={{ color: C.text }}>anon public key</strong> from Settings → API</li><li>Replace the placeholder values at the top of <code style={{ color: C.greenLt, fontFamily: "'Geist Mono',monospace", fontSize: 12 }}>impactlens.jsx</code></li></ol> },
      { title: "Step 2 — Run the Schema", sub: "Paste into Supabase → SQL Editor → New Query → Run", body: <pre style={{ padding: "18px 22px", fontSize: 11, fontFamily: "'Geist Mono',monospace", color: C.textMd, overflowX: "auto", lineHeight: 1.75, whiteSpace: "pre", margin: 0, background: C.bg, borderTop: `1px solid ${C.border}`, borderRadius: "0 0 10px 10px" }}>{SCHEMA_SQL.trim()}</pre> },
      { title: "Step 3 — Enable Auth", body: <><ol style={{ paddingLeft: 18, fontSize: 13, color: C.textMd, lineHeight: 2 }}><li>In Supabase, go to <strong style={{ color: C.text }}>Authentication → Providers</strong></li><li>Email auth is enabled by default</li><li>Optionally enable Google OAuth for one-click login</li></ol><div className="dm"><Icon name="info" size={14} color={C.blue} />Currently running in Demo Mode with seed data. Add your Supabase keys to go live.</div></> },
    ].map((s, i) => (
      <div key={i} className="card" style={{ marginBottom: 14 }}>
        <div className="ch"><div><div className="ct">{s.title}</div>{s.sub && <div className="cs">{s.sub}</div>}</div></div>
        <div style={s.title.includes("Schema") ? {} : { padding: "18px 22px" }}>{s.body}</div>
      </div>
    ))}
  </div>
);

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
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div className="lm"><Icon name="leaf" size={14} color={C.green} /></div>
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
        {isDemo && <div className="dm" style={{ marginTop: 14 }}><Icon name="info" size={14} color={C.blue} />Demo mode — click Sign In to explore with sample data.</div>}
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
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="lm"><Icon name="leaf" size={14} color={C.green} /></div>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 600, color: C.text }}>ImpactLens</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn bg bs" onClick={onEnter}>Sign in</button>
        <button className="btn bp bs" onClick={onEnter}>Get started</button>
      </div>
    </nav>
    <div className="lhero">
      <div className="ley"><Icon name="shield" size={11} color={C.green} />Built for Indian NGOs</div>
      <div className="ltitle">Turn your impact into<br /><em>data donors trust</em></div>
      <div className="ldesc">Log activities. Track beneficiaries. Auto-generate transparent impact reports your donors can actually read.</div>
      <div className="lacts">
        <button className="btn bp bll" onClick={onEnter}>Start free <Icon name="arrow" size={14} /></button>
        <span style={{ fontSize: 12, color: C.textDim }}>Pay what you can. No lock-in.</span>
      </div>
    </div>
    <div className="lfeats">
      {[
        { icon: "bar", title: "Auto-generated Reports", desc: "Log once. ImpactLens produces clean quarterly reports for donors and grant committees — automatically." },
        { icon: "shield", title: "Financial Transparency Score", desc: "A composite trust index based on fund utilisation, reach, and reporting frequency. Build donor confidence at a glance." },
        { icon: "users", title: "Volunteer Registry", desc: "Track your team's hours, specialisations, and deployment history — all in one place." },
      ].map(f => (
        <div key={f.title} className="fc">
          <div className="fi"><Icon name={f.icon} size={22} color={C.green} /></div>
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

// ─── NAV CONFIG ──────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",  icon: "grid",   label: "Overview" },
  { id: "log",        icon: "edit",   label: "Log Activity" },
  { id: "volunteers", icon: "users",  label: "Volunteers" },
  { id: "reports",    icon: "file",   label: "Reports" },
  { id: "donate",     icon: "heart",  label: "Donate" },
  { id: "schema",     icon: "info",   label: "Backend Setup" },
];

const PAGE_META = {
  dashboard:  ["Overview",      "Q1 2025"],
  log:        ["Log Activity",  "Record a new programme"],
  volunteers: ["Volunteers",    "Registry & hours"],
  reports:    ["Reports",       "Shareable donor documents"],
  donate:     ["Donate",        "Support this NGO"],
  schema:     ["Backend Setup", "Supabase integration guide"],
};

// ─── ROOT APP ────────────────────────────────────────────────────
export default function App() {
  const [view, setView]           = useState("landing");
  const [user, setUser]           = useState(null);
  const [org,  setOrg]            = useState(null);
  const [page, setPage]           = useState("dashboard");
  const [activities, setActivities] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [toast, setToast]         = useState(null);

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
    setUser(null); setOrg(null); setView("landing"); setPage("dashboard");
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
            <div className="lm"><Icon name="leaf" size={14} color={C.green} /></div>
            <span className="ln">ImpactLens</span>
          </div>
          <nav className="nav">
            <div className="ngl">Navigation</div>
            {NAV.map(n => (
              <button key={n.id} className={`ni ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <Icon name={n.icon} size={15} color={page === n.id ? C.greenLt : C.textDim} />
                {n.label}
              </button>
            ))}
          </nav>
          <div className="sb-footer">
            <div className="op" onClick={onLogout} title="Sign out">
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
              {page === "dashboard" && <button className="btn bp bs" onClick={() => setPage("log")}><Icon name="plus" size={13} />Log Activity</button>}
              {page === "reports"   && <button className="btn bg bs" onClick={() => showToast("PDF export requires backend setup.")}><Icon name="download" size={13} />Export</button>}
            </div>
          </div>

          {dataLoading ? (
            <div className="loader"><div className="spin" />Loading data…</div>
          ) : (
            <>
              {page === "dashboard"  && <Dashboard   org={org} activities={activities} setPage={setPage} />}
              {page === "log"        && <LogActivity  org={org} onSave={onSaveActivity} setPage={setPage} showToast={showToast} />}
              {page === "volunteers" && <Volunteers   org={org} volunteers={volunteers} setVolunteers={setVolunteers} showToast={showToast} />}
              {page === "reports"    && <Reports      activities={activities} showToast={showToast} />}
              {page === "donate"     && <Donate       org={org} showToast={showToast} />}
              {page === "schema"     && <Schema />}
            </>
          )}
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type === "err" ? "err" : ""}`}>
          <Icon name={toast.type === "err" ? "x" : "check"} size={14} color={toast.type === "err" ? C.red : C.green} />
          {toast.msg}
        </div>
      )}
    </>
  );
}