
import { useState } from "react";

// ─── Design tokens ───────────────────────────────────────────
const T = {
  bg:"#FAF8F5", sb:"#F0EBE3", sf:"#FFFFFF", sand2:"#E8E0D6", sand3:"#D6CCC0",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  sage:"#7A9E8E", ss:"#EAF2EF", sm:"#5C7D6F",
  ink:"#3A3530", i2:"#6E6358", i3:"#A89E94",
  bd:"#EAE4DC", bd2:"#D6CCC0",
  amb:"#B8924A", ambs:"#F5EDD8",
  lav:"#9B8FAE", lavs:"#F0EDF5",
  mist:"#8A9BAE", mists:"#EEF2F6",
  coral:"#C4726A", corals:"#F9EDEC",
};

// ─── Primitives ──────────────────────────────────────────────
function Btn({ children, v="ghost", onClick, sm }) {
  const pad = sm ? "4px 12px" : "6px 15px";
  const fs  = sm ? 11 : 12;
  const base = { border:`1px solid ${T.bd2}`, background:"none", padding:pad, borderRadius:20, fontSize:fs, color:T.i2, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap", transition:"all .15s" };
  const vs = { ghost:{}, primary:{ background:T.rose, borderColor:T.rose, color:"#fff" }, danger:{ borderColor:T.corals, color:T.coral }, sage:{ background:T.sage, borderColor:T.sage, color:"#fff" }, lav:{ background:T.lav, borderColor:T.lav, color:"#fff" } };
  return <button style={{...base,...(vs[v]||{})}} onClick={onClick}>{children}</button>;
}

function Tag({ children, color=T.i3, bg=T.sb }) {
  return <span style={{ fontSize:10, padding:"2px 9px", borderRadius:12, fontWeight:500, background:bg, color, display:"inline-block" }}>{children}</span>;
}

function Divider() {
  return <div style={{ height:1, background:`linear-gradient(90deg,transparent,${T.bd},transparent)`, margin:"16px 0" }} />;
}

function Avatar({ initials, bg=T.sb, color=T.i2, size=32, radius=8 }) {
  return <div style={{ width:size, height:size, borderRadius:radius, background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.38, fontWeight:500, flexShrink:0 }}>{initials}</div>;
}

// ─── Modal ───────────────────────────────────────────────────
function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()} style={{ position:"fixed", inset:0, background:"rgba(58,53,48,.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, backdropFilter:"blur(3px)" }}>
      <div style={{ background:T.sf, borderRadius:20, padding:24, width:440, maxWidth:"92vw", border:`1px solid ${T.bd}`, boxShadow:"0 24px 48px rgba(58,53,48,.1)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <span style={{ fontSize:14, fontWeight:500, color:T.ink }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:18, color:T.i3, cursor:"pointer", padding:"2px 6px", borderRadius:6 }}>✕</button>
        </div>
        <div style={{ marginBottom:6 }}>{children}</div>
        {footer && <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:20, paddingTop:16, borderTop:`1px solid ${T.bd}` }}>{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:10, color:T.i3, letterSpacing:".06em", marginBottom:5 }}>{label}</div>
      {children}
    </div>
  );
}
const inp = { width:"100%", border:"none", borderBottom:`1px solid ${T.bd2}`, padding:"7px 0", fontSize:13, color:T.ink, background:"none", outline:"none", fontFamily:"inherit" };
const sel = { width:"100%", border:`1px solid ${T.bd2}`, borderRadius:9, padding:"8px 10px", fontSize:13, color:T.ink, background:T.sf, outline:"none", fontFamily:"inherit" };

// ─── Sidebar ─────────────────────────────────────────────────
const SUPER_NAV = [
  { icon:"🏢", label:"公司管理",   id:"companies" },
  { icon:"📊", label:"全平台洞察", id:"insights" },
  { icon:"📣", label:"系統公告",   id:"notice" },
  { icon:"⚙",  label:"平台設定",  id:"platform" },
];
const COMPANY_NAV = [
  { icon:"📍", label:"場館管理",   id:"venues" },
  { icon:"🚪", label:"教室管理",   id:"rooms" },
  { icon:"👥", label:"成員管理",   id:"team" },
  { icon:"📊", label:"公司洞察",   id:"insights" },
  { icon:"⚙",  label:"公司設定",  id:"settings" },
];

