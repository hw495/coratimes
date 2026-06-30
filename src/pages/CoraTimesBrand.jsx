import { useNavigate } from "react-router-dom";
import { useState } from "react";

const T = {
  bg:"#FAF8F5", sb:"#F0EBE3", sf:"#FFFFFF",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  sage:"#7A9E8E", ss:"#EAF2EF", sm:"#5C7D6F",
  ink:"#3A3530", i2:"#6E6358", i3:"#A89E94",
  bd:"#EAE4DC", bd2:"#D6CCC0",
  amb:"#B8924A", ambs:"#F5EDD8",
  lav:"#9B8FAE", lavs:"#F0EDF5",
};

// ── Logo SVG variants ────────────────────────────────────────
function LogoMark({ size = 40, color = "#C4957A" }) {
  // Stylised "CT" mark — a leaf-circle hybrid
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* outer ring */}
      <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1.5" opacity=".35"/>
      {/* inner organic leaf shape */}
      <path d="M20 8 C26 8 32 13 32 20 C32 27 26 32 20 32 C14 32 8 27 8 20 C8 13 14 8 20 8Z"
        fill={color} opacity=".12"/>
      {/* C arc */}
      <path d="M26 13 C22 10 15 11 13 16 C11 21 13 28 19 30"
        stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {/* T crossbar */}
      <line x1="20" y1="13" x2="28" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="13" x2="24" y2="27" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function LogoFull({ scale = 1, dark = false }) {
  const ink = dark ? "#F5F2EE" : T.ink;
  const accent = T.rose;
  const sub = dark ? "#8A8580" : T.i3;
  return (
    <div style={{ display:"flex", alignItems:"center", gap: 10 * scale }}>
      <LogoMark size={36 * scale} color={accent} />
      <div>
        <div style={{ display:"flex", alignItems:"baseline", gap: 5 * scale, lineHeight:1 }}>
          <span style={{
            fontFamily:"'Noto Sans TC', sans-serif",
            fontSize: 20 * scale,
            fontWeight: 300,
            color: ink,
            letterSpacing: ".08em",
          }}>Cora</span>
          <span style={{
            fontFamily:"Georgia, 'Times New Roman', serif",
            fontSize: 21 * scale,
            fontWeight: 400,
            color: accent,
            letterSpacing: ".06em",
            fontStyle:"italic",
          }}>Times</span>
        </div>
        <div style={{ fontSize: 11 * scale, color: T.rose, letterSpacing: ".1em", marginTop: 2 * scale, fontFamily:"'Noto Sans TC', sans-serif" }}>創芯時光</div>
        <div style={{ fontSize: 9 * scale, color: sub, letterSpacing: ".18em", marginTop: 2 * scale, textTransform:"uppercase", fontFamily:"'Noto Sans TC', sans-serif" }}>場館管理平台</div>
      </div>
    </div>
  );
}

function LogoCompact({ scale = 1, dark = false }) {
  const ink = dark ? "#F5F2EE" : T.ink;
  return (
    <div style={{ display:"flex", alignItems:"center", gap: 7 * scale }}>
      <LogoMark size={28 * scale} color={T.rose} />
      <div style={{ display:"flex", alignItems:"baseline", gap: 4 * scale }}>
        <span style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:15*scale, fontWeight:300, color:ink, letterSpacing:".08em" }}>Cora</span>
        <span style={{ fontFamily:"Georgia,serif", fontSize:16*scale, fontWeight:400, color:T.rose, letterSpacing:".06em", fontStyle:"italic" }}>Times</span>
      </div>
    </div>
  );
}

