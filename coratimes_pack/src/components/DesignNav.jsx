import { useNavigate, useLocation } from "react-router-dom";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useState } from "react";

const PAGES = [
  { path:"/",         label:"首頁",     group:"hub"    },
  { path:"/member",   label:"學員前台", group:"portal" },
  { path:"/manage",   label:"公司後台", group:"portal" },
  { path:"/superadmin",label:"Super Admin",group:"portal"},
  { path:"/brand",    label:"品牌",     group:"arch"   },
  { path:"/design",   label:"架構分工", group:"arch"   },
  { path:"/db",       label:"DB 設計",  group:"arch"   },
  { path:"/flex",     label:"彈性架構", group:"arch"   },
  { path:"/arch",     label:"系統架構", group:"arch"   },
  { path:"/posture",  label:"體態評估 APP", group:"app" },
  { path:"/reseller",  label:"經銷商平台",  group:"portal" },
];

export default function DesignNav() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const { isMobile } = useBreakpoint();
  const [open, setOpen] = useState(false);

  const isActive = (p) => {
    if (p === "/") return pathname === "/";
    // /member matches /member and /member/home/*
    // /manage matches /manage and /manage/*
    // /superadmin matches /superadmin and /superadmin/home/*
    return pathname === p || pathname.startsWith(p + "/");
  };

  const T = { rose:"#C4957A", ink:"#3A3530", i3:"#A89E94", bd:"rgba(255,255,255,.08)" };

  const NavBtn = ({ page }) => (
    <button onClick={() => { navigate(page.path); setOpen(false); }} style={{
      background: isActive(page.path) ? T.rose : "none",
      border: "none",
      color: isActive(page.path) ? "#fff" : "rgba(255,255,255,.55)",
      fontSize: 12, padding: "4px 12px", borderRadius: 16,
      cursor: "pointer", fontFamily: "inherit",
      whiteSpace: "nowrap", transition: "all .15s",
      fontWeight: isActive(page.path) ? 500 : 400,
    }}>{page.label}</button>
  );

  return (
    <>
      <div style={{
        position:"fixed", top:0, left:0, right:0, zIndex:9999,
        background:"rgba(58,53,48,.95)", backdropFilter:"blur(10px)",
        borderBottom:`1px solid ${T.bd}`,
        display:"flex", alignItems:"center",
        padding:"0 12px", height:38,
      }}>
        {/* Brand */}
        <div onClick={() => navigate("/")} style={{ display:"flex", alignItems:"center", gap:7, marginRight:12, cursor:"pointer", flexShrink:0 }}>
          <span style={{ fontSize:14 }}>🌿</span>
          <span style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:12, fontWeight:300, color:"rgba(255,255,255,.8)", letterSpacing:".06em" }}>Cora</span>
          <span style={{ fontFamily:"Georgia,serif", fontSize:12, fontWeight:400, color:T.rose, fontStyle:"italic" }}>Times</span>
          <span style={{ fontSize:10, color:"rgba(255,255,255,.3)", margin:"0 2px" }}>·</span>
          <span style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".05em" }}>創芯時光</span>
        </div>

        <div style={{ width:1, height:16, background:T.bd, marginRight:8, flexShrink:0 }} />

        {isMobile ? (
          /* Mobile: show active label + hamburger */
          <>
            <span style={{ fontSize:12, color:"rgba(255,255,255,.7)", flex:1 }}>
              {PAGES.find(p => isActive(p.path))?.label || ""}
            </span>
            <button onClick={() => setOpen(!open)} style={{
              background:"none", border:`1px solid ${T.bd}`,
              color:"rgba(255,255,255,.6)", fontSize:12, padding:"3px 10px",
              borderRadius:12, cursor:"pointer", fontFamily:"inherit"
            }}>選單 {open ? "✕" : "▾"}</button>
          </>
        ) : (
          /* Desktop/Tablet: inline nav items */
          <div style={{ display:"flex", alignItems:"center", gap:2, overflowX:"auto", scrollbarWidth:"none" }}>
            {PAGES.map(p => <NavBtn key={p.path} page={p} />)}
          </div>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && open && (
        <div onClick={() => setOpen(false)} style={{
          position:"fixed", inset:0, zIndex:9998,
          background:"rgba(0,0,0,.4)", backdropFilter:"blur(2px)",
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            position:"absolute", top:38, left:0, right:0,
            background:"rgba(40,37,34,.97)", borderBottom:`1px solid ${T.bd}`,
            padding:"8px 12px 12px",
          }}>
            {[
              { label:"頁面", items: PAGES.filter(p=>p.group==="hub"||p.group==="portal"||p.group==="app") },
              { label:"架構設計", items: PAGES.filter(p=>p.group==="arch") },
            ].map(sec => (
              <div key={sec.label} style={{ marginBottom:8 }}>
                <div style={{ fontSize:9, color:"rgba(255,255,255,.3)", letterSpacing:".1em", padding:"4px 8px 6px", textTransform:"uppercase" }}>{sec.label}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {sec.items.map(p => <NavBtn key={p.path} page={p} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
