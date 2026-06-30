import { useState } from "react";
import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";

const T = {
  bg:"#FAF8F5", sb:"#F0EBE3", sf:"#FFFFFF",
  ink:"#3A3530", i2:"#6E6358", i3:"#A89E94",
  bd:"#EAE4DC", bd2:"#D6CCC0",
  gold:"#B8924A", golds:"#F5EDD8", goldm:"#9A7030",
  sage:"#7A9E8E", ss:"#EAF2EF", sm:"#5C7D6F",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  lav:"#9B8FAE", lavs:"#F0EDF5",
  mist:"#8A9BAE", mists:"#EEF2F6",
  coral:"#C4726A", corals:"#FDECEA",
};

// ── Mock 資料 ─────────────────────────────────────────────────
const ME = {
  name:"創芯科技 代理", code:"coratech", contact:"David Lin",
  email:"david@coratech.com.tw", region:"北部",
  commission:15, status:"active", since:"2025/06/01",
  plan:"pro", ytd:87500, mrr:10500,
  balance:8750,  // 待撥付佣金
};

const MY_COMPANIES = [
  { id:1, name:"S.T Pilates",   slug:"st-pilates", admin:"Eddie Wang",  venues:3, plan:"pro",     status:"active",   mrr:3500, since:"2025/08/01", comm:525  },
  { id:2, name:"Body Lab",      slug:"bodylab",    admin:"Mandy Lin",   venues:1, plan:"starter", status:"active",   mrr:1500, since:"2026/01/15", comm:225  },
  { id:3, name:"Flow Studio",   slug:"flow",       admin:"Karen Chen",  venues:2, plan:"pro",     status:"suspended",mrr:0,    since:"2026/03/20", comm:0    },
  { id:4, name:"CoreFit Studio",slug:"corefit",    admin:"Jason Wu",    venues:1, plan:"pro",     status:"trial",    mrr:0,    since:"2026/06/01", comm:0    },
];

const COMM_HISTORY = [
  { month:"2026/05", mrr:10500, rate:15, amount:1575, status:"paid",    paid:"2026/06/05" },
  { month:"2026/04", mrr:10500, rate:15, amount:1575, status:"paid",    paid:"2026/05/05" },
  { month:"2026/03", mrr:7000,  rate:15, amount:1050, status:"paid",    paid:"2026/04/05" },
  { month:"2026/02", mrr:7000,  rate:15, amount:1050, status:"paid",    paid:"2026/03/05" },
  { month:"2026/01", mrr:5500,  rate:15, amount:825,  status:"paid",    paid:"2026/02/05" },
  { month:"2025/12", mrr:3500,  rate:15, amount:525,  status:"paid",    paid:"2026/01/05" },
];

const LEADS = [
  { id:1, name:"Pure Pilates",  contact:"Fiona Lee",  phone:"0922-111-333", status:"negotiating", date:"2026/06/20", note:"對 Pro 方案有興趣" },
  { id:2, name:"動感健身中心",   contact:"Tom Chang",  phone:"0933-444-555", status:"demo",        date:"2026/06/15", note:"已安排 Demo，下週回覆" },
  { id:3, name:"身心工作室",     contact:"Nina Wu",    phone:"0966-777-888", status:"new",         date:"2026/06/10", note:"初次接觸，待跟進" },
];

const LEAD_STATUS = {
  new:         { bg:"#E3F2FD", color:"#1565C0", label:"新潛客" },
  demo:        { bg:"#FFF3E0", color:"#E65100", label:"Demo 中" },
  negotiating: { bg:"#F3E5F5", color:"#6A1B9A", label:"洽談中" },
  won:         { bg:"#E8F5E9", color:"#2E7D32", label:"已成交" },
  lost:        { bg:"#FDECEA", color:"#C62828", label:"未成交" },
};

const PLAN_COLORS = {
  starter:    [T.mists, T.mist],
  pro:        [T.rs,    T.rm  ],
  enterprise: [T.lavs,  T.lav ],
};

