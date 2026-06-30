import { useNavigate } from "react-router-dom";

import { useState } from "react";

// ── styles injected inline via className strings ──────────────
const S = {
  wrap:     { background:"#FAF8F5", minHeight:"100vh", fontFamily:"'Noto Sans TC', sans-serif" },
  pageTabs: { display:"flex", gap:4, marginBottom:16, background:"#F0EBE3", borderRadius:20, padding:3, width:"fit-content" },
};

// colour tokens
const T = {
  bg:"#FAF8F5", sb:"#F0EBE3", sf:"#fff", sand2:"#E8E0D6", sand3:"#D6CCC0",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  sage:"#7A9E8E", ss:"#EAF2EF", sm:"#5C7D6F",
  ink:"#3A3530", i2:"#6E6358", i3:"#A89E94",
  bd:"#EAE4DC", bd2:"#D6CCC0",
  amb:"#B8924A", ambs:"#F5EDD8",
  lav:"#9B8FAE", lavs:"#F0EDF5",
  mist:"#8A9BAE", mists:"#EEF2F6",
  coral:"#C4726A", corals:"#F9EDEC",
};

// ── tiny reusable pieces ──────────────────────────────────────
function Btn({ children, variant="ghost", onClick, size="md" }) {
  const base = { border:`1px solid ${T.bd2}`, background:"none", padding: size==="sm" ? "3px 10px" : "5px 13px", borderRadius:20, fontSize: size==="sm" ? 11 : 12, color:T.i2, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap" };
  const variants = {
    ghost: {},
    primary: { background:T.rose, borderColor:T.rose, color:"#fff" },
    danger:  { borderColor:T.corals, color:T.coral },
    sage:    { background:T.sage, borderColor:T.sage, color:"#fff" },
  };
  return <button style={{...base,...variants[variant]}} onClick={onClick}>{children}</button>;
}

function Badge({ children, variant="active" }) {
  const styles = {
    active:    { background:T.ss,    color:T.sm    },
    suspended: { background:T.corals,color:T.coral },
    inactive:  { background:T.sb,    color:T.i3    },
    pro:       { background:T.lavs,  color:T.lav   },
    starter:   { background:T.ambs,  color:T.amb   },
    company:   { background:T.rs,    color:T.rm    },
  };
  const s = styles[variant] || styles.active;
  return <span style={{ fontSize:10, padding:"2px 9px", borderRadius:12, fontWeight:500, display:"inline-block", ...s }}>{children}</span>;
}

function KpiRow({ items }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${items.length},1fr)`, gap:9, marginBottom:18 }}>
      {items.map(k => (
        <div key={k.l} style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, padding:"14px 16px" }}>
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".07em", marginBottom:5 }}>{k.l}</div>
          <div style={{ fontSize: typeof k.v === "string" && k.v.length > 6 ? 16 : 24, fontWeight:300, color: k.accent || T.ink }}>{k.v}</div>
          {k.d && <div style={{ fontSize:11, color:T.sm, marginTop:4 }}>{k.d}</div>}
        </div>
      ))}
    </div>
  );
}

function Topbar({ title, chip, chipVariant="ghost", children }) {
  return (
    <div style={{ height:52, padding:"0 20px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${T.bd}`, background:T.sf, marginBottom:20, flexShrink:0 }}>
      <span style={{ fontSize:15, fontWeight:300, color:T.ink, letterSpacing:".06em", flex:1 }}>{title}</span>
      {chip && <span style={{ fontSize:10, padding:"3px 10px", borderRadius:12, background:T.rs, color:T.rm, fontWeight:500 }}>{chip}</span>}
      <div style={{ width:1, height:18, background:T.bd }} />
      {children}
    </div>
  );
}

