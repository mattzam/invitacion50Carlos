import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const E = {
  name:"CARLOS ZAMUDIO PATIÑO", short:"Carlos", age:50,
  fecha:"Sábado 13 de Junio, 2026",
  misa:{ hora:"11:00 AM", lugar:"Parroquia del Sagrado Corazón de Jesús", dir:"Cto. Cuauhtémoc 217, Izcalli Cuauhtémoc 1\nSan Salvador Tizatlalli, Méx.", maps:"https://maps.google.com/?q=Parroquia+Sagrado+Corazon+Jesus+Cuauhtemoc+217+San+Salvador+Tizatlalli" },
  fiesta:{ hora:"2:30 PM", lugar:"Salón La Troje", dir:"San Jerónimo Chicahualco\nMetepec, Edo. Méx.", maps:"https://maps.google.com/?q=Salon+La+Troje+San+Jeronimo+Chicahualco+Metepec", target:new Date("2026-06-13T14:30:00") },
  dressCode:"Vaquero · Western · Charro",
  rsvp:{ phone:"527223765872", msg:"¡Yee-haw! Confirmo asistencia a los 50 de Carlos Zamudio Patiño 🤠🥃" },
mensaje:"Llegar a los 50 es un gran logro,\npero nuestra mayor fortuna es tenerte en esta familia.\nHan sido cinco décadas de esfuerzo y aprendizaje,\nde saber estar en las buenas y en las malas,\ny de darlo todo por nosotros.\nEsta noche es para ti.",};

// ─── TOKENS & GLOBALS (GOLD IS PRESERVED) ──────────────────────────────────────
const T = {
  gold:"#B8912A", goldLt:"#F4C856", goldDm:"#8B6A1A",
  rust:"#8B3A1A", rustLt:"#B05530",
};

// Pre-calculate random values for pure components
const ENV_STARS = Array.from({length:20}).map(()=>({ w:Math.random()*2+.5, l:Math.random()*100, t:Math.random()*55, dur:1.8+Math.random()*2, del:Math.random()*3 }));
const BG_STARS = Array.from({length:60}).map(()=>({ x:Math.random()*100, y:Math.random()*100, sz:Math.random()*6+2, dur:1.5+Math.random()*3, del:Math.random()*2 }));
const CARD_RND = Array.from({length:20}).map(()=>({ dur: 2.2 + Math.random()*1, rotDur: 2.8 + Math.random()*1 }));

// ─── GLOBAL STYLES (ENHANCED LIQUID GLASS + SYSTEM THEME) ──────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Rye&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Montserrat:wght@300;400;500;600&family=Special+Elite&display=swap');

:root {
  /* PERMANENT DARK MODE VARIABLES */
  --sys-bg-base: #080604;
  --sys-bg-mesh-1: #2E1F10;
  --sys-bg-mesh-2: #1A1008;
  --sys-bg-mesh-3: #0A0502;

  --sys-text-main: #F5F0E8;
  --sys-text-mut: #C4A882;
  --sys-text-inv: #1A1008;
  --sys-svg-op: 0.25;

  --glass-bg: rgba(30, 20, 12, 0.35);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-border-b: rgba(255, 255, 255, 0.02);
  --glass-shadow: rgba(0, 0, 0, 0.8);
  --glass-highlight: rgba(255, 255, 255, 0.1);
  --glass-glare: rgba(255, 255, 255, 0.06);
  
  --glass-panel-bg: rgba(20, 12, 6, 0.3);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-tap-highlight-color:transparent;font-size:18px}
@media(max-width:480px){html{font-size:16px}}
body{background:var(--sys-bg-base);color:var(--sys-text-main);overflow-x:hidden;-webkit-font-smoothing:antialiased;}
::selection{background:${T.gold}44;color:var(--sys-text-main)}

/* Typography */
.rye{font-family:'Rye',serif}
.play{font-family:'Playfair Display',serif}
.mont{font-family:'Montserrat',sans-serif}
.elite{font-family:'Special Elite',cursive}

/* MESH BACKGROUND - For Glass Depth */
.mesh-bg {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-color: var(--sys-bg-base);
  background-image: 
    radial-gradient(circle at 10% 20%, var(--sys-bg-mesh-1) 0%, transparent 50%),
    radial-gradient(circle at 90% 10%, var(--sys-bg-mesh-2) 0%, transparent 60%),
    radial-gradient(circle at 40% 90%, var(--sys-bg-mesh-3) 0%, transparent 70%);
  filter: blur(40px);
}

/* ENHANCED LIQUID GLASS CLASSES */
.glass, .glass-panel {
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(36px) saturate(220%);
  -webkit-backdrop-filter: blur(36px) saturate(220%);
}

/* Glass Reflection Overlay (The Apple Gloss) */
.glass::before, .glass-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, var(--glass-glare) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%);
  pointer-events: none;
  z-index: 1;
}

.glass {
  background: var(--glass-bg);
  border-top: 1.5px solid var(--glass-border);
  border-left: 1px solid var(--glass-border);
  border-right: 1px solid var(--glass-border-b);
  border-bottom: 1px solid var(--glass-border-b);
  box-shadow: 0 24px 60px var(--glass-shadow), 
              inset 0 1px 2px var(--glass-highlight),
              inset 0 -1px 2px rgba(0,0,0,0.1);
}

.glass-panel {
  background: var(--glass-panel-bg);
  border: 1px solid var(--glass-border-b);
  border-top: 1px solid var(--glass-border);
  box-shadow: 0 12px 40px var(--glass-shadow),
              inset 0 1px 1px var(--glass-highlight);
}

