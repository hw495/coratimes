import { useState } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";

const T = {
  bg:"#FAF8F5", sb:"#F0EBE3", sf:"#FFFFFF",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  sage:"#7A9E8E", ss:"#EAF2EF", sm:"#5C7D6F",
  ink:"#3A3530", i2:"#6E6358", i3:"#A89E94",
  bd:"#EAE4DC", bd2:"#D6CCC0",
  lav:"#9B8FAE", lavs:"#F0EDF5",
};
const DARK = {
  bg0:"#0C0C0C", bg1:"#141414",
  gold:"#C9A96E", goldS:"rgba(201,169,110,0.14)", goldL:"rgba(201,169,110,0.3)",
  text1:"#F5F2EE", text2:"#B8B3AC", text3:"#6E6A64",
  border:"rgba(255,255,255,0.07)", border2:"rgba(255,255,255,0.13)",
};

// ── Shared Input ──────────────────────────────────────────────
function Input({ label, type="text", placeholder, value, onChange, hint, dark }) {
  const [focus, setFocus] = useState(false);
  const fg = dark ? DARK.text1 : T.ink;
  const lc = dark ? (focus ? DARK.gold : DARK.text3) : (focus ? T.rose : T.i3);
  const bc = dark ? (focus ? DARK.gold : DARK.border2) : (focus ? T.rose : T.bd2);
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:"block", fontSize:10, letterSpacing:".08em", marginBottom:6, color:lc, transition:"color .2s" }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ width:"100%", border:"none", borderBottom:`1.5px solid ${bc}`,
          padding:"10px 0", fontSize:16, background:"none", outline:"none",
          fontFamily:"'Noto Sans TC',sans-serif", color:fg, transition:"border-color .2s",
          WebkitAppearance:"none" }}
      />
      {hint && <div style={{ fontSize:11, marginTop:4, opacity:.6, color:fg }}>{hint}</div>}
    </div>
  );
}

// ── Logo ──────────────────────────────────────────────────────
function Logo({ dark, size=1 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9*size }}>
      <div style={{ width:30*size, height:30*size, borderRadius:8*size, background:T.rose,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:15*size }}>🌿</div>
      <div>
        <div style={{ display:"flex", alignItems:"baseline", gap:5*size }}>
          <span style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:18*size, fontWeight:300,
            color:dark?"#F5F2EE":T.ink, letterSpacing:".06em" }}>Cora</span>
          <span style={{ fontFamily:"Georgia,serif", fontSize:19*size, fontWeight:400,
            color:T.rose, letterSpacing:".05em", fontStyle:"italic" }}>Times</span>
        </div>
        <div style={{ fontSize:9*size, color:dark?"rgba(255,255,255,.4)":T.i3,
          letterSpacing:".1em", marginTop:2 }}>創芯時光</div>
      </div>
    </div>
  );
}

// ── Page switcher ─────────────────────────────────────────────
export default function LoginShowcase() {
  const [page, setPage] = useState("member");
  const { isMobile } = useBreakpoint();

  const tabs = [
    { id:"member",  label:"學員前台",     url:"app.coratimes.com" },
    { id:"company", label:"公司後台",     url:"manage.coratimes.com" },
    { id:"super",   label:"Super Admin", url:"admin.coratimes.com" },
  ];

  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", background:"#EDEBE8",
      minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* Tab switcher */}
      <div style={{ padding: isMobile ? "12px 12px 8px" : "16px 20px 8px",
        display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setPage(t.id)} style={{
            padding: isMobile ? "6px 14px" : "7px 18px",
            borderRadius:20, border:"1px solid rgba(0,0,0,.12)",
            background: page===t.id ? T.ink : "rgba(255,255,255,.8)",
            color: page===t.id ? "#fff" : T.i2,
            fontSize: isMobile ? 11 : 12,
            cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
            display:"flex", flexDirection:"column", alignItems:"center",
          }}>
            <div style={{ fontWeight:500 }}>{t.label}</div>
            {!isMobile && <div style={{ fontSize:10, opacity:.6, marginTop:1 }}>{t.url}</div>}
          </button>
        ))}
      </div>

      {/* Login page */}
      <div style={{ flex:1, display:"flex", alignItems:"stretch",
        maxWidth: isMobile ? "100%" : 960, width:"100%",
        margin:"0 auto", borderRadius: isMobile ? 0 : 20,
        overflow:"hidden", boxShadow: isMobile ? "none" : "0 32px 80px rgba(58,53,48,.18)",
        marginBottom: isMobile ? 0 : 20,
      }}>
        {page === "member"  && <MemberLogin />}
        {page === "company" && <CompanyLogin />}
        {page === "super"   && <SuperLogin />}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 1. MEMBER LOGIN  —  app.coratimes.com
