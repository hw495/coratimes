import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useState, useMemo } from "react";
import FilterBar from "../../components/FilterBar";
import Topbar from "../../components/Topbar";
import Btn from "../../components/Btn";

const T = {
  bg:"#FAF8F5", sb:"#F0EBE3", sf:"#FFFFFF",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  sage:"#7A9E8E", ss:"#EAF2EF", sm:"#5C7D6F",
  ink:"#3A3530", i2:"#6E6358", i3:"#A89E94",
  bd:"#EAE4DC", bd2:"#D6CCC0",
  amb:"#B8924A", ambs:"#F5EDD8",
  lav:"#9B8FAE", lavs:"#F0EDF5",
  mist:"#8A9BAE", mists:"#EEF2F6",
  coral:"#C4726A", corals:"#F9EDEC",
};

function Body({ children }) {
  return <div style={{ flex:1, overflowY:"auto", padding:22 }}>{children}</div>;
}
function Page({ children }) {
  return <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>{children}</div>;
}
function Card({ children, style }) {
  return <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, overflow:"hidden", ...style }}>{children}</div>;
}
function Tag({ children, bg, color }) {
  return <span style={{ fontSize:10, padding:"2px 9px", borderRadius:12, background:bg||T.sb, color:color||T.i2, fontWeight:500, display:"inline-block" }}>{children}</span>;
}
function SectionLabel({ children }) {
  return <div style={{ fontSize:10, color:T.i3, letterSpacing:".08em", marginBottom:8 }}>{children}</div>;
}
function Trow({ cols, widths, head, even }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:widths.map(w=>w+"px").join(" "),
      background: head ? T.sb : even ? T.bg : T.sf,
      borderBottom:`1px solid ${T.bd}`, alignItems:"center" }}>
      {cols.map((c,i) => (
        <div key={i} style={{ padding:"9px 12px", fontSize: head?10:12,
          color: head?T.i3:T.ink, fontWeight: head?500:400,
          letterSpacing: head?".05em":0 }}>{c}</div>
      ))}
    </div>
  );
}

// ── 排程管理 ─────────────────────────────────────────────────
// ── 排程管理 ─────────────────────────────────────────────────
// ── 排班管理 ─────────────────────────────────────────────────
// 排班 = 教練 × 時段 × 教室 × 名額（不綁課程）
// 學員預約時依已購方案選擇課程
const SCH_DAYS    = ["一","二","三","四","五","六","日"];
const SCH_ROOMS   = ["靜心室","舒活室","多功能室","不限教室"];
const SCH_COACHES = [
  { name:"Sammi", initial:"S", bg:"#F5ECE6", color:"#A87A62" },
  { name:"Annie", initial:"A", bg:"#EEF2F6", color:"#8A9BAE" },
  { name:"Kelly", initial:"K", bg:"#EAF2EF", color:"#5C7D6F" },
];
const HOURS = Array.from({length:16},(_,i)=>String(i+7).padStart(2,"0"));
const MINS  = ["00","15","30","45"];

function timeToMin(t){ const [h,m]=t.split(":"); return +h*60+ +m; }
function minToTime(m){ return `${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`; }
function durLabel(start,end){
  const d = timeToMin(end)-timeToMin(start);
  if(d<=0) return "";
  return d>=60 ? `${Math.floor(d/60)}小時${d%60?` ${d%60}分`:""}` : `${d}分鐘`;
}

const initSlots = [
  { id:1,  day:"一", start:"10:00", end:"11:00", coaches:["Sammi"],         room:"靜心室", capacity:1, open:true  },
  { id:2,  day:"一", start:"13:00", end:"14:00", coaches:["Sammi"],         room:"靜心室", capacity:1, open:true  },
  { id:3,  day:"一", start:"19:00", end:"20:00", coaches:["Annie"],         room:"舒活室",  capacity:2, open:true  },
  { id:4,  day:"二", start:"10:00", end:"11:00", coaches:["Sammi"],         room:"靜心室", capacity:1, open:true  },
  { id:5,  day:"二", start:"14:00", end:"15:00", coaches:["Sammi","Annie"], room:"靜心室", capacity:2, open:true  },
  { id:6,  day:"三", start:"10:00", end:"11:00", coaches:["Sammi"],         room:"靜心室", capacity:1, open:true  },
  { id:7,  day:"三", start:"19:00", end:"20:00", coaches:["Annie"],         room:"舒活室",  capacity:2, open:true  },
  { id:8,  day:"四", start:"10:00", end:"11:00", coaches:["Sammi"],         room:"靜心室", capacity:1, open:false },
  { id:9,  day:"五", start:"10:00", end:"11:00", coaches:["Sammi","Kelly"], room:"不限教室", capacity:2, open:true  },
  { id:10, day:"六", start:"10:00", end:"11:00", coaches:["Annie"],         room:"舒活室",  capacity:2, open:true  },
  { id:11, day:"日", start:"11:00", end:"11:50", coaches:["Kelly"],         room:"多功能室", capacity:1, open:true  },
];

