import { useState } from "react";
import { NavLink, Outlet, Routes, Route, useNavigate } from "react-router-dom";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const T = {
  bg:"#FAF8F5", sf:"#FFFFFF", sand2:"#E8E0D6",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  sage:"#7A9E8E", ss:"#EAF2EF", sm:"#5C7D6F",
  ink:"#3A3530", i2:"#6E6358", i3:"#A89E94",
  bd:"#EAE4DC", bd2:"#D6CCC0",
  amb:"#B8924A", ambs:"#F5EDD8",
  lav:"#9B8FAE", lavs:"#F0EDF5",
  mist:"#8A9BAE", mists:"#EEF2F6",
  coral:"#C4726A", corals:"#F9EDEC",
};

// Super Admin uses a deep sidebar with lavender accent
const SA = {
  sidebar:"#1C1C1C", sidebarBorder:"rgba(255,255,255,.06)",
  accent:"#C9A96E", accentS:"rgba(201,169,110,.15)",
  text1:"#F5F2EE", text2:"#B8B3AC", text3:"#6E6A64",
};

const nav = [
  { group:"平台管理", items:[
    { to:"/superadmin/app",      icon:"🏢", label:"公司管理"    },
    { to:"/superadmin/app/resellers", icon:"🤝", label:"經銷商管理"  },
    { to:"/superadmin/app/plans", icon:"💎", label:"訂閱方案"    },
    { to:"/superadmin/app/billing", icon:"🧾", label:"帳單管理"    },
  ]},
  { group:"洞察與報告", items:[
    { to:"/superadmin/app/insights", icon:"📊", label:"跨公司洞察"  },
  ]},
  { group:"系統", items:[
    { to:"/superadmin/app/announce", icon:"📣", label:"系統公告"    },
    { to:"/superadmin/app/settings", icon:"⚙",  label:"平台設定"   },
  ]},
];

const bottomNav = [
  { to:"/superadmin/app",     icon:"🏢", label:"公司" },
  { to:"/superadmin/app/resellers",icon:"🤝", label:"經銷商" },
  { to:"/superadmin/app/plans",icon:"💎", label:"方案" },
  { to:"/superadmin/app/insights",icon:"📊", label:"洞察" },
  { to:"/superadmin/app/settings",icon:"⚙",  label:"設定" },
];

function SANavItem({ item }) {
  return (
    <NavLink to={item.to} end={item.to==="/superadmin/app"} style={({ isActive }) => ({
      display:"flex", alignItems:"center", gap:9,
      padding:"7px 10px 7px 14px", borderRadius:9,
      fontSize:12, textDecoration:"none", transition:"all .15s",
      color: isActive ? SA.accent : SA.text2,
      background: isActive ? SA.accentS : "none",
      position:"relative", marginBottom:1,
    })}>
      {({ isActive }) => (
        <>
          {isActive && <div style={{ position:"absolute", left:0, top:6, bottom:6,
            width:2.5, borderRadius:2, background:SA.accent }} />}
          <span style={{ fontSize:14, width:18, textAlign:"center" }}>{item.icon}</span>
          {item.label}
        </>
      )}
    </NavLink>
  );
}