// ════════════════════════════════════════════════════════════════
export function MemberLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [sent,  setSent]  = useState(false);
  const { isMobile, isTablet } = useBreakpoint();
  const showLeft = !isMobile;

  return (
    <div style={{ display:"flex", width:"100%", minHeight: isMobile ? "auto" : 600,
      flexDirection: isMobile ? "column" : "row" }}>

      {/* TOP BANNER on mobile / LEFT PANEL on desktop */}
      {isMobile ? (
        /* Mobile: compact top banner */
        <div style={{ background:"linear-gradient(135deg,#F5ECE6 0%,#EAF2EF 100%)",
          padding:"24px 24px 20px", display:"flex", alignItems:"center",
          justifyContent:"space-between", borderBottom:`1px solid ${T.bd}` }}>
          <Logo />
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:12, color:T.rose, fontWeight:500 }}>歡迎回來</div>
            <div style={{ fontSize:10, color:T.i3, marginTop:2 }}>app.coratimes.com</div>
          </div>
        </div>
      ) : (
        /* Desktop/Tablet: left illustration panel */
        <div style={{ width: isTablet ? "40%" : "45%", flexShrink:0,
          background:"linear-gradient(160deg,#F5ECE6 0%,#EAF2EF 60%,#F0EDF5 100%)",
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", padding:40, position:"relative", overflow:"hidden" }}>
          {/* bg circles */}
          {[[280,280,180,"#C4957A","0.07"],[60,60,120,"#7A9E8E","0.08"],
            [220,20,80,"#9B8FAE","0.1"],[-30,200,140,"#B8924A","0.06"]].map(([x,y,r,c,o],i)=>(
            <div key={i} style={{ position:"absolute", left:x, top:y, width:r*2, height:r*2,
              borderRadius:"50%", background:c, opacity:o, pointerEvents:"none" }} />
          ))}
          <svg width="160" height="160" viewBox="0 0 180 180" style={{ position:"relative", zIndex:1 }}>
            <circle cx="90" cy="90" r="78" fill="none" stroke="#C4957A" strokeWidth="1" opacity=".3"/>
            {[0,60,120,180,240,300].map((deg,i)=>(
              <ellipse key={i} cx="90" cy="46" rx="10" ry="22"
                fill={["#C4957A","#7A9E8E","#9B8FAE","#B8924A","#C4957A","#7A9E8E"][i]}
                opacity=".55" transform={`rotate(${deg} 90 90)`}/>
            ))}
            <circle cx="90" cy="90" r="22" fill="white" opacity=".9"/>
            <text x="90" y="96" textAnchor="middle" fontSize="22" fill={T.rose}>🌿</text>
          </svg>
          <div style={{ position:"relative", zIndex:1, textAlign:"center", marginTop:20 }}>
            <Logo />
            <div style={{ fontSize:12, color:T.i2, lineHeight:1.8, marginTop:14 }}>
              歡迎回到你的時光<br/>每一次練習，都是給自己的禮物
            </div>
          </div>
          <div style={{ position:"absolute", bottom:24, fontSize:10, color:T.i3 }}>app.coratimes.com</div>
        </div>
      )}

      {/* FORM */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
        padding: isMobile ? "28px 24px 32px" : isTablet ? "40px 40px" : "48px 52px",
        background:T.sf, color:T.ink }}>

        {!isMobile && (
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:11, color:T.i3, letterSpacing:".1em", marginBottom:8 }}>學員登入</div>
            <h1 style={{ fontSize: isTablet ? 22 : 26, fontWeight:300, letterSpacing:".04em", color:T.ink }}>
              今天，繼續你的<br/><span style={{ color:T.rose }}>身心練習</span>
            </h1>
          </div>
        )}
        {isMobile && (
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:300, color:T.ink }}>學員登入</div>
            <div style={{ fontSize:12, color:T.i3, marginTop:4 }}>歡迎回到你的時光</div>
          </div>
        )}

        {/* LINE btn */}
        <button style={{ width:"100%", padding:"14px 0", borderRadius:12, border:"1.5px solid #06C755",
          background:"#fff", color:"#06C755", fontSize:15, fontWeight:500, cursor:"pointer",
          fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center",
          gap:8, marginBottom:20, WebkitAppearance:"none" }}>
          <svg width="20" height="20" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#06C755"/>
            <text x="20" y="26" textAnchor="middle" fontSize="18" fill="white">L</text>
          </svg>
          以 LINE 帳號登入
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ flex:1, height:1, background:T.bd }} />
          <span style={{ fontSize:11, color:T.i3, whiteSpace:"nowrap" }}>或以 Email 登入</span>
          <div style={{ flex:1, height:1, background:T.bd }} />
        </div>

        <Input label="EMAIL" type="email" placeholder="your@email.com"
          value={email} onChange={e=>setEmail(e.target.value)} />
        <Input label="密碼" type="password" placeholder="••••••••"
          value={pass} onChange={e=>setPass(e.target.value)} />

        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20, marginTop:-6 }}>
          <button style={{ background:"none", border:"none", fontSize:13, color:T.rose,
            cursor:"pointer", fontFamily:"inherit", padding:"4px 0" }}>忘記密碼？</button>
        </div>

        <button onClick={() => { setSent(true); setTimeout(() => onLogin && onLogin(), 600); }} style={{ width:"100%",
          padding:"14px 0", borderRadius:12, border:"none",
          background: sent ? "#7A9E8E" : T.rose, color:"#fff", fontSize:15, fontWeight:500,
          cursor:"pointer", fontFamily:"inherit", transition:"background .2s" }}>
          {sent ? "✓ 登入成功，跳轉中…" : "登入"}
        </button>

        <div style={{ textAlign:"center", marginTop:18, fontSize:13, color:T.i3 }}>
          還沒有帳號？
          <button style={{ background:"none", border:"none", color:T.rose,
            cursor:"pointer", fontFamily:"inherit", fontSize:13, marginLeft:4 }}>
            聯絡你的工作室
          </button>
        </div>

        <div style={{ marginTop:24, padding:"12px 14px", background:T.bg, borderRadius:10,
          display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:T.rs,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>🏠</div>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:T.rm }}>S.T Pilates</div>
            <div style={{ fontSize:11, color:T.i3 }}>信義旗艦店</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 2. COMPANY LOGIN  —  manage.coratimes.com
