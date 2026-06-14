/**
 * YatraSetu — TC Login Portal
 * Route: /tc/login
 *
 * Fullscreen layered layout — no split panel, no OTP button.
 * Locked to 100dvh on desktop. Card scrolls internally if needed.
 *
 * Redirect routes:
 *   Express TC → /ticket-checker/express/dashboard
 *   Local TC   → /ticket-checker/local/dashboard
 */
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  User, Lock, Eye, EyeOff, RefreshCw,
  Shield, LogIn,
  ChevronDown, ChevronUp, X, AlertTriangle, Globe,
  CheckCircle2, Headphones,
} from "lucide-react";
import {
  loginTC, validateAuthorizedDevice, getDeviceId, type TCType,
} from "@/services/authService";
import { generateCaptchaText } from "@/lib/auth-utils";

/* ── types ─────────────────────────────── */
type FE = { tcId?:string; password?:string; tcType?:string; captcha?:string; general?:string };

/* ── Captcha display ────────────────────── */
function CaptchaDisplay({ text }: { text: string }) {
  const cols  = ["#1e40af","#7c3aed","#0369a1","#1e40af","#4f46e5","#0f172a"];
  const tilts = [-8, 5, -4, 7, -6, 3];
  return (
    <div style={{display:"flex",gap:"4px",alignItems:"center",justifyContent:"center",
      padding:"0 12px",flex:1,userSelect:"none",
      background:"linear-gradient(135deg,#f1f5f9,#e2e8f0)"}}>
      {text.split("").map((ch,i)=>(
        <span key={i} style={{display:"inline-block",fontSize:"19px",fontWeight:800,
          fontFamily:"'Courier New',monospace",lineHeight:1,
          color:cols[i%cols.length],
          transform:`rotate(${tilts[i%tilts.length]}deg)`,
          textShadow:"1px 1px 0 rgba(0,0,0,0.08)"}}>
          {ch}
        </span>
      ))}
    </div>
  );
}

