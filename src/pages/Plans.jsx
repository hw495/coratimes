import { useState, useMemo } from "react";
import Topbar from "../components/Topbar";
import Btn from "../components/Btn";
import { plans } from "../data/mock";
import s from "./Plans.module.css";
import FilterBar from "../components/FilterBar";

const typeStyle = {
  exp:    { bg:"var(--lavs)", color:"var(--lav)", label:"初次體驗" },
  count:  { bg:"var(--rs)",   color:"var(--rm)",  label:"次數方案" },
  period: { bg:"var(--mists)",color:"var(--mist)",label:"期間方案" },
  points: { bg:"var(--ambs)", color:"var(--amb)", label:"點數方案" },
};

export default function Plans() {
  const [items, setItems] = useState(plans);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:"", type:"count", price:"", orig:"", sub:"", total:"", validDays:"", purchaseLimit:"1" });
  const ff = (k,v) => setForm(p=>({...p,[k]:v}));
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type:"all", status:"all" });
  const setF = (k,v) => setFilters(p=>({...p,[k]:v}));
  const resetFilters = () => { setSearch(""); setFilters({ type:"all", status:"all" }); };
  const filtered = useMemo(() => items.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.type !== "all" && p.type !== filters.type) return false;
    if (filters.status !== "all") {
      if (filters.status === "on" && !p.visible) return false;
      if (filters.status === "off" && p.visible) return false;
    }
    return true;
  }), [items, search, filters]);
  const T2 = { ink:"#3A3530", i3:"#A89E94", bd:"#EAE4DC", bd2:"#D6CCC0", sf:"#FFFFFF", sb:"#F0EBE3", rose:"#C4957A", rs:"#F5ECE6", bg:"#FAF8F5" };
  function toggle(id) {
    setItems(prev => prev.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
  }
  return (
    <div className={s.page}>
      <Topbar title="方案">
        <Btn variant="primary" onClick={()=>setModal(true)}>＋ 新增方案</Btn>
      </Topbar>
      <div className={s.body}>
        <FilterBar
          search={search} onSearch={setSearch} searchPlaceholder="搜尋方案名稱…"
          filters={[
            { key:"type", label:"所有類型", options:[{value:"exp",label:"初次體驗"},{value:"count",label:"次數方案"},{value:"period",label:"期間方案"},{value:"points",label:"點數方案"}] },
            { key:"status", label:"所有狀態", options:[{value:"on",label:"上架中"},{value:"off",label:"已下架"}] },
          ]}
          values={filters} onChange={setF} onReset={resetFilters}
          resultCount={filtered.length}
        />
        <div className={s.grid}>
          {filtered.map(p => {
            const ts = typeStyle[p.type];
            return (
              <div key={p.id} className={s.card}>
                <div className={s.cardTop}>
                  <span className={s.tag} style={{ background: ts.bg, color: ts.color }}>{ts.label}</span>
                  {p.orig && <span className={s.promo}>優惠中</span>}
                </div>
                <div className={s.pName}>{p.name}</div>
                <div className={s.pSub}>{p.sub}</div>
                <div className={s.pPrice}>
                  ${p.price.toLocaleString()}
                  {p.orig && <span className={s.orig}>${p.orig.toLocaleString()}</span>}
                </div>
                <div className={s.cardFoot}>
                  <div className={s.visRow}>
                    <button
                      className={`${s.miniTog} ${p.visible ? s.togOn : s.togOff}`}
                      onClick={() => toggle(p.id)}
                      aria-label="切換顯示"
                    />
                    <span>{p.visible ? "上架中" : "已下架"}</span>
                  </div>
                  <span className={s.menu}>⋮</span>
                </div>
              </div>
            );
          })}
          <div className={s.addCard} onClick={()=>setModal(true)} style={{cursor:"pointer"}}><span>＋</span>新增方案</div>
        </div>
      </div>
      {/* 新增方案 Modal */}
      {modal && (
        <div onClick={()=>setModal(false)} style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(3px)",fontFamily:"'Noto Sans TC',sans-serif" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:T2.sf,borderRadius:20,padding:24,width:460,maxWidth:"92vw",border:`1px solid ${T2.bd}`,maxHeight:"85vh",overflowY:"auto" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
              <span style={{ fontSize:14,fontWeight:500,color:T2.ink }}>新增時光券方案</span>
              <button onClick={()=>setModal(false)} style={{ background:"none",border:"none",fontSize:18,color:T2.i3,cursor:"pointer" }}>✕</button>
            </div>
            {/* 方案名稱 */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10,color:T2.i3,letterSpacing:".06em",marginBottom:5 }}>方案名稱</div>
              <input placeholder="例：器械一對一 12 次" value={form.name} onChange={e=>ff("name",e.target.value)} style={{ width:"100%",border:"none",borderBottom:`1px solid ${T2.bd2}`,padding:"7px 0",fontSize:13,color:T2.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
            </div>
            {/* 方案類型 */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10,color:T2.i3,letterSpacing:".06em",marginBottom:8 }}>方案類型</div>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {[["exp","初次體驗"],["count","次數方案"],["period","期間方案"],["points","點數方案"],["bundle","組合方案"]].map(([v,l])=>(
                  <button key={v} onClick={()=>ff("type",v)} style={{ padding:"5px 12px",borderRadius:20,border:`1px solid ${form.type===v?"#C4957A":"#D6CCC0"}`,background:form.type===v?"#F5ECE6":"none",color:form.type===v?"#A87A62":"#A89E94",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{l}</button>
                ))}
              </div>
            </div>
            {/* 售價 + 原價 */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
              <div>
                <div style={{ fontSize:10,color:T2.i3,letterSpacing:".06em",marginBottom:5 }}>售價（元）</div>
                <input type="number" min="0" placeholder="9975" value={form.price} onChange={e=>ff("price",e.target.value)} style={{ width:"100%",border:"none",borderBottom:`1px solid ${T2.bd2}`,padding:"7px 0",fontSize:13,color:T2.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
              </div>
              <div>
                <div style={{ fontSize:10,color:T2.i3,letterSpacing:".06em",marginBottom:5 }}>原價（選填，促銷用）</div>
                <input type="number" min="0" placeholder="11400" value={form.orig} onChange={e=>ff("orig",e.target.value)} style={{ width:"100%",border:"none",borderBottom:`1px solid ${T2.bd2}`,padding:"7px 0",fontSize:13,color:T2.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
              </div>
            </div>
            {/* 次數 + 有效天數 */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
              <div>
                <div style={{ fontSize:10,color:T2.i3,letterSpacing:".06em",marginBottom:5 }}>
                  {form.type==="period"?"有效期間（天）":form.type==="points"?"點數":"次數"}
                </div>
                <input type="number" min="1" placeholder={form.type==="period"?"30":form.type==="points"?"100":"12"} value={form.total} onChange={e=>ff("total",e.target.value)} style={{ width:"100%",border:"none",borderBottom:`1px solid ${T2.bd2}`,padding:"7px 0",fontSize:13,color:T2.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
              </div>
              <div>
                <div style={{ fontSize:10,color:T2.i3,letterSpacing:".06em",marginBottom:5 }}>購後有效天數（0=無期限）</div>
                <input type="number" min="0" placeholder="0" value={form.validDays} onChange={e=>ff("validDays",e.target.value)} style={{ width:"100%",border:"none",borderBottom:`1px solid ${T2.bd2}`,padding:"7px 0",fontSize:13,color:T2.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
              </div>
            </div>
            {/* 說明 + 限購 */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10,color:T2.i3,letterSpacing:".06em",marginBottom:5 }}>方案說明</div>
              <input placeholder="例：器械私教 12 次，無期限使用" value={form.sub} onChange={e=>ff("sub",e.target.value)} style={{ width:"100%",border:"none",borderBottom:`1px solid ${T2.bd2}`,padding:"7px 0",fontSize:13,color:T2.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10,color:T2.i3,letterSpacing:".06em",marginBottom:5 }}>每人限購次數（0=不限）</div>
              <input type="number" min="0" placeholder="1" value={form.purchaseLimit} onChange={e=>ff("purchaseLimit",e.target.value)} style={{ width:"100%",border:"none",borderBottom:`1px solid ${T2.bd2}`,padding:"7px 0",fontSize:13,color:T2.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
            </div>
            <div style={{ display:"flex",justifyContent:"flex-end",gap:8,paddingTop:14,borderTop:`1px solid ${T2.bd}` }}>
              <button onClick={()=>setModal(false)} style={{ padding:"7px 16px",borderRadius:20,border:`1px solid ${T2.bd2}`,background:"none",color:T2.i3,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>取消</button>
              <button onClick={()=>{ if(form.name&&form.price){ setItems(p=>[...p,{ id:Date.now(),name:form.name,type:form.type,price:Number(form.price),orig:form.orig?Number(form.orig):null,sub:form.sub||"",visible:true }]); setModal(false); setForm({ name:"",type:"count",price:"",orig:"",sub:"",total:"",validDays:"",purchaseLimit:"1" }); } }} style={{ padding:"7px 16px",borderRadius:20,border:"none",background:"#C4957A",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>新增方案</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}