function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, background:"rgba(58,53,48,.3)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, backdropFilter:"blur(2px)" }}>
      <div style={{ background:T.sf, borderRadius:16, padding:20, width:420, maxWidth:"90vw", border:`1px solid ${T.bd}` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <span style={{ fontSize:14, fontWeight:500, color:T.ink }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:18, color:T.i3, cursor:"pointer" }}>✕</button>
        </div>
        {children}
        {footer && <div style={{ display:"flex", justifyContent:"flex-end", gap:7, marginTop:16, paddingTop:13, borderTop:`1px solid ${T.bd}` }}>{footer}</div>}
      </div>
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ fontSize:11, color:T.i3, marginBottom:4, letterSpacing:".04em", display:"block" }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = { width:"100%", border:"none", borderBottom:`1px solid ${T.bd2}`, padding:"6px 0", fontSize:13, color:T.ink, background:"none", outline:"none", fontFamily:"inherit" };
const selectStyle = { width:"100%", border:`1px solid ${T.bd2}`, borderRadius:8, padding:"7px 10px", fontSize:13, color:T.ink, background:T.sf, outline:"none", fontFamily:"inherit" };

// ── ROOMS data ────────────────────────────────────────────────
const ROOMS_DATA = {
  1: [
    { id:1, name:"靜心室", cap:2, equip:"Reformer × 2",   hours:"全天",        color:T.rose },
    { id:2, name:"舒活室", cap:4, equip:"墊子 × 4、瑜珈磚", hours:"全天",        color:T.sage },
    { id:3, name:"律動室", cap:6, equip:"音響、鏡牆",      hours:"08:00–21:00", color:T.lav  },
  ],
  2: [
    { id:4, name:"暖身室", cap:2, equip:"Reformer × 2",   hours:"全天",        color:T.rose },
    { id:5, name:"共練室", cap:4, equip:"墊子 × 4",       hours:"09:00–20:00", color:T.sage },
  ],
  3: [
    { id:6, name:"療癒室", cap:1, equip:"Reformer × 1",   hours:"10:00–19:00", color:T.amb  },
  ],
};