function LogoIcon({ size = 44 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.25, background:T.rose, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <svg width={size*0.6} height={size*0.6} viewBox="0 0 24 24" fill="none">
        <path d="M15 6 C11 4 6 6 5 10 C4 14 6 19 11 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="6" x2="19" y2="6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="15.5" y1="6" x2="15.5" y2="18" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ── Showcase ─────────────────────────────────────────────────
export default function CoraTimesBrand() {
  const [bg, setBg] = useState("light");

  const pageBg = bg === "dark" ? "#141414" : bg === "sand" ? T.sb : T.bg;

  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", background:"#EDEBE8", minHeight:"100vh", padding:20 }}>

      {/* Controls */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {[["light","淺色背景"],["sand","暖沙背景"],["dark","深色背景"]].map(([id,label])=>(
          <button key={id} onClick={()=>setBg(id)} style={{
            padding:"5px 14px", borderRadius:20, border:"1px solid rgba(0,0,0,.15)",
            background: bg===id ? T.ink : "rgba(255,255,255,.7)",
            color: bg===id ? "#fff" : T.i2,
            fontSize:12, cursor:"pointer", fontFamily:"inherit"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background:pageBg, borderRadius:20, padding:32, boxShadow:"0 16px 48px rgba(0,0,0,.1)" }}>

        {/* ── 1. 主 Logo ── */}
        <div style={{ marginBottom:32, paddingBottom:24, borderBottom:`1px solid ${bg==="dark"?"rgba(255,255,255,.08)":T.bd}` }}>
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".1em", marginBottom:14 }}>主 LOGO</div>
          <LogoFull scale={1.8} dark={bg==="dark"} />
        </div>

        {/* ── 2. 尺寸變體 ── */}
        <div style={{ marginBottom:32, paddingBottom:24, borderBottom:`1px solid ${bg==="dark"?"rgba(255,255,255,.08)":T.bd}` }}>
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".1em", marginBottom:14 }}>尺寸變體</div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[2.2, 1.6, 1.0, 0.75].map(s => (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:16 }}>
                <LogoFull scale={s} dark={bg==="dark"} />
                <span style={{ fontSize:10, color:T.i3 }}>{Math.round(s*20)}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. 應用場景 ── */}
        <div style={{ marginBottom:32, paddingBottom:24, borderBottom:`1px solid ${bg==="dark"?"rgba(255,255,255,.08)":T.bd}` }}>
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".1em", marginBottom:14 }}>應用場景</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>

            {/* App icon */}
            <div style={{ background: bg==="dark"?"#1C1C1C":T.sf, border:`1px solid ${bg==="dark"?"rgba(255,255,255,.08)":T.bd}`, borderRadius:14, padding:20, display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
              <div style={{ fontSize:10, color:T.i3, letterSpacing:".06em", marginBottom:4 }}>App 圖示</div>
              <LogoIcon size={64} />
              <LogoIcon size={44} />
              <LogoIcon size={32} />
            </div>

            {/* Sidebar */}
            <div style={{ background: bg==="dark"?"#1C1C1C":"#F0EBE3", border:`1px solid ${bg==="dark"?"rgba(255,255,255,.08)":T.bd}`, borderRadius:14, padding:20 }}>
              <div style={{ fontSize:10, color:T.i3, letterSpacing:".06em", marginBottom:12 }}>側邊欄</div>
              <LogoCompact scale={1} dark={bg==="dark"} />
              <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:8 }}>
                {["今日簽到","時光表","學員","教練"].map(item => (
                  <div key={item} style={{ padding:"6px 10px", borderRadius:8, fontSize:12, color: bg==="dark"?"#8A8580":T.i2, background: item==="今日簽到" ? T.rs : "none" }}>
                    {item==="今日簽到" ? <span style={{ color:T.rm, fontWeight:500 }}>• {item}</span> : `  ${item}`}
                  </div>
                ))}
              </div>
            </div>

            {/* Login page header */}
            <div style={{ background: bg==="dark"?"#1C1C1C":T.sf, border:`1px solid ${bg==="dark"?"rgba(255,255,255,.08)":T.bd}`, borderRadius:14, padding:20 }}>
              <div style={{ fontSize:10, color:T.i3, letterSpacing:".06em", marginBottom:14 }}>登入頁</div>
              <div style={{ textAlign:"center", marginBottom:14 }}>
                <LogoFull scale={1.1} dark={bg==="dark"} />
              </div>
              <div style={{ fontSize:12, color:bg==="dark"?"#C9A96E":T.rose, textAlign:"center", marginTop:8, letterSpacing:".04em" }}>
                歡迎回到你的時光
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. 入口標示 ── */}
        <div style={{ marginBottom:32, paddingBottom:24, borderBottom:`1px solid ${bg==="dark"?"rgba(255,255,255,.08)":T.bd}` }}>
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".1em", marginBottom:14 }}>三個入口</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {[
              { url:"app.coratimes.com",    label:"學員前台",     bg1:T.rs,    fg:T.rm,  desc:"療癒系・米白・玫瑰棕" },
              { url:"manage.coratimes.com", label:"公司管理後台", bg1:"#F5F5F5", fg:T.i2, desc:"專業白淨・模組方格" },
              { url:"admin.coratimes.com",  label:"系統管理後台", bg1:"#1C1C1C", fg:"#C9A96E", desc:"深色・香檳金" },
            ].map(p => (
              <div key={p.url} style={{ background:p.bg1, border:`1px solid ${T.bd}`, borderRadius:12, padding:"14px 15px" }}>
                <div style={{ fontSize:10, color:p.fg, fontWeight:500, letterSpacing:".06em", marginBottom:5 }}>{p.label}</div>
                <div style={{ fontSize:11, color:p.fg, opacity:.8, marginBottom:6, ...({fontFamily:"monospace"}) }}>{p.url}</div>
                <div style={{ fontSize:10, opacity:.6, color:p.fg }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. 色彩系統 ── */}
        <div>
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".1em", marginBottom:14 }}>品牌色彩系統</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
            {[
              { name:"玫瑰棕", hex:"#C4957A", label:"主行動色" },
              { name:"鼠尾草", hex:"#7A9E8E", label:"正向狀態" },
              { name:"薰衣草", hex:"#9B8FAE", label:"Super Admin" },
              { name:"琥珀",   hex:"#B8924A", label:"提醒 / 警示" },
              { name:"霧灰藍", hex:"#8A9BAE", label:"次要資訊" },
              { name:"石墨",   hex:"#3A3530", label:"主文字" },
            ].map(c => (
              <div key={c.hex} style={{ textAlign:"center" }}>
                <div style={{ width:"100%", aspectRatio:"1", background:c.hex, borderRadius:10, marginBottom:6, boxShadow:"0 2px 8px rgba(0,0,0,.1)" }} />
                <div style={{ fontSize:11, fontWeight:500, color:bg==="dark"?"#F5F2EE":T.ink }}>{c.name}</div>
                <div style={{ fontSize:9, color:T.i3, marginTop:1 }}>{c.hex}</div>
                <div style={{ fontSize:9, color:T.i3 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── 字型說明 ── */}
      <div style={{ marginTop:14, padding:"12px 16px", background:"rgba(255,255,255,.7)", borderRadius:12, fontSize:11, color:T.i2, display:"flex", gap:16, flexWrap:"wrap" }}>
        <span>✦ <b>Cora</b>：Noto Sans TC 300（細體，現代感）</span>
        <span>✦ <b>Times</b>：Georgia / Times New Roman 400 italic（Serif，時代感）</span>
        <span>✦ 兩字混排形成「現代 × 經典」的視覺對比張力</span>
      </div>
    </div>
  );
}