export function SuperAdminSidebar() {
  const { isMobile, isTablet } = useBreakpoint();

  if (isMobile) return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100,
      background:"#1C1C1C", borderTop:"1px solid rgba(255,255,255,.08)",
      display:"flex", height:60 }}>
      {bottomNav.map(item => (
        <NavLink key={item.to} to={item.to} end={item.to==="/superadmin/app"}
          style={({ isActive }) => ({
            flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:2, textDecoration:"none",
            color: isActive ? SA.accent : SA.text3,
          })}>
          <span style={{ fontSize:20 }}>{item.icon}</span>
          <span style={{ fontSize:9 }}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );

  if (isTablet) return (
    <aside style={{ width:52, flexShrink:0, background:SA.sidebar,
      borderRight:`1px solid ${SA.sidebarBorder}`,
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"12px 0", height:"100%", minHeight:"100vh", position:"sticky", top:38 }}>
      <div style={{ fontSize:16, marginBottom:12 }}>🌿</div>
      {nav.flatMap(g=>g.items).map(item => (
        <NavLink key={item.to} to={item.to} end={item.to==="/superadmin/app"} title={item.label}
          style={({ isActive }) => ({
            width:38, height:38, borderRadius:9, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:17, textDecoration:"none", marginBottom:2,
            background: isActive ? SA.accentS : "none",
          })}>
          {item.icon}
        </NavLink>
      ))}
    </aside>
  );

  return (
    <aside style={{ width:210, flexShrink:0, background:SA.sidebar,
      borderRight:`1px solid ${SA.sidebarBorder}`,
      display:"flex", flexDirection:"column",
      height:"100%", minHeight:"100vh", position:"sticky", top:38 }}>
      <div style={{ padding:"18px 16px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:T.rose,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🌿</div>
          <div>
            <div style={{ display:"flex", alignItems:"baseline", gap:5 }}>
              <span style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:13,
                fontWeight:300, color:SA.text1 }}>Cora</span>
              <span style={{ fontFamily:"Georgia,serif", fontSize:13,
                color:T.rose, fontStyle:"italic" }}>Times</span>
            </div>
            <div style={{ fontSize:9, color:SA.text3, marginTop:1 }}>創芯時光</div>
          </div>
        </div>
        <div style={{ background:"rgba(201,169,110,.1)", border:"1px solid rgba(201,169,110,.2)",
          borderRadius:9, padding:"7px 10px", display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ fontSize:12 }}>🛡</span>
          <span style={{ fontSize:11, color:SA.accent, fontWeight:500 }}>Super Admin</span>
        </div>
      </div>
      <nav style={{ flex:1, padding:"4px 8px", overflowY:"auto" }}>
        {nav.map(g => (
          <div key={g.group} style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, color:SA.text3, padding:"0 7px",
              letterSpacing:".1em", marginBottom:4, textTransform:"uppercase" }}>{g.group}</div>
            {g.items.map(item => <SANavItem key={item.to} item={item} />)}
          </div>
        ))}
      </nav>
      <div style={{ padding:"10px 8px", borderTop:`1px solid ${SA.sidebarBorder}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8,
          padding:"6px 9px", borderRadius:8, cursor:"pointer" }}>
          <div style={{ width:26, height:26, borderRadius:"50%",
            background:"rgba(201,169,110,.2)", color:SA.accent,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, fontWeight:500, flexShrink:0 }}>E</div>
          <div>
            <div style={{ fontSize:12, color:SA.text1 }}>Eddie</div>
            <div style={{ fontSize:10, color:SA.text3 }}>系統管理員</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function SuperAdminLayout() {
  const { isMobile } = useBreakpoint();
  return (
    <div style={{ display:"flex", minHeight:"calc(100vh - 38px)",
      paddingBottom:isMobile?60:0, background:"#F5F3F0" }}>
      <SuperAdminSidebar />
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <Outlet />
      </div>
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────
function SATopbar({ title, children }) {
  return (
    <div style={{ height:52, padding:"0 22px", display:"flex", alignItems:"center", gap:10,
      borderBottom:"1px solid rgba(0,0,0,.06)", background:T.sf,
      position:"sticky", top:38, zIndex:10, flexShrink:0 }}>
      <span style={{ fontSize:15, fontWeight:300, color:T.ink, letterSpacing:".06em", flex:1 }}>{title}</span>
      {children}
    </div>
  );
}
function SABody({ children }) {
  return <div style={{ flex:1, overflowY:"auto", padding:22 }}>{children}</div>;
}
function SAPage({ children }) {
  return <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>{children}</div>;
}
function Btn({ children, v="ghost", onClick, sm }) {
  const styles = {
    ghost:   { border:`1px solid ${T.bd2}`, background:"none", color:T.i2 },
    primary: { border:"none", background:T.rose, color:"#fff" },
    gold:    { border:`1px solid ${SA.accent}`, background:"none", color:SA.accent },
    danger:  { border:`1px solid ${T.corals}`, background:"none", color:T.coral },
    sage:    { border:"none", background:T.sage, color:"#fff" },
  };
  return (
    <button onClick={onClick} style={{ ...styles[v]||styles.ghost,
      padding:sm?"3px 10px":"5px 13px", borderRadius:20,
      fontSize:sm?11:12, cursor:"pointer", fontFamily:"inherit",
      display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
      {children}
    </button>
  );
}
function Tag({ children, bg, color }) {
  return <span style={{ fontSize:10, padding:"2px 9px", borderRadius:12,
    background:bg||T.sb, color:color||T.i2, fontWeight:500, display:"inline-block" }}>{children}</span>;
}
function Card({ children, style }) {
  return <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16,
    overflow:"hidden", ...style }}>{children}</div>;
}
function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, padding:"14px 16px" }}>
      <div style={{ fontSize:10, color:T.i3, letterSpacing:".07em", marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:300, color:accent||T.ink }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:T.sm, marginTop:4 }}>{sub}</div>}
    </div>
  );
}

// ── 1. 公司管理（主頁面）────────────────────────────────────
export function SACompanies() {
  const [companies, setCompanies] = useState([
    { id:1, name:"S.T Pilates", slug:"st-pilates", admin:"Eddie Wang",  venues:3, plan:"pro",     status:"active",    since:"2025/08/01" },
    { id:2, name:"Body Lab",    slug:"bodylab",    admin:"Mandy Lin",   venues:1, plan:"starter", status:"active",    since:"2026/01/15" },
    { id:3, name:"Flow Studio", slug:"flow",       admin:"Karen Chen",  venues:2, plan:"pro",     status:"suspended", since:"2026/03/20" },
    { id:4, name:"Move Well",   slug:"movewell",   admin:"Jerry Huang", venues:1, plan:"enterprise", status:"active", since:"2026/05/01" },
  ]);
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ name:"", slug:"", adminName:"", adminEmail:"", plan:"starter" });
  const planStyle = {
    starter:    [T.ambs, T.amb],
    pro:        [T.lavs, T.lav],
    enterprise: [T.ss,   T.sm ],
  };
  const aColors = [[T.rs,T.rm],[T.ss,T.sm],[T.mists,T.mist],[T.lavs,T.lav],[T.ambs,T.amb]];
  const colW = [220,130,50,100,80,110,160];

  function addCompany() {
    if (!form.name) return;
    setCompanies(p => [...p, { id:Date.now(), name:form.name, slug:form.slug,
      admin:form.adminName, venues:0, plan:form.plan, status:"active",
      since:new Date().toLocaleDateString("zh-TW") }]);
    setModal(false);
    setForm({ name:"", slug:"", adminName:"", adminEmail:"", plan:"starter" });
  }

  return (
    <SAPage>
      <SATopbar title="公司管理">
        <Tag bg={T.lavs} color={T.lav}>🛡 Super Admin</Tag>
        <div style={{ width:1, height:18, background:T.bd }} />
        <Btn>匯出</Btn>
        <Btn v="primary" onClick={() => setModal(true)}>＋ 新增公司</Btn>
      </SATopbar>
      <SABody>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:9, marginBottom:18 }}>
          <KpiCard label="公司總數" value={companies.length} sub="↑ 1 本月" />
          <KpiCard label="場館總數" value={companies.reduce((a,c)=>a+c.venues,0)} sub="跨所有公司" />
          <KpiCard label="活躍學員" value="142" sub="↑ 12 本月" accent={T.sage} />
          <KpiCard label="月訂閱收入" value="$28,500" sub="平台收入" />
        </div>
        <Card>
          {/* header */}
          <div style={{ display:"grid", gridTemplateColumns:colW.map(w=>w+"px").join(" "),
            background:T.sb, borderBottom:`1px solid ${T.bd}` }}>
            {["公司","Company Admin","場館","訂閱方案","狀態","建立日期","操作"].map(h => (
              <div key={h} style={{ padding:"8px 12px", fontSize:10, color:T.i3,
                fontWeight:500, letterSpacing:".05em" }}>{h}</div>
            ))}
          </div>
          {companies.map((c, i) => {
            const [abg,afg] = aColors[i%aColors.length];
            const [pbg,pfg] = planStyle[c.plan]||[T.sb,T.i2];
            return (
              <div key={c.id} style={{ display:"grid",
                gridTemplateColumns:colW.map(w=>w+"px").join(" "),
                borderBottom:i<companies.length-1?`1px solid ${T.bd}`:"none",
                background:i%2===0?T.sf:T.bg, alignItems:"center" }}>
                <div style={{ padding:"10px 12px", display:"flex", alignItems:"center", gap:9 }}>
                  <div style={{ width:30,height:30,borderRadius:8,background:abg,color:afg,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:11,fontWeight:500,flexShrink:0 }}>{c.name.slice(0,2).toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize:13,color:T.ink }}>{c.name}</div>
                    <div style={{ fontSize:10,color:T.i3 }}>{c.slug}.coratimes.com</div>
                  </div>
                </div>
                <div style={{ padding:"10px 12px",fontSize:12,color:T.ink }}>{c.admin}</div>
                <div style={{ padding:"10px 12px",fontSize:12,color:T.ink,textAlign:"center" }}>{c.venues}</div>
                <div style={{ padding:"10px 12px" }}>
                  <Tag bg={pbg} color={pfg}>{c.plan==="pro"?"Pro":c.plan==="enterprise"?"Enterprise":"Starter"}</Tag>
                </div>
                <div style={{ padding:"10px 12px" }}>
                  <Tag bg={c.status==="active"?T.ss:T.corals} color={c.status==="active"?T.sm:T.coral}>
                    {c.status==="active"?"營運中":"已停用"}
                  </Tag>
                </div>
                <div style={{ padding:"10px 12px",fontSize:12,color:T.i2 }}>{c.since}</div>
                <div style={{ padding:"10px 12px",display:"flex",gap:5 }}>
                  <Btn sm>進入</Btn>
                  <Btn sm>編輯</Btn>
                  <Btn sm v={c.status==="active"?"danger":"sage"}
                    onClick={()=>setCompanies(p=>p.map(x=>x.id!==c.id?x:{...x,status:x.status==="active"?"suspended":"active"}))}>
                    {c.status==="active"?"停用":"啟用"}
                  </Btn>
                </div>
              </div>
            );
          })}
        </Card>
      </SABody>

      {/* Modal */}
      {modal && (
        <div onClick={() => setModal(false)} style={{ position:"fixed",inset:0,
          background:"rgba(58,53,48,.35)",display:"flex",alignItems:"center",
          justifyContent:"center",zIndex:200,backdropFilter:"blur(3px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:T.sf,borderRadius:20,
            padding:24,width:440,maxWidth:"92vw",border:`1px solid ${T.bd}` }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
              <span style={{ fontSize:14,fontWeight:500,color:T.ink }}>新增公司</span>
              <button onClick={() => setModal(false)} style={{ background:"none",border:"none",
                fontSize:18,color:T.i3,cursor:"pointer" }}>✕</button>
            </div>
            {[["公司名稱","name","例：Body Craft Studio"],
              ["公司代碼（manage.coratimes.com/xxx）","slug","bodycraft"],
              ["Admin 姓名","adminName","管理員姓名"],
              ["Admin Email","adminEmail","admin@..."]].map(([l,k,ph])=>(
              <div key={k} style={{ marginBottom:14 }}>
                <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>{l}</div>
                <input placeholder={ph} value={form[k]}
                  onChange={e => setForm(p=>({...p,[k]:e.target.value}))}
                  style={{ width:"100%",border:"none",borderBottom:`1px solid ${T.bd2}`,
                    padding:"7px 0",fontSize:13,color:T.ink,background:"none",
                    outline:"none",fontFamily:"inherit" }} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>訂閱方案</div>
              <select value={form.plan} onChange={e=>setForm(p=>({...p,plan:e.target.value}))}
                style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"8px 10px",
                  fontSize:13,color:T.ink,background:T.sf,outline:"none",fontFamily:"inherit" }}>
                <option value="starter">Starter — 1 間場館</option>
                <option value="pro">Pro — 最多 5 間場館</option>
                <option value="enterprise">Enterprise — 無限場館</option>
              </select>
            </div>
            <div style={{ fontSize:11,color:T.i3,background:T.bg,borderRadius:9,
              padding:"9px 12px",marginBottom:16 }}>
              ✉ 建立後系統將自動發送設定邀請 Email 給 Company Admin
            </div>
            <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}>
              <Btn onClick={() => setModal(false)}>取消</Btn>
              <Btn v="primary" onClick={addCompany}>建立並發送邀請</Btn>
            </div>
          </div>
        </div>
      )}
    </SAPage>
  );
}

// ── 2. 訂閱方案管理 ──────────────────────────────────────────
export function SAPlans() {
  const plans = [
    {
      name:"Starter", code:"starter", venues:1, price:1500, annual:15000,
      features:[
        { label:"基本簽到",          included:true  },
        { label:"時光表 / 排班",      included:true  },
        { label:"學員管理",          included:true  },
        { label:"時光券方案",         included:true  },
        { label:"收款確認",          included:true  },
        { label:"洞察報表（單館）",    included:true  },
        { label:"體態評估報告",       included:false, note:"Pro 以上" },
        { label:"跨場館報表",         included:false, note:"Pro 以上" },
        { label:"電子合約",          included:false, note:"Pro 以上" },
        { label:"LINE 通知",         included:false, note:"Pro 以上" },
      ],
    },
    {
      name:"Pro", code:"pro", venues:5, price:3500, annual:35000,
      features:[
        { label:"Starter 全部功能",   included:true  },
        { label:"體態評估報告",       included:true, highlight:true },
        { label:"評估報告 PDF 匯出",  included:true, highlight:true },
        { label:"跨場館報表",         included:true  },
        { label:"電子合約 / 電子簽署", included:true  },
        { label:"LINE 通知",         included:true  },
        { label:"電子發票",          included:true  },
        { label:"公開預約頁",         included:true  },
        { label:"API 存取",          included:false, note:"Enterprise" },
        { label:"自訂網域",          included:false, note:"Enterprise" },
      ],
    },
    {
      name:"Enterprise", code:"enterprise", venues:-1, price:null, annual:null,
      features:[
        { label:"Pro 全部功能",       included:true  },
        { label:"體態評估報告（進階）", included:true, highlight:true },
        { label:"AI 趨勢分析報告",    included:true, highlight:true },
        { label:"體態報告自訂品牌",   included:true, highlight:true },
        { label:"API 存取",          included:true  },
        { label:"自訂網域",          included:true  },
        { label:"優先客服",          included:true  },
        { label:"客製整合",          included:true  },
        { label:"專屬 SLA",          included:true  },
      ],
    },
  ];
  const colors = [[T.mists,T.mist],[T.rs,T.rm],[T.lavs,T.lav]];
  return (
    <SAPage>
      <SATopbar title="訂閱方案管理">
        <Btn v="primary">＋ 新增方案</Btn>
      </SATopbar>
      <SABody>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
          {plans.map((p,i) => {
            const [bg,fg] = colors[i];
            return (
              <Card key={p.name} style={{ padding:"18px" }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
                  <span style={{ fontSize:11,padding:"2px 10px",borderRadius:12,
                    background:fg,color:"#fff",fontWeight:500 }}>{p.name}</span>
                  <span style={{ fontSize:11,color:T.i3 }}>
                    {p.venues===-1?"無限場館":`最多 ${p.venues} 間`}
                  </span>
                </div>
                <div style={{ fontSize:22,fontWeight:300,color:T.ink,marginBottom:4 }}>
                  {p.price ? `$${p.price.toLocaleString()}/月` : "洽談"}
                </div>
                {p.annual && <div style={{ fontSize:11,color:T.sm,marginBottom:8 }}>
                  年繳 ${p.annual.toLocaleString()} (省 ${p.price*12-p.annual})
                </div>}
                {p.features.some(f=>f.highlight&&f.included) && (
                  <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:12,
                    padding:"5px 9px",borderRadius:8,background:"#E8F5E9",border:"1px solid #C8E6C9" }}>
                    <span style={{ fontSize:12 }}>🩻</span>
                    <span style={{ fontSize:10,color:"#388E3C",fontWeight:500 }}>
                      {p.code==="enterprise"?"含體態評估（進階 + AI 趨勢）":"含體態評估報告功能"}
                    </span>
                  </div>
                )}
                <div style={{ display:"flex",flexDirection:"column",gap:4,marginBottom:14 }}>
                  {p.features.map(f => (
                    <div key={f.label} style={{ fontSize:11,display:"flex",alignItems:"center",gap:5,
                      opacity:f.included?1:0.45 }}>
                      <span style={{ fontSize:10,flexShrink:0,
                        color:f.included?(f.highlight?"#4CAF50":fg):"#C8C0B8" }}>
                        {f.included?"✓":"✕"}
                      </span>
                      <span style={{ color:f.included?(f.highlight?T.ink:T.i2):T.i3,
                        fontWeight:f.highlight&&f.included?500:400 }}>
                        {f.label}
                        {f.highlight&&f.included&&(
                          <span style={{ marginLeft:5,fontSize:9,padding:"1px 5px",borderRadius:6,
                            background:"#E8F5E9",color:"#388E3C" }}>新</span>
                        )}
                      </span>
                      {f.note&&!f.included&&(
                        <span style={{ fontSize:9,color:T.i3,marginLeft:"auto" }}>{f.note}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex",gap:6,paddingTop:12,borderTop:`1px solid ${T.bd}` }}>
                  <Btn sm>編輯</Btn>
                  <Btn sm v="danger">停用</Btn>
                </div>
              </Card>
            );
          })}
        </div>
        <div style={{ marginTop:18,fontSize:12,color:T.i3,background:T.sb,
          borderRadius:10,padding:"11px 14px",lineHeight:1.7 }}>
          💡 修改方案不影響現有訂閱公司（快照機制保護）。若需對特定公司套用新方案，請至公司管理頁面個別操作。
        </div>
      </SABody>
    </SAPage>
  );
}

// ── 3. 帳單管理 ───────────────────────────────────────────────
export function SABilling() {
  const invoices = [
    { company:"S.T Pilates", plan:"Pro", amount:3500, period:"2026/06", status:"paid",    date:"2026/06/01" },
    { company:"Body Lab",    plan:"Starter", amount:1500, period:"2026/06", status:"paid", date:"2026/06/01" },
    { company:"Move Well",   plan:"Enterprise", amount:null, period:"2026/06", status:"pending", date:"—" },
    { company:"Flow Studio", plan:"Pro", amount:3500, period:"2026/05", status:"void",   date:"2026/05/15" },
  ];
  return (
    <SAPage>
      <SATopbar title="帳單管理">
        <Btn>匯出</Btn>
      </SATopbar>
      <SABody>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:18 }}>
          <KpiCard label="本月已收" value="$5,000" sub="2 筆" accent={T.sage} />
          <KpiCard label="待收款" value="1 筆" sub="洽談中" accent={T.amb} />
          <KpiCard label="本年累計" value="$48,000" />
        </div>
        <Card>
          <div style={{ display:"grid",gridTemplateColumns:"160px 100px 80px 80px 80px 110px 120px",
            background:T.sb,borderBottom:`1px solid ${T.bd}` }}>
            {["公司","方案","金額","帳單期","狀態","日期","操作"].map(h => (
              <div key={h} style={{ padding:"8px 12px",fontSize:10,color:T.i3,fontWeight:500,letterSpacing:".05em" }}>{h}</div>
            ))}
          </div>
          {invoices.map((inv,i) => (
            <div key={i} style={{ display:"grid",
              gridTemplateColumns:"160px 100px 80px 80px 80px 110px 120px",
              borderBottom:i<invoices.length-1?`1px solid ${T.bd}`:"none",
              background:i%2===0?T.sf:T.bg,alignItems:"center" }}>
              <div style={{ padding:"10px 12px",fontSize:13,color:T.ink }}>{inv.company}</div>
              <div style={{ padding:"10px 12px" }}>
                <Tag bg={T.lavs} color={T.lav}>{inv.plan}</Tag>
              </div>
              <div style={{ padding:"10px 12px",fontSize:12,fontWeight:500,color:T.ink }}>
                {inv.amount ? `$${inv.amount.toLocaleString()}` : "洽談"}
              </div>
              <div style={{ padding:"10px 12px",fontSize:12,color:T.i2 }}>{inv.period}</div>
              <div style={{ padding:"10px 12px" }}>
                <Tag bg={inv.status==="paid"?T.ss:inv.status==="pending"?T.ambs:T.sb}
                  color={inv.status==="paid"?T.sm:inv.status==="pending"?T.amb:T.i3}>
                  {inv.status==="paid"?"已付款":inv.status==="pending"?"待確認":"已作廢"}
                </Tag>
              </div>
              <div style={{ padding:"10px 12px",fontSize:12,color:T.i2 }}>{inv.date}</div>
              <div style={{ padding:"10px 12px",display:"flex",gap:4 }}>
                {inv.status==="paid" && <Btn sm>下載</Btn>}
                {inv.status==="pending" && <><Btn sm v="sage">確認</Btn><Btn sm v="danger">作廢</Btn></>}
              </div>
            </div>
          ))}
        </Card>
      </SABody>
    </SAPage>
  );
}

// ── 4. 跨公司洞察 ─────────────────────────────────────────────
export function SAInsights() {
  const companies = [
    { name:"S.T Pilates", sessions:186, members:24, revenue:142680, growth:12 },
    { name:"Body Lab",    sessions:94,  members:11, revenue:58000,  growth:8  },
    { name:"Move Well",   sessions:42,  members:5,  revenue:22000,  growth:24 },
    { name:"Flow Studio", sessions:0,   members:0,  revenue:0,      growth:0  },
  ];
  const total = { sessions:companies.reduce((a,c)=>a+c.sessions,0),
    members:companies.reduce((a,c)=>a+c.members,0),
    revenue:companies.reduce((a,c)=>a+c.revenue,0) };
  return (
    <SAPage>
      <SATopbar title="跨公司洞察">
        <select style={{ border:`1px solid ${T.bd2}`,borderRadius:20,padding:"5px 11px",
          fontSize:12,color:T.i2,fontFamily:"inherit",outline:"none" }}>
          <option>2026 年 6 月</option><option>2026 年 5 月</option>
        </select>
        <Btn>匯出</Btn>
      </SATopbar>
      <SABody>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:18 }}>
          <KpiCard label="平台總場次"   value={total.sessions} sub="本月" />
          <KpiCard label="平台總學員"   value={total.members}  sub="在籍" accent={T.sage} />
          <KpiCard label="平台總收入"   value={`$${total.revenue.toLocaleString()}`} sub="本月" />
          <KpiCard label="訂閱公司數"   value="3"              sub="活躍" />
        </div>
        <Card>
          <div style={{ display:"grid",gridTemplateColumns:"180px 1fr 80px 100px 100px 100px",
            background:T.sb,borderBottom:`1px solid ${T.bd}` }}>
            {["公司","場次佔比","學員","場次","收入","成長"].map(h => (
              <div key={h} style={{ padding:"8px 12px",fontSize:10,color:T.i3,fontWeight:500,letterSpacing:".05em" }}>{h}</div>
            ))}
          </div>
          {companies.map((c,i) => {
            const pct = total.sessions ? Math.round((c.sessions/total.sessions)*100) : 0;
            return (
              <div key={c.name} style={{ display:"grid",
                gridTemplateColumns:"180px 1fr 80px 100px 100px 100px",
                borderBottom:i<companies.length-1?`1px solid ${T.bd}`:"none",
                background:i%2===0?T.sf:T.bg,alignItems:"center" }}>
                <div style={{ padding:"10px 12px",fontSize:13,color:T.ink }}>{c.name}</div>
                <div style={{ padding:"10px 12px" }}>
                  <div style={{ background:T.sb,borderRadius:4,height:6,overflow:"hidden" }}>
                    <div style={{ height:6,borderRadius:4,background:T.rose,width:`${pct}%` }} />
                  </div>
                  <div style={{ fontSize:10,color:T.i3,marginTop:3 }}>{pct}%</div>
                </div>
                <div style={{ padding:"10px 12px",fontSize:12,color:T.ink }}>{c.members}</div>
                <div style={{ padding:"10px 12px",fontSize:12,color:T.ink }}>{c.sessions}</div>
                <div style={{ padding:"10px 12px",fontSize:12,color:T.ink }}>
                  {c.revenue ? `$${(c.revenue/1000).toFixed(0)}k` : "—"}
                </div>
                <div style={{ padding:"10px 12px" }}>
                  {c.growth > 0
                    ? <span style={{ fontSize:11,color:T.sm }}>↑ {c.growth}%</span>
                    : <span style={{ fontSize:11,color:T.i3 }}>—</span>}
                </div>
              </div>
            );
          })}
        </Card>
      </SABody>
    </SAPage>
  );
}

// ── 5. 系統公告 ───────────────────────────────────────────────
export function SAAnnounce() {
  const [announces, setAnnounces] = useState([
    { id:1, title:"系統維護公告", content:"6/28 凌晨 2–4 點進行例行維護。", target:"all", status:"published", date:"2026/06/25" },
    { id:2, title:"新功能：電子發票上線", content:"Pro 以上方案現可使用電子發票功能。", target:"pro", status:"published", date:"2026/06/20" },
    { id:3, title:"7 月費率調整說明", content:"Starter 方案月費調整為 $1,800。", target:"all", status:"draft", date:"草稿" },
  ]);
  return (
    <SAPage>
      <SATopbar title="系統公告">
        <Btn v="primary">＋ 新增公告</Btn>
      </SATopbar>
      <SABody>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {announces.map(a => (
            <Card key={a.id} style={{ padding:"16px" }}>
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                    <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>{a.title}</div>
                    <Tag bg={a.status==="published"?T.ss:T.sb}
                      color={a.status==="published"?T.sm:T.i3}>
                      {a.status==="published"?"已發布":"草稿"}
                    </Tag>
                    <Tag bg={T.lavs} color={T.lav}>{a.target==="all"?"全部公司":"Pro+"}</Tag>
                  </div>
                  <div style={{ fontSize:12,color:T.i2,lineHeight:1.6 }}>{a.content}</div>
                  <div style={{ fontSize:11,color:T.i3,marginTop:8 }}>{a.date}</div>
                </div>
                <div style={{ display:"flex",gap:5,flexShrink:0 }}>
                  <Btn sm>編輯</Btn>
                  {a.status==="draft" && <Btn sm v="sage">發布</Btn>}
                  <Btn sm v="danger">刪除</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SABody>
    </SAPage>
  );
}

// ── 6. 平台設定 ───────────────────────────────────────────────
export function SASettings() {
  return (
    <SAPage>
      <SATopbar title="平台設定" />
      <SABody>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          {[
            { title:"平台基本資訊", items:[["平台名稱","Cora Times"],["主網域","coratimes.com"],["客服 Email","support@coratimes.com"]] },
            { title:"安全設定",    items:[["JWT 到期時間","8 小時"],["最大登入嘗試","5 次"],["稽核記錄保留","365 天"]] },
          ].map(sec => (
            <Card key={sec.title} style={{ padding:"18px" }}>
              <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:14 }}>{sec.title}</div>
              {sec.items.map(([l,v]) => (
                <div key={l} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:4 }}>{l}</div>
                  <input defaultValue={v} style={{ width:"100%",border:"none",
                    borderBottom:`1px solid ${T.bd2}`,padding:"6px 0",fontSize:13,
                    color:T.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
                </div>
              ))}
              <div style={{ display:"flex",justifyContent:"flex-end",marginTop:8 }}>
                <Btn v="primary">儲存</Btn>
              </div>
            </Card>
          ))}
        </div>
      </SABody>
    </SAPage>
  );
}

// ── 7. 經銷商管理 ─────────────────────────────────────────────
const RESELLER_MOCK = [
  { id:1, name:"創芯科技 代理",    code:"coratech",  contact:"David Lin",  email:"david@coratech.com.tw",  region:"北部", companies:3, plan:"pro",     commission:15, status:"active",   since:"2025/06/01", mrr:10500, ytd:87500 },
  { id:2, name:"活力健身推廣",     code:"vitalfit",  contact:"Amy Chen",   email:"amy@vitalfit.tw",         region:"中部", companies:2, plan:"starter", commission:12, status:"active",   since:"2025/09/15", mrr:4500,  ytd:31000 },
  { id:3, name:"南台灣體態顧問",   code:"southbody", contact:"Eric Huang", email:"eric@southbody.com",      region:"南部", companies:1, plan:"pro",     commission:15, status:"pending",  since:"2026/03/01", mrr:0,     ytd:0     },
  { id:4, name:"島鏈健康整合",     code:"islandfit", contact:"Lily Wang",  email:"lily@islandfit.tw",       region:"東部", companies:4, plan:"enterprise",commission:18, status:"active", since:"2025/04/20", mrr:22000, ytd:198000 },
];

const RS = {
  active:  { bg:"#E8F5E9", color:"#388E3C", label:"合作中" },
  pending: { bg:"#FFF3E0", color:"#E65100", label:"審核中" },
  paused:  { bg:"#F5F4F2", color:"#A89E94", label:"暫停中" },
};

function ResellerModal({ reseller, onClose, onSave }) {
  const isEdit = !!reseller;
  const [form, setForm] = useState(isEdit ? {...reseller} : {
    name:"", code:"", contact:"", email:"", region:"北部",
    plan:"starter", commission:12, status:"pending",
  });
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const mInp = { width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"8px 10px",fontSize:12,color:T.ink,fontFamily:"inherit",outline:"none",background:T.sf,boxSizing:"border-box" };
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,backdropFilter:"blur(4px)",fontFamily:"'Noto Sans TC',sans-serif",padding:"16px 0" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:T.sf,borderRadius:20,width:460,maxWidth:"94vw",maxHeight:"88vh",overflowY:"auto",border:`1px solid ${T.bd}`,boxShadow:"0 12px 50px rgba(0,0,0,.3)" }}>
        <div style={{ padding:"18px 22px 14px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:T.sf,borderRadius:"20px 20px 0 0" }}>
          <span style={{ fontSize:15,fontWeight:600,color:T.ink }}>{isEdit?"編輯經銷商":"新增經銷商"}</span>
          <button onClick={onClose} style={{ background:"none",border:`1px solid ${T.bd2}`,borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:T.i3,cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:"18px 22px" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
            <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>經銷商名稱</div><input value={form.name} onChange={e=>f("name",e.target.value)} placeholder="公司名稱" style={mInp} /></div>
            <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>代碼（英數）</div><input value={form.code} onChange={e=>f("code",e.target.value)} placeholder="reseller-code" style={mInp} /></div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
            <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>聯絡人</div><input value={form.contact} onChange={e=>f("contact",e.target.value)} style={mInp} /></div>
            <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>Email</div><input type="email" value={form.email} onChange={e=>f("email",e.target.value)} style={mInp} /></div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10 }}>
            <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>區域</div>
              <select value={form.region} onChange={e=>f("region",e.target.value)} style={mInp}>
                {["北部","中部","南部","東部","全台","海外"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>預設方案</div>
              <select value={form.plan} onChange={e=>f("plan",e.target.value)} style={mInp}>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>佣金率 %</div>
              <input type="number" min={0} max={30} value={form.commission} onChange={e=>f("commission",Number(e.target.value))} style={mInp} />
            </div>
          </div>
          <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>狀態</div>
            <div style={{ display:"flex",gap:8 }}>
              {[["active","合作中"],["pending","審核中"],["paused","暫停中"]].map(([v,l])=>(
                <button key={v} onClick={()=>f("status",v)}
                  style={{ flex:1,padding:"7px",borderRadius:20,border:`1.5px solid ${form.status===v?SA.accent:T.bd2}`,background:form.status===v?"rgba(201,169,110,.15)":T.sf,color:form.status===v?SA.accent:T.i2,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:"flex",gap:10,padding:"13px 22px",borderTop:`1px solid ${T.bd}`,borderRadius:"0 0 20px 20px" }}>
          <button onClick={onClose} style={{ flex:1,padding:"10px",borderRadius:12,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>取消</button>
          <button onClick={()=>onSave(form)} style={{ flex:2,padding:"10px",borderRadius:12,border:"none",background:SA.accent,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            {isEdit?"儲存變更":"建立經銷商"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SAResellers() {
  const [resellers, setResellers] = useState(RESELLER_MOCK);
  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("all");

  const filtered = resellers.filter(r=>{
    if(search && !r.name.includes(search) && !r.contact.includes(search)) return false;
    if(fStatus!=="all" && r.status!==fStatus) return false;
    return true;
  });

  const handleSave = (form) => {
    if(editTarget) {
      setResellers(p=>p.map(r=>r.id===editTarget.id?{...form,id:r.id,companies:r.companies,mrr:r.mrr,ytd:r.ytd,since:r.since}:r));
    } else {
      const newId = Math.max(...resellers.map(r=>r.id))+1;
      setResellers(p=>[...p,{...form,id:newId,companies:0,mrr:0,ytd:0}]);
    }
    setModal(false); setEditTarget(null);
  };

  const stats = {
    total: resellers.length,
    active: resellers.filter(r=>r.status==="active").length,
    companies: resellers.reduce((s,r)=>s+r.companies,0),
    mrr: resellers.filter(r=>r.status==="active").reduce((s,r)=>s+r.mrr,0),
  };

  const sel = { border:`1px solid ${T.bd2}`,borderRadius:20,padding:"5px 12px",fontSize:12,color:T.ink,fontFamily:"inherit",outline:"none",background:T.sf,cursor:"pointer" };

  return (
    <SAPage>
      <SATopbar title="經銷商管理">
        <Btn v="primary" onClick={()=>{setEditTarget(null);setModal(true);}}>＋ 新增經銷商</Btn>
      </SATopbar>
      <SABody>
        {/* 統計 */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
          {[
            { label:"經銷商總數", value:stats.total,    sub:"合作夥伴",   color:SA.accent },
            { label:"合作中",    value:stats.active,   sub:"正常運作",   color:"#4CAF50" },
            { label:"管理公司數", value:stats.companies,sub:"旗下場館",   color:T.lav    },
            { label:"每月收益",  value:`$${stats.mrr.toLocaleString()}`,sub:"來自經銷商",color:T.sage },
          ].map(s=>(
            <Card key={s.label} style={{ padding:"14px 16px" }}>
              <div style={{ fontSize:10,color:T.i3,letterSpacing:".05em",marginBottom:5 }}>{s.label}</div>
              <div style={{ fontSize:24,fontWeight:300,color:s.color,lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:10,color:T.i3,marginTop:3 }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        {/* 篩選 */}
        <div style={{ display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.i3 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜尋名稱或聯絡人…"
              style={{ border:`1px solid ${T.bd2}`,borderRadius:20,padding:"5px 12px 5px 28px",fontSize:12,color:T.ink,outline:"none",fontFamily:"inherit",width:170 }} />
          </div>
          <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={sel}>
            <option value="all">所有狀態</option>
            <option value="active">合作中</option>
            <option value="pending">審核中</option>
            <option value="paused">暫停中</option>
          </select>
          <span style={{ fontSize:11,color:T.i3,marginLeft:"auto" }}>共 {filtered.length} 家</span>
        </div>

        {/* 主列表 */}
        <div style={{ display:"grid",gridTemplateColumns:selected?"1fr 320px":"1fr",gap:14,alignItems:"start" }}>
          <Card>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 70px 80px 80px 80px 90px 100px",background:T.sb,borderBottom:`1px solid ${T.bd}` }}>
              {["經銷商","區域","旗下公司","佣金率","每月收益","狀態","操作"].map(h=>(
                <div key={h} style={{ padding:"8px 10px",fontSize:10,color:T.i3,fontWeight:500,letterSpacing:".05em" }}>{h}</div>
              ))}
            </div>
            {filtered.length===0 ? (
              <div style={{ padding:"40px",textAlign:"center",color:T.i3,fontSize:13 }}>無符合條件的經銷商</div>
            ) : filtered.map((r,i)=>{
              const st = RS[r.status];
              return (
                <div key={r.id} onClick={()=>setSelected(selected?.id===r.id?null:r)}
                  style={{ display:"grid",gridTemplateColumns:"1fr 70px 80px 80px 80px 90px 100px",
                           borderBottom:i<filtered.length-1?`1px solid ${T.bd}`:"none",
                           background:selected?.id===r.id?"rgba(201,169,110,.08)":i%2===0?T.sf:T.bg,
                           alignItems:"center",cursor:"pointer",transition:"background .1s" }}
                  onMouseEnter={e=>{ if(selected?.id!==r.id) e.currentTarget.style.background="#FAF0E6"; }}
                  onMouseLeave={e=>{ if(selected?.id!==r.id) e.currentTarget.style.background=i%2===0?T.sf:T.bg; }}>
                  <div style={{ padding:"11px 10px" }}>
                    <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>{r.name}</div>
                    <div style={{ fontSize:10,color:T.i3,marginTop:1 }}>{r.contact} · {r.email}</div>
                    <div style={{ fontSize:10,color:T.i3 }}>自 {r.since}</div>
                  </div>
                  <div style={{ padding:"11px 10px",fontSize:12,color:T.i2 }}>{r.region}</div>
                  <div style={{ padding:"11px 10px",fontSize:13,fontWeight:500,color:T.ink,textAlign:"center" }}>{r.companies}</div>
                  <div style={{ padding:"11px 10px",fontSize:12,color:T.i2,textAlign:"center" }}>{r.commission}%</div>
                  <div style={{ padding:"11px 10px",fontSize:12,color:T.sage,fontWeight:500 }}>${r.mrr.toLocaleString()}</div>
                  <div style={{ padding:"11px 10px" }}>
                    <span style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:st.bg,color:st.color }}>{st.label}</span>
                  </div>
                  <div style={{ padding:"11px 8px",display:"flex",gap:5 }}>
                    <Btn sm onClick={e=>{e.stopPropagation();setEditTarget(r);setModal(true);}}>編輯</Btn>
                    <Btn sm onClick={e=>{e.stopPropagation();setSelected(selected?.id===r.id?null:r);}}>詳情</Btn>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* 右側詳情 */}
          {selected && (
            <Card style={{ padding:"18px" }}>
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:15,fontWeight:600,color:T.ink,marginBottom:3 }}>{selected.name}</div>
                  <div style={{ fontSize:11,color:T.i3 }}>{selected.code}</div>
                </div>
                <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",fontSize:16,color:T.i3,cursor:"pointer" }}>✕</button>
              </div>

              {/* 數據概覽 */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
                {[
                  {l:"旗下公司",v:selected.companies+" 家"},
                  {l:"佣金率",v:selected.commission+"%"},
                  {l:"本月收益",v:"$"+selected.mrr.toLocaleString()},
                  {l:"年度累計",v:"$"+selected.ytd.toLocaleString()},
                ].map(s=>(
                  <div key={s.l} style={{ background:T.sb,borderRadius:9,padding:"9px 11px" }}>
                    <div style={{ fontSize:10,color:T.i3,marginBottom:2 }}>{s.l}</div>
                    <div style={{ fontSize:15,fontWeight:500,color:T.ink }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* 聯絡資訊 */}
              <div style={{ marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.bd}` }}>
                <div style={{ fontSize:10,color:T.i3,letterSpacing:".05em",marginBottom:7 }}>聯絡資訊</div>
                {[["聯絡人",selected.contact],["Email",selected.email],["區域",selected.region],["合作自",selected.since]].map(([l,v])=>(
                  <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.bd}`,fontSize:11 }}>
                    <span style={{ color:T.i3 }}>{l}</span><span style={{ color:T.ink }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* 佣金計算 */}
              <div style={{ marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.bd}` }}>
                <div style={{ fontSize:10,color:T.i3,letterSpacing:".05em",marginBottom:7 }}>佣金計算</div>
                <div style={{ background:T.sb,borderRadius:9,padding:"10px 12px",fontSize:11,color:T.i2,lineHeight:1.8 }}>
                  <div style={{ display:"flex",justifyContent:"space-between" }}><span>旗下 MRR</span><span style={{ color:T.ink }}>${selected.mrr.toLocaleString()}</span></div>
                  <div style={{ display:"flex",justifyContent:"space-between" }}><span>佣金率</span><span style={{ color:T.ink }}>{selected.commission}%</span></div>
                  <div style={{ height:1,background:T.bd,margin:"5px 0" }} />
                  <div style={{ display:"flex",justifyContent:"space-between",fontWeight:600 }}>
                    <span style={{ color:T.ink }}>本月應付佣金</span>
                    <span style={{ color:T.sage }}>${Math.round(selected.mrr*selected.commission/100).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div style={{ display:"flex",gap:7 }}>
                <Btn onClick={()=>{setEditTarget(selected);setModal(true);}}>編輯</Btn>
                <Btn v="primary">進入視角</Btn>
              </div>
            </Card>
          )}
        </div>
      </SABody>
      {modal && <ResellerModal reseller={editTarget} onClose={()=>{setModal(false);setEditTarget(null);}} onSave={handleSave} />}
    </SAPage>
  );
}
