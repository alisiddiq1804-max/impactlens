import { useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { useForm, ValidationError } from "@formspree/react";

const SUPABASE_URL = "https://afhioirxrjaxcieqimlo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaGlvaXJ4cmpheGNpZXFpbWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTY5OTAsImV4cCI6MjA5MDUzMjk5MH0.FW1c42k1VfrGxGxEMooPAMNHHuaoe4EnDavdPD_Ej1E";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const isDemo = SUPABASE_URL.includes("YOUR_PROJECT");

const C = {
  bg:"#FDF8F5", surface:"#FFFFFF", raised:"#FAF4F0",
  border:"#EDD9CF", borderLt:"#DFC4B8",
  text:"#2C1810", textMd:"#7A4A3A", textDim:"#BF7587",
  primary:"#A2574F", primaryLt:"#C4736A", primaryDk:"#7A3830",
  accent:"#E68057", accentDk:"#C05A30",
  rose:"#BF7587", roseDim:"#F5ECF0",
  green:"#5A7A4A", greenDim:"#EEF5E8",
  amber:"#C07830", amberDim:"#FFF3DC",
  red:"#A03030", redDim:"#FFF0EE",
  blue:"#3A5A7A", blueDim:"#EEF3FA",
  viz:["#4E8BB8","#5A9E6F","#E68057","#BF5870","#8B5E8B","#D4A843"],
};

const AnthropicIcon = ({ size=18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:"block",flexShrink:0}}>
    <path d="M13.8 3L19 21h-3.4l-1-3.2H9.4L8.4 21H5L10.2 3h3.6zM12 8.2L10.2 14h3.6L12 8.2z" fill="#7A3830"/>
  </svg>
);

