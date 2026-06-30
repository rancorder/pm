import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Mode = "float" | "chaos" | "stable";
type Lang = "en" | "jp";

// ─── Requirement nodes ───────────────────────────────────────────────────────
const REQ_POS = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 280 + Math.cos(a) * 178,
    y: 178 + Math.sin(a) * 80,
    color: `hsl(${8 + (i % 5) * 14}, 90%, 62%)`,
  };
});

// ─── Copy ────────────────────────────────────────────────────────────────────
const COPY = {
  en: {
    tag0: "TECHNICAL PM · FPT Interview 2025",
    h0a: "WHY PROJECTS FAIL",
    h0b: "BEFORE CODING",
    h0c: "STARTS",
    sub0: "Most projects don't fail in development.",
    sub0b: "They fail in",
    sub0c: "decision structure",
    btn0: "ENTER SIMULATION →",
    nav: "← → ARROW KEYS / SWIPE TO NAVIGATE",

    tag1: "Failure Simulator",
    slider1: "ADJUST VARIABLES — WATCH PROJECT COLLAPSE",
    s1a: "SCOPE CREEP", s1b: "DECISION DELAY", s1c: "VENDOR COUNT",
    fi: "FAILURE INDEX",
    fc_hi: "More vendors → More decisions → More chaos",
    fc_md: "Structure is degrading — intervene now",
    fc_lo: "Project structure is holding",

    tag2: "Japan Project Reality",
    h2a: "SCOPE", h2b: "EXPLOSION",
    p2: (n: number) => `${n} requirements → 1 PM → zero decision structure`,
    nodes2: ["CLIENT", "SALES", "PM  ←  EXPLOSION", "DEV TEAM"],

    tag3: "Traditional PM",
    h3: ["SAME TOOLS.", "SAME FAILURE."],
    items3: ["More meetings", "More documents", "More status reports", "More coordination"],
    p3a: "The project still fails.",
    p3b: "Because the structure was never fixed.",

    tag4: "Project Physics",
    h4: "THE IRON TRIANGLE",
    tri: ["SCOPE", "TIME", "COST"],
    center4: "CONSTRAINT",
    p4a: "You can change two.",
    p4b: "You cannot change all three.",
    p4c: "Every project decision is a negotiation with physics.",

    tag5: "Structural PM",
    h5: ["DECISION", "GATES"],
    gates: [
      { icon: "◈", label: "SCOPE FREEZE",   desc: "Lock requirements before dev starts",  color: "#00d4ff" },
      { icon: "◉", label: "DECISION OWNER", desc: "One person decides — no committee",     color: "#00ff99" },
      { icon: "◆", label: "CHANGE CONTROL", desc: "Every change costs — make it visible",  color: "#ffb800" },
    ],
    p5: ["Project stability comes from", "decision design"],

    tag6: "Philosophy",
    h6a: "ENGINEERING", h6b: "SOLVES PROBLEMS.",
    h6c: "PROJECT MANAGEMENT", h6d: "PREVENTS THEM.",
    quote6a: "My job is not to manage tasks.",
    quote6b: "My job is to design decision structures",
    quote6c: "that make failure impossible.",
    exp6a: "Manufacturing B2B — 17+ years",
    exp6b: "Projects fail when decisions are delayed.",
    exp6c: "Manufacturing PM × IT — a rare combination.",
    back6: "← REVIEW SLIDES · ast-design.com",
  },
  jp: {
    tag0: "テクニカルPM · FPT面接 2025",
    h0a: "プロジェクトが失敗するのは",
    h0b: "コーディングの",
    h0c: "前から始まっている",
    sub0: "ほとんどのプロジェクトは開発フェーズで失敗しない。",
    sub0b: "失敗するのは",
    sub0c: "意思決定の構造",
    btn0: "シミュレーション開始 →",
    nav: "← → キー / スワイプで移動",

    tag1: "失敗シミュレーター",
    slider1: "変数を動かす — プロジェクトが崩壊する",
    s1a: "スコープクリープ", s1b: "意思決定の遅延", s1c: "ベンダー数",
    fi: "失敗指数",
    fc_hi: "ベンダー増加 → 意思決定増加 → カオス拡大",
    fc_md: "構造が崩れている — 今すぐ介入が必要",
    fc_lo: "プロジェクト構造は安定している",

    tag2: "日本のプロジェクトの現実",
    h2a: "スコープ", h2b: "爆発",
    p2: (n: number) => `${n}件の要件 → PM1人 → 意思決定構造ゼロ`,
    nodes2: ["クライアント", "営業", "PM  ←  爆発点", "開発チーム"],

    tag3: "従来型PM",
    h3: ["同じ道具。", "同じ失敗。"],
    items3: ["会議を増やす", "ドキュメントを増やす", "進捗報告を増やす", "調整業務を増やす"],
    p3a: "それでもプロジェクトは失敗する。",
    p3b: "なぜなら、構造自体を直していないから。",

    tag4: "プロジェクトの物理法則",
    h4: "鉄のトライアングル",
    tri: ["スコープ", "時間", "コスト"],
    center4: "制約",
    p4a: "2つは変えられる。",
    p4b: "3つ全ては変えられない。",
    p4c: "すべての意思決定は、この物理法則との交渉だ。",

    tag5: "構造的PM",
    h5: ["意思決定", "ゲート"],
    gates: [
      { icon: "◈", label: "スコープ固定",     desc: "開発前に要件をロックする",            color: "#00d4ff" },
      { icon: "◉", label: "意思決定オーナー", desc: "1人が決める — 委員会制は排除",        color: "#00ff99" },
      { icon: "◆", label: "変更管理",          desc: "すべての変更にコストを可視化する",    color: "#ffb800" },
    ],
    p5: ["プロジェクトの安定は", "意思決定の設計から生まれる"],

    tag6: "PM哲学",
    h6a: "エンジニアリングは", h6b: "問題を解決する。",
    h6c: "プロジェクトマネジメントは", h6d: "問題を防ぐ。",
    quote6a: "私の仕事はタスクを管理することではない。",
    quote6b: "失敗を不可能にする",
    quote6c: "意思決定構造を設計することだ。",
    exp6a: "製造業B2B — 17年以上の経験",
    exp6b: "プロジェクトは意思決定が遅延したとき失敗する。",
    exp6c: "製造PM × IT — 希少な組み合わせ。",
    back6: "← スライドに戻る · ast-design.com",
  },
};