function Sidebar({ role, active, onSelect }) {
  const isSuper   = role === "super";
  const navItems  = isSuper ? SUPER_NAV : COMPANY_NAV;
  const accentBg  = isSuper ? T.lavs : T.rs;
  const accentFg  = isSuper ? T.lav  : T.rm;
  const accentDot = isSuper ? T.lav  : T.rose;

  return (
    <aside style={{ width:210, flexShrink:0, background:T.sb, borderRight:`1px solid ${T.bd}`, display:"flex", flexDirection:"column", height:"100%", position:"sticky", top:0, minHeight:"100vh" }}>
      {/* logo */}
      <div style={{ padding:"22px 16px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:16 }}>
          <div style={{ width:30, height:30, borderRadius:9, background:T.rose, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🌿</div>
          <span style={{ fontSize:15, fontWeight:500, color:T.ink, letterSpacing:".03em" }}>Cora Times</span>
        </div>
        {/* role chip */}
        <div style={{ background: accentBg, borderRadius:10, padding:"8px 11px", display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ fontSize:13 }}>{isSuper ? "🛡" : "🏢"}</span>
          <div>
            <div style={{ fontSize:11, color:accentFg, fontWeight:500 }}>{isSuper ? "Super Admin" : "S.T Pilates"}</div>
            <div style={{ fontSize:10, color:accentFg, opacity:.75 }}>{isSuper ? "系統管理員" : "Company Admin"}</div>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav style={{ flex:1, padding:"4px 8px" }}>
        <div style={{ fontSize:9, color:T.i3, padding:"0 8px", letterSpacing:".1em", marginBottom:5, textTransform:"uppercase" }}>
          {isSuper ? "系統管理" : "場館管理"}
        </div>
        {navItems.map(item => (
          <button key={item.id} onClick={() => onSelect(item.id)} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 9px 7px 12px", borderRadius:9, fontSize:12, color: active===item.id ? accentFg : T.i2, background: active===item.id ? accentBg : "none", width:"100%", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left", position:"relative", marginBottom:1, transition:"all .15s" }}>
            {active===item.id && <div style={{ position:"absolute", left:0, top:6, bottom:6, width:2.5, borderRadius:2, background:accentDot }} />}
            <span style={{ fontSize:14, width:18, textAlign:"center" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* user */}
      <div style={{ padding:"12px 8px", borderTop:`1px solid ${T.bd}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:9, cursor:"pointer" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:T.lavs, color:T.lav, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:500 }}>E</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:T.ink }}>Eddie</div>
            <div style={{ fontSize:10, color:T.i3 }}>{isSuper ? "系統管理員" : "創辦人"}</div>
          </div>
          <span style={{ fontSize:14, color:T.i3 }}>⋯</span>
        </div>
      </div>
    </aside>
  );
}

// ─── KPI bar ─────────────────────────────────────────────────
function KpiBar({ items }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${items.length},1fr)`, gap:10, marginBottom:20 }}>
      {items.map(k => (
        <div key={k.l} style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, padding:"14px 16px" }}>
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".07em", marginBottom:6 }}>{k.l}</div>
          <div style={{ fontSize: String(k.v).length > 7 ? 16 : 24, fontWeight:300, color:k.c||T.ink }}>{k.v}</div>
          {k.d && <div style={{ fontSize:11, marginTop:4, color:k.up===false ? T.coral : T.sm }}>{k.d}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Company table row ────────────────────────────────────────
function CompanyRow({ c, i, onToggle, onEnter }) {
  const acs = [[T.rs,T.rm],[T.ss,T.sm],[T.mists,T.mist],[T.lavs,T.lav],[T.ambs,T.amb]];
  const [bg,fg] = acs[i % acs.length];
  const planMeta = { pro:["Pro",T.lavs,T.lav], starter:["Starter",T.ambs,T.amb], enterprise:["Enterprise",T.ss,T.sm] };
  const [pLabel,pBg,pFg] = planMeta[c.plan] || planMeta.starter;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"2fr 1.1fr 60px 100px 90px 100px 140px", alignItems:"center", borderBottom:`1px solid ${T.bd}`, background:T.sf, transition:"background .12s" }}
      onMouseEnter={e=>e.currentTarget.style.background=T.bg}
      onMouseLeave={e=>e.currentTarget.style.background=T.sf}>
      <div style={{ padding:"11px 14px", display:"flex", alignItems:"center", gap:10 }}>
        <Avatar initials={c.name.slice(0,2).toUpperCase()} bg={bg} color={fg} size={34} radius={9} />
        <div>
          <div style={{ fontSize:13, color:T.ink, fontWeight:400 }}>{c.name}</div>
          <div style={{ fontSize:11, color:T.i3, marginTop:1 }}>manage.coratimes.com/{c.slug}</div>
        </div>
      </div>
      <div style={{ padding:"11px 12px", fontSize:12, color:T.ink }}>{c.admin}</div>
      <div style={{ padding:"11px 12px", fontSize:12, color:T.ink, textAlign:"center" }}>{c.venues}</div>
      <div style={{ padding:"11px 12px" }}><Tag bg={pBg} color={pFg}>{pLabel}</Tag></div>
      <div style={{ padding:"11px 12px" }}>
        <Tag bg={c.status==="active"?T.ss:T.corals} color={c.status==="active"?T.sm:T.coral}>
          {c.status==="active"?"營運中":"已停用"}
        </Tag>
      </div>
      <div style={{ padding:"11px 12px", fontSize:12, color:T.i2 }}>{c.since}</div>
      <div style={{ padding:"11px 12px", display:"flex", gap:5, flexWrap:"wrap" }}>
        <Btn sm onClick={onEnter}>進入</Btn>
        <Btn sm>編輯</Btn>
        <Btn sm v={c.status==="active"?"danger":"sage"} onClick={onToggle}>
          {c.status==="active"?"停用":"啟用"}
        </Btn>
      </div>
    </div>
  );
}

// ─── Root tree diagram ────────────────────────────────────────
function RootTree({ venues, rooms, selected, onSelect }) {
  return (
    <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, padding:18, marginBottom:20 }}>
      <div style={{ fontSize:12, fontWeight:500, color:T.ink, marginBottom:14, letterSpacing:".04em" }}>S.T Pilates 場館架構</div>
      <div style={{ display:"flex", alignItems:"flex-start", gap:0, overflowX:"auto" }}>
        {/* company root */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
          <div style={{ background:T.rs, border:`1.5px solid ${T.rose}`, borderRadius:12, padding:"10px 14px", textAlign:"center", minWidth:110 }}>
            <div style={{ fontSize:9, color:T.rm, letterSpacing:".08em", marginBottom:4 }}>公司</div>
            <div style={{ fontSize:13, color:T.rm, fontWeight:500 }}>S.T Pilates</div>
            <div style={{ fontSize:10, color:T.rm, opacity:.7, marginTop:2 }}>{venues.length} 間場館</div>
          </div>
        </div>

        {/* connector line */}
        <div style={{ display:"flex", alignItems:"center", flexShrink:0, marginTop:28 }}>
          <div style={{ width:24, height:1.5, background:T.rose, opacity:.4 }} />
        </div>

        {/* venues + rooms */}
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          {venues.map((v, vi) => (
            <div key={v.id} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              {/* venue node */}
              <div onClick={() => onSelect(selected?.id===v.id ? null : v)}
                style={{ background: selected?.id===v.id ? T.ss : T.sb, border:`1.5px solid ${selected?.id===v.id ? T.sage : T.bd2}`, borderRadius:12, padding:"9px 13px", textAlign:"center", minWidth:100, cursor:"pointer", transition:"all .2s" }}>
                <div style={{ fontSize:9, color:T.i3, letterSpacing:".07em", marginBottom:3 }}>場館 {vi+1}</div>
                <div style={{ fontSize:12, color:selected?.id===v.id?T.sm:T.ink, fontWeight:400 }}>{v.name}</div>
                <div style={{ fontSize:10, color:T.i3, marginTop:2 }}>{(rooms[v.id]||[]).length} 間教室</div>
              </div>
              {/* rooms row */}
              {selected?.id===v.id && (rooms[v.id]||[]).length > 0 && (
                <>
                  <div style={{ width:1.5, height:12, background:T.sage, opacity:.5 }} />
                  <div style={{ display:"flex", gap:5 }}>
                    {(rooms[v.id]||[]).map((r,ri) => (
                      <div key={r.id}>
                        {ri > 0 && <span style={{ display:"none" }} />}
                        <div style={{ background:T.sf, border:`1.5px solid ${r.color}20`, borderLeft:`3px solid ${r.color}`, borderRadius:8, padding:"6px 9px", fontSize:10, color:T.ink, whiteSpace:"nowrap", minWidth:72, textAlign:"center" }}>
                          <div style={{ fontWeight:500, color:r.color }}>{r.name}</div>
                          <div style={{ color:T.i3, marginTop:2 }}>{r.cap} 人</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Venue card ───────────────────────────────────────────────
function VenueCard({ v, rooms, selected, onSelect, onRoomModal }) {
  const isSelected = selected?.id === v.id;
  return (
    <div style={{ background:T.sf, border:`1px solid ${isSelected ? T.rose : T.bd}`, borderRadius:16, overflow:"hidden", transition:"border-color .2s", opacity:v.status==="inactive"?.8:1 }}>
      <div style={{ padding:"14px 15px 11px", borderBottom:`1px solid ${T.bd}` }}>
        <div style={{ marginBottom:7 }}>
          <Tag bg={v.status==="active"?T.ss:T.sb} color={v.status==="active"?T.sm:T.i3}>
            {v.status==="active"?"營運中":v.status==="inactive"?"籌備中":"暫停"}
          </Tag>
        </div>
        <div style={{ fontSize:14, color:T.ink, fontWeight:400, marginBottom:3 }}>{v.name}</div>
        <div style={{ fontSize:11, color:T.i3 }}>{v.addr}</div>
      </div>
      <div style={{ padding:"10px 15px" }}>
        {[["負責人",v.manager||"未指定",!v.manager],["教室數",`${(rooms[v.id]||[]).length} 間`,false],["本月場次",v.sessions,false],["在籍學員",v.students,false]].map(([l,val,muted])=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
            <span style={{ color:T.i3 }}>{l}</span>
            <span style={{ color:muted?T.i3:T.ink }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ padding:"8px 15px", borderTop:`1px solid ${T.bd}`, background:T.sb, display:"flex", gap:5 }}>
        <Btn sm v={isSelected?"sage":"ghost"} onClick={onSelect}>{isSelected?"收起":"教室管理"}</Btn>
        <Btn sm>編輯</Btn>
        <Btn sm>報表</Btn>
      </div>
    </div>
  );
}

// ─── Room card ────────────────────────────────────────────────
function RoomCard({ r, onRemove }) {
  return (
    <div style={{ background:T.bg, border:`1px solid ${T.bd}`, borderRadius:10, padding:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background:r.color, flexShrink:0 }} />
        <span style={{ fontSize:13, color:T.ink, fontWeight:400 }}>{r.name}</span>
      </div>
      {[["👥",`最多 ${r.cap} 人`],["🏋",r.equip],["🕐",r.hours]].map(([ic,txt])=>(
        <div key={ic} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.i2, marginBottom:4 }}>
          <span style={{ width:16, textAlign:"center" }}>{ic}</span>{txt}
        </div>
      ))}
      <div style={{ marginTop:10, paddingTop:8, borderTop:`1px solid ${T.bd}`, display:"flex", gap:5 }}>
        <Btn sm>編輯</Btn>
        <Btn sm v="danger" onClick={onRemove}>移除</Btn>
      </div>
    </div>
  );
}

// ─── SUPER ADMIN VIEW ─────────────────────────────────────────
const INIT_COMPANIES = [
  { id:1, name:"S.T Pilates", slug:"st-pilates", admin:"Eddie Wang",  venues:3, plan:"pro",        status:"active",    since:"2025/08/01" },
  { id:2, name:"Body Lab",    slug:"bodylab",    admin:"Mandy Lin",   venues:1, plan:"starter",    status:"active",    since:"2026/01/15" },
  { id:3, name:"Flow Studio", slug:"flow",       admin:"Karen Chen",  venues:2, plan:"pro",        status:"suspended", since:"2026/03/20" },
  { id:4, name:"Move Well",   slug:"movewell",   admin:"Jerry Huang", venues:1, plan:"enterprise", status:"active",    since:"2026/05/01" },
];

function SuperAdminView({ onEnterCompany }) {
  const [companies, setCompanies] = useState(INIT_COMPANIES);
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ name:"", slug:"", adminName:"", adminEmail:"", plan:"starter" });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  function addCompany() {
    if (!form.name) return;
    setCompanies(p=>[...p,{ id:Date.now(), name:form.name, slug:form.slug||form.name.toLowerCase().replace(/\s/g,"-"), admin:form.adminName, venues:0, plan:form.plan, status:"active", since:new Date().toLocaleDateString("zh-TW") }]);
    setModal(false);
    setForm({ name:"", slug:"", adminName:"", adminEmail:"", plan:"starter" });
  }

  return (
    <div style={{ flex:1, overflowY:"auto" }}>
      {/* topbar */}
      <div style={{ height:54, padding:"0 22px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${T.bd}`, background:T.sf, position:"sticky", top:0, zIndex:10 }}>
        <span style={{ fontSize:15, fontWeight:300, color:T.ink, letterSpacing:".06em", flex:1 }}>公司管理</span>
        <Tag bg={T.lavs} color={T.lav}>🛡 Super Admin</Tag>
        <div style={{ width:1, height:20, background:T.bd }} />
        <Btn>匯出</Btn>
        <Btn v="primary" onClick={()=>setModal(true)}>＋ 新增公司</Btn>
      </div>

      <div style={{ padding:22 }}>
        <KpiBar items={[
          { l:"公司總數",   v:companies.length,                           d:`↑ ${companies.filter(c=>c.since>="2026").length} 今年新增` },
          { l:"場館總數",   v:companies.reduce((a,c)=>a+c.venues,0),      d:"跨所有公司" },
          { l:"活躍學員",   v:"142",                                       d:"↑ 12 本月" },
          { l:"月訂閱收入", v:"$28,500",                                   d:"平台收入" },
        ]} />

        {/* table */}
        <div style={{ border:`1px solid ${T.bd}`, borderRadius:16, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1.1fr 60px 100px 90px 100px 140px", background:T.sb, borderBottom:`1px solid ${T.bd}` }}>
            {["公司","Company Admin","場館","訂閱方案","狀態","建立日期","操作"].map(h=>(
              <div key={h} style={{ padding:"8px 14px", fontSize:10, color:T.i3, fontWeight:500, letterSpacing:".05em" }}>{h}</div>
            ))}
          </div>
          {companies.map((c,i)=>(
            <CompanyRow key={c.id} c={c} i={i}
              onToggle={()=>setCompanies(p=>p.map(x=>x.id!==c.id?x:{...x,status:x.status==="active"?"suspended":"active"}))}
              onEnter={()=>onEnterCompany(c)}
            />
          ))}
        </div>
      </div>

      <Modal open={modal} title="新增公司" onClose={()=>setModal(false)}
        footer={[<Btn key="c" onClick={()=>setModal(false)}>取消</Btn>,<Btn key="ok" v="primary" onClick={addCompany}>建立並發送邀請</Btn>]}>
        <Field label="公司名稱"><input style={inp} value={form.name} onChange={e=>f("name",e.target.value)} placeholder="例：Body Craft Studio" /></Field>
        <Field label="公司代碼（管理網址：manage.coratimes.com/xxx）"><input style={inp} value={form.slug} onChange={e=>f("slug",e.target.value)} placeholder="bodycraft" /></Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Admin 姓名"><input style={inp} value={form.adminName} onChange={e=>f("adminName",e.target.value)} placeholder="姓名" /></Field>
          <Field label="Admin Email"><input style={inp} value={form.adminEmail} onChange={e=>f("adminEmail",e.target.value)} placeholder="admin@..." type="email" /></Field>
        </div>
        <Field label="訂閱方案">
          <select style={sel} value={form.plan} onChange={e=>f("plan",e.target.value)}>
            <option value="starter">Starter — 1 間場館</option>
            <option value="pro">Pro — 最多 5 間場館</option>
            <option value="enterprise">Enterprise — 無限場館</option>
          </select>
        </Field>
        <div style={{ background:T.bg, border:`1px solid ${T.bd}`, borderRadius:10, padding:"10px 13px", fontSize:11, color:T.i3, marginTop:4 }}>
          ✉ 建立後系統將自動發送設定邀請 Email 給 Company Admin
        </div>
      </Modal>
    </div>
  );
}

// ─── COMPANY ADMIN VIEW ───────────────────────────────────────
const INIT_VENUES = [
  { id:1, name:"信義旗艦店", addr:"台北市信義區松仁路 100 號",      manager:"Sammi", sessions:186, students:24, status:"active"   },
  { id:2, name:"大安分館",   addr:"台北市大安區敦化南路一段 120 號", manager:"Annie", sessions:94,  students:11, status:"active"   },
  { id:3, name:"天母分館",   addr:"台北市士林區中山北路六段 16 號",  manager:"",      sessions:0,   students:0,  status:"inactive" },
];
const INIT_ROOMS = {
  1:[ { id:1, name:"靜心室", cap:2, equip:"Reformer × 2",      hours:"全天",        color:T.rose },
      { id:2, name:"舒活室", cap:4, equip:"墊子 × 4、瑜珈磚",  hours:"全天",        color:T.sage },
      { id:3, name:"律動室", cap:6, equip:"音響、鏡牆",         hours:"08:00–21:00", color:T.lav  } ],
  2:[ { id:4, name:"暖身室", cap:2, equip:"Reformer × 2",      hours:"全天",        color:T.rose },
      { id:5, name:"共練室", cap:4, equip:"墊子 × 4",          hours:"09:00–20:00", color:T.sage } ],
  3:[ { id:6, name:"療癒室", cap:1, equip:"Reformer × 1",      hours:"10:00–19:00", color:T.amb  } ],
};
const COLOR_OPTIONS = [T.rose, T.sage, T.lav, T.amb, T.mist, "#8FA4AE"];

function CompanyAdminView({ company }) {
  const [venues, setVenues]   = useState(INIT_VENUES);
  const [rooms,  setRooms]    = useState(INIT_ROOMS);
  const [selV,   setSelV]     = useState(null);
  const [vModal, setVModal]   = useState(false);
  const [rModal, setRModal]   = useState(false);
  const [nVenue, setNVenue]   = useState({ name:"", addr:"", manager:"", slug:"" });
  const [nRoom,  setNRoom]    = useState({ name:"", cap:"", equip:"", hours:"全天 06:00–22:00", color:T.rose });
  const fv = (k,v)=>setNVenue(p=>({...p,[k]:v}));
  const fr = (k,v)=>setNRoom(p=>({...p,[k]:v}));

  function addVenue() {
    if (!nVenue.name) return;
    const id = Date.now();
    setVenues(p=>[...p,{ id, name:nVenue.name, addr:nVenue.addr, manager:nVenue.manager, sessions:0, students:0, status:"inactive" }]);
    setRooms(p=>({...p,[id]:[]}));
    setVModal(false); setNVenue({ name:"", addr:"", manager:"", slug:"" });
  }
  function addRoom() {
    if (!nRoom.name || !selV) return;
    const room = { id:Date.now(), ...nRoom, cap:parseInt(nRoom.cap)||1 };
    setRooms(p=>({...p,[selV.id]:[...(p[selV.id]||[]),room]}));
    setRModal(false); setNRoom({ name:"", cap:"", equip:"", hours:"全天 06:00–22:00", color:T.rose });
  }
  function removeRoom(vId, rId) { setRooms(p=>({...p,[vId]:p[vId].filter(r=>r.id!==rId)})); }

  return (
    <div style={{ flex:1, overflowY:"auto" }}>
      <div style={{ height:54, padding:"0 22px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${T.bd}`, background:T.sf, position:"sticky", top:0, zIndex:10 }}>
        <span style={{ fontSize:15, fontWeight:300, color:T.ink, letterSpacing:".06em", flex:1 }}>場館管理</span>
        <Tag bg={T.rs} color={T.rm}>🏢 {company?.name || "S.T Pilates"} · Company Admin</Tag>
        <div style={{ width:1, height:20, background:T.bd }} />
        <Btn v="primary" onClick={()=>setVModal(true)}>＋ 新增場館</Btn>
      </div>

      <div style={{ padding:22 }}>
        <KpiBar items={[
          { l:"場館數",   v:venues.length,                                  d:"間" },
          { l:"教室總數", v:Object.values(rooms).flat().length,              d:"間" },
          { l:"本月場次", v:venues.reduce((a,v)=>a+v.sessions,0),           d:"場" },
          { l:"在籍學員", v:venues.reduce((a,v)=>a+v.students,0),           d:"位" },
        ]} />

        {/* root tree */}
        <RootTree venues={venues} rooms={rooms} selected={selV} onSelect={v=>setSelV(selV?.id===v?.id?null:v)} />

        {/* venue cards */}
        <div style={{ fontSize:13, color:T.ink, letterSpacing:".04em", marginBottom:10 }}>場館列表</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:10, marginBottom:20 }}>
          {venues.map(v=>(
            <VenueCard key={v.id} v={v} rooms={rooms} selected={selV}
              onSelect={()=>setSelV(selV?.id===v.id?null:v)}
              onRoomModal={()=>{ setSelV(v); setRModal(true); }} />
          ))}
          <div onClick={()=>setVModal(true)} style={{ background:T.sf, border:`1px dashed ${T.bd2}`, borderRadius:16, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:190, cursor:"pointer", gap:7, color:T.i3, fontSize:12 }}>
            <span style={{ fontSize:22 }}>＋</span>新增場館
          </div>
        </div>

        {/* rooms panel */}
        {selV && (
          <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, padding:18 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <span style={{ fontSize:13, fontWeight:500, color:T.ink }}>📍 {selV.name} — 教室管理</span>
              <Btn v="primary" onClick={()=>setRModal(true)}>＋ 新增教室</Btn>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:8 }}>
              {(rooms[selV.id]||[]).map(r=>(
                <RoomCard key={r.id} r={r} onRemove={()=>removeRoom(selV.id,r.id)} />
              ))}
              <div onClick={()=>setRModal(true)} style={{ background:T.bg, border:`1px dashed ${T.bd2}`, borderRadius:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:130, cursor:"pointer", gap:6, color:T.i3, fontSize:12 }}>
                <span style={{ fontSize:20 }}>＋</span>新增教室
              </div>
            </div>
          </div>
        )}
      </div>

      {/* venue modal */}
      <Modal open={vModal} title="新增場館" onClose={()=>setVModal(false)}
        footer={[<Btn key="c" onClick={()=>setVModal(false)}>取消</Btn>,<Btn key="ok" v="primary" onClick={addVenue}>儲存場館</Btn>]}>
        <Field label="場館名稱"><input style={inp} value={nVenue.name} onChange={e=>fv("name",e.target.value)} placeholder="例：大安分館" /></Field>
        <Field label="地址"><input style={inp} value={nVenue.addr} onChange={e=>fv("addr",e.target.value)} placeholder="完整地址" /></Field>
        <Field label="聯絡電話"><input style={inp} placeholder="02-XXXX-XXXX" /></Field>
        <Field label="負責人（教練）">
          <select style={sel} value={nVenue.manager} onChange={e=>fv("manager",e.target.value)}>
            <option value="">未指定</option><option>Sammi</option><option>Annie</option>
          </select>
        </Field>
        <Field label="預約頁代碼（app.coratimes.com/book/xxx）"><input style={inp} value={nVenue.slug} onChange={e=>fv("slug",e.target.value)} placeholder="daan" /></Field>
      </Modal>

      {/* room modal */}
      <Modal open={rModal} title={`新增教室${selV ? ` — ${selV.name}` : ""}`} onClose={()=>setRModal(false)}
        footer={[<Btn key="c" onClick={()=>setRModal(false)}>取消</Btn>,<Btn key="ok" v="primary" onClick={addRoom}>新增教室</Btn>]}>
        <Field label="教室名稱"><input style={inp} value={nRoom.name} onChange={e=>fr("name",e.target.value)} placeholder="例：靜心室 B" /></Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="容納人數"><input style={inp} type="number" min="1" value={nRoom.cap} onChange={e=>fr("cap",e.target.value)} placeholder="人數" /></Field>
          <Field label="開放時段">
            <select style={sel} value={nRoom.hours} onChange={e=>fr("hours",e.target.value)}>
              <option>全天 06:00–22:00</option><option>上午 06:00–12:00</option><option>下午 12:00–18:00</option><option>自訂</option>
            </select>
          </Field>
        </div>
        <Field label="設備 / 特色"><input style={inp} value={nRoom.equip} onChange={e=>fr("equip",e.target.value)} placeholder="例：Reformer × 2、鏡牆" /></Field>
        <Field label="顏色標示">
          <div style={{ display:"flex", gap:8, marginTop:6 }}>
            {COLOR_OPTIONS.map(c=>(
              <div key={c} onClick={()=>fr("color",c)} style={{ width:22, height:22, borderRadius:"50%", background:c, cursor:"pointer", border: nRoom.color===c ? `3px solid ${T.ink}` : `3px solid transparent`, transition:"border .15s" }} />
            ))}
          </div>
        </Field>
      </Modal>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [role,     setRole]     = useState("super");   // "super" | "company"
  const [navItem,  setNavItem]  = useState("companies");
  const [company,  setCompany]  = useState(null);

  function enterCompany(c) {
    setCompany(c);
    setRole("company");
    setNavItem("venues");
  }

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:T.bg, fontFamily:"'Noto Sans TC', sans-serif" }}>
      <Sidebar role={role} active={navItem} onSelect={id => {
        setNavItem(id);
        if (id === "companies" && role === "company") { setRole("super"); }
      }} />
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
        {/* role switcher bar */}
        <div style={{ padding:"10px 22px 0", display:"flex", alignItems:"center", gap:8, background:T.bg }}>
          <div style={{ display:"flex", gap:3, background:T.sb, borderRadius:20, padding:3 }}>
            {[["super","🛡 Super Admin"],["company","🏢 Company Admin"]].map(([r,label])=>(
              <button key={r} onClick={()=>{ setRole(r); setNavItem(r==="super"?"companies":"venues"); }} style={{ padding:"4px 14px", borderRadius:18, fontSize:11, color:role===r?T.ink:T.i3, background:role===r?T.sf:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontWeight:role===r?500:400, transition:"all .15s" }}>{label}</button>
            ))}
          </div>
          <span style={{ fontSize:11, color:T.i3 }}>← 切換檢視角色（實際產品依登入角色自動判斷）</span>
        </div>

        {role === "super"   && <SuperAdminView onEnterCompany={enterCompany} />}
        {role === "company" && <CompanyAdminView company={company} />}
      </div>
    </div>
  );
}