const STATUS_STYLE = {
  active:    { bg:"#E8F5E9", color:"#388E3C", label:"使用中" },
  suspended: { bg:"#FDECEA", color:"#C62828", label:"已停用" },
  trial:     { bg:"#FFF3E0", color:"#E65100", label:"試用中" },
};

// ── 共用元件 ──────────────────────────────────────────────────
function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ background:T.sf,border:`1px solid ${T.bd}`,borderRadius:16,overflow:"hidden",...style }}>
      {children}
    </div>
  );
}
function Btn({ children, v, onClick, sm }) {
  const isP = v==="primary";
  return (
    <button onClick={onClick} style={{
      padding:sm?"4px 10px":"7px 14px",borderRadius:20,
      border:`1px solid ${isP?T.gold:T.bd2}`,
      background:isP?T.gold:T.sf,color:isP?"#fff":T.i2,
      fontSize:sm?10:12,cursor:"pointer",fontFamily:"inherit",fontWeight:isP?500:400,
    }}>{children}</button>
  );
}
function StatCard({ label, value, sub, color }) {
  return (
    <Card style={{ padding:"14px 16px" }}>
      <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:24,fontWeight:300,color:color||T.ink,lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:10,color:T.i3,marginTop:3 }}>{sub}</div>}
    </Card>
  );
}

// ── Sidebar ────────────────────────────────────────────────────
const NAV = [
  { group:"總覽", items:[
    { to:"/reseller",       icon:"📊", label:"儀表板",  end:true },
  ]},
  { group:"業務管理", items:[
    { to:"/reseller/companies",icon:"🏢", label:"旗下公司" },
    { to:"/reseller/leads",    icon:"🎯", label:"潛客管理" },
  ]},
  { group:"財務", items:[
    { to:"/reseller/commission",icon:"💰", label:"佣金紀錄" },
    { to:"/reseller/invoice",   icon:"🧾", label:"發票申請" },
  ]},
  { group:"資源", items:[
    { to:"/reseller/resources", icon:"📁", label:"行銷素材" },
    { to:"/reseller/support",   icon:"🛎", label:"客服支援" },
  ]},
];