/* ── Unauthorized device modal ─────────── */
function UnauthorizedModal({ onClose }: { onClose:()=>void }) {
  const [did, setDid] = useState("—");
  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDid(getDeviceId());
  },[]);
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="ua-t" style={{
      position:"fixed",inset:0,zIndex:9999,background:"rgba(5,15,45,0.75)",
      backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{background:"#fff",borderRadius:"18px",padding:"28px 24px",maxWidth:"380px",
        width:"100%",boxShadow:"0 32px 80px rgba(0,0,0,0.4)",
        position:"relative",textAlign:"center"}}>
        <button onClick={onClose} aria-label="Close" style={{position:"absolute",top:"12px",
          right:"12px",background:"#f1f5f9",border:"none",borderRadius:"7px",
          width:"28px",height:"28px",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b"}}>
          <X size={14}/>
        </button>
        <div style={{width:"48px",height:"48px",borderRadius:"50%",
          background:"rgba(239,68,68,0.1)",
          display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
          <AlertTriangle size={22} color="#ef4444" strokeWidth={2}/>
        </div>
        <h2 id="ua-t" style={{fontSize:"17px",fontWeight:700,color:"#0b1f3a",margin:"0 0 8px"}}>
          Unauthorized Device
        </h2>
        <p style={{fontSize:"13px",color:"#64748b",lineHeight:1.55,margin:"0 0 16px"}}>
          This device is not registered for this TC account.<br/>
          Contact Railway Administrator to authorize it.
        </p>
        <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"9px",
          padding:"10px 12px",marginBottom:"16px",textAlign:"left"}}>
          <p style={{fontSize:"11px",color:"#94a3b8",margin:"0 0 2px"}}>Device ID</p>
          <p style={{fontSize:"11.5px",fontWeight:600,color:"#0f172a",fontFamily:"monospace",
            wordBreak:"break-all",margin:0}}>{did}</p>
        </div>
        <button onClick={onClose} style={{width:"100%",height:"42px",
          background:"linear-gradient(135deg,#1e40af,#2563eb)",
          color:"#fff",border:"none",borderRadius:"10px",
          fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          Understood
        </button>
      </div>
    </div>
  );
}

/* ── Train SVG ──────────────────────────── */
function TrainSVG({ size=18, color="#fff" }:{size?:number;color?:string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 10h18M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M3 10l1.5 6h15L21 10"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7.5" cy="16" r="1" fill={color}/>
      <circle cx="16.5" cy="16" r="1" fill={color}/>
    </svg>
  );
}

/* ── Indian Railways emblem ─────────────── */
function IRLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="24" fill="#1e3a8a"/>
      <circle cx="28" cy="28" r="19" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <circle cx="28" cy="28" r="7" fill="#fbbf24"/>
      <circle cx="28" cy="28" r="4" fill="#1e3a8a"/>
      {Array.from({length:12}).map((_,i)=>{
        const a=(i*30*Math.PI)/180;
        return <line key={i}
          x1={(28+8*Math.cos(a)).toFixed(1)}  y1={(28+8*Math.sin(a)).toFixed(1)}
          x2={(28+18*Math.cos(a)).toFixed(1)} y2={(28+18*Math.sin(a)).toFixed(1)}
          stroke="#fbbf24" strokeWidth="1.2"/>;
      })}
      <rect x="22" y="30" width="12" height="7" rx="1.5" fill="#fff"/>
      <rect x="24" y="28" width="8"  height="4" rx="1"   fill="#fff"/>
      <circle cx="24.5" cy="37.5" r="1.5" fill="#fbbf24"/>
      <circle cx="31.5" cy="37.5" r="1.5" fill="#fbbf24"/>
      <rect x="20" y="35" width="16" height="1" rx="0.5" fill="#93c5fd"/>
      <text x="28" y="18" textAnchor="middle" fontSize="4"   fontWeight="700" fill="#fbbf24" fontFamily="sans-serif">INDIAN</text>
      <text x="28" y="44" textAnchor="middle" fontSize="3.5" fontWeight="700" fill="#fbbf24" fontFamily="sans-serif">RAILWAYS</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function TCLoginPage() {
  const router = useRouter();

  /* form state */
  const [tcId,         setTcId]         = useState("");
  const [password,     setPassword]     = useState("");
  const [tcType,       setTcType]       = useState<TCType|"">("");
  const [showPwd,      setShowPwd]      = useState(false);
  const [remember,     setRemember]     = useState(true);
  const [captchaText,  setCaptchaText]  = useState("");   // populated client-side only
  const [captchaInput, setCaptchaInput] = useState("");
  const [errors,       setErrors]       = useState<FE>({});
  const [loading,      setLoading]      = useState(false);

  /* ui state */
  const [ddOpen,      setDdOpen]      = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const [unauthOpen,  setUnauthOpen]  = useState(false);

  const ddRef   = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  /* captcha: client-only — avoids SSR/hydration mismatch with Math.random() */
  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaptchaText(generateCaptchaText(6));
  },[]);

  /* close dropdowns on outside click */
  useEffect(()=>{
    function handler(e:MouseEvent){
      if(ddRef.current   && !ddRef.current.contains(e.target as Node))   setDdOpen(false);
      if(langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return ()=>document.removeEventListener("mousedown", handler);
  },[]);

  const refreshCaptcha = useCallback(()=>{
    setCaptchaText(generateCaptchaText(6));
    setCaptchaInput("");
    setErrors(p=>({...p, captcha:undefined}));
  },[]);

  /* validation */
  function validate(): boolean {
    const e: FE = {};
    const id = tcId.trim();
    if(!id)                                  e.tcId     = "TC ID is required.";
    else if(!/^[A-Za-z0-9]{4,8}$/.test(id)) e.tcId     = "Enter a valid 4–8 character TC ID.";
    if(!password)                            e.password = "Password is required.";
    else if(password.length < 6)            e.password = "Minimum 6 characters.";
    if(!tcType)                              e.tcType   = "Select your TC type.";
    if(!captchaInput.trim())                e.captcha  = "Enter the CAPTCHA.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* login submit */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if(!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const dev = await validateAuthorizedDevice(tcId.trim());
      if(!dev.authorized) { setUnauthOpen(true); setLoading(false); return; }

      const res = await loginTC({
        tcId: tcId.trim(), password,
        tcType: tcType as TCType,
        captchaAnswer: captchaInput,
        captchaExpected: captchaText,
        rememberDevice: remember,
      });

      if(res.success && res.redirectPath) {
        router.push(res.redirectPath);
      } else if(res.error === "UNAUTHORIZED_DEVICE") {
        setUnauthOpen(true);
        refreshCaptcha();
      } else {
        setErrors({ general: res.error ?? "Login failed. Please try again." });
        refreshCaptcha();
      }
    } catch {
      setErrors({ general: "Network error. Please try again." });
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  }

  /* input helpers */
  const iF = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#3b82f6";
    e.currentTarget.style.background  = "#fff";
    e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(59,130,246,0.10)";
  };
  const iB = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(203,213,225,0.9)";
    e.currentTarget.style.background  = "#f7f9fc";
    e.currentTarget.style.boxShadow   = "none";
  };

  const ttLabel = tcType==="express" ? "Express TC" : tcType==="local" ? "Local / Unreserved TC" : "";

  /* layout constants — must match CSS below */
  const TOPBAR_H = 52;
  const FOOTER_H = 40;
  const V_PAD    = 24;

  /* ─────────── RENDER ─────────── */
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        @keyframes tcspin   { to { transform:rotate(360deg); } }
        @keyframes tcfadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

        /* Root: exactly 100dvh on desktop — no outer scroll */
        .tc-root {
          width:100%; height:100vh; height:100dvh;
          overflow:hidden;
          background-image:url('/tc.webp');
          background-size:cover;
          background-position:30% center;
          background-repeat:no-repeat;
          background-color:#03122e;
          font-family:'Google Sans','Segoe UI',system-ui,sans-serif;
          position:relative;
          display:flex;
          flex-direction:column;
        }
        /* Mobile: allow natural page scroll */
        @media(max-width:767px){
          .tc-root{ height:auto; min-height:100vh; min-height:100dvh;
            overflow-x:hidden; overflow-y:auto; }
        }

        /* Dark gradient overlay — lighter left (train), darker right (card) */
        .tc-overlay{
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background:linear-gradient(
            108deg,
            rgba(2,8,28,0.38)  0%,
            rgba(3,12,42,0.48) 28%,
            rgba(4,16,55,0.65) 52%,
            rgba(4,18,60,0.80) 70%,
            rgba(3,14,52,0.88) 100%
          );
        }

        /* Topbar — real flex child (not fixed), occupies ${TOPBAR_H}px */
        .tc-topbar{
          position:relative; z-index:10; flex-shrink:0;
          height:${TOPBAR_H}px;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 20px;
          background:rgba(2,8,30,0.50);
          backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(255,255,255,0.07);
        }
        @media(min-width:640px){ .tc-topbar{ padding:0 32px; } }
        @media(min-width:1024px){ .tc-topbar{ padding:0 48px; } }

        /* Middle: fills remaining height, centres / right-aligns card */
        .tc-body{
          position:relative; z-index:2;
          flex:1 1 0%; min-height:0;
          display:flex; align-items:center; justify-content:center;
          padding:12px 16px;
        }
        @media(min-width:640px){ .tc-body{ padding:12px 24px; } }
        @media(min-width:1024px){ .tc-body{ justify-content:flex-end; padding:12px 52px; } }
        @media(min-width:1280px){ .tc-body{ padding:12px 72px; } }
        @media(min-width:1440px){ .tc-body{ padding:12px 96px; } }

        /* Login card — bounded height + internal scroll */
        .tc-card{
          position:relative; z-index:3;
          width:100%; max-width:460px;
          max-height:calc(100dvh - ${TOPBAR_H}px - ${FOOTER_H}px - ${V_PAD}px);
          overflow-y:auto; overflow-x:hidden;
          scrollbar-width:thin; scrollbar-color:rgba(37,99,235,0.3) transparent;
          background:rgba(255,255,255,0.97);
          backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px);
          border:1px solid rgba(255,255,255,0.80); border-radius:20px;
          padding:20px 22px 18px;
          box-shadow:0 2px 4px rgba(0,0,0,0.08),0 8px 32px rgba(0,0,0,0.30),0 24px 64px rgba(0,0,0,0.22);
          animation:tcfadein .35s ease;
        }
        .tc-card::-webkit-scrollbar{ width:4px; }
        .tc-card::-webkit-scrollbar-track{ background:transparent; }
        .tc-card::-webkit-scrollbar-thumb{ background:rgba(37,99,235,0.25); border-radius:9999px; }
        @media(min-width:640px){
          .tc-card{ max-width:500px; padding:22px 26px 20px;
            max-height:calc(100dvh - ${TOPBAR_H}px - ${FOOTER_H}px - ${V_PAD}px); }
        }
        @media(min-width:1024px){ .tc-card{ max-width:520px; padding:22px 28px 20px; } }
        @media(max-width:767px){ .tc-card{ max-height:none; overflow-y:visible; } }

        /* Form atoms */
        .f-lbl{ display:block; font-size:12px; font-weight:600; color:#1a3563; margin-bottom:4px; }
        .f-fld{ margin-bottom:11px; }
        .f-iw{ position:relative; }
        .f-inp{
          width:100%; height:40px;
          background:#f7f9fc; border:1.5px solid rgba(203,213,225,0.9); border-radius:10px;
          font-size:13.5px; font-family:inherit; color:#0f172a;
          outline:none; padding:0 12px 0 38px;
          transition:border-color .18s,box-shadow .18s,background .18s;
        }
        .f-inp::placeholder{ color:#94a3b8; font-size:13px; }
        .f-ico{ position:absolute; left:11px; top:50%; transform:translateY(-50%);
          color:#94a3b8; display:flex; pointer-events:none; }
        .f-sfx{ position:absolute; right:10px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer;
          color:#94a3b8; display:flex; padding:3px; transition:color .15s; }
        .f-sfx:hover{ color:#475569; }
        .f-err{ display:block; font-size:11px; color:#ef4444; margin-top:3px; font-weight:500; }

        /* Dropdown */
        .f-dd{
          width:100%; height:40px;
          background:#f7f9fc; border:1.5px solid rgba(203,213,225,0.9); border-radius:10px;
          font-size:13.5px; font-family:inherit; color:#0f172a;
          cursor:pointer; outline:none;
          display:flex; align-items:center; padding:0 11px 0 38px; gap:6px;
          text-align:left; transition:border-color .18s,box-shadow .18s;
        }
        .f-dd-menu{
          position:absolute; top:calc(100% + 4px); left:0; right:0;
          background:#fff; border:1.5px solid #e2e8f0; border-radius:11px;
          overflow:hidden; z-index:60;
          box-shadow:0 8px 28px rgba(15,23,42,0.14);
          animation:tcfadein .13s ease;
        }
        .f-dd-item{
          width:100%; border:none; background:none;
          padding:10px 13px; text-align:left;
          font-size:13px; font-family:inherit;
          cursor:pointer; display:flex; align-items:center; gap:9px;
          color:#0f172a; transition:background .1s;
        }
        .f-dd-item:hover{ background:rgba(239,246,255,0.9); }
        .f-dd-item--on{ background:rgba(239,246,255,0.75); font-weight:600; color:#1e40af; }
        .f-dd-item + .f-dd-item{ border-top:1px solid #f1f5f9; }

        /* Buttons */
        .btn-p{
          width:100%; height:42px; border:none; border-radius:11px;
          font-size:14px; font-weight:700; letter-spacing:.03em;
          display:flex; align-items:center; justify-content:center; gap:8px;
          font-family:inherit; cursor:pointer;
          transition:transform .18s,box-shadow .18s,filter .18s;
        }
        .btn-p:hover:not(:disabled){ transform:translateY(-2px); filter:brightness(1.06); }
        .btn-p:active:not(:disabled){ transform:translateY(0); }

        /* Authorized device pill */
        .tc-pill{
          position:fixed; bottom:${FOOTER_H + 8}px; left:20px;
          display:flex; align-items:center; gap:9px;
          background:rgba(4,14,48,0.72);
          backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          border:1px solid rgba(255,255,255,0.13); border-radius:12px;
          padding:8px 12px; z-index:5; max-width:230px; pointer-events:none;
        }
        @media(max-width:767px){ .tc-pill{ display:none; } }

        /* Footer bar */
        .tc-footer{
          position:relative; z-index:4; flex-shrink:0;
          height:${FOOTER_H}px;
          background:rgba(2,8,28,0.82);
          backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          border-top:1px solid rgba(255,255,255,0.07);
          display:flex; align-items:center; padding:0 20px;
        }
        @media(min-width:640px){ .tc-footer{ padding:0 32px; } }
        @media(min-width:1024px){ .tc-footer{ padding:0 48px; } }
        .tc-footer-inner{
          width:100%; display:flex; align-items:center;
          justify-content:space-between; gap:16px; flex-wrap:wrap;
        }

        .tc-link{ transition:color .15s; cursor:pointer; }
        .tc-link:hover{ color:#93c5fd!important; text-decoration:underline; }
      `}</style>

      <div className="tc-root">
        <div className="tc-overlay" aria-hidden="true"/>

        {/* ── Topbar ── */}
        <header className="tc-topbar">
          <div style={{display:"flex",alignItems:"center",gap:"9px",position:"relative",zIndex:1}}>
            <div style={{width:"32px",height:"32px",borderRadius:"8px",flexShrink:0,
              background:"linear-gradient(135deg,#1e3a8a,#2563eb)",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <TrainSVG size={16}/>
            </div>
            <div>
              <div style={{fontSize:"14px",fontWeight:700,lineHeight:1.2}}>
                <span style={{color:"#fff"}}>Yatra</span>
                <span style={{color:"#93c5fd"}}>Setu</span>
              </div>
              <div style={{fontSize:"10px",color:"rgba(255,255,255,0.50)",lineHeight:1}}>TC Portal</div>
            </div>
          </div>

          <div ref={langRef} style={{position:"relative",zIndex:1}}>
            <button onClick={()=>setLangOpen(v=>!v)}
              aria-label="Select language" aria-expanded={langOpen}
              style={{display:"flex",alignItems:"center",gap:"5px",
                background:"rgba(255,255,255,0.09)",
                border:"1px solid rgba(255,255,255,0.16)",borderRadius:"7px",
                padding:"5px 10px",fontSize:"12.5px",fontWeight:500,
                color:"rgba(255,255,255,0.88)",cursor:"pointer",fontFamily:"inherit",
                backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}>
              <Globe size={13} color="rgba(255,255,255,0.70)"/>
              English
              <ChevronDown size={11} color="rgba(255,255,255,0.55)"
                style={{transform:langOpen?"rotate(180deg)":"none",transition:"transform .2s"}}/>
            </button>
            {langOpen && (
              <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,
                background:"rgba(8,18,55,0.97)",
                border:"1px solid rgba(255,255,255,0.11)",borderRadius:"9px",
                overflow:"hidden",minWidth:"120px",
                boxShadow:"0 8px 24px rgba(0,0,0,0.45)",zIndex:100,
                animation:"tcfadein .13s ease"}}>
                {["English","हिन्दी","मराठी","தமிழ்"].map(l=>(
                  <button key={l} onClick={()=>setLangOpen(false)} style={{
                    display:"block",width:"100%",padding:"9px 13px",
                    background:l==="English"?"rgba(255,255,255,0.07)":"none",
                    border:"none",textAlign:"left",fontSize:"12.5px",
                    fontWeight:l==="English"?600:400,
                    color:l==="English"?"#93c5fd":"rgba(255,255,255,0.78)",
                    cursor:"pointer",fontFamily:"inherit"}}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ── Card area ── */}
        <div className="tc-body">
          <div className="tc-card">

            {/* IR logo + heading */}
            <div style={{textAlign:"center",marginBottom:"14px"}}>
              <div style={{width:"58px",height:"58px",borderRadius:"50%",
                border:"2px solid #1e3a8a",background:"#eef3ff",
                display:"flex",alignItems:"center",justifyContent:"center",
                margin:"0 auto 10px"}}
                aria-label="Indian Railways" role="img">
                <IRLogo/>
              </div>
              <h1 style={{fontSize:"clamp(1.1rem,2.2vw,1.3rem)",fontWeight:700,
                color:"#0b1f3a",margin:"0 0 3px",letterSpacing:"-0.02em"}}>
                Welcome Back, TC!
              </h1>
              <p style={{fontSize:"12.5px",color:"#64748b",margin:0}}>
                Login to your Ticket Checker account
              </p>
            </div>

            {/* General error */}
            {errors.general && (
              <div role="alert" style={{background:"rgba(254,226,226,0.9)",
                border:"1.5px solid rgba(239,68,68,0.3)",borderRadius:"9px",
                padding:"9px 11px",marginBottom:"11px",
                display:"flex",alignItems:"flex-start",gap:"7px"}}>
                <AlertTriangle size={14} color="#ef4444" style={{flexShrink:0,marginTop:"1px"}}/>
                <p style={{fontSize:"12px",color:"#dc2626",margin:0,fontWeight:500,lineHeight:1.4}}>
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>

              {/* TC ID */}
              <div className="f-fld">
                <label htmlFor="tc-id" className="f-lbl">TC ID / Employee ID</label>
                <div className="f-iw">
                  <span className="f-ico"><User size={14} strokeWidth={1.75}/></span>
                  <input id="tc-id" type="text" autoComplete="username"
                    placeholder="Enter your TC ID / Employee ID"
                    value={tcId}
                    onChange={e=>{setTcId(e.target.value); setErrors(p=>({...p,tcId:undefined}));}}
                    className="f-inp" onFocus={iF} onBlur={iB}
                    aria-describedby={errors.tcId ? "tcid-err" : "tcid-hint"}
                    aria-invalid={!!errors.tcId}
                    style={errors.tcId ? {borderColor:"#ef4444"} : {}}/>
                </div>
                {errors.tcId
                  ? <span id="tcid-err" className="f-err" role="alert">{errors.tcId}</span>
                  : <span id="tcid-hint" style={{fontSize:"11px",color:"#94a3b8",
                      display:"block",marginTop:"2px"}}>
                      Enter your 4–8 digit TC ID
                    </span>
                }
              </div>

              {/* Password */}
              <div className="f-fld">
                <label htmlFor="tc-pwd" className="f-lbl">Password</label>
                <div className="f-iw">
                  <span className="f-ico"><Lock size={14} strokeWidth={1.75}/></span>
                  <input id="tc-pwd"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e=>{setPassword(e.target.value); setErrors(p=>({...p,password:undefined}));}}
                    className="f-inp"
                    style={{paddingRight:"38px", ...(errors.password ? {borderColor:"#ef4444"} : {})}}
                    onFocus={iF} onBlur={iB}
                    aria-describedby={errors.password ? "pwd-err" : undefined}
                    aria-invalid={!!errors.password}/>
                  <button type="button" className="f-sfx"
                    onClick={()=>setShowPwd(v=>!v)}
                    aria-label={showPwd ? "Hide password" : "Show password"}>
                    {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",
                  alignItems:"center",marginTop:"3px"}}>
                  {errors.password
                    ? <span id="pwd-err" className="f-err" role="alert">{errors.password}</span>
                    : <span/>
                  }
                  <button type="button" className="tc-link" style={{background:"none",border:"none",
                    fontSize:"11.5px",fontWeight:500,color:"#2563eb",padding:0,
                    fontFamily:"inherit",whiteSpace:"nowrap",marginLeft:"auto"}}>
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* TC Type */}
              <div className="f-fld" ref={ddRef}>
                <label id="tt-lbl" className="f-lbl">TC Type</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:"11px",top:"50%",
                    transform:"translateY(-50%)",color:"#94a3b8",
                    display:"flex",pointerEvents:"none",zIndex:1}}>
                    <Shield size={14} strokeWidth={1.75}/>
                  </span>
                  <button type="button" className="f-dd"
                    onClick={()=>setDdOpen(v=>!v)}
                    aria-haspopup="listbox" aria-expanded={ddOpen}
                    aria-labelledby="tt-lbl"
                    aria-describedby={errors.tcType ? "tt-err" : undefined}
                    style={errors.tcType ? {borderColor:"#ef4444"} : {}}>
                    <span style={{flex:1, color:tcType ? "#0f172a" : "#94a3b8", fontSize:"13px"}}>
                      {ttLabel || "Select TC Type"}
                    </span>
                    {ddOpen
                      ? <ChevronUp size={14} color="#64748b"/>
                      : <ChevronDown size={14} color="#64748b"/>
                    }
                  </button>
                  {ddOpen && (
                    <div className="f-dd-menu" role="listbox" aria-labelledby="tt-lbl">
                      {([
                        { v:"express" as TCType, l:"Express TC",            s:"Inter-city / Rajdhani / Shatabdi" },
                        { v:"local"   as TCType, l:"Local / Unreserved TC", s:"Suburban / Local trains" },
                      ]).map(o=>(
                        <button key={o.v} type="button" role="option"
                          aria-selected={tcType === o.v}
                          className={`f-dd-item${tcType === o.v ? " f-dd-item--on" : ""}`}
                          onClick={()=>{ setTcType(o.v); setDdOpen(false); setErrors(p=>({...p,tcType:undefined})); }}>
                          <div style={{width:"26px",height:"26px",borderRadius:"6px",flexShrink:0,
                            background:tcType===o.v ? "rgba(37,99,235,0.1)" : "#f1f5f9",
                            display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <TrainSVG size={13} color={tcType===o.v ? "#2563eb" : "#64748b"}/>
                          </div>
                          <div>
                            <div style={{fontSize:"13px",fontWeight:600,lineHeight:1.2}}>{o.l}</div>
                            <div style={{fontSize:"11px",color:"#64748b",marginTop:"1px"}}>{o.s}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.tcType && <span id="tt-err" className="f-err" role="alert">{errors.tcType}</span>}
              </div>

              {/* Captcha */}
              <div className="f-fld">
                <label htmlFor="cap-inp" className="f-lbl">Captcha</label>
                <div style={{display:"flex",gap:"7px",marginBottom:"7px",height:"40px"}}>
                  <div style={{flex:1,border:"1.5px solid rgba(203,213,225,0.9)",
                    borderRadius:"10px",overflow:"hidden",
                    display:"flex",alignItems:"stretch"}}>
                    <CaptchaDisplay text={captchaText}/>
                  </div>
                  <button type="button" onClick={refreshCaptcha} aria-label="Refresh captcha"
                    style={{width:"40px",height:"40px",flexShrink:0,
                      border:"1.5px solid rgba(203,213,225,0.9)",borderRadius:"10px",
                      background:"#f7f9fc",cursor:"pointer",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      color:"#64748b",transition:"color .15s,border-color .15s"}}
                    onMouseEnter={e=>{
                      (e.currentTarget as HTMLButtonElement).style.color="#2563eb";
                      (e.currentTarget as HTMLButtonElement).style.borderColor="#3b82f6";
                    }}
                    onMouseLeave={e=>{
                      (e.currentTarget as HTMLButtonElement).style.color="#64748b";
                      (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(203,213,225,0.9)";
                    }}>
                    <RefreshCw size={14} strokeWidth={1.75}/>
                  </button>
                </div>
                <div className="f-iw">
                  <span className="f-ico"><Shield size={14} strokeWidth={1.75}/></span>
                  <input id="cap-inp" type="text" autoComplete="off"
                    placeholder="Enter captcha"
                    value={captchaInput}
                    onChange={e=>{setCaptchaInput(e.target.value); setErrors(p=>({...p,captcha:undefined}));}}
                    className="f-inp" onFocus={iF} onBlur={iB}
                    aria-describedby={errors.captcha ? "cap-err" : undefined}
                    aria-invalid={!!errors.captcha}
                    style={errors.captcha ? {borderColor:"#ef4444"} : {}}/>
                </div>
                {errors.captcha && <span id="cap-err" className="f-err" role="alert">{errors.captcha}</span>}
              </div>

              {/* Remember + Forgot TC ID */}
              <div style={{display:"flex",alignItems:"flex-start",
                justifyContent:"space-between",gap:"8px",marginBottom:"13px",flexWrap:"wrap"}}>
                <button type="button" role="checkbox" aria-checked={remember}
                  onClick={()=>setRemember(v=>!v)}
                  style={{display:"flex",alignItems:"flex-start",gap:"7px",
                    background:"none",border:"none",cursor:"pointer",
                    padding:0,fontFamily:"inherit"}}>
                  <span aria-hidden="true" style={{width:"16px",height:"16px",
                    borderRadius:"4px",marginTop:"1px",flexShrink:0,
                    border:`2px solid ${remember ? "#2563eb" : "#cbd5e1"}`,
                    background:remember ? "#2563eb" : "#fff",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    transition:"all .18s"}}>
                    {remember && (
                      <svg width="9" height="7" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <div>
                    <p style={{fontSize:"12px",fontWeight:600,color:"#1e3a6e",
                      margin:"0 0 1px",lineHeight:1.2}}>Remember this device</p>
                    <p style={{fontSize:"10.5px",color:"#94a3b8",margin:0}}>
                      Do not login on shared devices
                    </p>
                  </div>
                </button>
                <button type="button" className="tc-link" style={{background:"none",border:"none",
                  fontSize:"11.5px",fontWeight:500,color:"#2563eb",
                  padding:0,fontFamily:"inherit",whiteSpace:"nowrap"}}>
                  Forgot TC ID?
                </button>
              </div>

              {/* Login button */}
              <button type="submit" disabled={loading} aria-busy={loading}
                className="btn-p"
                style={{
                  background: loading ? "#94a3b8" : "linear-gradient(135deg,#1e40af,#2563eb)",
                  color: "#fff",
                  boxShadow: loading ? "none" : "0 5px 18px rgba(37,99,235,0.38)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}>
                {loading
                  ? <>
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none"
                        style={{animation:"tcspin .75s linear infinite"}} aria-hidden="true">
                        <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" strokeOpacity="0.3"/>
                        <path d="M9 2a7 7 0 0 1 7 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Signing in…
                    </>
                  : <><LogIn size={16} strokeWidth={2}/>Login</>
                }
              </button>

            </form>
          </div>{/* end .tc-card */}
        </div>{/* end .tc-body */}

        {/* Authorized device pill */}
        <div className="tc-pill" role="status" aria-label="Device authorization status">
          <div style={{width:"30px",height:"30px",borderRadius:"8px",flexShrink:0,
            background:"rgba(37,99,235,0.32)",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Shield size={14} color="#93c5fd" strokeWidth={1.75}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:"12px",fontWeight:700,color:"#fff",margin:"0 0 1px",whiteSpace:"nowrap"}}>
              Authorized Device
            </p>
            <p style={{fontSize:"10.5px",color:"rgba(255,255,255,0.52)",margin:0}}>
              Registered and secure
            </p>
          </div>
          <div style={{width:"20px",height:"20px",borderRadius:"50%",flexShrink:0,
            background:"rgba(34,197,94,0.18)",border:"1px solid rgba(34,197,94,0.38)",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <CheckCircle2 size={12} color="#4ade80" strokeWidth={2.5}/>
          </div>
        </div>

        {/* Footer */}
        <footer className="tc-footer">
          <div className="tc-footer-inner">
            <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
              <Shield size={13} color="rgba(255,255,255,0.42)" strokeWidth={1.75}/>
              <span style={{fontSize:"11.5px",fontWeight:600,color:"rgba(255,255,255,0.75)"}}>
                Security Notice
              </span>
              <span style={{fontSize:"11px",color:"rgba(255,255,255,0.40)"}}>
                — Unauthorized access is strictly prohibited.
              </span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
              <Headphones size={13} color="rgba(255,255,255,0.42)" strokeWidth={1.75}/>
              <span style={{fontSize:"11.5px",fontWeight:600,color:"rgba(255,255,255,0.75)"}}>
                Need Help?
              </span>
              <a href="tel:18001234444" className="tc-link"
                style={{fontSize:"11.5px",fontWeight:700,color:"#60a5fa",textDecoration:"none"}}>
                1800-123-4444
              </a>
            </div>
            <span style={{fontSize:"11px",color:"rgba(255,255,255,0.30)"}}>
              © 2024 YatraSetu
            </span>
          </div>
        </footer>

      </div>{/* end .tc-root */}

      {unauthOpen && <UnauthorizedModal onClose={()=>setUnauthOpen(false)}/>}
    </>
  );
}