/* Gold text gradient */
.gold-txt{
  background:linear-gradient(165deg,${T.goldLt} 0%,${T.gold} 45%,${T.goldDm} 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}

/* Dynamic Text gradient */
.dynamic-txt{
  background:linear-gradient(165deg,var(--sys-text-mut) 0%,var(--sys-text-main) 70%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}

.sepia{filter:sepia(15%) contrast(1.1) brightness(.95)}

a,button{min-height:48px;display:inline-flex;align-items:center;justify-content:center}
@media(max-width:480px){a,button{min-height:44px}}

@keyframes shimmer{0%,100%{opacity:.65}50%{opacity:1}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes ropeWave{0%,100%{d:path('M0,12 Q25,4 50,12 Q75,20 100,12')}50%{d:path('M0,12 Q25,20 50,12 Q75,4 100,12')}}
`;


// ─── HOOKS ─────────────────────────────────────────────────────────────────────
function useCountdown(target) {
  const [s,set]=useState({d:0,h:0,m:0,s:0});
  useEffect(()=>{
    const c=()=>{
      const diff=target-Date.now();
      if(diff<=0)return set({d:0,h:0,m:0,s:0});
      set({d:Math.floor(diff/864e5),h:Math.floor(diff%864e5/36e5),m:Math.floor(diff%36e5/6e4),s:Math.floor(diff%6e4/1e3)});
    };
    c();const id=setInterval(c,1000);return()=>clearInterval(id);
  },[target]);
  return s;
}

// ─── SVG LIBRARY (DYNAMIC THEME ADAPTED) ───────────────────────────────────────
const SheriffStar = ({sz=56,glow=false,animate=false})=>{
  const pts=Array.from({length:12},(_,i)=>{
    const r=i%2===0?sz*.46:sz*.22, a=(i*Math.PI/6)-Math.PI/2, cx=sz/2, cy=sz/2;
    return `${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return(
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{filter:glow?`drop-shadow(0 0 15px ${T.gold}90)`:'none',flexShrink:0,animation:animate?'spin 18s linear infinite':'none'}}>
      <defs>
        <radialGradient id={`sg${sz}`} cx="38%" cy="28%" r="70%">
          <stop offset="0%" stopColor={T.goldLt}/>
          <stop offset="55%" stopColor={T.gold}/>
          <stop offset="100%" stopColor={T.goldDm}/>
        </radialGradient>
      </defs>
      <polygon points={pts} fill={`url(#sg${sz})`} stroke={T.goldDm} strokeWidth=".8"/>
      <circle cx={sz/2} cy={sz/2} r={sz*.16} fill={`url(#sg${sz})`} stroke={T.goldDm} strokeWidth=".8"/>
    </svg>
  );
};

const Horseshoe = ({sz=44,col=T.gold,flip=false,style={}})=>(
  <svg width={sz} height={sz} viewBox="0 0 100 110" style={{transform:flip?'scaleX(-1)':'none',flexShrink:0,...style}}>
    <path d="M18 82 C18 28, 82 28, 82 82" fill="none" stroke={col} strokeWidth="14" strokeLinecap="round"/>
    <line x1="18" y1="82" x2="14" y2="102" stroke={col} strokeWidth="12" strokeLinecap="round"/>
    <line x1="82" y1="82" x2="86" y2="102" stroke={col} strokeWidth="12" strokeLinecap="round"/>
    {[30,50,70].map(x=><circle key={x} cx={x} cy={x===50?34:38} r="4.5" fill="var(--sys-bg-base)" stroke={col} strokeWidth="1.5"/>)}
    <circle cx="24" cy="66" r="4.5" fill="var(--sys-bg-base)" stroke={col} strokeWidth="1.5"/>
    <circle cx="76" cy="66" r="4.5" fill="var(--sys-bg-base)" stroke={col} strokeWidth="1.5"/>
  </svg>
);

const CowboyHat = ({sz=70,band=T.gold,op=1})=>(
  <svg width={sz} height={sz*.7} viewBox="0 0 120 84" style={{opacity:op}}>
    <ellipse cx="60" cy="72" rx="56" ry="10" fill="var(--sys-text-main)" opacity=".8"/>
    <path d="M25 70 C25 45, 35 18, 60 18 C85 18, 95 45, 95 70" fill="var(--sys-text-main)"/>
    <path d="M38 18 C38 18, 45 14, 60 14 C75 14, 82 18, 82 18 L78 30 C78 30, 72 26, 60 26 C48 26, 42 30, 42 30 Z" fill="var(--sys-bg-base)" opacity=".3"/>
    <path d="M35 62 C35 62, 48 58, 60 58 C72 58, 85 62, 85 62 L87 70 C87 70, 72 66, 60 66 C48 66, 33 70, 33 70 Z" fill={band} opacity=".9"/>
  </svg>
);

const BullSkull = ({sz=80,op=1})=>(
  <svg width={sz} height={sz*.88} viewBox="0 0 120 106" style={{opacity:op}}>
    <path d="M18 38 C6 24, 2 6, 16 8 C27 10, 30 26, 34 40" fill="var(--sys-text-main)" stroke="var(--sys-bg-base)" strokeWidth="1.2"/>
    <path d="M102 38 C114 24, 118 6, 104 8 C93 10, 90 26, 86 40" fill="var(--sys-text-main)" stroke="var(--sys-bg-base)" strokeWidth="1.2"/>
    <ellipse cx="60" cy="52" rx="37" ry="40" fill="var(--sys-text-main)" opacity=".8"/>
    <ellipse cx="43" cy="45" rx="6.5" ry="7.5" fill="var(--sys-bg-base)"/>
    <ellipse cx="77" cy="45" rx="6.5" ry="7.5" fill="var(--sys-bg-base)"/>
    <ellipse cx="60" cy="70" rx="14" ry="10" fill="var(--sys-bg-base)" opacity=".4"/>
  </svg>
);

const Cactus = ({sz=80,op=1})=>(
  <svg width={sz} height={sz*1.35} viewBox="0 0 72 98" style={{opacity:op}}>
    <rect x="29" y="16" width="14" height="72" rx="7" fill="var(--sys-text-main)"/>
    <rect x="10" y="42" width="19" height="9" rx="4.5" fill="var(--sys-text-main)"/>
    <rect x="9" y="32" width="9" height="22" rx="4.5" fill="var(--sys-text-main)"/>
    <rect x="43" y="52" width="19" height="9" rx="4.5" fill="var(--sys-text-main)"/>
    <rect x="54" y="42" width="9" height="22" rx="4.5" fill="var(--sys-text-main)"/>
  </svg>
);

const RopeOrnament = ({w=280})=>(
  <svg width={w} height={24} viewBox={`0 0 ${w} 24`} style={{opacity:.4}}>
    <defs>
      <pattern id="rope" x="0" y="0" width="16" height="24" patternUnits="userSpaceOnUse">
        <path d="M8 0 C4 4, 0 8, 4 12 C8 16, 12 20, 8 24" stroke="var(--sys-text-main)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M8 0 C12 4, 16 8, 12 12 C8 16, 4 20, 8 24" stroke="var(--sys-text-main)" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".6"/>
      </pattern>
    </defs>
    <rect width={w} height="24" fill="url(#rope)"/>
  </svg>
);

const Spur = ({sz=36,col=T.gold,style={}})=>{
  const spokes=8;
  return(
    <svg width={sz} height={sz} viewBox="0 0 60 60" style={{flexShrink:0,...style}}>
      <circle cx="30" cy="30" r="10" fill="none" stroke={col} strokeWidth="2"/>
      <circle cx="30" cy="30" r="4" fill={col}/>
      {Array.from({length:spokes},(_,i)=>{
        const a=(i/spokes)*Math.PI*2, r1=12, r2=28;
        return<line key={i} x1={30+r1*Math.cos(a)} y1={30+r1*Math.sin(a)} x2={30+r2*Math.cos(a)} y2={30+r2*Math.sin(a)} stroke={col} strokeWidth="1.8" strokeLinecap="round"/>;
      })}
      {Array.from({length:spokes},(_,i)=>{
        const a=((i+.5)/spokes)*Math.PI*2, r=30;
        return<polygon key={i} points={`${30+r*Math.cos(a)},${30+r*Math.sin(a)} ${30+(r-6)*Math.cos(a-.15)},${30+(r-6)*Math.sin(a-.15)} ${30+(r-6)*Math.cos(a+.15)},${30+(r-6)*Math.sin(a+.15)}`} fill={col}/>;
      })}
    </svg>
  );
};

// ─── DRESS CODE ICONS ──────────────────────────────────────────────────────────
const LineIconBoot = ({sz=24, col="currentColor"}) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d="M7 3v7c0 2-2 4-2 6v4h11v-4c0-2 2-2 2-3l-2-10H7z" />
    <path d="M12 20v4" />
    <path d="M5 16h11" />
  </svg>
);

const LineIconJeans = ({sz=24, col="currentColor"}) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d="M6 3h12l1 3-3 15h-4l-1-10-1 10H6l-3-15 3-3z"/>
    <path d="M12 3v5" />
    <path d="M8 7h8" />
  </svg>
);