const Icon = ({ name, size=16, color="currentColor", strokeWidth=1.6 }) => {
  const s = {width:size,height:size,display:"block",flexShrink:0};
  const p = {fill:"none",stroke:color,strokeWidth,strokeLinecap:"round",strokeLinejoin:"round"};
  const icons = {
    grid:<svg style={s} viewBox="0 0 24 24"><rect {...p} x="3" y="3" width="7" height="7" rx="1"/><rect {...p} x="14" y="3" width="7" height="7" rx="1"/><rect {...p} x="3" y="14" width="7" height="7" rx="1"/><rect {...p} x="14" y="14" width="7" height="7" rx="1"/></svg>,
    edit:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path {...p} d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    users:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle {...p} cx="9" cy="7" r="4"/><path {...p} d="M23 21v-2a4 4 0 0 0-3-3.87"/><path {...p} d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    file:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline {...p} points="14 2 14 8 20 8"/><line {...p} x1="16" y1="13" x2="8" y2="13"/><line {...p} x1="16" y1="17" x2="8" y2="17"/></svg>,
    mail:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline {...p} points="22,6 12,13 2,6"/></svg>,
    trending:<svg style={s} viewBox="0 0 24 24"><polyline {...p} points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline {...p} points="17 6 23 6 23 12"/></svg>,
    download:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline {...p} points="7 10 12 15 17 10"/><line {...p} x1="12" y1="15" x2="12" y2="3"/></svg>,
    plus:<svg style={s} viewBox="0 0 24 24"><line {...p} x1="12" y1="5" x2="12" y2="19"/><line {...p} x1="5" y1="12" x2="19" y2="12"/></svg>,
    arrow:<svg style={s} viewBox="0 0 24 24"><line {...p} x1="5" y1="12" x2="19" y2="12"/><polyline {...p} points="12 5 19 12 12 19"/></svg>,
    check:<svg style={s} viewBox="0 0 24 24"><polyline {...p} points="20 6 9 17 4 12"/></svg>,
    x:<svg style={s} viewBox="0 0 24 24"><line {...p} x1="18" y1="6" x2="6" y2="18"/><line {...p} x1="6" y1="6" x2="18" y2="18"/></svg>,
    leaf:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M2 22c0 0 4-2 8-6s8-10 12-14c0 0-8 0-14 6S2 22 2 22z"/></svg>,
    bar:<svg style={s} viewBox="0 0 24 24"><line {...p} x1="18" y1="20" x2="18" y2="10"/><line {...p} x1="12" y1="20" x2="12" y2="4"/><line {...p} x1="6" y1="20" x2="6" y2="14"/></svg>,
    shield:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    person:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle {...p} cx="12" cy="7" r="4"/></svg>,
    info:<svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="10"/><line {...p} x1="12" y1="8" x2="12" y2="12"/><line {...p} x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    sparkle:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
    predict:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M2 20h20"/><path {...p} d="M4 20V10l4-4 4 3 4-6 4 5v12"/></svg>,
    about:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path {...p} d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    message:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    logout:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline {...p} points="16 17 21 12 16 7"/><line {...p} x1="21" y1="12" x2="9" y2="12"/></svg>,
    more:<svg style={s} viewBox="0 0 24 24"><circle {...p} cx="5" cy="12" r="1" fill={color}/><circle {...p} cx="12" cy="12" r="1" fill={color}/><circle {...p} cx="19" cy="12" r="1" fill={color}/></svg>,
    heart:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    eye:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle {...p} cx="12" cy="12" r="3"/></svg>,
    lock:<svg style={s} viewBox="0 0 24 24"><rect {...p} x="3" y="11" width="18" height="11" rx="2"/><path {...p} d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    doc:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline {...p} points="14 2 14 8 20 8"/></svg>,
    chevron:<svg style={s} viewBox="0 0 24 24"><polyline {...p} points="6 9 12 15 18 9"/></svg>,
  };
  return icons[name]||null;
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Geist+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;background:#FDF8F5;color:#2C1810}
  body{font-family:'Instrument Sans',sans-serif;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
  .app{display:flex;height:100vh;overflow:hidden}
  .sidebar{width:220px;min-width:220px;background:#fff;border-right:1px solid #EDD9CF;display:flex;flex-direction:column;height:100vh;flex-shrink:0}
  .sb-logo{padding:22px 18px 18px;border-bottom:1px solid #EDD9CF;display:flex;align-items:center;gap:9px}
  .lm{width:28px;height:28px;background:#F5ECF0;border:1.5px solid #A2574F;border-radius:7px;display:flex;align-items:center;justify-content:center;color:#A2574F;flex-shrink:0}
  .ln{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:#2C1810}
  .nav{padding:8px;flex:1;overflow-y:auto}
  .ngl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#BF7587;padding:10px 8px 5px;font-weight:500}
  .ni{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;cursor:pointer;color:#7A4A3A;font-size:13px;border:none;background:none;width:100%;text-align:left;transition:color .12s,background .12s}
  .ni:hover{background:#FAF4F0;color:#2C1810}
  .ni.active{background:#F5ECF0;color:#A2574F;font-weight:500;border-left:2px solid #A2574F}
  .sb-footer{border-top:1px solid #EDD9CF;padding:12px}
  .op{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;background:#FAF4F0;cursor:pointer;transition:background .12s;border:1px solid #EDD9CF}
  .op:hover{background:#EDD9CF}
  .oa{width:28px;height:28px;border-radius:6px;background:#F5ECF0;border:1.5px solid #A2574F;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:#A2574F;flex-shrink:0}
  .on{font-size:12px;color:#2C1810;font-weight:500;line-height:1.3}
  .ot{font-size:10px;color:#BF7587}
  .demo-banner{background:#FFF3DC;border-bottom:1px solid rgba(162,87,79,.2);padding:10px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;flex-shrink:0}
  .demo-banner-text{font-size:12.5px;color:#A2574F;display:flex;align-items:center;gap:8px;font-weight:500}
  .main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
  .tb{height:56px;min-height:56px;border-bottom:1px solid #EDD9CF;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:#fff;flex-shrink:0}
  .tbt{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:#2C1810;white-space:nowrap}
  .tbs{font-size:11px;color:#BF7587;white-space:nowrap}
  .tbr{display:flex;align-items:center;gap:8px;flex-shrink:0}
  .tbl{display:flex;align-items:baseline;gap:10px;min-width:0}
  .content{flex:1;overflow-y:auto;padding:24px}
  .btn{display:inline-flex;align-items:center;gap:6px;border:none;cursor:pointer;border-radius:7px;font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:500;padding:7px 14px;transition:all .12s;white-space:nowrap}
  .bp{background:#A2574F;color:#fff}.bp:hover{background:#7A3830}
  .bg{background:transparent;color:#7A4A3A;border:1.5px solid #EDD9CF}.bg:hover{border-color:#DFC4B8;color:#2C1810;background:#FAF4F0}
  .bac{background:#E68057;color:#fff}.bac:hover{background:#C05A30}
  .bs{padding:6px 12px;font-size:12px}
  .card{background:#fff;border:1px solid #EDD9CF;border-radius:10px;box-shadow:0 1px 4px rgba(162,87,79,.06)}
  .ch{padding:16px 20px;border-bottom:1px solid #EDD9CF;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .ct{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#2C1810}
  .cs{font-size:11px;color:#BF7587;margin-top:2px}
  .cb{padding:20px}
  .sr{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
  .sc{background:#fff;border:1px solid #EDD9CF;border-radius:10px;padding:18px;position:relative;overflow:hidden;box-shadow:0 1px 4px rgba(162,87,79,.06)}
  .sl{font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:#BF7587;font-weight:500}
  .sv{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;color:#2C1810;line-height:1;margin:8px 0 5px;letter-spacing:-0.5px}
  .sd{font-size:11px;color:#5A7A4A;display:flex;align-items:center;gap:4px;font-weight:500}
  .si{position:absolute;top:16px;right:16px;color:#BF7587;opacity:.2}
  .cr{display:grid;grid-template-columns:1.6fr 1fr;gap:12px;margin-bottom:16px}
  .cre{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
  .crt{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px}
  .tbl-wrap{overflow-x:auto}
  table{width:100%;border-collapse:collapse}
  thead tr{border-bottom:1.5px solid #EDD9CF;background:#FAF4F0}
  th{text-align:left;padding:9px 16px;font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:#BF7587;font-weight:600;white-space:nowrap}
  td{padding:12px 16px;font-size:13px;color:#2C1810;border-bottom:1px solid #EDD9CF}
  tbody tr:last-child td{border-bottom:none}
  tbody tr:hover td{background:#FAF4F0}
  .mono{font-family:'Geist Mono',monospace;font-size:12px;color:#7A4A3A}
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500}
  .bg2{background:#EEF5E8;color:#5A7A4A}
  .ba2{background:#FFF3DC;color:#C07830}
  .bd2{background:#FAF4F0;color:#7A4A3A;border:1px solid #EDD9CF}
  .bgo2{background:#FEF3E0;color:#8A5A10}
  .br{background:#FFF0EE;color:#A03030}
  .bst{background:#F5ECF0;color:#A2574F;border:1px solid rgba(162,87,79,.2)}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .ff{grid-column:1/-1}
  .fd{display:flex;flex-direction:column;gap:5px}
  .fd label{font-size:11px;color:#7A4A3A;font-weight:500}
  input,select,textarea{padding:9px 12px;background:#fff;border:1.5px solid #EDD9CF;border-radius:7px;color:#2C1810;font-size:13px;font-family:'Instrument Sans',sans-serif;outline:none;transition:border-color .12s,box-shadow .12s;width:100%}
  input::placeholder,textarea::placeholder{color:#BF7587}
  input:focus,select:focus,textarea:focus{border-color:#A2574F;box-shadow:0 0 0 3px rgba(162,87,79,.1)}
  select option{background:#fff}
  textarea{resize:vertical;min-height:88px;line-height:1.6}
  .prog{height:4px;background:#FAF4F0;border-radius:2px;overflow:hidden;margin-top:5px}
  .pf{height:100%;border-radius:2px;transition:width .5s ease}
  .overlay{position:fixed;inset:0;background:rgba(44,24,16,.3);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px)}
  .modal{background:#fff;border:1px solid #EDD9CF;border-radius:12px;width:520px;max-width:95vw;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(44,24,16,.15)}
  .mh{padding:22px 26px 18px;border-bottom:1px solid #EDD9CF}
  .mt{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600}
  .ms{font-size:12px;color:#BF7587;margin-top:3px}
  .mb{padding:22px 26px}
  .mf{padding:14px 26px;border-top:1px solid #EDD9CF;display:flex;justify-content:flex-end;gap:8px}
  .rw{display:flex;flex-direction:column;align-items:center;padding:4px 0 12px}
  .rl{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#BF7587;margin-bottom:12px;font-weight:500}
  .rsw{position:relative;width:130px;height:130px}
  .rsw svg{transform:rotate(-90deg)}
  .rc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .rv{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:700;color:#2C1810;line-height:1}
  .rdl{font-size:11px;color:#BF7587;margin-top:1px}
  .toast{position:fixed;bottom:80px;right:20px;background:#2C1810;color:#fff;padding:11px 16px;border-radius:8px;font-size:13px;box-shadow:0 8px 30px rgba(44,24,16,.2);z-index:2000;display:flex;align-items:center;gap:10px;animation:su .2s ease;max-width:300px}
  .toast.err{background:#A03030}
  @keyframes su{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
  .loader{display:flex;align-items:center;justify-content:center;padding:60px;color:#BF7587;font-size:13px;gap:10px}
  .spin{width:16px;height:16px;border:2px solid #EDD9CF;border-top-color:#A2574F;border-radius:50%;animation:sp .7s linear infinite}
  @keyframes sp{to{transform:rotate(360deg)}}
  .score-badge{display:inline-flex;align-items:center;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}
  .score-a{background:#EEF5E8;color:#3A5C2A}
  .score-b{background:#F0F5E8;color:#4A6C3A}
  .score-c{background:#FFF3DC;color:#C07830}
  .score-d{background:#FFF0EE;color:#A03030}
  .vg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .vc{background:#fff;border:1.5px solid #EDD9CF;border-radius:10px;padding:18px;transition:border-color .15s,box-shadow .15s;box-shadow:0 1px 4px rgba(162,87,79,.06)}
  .vc:hover{border-color:#A2574F;box-shadow:0 4px 14px rgba(162,87,79,.1)}
  .vh{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
  .va{width:36px;height:36px;border-radius:8px;background:#F5ECF0;border:1.5px solid #EDD9CF;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#A2574F}
  .vn{font-size:14px;font-weight:600;color:#2C1810}
  .vr2{font-size:11px;color:#BF7587;margin-top:1px}
  .vs{display:flex;gap:20px;padding-top:12px;border-top:1px solid #EDD9CF;margin-top:12px}
  .vv{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:#2C1810}
  .vl{font-size:10px;color:#BF7587;text-transform:uppercase;letter-spacing:1px;margin-top:1px}
  .vc-actions{display:flex;gap:6px;margin-top:12px;padding-top:12px;border-top:1px solid #EDD9CF}
  .vc-btn{flex:1;padding:6px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid #EDD9CF;background:#fff;color:#7A4A3A;font-family:'Instrument Sans',sans-serif;transition:all .12s;text-align:center}
  .vc-btn:hover{border-color:#A2574F;color:#A2574F;background:#F5ECF0}
  .vc-btn.del:hover{border-color:#A03030;color:#A03030;background:#FFF0EE}
  .ai-hero{background:linear-gradient(135deg,#FAF4F0,#F5ECF0);border:1.5px solid #EDD9CF;border-radius:12px;padding:32px;text-align:center;position:relative;overflow:hidden}
  .ai-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:radial-gradient(circle,rgba(162,87,79,.08),transparent 70%);pointer-events:none}
  .ai-hero-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:#2C1810;margin-bottom:10px}
  .ai-hero-desc{font-size:13.5px;color:#7A4A3A;line-height:1.75;max-width:480px;margin:0 auto 24px}
  .ai-open-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 28px;background:#A2574F;color:#fff;font-family:'Instrument Sans',sans-serif;font-size:14px;font-weight:600;border:none;border-radius:9px;cursor:pointer;transition:all .15s;box-shadow:0 4px 14px rgba(162,87,79,.25)}
  .ai-open-btn:hover{background:#7A3830;transform:translateY(-1px)}
  .ai-powered{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:16px;font-size:11px;color:#BF7587}
  .insight-row{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #EDD9CF}
  .insight-row:last-child{border-bottom:none}
  .insight-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:5px}
  .insight-text{font-size:13px;color:#7A4A3A;line-height:1.65}
  .pred-card{background:#fff;border:1px solid #EDD9CF;border-radius:9px;padding:18px;box-shadow:0 1px 4px rgba(162,87,79,.06)}
  .pred-val{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:600;color:#2C1810;line-height:1;margin:6px 0 3px}
  .pred-lbl{font-size:10px;color:#BF7587;text-transform:uppercase;letter-spacing:1px;font-weight:500}
  .pred-delta{font-size:11px;margin-top:4px;display:flex;align-items:center;gap:4px;font-weight:500}
  .about-hero{background:linear-gradient(135deg,#7A3830,#A2574F);border-radius:12px;padding:44px;margin-bottom:18px;position:relative;overflow:hidden}
  .about-hero::before{content:'';position:absolute;bottom:-60px;right:-60px;width:220px;height:220px;background:radial-gradient(circle,rgba(255,255,255,.07),transparent 70%);pointer-events:none}
  .about-title{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:700;color:#fff;margin-bottom:12px;line-height:1.1}
  .about-title em{color:#F0A080;font-style:italic}
  .about-subtitle{font-size:15px;color:rgba(255,255,255,.75);line-height:1.8;max-width:680px}
  .about-card{background:#fff;border:1px solid #EDD9CF;border-radius:9px;padding:18px;box-shadow:0 1px 4px rgba(162,87,79,.06)}
  .about-card-icon{color:#A2574F;margin-bottom:10px}
  .about-card-title{font-size:13px;font-weight:600;color:#2C1810;margin-bottom:6px}
  .about-card-text{font-size:12px;color:#7A4A3A;line-height:1.65}
  .about-body{font-size:13.5px;color:#7A4A3A;line-height:1.9}
  .founder-card{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;background:#fff;border:1px solid #EDD9CF;border-radius:12px;padding:28px;margin-bottom:18px;box-shadow:0 1px 4px rgba(162,87,79,.06)}
  .founder-avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#A2574F,#E68057);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:#fff;flex-shrink:0}
  .founder-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#2C1810;margin-bottom:2px}
  .founder-role{font-size:11px;color:#BF7587;font-weight:500;letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px}
  .founder-bio{font-size:13.5px;color:#7A4A3A;line-height:1.8}
  .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .contact-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #EDD9CF}
  .contact-item:last-child{border-bottom:none}
  .contact-item-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#BF7587;font-weight:500;margin-bottom:3px}
  .contact-item-val{font-size:13px;color:#2C1810}
  .form-success{background:#EEF5E8;border:1.5px solid rgba(90,122,74,.3);border-radius:9px;padding:24px;text-align:center;color:#5A7A4A}
  .form-error-msg{font-size:11px;color:#A03030;margin-top:4px}
  .legal-tabs{display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid #EDD9CF;overflow-x:auto;white-space:nowrap}
  .legal-tab{padding:10px 18px;font-size:13px;font-weight:500;cursor:pointer;border:none;background:none;color:#7A4A3A;border-bottom:2px solid transparent;margin-bottom:-1px;font-family:'Instrument Sans',sans-serif;transition:color .12s}
  .legal-tab:hover{color:#2C1810}
  .legal-tab.active{color:#A2574F;border-bottom-color:#A2574F}
  .legal-section{margin-bottom:24px}
  .legal-section-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#2C1810;margin-bottom:10px;display:flex;align-items:center;gap:8px}
  .legal-body{font-size:13.5px;color:#7A4A3A;line-height:1.9}
  .legal-body p{margin-bottom:12px}
  .legal-body ul{padding-left:20px;margin-bottom:12px}
  .legal-body ul li{margin-bottom:6px}
  .legal-highlight{background:#F5ECF0;border-left:3px solid #A2574F;padding:12px 16px;border-radius:0 7px 7px 0;margin:14px 0;font-size:13px;color:#2C1810}
  .stat-banner{background:linear-gradient(135deg,#7A3830,#A2574F);padding:52px 32px;text-align:center}
  .stat-number{font-family:'Cormorant Garamond',serif;font-size:clamp(60px,9vw,96px);font-weight:700;color:#fff;line-height:1;margin-bottom:6px}
  .stat-label{font-family:'Cormorant Garamond',serif;font-size:clamp(18px,2.5vw,26px);font-weight:500;color:rgba(255,255,255,.85);line-height:1.4;max-width:600px;margin:0 auto 12px}
  .stat-source{font-size:11px;color:rgba(255,255,255,.45);margin:0 auto}
  .faq-wrap{padding:56px 48px;background:#FAF4F0;border-top:1px solid #EDD9CF}
  .faq-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:#2C1810;text-align:center;margin-bottom:6px}
  .faq-sub{font-size:14px;color:#7A4A3A;text-align:center;margin-bottom:34px}
  .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:900px;margin:0 auto}
  .faq-item{background:#fff;border:1px solid #EDD9CF;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(162,87,79,.05)}
  .faq-q{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;cursor:pointer;gap:12px;transition:background .12s}
  .faq-q:hover{background:#FAF4F0}
  .faq-q-text{font-size:13.5px;font-weight:600;color:#2C1810;line-height:1.4}
  .faq-a{padding:12px 18px 16px;font-size:13px;color:#7A4A3A;line-height:1.7;border-top:1px solid #EDD9CF}
  .landing{min-height:100vh;background:#FDF8F5;display:flex;flex-direction:column}
  .lnav{display:flex;align-items:center;justify-content:space-between;padding:18px 48px;border-bottom:1px solid #EDD9CF;background:#fff}
  .lhero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:72px 32px 52px}
  .ley{display:inline-flex;align-items:center;gap:7px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#A2574F;margin-bottom:22px;padding:5px 14px;border:1.5px solid rgba(162,87,79,.25);border-radius:20px;background:#fff;font-weight:600}
  .ltitle{font-family:'Cormorant Garamond',serif;font-size:clamp(40px,5.5vw,70px);font-weight:700;color:#2C1810;line-height:1.08;letter-spacing:-1.5px;margin-bottom:18px;max-width:720px}
  .ltitle em{color:#A2574F;font-style:italic}
  .ldesc{font-size:16px;color:#7A4A3A;max-width:480px;line-height:1.8;margin-bottom:36px}
  .lacts{display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:center}
  .bll{padding:12px 26px;font-size:14px;border-radius:8px}
  .try-btn{display:inline-flex;align-items:center;gap:7px;padding:12px 22px;font-size:13.5px;font-weight:500;color:#7A4A3A;background:#fff;border:1.5px solid #EDD9CF;border-radius:8px;cursor:pointer;font-family:'Instrument Sans',sans-serif;transition:all .15s}
  .try-btn:hover{border-color:#A2574F;color:#A2574F}
  .lfeats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #EDD9CF;background:#fff}
  .fc{background:#fff;padding:36px 32px;border-right:1px solid #EDD9CF}
  .fc:last-child{border-right:none}
  .fi{color:#A2574F;margin-bottom:14px}
  .ftt{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;margin-bottom:8px;color:#2C1810}
  .fd2{font-size:13px;color:#7A4A3A;line-height:1.75}
  .lfoot{padding:18px 48px;border-top:1px solid #EDD9CF;display:flex;justify-content:space-between;align-items:center;background:#fff;flex-wrap:wrap;gap:10px}
  .lft{font-size:11px;color:#BF7587}
  .lfoot-links{display:flex;gap:16px}
  .lfoot-link{font-size:11px;color:#BF7587;cursor:pointer;text-decoration:underline}
  .lfoot-link:hover{color:#A2574F}
  .aw{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#FDF8F5;padding:24px}
  .ac{width:400px;background:#fff;border:1px solid #EDD9CF;border-radius:14px;padding:36px;box-shadow:0 8px 40px rgba(44,24,16,.08)}
  .att{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;margin-bottom:6px}
  .ats{font-size:13px;color:#BF7587;margin-bottom:22px}
  .asw{text-align:center;margin-top:16px;font-size:12px;color:#BF7587}
  .aln{color:#A2574F;cursor:pointer;text-decoration:underline;font-weight:500}
  .aerr{background:#FFF0EE;border:1px solid rgba(160,48,48,.2);border-radius:7px;padding:10px 14px;font-size:12px;color:#A03030;margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .auth-try{text-align:center;margin-top:14px;padding-top:14px;border-top:1px solid #EDD9CF}
  .bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1.5px solid #EDD9CF;z-index:100;padding:6px 0 env(safe-area-inset-bottom,6px)}
  .bottom-nav-inner{display:flex;justify-content:space-around;align-items:center}
  .bn-item{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 8px;cursor:pointer;border:none;background:none;color:#BF7587;font-family:'Instrument Sans',sans-serif;transition:color .12s;min-width:44px}
  .bn-item.active{color:#A2574F}
  .bn-item span{font-size:9px;font-weight:500;letter-spacing:.3px}
  .more-sheet{position:fixed;bottom:64px;left:12px;right:12px;background:#fff;border:1px solid #EDD9CF;border-radius:12px;padding:8px;box-shadow:0 8px 32px rgba(44,24,16,.12);z-index:200}
  .more-item{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;cursor:pointer;color:#7A4A3A;font-size:14px;font-weight:500;transition:background .1s}
  .more-item:hover,.more-item.active{background:#F5ECF0;color:#A2574F}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#EDD9CF;border-radius:3px}
  @media(max-width:1024px){
    .form-grid{grid-template-columns:1fr !important;gap:12px}
    .ff{grid-column:1 !important}
    input[type="date"]{width:100%;display:block;box-sizing:border-box}
    .founder-card{grid-template-columns:1fr;text-align:center}
    .founder-avatar{margin:0 auto}
  }
  @media(max-width:768px){
    .app{flex-direction:column}
    .sidebar{display:none}
    .bottom-nav{display:block}
    .main{height:100vh;padding-bottom:64px}
    .content{padding:14px}
    .tb{padding:0 14px;height:50px;min-height:50px}
    .tbs{display:none}
    .sr{grid-template-columns:1fr 1fr;gap:10px}
    .crt{grid-template-columns:1fr 1fr;gap:10px}
    .cr{grid-template-columns:1fr;gap:10px}
    .cre{grid-template-columns:1fr;gap:10px}
    .vg{grid-template-columns:1fr 1fr;gap:10px}
    .contact-grid{grid-template-columns:1fr}
    .lnav{padding:14px 20px}
    .lhero{padding:44px 20px 36px}
    .lfeats{grid-template-columns:1fr}
    .fc{border-right:none;border-bottom:1px solid #EDD9CF}
    .fc:last-child{border-bottom:none}
    .lfoot{padding:14px 20px;flex-direction:column;gap:8px;text-align:center}
    .lacts{flex-direction:column;gap:10px;align-items:stretch}
    .try-btn{justify-content:center}
    .toast{bottom:76px;right:10px;left:10px;max-width:100%}
    .about-hero{padding:28px 20px}
    .about-title{font-size:26px}
    .ai-hero{padding:24px 18px}
    .ai-hero-title{font-size:20px}
    .sv{font-size:28px}
    .demo-banner{padding:10px 14px}
    .faq-grid{grid-template-columns:1fr}
    .faq-wrap{padding:36px 20px}
    .stat-banner{padding:36px 20px}
  }
  @media(max-width:480px){
    .sr{grid-template-columns:1fr 1fr}
    .vg{grid-template-columns:1fr}
    .sv{font-size:24px}
    .sc{padding:14px}
    .crt{grid-template-columns:1fr}
  }
`;
const SEED_ORG={id:"demo",name:"Shiksha Foundation",type:"Education",city:"Mumbai"};
const SEED_ACTIVITIES=[
  {id:1,name:"Digital Literacy Drive",type:"Education",activity_date:"2025-03-28",volunteers:8,beneficiaries:120,funds_utilized:12400,location:"Kurla",status:"Active"},
  {id:2,name:"Health Camp — Dharavi",type:"Healthcare",activity_date:"2025-03-24",volunteers:14,beneficiaries:380,funds_utilized:31200,location:"Dharavi",status:"Completed"},
  {id:3,name:"Women's Skill Training",type:"Livelihood",activity_date:"2025-03-20",volunteers:6,beneficiaries:45,funds_utilized:8750,location:"Bandra",status:"Active"},
  {id:4,name:"Mid-Day Meal Program",type:"Education",activity_date:"2025-03-18",volunteers:22,beneficiaries:510,funds_utilized:44100,location:"Govandi",status:"Completed"},
  {id:5,name:"Free Eye Checkup Camp",type:"Healthcare",activity_date:"2025-03-12",volunteers:9,beneficiaries:230,funds_utilized:19600,location:"Malad",status:"Completed"},
];
const SEED_VOLUNTEERS=[
  {id:1,name:"Priya Sharma",role:"Field Coordinator",email:"priya@example.com",hours_logged:142,events_attended:12,skills:"Teaching"},
  {id:2,name:"Arjun Mehta",role:"Data Analyst",email:"arjun@example.com",hours_logged:98,events_attended:8,skills:"Data Entry"},
  {id:3,name:"Sneha Iyer",role:"Healthcare Lead",email:"sneha@example.com",hours_logged:210,events_attended:17,skills:"First Aid"},
  {id:4,name:"Rohan Das",role:"Tech Volunteer",email:"rohan@example.com",hours_logged:76,events_attended:6,skills:"Web"},
  {id:5,name:"Kavya Nair",role:"Community Outreach",email:"kavya@example.com",hours_logged:165,events_attended:14,skills:"Communication"},
  {id:6,name:"Vikram Singh",role:"Logistics",email:"vikram@example.com",hours_logged:88,events_attended:9,skills:"Planning"},
];
const MONTHLY_DATA=[
  {month:"Oct",volunteers:12,beneficiaries:340,donations:28000},
  {month:"Nov",volunteers:18,beneficiaries:510,donations:41000},
  {month:"Dec",volunteers:24,beneficiaries:690,donations:67000},
  {month:"Jan",volunteers:21,beneficiaries:620,donations:52000},
  {month:"Feb",volunteers:31,beneficiaries:890,donations:78000},
  {month:"Mar",volunteers:38,beneficiaries:1120,donations:94000},
];

const db={
  async getOrg(uid){if(isDemo)return SEED_ORG;const{data}=await supabase.from("organizations").select("*").eq("user_id",uid).single();return data;},
  async createOrg(uid,p){if(isDemo)return{...SEED_ORG,...p};const{data}=await supabase.from("organizations").insert({user_id:uid,...p}).select().single();return data;},
  async getActivities(oid,isGuest){if(isDemo||isGuest)return[...SEED_ACTIVITIES];const{data}=await supabase.from("activities").select("*").eq("org_id",oid).order("activity_date",{ascending:false});return data||[];},
  async logActivity(oid,p,isGuest){const rec={id:Date.now(),org_id:oid,...p};if(isDemo||isGuest)return rec;const{data}=await supabase.from("activities").insert({org_id:oid,...p}).select().single();return data;},
  async getVolunteers(oid,isGuest){if(isDemo||isGuest)return[...SEED_VOLUNTEERS];const{data}=await supabase.from("volunteers").select("*").eq("org_id",oid).order("created_at",{ascending:false});return data||[];},
  async addVolunteer(oid,p,isGuest){const rec={id:Date.now(),org_id:oid,hours_logged:0,events_attended:0,...p};if(isDemo||isGuest)return rec;const{data}=await supabase.from("volunteers").insert({org_id:oid,...p}).select().single();return data;},
  async updateVolunteer(id,p,isGuest){if(isDemo||isGuest)return;await supabase.from("volunteers").update(p).eq("id",id);},
  async deleteVolunteer(id,isGuest){if(isDemo||isGuest)return;await supabase.from("volunteers").delete().eq("id",id);},
};

const gradeActivities=(activities)=>{
  if(!activities.length)return{};
  const scores=activities.map(a=>{const b=Number(a.beneficiaries)||0,v=Number(a.volunteers)||0,f=Number(a.funds_utilized)||0;const cpp=b>0?f/b:Infinity;return{id:a.id,raw:b*0.5+v*10+(cpp<200?30:cpp<500?15:0)};});
  if(scores.length<3){const map={};scores.forEach(s=>{map[s.id]=s.raw>120?"A":s.raw>60?"B":s.raw>20?"C":"D";});return map;}
  const sorted=[...scores].sort((a,b)=>b.raw-a.raw);const map={};
  sorted.forEach((s,i)=>{const p=i/sorted.length;map[s.id]=p<0.25?"A":p<0.55?"B":p<0.80?"C":"D";});return map;
};
const gradeVolunteers=(volunteers)=>{
  if(!volunteers.length)return{};
  const scores=volunteers.map(v=>({id:v.id,raw:(v.hours_logged||0)*0.5+(v.events_attended||0)*10}));
  if(scores.length<3){const map={};scores.forEach(s=>{if(s.raw>=150)map[s.id]={label:"Top Performer",cls:"bgo2"};else if(s.raw>=80)map[s.id]={label:"Active",cls:"bg2"};else if(s.raw>=30)map[s.id]={label:"Moderate",cls:"ba2"};else map[s.id]={label:"Needs Engagement",cls:"br"};});return map;}
  const sorted=[...scores].sort((a,b)=>b.raw-a.raw);const map={};
  sorted.forEach((s,i)=>{const p=i/sorted.length;if(p<0.20)map[s.id]={label:"Top Performer",cls:"bgo2"};else if(p<0.55)map[s.id]={label:"Active",cls:"bg2"};else if(p<0.85)map[s.id]={label:"Moderate",cls:"ba2"};else map[s.id]={label:"Needs Engagement",cls:"br"};});return map;
};
const calcMetrics=(activities)=>{
  if(!activities.length)return{costPerBeneficiary:0,retentionRate:0};
  const totF=activities.reduce((s,a)=>s+(Number(a.funds_utilized)||0),0);
  const totB=activities.reduce((s,a)=>s+(Number(a.beneficiaries)||0),0);
  const totV=activities.reduce((s,a)=>s+(Number(a.volunteers)||0),0);
  return{costPerBeneficiary:totB>0?Math.round(totF/totB):0,retentionRate:Math.min(100,Math.round((totV/(activities.length*10))*100))};
};
const getSuggestion=(a,grade)=>{
  const b=Number(a.beneficiaries)||0,v=Number(a.volunteers)||0,f=Number(a.funds_utilized)||0;
  if(grade==="A")return"Top of your portfolio — replicate this programme model.";
  if(b<30)return"Beneficiary reach is below your portfolio average — expand outreach.";
  if(v<4)return"Volunteer deployment is thin — recruit more before scaling.";
  if(f>0&&b>0&&f/b>500)return"Cost per beneficiary is high relative to other programmes.";
  return"Solid performance — maintain consistency and documentation.";
};
const calcPredictions=()=>{
  const m=MONTHLY_DATA,last=m[m.length-1],prev=m[m.length-2];
  const bg=(last.beneficiaries-prev.beneficiaries)/prev.beneficiaries;
  const vg=(last.volunteers-prev.volunteers)/prev.volunteers;
  const fg=(last.donations-prev.donations)/prev.donations;
  return{beneficiaries:Math.round(last.beneficiaries*(1+bg)),volunteers:Math.round(last.volunteers*(1+vg)),funds:Math.round(last.donations*(1+fg)),bGrowth:Math.round(bg*100),vGrowth:Math.round(vg*100),fGrowth:Math.round(fg*100)};
};

const exportPDF=async(org,activities)=>{
  const{default:jsPDF}=await import("jspdf");const{default:autoTable}=await import("jspdf-autotable");
  const doc=new jsPDF();
  const totB=activities.reduce((s,a)=>s+(Number(a.beneficiaries)||0),0);
  const totF=activities.reduce((s,a)=>s+(Number(a.funds_utilized)||0),0);
  doc.setFillColor(122,56,48);doc.rect(0,0,210,48,"F");
  doc.setTextColor(253,248,245);doc.setFontSize(20);doc.setFont("helvetica","bold");doc.text(org?.name||"NGO",14,20);
  doc.setFontSize(11);doc.setFont("helvetica","normal");doc.setTextColor(220,180,170);
  doc.text("Impact Report — Q1 2025",14,30);doc.text(`Generated by ImpactLens · ${new Date().toLocaleDateString("en-IN")}`,14,39);
  doc.setTextColor(40,40,40);doc.setFontSize(11);doc.setFont("helvetica","bold");doc.text("Summary",14,62);
  doc.setFont("helvetica","normal");doc.setFontSize(10);
  [["Total Beneficiaries",totB.toLocaleString()],["Funds Utilised",`INR ${totF.toLocaleString()}`],["Programmes Run",activities.length.toString()],["Cost per Beneficiary",totB>0?`INR ${Math.round(totF/totB)}`:"N/A"]].forEach(([k,v],i)=>{doc.setTextColor(120,120,120);doc.text(k,14,72+i*8);doc.setTextColor(40,40,40);doc.text(v,90,72+i*8);});
  autoTable(doc,{startY:108,head:[["Programme","Type","Date","Beneficiaries","Volunteers","Funds (INR)"]],body:activities.map(a=>[a.name,a.type,a.activity_date,a.beneficiaries,a.volunteers,Number(a.funds_utilized).toLocaleString()]),headStyles:{fillColor:[122,56,48],textColor:[253,248,245],fontSize:9},bodyStyles:{fontSize:9,textColor:[40,40,40]},alternateRowStyles:{fillColor:[253,248,245]}});
  doc.save(`ImpactLens_${org?.name||"NGO"}_Q1_2025.pdf`);
};

const CT=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(<div style={{background:"#fff",border:"1px solid #EDD9CF",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#2C1810",boxShadow:"0 4px 16px rgba(44,24,16,.1)"}}><div style={{color:"#BF7587",fontSize:11,marginBottom:5,fontWeight:500}}>{label}</div>{payload.map((p,i)=>(<div key={i} style={{color:p.color||"#2C1810"}}>{p.name}: <strong>{p.name==="donations"||p.name==="funds"?`₹${Number(p.value).toLocaleString()}`:p.value}</strong></div>))}</div>);
};

const ScoreRing=({score=82})=>{
  const r=50,cx=65,cy=65,circ=2*Math.PI*r,dash=(score/100)*circ;
  const rows=[{label:"Fund Utilisation",val:"91%",pct:91},{label:"Beneficiary Reach",val:"78%",pct:78},{label:"Volunteer Hours",val:"84%",pct:84},{label:"Report Frequency",val:"75%",pct:75}];
  return(<div><div className="rw"><div className="rl">Transparency Score</div><div className="rsw"><svg width="130" height="130" viewBox="0 0 130 130"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDD9CF" strokeWidth="9"/><circle cx={cx} cy={cy} r={r} fill="none" stroke="#A2574F" strokeWidth="9" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/></svg><div className="rc"><div className="rv">{score}</div><div className="rdl">/ 100</div></div></div></div><div>{rows.map(row=>(<div key={row.label} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}><span style={{color:"#7A4A3A",fontWeight:500}}>{row.label}</span><span style={{color:"#A2574F",fontFamily:"'Geist Mono',monospace",fontSize:11}}>{row.val}</span></div><div className="prog"><div className="pf" style={{width:`${row.pct}%`,background:"#A2574F"}}/></div></div>))}</div></div>);
};

const DemoBanner=({onSignUp})=>(<div className="demo-banner"><div className="demo-banner-text"><Icon name="info" size={15} color="#A2574F"/>Session only — data won't be saved when you close this tab. Create a free account to keep your work.</div><button className="btn bac bs" onClick={onSignUp}>Create free account</button></div>);

const FAQ_ITEMS=[
  {q:"What is ImpactLens?",a:"ImpactLens is a free analytics platform built for Indian NGOs. Log programmes, track beneficiaries, measure volunteer performance, and generate donor-ready impact reports — all in one place."},
  {q:"Is it really free?",a:"Yes, completely free for all NGOs. We operate on a pay-what-you-can model. A voluntary contribution keeps the platform running, but there is no obligation whatsoever."},
  {q:"How does the AI narrative work?",a:"Click 'Open in Claude' and your live programme data — beneficiaries, funds, outcomes — is automatically formatted into a prompt. Claude writes a professional donor narrative instantly. Copy it into your report."},
  {q:"Is my NGO's data safe?",a:"Yes. Data is stored in Supabase (SOC 2 certified, Mumbai region). Row-Level Security means no other organisation can access your records. All traffic is encrypted. No tracking cookies."},
  {q:"Can I try it without creating an account?",a:"Absolutely. Click 'Try without login' to explore the full platform. Log activities, register volunteers, see live analytics. Data is session-only — sign up when you're ready to save your work."},
  {q:"Who is it built for?",a:"Indian NGOs in education, healthcare, and livelihood sectors — especially those seeking grants, CSR funding, or institutional donors who require structured impact data."},
];
const FAQSection=()=>{
  const[open,setOpen]=useState(null);
  return(<div className="faq-wrap"><div className="faq-title">Frequently asked questions</div><div className="faq-sub">Everything you need to know about ImpactLens</div><div className="faq-grid">{FAQ_ITEMS.map((item,i)=>(<div key={i} className="faq-item"><div className="faq-q" onClick={()=>setOpen(open===i?null:i)}><span className="faq-q-text">{item.q}</span><div style={{transform:open===i?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s",flexShrink:0}}><Icon name="chevron" size={16} color="#BF7587"/></div></div>{open===i&&<div className="faq-a">{item.a}</div>}</div>))}</div></div>);
};

const Dashboard=({org,activities,volunteers,setPage})=>{
  const totB=activities.reduce((s,a)=>s+(Number(a.beneficiaries)||0),0);
  const totF=activities.reduce((s,a)=>s+(Number(a.funds_utilized)||0),0);
  const totV=activities.reduce((s,a)=>s+(Number(a.volunteers)||0),0);
  const{costPerBeneficiary,retentionRate}=calcMetrics(activities);
  const grades=gradeActivities(activities);
  const topVols=[...volunteers].sort((a,b)=>(b.hours_logged||0)-(a.hours_logged||0)).slice(0,3);
  const VIZ=C.viz;
  return(<div className="content">
    <div className="sr">{[{label:"Total Beneficiaries",value:totB.toLocaleString(),delta:"+18% this month",icon:"users"},{label:"Volunteers Deployed",value:totV.toString(),delta:"+7 this month",icon:"person"},{label:"Funds Utilised",value:`₹${(totF/100000).toFixed(2)}L`,delta:"+24% vs prior month",icon:"bar"},{label:"Programmes",value:activities.length.toString(),delta:`${activities.filter(a=>a.status==="Active").length} active`,icon:"trending"}].map(s=>(<div key={s.label} className="sc"><div className="si"><Icon name={s.icon} size={17}/></div><div className="sl">{s.label}</div><div className="sv">{s.value}</div><div className="sd"><Icon name="trending" size={11} color="#5A7A4A"/>{s.delta}</div></div>))}</div>
    <div className="crt" style={{marginBottom:16}}>{[{label:"Cost per Beneficiary",value:`₹${costPerBeneficiary.toLocaleString()}`,delta:"Lower is better",color:VIZ[2]},{label:"Volunteer Retention",value:`${retentionRate}%`,delta:retentionRate>=70?"Strong":"Needs attention",color:retentionRate>=50?VIZ[1]:C.red},{label:"Programmes Graded",value:activities.length.toString(),delta:"Relative ranking active",color:VIZ[0]}].map(s=>(<div key={s.label} className="sc"><div className="sl">{s.label}</div><div className="sv">{s.value}</div><div className="sd" style={{color:s.color}}><Icon name="trending" size={11} color={s.color}/>{s.delta}</div></div>))}</div>
    <div className="cr">
      <div className="card"><div className="ch"><div><div className="ct">Impact Trend</div><div className="cs">Monthly beneficiaries & volunteers</div></div><div style={{display:"flex",gap:14}}>{[{c:VIZ[0],l:"Beneficiaries"},{c:VIZ[1],l:"Volunteers"}].map(x=>(<div key={x.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#7A4A3A"}}><div style={{width:7,height:7,borderRadius:"50%",background:x.c}}/>{x.l}</div>))}</div></div>
        <div className="cb" style={{paddingTop:8}}><ResponsiveContainer width="100%" height={200}><AreaChart data={MONTHLY_DATA}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={VIZ[0]} stopOpacity={0.18}/><stop offset="100%" stopColor={VIZ[0]} stopOpacity={0}/></linearGradient><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={VIZ[1]} stopOpacity={0.15}/><stop offset="100%" stopColor={VIZ[1]} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="2 4" stroke="#EDD9CF" vertical={false}/><XAxis dataKey="month" tick={{fontSize:10,fill:"#BF7587"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:"#BF7587"}} axisLine={false} tickLine={false}/><Tooltip content={<CT/>}/><Area type="monotone" dataKey="beneficiaries" stroke={VIZ[0]} strokeWidth={2} fill="url(#ag)" name="beneficiaries" dot={false}/><Area type="monotone" dataKey="volunteers" stroke={VIZ[1]} strokeWidth={2} fill="url(#gg)" name="volunteers" dot={false}/></AreaChart></ResponsiveContainer></div>
      </div>
      <div className="card"><div className="ch"><div><div className="ct">Trust Index</div><div className="cs">Donor confidence composite</div></div></div><div className="cb"><ScoreRing score={82}/></div></div>
    </div>
    <div className="cre">
      <div className="card"><div className="ch"><div><div className="ct">Fund Disbursement</div><div className="cs">Monthly utilisation (₹)</div></div></div><div className="cb" style={{paddingTop:8}}><ResponsiveContainer width="100%" height={160}><BarChart data={MONTHLY_DATA} barSize={20}><CartesianGrid strokeDasharray="2 4" stroke="#EDD9CF" vertical={false}/><XAxis dataKey="month" tick={{fontSize:10,fill:"#BF7587"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:"#BF7587"}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/><Tooltip content={<CT/>}/><Bar dataKey="donations" fill={VIZ[2]} radius={[3,3,0,0]} name="donations"/></BarChart></ResponsiveContainer></div></div>
      <div className="card"><div className="ch"><div><div className="ct">Top Volunteers</div><div className="cs">By hours this quarter</div></div><button className="btn bg bs" onClick={()=>setPage("volunteers")}>View all</button></div><div>{topVols.map((v,i)=>(<div key={v.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 20px",borderBottom:i<topVols.length-1?"1px solid #EDD9CF":"none"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:"#BF7587",width:18}}>{i+1}</div><div className="va" style={{width:30,height:30,fontSize:13}}>{v.name[0]}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{v.name}</div><div style={{fontSize:11,color:"#BF7587"}}>{v.role}</div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"'Geist Mono',monospace",fontSize:13,color:VIZ[0],fontWeight:500}}>{v.hours_logged}h</div><div style={{fontSize:10,color:"#BF7587"}}>{v.events_attended} events</div></div></div>))}</div></div>
    </div>
    <div className="card"><div className="ch"><div className="ct">Recent Programmes</div><button className="btn bp bs" onClick={()=>setPage("log")}><Icon name="plus" size={13}/>Log Activity</button></div>
      <div className="tbl-wrap"><table><thead><tr><th>Programme</th><th>Type</th><th>Date</th><th>Volunteers</th><th>Beneficiaries</th><th>Cost/Person</th><th>Grade</th><th>Status</th></tr></thead><tbody>{activities.slice(0,5).map(a=>{const grade=grades[a.id]||"C";const cpp=a.beneficiaries>0?Math.round(a.funds_utilized/a.beneficiaries):0;return(<tr key={a.id}><td style={{fontWeight:500}}>{a.name}</td><td><span className="badge bd2">{a.type}</span></td><td className="mono">{a.activity_date}</td><td className="mono">{a.volunteers}</td><td className="mono">{a.beneficiaries}</td><td className="mono">₹{cpp.toLocaleString()}</td><td><span className={`score-badge score-${grade.toLowerCase()}`}>{grade}</span></td><td><span className={`badge ${a.status==="Active"?"bst":"bd2"}`}>{a.status}</span></td></tr>);})}</tbody></table></div>
    </div>
  </div>);
};

const LogActivity=({org,onSave,setPage,showToast,isGuest})=>{
  const[form,setFormState]=useState({name:"",type:"Education",activity_date:"",volunteers:"",beneficiaries:"",funds_utilized:"",location:"",description:"",status:"Active"});
  const[loading,setLoading]=useState(false);
  const set=(k,v)=>setFormState(f=>({...f,[k]:v}));
  const submit=async()=>{
    if(!form.name||!form.activity_date){showToast("Name and date are required.","err");return;}
    setLoading(true);
    try{const rec=await db.logActivity(org.id,{...form,volunteers:+form.volunteers||0,beneficiaries:+form.beneficiaries||0,funds_utilized:+form.funds_utilized||0},isGuest);onSave(rec);showToast(isGuest?"Activity added (session only).":"Activity saved.");setPage("dashboard");}
    catch{showToast("Failed to save.","err");}
    setLoading(false);
  };
  return(<div className="content"><div style={{maxWidth:700,margin:"0 auto"}}>
    <div style={{marginBottom:22}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600}}>Log Programme</div><div style={{fontSize:13,color:"#BF7587",marginTop:4}}>Record a field activity, camp, or training event</div></div>
    <div className="card"><div className="cb"><div className="form-grid">
      <div className="fd ff"><label>Programme Name</label><input placeholder="e.g. Digital Literacy Drive — Kurla" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
      <div className="fd"><label>Type</label><select value={form.type} onChange={e=>set("type",e.target.value)}>{["Education","Healthcare","Livelihood","Environment","Other"].map(t=><option key={t}>{t}</option>)}</select></div>
      <div className="fd"><label>Status</label><select value={form.status} onChange={e=>set("status",e.target.value)}><option>Active</option><option>Completed</option><option>Planned</option></select></div>
      <div className="fd"><label>Date</label><input type="date" value={form.activity_date} onChange={e=>set("activity_date",e.target.value)}/></div>
      <div className="fd"><label>Location</label><input placeholder="e.g. Dharavi, Mumbai" value={form.location} onChange={e=>set("location",e.target.value)}/></div>
      <div className="fd"><label>Volunteers Deployed</label><input type="number" min="0" placeholder="0" value={form.volunteers} onChange={e=>set("volunteers",e.target.value)}/></div>
      <div className="fd"><label>Beneficiaries Reached</label><input type="number" min="0" placeholder="0" value={form.beneficiaries} onChange={e=>set("beneficiaries",e.target.value)}/></div>
      <div className="fd ff"><label>Funds Utilised (₹)</label><input type="number" min="0" placeholder="0" value={form.funds_utilized} onChange={e=>set("funds_utilized",e.target.value)}/></div>
      <div className="fd ff"><label>Outcomes & Description</label><textarea placeholder="Describe key outcomes, challenges, and observations..." value={form.description} onChange={e=>set("description",e.target.value)} style={{minHeight:100}}/></div>
    </div></div><div className="mf"><button className="btn bg" onClick={()=>setPage("dashboard")}>Cancel</button><button className="btn bp" onClick={submit} disabled={loading}>{loading?"Saving…":<><Icon name="check" size={13}/>Save Activity</>}</button></div></div>
  </div></div>);
};

const Volunteers=({org,volunteers,setVolunteers,showToast,isGuest})=>{
  const[modal,setModal]=useState(false);const[editing,setEditing]=useState(null);
  const[form,setFormState]=useState({name:"",role:"Field Coordinator",email:"",phone:"",skills:"",hours_logged:0,events_attended:0});
  const[loading,setLoading]=useState(false);
  const set=(k,v)=>setFormState(f=>({...f,[k]:v}));
  const volGrades=gradeVolunteers(volunteers);
  const sorted=[...volunteers].sort((a,b)=>(b.hours_logged||0)-(a.hours_logged||0));
  const openAdd=()=>{setEditing(null);setFormState({name:"",role:"Field Coordinator",email:"",phone:"",skills:"",hours_logged:0,events_attended:0});setModal(true);};
  const openEdit=(v)=>{setEditing(v);setFormState({name:v.name,role:v.role||"Field Coordinator",email:v.email||"",phone:v.phone||"",skills:v.skills||"",hours_logged:v.hours_logged||0,events_attended:v.events_attended||0});setModal(true);};
  const submit=async()=>{
    if(!form.name){showToast("Name is required.","err");return;}setLoading(true);
    try{const payload={...form,hours_logged:+form.hours_logged||0,events_attended:+form.events_attended||0};
      if(editing){await db.updateVolunteer(editing.id,payload,isGuest);setVolunteers(v=>v.map(x=>x.id===editing.id?{...x,...payload}:x));showToast("Volunteer updated.");}
      else{const rec=await db.addVolunteer(org.id,payload,isGuest);setVolunteers(v=>[rec,...v]);showToast(isGuest?"Volunteer added (session only).":"Volunteer registered.");}
      setModal(false);}catch{showToast("Failed to save.","err");}setLoading(false);
  };
  const deleteVol=async(id)=>{if(!window.confirm("Remove this volunteer?"))return;try{await db.deleteVolunteer(id,isGuest);setVolunteers(v=>v.filter(x=>x.id!==id));showToast("Removed.");}catch{showToast("Failed.","err");}};
  return(<div className="content">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600}}>Volunteer Registry</div><div style={{fontSize:12,color:"#BF7587",marginTop:3}}>{volunteers.length} registered · {volunteers.reduce((s,v)=>s+(v.hours_logged||0),0).toLocaleString()} hours · Ranked relative to each other</div></div>
      <button className="btn bp" onClick={openAdd}><Icon name="plus" size={13}/>Register Volunteer</button>
    </div>
    <div className="vg">{sorted.map(v=>{const perf=volGrades[v.id]||{label:"Moderate",cls:"ba2"};return(<div key={v.id} className="vc"><div className="vh"><div className="va">{v.name[0]}</div><span className={`badge ${perf.cls}`}>{perf.label}</span></div><div className="vn">{v.name}</div><div className="vr2">{v.role||"Volunteer"}</div>{v.email&&<div style={{fontSize:11,color:"#BF7587",marginTop:2}}>{v.email}</div>}<div className="vs"><div><div className="vv">{v.hours_logged||0}</div><div className="vl">Hours</div></div><div><div className="vv">{v.events_attended||0}</div><div className="vl">Events</div></div></div>{perf.label==="Needs Engagement"&&<div style={{marginTop:10,padding:"8px 10px",background:"#FFF3DC",borderRadius:6,fontSize:11,color:"#C07830",border:"1px solid rgba(192,120,48,.2)"}}>Low activity vs peers — consider reaching out to re-engage.</div>}<div className="vc-actions"><div className="vc-btn" onClick={()=>openEdit(v)}>Edit</div><div className="vc-btn del" onClick={()=>deleteVol(v.id)}>Remove</div></div></div>);})}</div>
    {modal&&(<div className="overlay" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="mh"><div className="mt">{editing?"Edit Volunteer":"Register Volunteer"}</div><div className="ms">{editing?"Update details, hours and events":"Add a new member to your registry"}</div></div><div className="mb"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><div className="fd"><label>Full Name</label><input placeholder="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/></div><div className="fd"><label>Role</label><select value={form.role} onChange={e=>set("role",e.target.value)}>{["Field Coordinator","Healthcare Lead","Tech Volunteer","Data Analyst","Community Outreach","Logistics","Other"].map(r=><option key={r}>{r}</option>)}</select></div><div className="fd"><label>Email</label><input type="email" placeholder="email@example.com" value={form.email} onChange={e=>set("email",e.target.value)}/></div><div className="fd"><label>Phone</label><input placeholder="+91 99999 99999" value={form.phone} onChange={e=>set("phone",e.target.value)}/></div><div className="fd"><label>Hours Logged</label><input type="number" min="0" value={form.hours_logged} onChange={e=>set("hours_logged",e.target.value)}/></div><div className="fd"><label>Events Attended</label><input type="number" min="0" value={form.events_attended} onChange={e=>set("events_attended",e.target.value)}/></div><div className="fd" style={{gridColumn:"1/-1"}}><label>Skills</label><input placeholder="e.g. Teaching, First Aid, Data Entry" value={form.skills} onChange={e=>set("skills",e.target.value)}/></div></div></div><div className="mf"><button className="btn bg" onClick={()=>setModal(false)}>Cancel</button><button className="btn bp" onClick={submit} disabled={loading}>{loading?"Saving…":editing?"Update":"Register"}</button></div></div></div>)}
  </div>);
};
const Reports=({org,activities,showToast})=>{
  const totB=activities.reduce((s,a)=>s+(Number(a.beneficiaries)||0),0);
  const totF=activities.reduce((s,a)=>s+(Number(a.funds_utilized)||0),0);
  const{costPerBeneficiary}=calcMetrics(activities);
  const grades=gradeActivities(activities);
  const[pdfLoading,setPdfLoading]=useState(false);
  const VIZ=C.viz;
  const openInClaude=()=>{
    const summary=activities.slice(0,5).map(a=>`${a.name} (${a.type}): ${a.beneficiaries} beneficiaries, ${a.volunteers} volunteers, ₹${a.funds_utilized} utilised`).join("; ");
    const prompt=`You are writing a donor impact narrative for ${org?.name||"an NGO"} based in ${org?.city||"India"}. Here is their Q1 2025 programme data: ${summary}. Total beneficiaries: ${totB}. Total funds utilised: ₹${totF}. Cost per beneficiary: ₹${costPerBeneficiary}. Write a compelling, concise 3-paragraph impact narrative (around 150 words) for a donor report. Be specific, human, and data-driven. No bullet points.`;
    window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`,"_blank");
  };
  const handlePDF=async()=>{setPdfLoading(true);try{await exportPDF(org,activities);showToast("PDF exported.");}catch{showToast("PDF export failed.","err");}setPdfLoading(false);};
  const bkd=[{label:"Education Programmes",amount:Math.round(totF*0.40),pct:40,color:VIZ[0]},{label:"Healthcare Camps",amount:Math.round(totF*0.28),pct:28,color:VIZ[1]},{label:"Livelihood Training",amount:Math.round(totF*0.20),pct:20,color:VIZ[2]},{label:"Operations",amount:Math.round(totF*0.12),pct:12,color:VIZ[3]}];
  return(<div className="content">
    <div style={{background:"linear-gradient(135deg,#7A3830,#A2574F)",borderRadius:12,padding:"28px 32px",marginBottom:18,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:"#fff",marginBottom:4}}>Impact Report — Q1 2025</div><div style={{fontSize:12,color:"rgba(255,255,255,.65)"}}>{org?.name||"NGO"} · January – March 2025</div>
        <div style={{display:"flex",gap:28,marginTop:18,flexWrap:"wrap"}}>{[[totB.toLocaleString(),"Beneficiaries"],["38","Volunteers"],[`₹${(totF/100000).toFixed(2)}L`,"Utilised"],["82","Trust Score"]].map(([v,l])=>(<div key={l}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:"#fff",lineHeight:1}}>{v}</div><div style={{fontSize:10,color:"rgba(255,255,255,.55)",textTransform:"uppercase",letterSpacing:1,marginTop:4}}>{l}</div></div>))}</div>
      </div>
      <button className="btn bs" style={{background:"rgba(255,255,255,.15)",color:"#fff",border:"1.5px solid rgba(255,255,255,.25)"}} onClick={handlePDF} disabled={pdfLoading}><Icon name="download" size={13}/>{pdfLoading?"Exporting…":"Export PDF"}</button>
    </div>
    <div className="card" style={{marginBottom:16}}><div className="ch"><div><div className="ct">AI Impact Narrative</div><div className="cs">Let Claude write your donor report from your real programme data</div></div></div><div className="cb"><div className="ai-hero"><div className="ai-hero-title">Generate your donor narrative in seconds</div><div className="ai-hero-desc">Click below and Claude opens with your NGO's programme data already loaded. Get a professional donor narrative instantly — copy it straight into your report.</div><button className="ai-open-btn" onClick={openInClaude}><AnthropicIcon size={18}/>Open in Claude</button><div className="ai-powered"><AnthropicIcon size={13}/><span>Powered by Claude · Anthropic</span></div></div></div></div>
    <div className="cre">
      <div className="card"><div className="ch"><div><div className="ct">Beneficiary Growth</div><div className="cs">Month-over-month</div></div></div><div className="cb" style={{paddingTop:8}}><ResponsiveContainer width="100%" height={180}><LineChart data={MONTHLY_DATA}><CartesianGrid strokeDasharray="2 4" stroke="#EDD9CF" vertical={false}/><XAxis dataKey="month" tick={{fontSize:10,fill:"#BF7587"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:"#BF7587"}} axisLine={false} tickLine={false}/><Tooltip content={<CT/>}/><Line type="monotone" dataKey="beneficiaries" stroke={VIZ[0]} strokeWidth={2} dot={{fill:VIZ[0],r:3,strokeWidth:0}} name="beneficiaries"/></LineChart></ResponsiveContainer></div></div>
      <div className="card"><div className="ch"><div><div className="ct">Financial Summary</div><div className="cs">Fund utilisation by programme</div></div></div><div className="cb">{bkd.map(row=>(<div key={row.label} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{display:"flex",alignItems:"center",gap:6,color:"#7A4A3A",fontWeight:500}}><span style={{width:8,height:8,borderRadius:"50%",background:row.color,display:"inline-block"}}/>{row.label}</span><span className="mono">₹{row.amount.toLocaleString()}</span></div><div className="prog"><div className="pf" style={{width:`${row.pct}%`,background:row.color}}/></div></div>))}</div></div>
    </div>
    <div className="card" style={{marginBottom:16}}><div className="ch"><div><div className="ct">Programme Impact Scores</div><div className="cs">Graded relative to each other</div></div></div><div className="tbl-wrap"><table><thead><tr><th>Programme</th><th>Grade</th><th>Suggestion</th></tr></thead><tbody>{activities.map(a=>{const grade=grades[a.id]||"C";return(<tr key={a.id}><td style={{fontWeight:500}}>{a.name}</td><td><span className={`score-badge score-${grade.toLowerCase()}`}>{grade}</span></td><td style={{color:"#7A4A3A",fontSize:12}}>{getSuggestion(a,grade)}</td></tr>);})}</tbody></table></div></div>
    <div className="card"><div className="ch"><div className="ct">All Programmes</div></div><div className="tbl-wrap"><table><thead><tr><th>Programme</th><th>Type</th><th>Date</th><th>Beneficiaries</th><th>Cost/Person</th><th>Funds</th><th>Status</th></tr></thead><tbody>{activities.map(a=>{const cpp=a.beneficiaries>0?Math.round(a.funds_utilized/a.beneficiaries):0;return(<tr key={a.id}><td style={{fontWeight:500}}>{a.name}</td><td><span className="badge bd2">{a.type}</span></td><td className="mono">{a.activity_date}</td><td className="mono">{a.beneficiaries}</td><td className="mono">₹{cpp.toLocaleString()}</td><td className="mono">₹{Number(a.funds_utilized).toLocaleString()}</td><td><span className={`badge ${a.status==="Active"?"bst":"bd2"}`}>{a.status}</span></td></tr>);})}</tbody></table></div></div>
  </div>);
};

const Analytics=({activities})=>{
  const pred=calcPredictions();const{costPerBeneficiary,retentionRate}=calcMetrics(activities);
  const forecastData=[...MONTHLY_DATA,{month:"Apr*",beneficiaries:pred.beneficiaries,volunteers:pred.volunteers,donations:pred.funds}];
  const VIZ=C.viz;
  const insights=[{color:VIZ[0],text:`Beneficiary reach is projected to grow ${pred.bGrowth>0?"+":""}${pred.bGrowth}% next month — on track to exceed ${Math.round(pred.beneficiaries/100)*100} people.`},{color:pred.bGrowth>10?VIZ[1]:"#C07830",text:`At ₹${costPerBeneficiary} per beneficiary, cost efficiency is ${costPerBeneficiary<150?"excellent":costPerBeneficiary<300?"average":"high"}. ${costPerBeneficiary>300?"Consolidate smaller programmes to reduce overhead.":"Maintain current resource allocation."}`},{color:retentionRate>=70?VIZ[1]:"#C07830",text:`Volunteer retention stands at ${retentionRate}%. ${retentionRate<70?"Recognition programmes and flexible scheduling improve retention significantly.":"Strong. Consider building a volunteer leadership track."}`},{color:VIZ[2],text:`Fund disbursement is trending ${pred.fGrowth>0?"upward":"downward"} at ${Math.abs(pred.fGrowth)}% month-over-month. ${pred.fGrowth>15?"Strong donor confidence — a good time to approach institutional funders.":"Focus on retention through quarterly impact reports."}`}];
  return(<div className="content">
    <div style={{marginBottom:20}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600}}>Predictive Analytics</div><div style={{fontSize:12,color:"#BF7587",marginTop:3}}>Next-month forecasts based on your 6-month trend</div></div>
    <div className="crt" style={{marginBottom:16}}>{[{label:"Predicted Beneficiaries",value:pred.beneficiaries.toLocaleString(),delta:`${pred.bGrowth>0?"+":""}${pred.bGrowth}% vs this month`,color:pred.bGrowth>0?VIZ[0]:"#A03030"},{label:"Predicted Volunteers",value:pred.volunteers.toString(),delta:`${pred.vGrowth>0?"+":""}${pred.vGrowth}% vs this month`,color:pred.vGrowth>0?VIZ[1]:"#A03030"},{label:"Predicted Fund Need",value:`₹${(pred.funds/1000).toFixed(0)}k`,delta:`${pred.fGrowth>0?"+":""}${pred.fGrowth}% vs this month`,color:VIZ[2]}].map(s=>(<div key={s.label} className="pred-card"><div className="pred-lbl">{s.label}</div><div className="pred-val">{s.value}</div><div className="pred-delta" style={{color:s.color}}><Icon name="trending" size={11} color={s.color}/>{s.delta}</div></div>))}</div>
    <div className="card" style={{marginBottom:16}}><div className="ch"><div><div className="ct">6-Month Forecast</div><div className="cs">Apr* is model-generated</div></div></div><div className="cb" style={{paddingTop:8}}><ResponsiveContainer width="100%" height={220}><AreaChart data={forecastData}><defs><linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={VIZ[0]} stopOpacity={0.18}/><stop offset="100%" stopColor={VIZ[0]} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="2 4" stroke="#EDD9CF" vertical={false}/><XAxis dataKey="month" tick={{fontSize:10,fill:"#BF7587"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:"#BF7587"}} axisLine={false} tickLine={false}/><Tooltip content={<CT/>}/><Area type="monotone" dataKey="beneficiaries" stroke={VIZ[0]} strokeWidth={2} fill="url(#fg2)" name="beneficiaries" dot={(props)=>{const isLast=props.index===forecastData.length-1;return<circle key={props.index} cx={props.cx} cy={props.cy} r={isLast?5:3} fill={isLast?VIZ[2]:VIZ[0]} strokeWidth={0}/>;}} /></AreaChart></ResponsiveContainer></div></div>
    <div className="card"><div className="ch"><div><div className="ct">Data-Driven Insights</div><div className="cs">Actionable recommendations from your trends</div></div></div><div className="cb" style={{padding:"6px 20px"}}>{insights.map((ins,i)=>(<div key={i} className="insight-row"><div className="insight-dot" style={{background:ins.color}}/><div className="insight-text">{ins.text}</div></div>))}</div></div>
  </div>);
};

const About=()=>(<div className="content">
  <div className="about-hero"><div className="about-title">Measuring what matters.<br/><em>Impact, not just intent.</em></div><div className="about-subtitle">ImpactLens was built on a simple belief: India's NGOs do extraordinary work, but most lack the financial analytics tools to prove it to the donors and institutions that could scale their impact.</div></div>
  <div className="founder-card"><div className="founder-avatar">A</div><div><div className="founder-name">Aly Siddiq</div><div className="founder-role">Founder · ImpactLens</div><div className="founder-bio">ImpactLens grew out of a genuine passion at the intersection of finance and technology. While studying how financial analysis and computer science can drive better decision-making, one sector kept standing out as underserved: India's NGO community. A field coordinator running health camps in Dharavi shouldn't need to be a financial analyst to prove her programme works. ImpactLens was built to make that story tell itself — automatically, for any NGO, regardless of their technical capacity. This platform is offered as a voluntary service, with the belief that access to good financial tooling should not be a privilege.</div></div></div>
  <div className="cre">
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="card"><div className="ch"><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,display:"flex",alignItems:"center",gap:8}}><Icon name="about" size={17} color="#A2574F"/>Our Story</div></div><div className="cb"><div className="about-body">The most underfunded NGOs are often the most effective — they simply lack the tools to demonstrate that effectiveness in quantifiable terms. ImpactLens applies financial analysis frameworks to social sector data: cost per beneficiary, fund utilisation ratios, volunteer retention rates, programme-level impact scoring.<br/><br/>Programmes are graded relative to each other — not against arbitrary benchmarks. Predictive modelling then helps NGOs plan forward, forecasting next month's resource needs so they approach donors proactively, not reactively.</div></div></div>
      <div className="card"><div className="ch"><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,display:"flex",alignItems:"center",gap:8}}><Icon name="heart" size={17} color="#A2574F"/>Our Model</div></div><div className="cb"><div className="about-body">ImpactLens is free for all NGOs — always. We operate on a pay-what-you-can philosophy because access to good financial tooling should not be a privilege. If ImpactLens helps your organisation secure more funding or deliver more impact, a voluntary contribution keeps the platform running.</div></div></div>
    </div>
    <div className="card"><div className="ch"><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,display:"flex",alignItems:"center",gap:8}}><Icon name="shield" size={17} color="#A2574F"/>How ImpactLens Helps</div></div><div className="cb"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{[{icon:"bar",title:"Financial Transparency",text:"Fund utilisation reports showing donors exactly where every rupee went."},{icon:"predict",title:"Forward Planning",text:"Predictive models forecast next month's resource needs from historical trends."},{icon:"sparkle",title:"AI Donor Reports",text:"Claude reads your data and writes compelling donor narratives in seconds."},{icon:"users",title:"Volunteer Intelligence",text:"Track performance, surface top contributors, flag those needing re-engagement."}].map(c=>(<div key={c.title} className="about-card"><div className="about-card-icon"><Icon name={c.icon} size={16} color="#A2574F"/></div><div className="about-card-title">{c.title}</div><div className="about-card-text">{c.text}</div></div>))}</div></div></div>
  </div>
</div>);

const ContactPage=()=>{
  const[contactState,contactSubmit]=useForm("xpqojqze");
  const[feedbackState,feedbackSubmit]=useForm("xpqojqze");
  return(<div className="content">
    <div style={{marginBottom:20}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600}}>Get in Touch</div><div style={{fontSize:12,color:"#BF7587",marginTop:3}}>Reach out to onboard your NGO, ask questions, or share feedback</div></div>
    <div className="contact-grid">
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="card"><div className="ch"><div className="ct">Contact & Enquiries</div></div><div className="cb">{contactState.succeeded?(<div className="form-success"><Icon name="check" size={22} color="#5A7A4A"/><div style={{marginTop:10,fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600}}>Message received</div><div style={{fontSize:12,marginTop:4}}>We'll respond within 24 hours.</div></div>):(<form onSubmit={contactSubmit} style={{display:"flex",flexDirection:"column",gap:13}}><div className="fd"><label>Your Name</label><input type="text" name="name" placeholder="Organisation or individual name" required/></div><div className="fd"><label>Email</label><input type="email" name="email" placeholder="your@email.com" required/><ValidationError field="email" prefix="Email" errors={contactState.errors} className="form-error-msg"/></div><div className="fd"><label>Type of Enquiry</label><select name="enquiry_type"><option>Onboard my NGO</option><option>Partnership opportunity</option><option>Technical support</option><option>General question</option></select></div><div className="fd"><label>Message</label><textarea name="message" placeholder="Tell us about your NGO or what you need..." required/><ValidationError field="message" prefix="Message" errors={contactState.errors} className="form-error-msg"/></div><button type="submit" className="btn bp bs" style={{alignSelf:"flex-start"}} disabled={contactState.submitting}><Icon name="mail" size={13}/>{contactState.submitting?"Sending…":"Send Message"}</button></form>)}</div></div>
        <div className="card"><div className="ch"><div className="ct">Direct Contact</div></div><div className="cb" style={{padding:"12px 20px"}}>{[{label:"Platform Enquiries",val:"alisiddiq1804@gmail.com",icon:"mail"},{label:"For NGOs",val:"Register via the form — we respond within 24 hours",icon:"users"},{label:"Built with",val:"React · Supabase · Vercel",icon:"leaf"}].map(item=>(<div key={item.label} className="contact-item"><div style={{marginTop:2}}><Icon name={item.icon} size={15} color="#A2574F"/></div><div><div className="contact-item-label">{item.label}</div><div className="contact-item-val">{item.val}</div></div></div>))}</div></div>
      </div>
      <div className="card"><div className="ch"><div className="ct">Platform Feedback</div></div><div className="cb">{feedbackState.succeeded?(<div className="form-success"><Icon name="check" size={22} color="#5A7A4A"/><div style={{marginTop:10,fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600}}>Thank you</div><div style={{fontSize:12,marginTop:4}}>Your feedback helps us improve for every NGO.</div></div>):(<form onSubmit={feedbackSubmit} style={{display:"flex",flexDirection:"column",gap:13}}><div className="fd"><label>Email (optional)</label><input type="email" name="email" placeholder="Leave blank to stay anonymous"/></div><div className="fd"><label>How would you rate ImpactLens?</label><select name="rating"><option>Excellent — exactly what NGOs need</option><option>Good — a few things could improve</option><option>Average — needs significant work</option><option>Poor — not useful yet</option></select></div><div className="fd"><label>What would make ImpactLens more useful?</label><textarea name="feedback" placeholder="Features, improvements, or anything on your mind..." required/><ValidationError field="feedback" prefix="Feedback" errors={feedbackState.errors} className="form-error-msg"/></div><button type="submit" className="btn bg bs" style={{alignSelf:"flex-start"}} disabled={feedbackState.submitting}><Icon name="message" size={13}/>{feedbackState.submitting?"Sending…":"Submit Feedback"}</button></form>)}</div></div>
    </div>
  </div>);
};

const Legal=({initialTab="privacy"})=>{
  const[tab,setTab]=useState(initialTab);
  return(<div className="content">
    <div style={{marginBottom:6}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600}}>Legal & Compliance</div><div style={{fontSize:12,color:"#BF7587",marginTop:3}}>Effective January 2026 · © 2026 ImpactLens · Aly Siddiq · All rights reserved</div></div>
    <div className="legal-tabs">{[{id:"privacy",label:"Privacy Policy"},{id:"terms",label:"Terms of Use"},{id:"data",label:"Data & Compliance"}].map(t=>(<button key={t.id} className={`legal-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>))}</div>
    {tab==="privacy"&&(<div>
      <div className="legal-highlight">ImpactLens is committed to protecting the privacy of NGOs and their data. We collect only what is necessary and never sell or share your data with third parties.</div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="info" size={16} color="#A2574F"/>What We Collect</div><div className="legal-body"><p>When you register on ImpactLens, we collect your email address and password (hashed, never readable), your organisation's name, city, and type, programme data you log, and volunteer registry information. We do not collect payment information, government IDs, or sensitive personal data about beneficiaries. No cookies are used. Your session is maintained via localStorage — a strictly necessary functional token that does not require consent under GDPR or India's DPDP Act.</p></div></div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="shield" size={16} color="#A2574F"/>How We Use Your Data</div><div className="legal-body"><p>Your data is used exclusively to display your analytics and generate reports. We do not use your data for advertising or profiling. When you use "Open in Claude", your data is sent directly from your browser to Claude.ai — ImpactLens does not relay or store this.</p></div></div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="lock" size={16} color="#A2574F"/>Storage & Security</div><div className="legal-body"><p>All data is stored in Supabase (SOC 2 Type II certified, South Asia / Mumbai region). Row-Level Security ensures each organisation can only access its own data. All traffic is encrypted via HTTPS. No tracking or marketing cookies are set.</p></div></div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="users" size={16} color="#A2574F"/>Your Rights</div><div className="legal-body"><ul><li>Access all data associated with your account</li><li>Delete your account and all data by emailing alisiddiq1804@gmail.com</li><li>Export your programme data via PDF export</li><li>Correct any inaccurate data through the platform's edit functions</li></ul></div></div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="mail" size={16} color="#A2574F"/>Contact</div><div className="legal-body"><p>For privacy queries, contact <strong>alisiddiq1804@gmail.com</strong>. We respond within 5 business days.</p></div></div>
    </div>)}
    {tab==="terms"&&(<div>
      <div className="legal-highlight">By using ImpactLens, you agree to these terms. They are designed to be fair, readable, and to protect both your organisation and the platform.</div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="check" size={16} color="#A2574F"/>Acceptance</div><div className="legal-body"><p>By accessing ImpactLens, you confirm you are authorised to act on behalf of your organisation and agree to these terms.</p></div></div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="leaf" size={16} color="#A2574F"/>Permitted Use</div><div className="legal-body"><p>ImpactLens is for NGOs and social sector organisations to log, analyse, and report impact. You agree to use the platform only for lawful purposes, provide accurate information, not attempt to access another organisation's data, and not use automated scripts to abuse the platform.</p></div></div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="file" size={16} color="#A2574F"/>Your Data Ownership</div><div className="legal-body"><p>All programme data, volunteer records, and reports you create remain your property. ImpactLens does not claim ownership. You grant ImpactLens a limited licence to store and display this data to provide the service.</p></div></div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="info" size={16} color="#A2574F"/>Disclaimer</div><div className="legal-body"><p>ImpactLens is provided "as is". Analytics and predictions are model-generated and should be used as indicative guidance only — not as financial or legal advice.</p></div></div>
    </div>)}
    {tab==="data"&&(<div>
      <div className="legal-highlight">ImpactLens takes a privacy-first approach to data architecture. This page explains our technical and legal compliance measures.</div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="shield" size={16} color="#A2574F"/>Security Architecture</div><div className="legal-body"><ul><li><strong>Row-Level Security (RLS):</strong> Enforced at database level — each NGO can only query its own records.</li><li><strong>Authentication:</strong> Supabase Auth with bcrypt password hashing.</li><li><strong>SQL Injection:</strong> All queries use Supabase's parameterised system.</li><li><strong>XSS Protection:</strong> React escapes all user-generated content by default.</li><li><strong>HTTPS:</strong> All traffic encrypted via Vercel's TLS.</li><li><strong>CORS:</strong> Supabase API only accepts requests from whitelisted domains. Add your Vercel domain in Supabase → Settings → API → CORS.</li><li><strong>No cookies:</strong> Session management uses localStorage only — no tracking cookies. No cookie consent banner required.</li></ul></div></div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="doc" size={16} color="#A2574F"/>Regulatory Compliance</div><div className="legal-body"><ul><li><strong>India DPDP Act 2026:</strong> Minimal data collection, secure storage, deletion on request.</li><li><strong>GDPR:</strong> Data stored in Mumbai region. Users have rights to access, correct, and delete data.</li><li><strong>IT Act 2000:</strong> Reasonable security practices maintained as required under Section 43A.</li></ul></div></div>
      <div className="legal-section"><div className="legal-section-title"><Icon name="info" size={16} color="#A2574F"/>Data Processors</div><div className="legal-body"><ul><li><strong>Supabase Inc.</strong> — Database, auth, storage (SOC 2 Type II)</li><li><strong>Vercel Inc.</strong> — Hosting and CDN (SOC 2 Type II)</li><li><strong>Formspree Inc.</strong> — Contact form processing</li><li><strong>Anthropic PBC (Claude.ai)</strong> — AI narratives sent directly from your browser. ImpactLens does not relay or store this data.</li></ul></div></div>
    </div>)}
  </div>);
};

const AuthPage=({onAuth,onGuest})=>{
  const[mode,setMode]=useState("login");const[email,setEmail]=useState("");const[pw,setPw]=useState("");
  const[orgName,setOrgName]=useState("");const[city,setCity]=useState("");
  const[loading,setLoading]=useState(false);const[err,setErr]=useState("");
  const submit=async()=>{
    setErr("");setLoading(true);
    if(isDemo){onAuth({id:"demo"},SEED_ORG);setLoading(false);return;}
    try{
      if(mode==="login"){const{data,error:e}=await supabase.auth.signInWithPassword({email,password:pw});if(e)throw e;const org=await db.getOrg(data.user.id);onAuth(data.user,org);}
      else{const{data,error:e}=await supabase.auth.signUp({email,password:pw});if(e)throw e;const org=await db.createOrg(data.user.id,{name:orgName,city});onAuth(data.user,org);}
    }catch(e){setErr(e.message||"Authentication failed.");}setLoading(false);
  };
  return(<div className="aw"><div className="ac">
    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:28}}><div className="lm"><Icon name="leaf" size={14} color="#A2574F"/></div><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600}}>ImpactLens</span></div>
    <div className="att">{mode==="login"?"Welcome back":"Register your NGO"}</div>
    <div className="ats">{mode==="login"?"Sign in to your organisation's dashboard":"Create an account to get started"}</div>
    {err&&<div className="aerr"><Icon name="info" size={14} color="#A03030"/>{err}</div>}
    <div style={{display:"flex",flexDirection:"column",gap:11}}>
      {mode==="signup"&&<><div className="fd"><label>Organisation Name</label><input placeholder="Shiksha Foundation" value={orgName} onChange={e=>setOrgName(e.target.value)}/></div><div className="fd"><label>City</label><input placeholder="Mumbai" value={city} onChange={e=>setCity(e.target.value)}/></div></>}
      <div className="fd"><label>Email</label><input type="email" placeholder="admin@ngo.org" value={email} onChange={e=>setEmail(e.target.value)}/></div>
      <div className="fd"><label>Password</label><input type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)}/></div>
      <button className="btn bp" style={{width:"100%",justifyContent:"center",padding:"11px",marginTop:4}} onClick={submit} disabled={loading}>{loading?"Please wait…":mode==="login"?"Sign In":"Create Account"}</button>
    </div>
    {isDemo&&<div style={{marginTop:14,padding:"11px 14px",background:"#F5ECF0",borderRadius:7,fontSize:12,color:"#A2574F",border:"1px solid rgba(162,87,79,.15)"}}>Demo mode — click Sign In to explore.</div>}
    <div className="asw">{mode==="login"?<>No account? <span className="aln" onClick={()=>setMode("signup")}>Register your NGO</span></>:<>Already registered? <span className="aln" onClick={()=>setMode("login")}>Sign in</span></>}</div>
    <div className="auth-try"><button className="try-btn" style={{width:"100%",justifyContent:"center"}} onClick={onGuest}><Icon name="eye" size={14} color="#7A4A3A"/>Try without login</button><div style={{fontSize:11,color:"#BF7587",marginTop:8}}>Your data won't be saved — session only</div></div>
  </div></div>);
};

const Landing=({onEnter,onGuest,onLegal})=>(<div className="landing">
  <nav className="lnav"><div style={{display:"flex",alignItems:"center",gap:9}}><div className="lm"><Icon name="leaf" size={14} color="#A2574F"/></div><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#2C1810"}}>ImpactLens</span></div><div style={{display:"flex",gap:10}}><button className="btn bg bs" onClick={onEnter}>Sign in</button><button className="btn bp bs" onClick={onEnter}>Get started free</button></div></nav>
  <div className="lhero">
    <div className="ley"><Icon name="shield" size={11} color="#A2574F"/>Built for Indian NGOs</div>
    <div className="ltitle">Turn your impact data into<br/><em>donor trust</em></div>
    <div className="ldesc">Log activities. Track beneficiaries. Generate transparent financial reports — and let AI write the donor narrative for you.</div>
    <div className="lacts"><button className="btn bp bll" onClick={onEnter}>Get started free <Icon name="arrow" size={14}/></button><button className="try-btn" onClick={onGuest}><Icon name="eye" size={14} color="#7A4A3A"/>Try without login</button></div>
    <div style={{fontSize:11,color:"#BF7587",marginTop:14}}>No account needed · Data not saved in session mode</div>
  </div>
  <div className="stat-banner">
    <div className="stat-number">67.4%</div>
    <div className="stat-label">of donors say trust is essential before giving to a charity — yet most NGOs have no system to demonstrate it.</div>
    <div className="stat-source">Source: Give.org Donor Trust Report · ImpactLens exists to close this gap.</div>
  </div>
  <div className="lfeats">{[{icon:"sparkle",title:"AI Impact Narratives",desc:"Claude reads your programme data and writes a compelling donor report in seconds — no writing required."},{icon:"predict",title:"Predictive Analytics",desc:"Forecast next month's beneficiary reach, volunteer needs, and fund requirements from your real trends."},{icon:"bar",title:"Financial Transparency",desc:"Cost per beneficiary, fund utilisation breakdowns, and a transparency score — the numbers that move donors."}].map(f=>(<div key={f.title} className="fc"><div className="fi"><Icon name={f.icon} size={22} color="#A2574F"/></div><div className="ftt">{f.title}</div><div className="fd2">{f.desc}</div></div>))}</div>
  <FAQSection/>
  <div className="lfoot"><div className="lft">© 2026 ImpactLens · Aly Siddiq · All rights reserved</div><div className="lfoot-links"><span className="lfoot-link" onClick={()=>onLegal("privacy")}>Privacy Policy</span><span className="lfoot-link" onClick={()=>onLegal("terms")}>Terms of Use</span><span className="lfoot-link" onClick={()=>onLegal("data")}>Data & Compliance</span></div></div>
</div>);

const SignOutModal=({onConfirm,onCancel})=>(<div className="overlay" onClick={onCancel}><div className="modal" style={{width:360}} onClick={e=>e.stopPropagation()}><div className="mh"><div className="mt">Sign out?</div><div className="ms">You'll need to sign in again to access your dashboard.</div></div><div className="mf"><button className="btn bg" onClick={onCancel}>Cancel</button><button className="btn bp" onClick={onConfirm}><Icon name="logout" size={13}/>Sign out</button></div></div></div>);

const NAV=[{id:"dashboard",icon:"grid",label:"Overview"},{id:"log",icon:"edit",label:"Log Activity"},{id:"volunteers",icon:"users",label:"Volunteers"},{id:"reports",icon:"file",label:"Reports"},{id:"analytics",icon:"predict",label:"Analytics"},{id:"about",icon:"about",label:"About"},{id:"contact",icon:"mail",label:"Contact"},{id:"legal",icon:"lock",label:"Legal"}];
const PAGE_META={dashboard:["Overview","Q1 2025"],log:["Log Activity","Record a new programme"],volunteers:["Volunteers","Registry & performance"],reports:["Reports","AI-powered donor documents"],analytics:["Analytics","Predictions & insights"],about:["About","Our story & philosophy"],contact:["Contact","Get in touch"],legal:["Legal","Privacy, Terms & Compliance"]};
const BOTTOM_NAV=[{id:"dashboard",icon:"grid",label:"Home"},{id:"log",icon:"edit",label:"Log"},{id:"reports",icon:"file",label:"Reports"},{id:"analytics",icon:"predict",label:"Analytics"},{id:"more",icon:"more",label:"More"}];
const MORE_ITEMS=[{id:"volunteers",icon:"users",label:"Volunteers"},{id:"about",icon:"about",label:"About"},{id:"contact",icon:"mail",label:"Contact"},{id:"legal",icon:"lock",label:"Legal"}];

export default function App(){
  const[view,setView]=useState("landing");const[user,setUser]=useState(null);const[org,setOrg]=useState(null);
  const[isGuest,setIsGuest]=useState(false);const[page,setPage]=useState("dashboard");const[legalTab,setLegalTab]=useState("privacy");
  const[activities,setActivities]=useState([]);const[volunteers,setVolunteers]=useState([]);
  const[dataLoading,setDataLoading]=useState(false);const[toast,setToast]=useState(null);
  const[showSignOut,setShowSignOut]=useState(false);const[showMore,setShowMore]=useState(false);

  const showToast=useCallback((msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);},[]);
  const onAuth=async(u,o)=>{setUser(u);setOrg(o);setIsGuest(false);setDataLoading(true);const[acts,vols]=await Promise.all([db.getActivities(o.id,false),db.getVolunteers(o.id,false)]);setActivities(acts);setVolunteers(vols);setDataLoading(false);setView("app");};
  const onGuest=()=>{setUser(null);setOrg({id:"guest",name:"Your Organisation",type:"NGO",city:"India"});setIsGuest(true);setActivities([]);setVolunteers([]);setView("app");};
  const onLogout=()=>{if(!isDemo&&!isGuest)supabase.auth.signOut();setUser(null);setOrg(null);setIsGuest(false);setView("landing");setPage("dashboard");setShowSignOut(false);};
  const onLegal=(tab)=>{setLegalTab(tab);setView("legal");};
  const navTo=(id)=>{setPage(id);setShowMore(false);};
  const onSaveActivity=rec=>setActivities(prev=>[rec,...prev]);
  const[title,sub]=PAGE_META[page]||["",""];

  if(view==="landing")return(<><style>{css}</style><Landing onEnter={()=>setView("auth")} onGuest={onGuest} onLegal={onLegal}/></>);
  if(view==="auth")return(<><style>{css}</style><AuthPage onAuth={onAuth} onGuest={onGuest}/></>);
  if(view==="legal")return(<><style>{css}</style><div style={{minHeight:"100vh",background:"#FDF8F5"}}><div style={{padding:"16px 32px",borderBottom:"1px solid #EDD9CF",background:"#fff",display:"flex",alignItems:"center",gap:12}}><button className="btn bg bs" onClick={()=>setView("landing")}><Icon name="arrow" size={12} color="#7A4A3A" style={{transform:"rotate(180deg)"}}/>Back</button><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600}}>ImpactLens · Legal</div></div><Legal initialTab={legalTab}/></div></>);

  return(<><style>{css}</style>
    <div className="app">
      <aside className="sidebar">
        <div className="sb-logo"><div className="lm"><Icon name="leaf" size={14} color="#A2574F"/></div><span className="ln">ImpactLens</span></div>
        <nav className="nav">
          <div className="ngl">Main</div>
          {NAV.slice(0,5).map(n=>(<button key={n.id} className={`ni ${page===n.id?"active":""}`} onClick={()=>navTo(n.id)}><Icon name={n.icon} size={15} color={page===n.id?"#A2574F":"#BF7587"}/>{n.label}</button>))}
          <div className="ngl" style={{marginTop:6}}>Platform</div>
          {NAV.slice(5).map(n=>(<button key={n.id} className={`ni ${page===n.id?"active":""}`} onClick={()=>navTo(n.id)}><Icon name={n.icon} size={15} color={page===n.id?"#A2574F":"#BF7587"}/>{n.label}</button>))}
        </nav>
        <div className="sb-footer"><div className="op" onClick={()=>setShowSignOut(true)}><div className="oa">{isGuest?"?":(org?.name?.[0]||"N")}</div><div><div className="on">{isGuest?"Guest Session":(org?.name||"Organisation")}</div><div className="ot">{isGuest?"Try without login":`${org?.city||"NGO"} · Sign out`}</div></div></div></div>
      </aside>
      <div className="main">
        {isGuest&&<DemoBanner onSignUp={()=>{setIsGuest(false);setView("auth");}}/>}
        <div className="tb">
          <div className="tbl"><div className="tbt">{title}</div><div className="tbs">{isGuest?"Guest Session · ":(org?.name?`${org.name} · `:"")}{sub}</div></div>
          <div className="tbr"><button className="btn bg bs" onClick={()=>setView("landing")}><Icon name="arrow" size={12} color="#BF7587" style={{transform:"rotate(180deg)"}}/>Landing</button>{page==="dashboard"&&<button className="btn bp bs" onClick={()=>navTo("log")}><Icon name="plus" size={13}/>Log Activity</button>}</div>
        </div>
        {dataLoading?(<div className="loader"><div className="spin"/>Loading data…</div>):(
          <>{page==="dashboard"&&<Dashboard org={org} activities={activities} volunteers={volunteers} setPage={navTo}/>}{page==="log"&&<LogActivity org={org} onSave={onSaveActivity} setPage={navTo} showToast={showToast} isGuest={isGuest}/>}{page==="volunteers"&&<Volunteers org={org} volunteers={volunteers} setVolunteers={setVolunteers} showToast={showToast} isGuest={isGuest}/>}{page==="reports"&&<Reports org={org} activities={activities} showToast={showToast}/>}{page==="analytics"&&<Analytics activities={activities}/>}{page==="about"&&<About/>}{page==="contact"&&<ContactPage/>}{page==="legal"&&<Legal initialTab={legalTab}/>}</>
        )}
      </div>
      <div className="bottom-nav"><div className="bottom-nav-inner">{BOTTOM_NAV.map(n=>(<button key={n.id} className={`bn-item ${page===n.id||(n.id==="more"&&showMore)?"active":""}`} onClick={()=>n.id==="more"?setShowMore(s=>!s):navTo(n.id)}><Icon name={n.icon} size={20} color={(page===n.id||(n.id==="more"&&showMore))?"#A2574F":"#BF7587"}/><span>{n.label}</span></button>))}</div></div>
      {showMore&&(<div className="more-sheet" onClick={e=>e.stopPropagation()}>{MORE_ITEMS.map(item=>(<div key={item.id} className={`more-item ${page===item.id?"active":""}`} onClick={()=>navTo(item.id)}><Icon name={item.icon} size={18} color={page===item.id?"#A2574F":"#7A4A3A"}/>{item.label}</div>))}</div>)}
    </div>
    {showSignOut&&<SignOutModal onConfirm={onLogout} onCancel={()=>setShowSignOut(false)}/>}
    {toast&&(<div className={`toast ${toast.type==="err"?"err":""}`}><Icon name={toast.type==="err"?"x":"check"} size={14} color="#fff"/>{toast.msg}</div>)}
  </>);
}