// ═══════════════════════════════════════════════════════════════
// SUPER ADMIN PAGE
// ═══════════════════════════════════════════════════════════════
function SuperAdminPage() {
  const [companies, setCompanies] = useState([
    { id:1, name:"S.T Pilates", slug:"st-pilates", admin:"Eddie Wang",  venues:3, plan:"pro",     status:"active",    since:"2025/08/01" },
    { id:2, name:"Body Lab",    slug:"bodylab",    admin:"Mandy Lin",   venues:1, plan:"starter",  status:"active",    since:"2026/01/15" },
    { id:3, name:"Flow Studio", slug:"flow",       admin:"Karen Chen",  venues:2, plan:"pro",     status:"suspended", since:"2026/03/20" },
  ]);
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ name:"", slug:"", adminName:"", adminEmail:"", plan:"starter" });

  function toggleStatus(id) {
    setCompanies(prev => prev.map(c => c.id !== id ? c : { ...c, status: c.status === "active" ? "suspended" : "active" }));
  }
  function addCompany() {
    if (!form.name) return;
    setCompanies(prev => [...prev, { id: Date.now(), name:form.name, slug:form.slug, admin:form.adminName, venues:0, plan:form.plan, status:"active", since:new Date().toLocaleDateString("zh-TW") }]);
    setModal(false);
    setForm({ name:"", slug:"", adminName:"", adminEmail:"", plan:"starter" });
  }

  const avatarColors = [
    [T.rs, T.rm], [T.ss, T.sm], [T.mists, T.mist], [T.lavs, T.lav], [T.ambs, T.amb],
  ];

  return (
    <div style={{ padding:"0 0 24px" }}>
      <Topbar title="公司管理" chip="🛡 Super Admin">
        <Btn>匯出</Btn>
        <Btn variant="primary" onClick={() => setModal(true)}>＋ 新增公司</Btn>
      </Topbar>

      <div style={{ padding:"0 20px" }}>
        <KpiRow items={[
          { l:"公司總數",   v: companies.length,                             d:"↑ 1 本月新增" },
          { l:"場館總數",   v: companies.reduce((a,c)=>a+c.venues,0),        d:"跨所有公司" },
          { l:"活躍學員",   v:142,                                            d:"↑ 12 本月" },
          { l:"月訂閱收入", v:"$28,500",                                      d:"平台收入" },
        ]} />

        <div style={{ border:`1px solid ${T.bd}`, borderRadius:16, overflow:"hidden" }}>
          {/* header */}
          <div style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 60px 90px 80px 90px 130px", background:T.sb, borderBottom:`1px solid ${T.bd}` }}>
            {["公司","Company Admin","場館","訂閱方案","狀態","建立日期","操作"].map(h => (
              <div key={h} style={{ padding:"8px 12px", fontSize:10, color:T.i3, fontWeight:500, letterSpacing:".05em" }}>{h}</div>
            ))}
          </div>
          {companies.map((c, i) => {
            const [abg, afc] = avatarColors[i % avatarColors.length];
            return (
              <div key={c.id} style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 60px 90px 80px 90px 130px", borderBottom: i < companies.length-1 ? `1px solid ${T.bd}` : "none", background:T.sf, alignItems:"center" }}>
                <div style={{ padding:"10px 12px", display:"flex", alignItems:"center", gap:9 }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:abg, color:afc, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:500, flexShrink:0 }}>{c.name.slice(0,2).toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize:13, color:T.ink }}>{c.name}</div>
                    <div style={{ fontSize:11, color:T.i3 }}>manage.coratimes.com/{c.slug}</div>
                  </div>
                </div>
                <div style={{ padding:"10px 12px", fontSize:12, color:T.ink }}>{c.admin}</div>
                <div style={{ padding:"10px 12px", fontSize:12, color:T.ink, textAlign:"center" }}>{c.venues}</div>
                <div style={{ padding:"10px 12px" }}><Badge variant={c.plan}>{c.plan === "pro" ? "Pro" : "Starter"}</Badge></div>
                <div style={{ padding:"10px 12px" }}><Badge variant={c.status}>{c.status === "active" ? "營運中" : "已停用"}</Badge></div>
                <div style={{ padding:"10px 12px", fontSize:12, color:T.i2 }}>{c.since}</div>
                <div style={{ padding:"10px 12px", display:"flex", gap:4 }}>
                  <Btn size="sm">進入</Btn>
                  <Btn size="sm">編輯</Btn>
                  <Btn size="sm" variant={c.status === "active" ? "danger" : "sage"} onClick={() => toggleStatus(c.id)}>
                    {c.status === "active" ? "停用" : "啟用"}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={modal} title="新增公司" onClose={() => setModal(false)}
        footer={[
          <Btn key="cancel" onClick={() => setModal(false)}>取消</Btn>,
          <Btn key="ok" variant="primary" onClick={addCompany}>建立並發送邀請</Btn>,
        ]}>
        <FormGroup label="公司名稱"><input style={inputStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="輸入公司名稱" /></FormGroup>
        <FormGroup label="公司代碼（管理網址：manage.coratimes.com/xxx）"><input style={inputStyle} value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="example" /></FormGroup>
        <FormGroup label="Company Admin 姓名"><input style={inputStyle} value={form.adminName} onChange={e=>setForm({...form,adminName:e.target.value})} placeholder="管理員姓名" /></FormGroup>
        <FormGroup label="Company Admin Email"><input style={inputStyle} value={form.adminEmail} onChange={e=>setForm({...form,adminEmail:e.target.value})} placeholder="admin@company.com" type="email" /></FormGroup>
        <FormGroup label="訂閱方案">
          <select style={selectStyle} value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})}>
            <option value="starter">Starter（1 場館）</option>
            <option value="pro">Pro（5 場館）</option>
            <option value="enterprise">Enterprise（無限）</option>
          </select>
        </FormGroup>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPANY ADMIN PAGE
// ═══════════════════════════════════════════════════════════════
function CompanyAdminPage() {
  const [venues, setVenues] = useState([
    { id:1, name:"信義旗艦店", addr:"台北市信義區松仁路 100 號", manager:"Sammi", sessions:186, students:24, status:"active"   },
    { id:2, name:"大安分館",   addr:"台北市大安區敦化南路一段 120 號", manager:"Annie", sessions:94, students:11, status:"active" },
    { id:3, name:"天母分館",   addr:"台北市士林區中山北路六段 16 號", manager:"", sessions:0, students:0, status:"inactive" },
  ]);
  const [selectedVenue, setSelectedVenue]   = useState(null);
  const [venueModal, setVenueModal]         = useState(false);
  const [roomModal, setRoomModal]           = useState(false);
  const [rooms, setRooms]                   = useState(ROOMS_DATA);
  const [newVenue, setNewVenue]             = useState({ name:"", addr:"", manager:"", slug:"" });
  const [newRoom, setNewRoom]               = useState({ name:"", cap:"", equip:"", hours:"全天", color:T.rose });

  function addVenue() {
    if (!newVenue.name) return;
    const id = Date.now();
    setVenues(prev => [...prev, { id, name:newVenue.name, addr:newVenue.addr, manager:newVenue.manager, sessions:0, students:0, status:"inactive" }]);
    setRooms(prev => ({ ...prev, [id]: [] }));
    setVenueModal(false);
    setNewVenue({ name:"", addr:"", manager:"", slug:"" });
  }
  function addRoom() {
    if (!newRoom.name || !selectedVenue) return;
    const room = { id: Date.now(), ...newRoom, cap: parseInt(newRoom.cap) || 1 };
    setRooms(prev => ({ ...prev, [selectedVenue.id]: [...(prev[selectedVenue.id] || []), room] }));
    setRoomModal(false);
    setNewRoom({ name:"", cap:"", equip:"", hours:"全天", color:T.rose });
  }
  function removeRoom(venueId, roomId) {
    setRooms(prev => ({ ...prev, [venueId]: prev[venueId].filter(r => r.id !== roomId) }));
  }

  const colorOptions = [T.rose, T.sage, T.lav, T.amb, T.mist];

  return (
    <div style={{ padding:"0 0 24px" }}>
      <Topbar title="場館管理" chip="S.T Pilates · Company Admin">
        <Btn variant="primary" onClick={() => setVenueModal(true)}>＋ 新增場館</Btn>
      </Topbar>

      <div style={{ padding:"0 20px" }}>
        {/* mini arch */}
        <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, padding:16, marginBottom:18 }}>
          <div style={{ fontSize:12, fontWeight:500, color:T.ink, marginBottom:12 }}>S.T Pilates 場館架構</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, overflowX:"auto", paddingBottom:4 }}>
            <div style={{ background:T.rs, border:`1px solid ${T.rose}`, borderRadius:10, padding:"8px 13px", textAlign:"center", flexShrink:0 }}>
              <div style={{ fontSize:9, color:T.rm, letterSpacing:".07em", marginBottom:3 }}>公司</div>
              <div style={{ fontSize:12, color:T.rm, fontWeight:400 }}>S.T Pilates</div>
              <div style={{ fontSize:10, color:T.rm, marginTop:2 }}>{venues.length} 間場館</div>
            </div>
            {venues.map((v, i) => (
              <div key={v.id} style={{ display:"contents" }}>
                <span style={{ fontSize:16, color:T.sand3, flexShrink:0 }}>→</span>
                <div onClick={() => setSelectedVenue(v)} style={{ background: selectedVenue?.id === v.id ? T.ss : T.sb, border:`1px solid ${selectedVenue?.id === v.id ? T.sage : T.bd2}`, borderRadius:10, padding:"8px 13px", textAlign:"center", flexShrink:0, cursor:"pointer", transition:"all .15s" }}>
                  <div style={{ fontSize:9, color:T.i3, letterSpacing:".07em", marginBottom:3 }}>場館 {i+1}</div>
                  <div style={{ fontSize:12, color: selectedVenue?.id === v.id ? T.sm : T.ink, fontWeight:400 }}>{v.name}</div>
                  <div style={{ fontSize:10, color:T.i3, marginTop:2 }}>{(rooms[v.id]||[]).length} 間教室</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* venue cards */}
        <div style={{ fontSize:13, fontWeight:400, color:T.ink, letterSpacing:".04em", marginBottom:10 }}>場館列表</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10, marginBottom:20 }}>
          {venues.map(v => (
            <div key={v.id} style={{ background:T.sf, border:`1px solid ${selectedVenue?.id===v.id ? T.rose : T.bd}`, borderRadius:16, overflow:"hidden", opacity: v.status==="inactive" ? .75 : 1 }}>
              <div style={{ padding:"14px 14px 10px", borderBottom:`1px solid ${T.bd}` }}>
                <div style={{ marginBottom:6 }}><Badge variant={v.status==="active" ? "active" : "inactive"}>{v.status==="active" ? "營運中" : "籌備中"}</Badge></div>
                <div style={{ fontSize:14, color:T.ink, marginBottom:3 }}>{v.name}</div>
                <div style={{ fontSize:11, color:T.i3 }}>{v.addr}</div>
              </div>
              <div style={{ padding:"10px 14px", display:"flex", flexDirection:"column", gap:6 }}>
                {[["負責人", v.manager || "未指定"], ["教室數", `${(rooms[v.id]||[]).length} 間`], ["本月場次", v.sessions], ["在籍學員", v.students]].map(([l,val])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                    <span style={{ color:T.i3 }}>{l}</span>
                    <span style={{ color: l==="負責人" && !v.manager ? T.i3 : T.ink }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding:"8px 14px", borderTop:`1px solid ${T.bd}`, background:T.sb, display:"flex", gap:5 }}>
                <Btn size="sm" variant={selectedVenue?.id===v.id ? "sage" : "ghost"} onClick={() => setSelectedVenue(selectedVenue?.id===v.id ? null : v)}>
                  {selectedVenue?.id===v.id ? "收起教室" : "教室管理"}
                </Btn>
                <Btn size="sm">編輯</Btn>
                <Btn size="sm">報表</Btn>
              </div>
            </div>
          ))}
          <div onClick={() => setVenueModal(true)} style={{ background:T.sf, border:`1px dashed ${T.bd2}`, borderRadius:16, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:180, cursor:"pointer", gap:7, color:T.i3, fontSize:12 }}>
            <span style={{ fontSize:22 }}>＋</span>新增場館
          </div>
        </div>

        {/* rooms panel */}
        {selectedVenue && (
          <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, padding:16 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:13, fontWeight:400, color:T.ink }}>
                📍 {selectedVenue.name} — 教室管理
              </span>
              <Btn variant="primary" onClick={() => setRoomModal(true)}>＋ 新增教室</Btn>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8 }}>
              {(rooms[selectedVenue.id] || []).map(room => (
                <div key={room.id} style={{ background:T.bg, border:`1px solid ${T.bd}`, borderRadius:10, padding:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:room.color, flexShrink:0 }} />
                    <span style={{ fontSize:13, color:T.ink }}>{room.name}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    {[["👥", `最多 ${room.cap} 人`], ["🏋", room.equip], ["🕐", room.hours]].map(([ic,txt])=>(
                      <div key={ic} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.i2 }}>
                        <span style={{ width:16, textAlign:"center" }}>{ic}</span>{txt}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:8, paddingTop:8, borderTop:`1px solid ${T.bd}`, display:"flex", gap:4 }}>
                    <Btn size="sm">編輯</Btn>
                    <Btn size="sm" variant="danger" onClick={() => removeRoom(selectedVenue.id, room.id)}>移除</Btn>
                  </div>
                </div>
              ))}
              <div onClick={() => setRoomModal(true)} style={{ background:T.bg, border:`1px dashed ${T.bd2}`, borderRadius:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:130, cursor:"pointer", gap:6, color:T.i3, fontSize:12 }}>
                <span style={{ fontSize:20 }}>＋</span>新增教室
              </div>
            </div>
          </div>
        )}
      </div>

      {/* venue modal */}
      <Modal open={venueModal} title="新增場館" onClose={() => setVenueModal(false)}
        footer={[
          <Btn key="c" onClick={() => setVenueModal(false)}>取消</Btn>,
          <Btn key="ok" variant="primary" onClick={addVenue}>儲存場館</Btn>,
        ]}>
        <FormGroup label="場館名稱"><input style={inputStyle} value={newVenue.name} onChange={e=>setNewVenue({...newVenue,name:e.target.value})} placeholder="例：大安分館" /></FormGroup>
        <FormGroup label="地址"><input style={inputStyle} value={newVenue.addr} onChange={e=>setNewVenue({...newVenue,addr:e.target.value})} placeholder="完整地址" /></FormGroup>
        <FormGroup label="負責人（教練）">
          <select style={selectStyle} value={newVenue.manager} onChange={e=>setNewVenue({...newVenue,manager:e.target.value})}>
            <option value="">未指定</option><option>Sammi</option><option>Annie</option>
          </select>
        </FormGroup>
        <FormGroup label="預約頁代碼"><input style={inputStyle} value={newVenue.slug} onChange={e=>setNewVenue({...newVenue,slug:e.target.value})} placeholder="daan（app.coratimes.com/book/daan）" /></FormGroup>
      </Modal>

      {/* room modal */}
      <Modal open={roomModal} title={`新增教室 — ${selectedVenue?.name || ""}`} onClose={() => setRoomModal(false)}
        footer={[
          <Btn key="c" onClick={() => setRoomModal(false)}>取消</Btn>,
          <Btn key="ok" variant="primary" onClick={addRoom}>新增教室</Btn>,
        ]}>
        <FormGroup label="教室名稱"><input style={inputStyle} value={newRoom.name} onChange={e=>setNewRoom({...newRoom,name:e.target.value})} placeholder="例：靜心室 B" /></FormGroup>
        <FormGroup label="容納人數"><input style={inputStyle} type="number" min="1" value={newRoom.cap} onChange={e=>setNewRoom({...newRoom,cap:e.target.value})} placeholder="最大人數" /></FormGroup>
        <FormGroup label="設備 / 特色"><input style={inputStyle} value={newRoom.equip} onChange={e=>setNewRoom({...newRoom,equip:e.target.value})} placeholder="例：Reformer × 2、鏡牆" /></FormGroup>
        <FormGroup label="開放時段">
          <select style={selectStyle} value={newRoom.hours} onChange={e=>setNewRoom({...newRoom,hours:e.target.value})}>
            <option>全天 06:00–22:00</option><option>上午 06:00–12:00</option><option>下午 12:00–18:00</option>
          </select>
        </FormGroup>
        <FormGroup label="顏色標示">
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            {colorOptions.map(c => (
              <div key={c} onClick={() => setNewRoom({...newRoom,color:c})} style={{ width:22, height:22, borderRadius:"50%", background:c, cursor:"pointer", border: newRoom.color===c ? `3px solid ${T.ink}` : `3px solid transparent`, transition:"border .15s" }} />
            ))}
          </div>
        </FormGroup>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function CORASaaSAdmin() {
  const [tab, setTab] = useState("super");
  const tabs = [
    { id:"super",   label:"🛡 系統管理（Super Admin）" },
    { id:"company", label:"🏢 場館管理（Company Admin）" },
  ];

  return (
    <div style={{ background:T.bg, minHeight:"100vh", fontFamily:"'Noto Sans TC', sans-serif" }}>
      <div style={{ padding:"16px 20px 0" }}>
        <div style={{ display:"flex", gap:4, marginBottom:0, background:T.sb, borderRadius:20, padding:3, width:"fit-content" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"5px 16px", borderRadius:18, fontSize:12, color: tab===t.id ? T.ink : T.i3, cursor:"pointer", border:"none", background: tab===t.id ? T.sf : "none", fontFamily:"inherit", fontWeight: tab===t.id ? 500 : 400, transition:"all .15s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tab === "super"   && <SuperAdminPage />}
      {tab === "company" && <CompanyAdminPage />}
    </div>
  );
}