function ResellerSidebar() {
  return (
    <aside style={{ width:200,flexShrink:0,background:T.sb,borderRight:`1px solid ${T.bd}`,
      display:"flex",flexDirection:"column",minHeight:"calc(100vh - 38px)",position:"sticky",top:38 }}>
      <div style={{ padding:"16px 14px 12px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:12 }}>
          <div style={{ width:30,height:30,borderRadius:8,background:T.gold,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>🤝</div>
          <div>
            <div style={{ fontSize:12,fontWeight:600,color:T.ink }}>經銷商平台</div>
            <div style={{ fontSize:9,color:T.i3,letterSpacing:".06em" }}>RESELLER PORTAL</div>
          </div>
        </div>
        <div style={{ background:T.golds,borderRadius:9,padding:"7px 10px",border:`1px solid ${T.gold}30` }}>
          <div style={{ fontSize:11,color:T.goldm,fontWeight:500 }}>{ME.name}</div>
          <div style={{ fontSize:9,color:T.gold,marginTop:1 }}>佣金率 {ME.commission}%</div>
        </div>
      </div>
      <nav style={{ flex:1,padding:"4px 7px",overflowY:"auto" }}>
        {NAV.map(g=>(
          <div key={g.group} style={{ marginBottom:12 }}>
            <div style={{ fontSize:9,color:T.i3,padding:"0 7px",letterSpacing:".1em",marginBottom:4,textTransform:"uppercase" }}>{g.group}</div>
            {g.items.map(item=>(
              <NavLink key={item.to} to={item.to} end={item.end}
                style={({ isActive })=>({
                  display:"flex",alignItems:"center",gap:8,padding:"7px 8px 7px 11px",
                  borderRadius:8,fontSize:12,color:isActive?T.goldm:T.i2,
                  textDecoration:"none",marginBottom:1,
                  background:isActive?T.golds:"none",
                  fontWeight:isActive?500:400,
                  position:"relative",
                })}>
                {({ isActive })=>(
                  <>
                    {isActive&&<div style={{ position:"absolute",left:0,top:6,bottom:6,width:2.5,borderRadius:2,background:T.gold }} />}
                    <span style={{ fontSize:14,width:18,textAlign:"center" }}>{item.icon}</span>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding:"10px 7px",borderTop:`1px solid ${T.bd}` }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 9px",borderRadius:8 }}>
          <div style={{ width:26,height:26,borderRadius:"50%",background:T.golds,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.gold,fontWeight:600 }}>D</div>
          <div>
            <div style={{ fontSize:11,color:T.ink }}>{ME.contact}</div>
            <div style={{ fontSize:9,color:T.i3 }}>{ME.region} · {ME.code}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title, children }) {
  return (
    <div style={{ borderBottom:`1px solid ${T.bd}`,padding:"12px 22px",display:"flex",
      alignItems:"center",justifyContent:"space-between",gap:12,background:T.sf,flexShrink:0 }}>
      <div style={{ fontSize:16,fontWeight:500,color:T.ink }}>{title}</div>
      <div style={{ display:"flex",gap:8,alignItems:"center" }}>{children}</div>
    </div>
  );
}
function Body({ children }) {
  return <div style={{ flex:1,overflowY:"auto",padding:"20px 22px",fontFamily:"'Noto Sans TC',sans-serif" }}>{children}</div>;
}

// ── 1. 儀表板 ─────────────────────────────────────────────────
function Dashboard() {
  const activeComps = MY_COMPANIES.filter(c=>c.status==="active").length;
  const totalMRR    = MY_COMPANIES.filter(c=>c.status==="active").reduce((s,c)=>s+c.mrr,0);
  const thisComm    = Math.round(totalMRR * ME.commission / 100);

  return (
    <>
      <TopBar title="儀表板">
        <div style={{ fontSize:11,color:T.i3 }}>歡迎回來，{ME.contact}</div>
      </TopBar>
      <Body>
        {/* 統計卡 */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20 }}>
          <StatCard label="旗下公司" value={MY_COMPANIES.length} sub={`${activeComps} 家使用中`} color={T.gold} />
          <StatCard label="本月 MRR" value={`$${totalMRR.toLocaleString()}`} sub="旗下訂閱總額" color={T.sage} />
          <StatCard label="本月佣金" value={`$${thisComm.toLocaleString()}`} sub={`佣金率 ${ME.commission}%`} color={T.rose} />
          <StatCard label="待撥付金額" value={`$${ME.balance.toLocaleString()}`} sub="下次撥付 7/5" color={T.lav} />
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:14,alignItems:"start" }}>
          {/* 公司狀況 */}
          <div>
            <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:10 }}>旗下公司狀況</div>
            <Card>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 80px 80px 80px 80px",background:T.sb,borderBottom:`1px solid ${T.bd}` }}>
                {["公司","方案","場館","本月MRR","狀態"].map(h=>(
                  <div key={h} style={{ padding:"8px 10px",fontSize:10,color:T.i3,fontWeight:500 }}>{h}</div>
                ))}
              </div>
              {MY_COMPANIES.map((c,i)=>{
                const [pbg,pfg] = PLAN_COLORS[c.plan]||[T.sb,T.i2];
                const st = STATUS_STYLE[c.status];
                return (
                  <div key={c.id} style={{ display:"grid",gridTemplateColumns:"1fr 80px 80px 80px 80px",
                    borderBottom:i<MY_COMPANIES.length-1?`1px solid ${T.bd}`:"none",
                    background:i%2===0?T.sf:T.bg,alignItems:"center" }}>
                    <div style={{ padding:"10px 10px" }}>
                      <div style={{ fontSize:12,fontWeight:500,color:T.ink }}>{c.name}</div>
                      <div style={{ fontSize:10,color:T.i3 }}>{c.admin}</div>
                    </div>
                    <div style={{ padding:"10px 10px" }}>
                      <span style={{ fontSize:10,padding:"2px 7px",borderRadius:10,background:pbg,color:pfg,fontWeight:500 }}>{c.plan}</span>
                    </div>
                    <div style={{ padding:"10px 10px",fontSize:12,color:T.i2,textAlign:"center" }}>{c.venues}</div>
                    <div style={{ padding:"10px 10px",fontSize:12,color:T.sage,fontWeight:500 }}>{c.mrr?`$${c.mrr.toLocaleString()}`:"—"}</div>
                    <div style={{ padding:"10px 10px" }}>
                      <span style={{ fontSize:10,padding:"2px 7px",borderRadius:10,background:st.bg,color:st.color }}>{st.label}</span>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          {/* 右側：快訊 + 潛客 */}
          <div>
            <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:10 }}>佣金快覽</div>
            <Card style={{ padding:"14px",marginBottom:12 }}>
              {[
                ["本月 MRR",`$${totalMRR.toLocaleString()}`],
                ["佣金率",`${ME.commission}%`],
                ["應付佣金",`$${thisComm.toLocaleString()}`],
                ["撥付日","每月 5 日"],
              ].map(([l,v])=>(
                <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.bd}`,fontSize:12 }}>
                  <span style={{ color:T.i3 }}>{l}</span>
                  <span style={{ color:T.ink,fontWeight:500 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:10 }}>
                <Btn v="primary" onClick={()=>{}}>申請發票</Btn>
              </div>
            </Card>

            <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:10 }}>潛客追蹤</div>
            <Card style={{ padding:"14px" }}>
              {LEADS.slice(0,3).map((l,i)=>{
                const st = LEAD_STATUS[l.status];
                return (
                  <div key={l.id} style={{ paddingBottom:10,marginBottom:10,borderBottom:i<2?`1px solid ${T.bd}`:"none" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3 }}>
                      <div style={{ fontSize:12,fontWeight:500,color:T.ink }}>{l.name}</div>
                      <span style={{ fontSize:9,padding:"2px 6px",borderRadius:8,background:st.bg,color:st.color,flexShrink:0 }}>{st.label}</span>
                    </div>
                    <div style={{ fontSize:10,color:T.i3 }}>{l.contact} · {l.date}</div>
                    <div style={{ fontSize:11,color:T.i2,marginTop:2 }}>{l.note}</div>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      </Body>
    </>
  );
}

// ── 2. 旗下公司 ───────────────────────────────────────────────
function Companies() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:"",adminName:"",adminEmail:"",plan:"starter" });
  const [companies, setCompanies] = useState(MY_COMPANIES);
  const ff = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleCreate = () => {
    const newC = { id:Date.now(),name:form.name,slug:form.name.toLowerCase().replace(/\s/g,"-"),
      admin:form.adminName,venues:0,plan:form.plan,status:"trial",mrr:0,since:new Date().toLocaleDateString("zh-TW"),comm:0 };
    setCompanies(p=>[...p,newC]);
    setModal(false);
    setForm({ name:"",adminName:"",adminEmail:"",plan:"starter" });
  };

  const mInp = { width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"8px 10px",fontSize:12,color:T.ink,fontFamily:"inherit",outline:"none",background:T.sf,boxSizing:"border-box" };

  return (
    <>
      <TopBar title="旗下公司">
        <Btn v="primary" onClick={()=>setModal(true)}>＋ 新增公司</Btn>
      </TopBar>
      <Body>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12 }}>
          {companies.map(c=>{
            const [pbg,pfg] = PLAN_COLORS[c.plan]||[T.sb,T.i2];
            const st = STATUS_STYLE[c.status];
            return (
              <Card key={c.id} style={{ padding:"16px" }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:14,fontWeight:500,color:T.ink }}>{c.name}</div>
                    <div style={{ fontSize:11,color:T.i3,marginTop:2 }}>{c.admin}</div>
                  </div>
                  <span style={{ fontSize:9,padding:"2px 7px",borderRadius:10,background:st.bg,color:st.color }}>{st.label}</span>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12 }}>
                  <div style={{ background:T.bg,borderRadius:8,padding:"8px 10px" }}>
                    <div style={{ fontSize:10,color:T.i3,marginBottom:2 }}>方案</div>
                    <span style={{ fontSize:11,padding:"2px 8px",borderRadius:10,background:pbg,color:pfg,fontWeight:500 }}>{c.plan}</span>
                  </div>
                  <div style={{ background:T.bg,borderRadius:8,padding:"8px 10px" }}>
                    <div style={{ fontSize:10,color:T.i3,marginBottom:2 }}>MRR</div>
                    <div style={{ fontSize:13,fontWeight:500,color:T.sage }}>{c.mrr?`$${c.mrr.toLocaleString()}`:"—"}</div>
                  </div>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${T.bd}` }}>
                  <div style={{ fontSize:10,color:T.i3 }}>加入 {c.since}</div>
                  <div style={{ display:"flex",gap:6 }}>
                    <Btn sm>管理</Btn>
                    <Btn sm v="primary">進入後台</Btn>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* 新增卡片 */}
          <div onClick={()=>setModal(true)}
            style={{ border:`1px dashed ${T.bd2}`,borderRadius:16,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",minHeight:180,cursor:"pointer",gap:8,color:T.i3,fontSize:12 }}>
            <span style={{ fontSize:22 }}>＋</span>新增公司
          </div>
        </div>

        {modal && (
          <div onClick={e=>e.target===e.currentTarget&&setModal(false)}
            style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,backdropFilter:"blur(4px)" }}>
            <div onClick={e=>e.stopPropagation()}
              style={{ background:T.sf,borderRadius:20,width:440,maxWidth:"92vw",border:`1px solid ${T.bd}`,boxShadow:"0 12px 50px rgba(58,53,48,.2)" }}>
              <div style={{ padding:"18px 22px 14px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <span style={{ fontSize:14,fontWeight:600,color:T.ink }}>新增旗下公司</span>
                <button onClick={()=>setModal(false)} style={{ background:"none",border:`1px solid ${T.bd2}`,borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:13,color:T.i3 }}>✕</button>
              </div>
              <div style={{ padding:"18px 22px" }}>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>公司名稱</div>
                  <input value={form.name} onChange={e=>ff("name",e.target.value)} placeholder="場館名稱" style={mInp} />
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12 }}>
                  <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>管理者姓名</div>
                    <input value={form.adminName} onChange={e=>ff("adminName",e.target.value)} placeholder="管理員" style={mInp} /></div>
                  <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>管理者 Email</div>
                    <input type="email" value={form.adminEmail} onChange={e=>ff("adminEmail",e.target.value)} placeholder="admin@..." style={mInp} /></div>
                </div>
                <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>訂閱方案</div>
                  <select value={form.plan} onChange={e=>ff("plan",e.target.value)} style={mInp}>
                    <option value="starter">Starter — $1,500/月</option>
                    <option value="pro">Pro — $3,500/月</option>
                    <option value="enterprise">Enterprise — 洽談</option>
                  </select>
                </div>
                <div style={{ marginTop:12,padding:"10px 12px",background:T.golds,borderRadius:9,fontSize:11,color:T.goldm }}>
                  💰 本公司訂閱後，每月自動計入 {ME.commission}% 佣金
                </div>
              </div>
              <div style={{ display:"flex",gap:10,padding:"13px 22px",borderTop:`1px solid ${T.bd}` }}>
                <button onClick={()=>setModal(false)} style={{ flex:1,padding:"10px",borderRadius:12,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>取消</button>
                <button onClick={handleCreate} disabled={!form.name||!form.adminEmail}
                  style={{ flex:2,padding:"10px",borderRadius:12,border:"none",background:T.gold,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>建立公司帳號</button>
              </div>
            </div>
          </div>
        )}
      </Body>
    </>
  );
}

// ── 3. 潛客管理 ───────────────────────────────────────────────
function Leads() {
  const [leads, setLeads] = useState(LEADS);
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ name:"",contact:"",phone:"",note:"",status:"new" });
  const ff = (k,v) => setForm(p=>({...p,[k]:v}));
  const mInp = { width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"8px 10px",fontSize:12,color:T.ink,fontFamily:"inherit",outline:"none",background:T.sf,boxSizing:"border-box" };

  return (
    <>
      <TopBar title="潛客管理">
        <Btn v="primary" onClick={()=>setModal(true)}>＋ 新增潛客</Btn>
      </TopBar>
      <Body>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:18 }}>
          {Object.entries(LEAD_STATUS).map(([k,v])=>(
            <div key={k} style={{ background:v.bg,borderRadius:10,padding:"10px",textAlign:"center" }}>
              <div style={{ fontSize:18,fontWeight:600,color:v.color }}>{leads.filter(l=>l.status===k).length}</div>
              <div style={{ fontSize:10,color:v.color }}>{v.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {leads.map(l=>{
            const st = LEAD_STATUS[l.status];
            return (
              <Card key={l.id} style={{ padding:"14px 16px" }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                      <div style={{ fontSize:14,fontWeight:500,color:T.ink }}>{l.name}</div>
                      <span style={{ fontSize:10,padding:"2px 7px",borderRadius:10,background:st.bg,color:st.color }}>{st.label}</span>
                    </div>
                    <div style={{ fontSize:12,color:T.i3,marginBottom:4 }}>{l.contact} · {l.phone} · {l.date}</div>
                    <div style={{ fontSize:12,color:T.i2 }}>{l.note}</div>
                  </div>
                  <div style={{ display:"flex",gap:6,flexShrink:0 }}>
                    {["new","demo","negotiating","won","lost"].map(s=>(
                      <button key={s} onClick={()=>setLeads(p=>p.map(x=>x.id===l.id?{...x,status:s}:x))}
                        style={{ padding:"4px 9px",borderRadius:12,border:`1px solid ${l.status===s?LEAD_STATUS[s].color:T.bd2}`,
                          background:l.status===s?LEAD_STATUS[s].bg:T.sf,color:l.status===s?LEAD_STATUS[s].color:T.i3,
                          fontSize:10,cursor:"pointer",fontFamily:"inherit" }}>
                        {LEAD_STATUS[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        {modal && (
          <div onClick={e=>e.target===e.currentTarget&&setModal(false)}
            style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,backdropFilter:"blur(4px)" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:T.sf,borderRadius:20,width:420,maxWidth:"92vw",border:`1px solid ${T.bd}` }}>
              <div style={{ padding:"18px 22px 14px",borderBottom:`1px solid ${T.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <span style={{ fontSize:14,fontWeight:600,color:T.ink }}>新增潛客</span>
                <button onClick={()=>setModal(false)} style={{ background:"none",border:`1px solid ${T.bd2}`,borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:13,color:T.i3 }}>✕</button>
              </div>
              <div style={{ padding:"18px 22px" }}>
                <div style={{ marginBottom:10 }}><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>公司名稱</div><input value={form.name} onChange={e=>ff("name",e.target.value)} style={mInp} /></div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
                  <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>聯絡人</div><input value={form.contact} onChange={e=>ff("contact",e.target.value)} style={mInp} /></div>
                  <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>電話</div><input value={form.phone} onChange={e=>ff("phone",e.target.value)} style={mInp} /></div>
                </div>
                <div style={{ marginBottom:10 }}><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>備注</div><textarea value={form.note} onChange={e=>ff("note",e.target.value)} rows={2} style={{ ...mInp,resize:"none" }} /></div>
                <div><div style={{ fontSize:10,color:T.i3,marginBottom:4 }}>狀態</div>
                  <div style={{ display:"flex",gap:6 }}>
                    {["new","demo","negotiating"].map(s=>(
                      <button key={s} onClick={()=>ff("status",s)}
                        style={{ flex:1,padding:"6px",borderRadius:16,border:`1.5px solid ${form.status===s?LEAD_STATUS[s].color:T.bd2}`,background:form.status===s?LEAD_STATUS[s].bg:T.sf,color:form.status===s?LEAD_STATUS[s].color:T.i2,fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>
                        {LEAD_STATUS[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex",gap:10,padding:"13px 22px",borderTop:`1px solid ${T.bd}` }}>
                <button onClick={()=>setModal(false)} style={{ flex:1,padding:"10px",borderRadius:12,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>取消</button>
                <button onClick={()=>{ setLeads(p=>[...p,{id:Date.now(),date:new Date().toLocaleDateString("zh-TW"),...form}]); setModal(false); }} style={{ flex:2,padding:"10px",borderRadius:12,border:"none",background:T.gold,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>新增</button>
              </div>
            </div>
          </div>
        )}
      </Body>
    </>
  );
}

// ── 4. 佣金紀錄 ───────────────────────────────────────────────
function Commission() {
  return (
    <>
      <TopBar title="佣金紀錄">
        <Btn v="primary">申請發票</Btn>
      </TopBar>
      <Body>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20 }}>
          <StatCard label="本月佣金" value={`$${Math.round(ME.mrr*ME.commission/100).toLocaleString()}`} sub="尚未撥付" color={T.gold} />
          <StatCard label="待撥付" value={`$${ME.balance.toLocaleString()}`} sub="下次撥付 7/5" color={T.rose} />
          <StatCard label="年度累計" value={`$${ME.ytd.toLocaleString()}`} sub="2026 年度" color={T.sage} />
        </div>
        <Card>
          <div style={{ display:"grid",gridTemplateColumns:"90px 100px 70px 80px 80px 80px",background:T.sb,borderBottom:`1px solid ${T.bd}` }}>
            {["月份","MRR","佣金率","佣金金額","狀態","撥付日"].map(h=>(
              <div key={h} style={{ padding:"8px 10px",fontSize:10,color:T.i3,fontWeight:500 }}>{h}</div>
            ))}
          </div>
          {COMM_HISTORY.map((h,i)=>(
            <div key={h.month} style={{ display:"grid",gridTemplateColumns:"90px 100px 70px 80px 80px 80px",
              borderBottom:i<COMM_HISTORY.length-1?`1px solid ${T.bd}`:"none",
              background:i%2===0?T.sf:T.bg,alignItems:"center" }}>
              <div style={{ padding:"10px 10px",fontSize:12,fontWeight:500,color:T.ink }}>{h.month}</div>
              <div style={{ padding:"10px 10px",fontSize:12,color:T.sage }}>${h.mrr.toLocaleString()}</div>
              <div style={{ padding:"10px 10px",fontSize:12,color:T.i2 }}>{h.rate}%</div>
              <div style={{ padding:"10px 10px",fontSize:13,fontWeight:600,color:T.gold }}>${h.amount.toLocaleString()}</div>
              <div style={{ padding:"10px 10px" }}>
                <span style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:"#E8F5E9",color:"#388E3C" }}>已撥付</span>
              </div>
              <div style={{ padding:"10px 10px",fontSize:11,color:T.i3 }}>{h.paid}</div>
            </div>
          ))}
        </Card>
      </Body>
    </>
  );
}

// ── 5. 行銷素材 ───────────────────────────────────────────────
function Resources() {
  const items = [
    { icon:"📄", name:"Cora Times 產品簡介", type:"PDF", size:"2.4MB", date:"2026/06" },
    { icon:"🖼", name:"品牌 Logo 素材包",    type:"ZIP", size:"8.1MB", date:"2026/05" },
    { icon:"📊", name:"訂閱方案對照表",       type:"PDF", size:"0.8MB", date:"2026/06" },
    { icon:"📝", name:"銷售話術指南",         type:"PDF", size:"1.2MB", date:"2026/05" },
    { icon:"🎨", name:"Demo 展示簡報",        type:"PPTX",size:"15MB",  date:"2026/06" },
    { icon:"📹", name:"產品功能介紹影片",      type:"MP4", size:"120MB", date:"2026/04" },
  ];
  return (
    <>
      <TopBar title="行銷素材" />
      <Body>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12 }}>
          {items.map(item=>(
            <Card key={item.name} style={{ padding:"14px 16px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <div style={{ fontSize:28 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize:12,fontWeight:500,color:T.ink }}>{item.name}</div>
                  <div style={{ fontSize:10,color:T.i3,marginTop:2 }}>{item.type} · {item.size} · {item.date}</div>
                </div>
              </div>
              <Btn sm v="primary">下載</Btn>
            </Card>
          ))}
        </div>
      </Body>
    </>
  );
}

// ── 6. 客服支援 ───────────────────────────────────────────────
function Support() {
  return (
    <>
      <TopBar title="客服支援" />
      <Body>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20 }}>
          {[
            { icon:"📞", title:"電話支援", sub:"週一至週五 09:00–18:00", action:"撥打電話", color:T.sage },
            { icon:"💬", title:"即時聊天", sub:"線上客服，平均回應 < 5 分鐘", action:"開始對話", color:T.lav },
            { icon:"📧", title:"Email 客服", sub:"24小時內回覆", action:"寄送信件", color:T.rose },
            { icon:"📚", title:"知識庫", sub:"常見問題與使用教學", action:"查看文件", color:T.gold },
          ].map(c=>(
            <Card key={c.title} style={{ padding:"16px" }}>
              <div style={{ fontSize:24,marginBottom:8 }}>{c.icon}</div>
              <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:3 }}>{c.title}</div>
              <div style={{ fontSize:11,color:T.i3,marginBottom:12 }}>{c.sub}</div>
              <Btn sm v="primary">{c.action}</Btn>
            </Card>
          ))}
        </div>
        <div style={{ padding:"14px 16px",background:T.golds,borderRadius:12,border:`1px solid ${T.gold}30`,fontSize:12,color:T.goldm }}>
          🎯 身為 Pro 方案合作經銷商，您享有<strong>優先客服通道</strong>，所有問題將優先排序處理。
        </div>
      </Body>
    </>
  );
}

// ── 主頁面 ─────────────────────────────────────────────────────
export default function ResellerPortal() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email:"", password:"" });

  if(!loggedIn) return (
    <div style={{ minHeight:"calc(100vh - 38px)",background:`linear-gradient(135deg,${T.golds} 0%,${T.sf} 60%)`,
      display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Noto Sans TC',sans-serif" }}>
      <div style={{ width:380,maxWidth:"90vw" }}>
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ width:52,height:52,borderRadius:14,background:T.gold,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 12px" }}>🤝</div>
          <div style={{ fontSize:22,fontWeight:600,color:T.ink,marginBottom:4 }}>經銷商平台</div>
          <div style={{ fontSize:13,color:T.i3 }}>Cora Times Reseller Portal</div>
        </div>
        <Card style={{ padding:"24px" }}>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11,color:T.i3,marginBottom:5 }}>Email</div>
            <input value={loginForm.email} onChange={e=>setLoginForm(p=>({...p,email:e.target.value}))}
              placeholder="reseller@example.com"
              style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"9px 11px",fontSize:13,color:T.ink,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11,color:T.i3,marginBottom:5 }}>密碼</div>
            <input type="password" value={loginForm.password} onChange={e=>setLoginForm(p=>({...p,password:e.target.value}))}
              placeholder="••••••••"
              style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"9px 11px",fontSize:13,color:T.ink,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }} />
          </div>
          <button onClick={()=>setLoggedIn(true)}
            style={{ width:"100%",padding:"12px",borderRadius:12,border:"none",background:T.gold,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            登入
          </button>
          <div style={{ textAlign:"center",marginTop:12,fontSize:11,color:T.i3 }}>
            尚未成為經銷商？<span style={{ color:T.gold,cursor:"pointer" }}>申請合作</span>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex",minHeight:"calc(100vh - 38px)",background:T.bg,fontFamily:"'Noto Sans TC',sans-serif" }}>
      <ResellerSidebar />
      <div style={{ flex:1,overflow:"hidden",display:"flex",flexDirection:"column" }}>
        <Routes>
          <Route index           element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="leads"     element={<Leads />} />
          <Route path="commission" element={<Commission />} />
          <Route path="invoice"   element={<Commission />} />
          <Route path="resources" element={<Resources />} />
          <Route path="support"   element={<Support />} />
          <Route path="*"         element={<Navigate to="/reseller" replace />} />
        </Routes>
      </div>
    </div>
  );
}
