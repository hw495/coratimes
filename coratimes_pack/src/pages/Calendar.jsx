import { useState } from "react";
import Topbar from "../components/Topbar";
import Btn from "../components/Btn";
import { calendarWeek, members } from "../data/mock";
import s from "./Calendar.module.css";

const typeStyle = {
  solo:   { bg: "var(--rs)",   border: "var(--rose)",  text: "var(--rm)"  },
  group:  { bg: "var(--lavs)", border: "var(--lav)",   text: "var(--lav)" },
  space:  { bg: "var(--ambs)", border: "var(--amb)",   text: "var(--amb)" },
  paused: { bg: "var(--sb)",   border: "var(--sand3)", text: "var(--i3)"  },
};

const T = {
  ink:"#3A3530", i2:"#7A6E68", i3:"#A89E94", bd:"#EAE4DC", bd2:"#D6CCC0",
  sf:"#FFFFFF", sb:"#F0EBE3", bg:"#FAF8F5",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  green:"#4CAF50", greenDark:"#388E3C",
};

const COURSE_TYPES = ["專屬陪練（1對1）","小班共練（1對2）","初次體驗","空間借用"];
const COURSES = {
  "專屬陪練（1對1）": ["器械 1 對 1","墊上 1 對 1"],
  "小班共練（1對2）": ["墊上 1 對 2","小班共練"],
  "初次體驗":        ["體驗時光"],
  "空間借用":        ["靜心室借用","舒活室借用"],
};
const COACHES = [
  { name:"Sammi", avatar:"S" },
  { name:"Annie", avatar:"A" },
  { name:"Kelly", avatar:"K" },
];
const FEE_METHODS = ["固定鐘點（每堂）","依課程類型計費","不計費（店主代課）"];
const ROOMS = ["靜心室","舒活室","多功能室"];
const PASSES = ["沒有任何課卡方案","10堂私教卡","20堂私教卡","月票無限堂","體驗券（1次）"];

const inp = {
  width:"100%", border:`1px solid ${T.bd2}`, borderRadius:9,
  padding:"9px 11px", fontSize:13, color:T.ink,
  fontFamily:"inherit", outline:"none", background:T.sf,
  boxSizing:"border-box",
};
const lbl = {
  fontSize:11, color:T.i3, letterSpacing:".05em",
  marginBottom:6, display:"block", fontWeight:500,
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <span style={lbl}>{label}</span>
      {children}
    </div>
  );
}