const LineIconShirt = ({sz=24, col="currentColor"}) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d="M5 7l3-4h8l3 4 3 2-2 3v9H4v-9l-2-3 3-2z"/>
    <path d="M12 3v18"/>
    <path d="M8 8h2"/> <path d="M14 8h2"/>
  </svg>
);

const LineIconBelt = ({sz=24, col="currentColor"}) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <rect x="2" y="9" width="20" height="6" rx="2" />
    <rect x="9" y="7" width="6" height="10" rx="1" />
    <circle cx="12" cy="12" r="1" fill={col}/>
  </svg>
);

const LineIconHat = ({sz=24, col="currentColor"}) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d="M3 16c0-2 5-3 9-3s9 1 9 3" />
    <path d="M6 13c0-4 3-8 6-8s6 4 6 8" />
  </svg>
);

// ─── EVENT ICONS ───────────────────────────────────────────────────────────────
const ChurchIcon = ({sz=40})=>(
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{flexShrink:0}}>
    <path d="M32 4L28 14H36L32 4Z" fill="var(--sys-text-main)" stroke="var(--sys-text-main)" strokeWidth="1.5"/>
    <rect x="26" y="14" width="12" height="6" fill="var(--sys-text-main)" stroke="var(--sys-text-main)" strokeWidth="1.5"/>
    <rect x="20" y="20" width="24" height="28" fill="none" stroke="var(--sys-text-main)" strokeWidth="2"/>
    <rect x="26" y="26" width="8" height="8" fill="none" stroke="var(--sys-text-main)" strokeWidth="1.5" opacity=".6"/>
    <path d="M16 48L18 60H46L48 48Z" fill="var(--sys-text-main)" opacity=".3" stroke="var(--sys-text-main)" strokeWidth="1.5"/>
    <line x1="32" y1="20" x2="32" y2="48" stroke="var(--sys-text-main)" strokeWidth="1.5" opacity=".5"/>
  </svg>
);

const PartyIcon = ({sz=40})=>(
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{flexShrink:0}}>
    <circle cx="32" cy="32" r="26" fill="none" stroke="var(--sys-text-main)" strokeWidth="2"/>
    <path d="M32 8L28 14L32 20L36 14Z" fill="var(--sys-text-main)"/>
    <path d="M48 24L52 22L50 28Z" fill="var(--sys-text-main)"/>
    <path d="M50 44L54 48L48 50Z" fill="var(--sys-text-main)"/>
    <path d="M16 40L12 38L14 44Z" fill="var(--sys-text-main)"/>
    <path d="M32 48C26.5 48 22 43.5 22 38C22 32.5 26.5 28 32 28C37.5 28 42 32.5 42 38C42 43.5 37.5 48 32 48Z" fill="none" stroke="var(--sys-text-main)" strokeWidth="1.5" opacity=".6"/>
  </svg>
);

const TimeIcon = ({sz=40})=>(
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{flexShrink:0}}>
    <circle cx="32" cy="32" r="24" fill="none" stroke="var(--sys-text-main)" strokeWidth="2"/>
    <line x1="32" y1="12" x2="32" y2="20" stroke="var(--sys-text-main)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="32" y1="32" x2="32" y2="44" stroke="var(--sys-text-main)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="32" y1="32" x2="42" y2="32" stroke="var(--sys-text-main)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CrossIcon = ({sz=40})=>(
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{flexShrink:0}}>
    <path d="M32 8L32 56M12 32L52 32" stroke="var(--sys-text-main)" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);


