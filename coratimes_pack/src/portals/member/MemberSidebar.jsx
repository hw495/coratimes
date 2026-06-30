import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const T = {
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  sb:"#F0EBE3", sf:"#FFFFFF", ink:"#3A3530",
  i2:"#6E6358", i3:"#A89E94", bd:"#EAE4DC", sand2:"#E8E0D6",
  sage:"#7A9E8E", lavs:"#F0EDF5", lav:"#9B8FAE",
};

const nav = [
  { group:"探索", items:[
    { to:"/member/app",       icon:"🏠", label:"工作室首頁" },
    { to:"/member/app/courses",icon:"🌱", label:"課程瀏覽"   },
    { to:"/member/app/coaches",icon:"🤍", label:"教練介紹"   },
  ]},
  { group:"預約", items:[
    { to:"/member/app/schedule",icon:"🗓", label:"預約時光"   },
    { to:"/member/app/booking",icon:"🎫", label:"確認預約"   },
  ]},
  { group:"我的帳號", items:[
    { to:"/member/app/passes", icon:"💳", label:"我的時光券"  },
    { to:"/member/app/history",icon:"📋", label:"預留紀錄"   },
    { to:"/member/app/posture", icon:"🩻", label:"體態報告"   },
    { to:"/member/app/health",  icon:"📋", label:"健康評估表" },
    { to:"/member/app/contracts",icon:"📄", label:"服務合約"   },
    { to:"/member/app/profile",icon:"👤", label:"個人資料"   },
  ]},
];

const bottomNav = [
  { to:"/member/app",       icon:"🏠", label:"首頁"  },
  { to:"/member/app/schedule",icon:"🗓", label:"預約"  },
  { to:"/member/app/passes", icon:"💳", label:"時光券" },
  { to:"/member/app/posture", icon:"🩻", label:"體態"  },
  { to:"/member/app/history",icon:"📋", label:"紀錄"  },
  { to:"/member/app/profile",icon:"👤", label:"我的"  },
];

const ss = {
  sidebar:{ width:200, flexShrink:0, background:T.sb, borderRight:`1px solid ${T.bd}`,
    display:"flex", flexDirection:"column", height:"100%", minHeight:"100vh", position:"sticky", top:38 },
  top:{ padding:"16px 14px 12px" },
  brand:{ display:"flex", alignItems:"center", gap:8, marginBottom:12 },
  bmark:{ width:28, height:28, borderRadius:8, background:T.rose,
    display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 },
  bname:{ fontSize:13, fontWeight:500, color:T.ink, letterSpacing:".03em" },
  bsub:{ fontSize:9, color:T.i3, letterSpacing:".08em", marginTop:1 },
  studio:{ background:T.rs, borderRadius:9, padding:"7px 10px",
    display:"flex", alignItems:"center", gap:7 },
  studioName:{ fontSize:11, color:T.rm, fontWeight:500 },
  nav:{ flex:1, padding:"4px 7px", overflowY:"auto" },
  group:{ marginBottom:12 },
  groupLabel:{ fontSize:9, color:T.i3, padding:"0 7px", letterSpacing:".1em",
    marginBottom:4, textTransform:"uppercase" },
  navItem:{ display:"flex", alignItems:"center", gap:8, padding:"7px 8px 7px 11px",
    borderRadius:8, fontSize:12, color:T.i2, transition:"all .15s",
    position:"relative", marginBottom:1, textDecoration:"none" },
  foot:{ padding:"10px 7px", borderTop:`1px solid ${T.bd}` },
  userRow:{ display:"flex", alignItems:"center", gap:8, padding:"6px 9px", borderRadius:8, cursor:"pointer" },
  userAv:{ width:26, height:26, borderRadius:"50%", background:T.lavs,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:10, color:T.lav, fontWeight:500, flexShrink:0 },
  userName:{ fontSize:12, color:T.ink },
  userRole:{ fontSize:10, color:T.i3 },
  // bottom nav
  bottomNav:{ position:"fixed", bottom:0, left:0, right:0, zIndex:100,
    background:T.sf, borderTop:`1px solid ${T.bd}`,
    display:"flex", height:60 },
  bottomItem:{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", gap:2, textDecoration:"none", border:"none",
    background:"none", cursor:"pointer", fontFamily:"inherit",
    padding:0, color:T.i3, transition:"color .15s" },
  bottomIcon:{ fontSize:20, lineHeight:1 },
  bottomLabel:{ fontSize:9 },
};

function NavItemLink({ item }) {
  return (
    <NavLink to={item.to} end={item.to==="/member/app"} style={({ isActive }) => ({
      ...ss.navItem,
      background: isActive ? T.rs : "none",
      color: isActive ? T.rm : T.i2,
    })}>
      {({ isActive }) => (
        <>
          {isActive && <div style={{ position:"absolute", left:0, top:6, bottom:6, width:2.5, borderRadius:2, background:T.rose }} />}
          <span style={{ fontSize:14, width:18, textAlign:"center" }}>{item.icon}</span>
          {item.label}
        </>
      )}
    </NavLink>
  );
}

export default function MemberSidebar() {
  const { isMobile, isTablet } = useBreakpoint();

  if (isMobile) return (
    <nav style={ss.bottomNav}>
      {bottomNav.map(item => (
        <NavLink key={item.to} to={item.to} end={item.to==="/member/app"}
          style={({ isActive }) => ({ ...ss.bottomItem, color: isActive ? T.rose : T.i3 })}>
          <span style={ss.bottomIcon}>{item.icon}</span>
          <span style={ss.bottomLabel}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );

  if (isTablet) return (
    <aside style={{ width:48, flexShrink:0, background:T.sb, borderRight:`1px solid ${T.bd}`,
      display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0",
      height:"100%", minHeight:"100vh", position:"sticky", top:38, gap:2 }}>
      <div style={{ width:28, height:28, borderRadius:8, background:T.rose,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, marginBottom:8 }}>🌿</div>
      {nav.flatMap(g=>g.items).map(item => (
        <NavLink key={item.to} to={item.to} end={item.to==="/member/app"}
          title={item.label}
          style={({ isActive }) => ({
            width:36, height:36, borderRadius:9,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, textDecoration:"none",
            background: isActive ? T.rs : "none",
          })}>
          {item.icon}
        </NavLink>
      ))}
    </aside>
  );

  return (
    <aside style={ss.sidebar}>
      <div style={ss.top}>
        <div style={ss.brand}>
          <div style={ss.bmark}>🌿</div>
          <div>
            <div style={ss.bname}>Cora Times</div>
            <div style={ss.bsub}>創芯時光</div>
          </div>
        </div>
        <div style={ss.studio}>
          <span>🏠</span>
          <span style={ss.studioName}>S.T Pilates</span>
        </div>
      </div>
      <nav style={ss.nav}>
        {nav.map(g => (
          <div key={g.group} style={ss.group}>
            <div style={ss.groupLabel}>{g.group}</div>
            {g.items.map(item => <NavItemLink key={item.to} item={item} />)}
          </div>
        ))}
      </nav>
      <div style={ss.foot}>
        <div style={ss.userRow}>
          <div style={ss.userAv}>莊</div>
          <div><div style={ss.userName}>莊書語</div><div style={ss.userRole}>學員</div></div>
        </div>
      </div>
    </aside>
  );
}