function BookingModal({ onClose }) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0,10);
  const hh = String(now.getHours()).padStart(2,"0");
  const mm = String(Math.floor(now.getMinutes()/5)*5).padStart(2,"0");

  const [form, setForm] = useState({
    courseType: "專屬陪練（1對1）",
    courseName: "",
    coach: "Sammi",
    substitute: false,
    feeMethod: "",
    date: todayStr,
    hour: "",
    minute: "",
    room: "",
    memberName: "",
    bookedBy: "會員本人",
    pass: "沒有任何課卡方案",
  });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const setNow = () => {
    f("date", todayStr);
    f("hour", hh);
    f("minute", mm);
  };

  const hours   = Array.from({length:16},(_,i)=>String(i+7).padStart(2,"0"));
  const minutes = ["00","05","10","15","20","25","30","35","40","45","50","55"];

  const canSubmit = form.courseName && form.hour && form.minute && form.room && form.memberName;

  return (
    <div
      onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.4)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:200,
               backdropFilter:"blur(4px)",fontFamily:"'Noto Sans TC',sans-serif",padding:"16px 0" }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{ background:T.sf,borderRadius:20,width:420,maxWidth:"94vw",
                 maxHeight:"90vh",overflowY:"auto",border:`1px solid ${T.bd}`,
                 boxShadow:"0 8px 40px rgba(58,53,48,.15)" }}
      >
        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"18px 20px 14px",borderBottom:`1px solid ${T.bd}`,position:"sticky",top:0,background:T.sf,zIndex:1,borderRadius:"20px 20px 0 0" }}>
          <span style={{ fontSize:15,fontWeight:600,color:T.ink }}>新增 1 對 1 課程</span>
          <button onClick={onClose} style={{ background:"none",border:`1px solid ${T.bd2}`,borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:T.i3,cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ padding:"18px 20px" }}>

          {/* 課程類型 */}
          <Field label="課程類型">
            <select value={form.courseType}
              onChange={e=>{ f("courseType",e.target.value); f("courseName",""); }}
              style={inp}>
              {COURSE_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </Field>

          {/* 課程名稱 */}
          <Field label="課程名稱">
            <select value={form.courseName} onChange={e=>f("courseName",e.target.value)} style={inp}>
              <option value="">請選擇課程</option>
              {(COURSES[form.courseType]||[]).map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>

          {/* 課程教練 */}
          <Field label="課程教練">
            <div style={{ display:"flex",alignItems:"center",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"6px 11px",gap:10,background:T.sf }}>
              <div style={{ width:28,height:28,borderRadius:"50%",background:"#C4957A22",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:12,fontWeight:600,color:T.rose,flexShrink:0 }}>
                {COACHES.find(c=>c.name===form.coach)?.avatar}
              </div>
              <select value={form.coach} onChange={e=>f("coach",e.target.value)}
                style={{ border:"none",outline:"none",fontSize:13,color:T.ink,
                         fontFamily:"inherit",background:"transparent",flex:1,cursor:"pointer" }}>
                {COACHES.map(c=><option key={c.name}>{c.name}</option>)}
              </select>
            </div>
            <label style={{ display:"flex",alignItems:"center",gap:7,marginTop:8,cursor:"pointer" }}>
              <input type="checkbox" checked={form.substitute} onChange={e=>f("substitute",e.target.checked)}
                style={{ width:15,height:15,accentColor:T.rose,cursor:"pointer" }} />
              <span style={{ fontSize:12,color:T.i2 }}>代課</span>
            </label>
          </Field>

          {/* 教練鐘點費 */}
          <Field label="教練鐘點費">
            <select value={form.feeMethod} onChange={e=>f("feeMethod",e.target.value)} style={inp}>
              <option value="">請選擇計算方式</option>
              {FEE_METHODS.map(m=><option key={m}>{m}</option>)}
            </select>
          </Field>

          {/* 上課日期 */}
          <Field label="上課日期">
            <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
              <input type="date" value={form.date} onChange={e=>f("date",e.target.value)}
                style={{ ...inp, flex:"1 1 130px", width:"auto" }} />
              <select value={form.hour} onChange={e=>f("hour",e.target.value)}
                style={{ ...inp, flex:"0 0 72px", width:"auto" }}>
                <option value="">時</option>
                {hours.map(h=><option key={h}>{h}</option>)}
              </select>
              <select value={form.minute} onChange={e=>f("minute",e.target.value)}
                style={{ ...inp, flex:"0 0 72px", width:"auto" }}>
                <option value="">分</option>
                {minutes.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <button onClick={setNow}
              style={{ marginTop:8,padding:"5px 14px",borderRadius:20,
                       border:`1px solid ${T.bd2}`,background:T.sf,
                       color:T.i2,fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>
              現在時間
            </button>
          </Field>

          {/* 開課教室 */}
          <Field label="開課教室">
            <select value={form.room} onChange={e=>f("room",e.target.value)} style={inp}>
              <option value="">請選擇教室</option>
              {ROOMS.map(r=><option key={r}>{r}</option>)}
            </select>
          </Field>

          {/* 上課會員 */}
          <Field label="上課會員">
            <input
              type="text"
              placeholder="請輸入會員姓名"
              value={form.memberName}
              onChange={e=>f("memberName",e.target.value)}
              style={inp}
            />
            {(() => {
              const matched = members.find(m => form.memberName && m.name === form.memberName);
              if (matched?.healthFlagged) {
                return (
                  <div style={{ marginTop:8, padding:"8px 12px", background:"#FDECEA", border:"1px solid #F5C6C2",
                    borderRadius:9, fontSize:11, color:"#C62828", lineHeight:1.6, display:"flex", gap:7, alignItems:"flex-start" }}>
                    <span style={{ flexShrink:0 }}>⚠</span>
                    <span><strong>健康狀況提醒：</strong>{matched.healthNote || "此學員於健康評估表標註身體狀況，請留意動作安排。"}</span>
                  </div>
                );
              }
              return null;
            })()}
          </Field>

          {/* 預約人員 */}
          <Field label="預約人員">
            <select value={form.bookedBy} onChange={e=>f("bookedBy",e.target.value)} style={inp}>
              <option>會員本人</option>
              <option>店家代預約</option>
              <option>教練代預約</option>
            </select>
          </Field>

          {/* 課卡方案 */}
          <Field label="課卡方案">
            <select value={form.pass} onChange={e=>f("pass",e.target.value)} style={inp}>
              {PASSES.map(p=><option key={p}>{p}</option>)}
            </select>
          </Field>

        </div>

        {/* Footer */}
        <div style={{ display:"flex",gap:10,padding:"14px 20px",borderTop:`1px solid ${T.bd}`,
                      position:"sticky",bottom:0,background:T.sf,
                      borderRadius:"0 0 20px 20px" }}>
          <button onClick={onClose}
            style={{ flex:1,padding:"11px",borderRadius:12,border:`1px solid ${T.bd2}`,
                     background:"none",color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
            取消
          </button>
          <button
            disabled={!canSubmit}
            onClick={()=>{ if(canSubmit) onClose(); }}
            style={{ flex:2,padding:"11px",borderRadius:12,border:"none",
                     background:canSubmit?T.green:"#ccc",color:"#fff",
                     fontSize:13,fontWeight:600,cursor:canSubmit?"pointer":"not-allowed",
                     fontFamily:"inherit",transition:"background .2s" }}>
            確定預約
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Calendar() {
  const [modal, setModal] = useState(false);

  return (
    <div className={s.page}>
      <Topbar title="時光表">
        <select className={s.sel}><option>所有教練</option><option>Sammi</option></select>
        <select className={s.sel}><option>所有空間</option><option>靜心室</option></select>
        <Btn>◀</Btn>
        <span className={s.weekChip}>5 月 18–24 日</span>
        <Btn>本週</Btn>
        <Btn>▶</Btn>
        <Btn variant="primary" onClick={()=>setModal(true)}>＋ 新增時光</Btn>
      </Topbar>

      <div className={s.body}>
        <div className={s.calWrap}>
          <div className={s.weekHeader}>
            {calendarWeek.map(d => (
              <div key={d.day} className={`${s.dayHead} ${d.today ? s.today : ""}`}>
                <div className={s.dw}>{d.weekday}</div>
                <div className={s.dn}>{d.day}</div>
              </div>
            ))}
          </div>
          <div className={s.weekBody}>
            {calendarWeek.map(d => (
              <div key={d.day} className={`${s.dayCol} ${d.today ? s.todayCol : ""}`}>
                {d.sessions.map((sess, i) => {
                  const ts = typeStyle[sess.type] || typeStyle.solo;
                  return (
                    <div key={i} className={s.sc} style={{ background: ts.bg, borderLeftColor: ts.border }}>
                      <div className={s.scTime}>{sess.time}</div>
                      <div className={s.scName} style={{ color: ts.text }}>{sess.name}</div>
                      <div className={s.scMeta}>{sess.quota}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className={s.legend}>
            {[
              { color: "var(--rose)", label: "專屬陪練" },
              { color: "var(--lav)",  label: "小班共練" },
              { color: "var(--amb)",  label: "空間借用" },
              { color: "var(--sand3)",label: "暫休" },
            ].map(l => (
              <div key={l.label} className={s.legItem}>
                <div className={s.legDot} style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal && <BookingModal onClose={()=>setModal(false)} />}
    </div>
  );
}