// ─── DIVIDERS ──────────────────────────────────────────────────────────────────
const Div = ()=>(
  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,margin:'18px auto',maxWidth:320}}>
    <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,var(--sys-text-mut))`,opacity:.5}}/>
    <span style={{color:'var(--sys-text-main)',fontSize:10,opacity:.6}}>—</span>
    <span style={{color:'var(--sys-text-main)',fontSize:18}}>✦</span>
    <span style={{color:'var(--sys-text-main)',fontSize:10,opacity:.6}}>—</span>
    <div style={{flex:1,height:1,background:`linear-gradient(270deg,transparent,var(--sys-text-mut))`,opacity:.5}}/>
  </div>
);

const SpurDiv = ({col=T.gold})=>(
  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,margin:'20px auto',maxWidth:340}}>
    <div style={{flex:1,height:2,background:`linear-gradient(90deg,transparent,${col}80,${col})`}}/>
    <Spur sz={32} col={col}/>
    <div style={{flex:1,height:2,background:`linear-gradient(270deg,transparent,${col}80,${col})`}}/>
  </div>
);

const Stars = ({n=5,size=10,centerSize=16})=>(
  <div style={{display:'flex',justifyContent:'center',gap:6,margin:'8px 0',position:'relative',zIndex:2}}>
    {Array.from({length:n}).map((_,i)=>(
      <span key={i} style={{color:i===Math.floor(n/2)?T.gold:'var(--sys-text-mut)',fontSize:i===Math.floor(n/2)?centerSize:size,animation:`shimmer ${1.6+i*.18}s ease-in-out infinite`,animationDelay:`${i*.12}s`,lineHeight:1}}>★</span>
    ))}
  </div>
);

// ─── AMBIENT DECORATIONS (PARALLAX SCROLL) ─────────────────────────────────────
function AmbientDecorations({ scrollYProgress }) {
  // Mapping scroll progress to vertical parallax movement
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -450]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  
  const r1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const r2 = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0}}>
      {/* Global Background Stars (Scrolling) */}
      {BG_STARS.map((s,i)=>(
        <motion.div key={`s${i}`} style={{
          position:'absolute', left:`${s.x}%`, top:`${s.y}%`, y: i%2===0?y2:y3, 
          width:s.sz, height:s.sz, borderRadius:'50%', background:T.gold, 
          animation:`shimmer ${s.dur}s ease-in-out infinite`, animationDelay:`${s.del}s`, 
          opacity:.18, filter:`blur(${s.sz>5?2:0}px)`
        }}/>
      ))}

      {/* Hero Level */}
      <motion.div style={{position:'absolute', top:'5%', left:'-10%', y: y1}}><Cactus sz={240} op="var(--sys-svg-op)"/></motion.div>
      <motion.div style={{position:'absolute', top:'12%', right:'-12%', y: y2, rotate: r1}}><BullSkull sz={340} op="var(--sys-svg-op)"/></motion.div>
      
      {/* Mensaje Level */}
      <motion.div style={{position:'absolute', top:'35%', left:'8%', y: y3}}><Horseshoe sz={180} col="var(--sys-text-mut)" style={{opacity:'var(--sys-svg-op)'}}/></motion.div>
      <motion.div style={{position:'absolute', top:'42%', right:'8%', y: y4, rotate: r2}}><Spur sz={160} col="var(--sys-text-mut)" style={{opacity:'var(--sys-svg-op)'}}/></motion.div>

      {/* Eventos / Countdown Level */}
      <motion.div style={{position:'absolute', top:'60%', left:'-8%', y: y5}}><Cactus sz={200} op="var(--sys-svg-op)"/></motion.div>
      <motion.div style={{position:'absolute', top:'70%', right:'-8%', y: y1}}><CowboyHat sz={220} op="var(--sys-svg-op)"/></motion.div>

      {/* RSVP Level (Replaced Skull with another Cactus to avoid overlap with bottom Skull) */}
      <motion.div style={{position:'absolute', top:'85%', left:'10%', y: y2}}><Cactus sz={220} op="var(--sys-svg-op)"/></motion.div>
      <motion.div style={{position:'absolute', top:'92%', right:'10%', y: y3, rotate: r1}}><Spur sz={140} col="var(--sys-text-mut)" style={{opacity:'var(--sys-svg-op)'}}/></motion.div>
    </div>
  );
}

// ─── ENVELOPE SCREEN (IMPROVED CARD) ───────────────────────────────────────────
function EnvelopeScreen({onOpen}) {
  const [opening,setOpening]=useState(false);
  const tap=()=>{
    if(opening)return;
    setOpening(true);
    setTimeout(onOpen,1600);
  };

  return(
    <motion.div
      style={{position:'fixed',inset:0,zIndex:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',padding:'20px 16px'}}
      exit={{opacity:0,scale:1.04,transition:{duration:1.1,ease:[.76,0,.24,1]}}}
    >
      <div style={{position:'absolute',bottom:-6,left:-6,zIndex:-1}}><Cactus sz={100} op="var(--sys-svg-op)"/></div>
      <div style={{position:'absolute',bottom:-6,right:-6,transform:'scaleX(-1)',zIndex:-1}}><Cactus sz={85} op="var(--sys-svg-op)"/></div>
      
      {ENV_STARS.map((s,i)=>(
        <div key={i} style={{position:'absolute',width:s.w,height:s.w,borderRadius:'50%',background:'var(--sys-text-main)',left:`${s.l}%`,top:`${s.t}%`,animation:`shimmer ${s.dur}s ease-in-out infinite`,animationDelay:`${s.del}s`,pointerEvents:'none',opacity:.4,zIndex:-1}}/>
      ))}

      <motion.div
        initial={{opacity:0,y:28,scale:.9}}
        animate={{opacity:1,y:0,scale:1}}
        transition={{duration:1.1,ease:[.16,1,.3,1]}}
        style={{position:'relative',zIndex:10,width:'100%',maxWidth:340}}
      >
        <div
          className="glass"
          onClick={tap}
          style={{
            borderRadius:20,overflow:'hidden',cursor:'pointer',
            position:'relative',
            padding:'130px 20px 30px',
            perspective: '1000px'
          }}
        >
          {/* Glass Flap */}
          <motion.div
            className="glass"
            style={{position:'absolute',top:0,left:0,right:0,height:120,zIndex:6,transformOrigin:'top center',clipPath:'polygon(0 0,100% 0,50% 100%)',borderTop:'none',boxShadow:'none'}}
            animate={opening?{rotateX:-170,opacity:0}:{rotateX:0,opacity:1}}
            transition={{duration:.75,ease:[.76,0,.24,1]}}
          >
            <div style={{position:'absolute',top:16,left:'50%',transform:'translateX(-50%)',opacity:.4}}><CowboyHat sz={60} op={1}/></div>
          </motion.div>
          
          {/* The Internal Letter Card */}
          <motion.div
            animate={opening?{y:-40,opacity:0}:{y:0,opacity:1}}
            transition={{delay:opening?0.4:0, duration:0.6}}
            style={{
              background: 'linear-gradient(135deg, var(--sys-bg-mesh-2) 0%, var(--sys-bg-base) 100%)',
              borderRadius: 16,
              padding: '28px 16px',
              position: 'relative',
              zIndex: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              border: '1px solid var(--glass-border-b)'
            }}
          >
            <p className="elite" style={{textAlign:'center',color:'var(--sys-text-mut)',fontSize:12,letterSpacing:'.45em',textTransform:'uppercase',marginBottom:5}}>INVITACIÓN</p>

            <div className="rye dynamic-txt" style={{textAlign:'center',fontSize:48,lineHeight:.95}}>WANTED</div>
            <p className="elite" style={{textAlign:'center',color:'var(--sys-text-mut)',fontSize:13,letterSpacing:'.18em',marginBottom:14}}>en la GRAN celebración</p>

            <div style={{display:'flex',justifyContent:'center',gap:14,alignItems:'center',margin:'10px 0'}}>
              <Horseshoe sz={28} col="var(--sys-text-main)"/>
              <div className="rye gold-txt" style={{fontSize:42,lineHeight:1}}>50</div>
              <Horseshoe sz={28} col="var(--sys-text-main)" flip/>
            </div>

            <SpurDiv col={T.gold}/>

            <div className="rye" style={{textAlign:'center',fontSize:24,color:'var(--sys-text-main)',lineHeight:1.15}}>CARLOS ZAMUDIO PATIÑO</div>
            <div className="play" style={{textAlign:'center',fontSize:15,color:'var(--sys-text-mut)',fontStyle:'italic',letterSpacing:'.1em',marginBottom:4}}>celebra sus 50 años</div>
          </motion.div>

          {/* Open Button */}
          <motion.div
            animate={!opening?{scale:[1,1.025,1]}:{scale:1}}
            transition={{duration:2.5,repeat:Infinity}}
            onClick={tap}
            style={{marginTop:20,padding:'15px 0',textAlign:'center',borderRadius:12,cursor:'pointer',background:'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',border:'1px solid var(--glass-border-b)',boxShadow:'0 4px 16px var(--glass-shadow)', position:'relative', zIndex: 6}}
          >
            <span className="rye" style={{color:'var(--sys-text-main)',fontSize:16,letterSpacing:'.14em'}}>{opening?'Abriendo...':'✉️  ABRIR'}</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── CINEMATIC REVEAL ──────────────────────────────────────────────────────────
function CinematicReveal({onDone}) {
  useEffect(()=>{const t=setTimeout(onDone,3600);return()=>clearTimeout(t);},[onDone]);
  return(
    <motion.div
      style={{position:'fixed',inset:0,zIndex:90,background:'#050302',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',overflow:'hidden'}}
      exit={{opacity:0,transition:{duration:1.3,delay:.2}}}
    >
      <motion.div style={{position:'absolute',left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${T.gold}55,transparent)`,zIndex:8}}
        animate={{top:['0%','100%']}} transition={{duration:2,repeat:Infinity,ease:'linear',repeatDelay:0}}/>

      <motion.div style={{textAlign:'center',zIndex:10,padding:'0 28px'}}
        initial={{opacity:0}} animate={{opacity:[0,1,1,0]}} transition={{duration:3.4,times:[0,.12,.78,1]}}
      >
        <motion.p className="elite" style={{color:T.gold,fontSize:13,letterSpacing:'.65em',textTransform:'uppercase',marginBottom:22}}
          initial={{letterSpacing:'1.4em',opacity:0}} animate={{letterSpacing:'.65em',opacity:1}} transition={{delay:.2,duration:1.1}}
        >UNA NOCHE LEGENDARIA</motion.p>
        <motion.div className="rye gold-txt" style={{fontSize:'min(115px,28vw)',lineHeight:.92,filter:`drop-shadow(0 0 36px ${T.gold}55)`}}
          initial={{scale:.42,opacity:0,rotate:-4}} animate={{scale:1,opacity:1,rotate:0}}
          transition={{delay:.3,duration:.85,type:'spring',damping:10}}
        >50</motion.div>
        <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.75,duration:.75}}>
          <div className="rye" style={{color:'#D4C49A',fontSize:14,letterSpacing:'.22em',marginTop:8}}>AÑOS DE LEYENDA</div>
          <div className="play" style={{color:'#C4A882',fontSize:22,fontStyle:'italic',marginTop:10}}>Carlos Zamudio Patiño</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── SECTION WRAPPER (WITH REVEAL ANIMATION) ───────────────────────────────────