// ── 新增/編輯時段 Modal ──────────────────────────────────────
function SlotModal({ slot, onSave, onClose }) {
  const isEdit = !!slot;
  const [form, setForm] = useState(isEdit ? { ...slot } : {
    day:"一", start:"10:00", end:"11:00",
    coaches:[], room:"靜心室", capacity:1, open:true, note:"",
  });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const toggleCoach = (c) => f("coaches", form.coaches.includes(c) ? form.coaches.filter(x=>x!==c) : [...form.coaches,c]);

  const dur = durLabel(form.start, form.end);
  const canSave = form.coaches.length > 0 && timeToMin(form.end) > timeToMin(form.start);

  const sel  = { width:"100%", border:"1px solid #D6CCC0", borderRadius:9, padding:"9px 11px", fontSize:13, color:"#3A3530", fontFamily:"inherit", outline:"none", background:"#fff", boxSizing:"border-box" };
  const lbl  = { fontSize:10, color:"#A89E94", letterSpacing:".06em", marginBottom:5, display:"block" };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.4)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:300,
               backdropFilter:"blur(4px)",fontFamily:"'Noto Sans TC',sans-serif",padding:"16px 0" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:"#FAF8F5",borderRadius:20,width:460,maxWidth:"94vw",
                 maxHeight:"90vh",overflowY:"auto",border:"1px solid #EAE4DC",
                 boxShadow:"0 8px 40px rgba(58,53,48,.15)" }}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"18px 22px 14px",borderBottom:"1px solid #EAE4DC",
                      position:"sticky",top:0,background:"#FAF8F5",zIndex:1,borderRadius:"20px 20px 0 0" }}>
          <div>
            <div style={{ fontSize:15,fontWeight:600,color:"#3A3530" }}>{isEdit?"編輯時段":"新增排班時段"}</div>
            <div style={{ fontSize:11,color:"#A89E94",marginTop:2 }}>排班只需設定教練與時間，課程由學員預約時選擇</div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"1px solid #D6CCC0",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#A89E94",cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ padding:"18px 22px" }}>

          {/* 星期 */}
          <div style={{ marginBottom:16 }}>
            <span style={lbl}>重複星期</span>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {SCH_DAYS.map(d=>(
                <button key={d} onClick={()=>f("day",d)}
                  style={{ width:36,height:36,borderRadius:"50%",fontSize:13,cursor:"pointer",fontFamily:"inherit",
                           border:`1.5px solid ${form.day===d?"#C4957A":"#D6CCC0"}`,
                           background:form.day===d?"#F5ECE6":"none",
                           color:form.day===d?"#A87A62":"#7A6E68",fontWeight:form.day===d?600:400 }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 時間 */}
          <div style={{ marginBottom:dur?4:16 }}>
            <span style={lbl}>時段</span>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              {/* 開始 */}
              <div style={{ display:"flex",gap:4,flex:1 }}>
                <select value={form.start.split(":")[0]} onChange={e=>f("start",`${e.target.value}:${form.start.split(":")[1]}`)} style={{ ...sel }}>
                  {HOURS.map(h=><option key={h}>{h}</option>)}
                </select>
                <select value={form.start.split(":")[1]} onChange={e=>f("start",`${form.start.split(":")[0]}:${e.target.value}`)} style={{ ...sel }}>
                  {MINS.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <span style={{ color:"#A89E94",fontSize:13,flexShrink:0 }}>—</span>
              {/* 結束 */}
              <div style={{ display:"flex",gap:4,flex:1 }}>
                <select value={form.end.split(":")[0]} onChange={e=>f("end",`${e.target.value}:${form.end.split(":")[1]}`)} style={{ ...sel }}>
                  {HOURS.map(h=><option key={h}>{h}</option>)}
                </select>
                <select value={form.end.split(":")[1]} onChange={e=>f("end",`${form.end.split(":")[0]}:${e.target.value}`)} style={{ ...sel }}>
                  {MINS.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
          {dur && (
            <div style={{ fontSize:11,color:"#7A9E8E",marginBottom:16 }}>⏱ {dur}</div>
          )}

          {/* 指派教練 — 核心欄位 */}
          <div style={{ marginBottom:16 }}>
            <span style={lbl}>指派教練<span style={{ color:"#C4726A",marginLeft:2 }}>*</span></span>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:6 }}>
              {SCH_COACHES.map(c=>{
                const active = form.coaches.includes(c.name);
                return (
                  <button key={c.name} onClick={()=>toggleCoach(c.name)}
                    style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 14px",borderRadius:20,fontSize:13,cursor:"pointer",fontFamily:"inherit",
                             border:`1.5px solid ${active?"#C4957A":"#D6CCC0"}`,
                             background:active?"#F5ECE6":"#fff",color:active?"#A87A62":"#7A6E68",
                             boxShadow:active?"0 0 0 2px #C4957A22":"none",transition:"all .15s" }}>
                    <div style={{ width:24,height:24,borderRadius:"50%",background:active?c.bg:"#EAE4DC",
                                  display:"flex",alignItems:"center",justifyContent:"center",
                                  fontSize:11,fontWeight:600,color:active?c.color:"#A89E94",flexShrink:0 }}>
                      {c.initial}
                    </div>
                    {c.name}
                    {active && <span style={{ fontSize:10 }}>✓</span>}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize:11,color:"#A89E94",lineHeight:1.6 }}>
              {form.coaches.length===0 && <span style={{ color:"#C4726A" }}>請至少選擇一位教練</span>}
              {form.coaches.length>1 && `已選 ${form.coaches.length} 位教練，學員預約時可自行選擇`}
              {form.coaches.length===1 && `學員預約此時段將固定由 ${form.coaches[0]} 授課`}
            </div>
          </div>

          {/* 教室 + 名額 */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16 }}>
            <div>
              <span style={lbl}>上課教室</span>
              <select value={form.room} onChange={e=>f("room",e.target.value)} style={sel}>
                {SCH_ROOMS.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <span style={lbl}>可預約名額</span>
              <div style={{ display:"flex",alignItems:"center",border:"1px solid #D6CCC0",borderRadius:9,overflow:"hidden",background:"#fff" }}>
                <button onClick={()=>f("capacity",Math.max(1,form.capacity-1))}
                  style={{ padding:"9px 14px",background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#7A6E68" }}>－</button>
                <span style={{ flex:1,textAlign:"center",fontSize:14,color:"#3A3530",fontWeight:500 }}>{form.capacity}</span>
                <button onClick={()=>f("capacity",Math.min(20,form.capacity+1))}
                  style={{ padding:"9px 14px",background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#7A6E68" }}>＋</button>
              </div>
            </div>
          </div>

          {/* 備注 */}
          <div style={{ marginBottom:16 }}>
            <span style={lbl}>時段備注（選填）</span>
            <input value={form.note||""} onChange={e=>f("note",e.target.value)}
              placeholder="例：僅限女性、需自備瑜珈墊…"
              style={sel} />
          </div>

          {/* 開放預約 toggle */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                        padding:"12px 0",borderTop:"1px solid #EAE4DC" }}>
            <div>
              <div style={{ fontSize:13,color:"#3A3530" }}>開放學員預約</div>
              <div style={{ fontSize:11,color:"#A89E94",marginTop:2 }}>關閉後此時段不顯示於學員前台</div>
            </div>
            <button onClick={()=>f("open",!form.open)}
              style={{ width:40,height:22,borderRadius:11,border:"none",cursor:"pointer",position:"relative",
                       background:form.open?"#4CAF50":"#D6CCC0",transition:"background .2s",flexShrink:0 }}>
              <div style={{ position:"absolute",top:3,left:form.open?20:3,width:16,height:16,
                            borderRadius:"50%",background:"#fff",transition:"left .2s",
                            boxShadow:"0 1px 3px rgba(0,0,0,.12)" }} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:"flex",gap:10,padding:"14px 22px",borderTop:"1px solid #EAE4DC",
                      position:"sticky",bottom:0,background:"#FAF8F5",borderRadius:"0 0 20px 20px" }}>
          <button onClick={onClose}
            style={{ flex:1,padding:"11px",borderRadius:12,border:"1px solid #D6CCC0",background:"none",color:"#7A6E68",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
            取消
          </button>
          <button disabled={!canSave} onClick={()=>canSave&&onSave(form)}
            style={{ flex:2,padding:"11px",borderRadius:12,border:"none",
                     background:canSave?"#C4957A":"#ccc",color:"#fff",fontSize:13,fontWeight:600,
                     cursor:canSave?"pointer":"not-allowed",fontFamily:"inherit" }}>
            {isEdit?"儲存變更":"建立時段"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Schedule() {
  const { isMobile } = useBreakpoint();
  const [slots, setSlots]       = useState(initSlots);
  const [view,  setView]        = useState("week");
  const [modal,     setModal]   = useState(false);
  const [editSlot,  setEditSlot]= useState(null);
  const [filterCoach, setFilterCoach] = useState("all");
  const [filterRoom,  setFilterRoom]  = useState("all");

  const nextId = Math.max(...slots.map(s=>s.id), 0) + 1;

  const handleAdd  = (form) => { setSlots(p=>[...p,{...form,id:nextId}]); setModal(false); };
  const handleEdit = (form) => { setSlots(p=>p.map(s=>s.id===editSlot.id?{...form,id:s.id}:s)); setEditSlot(null); };
  const handleDel  = (id)   => setSlots(p=>p.filter(s=>s.id!==id));
  const toggleOpen = (id)   => setSlots(p=>p.map(s=>s.id===id?{...s,open:!s.open}:s));

  const filtered = slots.filter(s=>{
    if(filterCoach!=="all" && !s.coaches.includes(filterCoach)) return false;
    if(filterRoom !=="all" && s.room!==filterRoom) return false;
    return true;
  });

  const byDay = SCH_DAYS.reduce((acc,d)=>{
    acc[d]=filtered.filter(s=>s.day===d).sort((a,b)=>timeToMin(a.start)-timeToMin(b.start));
    return acc;
  },{});

  const openCount = filtered.filter(s=>s.open).length;

  // coach avatar chip
  const CoachChips = ({coaches,small}) => (
    <div style={{ display:"flex",gap:3,flexWrap:"wrap" }}>
      {coaches.map(c=>{
        const meta = SCH_COACHES.find(x=>x.name===c)||{initial:c[0],bg:"#EAE4DC",color:"#7A6E68"};
        return (
          <div key={c} style={{ display:"flex",alignItems:"center",gap:4,
                                 background:meta.bg,borderRadius:20,
                                 padding:small?"1px 6px 1px 3px":"2px 8px 2px 4px",fontSize:small?9:11 }}>
            <div style={{ width:small?12:16,height:small?12:16,borderRadius:"50%",background:meta.color+"33",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:small?8:10,fontWeight:700,color:meta.color }}>
              {meta.initial}
            </div>
            <span style={{ color:meta.color,fontWeight:500 }}>{c}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <Page>
      <Topbar title="排班管理">
        <select value={filterCoach} onChange={e=>setFilterCoach(e.target.value)}
          style={{ border:"1px solid var(--bd2)",borderRadius:20,padding:"5px 12px",fontSize:12,color:"var(--ink)",fontFamily:"inherit",outline:"none",background:"var(--sf)" }}>
          <option value="all">所有教練</option>
          {SCH_COACHES.map(c=><option key={c.name}>{c.name}</option>)}
        </select>
        <select value={filterRoom} onChange={e=>setFilterRoom(e.target.value)}
          style={{ border:"1px solid var(--bd2)",borderRadius:20,padding:"5px 12px",fontSize:12,color:"var(--ink)",fontFamily:"inherit",outline:"none",background:"var(--sf)" }}>
          <option value="all">所有教室</option>
          {SCH_ROOMS.map(r=><option key={r}>{r}</option>)}
        </select>
        <div style={{ display:"flex",gap:3,background:"var(--sb)",borderRadius:20,padding:3 }}>
          {[["week","週視圖"],["list","列表"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)}
              style={{ padding:"4px 12px",borderRadius:18,fontSize:12,color:view===v?"var(--ink)":"var(--i3)",background:view===v?"var(--sf)":"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}>{l}</button>
          ))}
        </div>
        <Btn variant="primary" onClick={()=>setModal(true)}>＋ 新增時段</Btn>
      </Topbar>

      <Body>
        {/* 提示列 */}
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14,padding:"9px 14px",
                      background:"var(--sb)",borderRadius:10,fontSize:11,color:"var(--i3)",flexWrap:"wrap" }}>
          <span>💡 排班只需設定教練與時段。學員在前台預約時，系統依其已購方案顯示可選課程，並由學員選擇偏好教練。</span>
          <span style={{ marginLeft:"auto",color:"var(--sage)",flexShrink:0 }}>本週 {openCount} 個開放時段</span>
        </div>

        {/* ── 週視圖 ── */}
        {view==="week" && (
          <div style={{ border:"1px solid var(--bd)",borderRadius:16,overflow:"hidden" }}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:"var(--sb)",borderBottom:"1px solid var(--bd)" }}>
              {SCH_DAYS.map((d,i)=>(
                <div key={d} style={{ padding:"9px 0",textAlign:"center",fontSize:12,fontWeight:500,color:"var(--i2)",borderRight:i<6?"1px solid var(--bd)":"none" }}>
                  週{d}
                  <div style={{ fontSize:10,color:"var(--i3)",marginTop:1 }}>{byDay[d].length} 段</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)" }}>
              {SCH_DAYS.map((d,di)=>(
                <div key={d} style={{ borderRight:di<6?"1px solid var(--bd)":"none",minHeight:240,padding:"6px 5px",background:"var(--sf)" }}>
                  {byDay[d].map(s=>(
                    <div key={s.id} onClick={()=>setEditSlot(s)}
                      style={{ background:s.open?"#F5ECE6":"#F5F4F2",
                               borderLeft:`2.5px solid ${s.open?"#C4957A":"#C8C0B8"}`,
                               borderRadius:7,padding:"6px 7px",marginBottom:5,cursor:"pointer",
                               opacity:s.open?1:.6,transition:"opacity .15s" }}>
                      <div style={{ fontSize:9,color:"var(--i3)",marginBottom:2 }}>{s.start}–{s.end}</div>
                      <CoachChips coaches={s.coaches} small />
                      <div style={{ fontSize:9,color:"var(--i3)",marginTop:3 }}>
                        {s.room!=="不限教室"?s.room:"彈性教室"} · {s.capacity}人
                      </div>
                      {s.note && <div style={{ fontSize:9,color:"#B8924A",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.note}</div>}
                      {!s.open && <div style={{ fontSize:9,color:"#C4726A",marginTop:1 }}>已關閉</div>}
                    </div>
                  ))}
                  <button onClick={()=>setModal(true)}
                    style={{ width:"100%",border:"1px dashed var(--bd2)",borderRadius:7,padding:"5px",background:"none",color:"var(--i3)",fontSize:10,cursor:"pointer",fontFamily:"inherit",marginTop:2 }}>＋</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 列表視圖 ── */}
        {view==="list" && (
          <Card>
            <div style={{ display:"grid",gridTemplateColumns:"52px 110px 1fr 60px 70px 80px 120px",background:"var(--sb)",borderBottom:"1px solid var(--bd)" }}>
              {["星期","時段","指派教練","教室","名額","狀態","操作"].map(h=>(
                <div key={h} style={{ padding:"8px 10px",fontSize:10,color:"var(--i3)",fontWeight:500,letterSpacing:".05em" }}>{h}</div>
              ))}
            </div>
            {filtered
              .sort((a,b)=>SCH_DAYS.indexOf(a.day)-SCH_DAYS.indexOf(b.day)||timeToMin(a.start)-timeToMin(b.start))
              .map((s,i)=>(
                <div key={s.id}
                  style={{ display:"grid",gridTemplateColumns:"52px 110px 1fr 60px 70px 80px 120px",
                           borderBottom:i<filtered.length-1?"1px solid var(--bd)":"none",
                           background:i%2===0?"var(--sf)":"var(--bg)",alignItems:"center",opacity:s.open?1:.7 }}>
                  <div style={{ padding:"11px 10px",fontSize:13,color:"var(--ink)",fontWeight:500 }}>週{s.day}</div>
                  <div style={{ padding:"11px 10px" }}>
                    <div style={{ fontSize:12,color:"var(--ink)" }}>{s.start}</div>
                    <div style={{ fontSize:11,color:"var(--i3)" }}>{s.end}</div>
                    <div style={{ fontSize:10,color:"var(--i3)",marginTop:2 }}>{durLabel(s.start,s.end)}</div>
                  </div>
                  <div style={{ padding:"11px 10px" }}>
                    <CoachChips coaches={s.coaches} />
                    {s.note && <div style={{ fontSize:10,color:"#B8924A",marginTop:4 }}>📌 {s.note}</div>}
                  </div>
                  <div style={{ padding:"11px 10px",fontSize:11,color:"var(--i2)" }}>
                    {s.room==="不限教室"?"彈性":s.room.replace("室","")}
                  </div>
                  <div style={{ padding:"11px 10px",fontSize:13,color:"var(--ink)",fontWeight:500,textAlign:"center" }}>{s.capacity}</div>
                  <div style={{ padding:"11px 10px" }}>
                    <Tag bg={s.open?"var(--ss)":"var(--sb)"} color={s.open?"var(--sm)":"var(--i3)"}>{s.open?"開放中":"已關閉"}</Tag>
                  </div>
                  <div style={{ padding:"11px 8px",display:"flex",gap:4,flexWrap:"wrap" }}>
                    <Btn sm onClick={()=>setEditSlot(s)}>編輯</Btn>
                    <Btn sm onClick={()=>toggleOpen(s.id)} style={{ color:s.open?"var(--coral)":"var(--sm)" }}>{s.open?"關閉":"開放"}</Btn>
                    <Btn sm variant="danger" onClick={()=>handleDel(s.id)}>刪</Btn>
                  </div>
                </div>
              ))}
            {filtered.length===0 && (
              <div style={{ padding:"30px",textAlign:"center",fontSize:13,color:"var(--i3)" }}>目前沒有符合條件的時段</div>
            )}
          </Card>
        )}

        {modal    && <SlotModal onSave={handleAdd}  onClose={()=>setModal(false)} />}
        {editSlot && <SlotModal slot={editSlot} onSave={handleEdit} onClose={()=>setEditSlot(null)} />}
      </Body>
    </Page>
  );
}

// ── 課程庫 ───────────────────────────────────────────────────
export function Courses() {
  const [courses, setCourses] = useState([
    { id:1, name:"器械 1 對 1", type:"solo",  typeLabel:"專屬陪練", color:T.rose, room:"靜心室", dur:60, deduct:1, slots:1, visible:true,  tags:["器械","私教"], desc:"教練全程陪伴，深度調整體態。" },
    { id:2, name:"墊上 1 對 1", type:"solo",  typeLabel:"專屬陪練", color:T.sage, room:"靜心室", dur:60, deduct:1, slots:1, visible:true,  tags:["墊上","私教"], desc:"以自身體重為主，強化核心穩定。" },
    { id:3, name:"墊上 1 對 2", type:"group", typeLabel:"小班共練", color:T.lav,  room:"靜心室", dur:50, deduct:1, slots:1, visible:true,  tags:["墊上","小班"], desc:"與搭檔共同練習，相互激勵。" },
    { id:4, name:"體驗時光",    type:"trial", typeLabel:"初次體驗", color:T.sage, room:"靜心室", dur:50, deduct:0, slots:1, visible:true,  tags:["體驗","新生"], desc:"適合初次接觸皮拉提斯的學員。" },
    { id:5, name:"靜心室借用",  type:"space", typeLabel:"空間借用",  color:T.amb,  room:"靜心室", dur:60, deduct:0, slots:1, visible:false, tags:["空間"], desc:"教室空檔開放借用。" },
  ]);
  const [expanded, setExpanded] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:"", type:"solo", room:"靜心室", dur:60, deduct:1, slots:1, desc:"", tags:"" });
  const fc = (k,v) => setForm(p=>({...p,[k]:v}));
  const [cSearch, setCSearch] = useState("");
  const [cFilters, setCFilters] = useState({ type:"all", room:"all", status:"all" });
  const setCF = (k,v) => setCFilters(p=>({...p,[k]:v}));
  const resetCF = () => { setCSearch(""); setCFilters({ type:"all", room:"all", status:"all" }); };
  const filteredCourses = useMemo(() => courses.filter(c => {
    if (cSearch && !c.name.toLowerCase().includes(cSearch.toLowerCase())) return false;
    if (cFilters.type !== "all" && c.type !== cFilters.type) return false;
    if (cFilters.room !== "all" && c.room !== cFilters.room) return false;
    if (cFilters.status !== "all") {
      if (cFilters.status === "on" && !c.visible) return false;
      if (cFilters.status === "off" && c.visible) return false;
    }
    return true;
  }), [courses, cSearch, cFilters]);

  const typeColors = { solo:[T.rs,T.rm,"專屬陪練"], group:[T.lavs,T.lav,"小班共練"], trial:[T.ss,T.sm,"初次體驗"], space:[T.ambs,T.amb,"空間借用"] };
  const typeIcon   = { solo:"🌸", group:"🌿", trial:"✨", space:"🏠" };

  return (
    <Page>
      <Topbar title="課程庫">
        <Btn variant="primary" onClick={()=>setModal(true)}>＋ 新增課程</Btn>
      </Topbar>
      <Body>
        <FilterBar
          search={cSearch} onSearch={setCSearch} searchPlaceholder="搜尋課程名稱…"
          filters={[
            { key:"type", label:"所有類型", options:[{value:"solo",label:"專屬陪練"},{value:"group",label:"小班共練"},{value:"trial",label:"初次體驗"},{value:"space",label:"空間借用"}] },
            { key:"room", label:"所有教室", options:[{value:"靜心室",label:"靜心室"},{value:"舒活室",label:"舒活室"}] },
            { key:"status", label:"所有狀態", options:[{value:"on",label:"上架中"},{value:"off",label:"已下架"}] },
          ]}
          values={cFilters} onChange={setCF} onReset={resetCF}
          resultCount={filteredCourses.length}
        />
        <Card style={{ marginBottom:16 }}>
          {/* table header */}
          <div style={{ display:"grid",gridTemplateColumns:"32px 36px 1fr 110px 80px 60px 60px 60px 110px 80px",background:T.sb,borderBottom:`1px solid ${T.bd}` }}>
            {["","","課程名稱","類型","教室","時長","扣次","格位","狀態","操作"].map((h,i)=>(
              <div key={i} style={{ padding:"8px 10px",fontSize:10,color:T.i3,fontWeight:500,letterSpacing:".04em" }}>{h}</div>
            ))}
          </div>
          {filteredCourses.map((c,i)=>{
            const [tbg,tfg,tlabel] = typeColors[c.type]||[T.sb,T.i2,""];
            const isExp = expanded === c.id;
            return (
              <div key={c.id}>
                <div style={{ display:"grid",gridTemplateColumns:"32px 36px 1fr 110px 80px 60px 60px 60px 110px 80px",borderBottom:`1px solid ${T.bd}`,background:isExp?T.rs:i%2===0?T.sf:T.bg,alignItems:"center",cursor:"pointer" }}
                  onClick={()=>setExpanded(isExp?null:c.id)}>
                  <div style={{ padding:"10px 8px",textAlign:"center",fontSize:10,color:T.i3 }}>{isExp?"▾":"▸"}</div>
                  <div style={{ padding:"10px 4px",fontSize:18,textAlign:"center" }}>{typeIcon[c.type]}</div>
                  <div style={{ padding:"10px 8px" }}>
                    <div style={{ fontSize:13,color:T.ink,display:"flex",alignItems:"center",gap:7 }}>
                      <div style={{ width:8,height:8,borderRadius:"50%",background:c.color,flexShrink:0 }} />
                      {c.name}
                    </div>
                  </div>
                  <div style={{ padding:"10px 10px" }}><Tag bg={tbg} color={tfg}>{tlabel}</Tag></div>
                  <div style={{ padding:"10px 10px",fontSize:12,color:T.i2 }}>{c.room}</div>
                  <div style={{ padding:"10px 10px",fontSize:12,color:T.i2 }}>{c.dur}分</div>
                  <div style={{ padding:"10px 10px",fontSize:12,color:T.i2 }}>{c.deduct||"—"}</div>
                  <div style={{ padding:"10px 10px",fontSize:12,color:T.i2 }}>{c.slots}</div>
                  <div style={{ padding:"10px 10px" }}>
                    <button onClick={e=>{ e.stopPropagation(); setCourses(p=>p.map(x=>x.id===c.id?{...x,visible:!x.visible}:x)); }}
                      style={{ display:"flex",alignItems:"center",gap:5,border:"none",background:"none",cursor:"pointer",padding:0 }}>
                      <div style={{ width:30,height:16,borderRadius:8,background:c.visible?T.sage:T.sand3,position:"relative",transition:"background .2s",flexShrink:0 }}>
                        <div style={{ position:"absolute",top:2,left:c.visible?14:2,width:12,height:12,borderRadius:"50%",background:"#fff",transition:"left .2s" }} />
                      </div>
                      <span style={{ fontSize:10,color:T.i3 }}>{c.visible?"上架":"下架"}</span>
                    </button>
                  </div>
                  <div style={{ padding:"10px 10px",display:"flex",gap:4 }}>
                    <Btn sm>編輯</Btn>
                  </div>
                </div>
                {/* expanded detail */}
                {isExp && (
                  <div style={{ background:T.rs,borderBottom:`1px solid ${T.bd}`,padding:"14px 16px 14px 60px" }}>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
                      <div>
                        <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>課程說明</div>
                        <div style={{ fontSize:12,color:T.i2,lineHeight:1.6 }}>{c.desc}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>分類標籤</div>
                        <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                          {c.tags.map(tag=>(
                            <span key={tag} style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:T.sf,color:T.i2 }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>關聯方案</div>
                        <button style={{ fontSize:11,padding:"4px 12px",borderRadius:12,border:`1px solid ${T.rose}`,background:T.sf,color:T.rm,cursor:"pointer",fontFamily:"inherit" }}>+ 關聯方案</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Card>

        {/* new course modal */}
        {modal && (
          <div onClick={()=>setModal(false)} style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(3px)" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:T.sf,borderRadius:20,padding:24,width:460,maxWidth:"92vw",border:`1px solid ${T.bd}` }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
                <span style={{ fontSize:14,fontWeight:500,color:T.ink }}>新增課程</span>
                <button onClick={()=>setModal(false)} style={{ background:"none",border:"none",fontSize:18,color:T.i3,cursor:"pointer" }}>✕</button>
              </div>
              {[["課程名稱","name","例：器械 1 對 1"],["課程說明","desc","簡短描述這門課程的內容"]].map(([l,k,ph])=>(
                <div key={k} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>{l}</div>
                  <input placeholder={ph} value={form[k]} onChange={e=>fc(k,e.target.value)}
                    style={{ width:"100%",border:"none",borderBottom:`1px solid ${T.bd2}`,padding:"7px 0",fontSize:13,color:T.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
                </div>
              ))}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>課程類型</div>
                  <select value={form.type} onChange={e=>fc("type",e.target.value)} style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"8px 10px",fontSize:13,color:T.ink,fontFamily:"inherit",outline:"none" }}>
                    <option value="solo">專屬陪練</option><option value="group">小班共練</option>
                    <option value="trial">初次體驗</option><option value="space">空間借用</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>教室</div>
                  <select value={form.room} onChange={e=>fc("room",e.target.value)} style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"8px 10px",fontSize:13,color:T.ink,fontFamily:"inherit",outline:"none" }}>
                    <option>靜心室</option><option>舒活室</option>
                  </select>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14 }}>
                {[["時長（分鐘）","dur","60"],["扣除次數","deduct","1"],["格位數","slots","1"]].map(([l,k,ph])=>(
                  <div key={k}>
                    <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>{l}</div>
                    <input type="number" min="0" placeholder={ph} value={form[k]} onChange={e=>fc(k,Number(e.target.value))}
                      style={{ width:"100%",border:"none",borderBottom:`1px solid ${T.bd2}`,padding:"7px 0",fontSize:13,color:T.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>分類標籤（用逗號分隔）</div>
                <input placeholder="器械, 私教" value={form.tags} onChange={e=>fc("tags",e.target.value)}
                  style={{ width:"100%",border:"none",borderBottom:`1px solid ${T.bd2}`,padding:"7px 0",fontSize:13,color:T.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
              </div>
              <div style={{ display:"flex",justifyContent:"flex-end",gap:8,paddingTop:14,borderTop:`1px solid ${T.bd}` }}>
                <Btn onClick={()=>setModal(false)}>取消</Btn>
                <Btn variant="primary" onClick={()=>{ if(form.name){ const [tbg,tfg,tl]=typeColors[form.type]||[T.sb,T.i2,""]; setCourses(p=>[...p,{ id:Date.now(),...form,typeLabel:tl,color:T.rose,visible:true,tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean) }]); setModal(false); setForm({ name:"",type:"solo",room:"靜心室",dur:60,deduct:1,slots:1,desc:"",tags:"" }); } }}>新增課程</Btn>
              </div>
            </div>
          </div>
        )}
      </Body>
    </Page>
  );
}

// ── 教練管理 ─────────────────────────────────────────────────
// ── 教練管理 ─────────────────────────────────────────────────
const AV_PAL = [
  { bg:"#F5ECE6",color:"#A87A62" },{ bg:"#EEF2F6",color:"#8A9BAE" },
  { bg:"#F0EDF5",color:"#9B8FAE" },{ bg:"#EAF2EF",color:"#5C7D6F" },
  { bg:"#F5EDD8",color:"#B8924A" },
];
const STUDIOS = ["S.T Pilates","CoreFit Studio","Body Lab"];
const emptyCoachForm = () => ({
  name:"", phone:"", email:"", instagram:"", bio:"", title:"", exp:"",
  studios:["S.T Pilates"], skills:[], skillInput:"", photo:null,
});

function CoachModal({ coach, onSave, onClose }) {
  const isEdit = !!coach;
  const [form, setForm] = useState(isEdit ? {
    ...coach, skillInput:"", studios: coach.studios || [coach.studio||"S.T Pilates"],
  } : emptyCoachForm());
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const toggleStudio = (s) => f("studios", form.studios.includes(s) ? form.studios.filter(x=>x!==s) : [...form.studios,s]);

  const addSkill = (e) => {
    if(e.key==="Enter" && form.skillInput.trim()) {
      e.preventDefault();
      const val = form.skillInput.trim();
      if(!form.skills.includes(val)) f("skills",[...form.skills,val]);
      f("skillInput","");
    }
  };
  const removeSkill = (sk) => f("skills", form.skills.filter(x=>x!==sk));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => f("photo", ev.target.result);
    reader.readAsDataURL(file);
  };

  const canSave = form.name.trim();
  const mInp = { width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"9px 11px",fontSize:13,color:T.ink,fontFamily:"inherit",outline:"none",background:T.sf,boxSizing:"border-box" };
  const mLbl = { fontSize:11,color:T.i3,letterSpacing:".05em",marginBottom:5,display:"block" };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.4)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:300,
               backdropFilter:"blur(4px)",fontFamily:"'Noto Sans TC',sans-serif",padding:"16px 0" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:T.sf,borderRadius:20,width:480,maxWidth:"94vw",
                 maxHeight:"90vh",overflowY:"auto",border:`1px solid ${T.bd}`,
                 boxShadow:"0 8px 40px rgba(58,53,48,.15)" }}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"18px 22px 14px",borderBottom:`1px solid ${T.bd}`,
                      position:"sticky",top:0,background:T.sf,zIndex:1,borderRadius:"20px 20px 0 0" }}>
          <span style={{ fontSize:15,fontWeight:600,color:T.ink }}>{isEdit?"編輯教練":"新增教練"}</span>
          <button onClick={onClose} style={{ background:"none",border:`1px solid ${T.bd2}`,borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:T.i3,cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ padding:"20px 22px" }}>
          {/* 教練照片 */}
          <div style={{ marginBottom:20 }}>
            <span style={mLbl}>教練照片</span>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10 }}>
              <label style={{ cursor:"pointer" }}>
                <input type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }} />
                <div style={{ width:90,height:90,borderRadius:"50%",background:form.photo?"transparent":T.lavs,
                              display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",
                              border:`2px dashed ${T.bd2}`,transition:"border-color .2s" }}>
                  {form.photo
                    ? <img src={form.photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                    : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.lav||"#9B8FAE"} strokeWidth="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  }
                </div>
              </label>
              <span style={{ fontSize:11,color:T.i3 }}>※ 建議尺寸不低於 200×200 像素，比例 1:1 為佳</span>
            </div>
          </div>

          {/* 教練名稱 */}
          <div style={{ marginBottom:14 }}>
            <span style={mLbl}>教練名稱<span style={{ color:"#C4726A",marginLeft:2 }}>*</span></span>
            <input value={form.name} onChange={e=>f("name",e.target.value)} placeholder="教練姓名" style={mInp} />
          </div>

          {/* 上課場館 */}
          <div style={{ marginBottom:14 }}>
            <span style={mLbl}>上課場館</span>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {STUDIOS.map(s=>(
                <label key={s} style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer" }}>
                  <div onClick={()=>toggleStudio(s)}
                    style={{ width:18,height:18,borderRadius:4,border:`1.5px solid ${form.studios.includes(s)?"#4CAF50":T.bd2}`,
                             background:form.studios.includes(s)?"#4CAF50":"transparent",
                             display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer" }}>
                    {form.studios.includes(s) && <span style={{ color:"#fff",fontSize:11,lineHeight:1 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:13,color:T.ink }}>{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 聯絡電話 */}
          <div style={{ marginBottom:14 }}>
            <span style={mLbl}>聯絡電話</span>
            <input value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="09xx-xxx-xxx" style={mInp} />
          </div>

          {/* 電子信箱 */}
          <div style={{ marginBottom:14 }}>
            <span style={mLbl}>電子信箱</span>
            <input type="email" value={form.email} onChange={e=>f("email",e.target.value)} placeholder="coach@example.com" style={mInp} />
          </div>

          {/* Instagram */}
          <div style={{ marginBottom:14 }}>
            <span style={mLbl}>Instagram</span>
            <input value={form.instagram} onChange={e=>f("instagram",e.target.value)} placeholder="請輸入 IG 連結" style={mInp} />
          </div>

          {/* 個人簡介 */}
          <div style={{ marginBottom:14 }}>
            <span style={mLbl}>個人簡介</span>
            <textarea value={form.bio} onChange={e=>f("bio",e.target.value)} rows={4}
              placeholder="介紹教練背景、教學風格…"
              style={{ ...mInp,resize:"vertical",lineHeight:1.6 }} />
          </div>

          {/* 教學專長 */}
          <div style={{ marginBottom:4 }}>
            <span style={mLbl}>教學專長</span>
            <input value={form.skillInput} onChange={e=>f("skillInput",e.target.value)} onKeyDown={addSkill}
              placeholder="輸入後按 Enter 新增" style={mInp} />
            <div style={{ fontSize:11,color:T.i3,marginTop:4 }}>* 輸入後按 Enter 新增</div>
            {form.skills.length > 0 && (
              <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:10 }}>
                {form.skills.map(sk=>(
                  <span key={sk} style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,padding:"3px 10px",borderRadius:20,background:T.rs,color:T.rm }}>
                    {sk}
                    <button onClick={()=>removeSkill(sk)}
                      style={{ background:"none",border:"none",cursor:"pointer",color:T.rm,fontSize:12,lineHeight:1,padding:0 }}>✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:"flex",gap:10,padding:"14px 22px",borderTop:`1px solid ${T.bd}`,
                      position:"sticky",bottom:0,background:T.sf,borderRadius:"0 0 20px 20px" }}>
          <button onClick={onClose}
            style={{ flex:1,padding:"11px",borderRadius:12,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
            取消
          </button>
          <button disabled={!canSave} onClick={()=>canSave&&onSave(form)}
            style={{ flex:2,padding:"11px",borderRadius:12,border:"none",
                     background:canSave?"#4CAF50":"#ccc",color:"#fff",
                     fontSize:13,fontWeight:600,cursor:canSave?"pointer":"not-allowed",fontFamily:"inherit" }}>
            {isEdit?"儲存變更":"儲存"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteCoachModal({ coach, onConfirm, onClose }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.45)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:400,
               backdropFilter:"blur(4px)",fontFamily:"'Noto Sans TC',sans-serif" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:T.sf,borderRadius:20,padding:"28px 26px",width:340,maxWidth:"90vw",
                 border:`1px solid ${T.bd}`,boxShadow:"0 8px 40px rgba(58,53,48,.18)",textAlign:"center" }}>
        <div style={{ fontSize:32,marginBottom:12 }}>🗑</div>
        <div style={{ fontSize:15,fontWeight:600,color:T.ink,marginBottom:8 }}>確定移除教練？</div>
        <div style={{ fontSize:13,color:T.i3,lineHeight:1.7,marginBottom:22 }}>
          將永久移除 <strong style={{ color:T.ink }}>{coach.name}</strong> 的所有資料，<br/>此操作無法復原。
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={onClose}
            style={{ flex:1,padding:"10px",borderRadius:12,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
            取消
          </button>
          <button onClick={onConfirm}
            style={{ flex:1,padding:"10px",borderRadius:12,border:"none",background:"#C4726A",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            確定移除
          </button>
        </div>
      </div>
    </div>
  );
}

export function Coaches() {
  const [coaches, setCoaches] = useState([
    { id:1, name:"Sammi", initial:"S", bg:T.rs, color:T.rm, photo:null, studios:["S.T Pilates"], phone:"0912-000-001", email:"sammi@stpilates.com", instagram:"@sammi_pilates", bio:"專注於脊椎矯正與核心肌群訓練，每位學員都能感受到細緻的陪伴。", skills:["器械","墊上","復健"], title:"資深皮拉提斯教練", exp:"8年", sessions:42, members:12, visible:true,  salary:{ type:"per_session", amount:800 } },
    { id:2, name:"Annie", initial:"A", bg:T.mists, color:T.mist, photo:null, studios:["S.T Pilates"], phone:"0933-000-002", email:"annie@stpilates.com", instagram:"", bio:"結合瑜珈與皮拉提斯，幫助學員找回身體的自然平衡。", skills:["墊上","瑜珈"], title:"瑜珈暨皮拉提斯教練", exp:"5年", sessions:18, members:5,  visible:false, salary:{ type:"per_session", amount:700 } },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("cards"); // cards | list
  const [coachSearch, setCoachSearch] = useState("");
  const [coachFilters, setCoachFilters] = useState({ status:"all", studio:"all" });
  const setCoachF = (k,v) => setCoachFilters(p=>({...p,[k]:v}));
  const resetCoachF = () => { setCoachSearch(""); setCoachFilters({ status:"all", studio:"all" }); };
  const filteredCoaches = useMemo(() => coaches.filter(c => {
    if (coachSearch && !c.name.toLowerCase().includes(coachSearch.toLowerCase())) return false;
    if (coachFilters.status !== "all") {
      if (coachFilters.status === "shown" && !c.visible) return false;
      if (coachFilters.status === "hidden" && c.visible) return false;
    }
    if (coachFilters.studio !== "all" && !(c.studios||[]).includes(coachFilters.studio)) return false;
    return true;
  }), [coaches, coachSearch, coachFilters]);
  const [addModal,    setAddModal]    = useState(false);
  const [editModal,   setEditModal]   = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [salaryModal, setSalaryModal] = useState(null);
  const [recordModal, setRecordModal] = useState(null);

  const selectedCoach = coaches.find(c=>c.id===selectedId) || null;
  const nextId = Math.max(...coaches.map(c=>c.id), 0) + 1;

  const handleAdd = (form) => {
    const pal = AV_PAL[nextId % AV_PAL.length];
    setCoaches(p=>[...p, {
      ...form, id:nextId, initial:form.name[0]||"新",
      bg:pal.bg, color:pal.color,
      sessions:0, members:0, visible:true,
      salary:{ type:"per_session", amount:800 },
    }]);
    setAddModal(false);
  };

  const handleEdit = (form) => {
    setCoaches(p=>p.map(c=>c.id===selectedId ? { ...c, ...form } : c));
    setEditModal(false);
  };

  const handleDelete = () => {
    setCoaches(p=>p.filter(c=>c.id!==selectedId));
    setSelectedId(null);
    setDeleteModal(false);
  };

  const toggleVisible = (id, e) => {
    e.stopPropagation();
    setCoaches(p=>p.map(c=>c.id===id?{...c,visible:!c.visible}:c));
  };

  return (
    <Page>
      <Topbar title="教練">
        <div style={{ display:"flex",gap:3,background:T.sb,borderRadius:20,padding:3 }}>
          {[["cards","卡片"],["list","列表"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)}
              style={{ padding:"4px 12px",borderRadius:18,fontSize:12,color:view===v?T.ink:T.i3,background:view===v?T.sf:"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}>{l}</button>
          ))}
        </div>
        <Btn variant="primary" onClick={()=>setAddModal(true)}>＋ 新增教練</Btn>
      </Topbar>
      <Body>
        <FilterBar
          search={coachSearch} onSearch={setCoachSearch} searchPlaceholder="搜尋教練名稱…"
          filters={[
            { key:"status", label:"所有狀態", options:[{value:"shown",label:"顯示中"},{value:"hidden",label:"已隱藏"}] },
            { key:"studio", label:"所有場館", options:[{value:"S.T Pilates",label:"S.T Pilates"},{value:"CoreFit Studio",label:"CoreFit Studio"}] },
          ]}
          values={coachFilters} onChange={setCoachF} onReset={resetCoachF}
          resultCount={filteredCoaches.length}
        />
        <div style={{ display:"grid", gridTemplateColumns: selectedCoach ? "1fr 320px" : "1fr", gap:14, alignItems:"start" }}>

          {/* 教練卡片區 */}
          {view==="cards" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, alignContent:"start" }}>
            {filteredCoaches.map(c=>(
              <Card key={c.id} style={{ padding:"18px", cursor:"pointer", border:`1.5px solid ${selectedId===c.id?c.color:T.bd}`, transition:"border-color .15s" }}
                onClick={()=>setSelectedId(selectedId===c.id?null:c.id)}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                  {/* Avatar / Photo */}
                  <div style={{ width:44,height:44,borderRadius:"50%",background:c.bg,color:c.color,
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontSize:18,fontWeight:300,flexShrink:0,overflow:"hidden" }}>
                    {c.photo
                      ? <img src={c.photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                      : c.initial}
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:14,color:T.ink,fontWeight:400 }}>{c.name}</div>
                    <div style={{ fontSize:11,color:T.i3,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{c.title||"教練"}</div>
                  </div>
                </div>

                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                  <Tag bg={c.visible?T.ss:T.sb} color={c.visible?T.sm:T.i3}>{c.visible?"顯示中":"暫時隱藏"}</Tag>
                  <button onClick={e=>toggleVisible(c.id,e)}
                    style={{ fontSize:10,color:c.visible?T.coral:T.sm,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}>
                    {c.visible?"隱藏":"顯示"}
                  </button>
                </div>

                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10 }}>
                  <div style={{ background:T.bg,borderRadius:9,padding:"8px 10px" }}>
                    <div style={{ fontSize:16,fontWeight:300,color:T.ink }}>{c.sessions}</div>
                    <div style={{ fontSize:10,color:T.i3 }}>本月場次</div>
                  </div>
                  <div style={{ background:T.bg,borderRadius:9,padding:"8px 10px" }}>
                    <div style={{ fontSize:16,fontWeight:300,color:T.ink }}>{c.members}</div>
                    <div style={{ fontSize:10,color:T.i3 }}>學員數</div>
                  </div>
                </div>

                {c.skills.length>0 && (
                  <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:10 }}>
                    {c.skills.map(sk=><span key={sk} style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:T.sb,color:T.i2 }}>{sk}</span>)}
                  </div>
                )}

                <div style={{ display:"flex",gap:6,paddingTop:10,borderTop:`1px solid ${T.bd}` }}>
                  <Btn sm onClick={e=>{ e.stopPropagation(); setRecordModal(c); }}>薪資紀錄</Btn>
                  <Btn sm onClick={e=>{ e.stopPropagation(); setSalaryModal(c); }}>計薪設定</Btn>
                  <Btn sm onClick={e=>{ e.stopPropagation(); setSelectedId(c.id); setEditModal(true); }}>編輯</Btn>
                  <Btn sm variant="danger" onClick={e=>{ e.stopPropagation(); setSelectedId(c.id); setDeleteModal(true); }}>移除</Btn>
                </div>
              </Card>
            ))}

            {/* 新增卡片 */}
            <div onClick={()=>setAddModal(true)}
              style={{ background:T.sf,border:`1px dashed ${T.bd2}`,borderRadius:16,
                       display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                       minHeight:200,cursor:"pointer",gap:8,color:T.i3,fontSize:12 }}>
              <span style={{ fontSize:22 }}>＋</span>新增教練
            </div>
          </div>
          )}

          {/* 教練列表區 */}
          {view==="list" && (
          <Card>
            <div style={{ display:"grid",gridTemplateColumns:"44px 1.4fr 96px 70px 60px 1fr 232px",background:T.sb,borderBottom:`1px solid ${T.bd}` }}>
              {["","教練","狀態","本月場次","學員數","教學專長",""].map((h,i)=>(
                <div key={i} style={{ padding:"9px 10px",fontSize:10,color:T.i3,fontWeight:500,letterSpacing:".05em" }}>{h}</div>
              ))}
            </div>
            {filteredCoaches.length===0 ? (
              <div style={{ padding:"40px",textAlign:"center",color:T.i3,fontSize:13 }}>沒有符合條件的教練</div>
            ) : filteredCoaches.map((c,i)=>(
              <div key={c.id}
                style={{ display:"grid",gridTemplateColumns:"44px 1.4fr 96px 70px 60px 1fr 232px",
                         borderBottom:i<filteredCoaches.length-1?`1px solid ${T.bd}`:"none",
                         background:selectedId===c.id?T.rs:i%2===0?T.sf:T.bg,alignItems:"center",
                         cursor:"pointer",transition:"background .1s" }}
                onClick={()=>setSelectedId(selectedId===c.id?null:c.id)}>
                {/* 頭像 */}
                <div style={{ padding:"10px 8px" }}>
                  <div style={{ width:30,height:30,borderRadius:"50%",background:c.bg,color:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:300,overflow:"hidden",flexShrink:0 }}>
                    {c.photo
                      ? <img src={c.photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                      : c.initial}
                  </div>
                </div>
                {/* 名稱 + 職稱 */}
                <div style={{ padding:"10px 10px",minWidth:0 }}>
                  <div style={{ fontSize:13,color:T.ink,fontWeight:500 }}>{c.name}</div>
                  <div style={{ fontSize:10,color:T.i3,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{c.title||"教練"}</div>
                </div>
                {/* 狀態 */}
                <div style={{ padding:"10px 10px",display:"flex",alignItems:"center",gap:6 }}>
                  <Tag bg={c.visible?T.ss:T.sb} color={c.visible?T.sm:T.i3}>{c.visible?"顯示中":"隱藏"}</Tag>
                  <button onClick={e=>toggleVisible(c.id,e)}
                    style={{ fontSize:10,color:c.visible?T.coral:T.sm,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}>
                    {c.visible?"隱藏":"顯示"}
                  </button>
                </div>
                {/* 本月場次 */}
                <div style={{ padding:"10px 10px",fontSize:13,color:T.i2 }}>{c.sessions}</div>
                {/* 學員數 */}
                <div style={{ padding:"10px 10px",fontSize:13,color:T.i2 }}>{c.members}</div>
                {/* 教學專長 */}
                <div style={{ padding:"10px 10px",display:"flex",gap:4,flexWrap:"wrap" }}>
                  {c.skills.slice(0,3).map(sk=><span key={sk} style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:T.sb,color:T.i2 }}>{sk}</span>)}
                </div>
                {/* 操作 */}
                <div style={{ padding:"8px 8px",display:"flex",gap:5,flexWrap:"wrap" }}>
                  <Btn sm onClick={e=>{ e.stopPropagation(); setRecordModal(c); }}>薪資紀錄</Btn>
                  <Btn sm onClick={e=>{ e.stopPropagation(); setSalaryModal(c); }}>計薪設定</Btn>
                  <Btn sm onClick={e=>{ e.stopPropagation(); setSelectedId(c.id); setEditModal(true); }}>編輯</Btn>
                  <Btn sm variant="danger" onClick={e=>{ e.stopPropagation(); setSelectedId(c.id); setDeleteModal(true); }}>移除</Btn>
                </div>
              </div>
            ))}
          </Card>
          )}

          {/* 右側詳情 */}
          {selectedCoach && (
            <Card style={{ padding:"18px",height:"fit-content" }}>
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:48,height:48,borderRadius:"50%",background:selectedCoach.bg,color:selectedCoach.color,
                                display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,overflow:"hidden",flexShrink:0 }}>
                    {selectedCoach.photo
                      ? <img src={selectedCoach.photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                      : selectedCoach.initial}
                  </div>
                  <div>
                    <div style={{ fontSize:15,color:T.ink }}>{selectedCoach.name}</div>
                    <div style={{ fontSize:11,color:T.i3 }}>{selectedCoach.exp&&`${selectedCoach.exp} · `}{selectedCoach.title||"教練"}</div>
                  </div>
                </div>
                <button onClick={()=>setSelectedId(null)} style={{ background:"none",border:"none",fontSize:16,color:T.i3,cursor:"pointer" }}>✕</button>
              </div>

              {/* 聯絡資訊 */}
              {(selectedCoach.phone||selectedCoach.email||selectedCoach.instagram) && (
                <div style={{ marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.bd}` }}>
                  {selectedCoach.phone    && <InfoLine icon="📞" text={selectedCoach.phone} />}
                  {selectedCoach.email    && <InfoLine icon="✉" text={selectedCoach.email} />}
                  {selectedCoach.instagram && <InfoLine icon="📷" text={selectedCoach.instagram} />}
                </div>
              )}

              {/* 場館 */}
              {selectedCoach.studios?.length>0 && (
                <div style={{ marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.bd}` }}>
                  <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:6 }}>上課場館</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                    {selectedCoach.studios.map(st=>(
                      <span key={st} style={{ fontSize:11,padding:"3px 10px",borderRadius:10,background:T.ss,color:T.sm }}>{st}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* 簡介 */}
              {selectedCoach.bio && (
                <div style={{ marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.bd}` }}>
                  <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>個人簡介</div>
                  <div style={{ fontSize:12,color:T.i2,lineHeight:1.7 }}>{selectedCoach.bio}</div>
                </div>
              )}

              {/* 教學專長 */}
              {selectedCoach.skills.length>0 && (
                <div style={{ marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.bd}` }}>
                  <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:8 }}>教學專長</div>
                  <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                    {selectedCoach.skills.map(sk=>(
                      <span key={sk} style={{ fontSize:11,padding:"3px 10px",borderRadius:10,background:selectedCoach.bg,color:selectedCoach.color }}>{sk}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* 數據 */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
                <div style={{ background:T.bg,borderRadius:9,padding:"10px 12px" }}>
                  <div style={{ fontSize:18,fontWeight:300,color:T.ink }}>{selectedCoach.sessions}</div>
                  <div style={{ fontSize:10,color:T.i3 }}>本月場次</div>
                </div>
                <div style={{ background:T.bg,borderRadius:9,padding:"10px 12px" }}>
                  <div style={{ fontSize:18,fontWeight:300,color:T.ink }}>{selectedCoach.members}</div>
                  <div style={{ fontSize:10,color:T.i3 }}>學員數</div>
                </div>
              </div>

              <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:4 }}>薪資計算方式</div>
              <div style={{ fontSize:12,color:T.i2,marginBottom:14 }}>
                {selectedCoach.salary?.type==="fixed" ? `固定 $${(selectedCoach.salary?.amount||0).toLocaleString()} 元／堂` : selectedCoach.salary?.type==="per_head" ? `基本 $${selectedCoach.salary?.perHeadBase||0}＋每人 $${selectedCoach.salary?.perHeadExtra||0}` : `$${(selectedCoach.salary?.amount||0).toLocaleString()} 元／場`}
              </div>

              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                <Btn onClick={()=>setEditModal(true)}>編輯</Btn>
                <Btn onClick={()=>setSalaryModal(selectedCoach)}>計薪設定</Btn>
                <Btn variant="primary" onClick={()=>setRecordModal(selectedCoach)}>薪資紀錄</Btn>
              </div>
            </Card>
          )}
        </div>

        {/* 新增 / 編輯 Modal */}
        {addModal  && <CoachModal onSave={handleAdd}  onClose={()=>setAddModal(false)} />}
        {editModal && selectedCoach && <CoachModal coach={selectedCoach} onSave={handleEdit} onClose={()=>setEditModal(false)} />}
        {deleteModal && selectedCoach && <DeleteCoachModal coach={selectedCoach} onConfirm={handleDelete} onClose={()=>setDeleteModal(false)} />}

        {/* 薪資計算方式 Modal */}
        {salaryModal && (
          <SalaryEditModal
            coach={salaryModal}
            onSave={(updated) => {
              setCoaches(p=>p.map(c=>c.id===updated.id?updated:c));
              setSalaryModal(null);
            }}
            onClose={()=>setSalaryModal(null)}
          />
        )}
        {/* 薪資紀錄 Modal */}
        {recordModal && (
          <SalaryRecordModal coach={recordModal} onClose={()=>setRecordModal(null)} />
        )}
      </Body>
    </Page>
  );
}

function InfoLine({ icon, text }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#6E6358",marginBottom:4 }}>
      <span style={{ fontSize:13 }}>{icon}</span>{text}
    </div>
  );
}

// ── 薪資紀錄 Modal ────────────────────────────────────────────
const WEEKDAYS = ["日","一","二","三","四","五","六"];
const SALARY_MOCK = {
  1: [
    { id:1, course:"1對1墊上皮拉提斯體驗課", date:"2026-07-01", weekday:3, start:"16:00", end:"16:50", method:"fixed", methodName:"鐘點費", booked:1, attended:0, capacity:1, fee:0 },
    { id:2, course:"1對1器械皮拉提斯",       date:"2026-07-02", weekday:4, start:"17:00", end:"18:00", method:"fixed", methodName:"鐘點費", booked:1, attended:0, capacity:1, fee:0 },
    { id:3, course:"1對1器械皮拉提斯",       date:"2026-07-07", weekday:2, start:"17:30", end:"18:30", method:"fixed", methodName:"鐘點費", booked:1, attended:0, capacity:1, fee:0 },
    { id:4, course:"1對1器械皮拉提斯",       date:"2026-07-08", weekday:3, start:"16:00", end:"17:00", method:"fixed", methodName:"鐘點費", booked:1, attended:0, capacity:1, fee:0 },
    { id:5, course:"1對1器械體驗課",         date:"2026-07-08", weekday:3, start:"18:00", end:"18:50", method:"fixed", methodName:"鐘點費", booked:1, attended:0, capacity:1, fee:0 },
    { id:6, course:"1對1器械皮拉提斯",       date:"2026-07-10", weekday:5, start:"10:00", end:"11:00", method:"fixed", methodName:"鐘點費", booked:1, attended:1, capacity:1, fee:800 },
    { id:7, course:"1對1墊上皮拉提斯",       date:"2026-07-14", weekday:2, start:"14:00", end:"15:00", method:"fixed", methodName:"鐘點費", booked:1, attended:1, capacity:1, fee:800 },
    { id:8, course:"1對1器械皮拉提斯",       date:"2026-07-15", weekday:3, start:"17:00", end:"18:00", method:"fixed", methodName:"鐘點費", booked:1, attended:1, capacity:1, fee:800 },
    { id:9, course:"小班共練",               date:"2026-07-16", weekday:4, start:"19:00", end:"20:00", method:"per_head", methodName:"鐘點費", booked:2, attended:2, capacity:2, fee:700 },
    { id:10,course:"1對1器械皮拉提斯",       date:"2026-07-21", weekday:2, start:"17:30", end:"18:30", method:"fixed", methodName:"鐘點費", booked:1, attended:1, capacity:1, fee:800 },
  ],
  2: [
    { id:1, course:"1對1器械皮拉提斯", date:"2026-06-03", weekday:3, start:"10:00", end:"11:00", method:"fixed", methodName:"鐘點費", booked:1, attended:1, capacity:1, fee:700 },
    { id:2, course:"1對1墊上皮拉提斯", date:"2026-06-10", weekday:3, start:"14:00", end:"15:00", method:"fixed", methodName:"鐘點費", booked:1, attended:1, capacity:1, fee:700 },
    { id:3, course:"小班共練",          date:"2026-06-17", weekday:3, start:"19:00", end:"20:00", method:"per_head", methodName:"鐘點費", booked:2, attended:2, capacity:2, fee:500 },
  ],
};

const PAGE_SIZE = 5;

function SalaryRecordModal({ coach, onClose }) {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const [month, setMonth] = useState(defaultMonth);
  const [page,  setPage]  = useState(1);

  const allRecords = SALARY_MOCK[coach.id] || [];

  const filtered = allRecords.filter(r => r.date.startsWith(month));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const totalSessions = filtered.filter(r=>r.attended>0).length;
  const totalFee = filtered.reduce((s,r)=>s+r.fee, 0);

  // generate month options: current month + 12 months back
  const monthOptions = Array.from({length:13},(_,i)=>{
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  });

  const MethodBadge = ({ method }) => (
    <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",
                   fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:5,
                   background:"#4CAF50",color:"#fff",marginRight:6,flexShrink:0 }}>
      {method==="fixed"?"固定":"依人"}
    </span>
  );

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.4)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:400,
               backdropFilter:"blur(4px)",fontFamily:"'Noto Sans TC',sans-serif",padding:"16px 0" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:"#FFFFFF",borderRadius:16,width:700,maxWidth:"96vw",
                 maxHeight:"88vh",display:"flex",flexDirection:"column",
                 border:"1px solid #EAE4DC",boxShadow:"0 8px 40px rgba(58,53,48,.15)" }}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"18px 24px 14px",borderBottom:"1px solid #EAE4DC",flexShrink:0 }}>
          <span style={{ fontSize:15,fontWeight:600,color:"#3A3530" }}>教練薪資紀錄</span>
          <button onClick={onClose}
            style={{ background:"none",border:"1px solid #D6CCC0",borderRadius:"50%",
                     width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",
                     fontSize:13,color:"#A89E94",cursor:"pointer" }}>✕</button>
        </div>

        {/* Toolbar */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"14px 24px",borderBottom:"1px solid #EAE4DC",flexShrink:0,flexWrap:"wrap",gap:10 }}>
          {/* 月份選擇 */}
          <select value={month} onChange={e=>{ setMonth(e.target.value); setPage(1); }}
            style={{ border:"1px solid #D6CCC0",borderRadius:9,padding:"7px 12px",fontSize:13,
                     color:"#3A3530",fontFamily:"inherit",outline:"none",background:"#fff",cursor:"pointer" }}>
            {monthOptions.map(m=><option key={m}>{m}</option>)}
          </select>

          {/* 統計 chips */}
          <div style={{ display:"flex",gap:8 }}>
            <div style={{ border:"1px solid #D6CCC0",borderRadius:20,padding:"6px 14px",fontSize:12,color:"#7A6E68",display:"flex",gap:6,alignItems:"center" }}>
              上課堂數：<strong style={{ color:"#4CAF50",fontSize:14 }}>{totalSessions}</strong>
            </div>
            <div style={{ border:"1px solid #D6CCC0",borderRadius:20,padding:"6px 14px",fontSize:12,color:"#7A6E68",display:"flex",gap:6,alignItems:"center" }}>
              薪資總計：<strong style={{ color:"#4CAF50",fontSize:14 }}>{totalFee.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1.2fr 1.2fr 0.8fr",
                      padding:"10px 24px",background:"#F5F4F2",
                      fontSize:12,fontWeight:500,color:"#7A6E68",gap:8,flexShrink:0 }}>
          <span>課程名稱</span>
          <span>計算方式</span>
          <span>預約／出席／名額</span>
          <span style={{ textAlign:"right" }}>鐘點費</span>
        </div>

        {/* Table body */}
        <div style={{ flex:1,overflowY:"auto" }}>
          {paged.length === 0 ? (
            <div style={{ padding:"40px",textAlign:"center",color:"#A89E94",fontSize:13 }}>
              本月無課程紀錄
            </div>
          ) : paged.map((r,i)=>(
            <div key={r.id}
              style={{ display:"grid",gridTemplateColumns:"2fr 1.2fr 1.2fr 0.8fr",
                       padding:"13px 24px",borderBottom:"1px solid #EAE4DC",
                       alignItems:"center",gap:8,
                       background: i%2===0?"#FFFFFF":"#FAFAF8" }}>
              {/* 課程名稱 + 時間 */}
              <div>
                <div style={{ fontSize:13,fontWeight:500,color:"#3A3530",marginBottom:2 }}>{r.course}</div>
                <div style={{ fontSize:11,color:"#A89E94" }}>
                  {r.date}（{WEEKDAYS[r.weekday]}）　{r.start}～{r.end}
                </div>
              </div>
              {/* 計算方式 */}
              <div style={{ display:"flex",alignItems:"center" }}>
                <MethodBadge method={r.method} />
                <span style={{ fontSize:12,color:"#6E6358" }}>{r.methodName}</span>
              </div>
              {/* 預約/出席/名額 */}
              <div style={{ fontSize:13 }}>
                <span style={{ color: r.booked>0?"#E8943A":"#A89E94" }}>{r.booked}</span>
                <span style={{ color:"#D6CCC0",margin:"0 4px" }}>/</span>
                <span style={{ color: r.attended>0?"#4CAF50":"#C4726A" }}>{r.attended}</span>
                <span style={{ color:"#D6CCC0",margin:"0 4px" }}>/</span>
                <span style={{ color:"#A89E94" }}>{r.capacity}</span>
              </div>
              {/* 鐘點費 */}
              <div style={{ fontSize:13,color:r.fee>0?"#3A3530":"#A89E94",textAlign:"right",fontWeight:r.fee>0?500:400 }}>
                {r.fee>0?r.fee.toLocaleString():0}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination + Footer */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"12px 24px",borderTop:"1px solid #EAE4DC",flexShrink:0,flexWrap:"wrap",gap:8 }}>
          {/* 分頁 */}
          <div style={{ display:"flex",gap:4 }}>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)}
                style={{ width:30,height:30,borderRadius:7,border:`1px solid ${page===p?"#4CAF50":"#D6CCC0"}`,
                         background:page===p?"#4CAF50":"#fff",color:page===p?"#fff":"#3A3530",
                         fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:page===p?600:400 }}>
                {p}
              </button>
            ))}
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={onClose}
              style={{ padding:"9px 20px",borderRadius:12,border:"1px solid #D6CCC0",background:"none",
                       color:"#7A6E68",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              關閉
            </button>
            <button
              style={{ padding:"9px 20px",borderRadius:12,border:"none",background:"#4CAF50",
                       color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              匯出薪資單
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 薪資計算方式 Modal ────────────────────────────────────────
function SalaryEditModal({ coach, onSave, onClose }) {
  const initSalary = coach.salary || { type:"fixed", name:"鐘點費", amount:1000, perHeadBase:500, perHeadExtra:100 };
  const [name,    setName]    = useState(initSalary.name    || "鐘點費");
  const [method,  setMethod]  = useState(initSalary.type    === "per_head" ? "per_head" : "fixed");
  const [amount,  setAmount]  = useState(initSalary.amount  || 1000);
  const [base,    setBase]    = useState(initSalary.perHeadBase  || 500);
  const [extra,   setExtra]   = useState(initSalary.perHeadExtra || 100);

  const mInp = {
    border:`1px solid #D6CCC0`, borderRadius:9, padding:"9px 12px",
    fontSize:13, color:"#3A3530", fontFamily:"inherit", outline:"none",
    background:"#FFFFFF", boxSizing:"border-box",
  };
  const Radio = ({ id, checked, onChange, label }) => (
    <label style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}>
      <div onClick={onChange}
        style={{ width:18,height:18,borderRadius:"50%",border:`2px solid ${checked?"#4CAF50":"#D6CCC0"}`,
                 display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer" }}>
        {checked && <div style={{ width:9,height:9,borderRadius:"50%",background:"#4CAF50" }} />}
      </div>
      <span style={{ fontSize:13,color:"#3A3530" }}>{label}</span>
    </label>
  );

  const handleSave = () => {
    onSave({
      ...coach,
      salary: method === "fixed"
        ? { type:"fixed",    name, amount:Number(amount) }
        : { type:"per_head", name, perHeadBase:Number(base), perHeadExtra:Number(extra) },
    });
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.4)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:400,
               backdropFilter:"blur(4px)",fontFamily:"'Noto Sans TC',sans-serif" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:"#FFFFFF",borderRadius:16,width:440,maxWidth:"92vw",
                 border:"1px solid #EAE4DC",boxShadow:"0 8px 40px rgba(58,53,48,.15)" }}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"18px 22px 14px",borderBottom:"1px solid #EAE4DC" }}>
          <span style={{ fontSize:15,fontWeight:600,color:"#3A3530" }}>編輯薪水計算方式</span>
          <button onClick={onClose}
            style={{ background:"none",border:"1px solid #D6CCC0",borderRadius:"50%",
                     width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",
                     fontSize:13,color:"#A89E94",cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ padding:"18px 22px" }}>
          {/* 警告提示 */}
          <div style={{ display:"flex",alignItems:"flex-start",gap:9,
                        background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:9,
                        padding:"11px 13px",marginBottom:20,fontSize:12,color:"#8D6E00",lineHeight:1.6 }}>
            <span style={{ fontSize:14,flexShrink:0,marginTop:1 }}>⚠</span>
            薪資金額修改，老師所有課程將會全部重新計算。
          </div>

          {/* 計算名稱 */}
          <div style={{ display:"grid",gridTemplateColumns:"80px 1fr",alignItems:"center",gap:12,marginBottom:16 }}>
            <span style={{ fontSize:13,color:"#3A3530" }}>計算名稱</span>
            <input value={name} onChange={e=>setName(e.target.value)} style={{ ...mInp, width:"100%" }} />
          </div>

          {/* 計算方式 */}
          <div style={{ display:"grid",gridTemplateColumns:"80px 1fr",alignItems:"flex-start",gap:12 }}>
            <span style={{ fontSize:13,color:"#3A3530",paddingTop:4 }}>計算方式</span>
            <div>
              {/* Radio 選項 */}
              <div style={{ display:"flex",gap:20,marginBottom:14 }}>
                <Radio checked={method==="fixed"}    onChange={()=>setMethod("fixed")}    label="固定費用" />
                <Radio checked={method==="per_head"} onChange={()=>setMethod("per_head")} label="依簽到人數計算" />
              </div>

              {/* 固定費用 */}
              {method === "fixed" && (
                <div style={{ display:"flex",alignItems:"center",gap:8,
                              border:"1px solid #D6CCC0",borderRadius:9,overflow:"hidden" }}>
                  <span style={{ padding:"9px 13px",fontSize:12,color:"#A89E94",
                                 borderRight:"1px solid #D6CCC0",whiteSpace:"nowrap",background:"#FAF8F5" }}>
                    每堂固定
                  </span>
                  <input type="number" min={0} value={amount} onChange={e=>setAmount(e.target.value)}
                    style={{ flex:1,border:"none",outline:"none",padding:"9px 12px",fontSize:13,
                             color:"#3A3530",fontFamily:"inherit",background:"transparent" }} />
                  <span style={{ padding:"9px 13px",fontSize:12,color:"#A89E94",
                                 borderLeft:"1px solid #D6CCC0",background:"#FAF8F5" }}>元</span>
                </div>
              )}

              {/* 依簽到人數 */}
              {method === "per_head" && (
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,
                                border:"1px solid #D6CCC0",borderRadius:9,overflow:"hidden" }}>
                    <span style={{ padding:"9px 13px",fontSize:12,color:"#A89E94",
                                   borderRight:"1px solid #D6CCC0",whiteSpace:"nowrap",background:"#FAF8F5",minWidth:68 }}>
                      基本費用
                    </span>
                    <input type="number" min={0} value={base} onChange={e=>setBase(e.target.value)}
                      style={{ flex:1,border:"none",outline:"none",padding:"9px 12px",fontSize:13,
                               color:"#3A3530",fontFamily:"inherit",background:"transparent" }} />
                    <span style={{ padding:"9px 13px",fontSize:12,color:"#A89E94",
                                   borderLeft:"1px solid #D6CCC0",background:"#FAF8F5" }}>元</span>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:8,
                                border:"1px solid #D6CCC0",borderRadius:9,overflow:"hidden" }}>
                    <span style={{ padding:"9px 13px",fontSize:12,color:"#A89E94",
                                   borderRight:"1px solid #D6CCC0",whiteSpace:"nowrap",background:"#FAF8F5",minWidth:68 }}>
                      每人加給
                    </span>
                    <input type="number" min={0} value={extra} onChange={e=>setExtra(e.target.value)}
                      style={{ flex:1,border:"none",outline:"none",padding:"9px 12px",fontSize:13,
                               color:"#3A3530",fontFamily:"inherit",background:"transparent" }} />
                    <span style={{ padding:"9px 13px",fontSize:12,color:"#A89E94",
                                   borderLeft:"1px solid #D6CCC0",background:"#FAF8F5" }}>元 / 人</span>
                  </div>
                  <div style={{ fontSize:11,color:"#A89E94",lineHeight:1.6 }}>
                    例：3 人上課 → 基本 {base} + {extra}×3 = <strong style={{ color:"#3A3530" }}>{Number(base)+Number(extra)*3} 元</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:"flex",gap:10,padding:"14px 22px",borderTop:"1px solid #EAE4DC",borderRadius:"0 0 16px 16px" }}>
          <button onClick={onClose}
            style={{ flex:1,padding:"11px",borderRadius:12,border:"1px solid #D6CCC0",
                     background:"none",color:"#7A6E68",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
            取消
          </button>
          <button onClick={handleSave}
            style={{ flex:2,padding:"11px",borderRadius:12,border:"none",
                     background:"#4CAF50",color:"#fff",fontSize:13,fontWeight:600,
                     cursor:"pointer",fontFamily:"inherit" }}>
            儲存
          </button>
        </div>
      </div>
    </div>
  );
}


// ── 偏好設定 ─────────────────────────────────────────────────
export function Settings() {
  const { isMobile } = useBreakpoint();
  const [section, setSection] = useState("venue");
  const [saved, setSaved] = useState(false);
  const [venueForm, setVenueForm] = useState({ name:"S.T Pilates", slug:"st-pilates", phone:"02-2222-3333", address:"台北市信義區松仁路 100 號", desc:"以療癒系皮拉提斯為核心，提供精緻一對一及小班課程。", website:"" });
  const vf = (k,v) => setVenueForm(p=>({...p,[k]:v}));
  const [booking, setBooking] = useState({ advance:7, cancelBefore:24, maxPerMember:1, selfBook:true, waitlist:false, showQuota:true, showCoach:true });
  const bf = (k,v) => setBooking(p=>({...p,[k]:v}));
  const [payment, setPayment] = useState({ atm:true, qr:true, credit:false, cash:true, atm_days:3, qr_bank:"玉山銀行" });
  const pf = (k,v) => setPayment(p=>({...p,[k]:v}));
  const [notify, setNotify] = useState({ before_hours:2, expire_days:14, last_session:true, cancel_notify:true, payment_notify:true, admin_cancel:true });
  const nf = (k,v) => setNotify(p=>({...p,[k]:v}));
  const [line, setLine] = useState({ connected:false, channel_id:"", channel_secret:"" });
  const [health, setHealth] = useState({ required:true, requireEveryYear:false, reminderDays:1, blockBooking:false });
  const hf = (k,v) => setHealth(p=>({...p,[k]:v}));

  const Toggle = ({ checked, onChange }) => (
    <button onClick={()=>onChange(!checked)} style={{ width:36,height:20,borderRadius:10,border:"none",cursor:"pointer",background:checked?T.sage:T.sand3,position:"relative",transition:"background .2s",flexShrink:0 }}>
      <div style={{ position:"absolute",top:3,left:checked?17:3,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.1)" }} />
    </button>
  );
  const Row = ({ label, desc, children }) => (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${T.bd}`,gap:12 }}>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:13,color:T.ink }}>{label}</div>
        {desc && <div style={{ fontSize:11,color:T.i3,marginTop:2,lineHeight:1.4 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink:0 }}>{children}</div>
    </div>
  );
  const FieldInput = ({ label, value, onChange, type="text", unit, min }) => (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>{label}</div>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <input type={type} min={min} value={value} onChange={e=>onChange(type==="number"?Number(e.target.value):e.target.value)}
          style={{ flex:1,border:"none",borderBottom:`1px solid ${T.bd2}`,padding:"7px 0",fontSize:13,color:T.ink,background:"none",outline:"none",fontFamily:"inherit",minWidth:0 }} />
        {unit && <span style={{ fontSize:11,color:T.i3,flexShrink:0 }}>{unit}</span>}
      </div>
    </div>
  );

  const sections = [
    { id:"venue",   icon:"🏠", label:"場館資訊"  },
    { id:"booking", icon:"📅", label:"預留規則"  },
    { id:"payment", icon:"💳", label:"收款方式"  },
    { id:"notify",  icon:"🔔", label:"通知設定"  },
    { id:"line",    icon:"💬", label:"LINE 整合" },
    { id:"health",  icon:"📋", label:"健康評估"  },
  ];

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  // 手機版：頂部橫向 tab；桌面版：左側 nav
  const SideNav = () => isMobile ? (
    <div style={{ overflowX:"auto",display:"flex",gap:4,padding:"0 0 10px",borderBottom:`1px solid ${T.bd}`,marginBottom:14,scrollbarWidth:"none" }}>
      {sections.map(s=>(
        <button key={s.id} onClick={()=>setSection(s.id)}
          style={{ display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",padding:"7px 12px",borderRadius:20,fontSize:12,border:`1px solid ${section===s.id?T.rose:T.bd2}`,cursor:"pointer",background:section===s.id?T.rs:"none",color:section===s.id?T.rm:T.i3,fontFamily:"inherit",flexShrink:0 }}>
          <span>{s.icon}</span>{s.label}
        </button>
      ))}
    </div>
  ) : (
    <div style={{ width:152,flexShrink:0 }}>
      {sections.map(s=>(
        <button key={s.id} onClick={()=>setSection(s.id)}
          style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",borderRadius:9,fontSize:12,border:"none",cursor:"pointer",background:section===s.id?T.rs:"none",color:section===s.id?T.rm:T.i2,fontFamily:"inherit",marginBottom:2,textAlign:"left" }}>
          <span>{s.icon}</span>{s.label}
        </button>
      ))}
    </div>
  );

  const twoCol = { display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:14 };

  const Content = () => (
    <>
      {section === "venue" && (
        <>
          <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:16 }}>場館資訊</div>
          <FieldInput label="場館名稱" value={venueForm.name} onChange={v=>vf("name",v)} />
          <FieldInput label="預約頁代碼（app.coratimes.com/book/xxx）" value={venueForm.slug} onChange={v=>vf("slug",v)} />
          <div style={twoCol}>
            <FieldInput label="聯絡電話" value={venueForm.phone} onChange={v=>vf("phone",v)} />
            <FieldInput label="官方網站" value={venueForm.website} onChange={v=>vf("website",v)} />
          </div>
          <FieldInput label="地址" value={venueForm.address} onChange={v=>vf("address",v)} />
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>場館介紹（顯示於預約頁）</div>
            <textarea value={venueForm.desc} onChange={e=>vf("desc",e.target.value)} rows={3}
              style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"9px 11px",fontSize:13,color:T.ink,background:T.bg,outline:"none",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box" }} />
          </div>
        </>
      )}

      {section === "booking" && (
        <>
          <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:4 }}>預留規則</div>
          <div style={{ fontSize:11,color:T.i3,marginBottom:16 }}>設定學員的預約與取消規則</div>
          <div style={twoCol}>
            <FieldInput label="最早可提前預約（天）" value={booking.advance} onChange={v=>bf("advance",v)} type="number" min={1} unit="天前" />
            <FieldInput label="取消截止（課程開始前）" value={booking.cancelBefore} onChange={v=>bf("cancelBefore",v)} type="number" min={0} unit="小時前" />
          </div>
          <FieldInput label="每位學員每場次最多佔位" value={booking.maxPerMember} onChange={v=>bf("maxPerMember",v)} type="number" min={1} unit="個位置" />
          <Row label="學員自助預留" desc="關閉後僅管理員可建立預留"><Toggle checked={booking.selfBook} onChange={v=>bf("selfBook",v)} /></Row>
          <Row label="開放候補名單" desc="額滿後學員可加入候補，有空位時自動通知"><Toggle checked={booking.waitlist} onChange={v=>bf("waitlist",v)} /></Row>
          <Row label="顯示剩餘名額" desc="在預約頁顯示剩餘可預約數量"><Toggle checked={booking.showQuota} onChange={v=>bf("showQuota",v)} /></Row>
          <Row label="顯示教練資訊" desc="在預約頁顯示教練姓名與照片"><Toggle checked={booking.showCoach} onChange={v=>bf("showCoach",v)} /></Row>
        </>
      )}

      {section === "health" && (
        <>
          <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:4 }}>身體狀況評估</div>
          <div style={{ fontSize:11,color:T.i3,marginBottom:16 }}>學員上課前填寫健康問卷，協助教練安排適合的課程強度</div>

          <Row label="上課前需填寫評估表" desc="新會員首次預約前須完成身體狀況評估表">
            <Toggle checked={health.required} onChange={v=>hf("required",v)} />
          </Row>

          {health.required && (
            <>
              <Row label="阻擋未填寫者預約" desc="開啟後，未完成評估表的學員無法線上預約課程（僅顯示提醒，不阻擋時改為提醒）">
                <Toggle checked={health.blockBooking} onChange={v=>hf("blockBooking",v)} />
              </Row>
              <Row label="每年要求重新填寫" desc="健康狀況可能隨時間改變，定期更新有助於安全評估">
                <Toggle checked={health.requireEveryYear} onChange={v=>hf("requireEveryYear",v)} />
              </Row>
              <FieldInput label="課前提醒（尚未完成時）" value={health.reminderDays} onChange={v=>hf("reminderDays",v)} type="number" min={0} unit="天前推播提醒" />
            </>
          )}

          <div style={{ marginTop:14,padding:"11px 14px",background:T.sb,borderRadius:10,fontSize:11,color:T.i3,lineHeight:1.7 }}>
            💡 健康評估表內容僅供教練安排課程參考，不構成醫療診斷。資料依隱私政策保護，僅教練與管理員可查閱。
          </div>
        </>
      )}

      {section === "payment" && (
        <>
          <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:4 }}>收款方式</div>
          <div style={{ fontSize:11,color:T.i3,marginBottom:16 }}>開啟的收款方式會顯示在學員購買頁面</div>
          <Row label="ATM 虛擬帳號" desc="系統自動產生虛擬帳號，對帳後手動確認"><Toggle checked={payment.atm} onChange={v=>pf("atm",v)} /></Row>
          {payment.atm && (
            <div style={{ padding:"10px 14px",background:T.bg,borderRadius:9,marginBottom:8 }}>
              <FieldInput label="ATM 繳費期限" value={payment.atm_days} onChange={v=>pf("atm_days",v)} type="number" min={1} unit="天" />
            </div>
          )}
          <Row label="QRCode 掃碼付款" desc="學員掃碼後轉帳，系統自動核對"><Toggle checked={payment.qr} onChange={v=>pf("qr",v)} /></Row>
          {payment.qr && (
            <div style={{ padding:"10px 14px",background:T.bg,borderRadius:9,marginBottom:8 }}>
              <FieldInput label="收款銀行" value={payment.qr_bank} onChange={v=>pf("qr_bank",v)} />
            </div>
          )}
          <Row label="信用卡（PAYUNi）" desc="需先申請 PAYUNi 商家帳號"><Toggle checked={payment.credit} onChange={v=>pf("credit",v)} /></Row>
          {payment.credit && (
            <div style={{ padding:"10px 14px",background:T.ambs,borderRadius:9,marginBottom:8,fontSize:11,color:T.amb }}>
              ⚠ 請先至 PAYUNi 後台申請商家串接憑證，再填入此處。
            </div>
          )}
          <Row label="現場付款" desc="學員到場後現金或轉帳付款"><Toggle checked={payment.cash} onChange={v=>pf("cash",v)} /></Row>
        </>
      )}

      {section === "notify" && (
        <>
          <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:4 }}>通知設定</div>
          <div style={{ fontSize:11,color:T.i3,marginBottom:16 }}>透過 LINE 或 Email 發送自動通知</div>
          <div style={twoCol}>
            <FieldInput label="課前提醒（課程開始前）" value={notify.before_hours} onChange={v=>nf("before_hours",v)} type="number" min={0} unit="小時" />
            <FieldInput label="方案到期提前通知" value={notify.expire_days} onChange={v=>nf("expire_days",v)} type="number" min={1} unit="天前" />
          </div>
          <Row label="最後一次使用前提醒" desc="學員剩最後 1 次時，前一天 22:00 推播"><Toggle checked={notify.last_session} onChange={v=>nf("last_session",v)} /></Row>
          <Row label="取消預留通知" desc="學員取消時通知管理員"><Toggle checked={notify.cancel_notify} onChange={v=>nf("cancel_notify",v)} /></Row>
          <Row label="收款待確認通知" desc="學員繳費後即時通知管理員"><Toggle checked={notify.payment_notify} onChange={v=>nf("payment_notify",v)} /></Row>
          <Row label="停課通知學員" desc="管理員停課後自動通知所有已預留學員"><Toggle checked={notify.admin_cancel} onChange={v=>nf("admin_cancel",v)} /></Row>
        </>
      )}

      {section === "line" && (
        <>
          <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:4 }}>LINE 整合</div>
          <div style={{ fontSize:11,color:T.i3,marginBottom:16 }}>設定後學員可用 LINE 登入，並接收 LINE 通知</div>
          {line.connected ? (
            <>
              <div style={{ background:T.ss,border:`1px solid ${T.sage}30`,borderRadius:10,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:16 }}>✅</span>
                <div>
                  <div style={{ fontSize:13,fontWeight:500,color:T.sm }}>LINE 已連結</div>
                  <div style={{ fontSize:11,color:T.sm,opacity:.8 }}>Channel ID: {line.channel_id}</div>
                </div>
              </div>
              <Btn variant="danger" onClick={()=>setLine(p=>({...p,connected:false}))}>解除連結</Btn>
            </>
          ) : (
            <>
              <div style={twoCol}>
                <FieldInput label="Channel ID" value={line.channel_id} onChange={v=>setLine(p=>({...p,channel_id:v}))} />
                <FieldInput label="Channel Secret" value={line.channel_secret} onChange={v=>setLine(p=>({...p,channel_secret:v}))} />
              </div>
              <div style={{ padding:"10px 13px",background:T.sb,borderRadius:9,fontSize:11,color:T.i3,lineHeight:1.7,marginBottom:14 }}>
                💡 前往 <span style={{ color:T.rose }}>LINE Developers Console</span> 建立 Messaging API Channel，取得 Channel ID 與 Secret 後填入。
              </div>
              <button onClick={()=>{ if(line.channel_id&&line.channel_secret) setLine(p=>({...p,connected:true})); }}
                style={{ padding:"10px 24px",borderRadius:20,border:"1.5px solid #06C755",background:"#fff",color:"#06C755",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit" }}>
                連結 LINE 帳號
              </button>
            </>
          )}
        </>
      )}

      <div style={{ display:"flex",justifyContent:"flex-end",marginTop:20,paddingTop:14,borderTop:`1px solid ${T.bd}` }}>
        <Btn variant="primary" onClick={handleSave}>{saved?"✓ 已儲存":"儲存"}</Btn>
      </div>
    </>
  );

  return (
    <Page>
      <Topbar title="偏好設定" />
      <Body>
        {isMobile ? (
          // 手機版：上下排列
          <div>
            <SideNav />
            <Card style={{ padding:"16px" }}>
              <Content />
            </Card>
          </div>
        ) : (
          // 桌面版：左側 nav + 右側內容
          <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
            <SideNav />
            <Card style={{ padding:"20px", flex:1, minWidth:0 }}>
              <Content />
            </Card>
          </div>
        )}
      </Body>
    </Page>
  );
}


// ── 服務合約 ─────────────────────────────────────────────────
export function Contracts() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title:"", target:"all", content:"" });
  const ff = (k,v) => setForm(p=>({...p,[k]:v}));
  const [conSearch, setConSearch] = useState("");
  const [conStatus, setConStatus] = useState("all");
  const resetConF = () => { setConSearch(""); setConStatus("all"); };
  const tags = ["學員姓名","學員手機","購買日期","方案名稱","方案金額","次數","有效期限","審閱期間"];
  const records = [
    { member:"莊書語", bg:T.rs, color:T.rm, contract:"服務合約（定型化）", status:"signed",   date:"2026/05/10" },
    { member:"陳怡君", bg:T.mists, color:T.mist, contract:"服務合約（定型化）", status:"signed", date:"2026/04/20" },
    { member:"林美玲", bg:T.lavs, color:T.lav,  contract:"體驗同意書",         status:"pending", date:"—" },
  ];
  return (
    <Page>
      <Topbar title="服務合約">
        <Btn variant="primary" onClick={()=>setModal(true)}>＋ 新增合約</Btn>
      </Topbar>
      <Body>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          <div>
            <div style={{ fontSize:12,fontWeight:500,color:T.ink,marginBottom:10 }}>合約範本</div>
            <Card>
              {[
                { name:"服務合約（定型化）", sub:"購買方案適用 · 2026/03/10" },
                { name:"體驗同意書",          sub:"體驗時光適用 · 2026/01/05" },
              ].map((t,i) => (
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,
                  padding:"12px 14px",borderBottom:i===0?`1px solid ${T.bd}`:"none" }}>
                  <div style={{ width:32,height:32,borderRadius:9,background:T.mists,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>📄</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,color:T.ink }}>{t.name}</div>
                    <div style={{ fontSize:11,color:T.i3,marginTop:1 }}>{t.sub}</div>
                  </div>
                  <Btn sm>編輯</Btn>
                </div>
              ))}
            </Card>
            <div style={{ marginTop:12,display:"flex",flexWrap:"wrap",gap:5 }}>
              {tags.map(tag => (
                <span key={tag} style={{ fontSize:10,padding:"2px 9px",borderRadius:12,
                  background:T.rs,color:T.rm,border:`1px solid ${T.bd2}` }}>{`{${tag}}`}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
              <div style={{ fontSize:12,fontWeight:500,color:T.ink }}>簽署紀錄</div>
            </div>
            <FilterBar
              search={conSearch} onSearch={setConSearch} searchPlaceholder="搜尋學員…"
              filters={[{ key:"status", label:"所有狀態", options:[{value:"signed",label:"已簽署"},{value:"pending",label:"待簽署"}] }]}
              values={{ status:conStatus }} onChange={(_,v)=>setConStatus(v)} onReset={resetConF}
              resultCount={records.filter(r=>(conStatus==="all"||r.status===conStatus)&&(!conSearch||r.member.includes(conSearch))).length}
            />
            <Card>
              {records.filter(r=>(conStatus==="all"||r.status===conStatus)&&(!conSearch||r.member.includes(conSearch))).map((r,i) => (
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,
                  padding:"11px 14px",borderBottom:i<records.length-1?`1px solid ${T.bd}`:"none" }}>
                  <div style={{ width:28,height:28,borderRadius:"50%",background:r.bg,
                    color:r.color,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:12,flexShrink:0 }}>{r.member[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12,color:T.ink }}>{r.member}</div>
                    <div style={{ fontSize:10,color:T.i3,marginTop:1 }}>{r.contract}</div>
                  </div>
                  <Tag bg={r.status==="signed"?T.ss:T.ambs} color={r.status==="signed"?T.sm:T.amb}>
                    {r.status==="signed"?"已簽署":"待簽署"}
                  </Tag>
                  {r.status==="signed"
                    ? <Btn sm>下載</Btn>
                    : <Btn sm>催簽</Btn>}
                </div>
              ))}
            </Card>
          </div>
        </div>

        {/* 新增合約 Modal */}
        {modal && (
          <div onClick={()=>setModal(false)} style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(3px)" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:T.sf,borderRadius:20,padding:24,width:500,maxWidth:"92vw",border:`1px solid ${T.bd}`,maxHeight:"85vh",overflowY:"auto" }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
                <span style={{ fontSize:14,fontWeight:500,color:T.ink }}>新增服務合約</span>
                <button onClick={()=>setModal(false)} style={{ background:"none",border:"none",fontSize:18,color:T.i3,cursor:"pointer" }}>✕</button>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>合約名稱</div>
                <input placeholder="例：服務合約（定型化）" value={form.title} onChange={e=>ff("title",e.target.value)} style={{ width:"100%",border:"none",borderBottom:`1px solid ${T.bd2}`,padding:"7px 0",fontSize:13,color:T.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:8 }}>適用對象</div>
                <div style={{ display:"flex",gap:8 }}>
                  {[["all","所有學員"],["new","新學員"],["plan","購買方案時"]].map(([v,l])=>(
                    <button key={v} onClick={()=>ff("target",v)} style={{ padding:"5px 12px",borderRadius:20,border:`1px solid ${form.target===v?T.rose:T.bd2}`,background:form.target===v?T.rs:"none",color:form.target===v?T.rm:T.i3,fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>可用動態標籤</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:10 }}>
                  {tags.map(tag=>(
                    <button key={tag} onClick={()=>ff("content",form.content+"{"+tag+"}")} style={{ fontSize:10,padding:"2px 9px",borderRadius:12,background:T.rs,color:T.rm,border:`1px solid ${T.bd2}`,cursor:"pointer",fontFamily:"inherit" }}>{`{${tag}}`}</button>
                  ))}
                </div>
                <div style={{ fontSize:10,color:T.i3,marginBottom:5,letterSpacing:".06em" }}>合約內容</div>
                <textarea rows={8} placeholder="在此輸入合約條款，點擊上方標籤插入動態欄位…" value={form.content} onChange={e=>ff("content",e.target.value)} style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"10px 12px",fontSize:13,color:T.ink,background:T.bg,outline:"none",fontFamily:"inherit",resize:"vertical",lineHeight:1.7 }} />
              </div>
              <div style={{ display:"flex",justifyContent:"flex-end",gap:8,paddingTop:14,borderTop:`1px solid ${T.bd}` }}>
                <Btn onClick={()=>setModal(false)}>取消</Btn>
                <Btn variant="primary" onClick={()=>{ if(form.title){ setModal(false); setForm({ title:"",target:"all",content:"" }); } }}>建立合約</Btn>
              </div>
            </div>
          </div>
        )}
      </Body>
    </Page>
  );
}

// ── 成員管理 ─────────────────────────────────────────────────
export function Team() {
  const [selected, setSelected] = useState("Eddie");
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name:"", email:"", role:"coach" });
  const ivf = (k,v) => setInviteForm(p=>({...p,[k]:v}));
  const members = [
    { name:"Eddie",  role:"company_admin", roleLabel:"創辦人",   bg:T.lavs, color:T.lav  },
    { name:"Sammi",  role:"coach",         roleLabel:"教練",     bg:T.rs,   color:T.rm   },
    { name:"Annie",  role:"coach",         roleLabel:"教練",     bg:T.mists,color:T.mist },
    { name:"Mandy",  role:"staff",         roleLabel:"行政助理", bg:T.ss,   color:T.sm   },
  ];
  const perms = [
    { group:"日常操作", items:[["今日簽到",true],["時光表",true],["學員管理",true]] },
    { group:"財務與報表", items:[["收款確認",true],["洞察報表",true]] },
    { group:"設定", items:[["偏好設定",false],["服務合約",false],["成員管理",false]] },
  ];
  const [permState, setPermState] = useState(
    perms.flatMap(g => g.items).reduce((acc,[k,v]) => ({...acc,[k]:v}), {})
  );
  return (
    <Page>
      <Topbar title="成員管理">
        <Btn variant="primary" onClick={()=>setInviteModal(true)}>＋ 邀請成員</Btn>
      </Topbar>
      <Body>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          <div>
            <Card>
              {members.map((m,i) => (
                <div key={m.name} onClick={() => setSelected(m.name)}
                  style={{ display:"flex",alignItems:"center",gap:10,
                    padding:"10px 14px",borderBottom:i<members.length-1?`1px solid ${T.bd}`:"none",
                    cursor:"pointer",background:selected===m.name?T.rs:T.sf }}>
                  <div style={{ width:30,height:30,borderRadius:"50%",background:m.bg,
                    color:m.color,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:12,fontWeight:300,flexShrink:0 }}>{m.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,color:T.ink }}>{m.name}</div>
                    <div style={{ fontSize:11,color:T.i3,marginTop:1 }}>{m.name.toLowerCase()}@coratimes.com</div>
                  </div>
                  <Tag bg={m.bg} color={m.color}>{m.roleLabel}</Tag>
                </div>
              ))}
            </Card>
          </div>
          <Card style={{ padding:"16px" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
              <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>{selected} 的權限</div>
              <select style={{ border:`1px solid ${T.bd2}`,borderRadius:9,padding:"4px 8px",
                fontSize:11,color:T.i2,fontFamily:"inherit",outline:"none" }}>
                <option>教練</option><option>行政助理</option><option>場館管理員</option>
              </select>
            </div>
            {perms.map(g => (
              <div key={g.group} style={{ marginBottom:12 }}>
                <div style={{ fontSize:10,color:T.i3,letterSpacing:".08em",marginBottom:6 }}>{g.group}</div>
                {g.items.map(([k]) => (
                  <div key={k} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"7px 0",borderBottom:`1px solid ${T.bd}` }}>
                    <span style={{ fontSize:12,color:T.ink }}>{k}</span>
                    <button onClick={() => setPermState(p=>({...p,[k]:!p[k]}))}
                      style={{ width:30,height:16,borderRadius:8,border:"none",cursor:"pointer",
                        background:permState[k]?T.sage:T.sand3,position:"relative",transition:"background .2s" }}>
                      <div style={{ position:"absolute",top:2,left:permState[k]?14:2,
                        width:12,height:12,borderRadius:"50%",background:"#fff",transition:"left .2s" }} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:12,
              paddingTop:12,borderTop:`1px solid ${T.bd}` }}>
              <Btn variant="danger">移除成員</Btn>
              <Btn variant="primary">儲存</Btn>
            </div>
          </Card>
        </div>

        {/* 邀請成員 Modal */}
        {inviteModal && (
          <div onClick={()=>setInviteModal(false)} style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(3px)" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:T.sf,borderRadius:20,padding:24,width:420,maxWidth:"92vw",border:`1px solid ${T.bd}` }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
                <span style={{ fontSize:14,fontWeight:500,color:T.ink }}>邀請成員加入場館</span>
                <button onClick={()=>setInviteModal(false)} style={{ background:"none",border:"none",fontSize:18,color:T.i3,cursor:"pointer" }}>✕</button>
              </div>
              {[["姓名","name","成員姓名"],["Email","email","member@example.com"]].map(([l,k,ph])=>(
                <div key={k} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:5 }}>{l}</div>
                  <input placeholder={ph} value={inviteForm[k]} onChange={e=>ivf(k,e.target.value)} style={{ width:"100%",border:"none",borderBottom:`1px solid ${T.bd2}`,padding:"7px 0",fontSize:13,color:T.ink,background:"none",outline:"none",fontFamily:"inherit" }} />
                </div>
              ))}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:8 }}>角色</div>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {[["company_admin","Company Admin"],["venue_manager","場館管理員"],["coach","教練"],["staff","行政助理"]].map(([v,l])=>(
                    <button key={v} onClick={()=>ivf("role",v)} style={{ padding:"5px 12px",borderRadius:20,border:`1px solid ${inviteForm.role===v?T.rose:T.bd2}`,background:inviteForm.role===v?T.rs:"none",color:inviteForm.role===v?T.rm:T.i3,fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ padding:"10px 13px",background:T.sb,borderRadius:9,fontSize:11,color:T.i3,marginBottom:14,lineHeight:1.6 }}>
                ✉ 系統將發送邀請連結至對方 Email，點擊後即可設定密碼並加入場館。
              </div>
              <div style={{ display:"flex",justifyContent:"flex-end",gap:8,paddingTop:14,borderTop:`1px solid ${T.bd}` }}>
                <Btn onClick={()=>setInviteModal(false)}>取消</Btn>
                <Btn variant="primary" onClick={()=>{ if(inviteForm.name&&inviteForm.email){ setInviteModal(false); setInviteForm({ name:"",email:"",role:"coach" }); } }}>發送邀請</Btn>
              </div>
            </div>
          </div>
        )}
      </Body>
    </Page>
  );
}

// ── 體態評估模組 ─────────────────────────────────────────────
const POSTURE_MOCK = [
  {
    id:1, memberId:1, memberName:"莊書語", memberInitial:"莊", memberBg:"#F5ECE6", memberColor:"#A87A62",
    coach:"Sammi", date:"2026/05/22", progress:"器械私教 1/10",
    metrics:[
      { name:"頭部前引",   value:23.5, status:"err",  ideal:"< 15°"  },
      { name:"高低肩差",   value:1.8,  status:"warn", ideal:"0°"     },
      { name:"脊椎側彎",   value:7.2,  status:"warn", ideal:"< 10°"  },
      { name:"骨盆傾斜",   value:2.1,  status:"warn", ideal:"0°"     },
      { name:"骨盆前傾",   value:19.2, status:"err",  ideal:"7°–15°" },
    ],
    findings:{ breath:true, core:true, winging:true, rib:true },
    coachNote:"學員今日初次體驗，主要痛點為長期久坐引起的骨盆前傾與輕微高低肩。前 5 堂課將專注於脊椎中立位的尋找與呼吸優化。",
    phase1:["橫膈膜呼吸模式優化與肋骨控制","骨盆中立位與脊椎中立線的建立","核心深層、臀大肌與腹直肌的喚醒"],
    phase2:["Reformer 跨軸三維空間的動態穩定訓練","引進不對稱阻力，針對單側弱勢肌群進行強化"],
    homework:"每日進行 3 組貓牛式 (Cat-Cow) 與泡沫軸胸廓放鬆，每組持續 60 秒。",
    freq:"每週 2 次", goal:"骨盆歪斜角度由 2.1° 降至 1° 以內，並顯著改善高低肩。",
    springs:[{name:"Footwork",value:"2紅1藍"},{name:"Arms in Straps",value:"1紅"}],
    errCount:2, warnCount:3,
  },
  {
    id:2, memberId:3, memberName:"林美玲", memberInitial:"林", memberBg:"#F0EDF5", memberColor:"#9B8FAE",
    coach:"Annie", date:"2026/05/18", progress:"墊上私教 2/6",
    metrics:[
      { name:"頭部前引",   value:18.2, status:"err",  ideal:"< 15°"  },
      { name:"高低肩差",   value:0.8,  status:"ok",   ideal:"0°"     },
      { name:"脊椎側彎",   value:4.1,  status:"ok",   ideal:"< 10°"  },
      { name:"骨盆傾斜",   value:1.2,  status:"warn", ideal:"0°"     },
      { name:"骨盆前傾",   value:16.8, status:"warn", ideal:"7°–15°" },
    ],
    findings:{ breath:true, core:false, winging:false, rib:false },
    coachNote:"學員腰椎第四節輕微滑脫，動作需放慢。呼吸模式待改善，其他項目相對穩定。",
    phase1:["呼吸控制與核心啟動","脊椎減壓伸展"],
    phase2:["漸進式阻力訓練"],
    homework:"每日貓牛式 + 仰臥脊椎旋轉，各 3 組。",
    freq:"每週 2 次", goal:"頭部前引改善至 15° 以內，維持現有脊椎穩定度。",
    springs:[],
    errCount:1, warnCount:2,
  },
  {
    id:3, memberId:2, memberName:"陳怡君", memberInitial:"陳", memberBg:"#EEF2F6", memberColor:"#8A9BAE",
    coach:"Sammi", date:"2026/06/01", progress:"器械私教 5/6",
    metrics:[
      { name:"頭部前引",   value:14.2, status:"ok",   ideal:"< 15°"  },
      { name:"高低肩差",   value:0.5,  status:"ok",   ideal:"0°"     },
      { name:"脊椎側彎",   value:3.8,  status:"ok",   ideal:"< 10°"  },
      { name:"骨盆傾斜",   value:0.9,  status:"ok",   ideal:"0°"     },
      { name:"骨盆前傾",   value:13.5, status:"ok",   ideal:"7°–15°" },
    ],
    findings:{ breath:false, core:false, winging:false, rib:false },
    coachNote:"學員體態明顯改善，所有指標已達正常範圍。建議維持目前課表並進入進階訓練。",
    phase1:["進階核心控制","全身協調性訓練"],
    phase2:["功能性運動整合"],
    homework:"維持每日伸展習慣，加入泡沫軸胸廓放鬆。",
    freq:"每週 1–2 次", goal:"維持現有體態，進入進階功能性訓練。",
    springs:[],
    errCount:0, warnCount:0,
  },
  {
    id:4, memberId:5, memberName:"王雅雯", memberInitial:"王", memberBg:"#EAF2EF", memberColor:"#5C7D6F",
    coach:"Kelly", date:"2026/06/10", progress:"器械私教 3/12",
    metrics:[
      { name:"頭部前引",   value:20.1, status:"err",  ideal:"< 15°"  },
      { name:"高低肩差",   value:2.8,  status:"err",  ideal:"0°"     },
      { name:"脊椎側彎",   value:8.9,  status:"warn", ideal:"< 10°"  },
      { name:"骨盆傾斜",   value:3.2,  status:"err",  ideal:"0°"     },
      { name:"骨盆前傾",   value:21.0, status:"err",  ideal:"7°–15°" },
    ],
    findings:{ breath:true, core:true, winging:true, rib:true },
    coachNote:"學員體態問題較為複雜，高低肩與骨盆歪斜同時存在。需針對左側臀大肌與右側腰方肌不對稱進行矯正。",
    phase1:["單側不對稱訓練","骨盆穩定基礎"],
    phase2:["全側鏈強化","功能性動態平衡"],
    homework:"每日單腳站立 30 秒 × 3 組，訓練本體感覺。",
    freq:"每週 3 次", goal:"高低肩由 2.8° 降至 1° 以內，骨盆傾斜改善至 1.5° 以內。",
    springs:[{name:"Footwork",value:"1紅1藍"},{name:"Side Splits",value:"1藍"}],
    errCount:4, warnCount:1,
  },
];

const PS = {
  ok:   { bg:"#E8F5E9", color:"#388E3C", label:"正常" },
  warn: { bg:"#FFF3E0", color:"#E65100", label:"留意" },
  err:  { bg:"#FFEBEE", color:"#C62828", label:"異常" },
};

function PostureDetailModal({ report, onClose }) {
  const [tab, setTab] = useState("metrics");
  const TABS = [
    { id:"metrics", label:"量化指標" },
    { id:"findings",label:"功能篩查" },
    { id:"plan",    label:"訓練計畫" },
    { id:"note",    label:"教練筆記" },
  ];
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.45)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:400,
               backdropFilter:"blur(5px)",fontFamily:"'Noto Sans TC',sans-serif",padding:"16px 0" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:T.sf,borderRadius:20,width:580,maxWidth:"96vw",
                 maxHeight:"90vh",display:"flex",flexDirection:"column",
                 border:`1px solid ${T.bd}`,boxShadow:"0 12px 50px rgba(58,53,48,.2)" }}>

        {/* Header */}
        <div style={{ padding:"18px 22px 0",borderBottom:`1px solid ${T.bd}`,flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:44,height:44,borderRadius:"50%",background:report.memberBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:report.memberColor,fontWeight:300,flexShrink:0 }}>
                {report.memberInitial}
              </div>
              <div>
                <div style={{ fontSize:15,fontWeight:600,color:T.ink }}>{report.memberName}</div>
                <div style={{ fontSize:11,color:T.i3,marginTop:2 }}>{report.date} · {report.coach} 教練 · {report.progress}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"none",border:`1px solid ${T.bd2}`,borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:T.i3,cursor:"pointer" }}>✕</button>
          </div>
          {/* 總覽數字 */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14 }}>
            {[
              { label:"異常", count:report.errCount, bg:"#FFEBEE", color:"#C62828" },
              { label:"留意", count:report.warnCount, bg:"#FFF3E0", color:"#E65100" },
              { label:"正常", count:report.metrics.filter(m=>m.status==="ok").length, bg:"#E8F5E9", color:"#388E3C" },
            ].map(s=>(
              <div key={s.label} style={{ background:s.bg,borderRadius:9,padding:"9px",textAlign:"center" }}>
                <div style={{ fontSize:22,fontWeight:600,color:s.color }}>{s.count}</div>
                <div style={{ fontSize:10,color:s.color }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Tabs */}
          <div style={{ display:"flex" }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{ flex:1,padding:"8px",fontSize:12,border:"none",background:"none",cursor:"pointer",
                         fontFamily:"inherit",color:tab===t.id?T.rose:T.i3,
                         borderBottom:`2px solid ${tab===t.id?T.rose:"transparent"}`,fontWeight:tab===t.id?500:400 }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1,overflowY:"auto",padding:"18px 22px" }}>

          {tab==="metrics" && (
            <div>
              {report.metrics.map((m,i)=>{
                const st = PS[m.status];
                const maxV = m.name.includes("前傾")?35:m.name.includes("頭部")?40:20;
                const pct = Math.min((m.value/maxV)*100,100);
                return (
                  <div key={i} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:5 }}>
                      <div>
                        <span style={{ fontSize:13,fontWeight:500,color:T.ink }}>{m.name}</span>
                        <span style={{ fontSize:10,color:T.i3,marginLeft:6 }}>理想 {m.ideal}</span>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                        <span style={{ fontSize:18,fontWeight:600,color:m.status==="err"?"#C62828":m.status==="warn"?"#E65100":"#388E3C" }}>{m.value}°</span>
                        <span style={{ fontSize:10,padding:"2px 7px",borderRadius:8,background:st.bg,color:st.color }}>{st.label}</span>
                      </div>
                    </div>
                    <div style={{ height:5,background:T.bd,borderRadius:3,overflow:"hidden" }}>
                      <div style={{ height:5,borderRadius:3,width:`${pct}%`,background:m.status==="err"?"#E53935":m.status==="warn"?"#FF9800":"#4CAF50",transition:"width .3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab==="findings" && (
            <div>
              <div style={{ fontSize:11,color:T.i3,marginBottom:12 }}>動態功能篩查結果</div>
              {[
                ["breath","呼吸模式異常","胸式呼吸為主，橫膈膜活化不足"],
                ["core","核心穩定度不足","雙腿伸展時下背無法維持墊面接觸"],
                ["winging","翼狀肩胛","肩胛骨有翼狀跡象"],
                ["rib","肋骨外翻","吸氣時肋骨容易外翻"],
              ].map(([k,l,sub])=>(
                <div key={k} style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"11px 0",borderBottom:`1px solid ${T.bd}` }}>
                  <div style={{ width:22,height:22,borderRadius:6,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                    background:report.findings[k]?"#FFEBEE":"#E8F5E9",border:`1.5px solid ${report.findings[k]?"#E53935":"#4CAF50"}` }}>
                    <span style={{ fontSize:12,color:report.findings[k]?"#E53935":"#4CAF50" }}>{report.findings[k]?"✓":"—"}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:13,color:T.ink,fontWeight:500 }}>{l}</div>
                    <div style={{ fontSize:11,color:T.i3,marginTop:2 }}>{sub}</div>
                  </div>
                  <div style={{ marginLeft:"auto",flexShrink:0 }}>
                    <span style={{ fontSize:10,padding:"2px 8px",borderRadius:10,
                      background:report.findings[k]?"#FFEBEE":"#E8F5E9",
                      color:report.findings[k]?"#C62828":"#388E3C" }}>
                      {report.findings[k]?"發現":"正常"}
                    </span>
                  </div>
                </div>
              ))}
              {report.springs?.length>0 && (
                <div style={{ marginTop:14 }}>
                  <div style={{ fontSize:11,color:T.i3,marginBottom:8 }}>Reformer 彈簧設定</div>
                  {report.springs.map(sp=>(
                    <div key={sp.name} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:12,borderBottom:`1px solid ${T.bd}` }}>
                      <span style={{ color:T.i2 }}>{sp.name}</span>
                      <span style={{ color:T.ink,fontWeight:500 }}>{sp.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab==="plan" && (
            <div>
              <div style={{ background:T.sb,borderRadius:12,padding:"12px 14px",marginBottom:10 }}>
                <div style={{ fontSize:11,fontWeight:600,color:T.ink,marginBottom:7,display:"flex",alignItems:"center",gap:6 }}>📅 階段一訓練重點</div>
                {report.phase1.map((p,i)=><div key={i} style={{ fontSize:12,color:T.i2,padding:"3px 0",lineHeight:1.5 }}>· {p}</div>)}
              </div>
              <div style={{ background:T.sb,borderRadius:12,padding:"12px 14px",marginBottom:10 }}>
                <div style={{ fontSize:11,fontWeight:600,color:T.ink,marginBottom:7,display:"flex",alignItems:"center",gap:6 }}>📅 階段二訓練重點</div>
                {report.phase2.map((p,i)=><div key={i} style={{ fontSize:12,color:T.i2,padding:"3px 0",lineHeight:1.5 }}>· {p}</div>)}
              </div>
              <div style={{ background:"#EAF2EF",borderRadius:12,padding:"12px 14px",marginBottom:10 }}>
                <div style={{ fontSize:11,fontWeight:600,color:"#5C7D6F",marginBottom:5 }}>🏠 居家建議</div>
                <div style={{ fontSize:12,color:"#5C7D6F" }}>{report.homework}</div>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <div style={{ flex:1,background:T.sb,borderRadius:10,padding:"10px 12px" }}>
                  <div style={{ fontSize:10,color:T.i3,marginBottom:3 }}>建議頻率</div>
                  <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>{report.freq}</div>
                </div>
                <div style={{ flex:2,background:T.sb,borderRadius:10,padding:"10px 12px" }}>
                  <div style={{ fontSize:10,color:T.i3,marginBottom:3 }}>複檢目標</div>
                  <div style={{ fontSize:12,color:T.ink,lineHeight:1.5 }}>{report.goal}</div>
                </div>
              </div>
            </div>
          )}

          {tab==="note" && (
            <div>
              <div style={{ borderLeft:`2px solid ${T.rose}`,paddingLeft:12,fontSize:13,color:T.i2,lineHeight:1.8 }}>
                {report.coachNote}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding:"13px 22px",borderTop:`1px solid ${T.bd}`,display:"flex",gap:8,flexShrink:0 }}>
          <Btn onClick={onClose}>關閉</Btn>
          <Btn variant="primary">匯出 PDF</Btn>
        </div>
      </div>
    </div>
  );
}

export function PostureReports() {
  // 模擬當前公司方案（實際從 context/API 取得）
  const [currentPlan] = useState("pro"); // "starter" | "pro" | "enterprise"
  const isStarter = currentPlan === "starter";

  const [reports]       = useState(POSTURE_MOCK);
  const [search, setSearch]   = useState("");
  const [fCoach, setFCoach]   = useState("all");
  const [fStatus, setFStatus] = useState("all");
  const [fMonth, setFMonth]   = useState("all");
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("list"); // list | cards

  const coaches = [...new Set(reports.map(r=>r.coach))];
  const months  = [...new Set(reports.map(r=>r.date.slice(0,7)))].sort().reverse();

  const filtered = reports.filter(r=>{
    if(search && !r.memberName.includes(search) && !r.coach.includes(search)) return false;
    if(fCoach!=="all" && r.coach!==fCoach) return false;
    if(fMonth!=="all" && !r.date.startsWith(fMonth)) return false;
    if(fStatus==="err"  && r.errCount===0) return false;
    if(fStatus==="ok"   && (r.errCount>0||r.warnCount>0)) return false;
    if(fStatus==="warn" && r.errCount>0) return false;
    return true;
  });

  const statsAll = {
    total: reports.length,
    members: new Set(reports.map(r=>r.memberId)).size,
    withErr: reports.filter(r=>r.errCount>0).length,
    allOk: reports.filter(r=>r.errCount===0&&r.warnCount===0).length,
  };

  const sel = { border:`1px solid ${T.bd2}`,borderRadius:20,padding:"5px 12px",fontSize:12,color:T.ink,fontFamily:"inherit",outline:"none",background:T.sf,cursor:"pointer" };

  // Starter 升級提示
  if(isStarter) return (
    <Page>
      <Topbar title="體態評估" />
      <Body>
        <div style={{ maxWidth:480,margin:"60px auto",textAlign:"center",padding:"0 20px" }}>
          <div style={{ fontSize:48,marginBottom:16 }}>🩻</div>
          <div style={{ fontSize:20,fontWeight:500,color:T.ink,marginBottom:8 }}>體態評估報告</div>
          <div style={{ fontSize:13,color:T.i3,lineHeight:1.8,marginBottom:24 }}>
            體態評估報告為 <strong style={{ color:T.lav }}>Pro 方案</strong> 以上功能。<br/>
            教練可透過 APP 拍照產生 AI 量化分析報告，<br/>學員可在前台即時查閱歷次評估紀錄。
          </div>
          <div style={{ background:T.sf,border:`1px solid ${T.bd}`,borderRadius:16,padding:"18px 20px",marginBottom:20,textAlign:"left" }}>
            <div style={{ fontSize:12,fontWeight:500,color:T.ink,marginBottom:12,display:"flex",alignItems:"center",gap:7 }}>
              <span style={{ fontSize:14 }}>💎</span>升級 Pro 即可使用
            </div>
            {[
              "教練 APP 拍照 + AI 骨態分析",
              "量化指標（頭部前引、脊椎側彎等）",
              "教練筆記 + 訓練計畫",
              "學員前台體態報告查閱",
              "評估報告 PDF 匯出",
              "後台跨教練報告總覽",
            ].map(f=>(
              <div key={f} style={{ display:"flex",alignItems:"center",gap:7,padding:"5px 0",borderBottom:`1px solid ${T.bd}`,fontSize:12,color:T.i2 }}>
                <span style={{ color:"#4CAF50",fontSize:10 }}>✓</span>{f}
              </div>
            ))}
          </div>
          <button style={{ padding:"12px 32px",borderRadius:20,border:"none",background:T.lav,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            升級至 Pro 方案 →
          </button>
          <div style={{ marginTop:10,fontSize:11,color:T.i3 }}>Pro 月費 $3,500 · 年繳享折扣</div>
        </div>
      </Body>
    </Page>
  );

  return (
    <Page>
      <Topbar title="體態評估">
        <div style={{ display:"flex",gap:3,background:T.sb,borderRadius:20,padding:3 }}>
          {[["list","列表"],["cards","卡片"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)}
              style={{ padding:"4px 12px",borderRadius:18,fontSize:12,color:view===v?T.ink:T.i3,background:view===v?T.sf:"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}>{l}</button>
          ))}
        </div>
        <Btn variant="primary">＋ 新增評估</Btn>
      </Topbar>

      <Body>
        {/* 統計卡 */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
          {[
            { label:"評估總數",    value:statsAll.total,   sub:"所有紀錄",     color:T.rose,  bg:T.rs   },
            { label:"涉及學員",    value:statsAll.members, sub:"不重複人數",   color:T.sage,  bg:T.ss   },
            { label:"有異常項目",  value:statsAll.withErr, sub:"需重點關注",   color:"#E53935",bg:"#FFEBEE" },
            { label:"全數正常",    value:statsAll.allOk,   sub:"體態良好",     color:T.sage,  bg:T.ss   },
          ].map(s=>(
            <Card key={s.label} style={{ padding:"14px 16px" }}>
              <div style={{ fontSize:10,color:T.i3,letterSpacing:".06em",marginBottom:6 }}>{s.label}</div>
              <div style={{ fontSize:28,fontWeight:300,color:s.color,lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:10,color:T.i3,marginTop:4 }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        {/* 篩選列 */}
        <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.i3 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜尋學員或教練…"
              style={{ border:`1px solid ${T.bd2}`,borderRadius:20,padding:"5px 12px 5px 28px",fontSize:12,color:T.ink,outline:"none",fontFamily:"inherit",width:160 }} />
          </div>
          <select value={fCoach} onChange={e=>setFCoach(e.target.value)} style={sel}>
            <option value="all">所有教練</option>
            {coaches.map(c=><option key={c}>{c}</option>)}
          </select>
          <select value={fMonth} onChange={e=>setFMonth(e.target.value)} style={sel}>
            <option value="all">所有月份</option>
            {months.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={sel}>
            <option value="all">所有狀態</option>
            <option value="err">有異常項目</option>
            <option value="warn">僅留意（無異常）</option>
            <option value="ok">全數正常</option>
          </select>
          {(search||fCoach!=="all"||fMonth!=="all"||fStatus!=="all") && (
            <button onClick={()=>{setSearch("");setFCoach("all");setFMonth("all");setFStatus("all");}}
              style={{ fontSize:11,color:T.rose,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}>✕ 清除</button>
          )}
          <span style={{ fontSize:11,color:T.i3,marginLeft:"auto" }}>共 {filtered.length} 筆</span>
        </div>

        {/* 列表視圖 */}
        {view==="list" && (
          <Card>
            <div style={{ display:"grid",gridTemplateColumns:"44px 1fr 80px 140px 70px 100px 100px",background:T.sb,borderBottom:`1px solid ${T.bd}` }}>
              {["","學員","教練","評估日期","異常","留意",""].map((h,i)=>(
                <div key={i} style={{ padding:"9px 10px",fontSize:10,color:T.i3,fontWeight:500,letterSpacing:".05em" }}>{h}</div>
              ))}
            </div>
            {filtered.length===0 ? (
              <div style={{ padding:"40px",textAlign:"center",color:T.i3,fontSize:13 }}>沒有符合條件的評估報告</div>
            ) : filtered.map((r,i)=>(
              <div key={r.id}
                style={{ display:"grid",gridTemplateColumns:"44px 1fr 80px 140px 70px 100px 100px",
                         borderBottom:i<filtered.length-1?`1px solid ${T.bd}`:"none",
                         background:i%2===0?T.sf:T.bg,alignItems:"center",
                         cursor:"pointer",transition:"background .1s" }}
                onClick={()=>setSelected(r)}
                onMouseEnter={e=>e.currentTarget.style.background=T.rs}
                onMouseLeave={e=>e.currentTarget.style.background=i%2===0?T.sf:T.bg}>
                {/* 頭像 */}
                <div style={{ padding:"11px 8px" }}>
                  <div style={{ width:28,height:28,borderRadius:"50%",background:r.memberBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:r.memberColor,fontWeight:600 }}>
                    {r.memberInitial}
                  </div>
                </div>
                {/* 學員 + 進度 */}
                <div style={{ padding:"11px 10px" }}>
                  <div style={{ fontSize:13,color:T.ink,fontWeight:500 }}>{r.memberName}</div>
                  <div style={{ fontSize:10,color:T.i3,marginTop:1 }}>{r.progress}</div>
                </div>
                {/* 教練 */}
                <div style={{ padding:"11px 10px",fontSize:12,color:T.i2 }}>{r.coach}</div>
                {/* 日期 */}
                <div style={{ padding:"11px 10px",fontSize:12,color:T.i2 }}>{r.date}</div>
                {/* 異常 */}
                <div style={{ padding:"11px 10px" }}>
                  {r.errCount>0
                    ? <span style={{ fontSize:11,padding:"2px 8px",borderRadius:10,background:"#FFEBEE",color:"#C62828",fontWeight:600 }}>{r.errCount} 項</span>
                    : <span style={{ fontSize:11,color:T.i3 }}>—</span>}
                </div>
                {/* 留意 */}
                <div style={{ padding:"11px 10px" }}>
                  {r.warnCount>0
                    ? <span style={{ fontSize:11,padding:"2px 8px",borderRadius:10,background:"#FFF3E0",color:"#E65100" }}>{r.warnCount} 項</span>
                    : <span style={{ fontSize:11,color:T.i3 }}>—</span>}
                </div>
                {/* 操作 */}
                <div style={{ padding:"11px 8px" }}>
                  <Btn sm onClick={e=>{e.stopPropagation();setSelected(r);}}>查看報告</Btn>
                </div>
              </div>
            ))}
          </Card>
        )}

        {/* 卡片視圖 */}
        {view==="cards" && (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14 }}>
            {filtered.length===0 ? (
              <div style={{ gridColumn:"1/-1",padding:"40px",textAlign:"center",color:T.i3,fontSize:13 }}>沒有符合條件的評估報告</div>
            ) : filtered.map(r=>(
              <Card key={r.id} style={{ padding:"16px",cursor:"pointer" }} onClick={()=>setSelected(r)}>
                {/* 學員 + 教練 */}
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                  <div style={{ width:40,height:40,borderRadius:"50%",background:r.memberBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:r.memberColor,fontWeight:300,flexShrink:0 }}>
                    {r.memberInitial}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:14,fontWeight:500,color:T.ink }}>{r.memberName}</div>
                    <div style={{ fontSize:11,color:T.i3 }}>{r.coach} 教練 · {r.date}</div>
                  </div>
                  {r.errCount===0&&r.warnCount===0
                    ? <span style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:"#E8F5E9",color:"#388E3C" }}>全正常</span>
                    : r.errCount>0
                      ? <span style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:"#FFEBEE",color:"#C62828" }}>異常 {r.errCount}</span>
                      : <span style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:"#FFF3E0",color:"#E65100" }}>留意 {r.warnCount}</span>
                  }
                </div>

                {/* 五項指標 mini */}
                <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4,marginBottom:12 }}>
                  {r.metrics.map(m=>{
                    const st=PS[m.status];
                    return (
                      <div key={m.name} style={{ background:st.bg,borderRadius:7,padding:"5px 4px",textAlign:"center" }}>
                        <div style={{ fontSize:11,fontWeight:700,color:st.color }}>{m.value}°</div>
                        <div style={{ fontSize:8,color:st.color,marginTop:1,lineHeight:1.2 }}>{m.name.slice(0,2)}</div>
                      </div>
                    );
                  })}
                </div>

                {/* 教練備注摘要 */}
                <div style={{ fontSize:11,color:T.i2,lineHeight:1.6,marginBottom:12,
                              overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>
                  {r.coachNote}
                </div>

                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${T.bd}` }}>
                  <span style={{ fontSize:10,color:T.i3 }}>{r.progress}</span>
                  <Btn sm onClick={e=>{e.stopPropagation();setSelected(r);}}>查看</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Body>

      {selected && <PostureDetailModal report={selected} onClose={()=>setSelected(null)} />}
    </Page>
  );
}