// ════════════════════════════════════════════════════════════════
export function CompanyLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [sent,  setSent]  = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  const tileColors = [
    [T.rs,T.rose],[T.ss,T.sage],[T.lavs,T.lav],[T.bg,"#D6CCC0"],
    [T.bg,"#D6CCC0"],[T.rs,T.rose],[T.ss,T.sage],[T.bg,"#D6CCC0"],
    [T.lavs,T.lav],[T.bg,"#D6CCC0"],[T.bg,"#D6CCC0"],[T.rs,T.rose],
    [T.bg,"#D6CCC0"],[T.ss,T.sage],[T.bg,"#D6CCC0"],[T.lavs,T.lav],
  ];

  return (
    <div style={{ display:"flex", width:"100%", minHeight: isMobile ? "auto" : 600,
      flexDirection: isMobile ? "column" : "row" }}>

      {/* TOP BANNER on mobile */}
      {isMobile ? (
        <div style={{ background:T.sf, borderBottom:`1px solid ${T.bd}`,
          padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Logo />
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:T.i3, letterSpacing:".06em" }}>COMPANY ADMIN</div>
            <div style={{ fontSize:10, color:T.i3, marginTop:2 }}>manage.coratimes.com</div>
          </div>
        </div>
      ) : (
        /* Desktop/Tablet: left grid panel */
        <div style={{ width: isTablet ? "38%" : "44%", flexShrink:0, background:"#FFFFFF",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          padding: isTablet ? 28 : 40, borderRight:`1px solid ${T.bd}`,
          position:"relative", overflow:"hidden" }}>
          <div style={{ display:"grid",
            gridTemplateColumns: isTablet ? "repeat(4,44px)" : "repeat(4,54px)",
            gridTemplateRows: isTablet ? "repeat(4,44px)" : "repeat(4,54px)",
            gap:6, marginBottom:28 }}>
            {tileColors.map(([bg,accent],i)=>(
              <div key={i} style={{ background:bg, borderRadius:9,
                display:"flex", alignItems:"center", justifyContent:"center",
                border:`1px solid ${T.bd}` }}>
                {i===5 && <span style={{ fontSize:18 }}>🌿</span>}
                {i===10 && <span style={{ fontSize:13, color:accent }}>✦</span>}
              </div>
            ))}
          </div>
          <Logo />
          <div style={{ fontSize:10, color:T.i3, marginTop:10, letterSpacing:".04em" }}>場館管理平台</div>
          <div style={{ position:"absolute", bottom:24, fontSize:10, color:T.i3 }}>manage.coratimes.com</div>
        </div>
      )}

      {/* FORM */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
        padding: isMobile ? "28px 24px 32px" : isTablet ? "40px 40px" : "48px 52px",
        background:T.sf, color:T.ink }}>

        <div style={{ marginBottom: isMobile ? 24 : 28 }}>
          <div style={{ fontSize:11, color:T.i3, letterSpacing:".1em", marginBottom:8 }}>COMPANY ADMIN</div>
          <h1 style={{ fontSize: isMobile ? 20 : isTablet ? 20 : 24, fontWeight:300,
            color:T.ink, letterSpacing:".04em", lineHeight:1.4 }}>
            管理你的<br/><span style={{ color:T.sage, fontWeight:500 }}>場館與時光表</span>
          </h1>
        </div>

        <Input label="工作 EMAIL" type="email" placeholder="admin@yourcompany.com"
          value={email} onChange={e=>setEmail(e.target.value)} />
        <Input label="密碼" type="password" placeholder="••••••••"
          value={pass} onChange={e=>setPass(e.target.value)}
          hint="首次登入請使用邀請信中的臨時密碼" />

        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:22 }}>
          <label style={{ display:"flex", alignItems:"center", gap:6,
            fontSize:13, color:T.i2, cursor:"pointer" }}>
            <input type="checkbox" style={{ accentColor:T.sage, width:16, height:16 }} />
            保持登入
          </label>
          <button style={{ background:"none", border:"none", fontSize:13, color:T.sage,
            cursor:"pointer", fontFamily:"inherit", padding:"4px 0" }}>重設密碼</button>
        </div>

        <button onClick={() => { setSent(true); setTimeout(() => onLogin && onLogin(), 600); }} style={{ width:"100%", padding:"14px 0",
          borderRadius:10, border:"none", background: sent ? T.sage : T.ink,
          color:"#fff", fontSize:15, fontWeight:500, cursor:"pointer",
          fontFamily:"inherit", transition:"background .25s", letterSpacing:".04em" }}>
          {sent ? "✓ 登入成功，跳轉中…" : "進入管理後台"}
        </button>

        <div style={{ marginTop:24,
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[["📍","場館與教室"],["🗓","時光表排程"],["👥","學員方案"],["📊","洞察報表"]].map(([ic,label])=>(
            <div key={label} style={{ display:"flex", alignItems:"center", gap:7,
              padding:"9px 10px", background:T.bg, borderRadius:9, fontSize:12, color:T.i2 }}>
              <span>{ic}</span>{label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 3. SUPER ADMIN LOGIN  —  admin.coratimes.com
// ════════════════════════════════════════════════════════════════
export function SuperLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [sent,  setSent]  = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  const hexSize = 22;
  const hexH = hexSize * Math.sqrt(3);
  const hexW = hexSize * 2;
  const hexes = [];
  for (let r=0;r<7;r++) for (let c=0;c<9;c++) {
    const x = c*hexW*0.75+(r%2===1?hexW*0.375:0)+hexW/2;
    const y = r*hexH*0.5+hexH/2;
    const hl = (r===3&&c===4)||(r===2&&c===3)||(r===2&&c===5)||(r===4&&c===3)||(r===4&&c===5);
    hexes.push({x,y,hl});
  }
  const hexPath = (cx,cy,s) => {
    const pts=[];
    for(let i=0;i<6;i++){const a=(Math.PI/180)*(60*i-30);pts.push(`${cx+s*Math.cos(a)},${cy+s*Math.sin(a)}`);}
    return `M${pts.join("L")}Z`;
  };

  return (
    <div style={{ display:"flex", width:"100%", minHeight: isMobile ? "auto" : 600,
      flexDirection: isMobile ? "column" : "row" }}>

      {/* TOP BANNER on mobile */}
      {isMobile ? (
        <div style={{ background:DARK.bg0, padding:"20px 24px",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:T.rose,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🌿</div>
            <div>
              <div style={{ display:"flex", alignItems:"baseline", gap:5 }}>
                <span style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:16,
                  fontWeight:300, color:"#F5F2EE", letterSpacing:".06em" }}>Cora</span>
                <span style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:400,
                  color:T.rose, fontStyle:"italic" }}>Times</span>
              </div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,.3)", letterSpacing:".1em" }}>創芯時光</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:DARK.gold, letterSpacing:".12em" }}>SUPER ADMIN</div>
            <div style={{ fontSize:9, color:DARK.text3, marginTop:2 }}>admin.coratimes.com</div>
          </div>
        </div>
      ) : (
        /* Desktop/Tablet: left hex panel */
        <div style={{ width: isTablet ? "38%" : "44%", flexShrink:0, background:DARK.bg0,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          padding:32, position:"relative", overflow:"hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 380 340"
            style={{ position:"absolute", inset:0 }}>
            {hexes.map((h,i)=>(
              <path key={i} d={hexPath(h.x,h.y,hexSize-2)}
                fill={h.hl ? DARK.goldS : "rgba(255,255,255,0.02)"}
                stroke={h.hl ? DARK.gold : DARK.border}
                strokeWidth={h.hl ? 1 : 0.5} />
            ))}
            <circle cx="190" cy="170" r="40" fill="none" stroke={DARK.gold} strokeWidth=".5" opacity=".2"/>
            <circle cx="190" cy="170" r="20" fill={DARK.goldS}/>
          </svg>
          <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
            <div style={{ fontSize:11, color:DARK.gold, letterSpacing:".24em", marginBottom:4, opacity:.8 }}>CORA TIMES</div>
            <div style={{ fontSize:10, color:DARK.gold, letterSpacing:".16em", marginBottom:10, opacity:.5 }}>創芯時光</div>
            <div style={{ fontSize:28, fontWeight:300, color:DARK.text1, letterSpacing:".14em" }}>ADMIN</div>
            <div style={{ width:32, height:1, background:DARK.gold, margin:"12px auto", opacity:.5 }} />
            <div style={{ fontSize:11, color:DARK.text3, letterSpacing:".08em" }}>系統管理入口</div>
          </div>
          <div style={{ position:"absolute", bottom:20, fontSize:9, color:DARK.text3 }}>admin.coratimes.com</div>
        </div>
      )}

      {/* FORM */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
        padding: isMobile ? "28px 24px 32px" : isTablet ? "40px 40px" : "48px 52px",
        background:DARK.bg1 }}>

        <div style={{ marginBottom: isMobile ? 24 : 32 }}>
          <div style={{ fontSize:9, color:DARK.gold, letterSpacing:".2em", marginBottom:10, opacity:.8 }}>
            SUPER ADMIN ACCESS
          </div>
          <div style={{ fontSize: isMobile ? 20 : 22, fontWeight:300,
            color:DARK.text1, letterSpacing:".08em", lineHeight:1.4 }}>
            系統管理員<br/><span style={{ color:DARK.gold }}>身份驗證</span>
          </div>
        </div>

        <Input label="EMAIL ADDRESS" type="email"
          placeholder="superadmin@coratimes.com"
          value={email} onChange={e=>setEmail(e.target.value)} dark />
        <Input label="PASSWORD" type="password"
          placeholder="••••••••••••"
          value={pass} onChange={e=>setPass(e.target.value)} dark />

        <button onClick={() => { setSent(true); setTimeout(() => onLogin && onLogin(), 700); }} style={{ width:"100%", padding:"14px 0",
          border:`1px solid ${sent ? DARK.gold : DARK.border2}`,
          background: sent ? DARK.goldS : "none",
          color: sent ? DARK.gold : DARK.text2,
          fontSize:13, fontWeight:400, cursor:"pointer", fontFamily:"inherit",
          letterSpacing:".1em", borderRadius:6, transition:"all .25s",
          marginBottom:24 }}>
          {sent ? "✓  AUTHENTICATED" : "AUTHENTICATE →"}
        </button>

        <div style={{ height:1, background:DARK.border, marginBottom:20 }} />

        <div style={{ padding:"12px 14px",
          background:"rgba(201,169,110,0.06)", border:`1px solid ${DARK.goldL}`,
          borderRadius:8 }}>
          <div style={{ fontSize:10, color:DARK.gold, letterSpacing:".08em", marginBottom:8 }}>存取範圍</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {["公司管理","訂閱方案","跨公司洞察","系統公告","平台設定","帳號管理"].map(item=>(
              <div key={item} style={{ fontSize:11, color:DARK.text3,
                display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ color:DARK.gold, fontSize:8 }}>◆</span>{item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:16, fontSize:11, color:DARK.text3,
          display:"flex", alignItems:"flex-start", gap:7, lineHeight:1.6 }}>
          <span style={{ fontSize:13, flexShrink:0 }}>🔒</span>
          此入口僅供 Cora Times 授權系統管理員使用，所有操作均有稽核記錄
        </div>
      </div>
    </div>
  );
}