function Section({children, py=72, style={}}) {
  return(
    <section style={{padding:`clamp(${Math.floor(py*.35)}px,${py/2}px,${py}px) 16px`,position:'relative',...style}}>
      <motion.div
        initial={{opacity: 0, y: 30}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true, margin: '-40px'}}
        transition={{duration: 0.8, ease: "easeOut"}}
        style={{maxWidth:480,margin:'0 auto',position:'relative',zIndex:2}}
      >
        {children}
      </motion.div>
    </section>
  );
}

function SectionTitle({pre,title}) {
  return(
    <div style={{textAlign:'center',marginBottom:32}}>
      <Stars n={5} centerSize={18}/>
      <p className="rye" style={{color:'var(--sys-text-mut)',fontSize:16,letterSpacing:'.38em',marginBottom:6,marginTop:4}}>{pre}</p>
      <h2 className="rye" style={{fontSize:'clamp(28px,7vw,36px)',color:'var(--sys-text-main)',lineHeight:1.1,textShadow:'0 2px 12px var(--glass-shadow)'}}>{title}</h2>
      <SpurDiv col={T.gold}/>
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const ref=useRef(null);

  return(
    <section ref={ref} style={{minHeight:'100svh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',padding:'clamp(48px,12vw,96px) 16px clamp(60px,15vh,120px)'}}>
      
      <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{duration:1}} className="glass-panel" style={{textAlign:'center',position:'relative',zIndex:5,width:'100%',maxWidth:420,padding:'clamp(30px, 8vw, 50px) clamp(16px, 5vw, 30px)',borderRadius:28}}>
        <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:.2,duration:.9}} style={{position:'relative',zIndex:2}}>
          <Stars n={7} centerSize={20} size={11}/>
          <p className="rye" style={{color:'var(--sys-text-mut)',fontSize:14,letterSpacing:'.32em',marginBottom:10,marginTop:2}}>CELEBRACIÓN</p>
        </motion.div>

        <motion.div initial={{opacity:0,scale:.7,rotate:-3}} animate={{opacity:1,scale:1,rotate:0}} transition={{delay:.32,duration:1,type:'spring',damping:9}} style={{position:'relative',zIndex:2}}>
          <div className="rye gold-txt" style={{fontSize:'clamp(80px,28vw,152px)',lineHeight:.88,filter:`drop-shadow(0 5px 24px ${T.gold}45)`}}>50</div>
        </motion.div>

        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.65,duration:.9}} style={{position:'relative',zIndex:2}}>
          <p className="elite" style={{color:'var(--sys-text-mut)',fontSize:13,letterSpacing:'.28em',marginBottom:10}}>AÑOS DE HISTORIA Y LEYENDA</p>
          <SpurDiv col={T.gold}/>
          <div className="rye dynamic-txt" style={{fontSize:'clamp(30px,9vw,40px)',lineHeight:1.1,marginTop:8}}>CARLOS</div>
          <div className="play" style={{fontSize:'clamp(22px,7vw,28px)',color:'var(--sys-text-mut)',fontStyle:'italic',letterSpacing:'.12em',marginBottom:4}}>Zamudio Patiño</div>
          <p className="elite" style={{color:'var(--sys-text-mut)',fontSize:12,letterSpacing:'.22em',marginTop:4}}>Metepec · Edo. Méx.</p>

          <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:24,alignItems:'center'}}>
            <motion.div animate={{y:[0,-5,0]}} transition={{duration:3.2,repeat:Infinity,delay:.4}}><Horseshoe sz={42} col={T.gold}/></motion.div>
            <SheriffStar sz={64} glow/>
            <motion.div animate={{y:[0,-5,0]}} transition={{duration:3.2,repeat:Infinity,delay:1.6}}><Horseshoe sz={42} col={T.gold} flip/></motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* GIANT SCROLL INDICATOR */}
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:2.6, duration:0.8}} 
        style={{position:'absolute', bottom:'clamp(15px, 4vh, 30px)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, zIndex:10}}>
        
        <p className="rye gold-txt" style={{fontSize:20, letterSpacing:'.4em', textShadow:`0 2px 12px ${T.gold}60`, margin:0}}>DESLIZA</p>
        
        <motion.div animate={{y:[0, 12, 0]}} transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
          style={{
            background: `linear-gradient(135deg, ${T.goldLt}, ${T.goldDm})`, 
            color:'#fff', width:48, height:48, borderRadius:'50%', 
            display:'flex', alignItems:'center', justifyContent:'center', 
            boxShadow:`0 8px 24px ${T.gold}80, inset 0 2px 4px rgba(255,255,255,0.5)`,
            border:`2px solid rgba(255,255,255,0.4)`
          }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16M5 13l7 7 7-7"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── MENSAJE ───────────────────────────────────────────────────────────────────
function Mensaje() {
  return(
    <Section py={80}>
      <div className="glass-panel" style={{textAlign:'center',position:'relative',zIndex:2,padding:'clamp(30px, 8vw, 50px) clamp(16px, 5vw, 24px)',borderRadius:24}}>
        <div style={{display:'flex',justifyContent:'center',gap:10,marginBottom:4,alignItems:'flex-end',opacity:.7,position:'relative',zIndex:2}}>
          <CowboyHat sz={36}/>
          <Spur sz={28} col="var(--sys-text-mut)"/>
          <CowboyHat sz={36}/>
        </div>

        <div className="rye" style={{color:T.gold,fontSize:60,lineHeight:.85,marginBottom:4,position:'relative',zIndex:2}}>"</div>
        {E.mensaje.split('\n').map((l,i)=>(
          <motion.p key={i} initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-30px'}} transition={{delay:i*.07}}
            className="play" style={{fontSize:'clamp(18px,5vw,22px)',fontStyle:'italic',color:'var(--sys-text-main)',lineHeight:1.85,marginBottom:2,position:'relative',zIndex:2}}
          >{l}</motion.p>
        ))}
        <div className="rye" style={{color:T.gold,fontSize:60,lineHeight:.85,marginTop:4,position:'relative',zIndex:2}}>"</div>
        <p className="elite" style={{color:'var(--sys-text-mut)',fontSize:14,letterSpacing:'.28em',marginTop:16,position:'relative',zIndex:2}}>— CON AMOR, SU FAMILIA</p>
      </div>
    </Section>
  );
}

// ─── EVENT CARD ────────────────────────────────────────────────────────────────
function EventCard({title,sub,emoji,items,btnLabel,btnUrl,idx=0}) {
  const spec = CARD_RND[idx] || CARD_RND[0];
  return(
    <div style={{borderRadius:20,overflow:'hidden',marginBottom:32,position:'relative'}} className="glass">
      <div style={{padding:'clamp(26px, 6vw, 32px) clamp(16px, 5vw, 24px) 18px',textAlign:'center',borderBottom:'1px solid var(--glass-border-b)',position:'relative',zIndex:2}}>
        <motion.div style={{marginBottom:8,display:'flex',justifyContent:'center',lineHeight:1}} animate={{y:[0,-6,0]}} transition={{duration:4.5,repeat:Infinity,ease:'easeInOut'}}>
          {typeof emoji==='string'?<div style={{fontSize:52}}>{emoji}</div>:emoji}
        </motion.div>
        <p className="rye" style={{color:'var(--sys-text-mut)',fontSize:12,letterSpacing:'.38em',marginBottom:4}}>{sub}</p>
        <h3 className="rye" style={{fontSize:'clamp(24px,6vw,30px)',color:'var(--sys-text-main)',lineHeight:1.1}}>{title}</h3>
        <Div/>
      </div>

      <div style={{padding:'24px clamp(16px, 5vw, 24px) 30px',position:'relative',zIndex:2}}>
        {items.map(({icon,label,val})=>(
          <div key={label} style={{display:'flex',gap:16,marginBottom:20,alignItems:'flex-start'}}>
            <motion.span style={{fontSize:24,flexShrink:0,lineHeight:1,marginTop:2,display:'block'}} animate={{rotate:[0,-8,8,-6,0],y:[0,-2,2,-1,0]}} transition={{duration:spec.rotDur,repeat:Infinity,ease:'easeInOut'}}>{icon}</motion.span>
            <div>
              <p className="mont" style={{color:'var(--sys-text-mut)',fontSize:13,letterSpacing:'.18em',textTransform:'uppercase',marginBottom:3,fontWeight:600}}>{label}</p>
              <p className="play" style={{color:'var(--sys-text-main)',fontSize:'clamp(16px,4vw,19px)',lineHeight:1.45,whiteSpace:'pre-line'}}>{val}</p>
            </div>
          </div>
        ))}

        <div style={{textAlign:'center',marginTop:26}}>
          <motion.a
            href={btnUrl} target="_blank" rel="noopener noreferrer"
            whileHover={{scale:1.03}} whileTap={{scale:.97}}
            style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 30px',borderRadius:28,textDecoration:'none',color:'var(--sys-text-main)',minHeight:52,fontSize:'clamp(13px,3.5vw,15px)',letterSpacing:'.12em',background:'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',border:'1px solid var(--glass-border-b)',boxShadow:'0 4px 16px var(--glass-shadow)'}}
            className="rye"
          >
            <motion.span style={{fontSize:16,display:'block'}} animate={{x:[0,3,-3,2,0]}} transition={{duration:1.8,repeat:Infinity}}>📍</motion.span> {btnLabel}
          </motion.a>
        </div>
      </div>
    </div>
  );
}

// ─── EVENTOS ───────────────────────────────────────────────────────────────────
function Eventos() {
  return(
    <Section py={72}>
      <SectionTitle pre="PROGRAMA DE" title='" El Gran Día "'/>
      <EventCard title="SANTA MISA" sub="PRIMERO LO SAGRADO" emoji={<ChurchIcon sz={52}/>} idx={0}
        items={[{icon:<TimeIcon sz={22}/>,label:'Hora',val:E.misa.hora},{icon:'📅',label:'Fecha',val:E.fecha},{icon:<CrossIcon sz={22}/>,label:'Lugar',val:E.misa.lugar},{icon:'📍',label:'Dirección',val:E.misa.dir}]}
        btnLabel="VER EN MAPA" btnUrl={E.misa.maps}
      />
      <EventCard title="LA FIESTA" sub="DESPUÉS A CELEBRAR" emoji={<PartyIcon sz={52}/>} idx={1}
        items={[{icon:<TimeIcon sz={22}/>,label:'Hora',val:E.fiesta.hora},{icon:'📅',label:'Fecha',val:E.fecha},{icon:'🏡',label:'Lugar',val:E.fiesta.lugar},{icon:'📍',label:'Dirección',val:E.fiesta.dir}]}
        btnLabel="CÓMO LLEGAR" btnUrl={E.fiesta.maps}
      />
    </Section>
  );
}

// ─── COUNTDOWN ─────────────────────────────────────────────────────────────────
function Countdown() {
  const {d,h,m,s}=useCountdown(E.fiesta.target);
  const units=[{v:d,l:'DÍAS'},{v:h,l:'HRS'},{v:m,l:'MIN'},{v:s,l:'SEG'}];
  return(
    <Section py={76}>
      <div className="glass-panel" style={{textAlign:'center',padding:'clamp(30px, 8vw, 50px) clamp(16px, 5vw, 24px)',borderRadius:28}}>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:16,marginBottom:18,position:'relative',zIndex:2}}>
          <Spur sz={34} col={T.gold}/>
          <motion.div animate={{y:[0,-6,0]}} transition={{duration:3.5,repeat:Infinity}}><Horseshoe sz={48} col={T.gold}/></motion.div>
          <Spur sz={34} col={T.gold}/>
        </div>

        <p className="rye" style={{color:'var(--sys-text-mut)',fontSize:13,letterSpacing:'.36em',marginBottom:6,position:'relative',zIndex:2}}>LA CUENTA REGRESIVA</p>
        <p className="play" style={{color:'var(--sys-text-main)',fontSize:'clamp(22px,6vw,28px)',fontWeight:900,fontStyle:'italic',marginBottom:32,position:'relative',zIndex:2}}>El momento se acerca...</p>

        <div style={{display:'flex',justifyContent:'center',gap:'clamp(10px,3vw,18px)',position:'relative',zIndex:2}}>
          {units.map(({v,l})=>(
            <div key={l} style={{display:'flex',flexDirection:'column',alignItems:'center',flex:'0 0 auto'}}>
              <div className="glass" style={{
                width:'clamp(66px,18vw,82px)',height:'clamp(66px,18vw,82px)',
                display:'flex',alignItems:'center',justifyContent:'center',borderRadius:20,
              }}>
                <AnimatePresence mode="popLayout">
                  <motion.span key={v} className="rye dynamic-txt" style={{fontSize:'clamp(26px,7vw,32px)',position:'relative',zIndex:1}}
                    initial={{y:-10,opacity:0}} animate={{y:0,opacity:1}} exit={{y:10,opacity:0}} transition={{duration:.22}}
                  >{String(v??0).padStart(2,'0')}</motion.span>
                </AnimatePresence>
              </div>
              <p className="rye" style={{color:'var(--sys-text-mut)',fontSize:'clamp(8px,2.5vw,10px)',letterSpacing:'.2em',marginTop:14}}>{l}</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:32,position:'relative',zIndex:2}}><RopeOrnament w={260}/></div>
      </div>
    </Section>
  );
}

// ─── DRESS CODE ────────────────────────────────────────────────────────────────
function DressCode() {
  const items=[
    { text: 'Sombrero vaquero o tejano', icon: <LineIconHat sz={26} col={T.gold} /> },
    { text: 'Botas o zapatos vaqueros', icon: <LineIconBoot sz={26} col={T.gold} /> },
    { text: 'Jeans o pantalón de mezclilla', icon: <LineIconJeans sz={26} col={T.gold} /> },
    { text: 'Camisa o blusa western', icon: <LineIconShirt sz={26} col={T.gold} /> },
    { text: 'Cinturón con hebilla grande', icon: <LineIconBelt sz={26} col={T.gold} /> }
  ];
  return(
    <Section py={76}>
      <SectionTitle pre="🤠 ATUENDO 🤠" title="DRESS CODE" />
      <div className="glass-panel" style={{padding:'clamp(20px, 6vw, 30px) clamp(16px, 5vw, 24px)',borderRadius:24}}>
        <div style={{display:'flex',flexDirection:'column',gap:12,position:'relative',zIndex:2}}>
          {items.map((item,i)=>(
            <motion.div key={i}
              initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:'-30px'}} transition={{delay:i*.06}}
              style={{display:'flex',alignItems:'center',gap:16,padding:'16px 20px',borderRadius:16,minHeight:56,background:'var(--glass-bg)',borderBottom:'1px solid var(--glass-border-b)'}}
            >
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:36,height:36,background:'var(--sys-bg-base)',borderRadius:'50%',boxShadow:`0 2px 8px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.4)`}}>
                {item.icon}
              </div>
              <span className="play" style={{color:'var(--sys-text-main)',fontSize:'clamp(16px,4.2vw,19px)',lineHeight:1.4}}>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── RSVP ──────────────────────────────────────────────────────────────────────
function RSVP() {
  const url=`https://wa.me/${E.rsvp.phone}?text=${encodeURIComponent(E.rsvp.msg)}`;
  return(
    <Section py={88}>
      <div id="rsvp-section" className="glass" style={{textAlign:'center',padding:'clamp(40px, 10vw, 60px) clamp(20px, 6vw, 30px)',borderRadius:28,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-20,right:-20,opacity:0.2}}><CowboyHat sz={160}/></div>
        <div style={{position:'relative',zIndex:2}}>
          <div style={{display:'flex',justifyContent:'center',gap:16,marginBottom:24,alignItems:'center'}}>
            <motion.div animate={{y:[0,-5,0]}} transition={{duration:3.2,repeat:Infinity,delay:.3}}><Horseshoe sz={50} col={T.gold}/></motion.div>
            <SheriffStar sz={76} glow/>
            <motion.div animate={{y:[0,-5,0]}} transition={{duration:3.2,repeat:Infinity,delay:1.6}}><Horseshoe sz={50} col={T.gold} flip/></motion.div>
          </div>
          <p className="rye" style={{color:'var(--sys-text-mut)',fontSize:14,letterSpacing:'.36em',marginBottom:6}}>✦ ASISTENCIA ✦</p>
          <h2 className="rye dynamic-txt" style={{fontSize:'clamp(34px,9vw,44px)',lineHeight:1.05}}>ACOMPÁÑANOS</h2>
          
          <p className="play" style={{color:'var(--sys-text-main)',fontSize:'clamp(18px,4.5vw,22px)',fontStyle:'italic',margin:'18px 0 36px',lineHeight:1.75,opacity:.9}}>
            ¡No olvides tú regalo!<br/>
            ¡Confírmanos tú presencia<strong style={{color:T.gold,fontStyle:'normal'}}></strong>!
          </p>

          <motion.a
            href={url} target="_blank" rel="noopener noreferrer"
            whileHover={{scale:1.03, boxShadow: '0 12px 40px rgba(37,211,102,0.6), inset 0 2px 2px rgba(255,255,255,0.6)'}} 
            whileTap={{scale:.97}}
            style={{
              display:'inline-flex',alignItems:'center',gap:12,padding:'18px 36px',borderRadius:32,
              background:'linear-gradient(135deg, rgba(37,211,102,0.95) 0%, rgba(18,140,126,0.95) 100%)',
              color:'#fff',textDecoration:'none',minHeight:60,width:'100%',maxWidth:360,justifyContent:'center',
              boxShadow:'0 8px 32px rgba(37,211,102,0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
              border:'1px solid rgba(255,255,255,0.3)',
              backdropFilter:'blur(10px)'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" style={{flexShrink:0, filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'}}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.376l-.36-.213-3.728.887.905-3.636-.234-.373A9.818 9.818 0 1112 21.818z"/>
            </svg>
            <span className="rye" style={{fontSize:'clamp(15px,3.8vw,17px)',letterSpacing:'.12em', textShadow:'0 1px 2px rgba(0,0,0,0.2)'}}>Confirmar Asistencia</span>
          </motion.a>
        </div>
      </div>
    </Section>
  );
}

// ─── CIERRE ────────────────────────────────────────────────────────────────────
function Cierre() {
  return(
    <motion.footer initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} style={{padding:'60px 20px 140px',textAlign:'center',position:'relative',borderTop:'1px solid var(--glass-border-b)'}}>
      <div style={{position:'relative',zIndex:2,maxWidth:480,margin:'0 auto'}}>
        {/* We only use ONE skull here at the bottom to avoid overlapping with AmbientDecorations */}
        <div style={{opacity:.4,display:'flex',justifyContent:'center'}}><BullSkull sz={100} op={1}/></div>
        <div className="rye dynamic-txt" style={{fontSize:'clamp(22px,6vw,26px)',marginTop:16,opacity:.7}}>Carlos Zamudio Patiño</div>
        <Stars n={7} size={10} centerSize={16}/>
        <p className="elite" style={{color:'var(--sys-text-mut)',fontSize:14,letterSpacing:'.28em'}}>JUNIO 13 · 2026 · METEPEC, EDO. MÉX.</p>
        <p className="play" style={{color:'var(--sys-text-mut)',fontSize:16,marginTop:16,fontStyle:'italic',opacity:.6}}>Hecho con cariño por Matt 🤠</p>
      </div>
    </motion.footer>
  );
}

// ─── STICKY RSVP ───────────────────────────────────────────────────────────────
function StickyRSVP() {
  const [vis,setVis]=useState(false);
  const url=`https://wa.me/${E.rsvp.phone}?text=${encodeURIComponent(E.rsvp.msg)}`;
  
  useEffect(()=>{
    const fn=()=>{
      const y = window.scrollY;
      const rsvpSection = document.getElementById('rsvp-section');
      if(rsvpSection) {
        const rsvpTop = rsvpSection.getBoundingClientRect().top + window.scrollY;
        setVis(y > 350 && y < (rsvpTop - window.innerHeight + 150));
      } else {
        setVis(y > 350);
      }
    };
    window.addEventListener('scroll',fn,{passive:true});
    fn(); // init
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  return(
    <AnimatePresence>
      {vis&&(
        <motion.div
          initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} exit={{y:100,opacity:0}}
          transition={{type:'spring',damping:22,stiffness:260}}
          style={{position:'fixed',bottom:0,left:0,right:0,zIndex:500,padding:'12px 16px env(safe-area-inset-bottom,16px)'}}
        >
          <motion.a
            href={url} target="_blank" rel="noopener noreferrer"
            whileTap={{scale:.97}}
            style={{
              display:'flex',alignItems:'center',justifyContent:'center',gap:14,
              padding:'16px 24px', borderRadius:24, color:'#fff',textDecoration:'none',
              minHeight:60, maxWidth:420, margin:'0 auto',
              background:'linear-gradient(135deg, rgba(37,211,102,0.92) 0%, rgba(18,140,126,0.92) 100%)',
              backdropFilter:'blur(16px)',
              boxShadow:'0 -4px 32px rgba(37,211,102,0.35), inset 0 1px 2px rgba(255,255,255,0.4)',
              border:'1px solid rgba(255,255,255,0.2)'
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" style={{flexShrink:0, filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'}}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.376l-.36-.213-3.728.887.905-3.636-.234-.373A9.818 9.818 0 1112 21.818z"/>
            </svg>
            <div style={{textAlign:'left'}}>
              <div className="rye" style={{fontSize:'clamp(15px,4.2vw,17px)',letterSpacing:'.12em',lineHeight:1.2, textShadow:'0 1px 2px rgba(0,0,0,0.2)'}}>CONFIRMAR ASISTENCIA</div>
            </div>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [phase,setPhase]=useState('envelope');
  const { scrollYProgress } = useScroll();

  useEffect(()=>{
    if(phase==='main'){
      setTimeout(()=>{
        window.scrollTo({top:0,behavior:'smooth'});
      },500);
    }
  },[phase]);

  return(
    <>
      <style>{G}</style>
      <div className="mesh-bg" />
      <div style={{minHeight:'100svh',overflowX:'hidden',position:'relative'}}>

        <AnimatePresence mode="wait">
          {phase==='envelope'&&<EnvelopeScreen key="env" onOpen={()=>setPhase('reveal')}/>}
          {phase==='reveal'&&<CinematicReveal key="rev" onDone={()=>setPhase('main')}/>}
        </AnimatePresence>

        <AnimatePresence>
          {phase==='main'&&(
            <motion.main key="main" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.4}} style={{position:'relative'}}>
              <AmbientDecorations scrollYProgress={scrollYProgress} />
              <Hero/>
              <Mensaje/>
              <Eventos/>
              <Countdown/>
              <DressCode/>
              <RSVP/>
              <Cierre/>
              <StickyRSVP/>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}