const TRI_VERTS = [
  { x: 190, y: 262 },
  { x: 370, y: 262 },
  { x: 280, y: 100 },
];

export default function App() {
  const [slide, setSlide] = useState(0);
  const [lang, setLang] = useState<Lang>("en");
  const [scope, setScope] = useState(25);
  const [ddelay, setDdelay] = useState(25);
  const [vendors, setVendors] = useState(25);
  const [reqCount, setReqCount] = useState(0);
  const [visible, setVisible] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<Mode>("float");
  const slidersRef = useRef({ scope: 25, ddelay: 25, vendors: 25 });
  const dimRef = useRef({ w: 0, h: 0 });
  const touchX = useRef(0);

  const c = COPY[lang];
  const TOTAL = 7;

  useEffect(() => { slidersRef.current = { scope, ddelay, vendors }; }, [scope, ddelay, vendors]);

  // ── Canvas (one-time) ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: false })!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dimRef.current = { w: window.innerWidth, h: window.innerHeight };
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 160;
    const px = new Float32Array(N), py = new Float32Array(N);
    const pvx = new Float32Array(N), pvy = new Float32Array(N);
    const pr = new Float32Array(N), ph = new Float32Array(N);
    const { w, h } = dimRef.current;
    for (let i = 0; i < N; i++) {
      px[i] = Math.random() * w; py[i] = Math.random() * h;
      pvx[i] = (Math.random() - 0.5) * 0.7; pvy[i] = (Math.random() - 0.5) * 0.7;
      pr[i] = 0.7 + Math.random() * 2.2; ph[i] = 195;
    }
    const CELL = 85;
    let raf = 0;
    const tick = () => {
      const { w, h } = dimRef.current;
      const mode = modeRef.current;
      const { scope, ddelay, vendors } = slidersRef.current;
      const chaos = (scope + ddelay + vendors) / 300;
      ctx.fillStyle = "rgba(3,9,18,0.16)";
      ctx.fillRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
      const grid: number[][] = Array.from({ length: cols * rows }, () => []);
      for (let i = 0; i < N; i++) {
        const gx = Math.floor(px[i] / CELL), gy = Math.floor(py[i] / CELL);
        if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) grid[gy * cols + gx].push(i);
      }
      for (let i = 0; i < N; i++) {
        if (mode === "float") {
          pvx[i] += (Math.random() - 0.5) * 0.016; pvy[i] += (Math.random() - 0.5) * 0.016;
          pvx[i] *= 0.993; pvy[i] *= 0.993; ph[i] += (195 - ph[i]) * 0.018;
        } else if (mode === "chaos") {
          pvx[i] += (Math.random() - 0.5) * chaos * 1.6; pvy[i] += (Math.random() - 0.5) * chaos * 1.6;
          pvx[i] += (w/2 - px[i]) * 0.00012; pvy[i] += (h/2 - py[i]) * 0.00012;
          pvx[i] *= 0.962; pvy[i] *= 0.962; ph[i] += (8 - ph[i]) * 0.028 * (chaos * 1.8 + 0.25);
        } else {
          pvx[i] += (Math.random() - 0.5) * 0.009; pvy[i] += (Math.random() - 0.5) * 0.009;
          pvx[i] *= 0.972; pvy[i] *= 0.972; ph[i] += (148 - ph[i]) * 0.022;
        }
        px[i] += pvx[i]; py[i] += pvy[i];
        if (px[i] < 0) px[i] += w; if (px[i] > w) px[i] -= w;
        if (py[i] < 0) py[i] += h; if (py[i] > h) py[i] -= h;
        ctx.beginPath(); ctx.arc(px[i], py[i], pr[i], 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${ph[i]},88%,66%,0.88)`; ctx.fill();
        if (pr[i] > 1.4) {
          ctx.beginPath(); ctx.arc(px[i], py[i], pr[i] * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${ph[i]},88%,66%,0.055)`; ctx.fill();
        }
      }
      for (let i = 0; i < N; i++) {
        const gcx = Math.floor(px[i] / CELL), gcy = Math.floor(py[i] / CELL);
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = gcx + dx, ny = gcy + dy;
          if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
          for (const j of grid[ny * cols + nx]) {
            if (j <= i) continue;
            const ddx = px[i] - px[j], ddy = py[i] - py[j], d2 = ddx*ddx + ddy*ddy;
            if (d2 < 5625) {
              const a = (1 - Math.sqrt(d2) / 75) * 0.22;
              ctx.beginPath(); ctx.moveTo(px[i], py[i]); ctx.lineTo(px[j], py[j]);
              ctx.strokeStyle = `hsla(${(ph[i]+ph[j])*.5},80%,62%,${a})`; ctx.lineWidth = 0.5; ctx.stroke();
            }
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // ── Slide transition with opacity fade ───────────────────────────────────
  const goTo = (n: number) => {
    if (n === slide) return;
    setVisible(false);
    setTimeout(() => { setSlide(n); setVisible(true); }, 220);
  };

  // ── Particle mode + req anim ─────────────────────────────────────────────
  useEffect(() => {
    const modes: Mode[] = ["float","chaos","chaos","chaos","stable","stable","stable"];
    modeRef.current = modes[slide] ?? "float";
    if (slide === 2) {
      setReqCount(0); let cnt = 0;
      const id = setInterval(() => { cnt++; setReqCount(cnt); if (cnt >= 18) clearInterval(id); }, 340);
      return () => clearInterval(id);
    } else setReqCount(0);
  }, [slide]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (["ArrowRight","ArrowDown"," "].includes(e.key)) goTo(Math.min(TOTAL-1, slide+1));
      if (["ArrowLeft","ArrowUp"].includes(e.key)) goTo(Math.max(0, slide-1));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [slide]);

  const chaos = Math.round((scope + ddelay + vendors) / 3);
  const chaosColor = chaos > 62 ? "#ff2b3e" : chaos > 38 ? "#ffb800" : "#00ff99";
  const statusLabel = chaos > 62 ? "CRITICAL" : chaos > 38 ? "UNSTABLE" : "STABLE";

  // jp mode shrinks font proportionally to fit narrower screens
  const jpScale = lang === "jp" ? 0.68 : 1;
  const W: React.CSSProperties = {
    position:"absolute", inset:0, display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"flex-start",
    padding:"clamp(48px,10vh,72px) clamp(18px,5vw,36px) 80px",
    textAlign:"center", overflowY:"auto", overflowX:"hidden",
    transition:"opacity 0.22s ease, transform 0.22s ease",
    opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
  };
  // T: display heading — JP uses Noto Sans JP with tighter sizing
  const T = (sz="clamp(48px,8.5vw,110px)", col="#f0f4ff"): React.CSSProperties => {
    if (lang === "jp") {
      // derive jp size: parse clamp and scale down
      const jpSz = sz.replace(
        /clamp\(([\d.]+)px,([\d.]+)vw,([\d.]+)px\)/,
        (_,mn,vw,mx) => `clamp(${Math.round(+mn*jpScale)}px,${Math.round(+vw*jpScale*10)/10}vw,${Math.round(+mx*jpScale)}px)`
      );
      return { fontFamily:"'Noto Sans JP',sans-serif", fontWeight:700,
        fontSize:jpSz, lineHeight:1.2, letterSpacing:"0.04em", color:col, margin:0 };
    }
    return { fontFamily:"'Bebas Neue',cursive", fontSize:sz, lineHeight:0.95,
      letterSpacing:"0.03em", color:col, margin:0 };
  };
  const M = (sz=14, op=0.7): React.CSSProperties => ({
    fontFamily: lang==="jp" ? "'Noto Sans JP',sans-serif" : "'Space Mono',monospace",
    fontSize: lang==="jp" ? Math.max(10, Math.round(sz * 0.9)) : sz,
    opacity:op, lineHeight: lang==="jp" ? 1.85 : 1.7,
  });
  const TAG: React.CSSProperties = {
    fontFamily:"'Space Mono',monospace", fontSize:9.5, letterSpacing:"0.2em", color:"#00d4ff",
    border:"1px solid rgba(0,212,255,0.32)", padding:"4px 13px", marginBottom:18,
    display:"inline-block", textTransform:"uppercase",
  };
  const NBTN = (side:"left"|"right"): React.CSSProperties => ({
    position:"absolute", [side]:12, top:"50%", transform:"translateY(-50%)",
    background:"transparent", border:"1px solid rgba(255,255,255,0.13)",
    color:"rgba(255,255,255,0.32)", cursor:"pointer", padding:"13px 15px",
    fontFamily:"'Space Mono',monospace", fontSize:15, transition:"color 0.2s, border-color 0.2s",
  });

  return (
    <div style={{ position:"fixed", inset:0, background:"#030912", overflow:"hidden", color:"#f0f4ff" }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 48) goTo(Math.max(0, Math.min(TOTAL-1, slide+(dx<0?1:-1))));
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Noto+Sans+JP:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:3px;border-radius:2px;cursor:pointer;outline:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:#00d4ff;box-shadow:0 0 10px rgba(0,212,255,0.7);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes popIn{from{opacity:0;transform:scale(0.55);}to{opacity:1;transform:scale(1);}}
        @keyframes glow{0%,100%{text-shadow:0 0 18px rgba(255,43,62,.5);}50%{text-shadow:0 0 38px rgba(255,43,62,.9);}}
      `}</style>

      <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%" }}/>

      {/* Lang Toggle */}
      <div style={{ position:"absolute",top:14,left:16,zIndex:20,display:"flex",gap:6 }}>
        {(["en","jp"] as Lang[]).map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            fontFamily:"'Space Mono',monospace", fontSize:9.5, letterSpacing:"0.14em", padding:"5px 11px",
            background: lang===l ? "rgba(0,212,255,0.15)" : "transparent",
            border:`1px solid ${lang===l ? "#00d4ff" : "rgba(255,255,255,0.18)"}`,
            color: lang===l ? "#00d4ff" : "rgba(255,255,255,0.35)",
            cursor:"pointer", textTransform:"uppercase", transition:"all 0.2s",
          }}>
            {l==="en" ? "EN" : "日本語"}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div style={{ position:"absolute",top:14,right:16,zIndex:20,
        fontFamily:"'Space Mono',monospace",fontSize:9.5,opacity:0.28,letterSpacing:"0.18em" }}>
        {String(slide+1).padStart(2,"0")} / {String(TOTAL).padStart(2,"0")}
      </div>

      {/* Corner brackets */}
      {[
        {top:10,left:10,borderTop:"1px solid rgba(0,212,255,0.22)",borderLeft:"1px solid rgba(0,212,255,0.22)"},
        {top:10,right:10,borderTop:"1px solid rgba(0,212,255,0.22)",borderRight:"1px solid rgba(0,212,255,0.22)"},
        {bottom:10,left:10,borderBottom:"1px solid rgba(0,212,255,0.22)",borderLeft:"1px solid rgba(0,212,255,0.22)"},
        {bottom:10,right:10,borderBottom:"1px solid rgba(0,212,255,0.22)",borderRight:"1px solid rgba(0,212,255,0.22)"},
      ].map((s,i) => <div key={i} style={{position:"absolute",width:22,height:22,...s as React.CSSProperties}}/>)}

      <div style={{ position:"relative",zIndex:10,width:"100%",height:"100%" }}>

        {/* ════ 0 OPENING ═════════════════════════════════════════════════ */}
        {slide===0 && (
          <div style={{...W, justifyContent:"center"}}>
            <div style={{...TAG,animation:"fadeUp 0.7s ease both"}}>{c.tag0}</div>
            <h1 style={{...T(),animation:"fadeUp 0.7s ease 0.12s both"}}>
              {c.h0a}<br/><span style={{color:"#00d4ff"}}>{c.h0b}</span><br/>{c.h0c}
            </h1>
            <p style={{...M(13),maxWidth:440,marginTop:lang==="jp"?14:22,animation:"fadeUp 0.7s ease 0.3s both"}}>
              {c.sub0}<br/>
              {c.sub0b} <span style={{color:"#ff2b3e",fontWeight:700,opacity:1}}>{c.sub0c}</span>.
            </p>
            <button onClick={() => goTo(1)} style={{
              marginTop:lang==="jp"?20:36,
              fontFamily: lang==="jp" ? "'Noto Sans JP',sans-serif" : "'Space Mono',monospace",
              fontSize:lang==="jp"?12:11,
              letterSpacing:lang==="jp"?"0.06em":"0.14em", padding:"13px 32px",
              background:"transparent",border:"1px solid #00d4ff",color:"#00d4ff",
              cursor:"pointer",animation:"fadeUp 0.7s ease 0.5s both",transition:"background 0.2s",
            }}
              onMouseEnter={e => ((e.target as HTMLElement).style.background="rgba(0,212,255,0.08)")}
              onMouseLeave={e => ((e.target as HTMLElement).style.background="transparent")}
            >{c.btn0}</button>
            <div style={{marginTop:lang==="jp"?24:40,width:"min(400px,80vw)",height:1,
              background:"linear-gradient(to right,transparent,rgba(0,212,255,0.35),transparent)"}}/>
            <div style={{marginTop:8,fontFamily:"'Space Mono',monospace",fontSize:9,
              opacity:0.22,letterSpacing:"0.16em"}}>
              {c.nav}
            </div>
          </div>
        )}

        {/* ════ 1 FAILURE SIMULATOR ═══════════════════════════════════════ */}
        {slide===1 && (
          <div style={{...W, justifyContent:"center"}}>
            <div style={TAG}>{c.tag1}</div>
            <h1 style={{...T("clamp(40px,8vw,115px)",chaosColor),transition:"color 0.6s ease",animation:"fadeUp 0.5s ease both"}}>
              {statusLabel}
            </h1>
            <p style={{...M(10,0.36),marginBottom:14,letterSpacing:"0.06em"}}>{c.slider1}</p>
            <div style={{width:"100%",maxWidth:420}}>
              {[
                {label:c.s1a,val:scope,  set:setScope,  col:"#ff6b35"},
                {label:c.s1b,val:ddelay, set:setDdelay, col:"#ff2b3e"},
                {label:c.s1c,val:vendors,set:setVendors,col:"#ffb800"},
              ].map(({label,val,set,col}) => (
                <div key={label} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{...M(lang==="jp"?11:9.5,0.52),textAlign:"left"}}>{label}</span>
                    <span style={{...M(9.5,1),color:col,marginLeft:8,flexShrink:0}}>{val}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={val}
                    onChange={e => set(+e.target.value)}
                    style={{background:`linear-gradient(to right,${col} ${val}%,rgba(255,255,255,0.1) ${val}%)`}}
                  />
                </div>
              ))}
              <div style={{padding:"12px 16px",marginTop:4,border:`1px solid ${chaosColor}`,
                background:"rgba(0,0,0,0.35)",transition:"border-color 0.5s"}}>
                <div style={M(9,0.38)}>{c.fi}</div>
                <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:50,lineHeight:1,
                  color:chaosColor,marginTop:2,transition:"color 0.5s"}}>{chaos}%</div>
                <div style={{...M(10,0.5),marginTop:4}}>
                  {chaos>62 ? c.fc_hi : chaos>38 ? c.fc_md : c.fc_lo}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ 2 SCOPE EXPLOSION ══════════════════════════════════════════ */}
        {slide===2 && (
          <div style={{...W, justifyContent:"center"}}>
            <div style={TAG}>{c.tag2}</div>
            <h1 style={{...T("clamp(32px,6.5vw,96px)"),animation:"fadeUp 0.5s ease both"}}>
              {c.h2a} <span style={{color:"#ff2b3e"}}>{c.h2b}</span>
            </h1>
            <svg viewBox="0 0 560 310" style={{width:"100%",maxWidth:520,height:"auto",marginTop:4}}>
              {([[280,46,280,90],[280,120,280,162],[280,192,280,234]] as number[][]).map(([x1,y1,x2,y2],i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,212,255,0.3)" strokeWidth="1" strokeDasharray="4 3"/>
              ))}
              {[
                {y:26, label:c.nodes2[0],stroke:"rgba(0,212,255,0.45)",fill:"rgba(0,212,255,0.08)",tc:"#00d4ff"},
                {y:96, label:c.nodes2[1],stroke:"rgba(0,212,255,0.35)",fill:"rgba(0,212,255,0.06)",tc:"#00d4ff"},
                {y:166,label:c.nodes2[2],stroke:"rgba(255,43,62,0.8)", fill:"rgba(255,43,62,0.12)", tc:"#ff2b3e"},
                {y:238,label:c.nodes2[3],stroke:"rgba(0,212,255,0.35)",fill:"rgba(0,212,255,0.06)",tc:"#00d4ff"},
              ].map(({y,label,stroke,fill,tc}) => (
                <g key={label}>
                  <rect x={150} y={y} width={260} height={30} rx={2} fill={fill} stroke={stroke} strokeWidth={1}/>
                  <text x={280} y={y+18.5} textAnchor="middle" fontFamily="Space Mono,monospace" fontSize={9.5} fill={tc} letterSpacing={1.8}>{label}</text>
                </g>
              ))}
              {REQ_POS.slice(0,reqCount).map((p,i) => (
                <g key={i} style={{animation:"popIn 0.28s cubic-bezier(.34,1.56,.64,1) both"}}>
                  <line x1={p.x} y1={p.y} x2={280} y2={181} stroke={p.color} strokeWidth={0.9} opacity={0.65} strokeDasharray="3 2"/>
                  <rect x={p.x-25} y={p.y-9} width={50} height={18} rx={3} fill="rgba(255,100,0,0.09)" stroke={p.color} strokeWidth={0.8}/>
                  <text x={p.x} y={p.y+5} textAnchor="middle" fontFamily="Space Mono,monospace" fontSize={7} fill={p.color} letterSpacing={0.5}>
                    REQ_{String(i+1).padStart(2,"0")}
                  </text>
                </g>
              ))}
            </svg>
            <p style={{...M(12,0.65),marginTop:4,color:"#ff2b3e"}}>{c.p2(reqCount)}</p>
          </div>
        )}

        {/* ════ 3 TRADITIONAL PM ══════════════════════════════════════════ */}
        {slide===3 && (
          <div style={{...W, justifyContent:"center"}}>
            <div style={TAG}>{c.tag3}</div>
            <h1 style={{...T(),color:"#ff2b3e",animation:"glow 2s ease infinite, fadeUp 0.6s ease both"}}>
              {c.h3[0]}<br/>{c.h3[1]}
            </h1>
            <div style={{maxWidth:340,textAlign:"left",marginTop:lang==="jp"?14:24,marginBottom:lang==="jp"?14:20,width:"100%"}}>
              {c.items3.map((item,i) => (
                <div key={item} style={{
                  display:"flex",alignItems:"center",gap:14,
                  padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,0.07)",
                  animation:`fadeUp 0.5s ease ${i*0.13}s both`,
                }}>
                  <span style={{color:"#ff2b3e",fontSize:18,lineHeight:1}}>✕</span>
                  <span style={{...M(13,0.55),textDecoration:"line-through"}}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{...M(14,0.88),color:"#ff2b3e",animation:"fadeUp 0.5s ease 0.6s both"}}>{c.p3a}</p>
            <p style={{...M(11,0.42),marginTop:6,animation:"fadeUp 0.5s ease 0.8s both"}}>{c.p3b}</p>
          </div>
        )}

        {/* ════ 4 PROJECT PHYSICS ══════════════════════════════════════════ */}
        {slide===4 && (
          <div style={{...W, justifyContent:"center"}}>
            <div style={TAG}>{c.tag4}</div>
            <h1 style={{...T("clamp(40px,7vw,88px)"),animation:"fadeUp 0.5s ease both",marginBottom:4}}>
              {c.h4}
            </h1>
            <svg viewBox="0 0 420 310" style={{width:"100%",maxWidth:420,height:"auto"}}>
              <polygon points={TRI_VERTS.map(v=>`${v.x},${v.y}`).join(" ")}
                fill="rgba(0,212,255,0.04)" stroke="rgba(0,212,255,0.25)" strokeWidth="1.2"/>
              {TRI_VERTS.map((v,i) => {
                const colors=["#ff6b35","#00d4ff","#ffb800"];
                const offY=i===2?-26:26, offX=i===0?-44:i===1?44:0;
                return (
                  <g key={i}>
                    <circle cx={v.x} cy={v.y} r={10} fill={colors[i]} opacity={0.88}/>
                    <circle cx={v.x} cy={v.y} r={24} fill="none" stroke={colors[i]} strokeWidth={0.7} opacity={0.38}/>
                    <text x={v.x+offX} y={v.y+offY+4} textAnchor="middle"
                      fontFamily="Space Mono,monospace" fontSize={10.5} fill={colors[i]} letterSpacing={1.5}>
                      {c.tri[i]}
                    </text>
                    <text x={v.x+offX} y={v.y+offY+17} textAnchor="middle"
                      fontFamily="Space Mono,monospace" fontSize={7.5} fill={colors[i]} opacity={0.45} letterSpacing={0.5}>
                      ↕ VARIABLE
                    </text>
                  </g>
                );
              })}
              {[[0,1],[1,2],[2,0]].map(([a,b],i) => {
                const mx=(TRI_VERTS[a].x+TRI_VERTS[b].x)/2, my=(TRI_VERTS[a].y+TRI_VERTS[b].y)/2;
                return <text key={i} x={mx} y={my+4} textAnchor="middle"
                  fontFamily="Space Mono,monospace" fontSize={9} fill="rgba(255,255,255,0.18)">⟷</text>;
              })}
              <text x={280} y={200} textAnchor="middle"
                fontFamily="Space Mono,monospace" fontSize={9} fill="rgba(0,212,255,0.5)" letterSpacing={2.5}>
                {c.center4}
              </text>
            </svg>
            <p style={{...M(13,0.9),color:"#00d4ff",animation:"fadeUp 0.5s ease 0.2s both"}}>{c.p4a}</p>
            <p style={{...M(13,0.5),marginTop:2,animation:"fadeUp 0.5s ease 0.35s both"}}>{c.p4b}</p>
            <p style={{...M(10,0.38),marginTop:8,maxWidth:380,animation:"fadeUp 0.5s ease 0.5s both"}}>{c.p4c}</p>
          </div>
        )}

        {/* ════ 5 DECISION GATES ═══════════════════════════════════════════ */}
        {slide===5 && (
          <div style={{...W, justifyContent:"center"}}>
            <div style={TAG}>{c.tag5}</div>
            <h1 style={{...T(),animation:"fadeUp 0.5s ease both"}}>
              {c.h5[0]}<br/><span style={{color:"#00ff99"}}>{c.h5[1]}</span>
            </h1>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",margin:lang==="jp"?"12px 0":"20px 0",maxWidth:520}}>
              {c.gates.map(({icon,label,desc,color},i) => (
                <div key={label} style={{
                  flex:"1 1 130px",padding:"18px 14px",
                  border:`1px solid ${color}`,background:"rgba(0,0,0,0.35)",
                  animation:`fadeUp 0.6s ease ${i*0.18}s both`,textAlign:"center",
                }}>
                  <div style={{fontSize:22,color,marginBottom:10}}>{icon}</div>
                  <div style={{...M(lang==="jp"?9:9.5,1),color,letterSpacing:"0.06em",marginBottom:6}}>{label}</div>
                  <div style={M(9,0.42)}>{desc}</div>
                </div>
              ))}
            </div>
            <p style={{...M(15,0.88),animation:"fadeUp 0.6s ease 0.56s both"}}>
              {c.p5[0]} <strong style={{color:"#00ff99",opacity:1}}>{c.p5[1]}</strong>.
            </p>
          </div>
        )}

        {/* ════ 6 ENDING / PHILOSOPHY ══════════════════════════════════════ */}
        {slide===6 && (
          <div style={W}>
            <div style={{...TAG,animation:"fadeUp 0.6s ease both",marginTop:4}}>{c.tag6}</div>

            {/* Engineering vs PM contrast — single col on mobile/JP, 2-col on desktop EN */}
            <div style={{maxWidth:480,width:"100%",animation:"fadeUp 0.6s ease 0.1s both",marginBottom:8}}>
              <div style={{display:"grid",gridTemplateColumns:lang==="jp"?"1fr":"repeat(auto-fit,minmax(200px,1fr))",gap:8}}>
                <div style={{padding:"12px 14px",borderLeft:"3px solid #ff2b3e",background:"rgba(255,43,62,0.05)",textAlign:"left"}}>
                  <div style={M(9,0.35)}>{c.h6a}</div>
                  <div style={{...T("clamp(16px,3vw,32px)","#ff2b3e"),marginTop:4,lineHeight:1.15}}>{c.h6b}</div>
                </div>
                <div style={{padding:"12px 14px",borderLeft:"3px solid #00ff99",background:"rgba(0,255,153,0.05)",textAlign:"left"}}>
                  <div style={M(9,0.35)}>{c.h6c}</div>
                  <div style={{...T("clamp(16px,3vw,32px)","#00ff99"),marginTop:4,lineHeight:1.15}}>{c.h6d}</div>
                </div>
              </div>
            </div>

            {/* Core philosophy */}
            <div style={{
              padding:"14px 18px",marginTop:6,
              border:"1px solid rgba(0,212,255,0.28)",background:"rgba(0,0,0,0.4)",
              maxWidth:480,textAlign:"left",width:"100%",
              animation:"fadeUp 0.6s ease 0.3s both",
            }}>
              <div style={{...M(8,0.28),letterSpacing:"0.16em",marginBottom:10}}>[ PM PHILOSOPHY ]</div>
              <p style={{...M(12,0.88),lineHeight:lang==="jp"?2.0:1.95}}>
                {c.quote6a}<br/>
                <span style={{color:"#00d4ff",opacity:1}}>{c.quote6b}</span><br/>
                <span style={{color:"#00d4ff",opacity:1}}>{c.quote6c}</span>
              </p>
            </div>

            {/* Experience */}
            <div style={{
              padding:"12px 18px",marginTop:8,
              border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.02)",
              maxWidth:480,textAlign:"left",width:"100%",
              animation:"fadeUp 0.6s ease 0.5s both",
            }}>
              <div style={{...M(8,0.28),letterSpacing:"0.16em",marginBottom:8}}>[ EXPERIENCE ]</div>
              <p style={{...M(11,0.82),lineHeight:lang==="jp"?2.0:1.9}}>
                {c.exp6a}<br/>
                <span style={{color:"#00d4ff",opacity:1}}>{c.exp6b}</span><br/>
                <span style={{...M(10,0.38)}}>{c.exp6c}</span>
              </p>
            </div>

            <p style={{...M(9,0.22),marginTop:10,letterSpacing:"0.12em",animation:"fadeUp 0.6s ease 0.72s both"}}>
              {c.back6}
            </p>
          </div>
        )}

        {/* Dot nav */}
        <div style={{position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,alignItems:"center"}}>
          {Array.from({length:TOTAL},(_,i) => (
            <div key={i} onClick={() => goTo(i)} style={{
              width:i===slide?22:7, height:7, borderRadius:4,
              background:i===slide?"#00d4ff":"rgba(255,255,255,0.18)",
              cursor:"pointer", transition:"all 0.3s ease",
              boxShadow:i===slide?"0 0 10px #00d4ff":"none",
            }}/>
          ))}
        </div>

        {slide>0 && (
          <button onClick={() => goTo(slide-1)} style={NBTN("left")}
            onMouseEnter={e => {(e.target as HTMLElement).style.color="#fff";(e.target as HTMLElement).style.borderColor="rgba(255,255,255,0.4)";}}
            onMouseLeave={e => {(e.target as HTMLElement).style.color="rgba(255,255,255,0.32)";(e.target as HTMLElement).style.borderColor="rgba(255,255,255,0.13)";}}>←</button>
        )}
        {slide<TOTAL-1 && (
          <button onClick={() => goTo(slide+1)} style={NBTN("right")}
            onMouseEnter={e => {(e.target as HTMLElement).style.color="#fff";(e.target as HTMLElement).style.borderColor="rgba(255,255,255,0.4)";}}
            onMouseLeave={e => {(e.target as HTMLElement).style.color="rgba(255,255,255,0.32)";(e.target as HTMLElement).style.borderColor="rgba(255,255,255,0.13)";}}>→</button>
        )}
      </div>
    </div>
  );
}
