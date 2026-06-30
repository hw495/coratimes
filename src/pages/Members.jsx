import { useState, useMemo } from "react";
import FilterBar from "../components/FilterBar";
import Topbar from "../components/Topbar";
import Btn from "../components/Btn";
import { members as initMembers, plans as allPlans } from "../data/mock";
import s from "./Members.module.css";
import { useBreakpoint } from "../hooks/useBreakpoint";

const AV_PALETTES = [
  { bg:"#F5ECE6", color:"#A87A62" }, { bg:"#EEF2F6", color:"#8A9BAE" },
  { bg:"#F0EDF5", color:"#9B8FAE" }, { bg:"#F5EDD8", color:"#B8924A" },
  { bg:"#EAF2EF", color:"#5C7D6F" }, { bg:"#F5ECE6", color:"#C4957A" },
];
const statusDot = { active:"var(--sage)", expiring:"var(--amb)", none:"var(--sand3)" };
const COUNTRY_CODES = ["+886 台灣","+86 中國","+852 香港","+853 澳門","+81 日本","+1 美國","+44 英國"];
const GENDERS = [{ value:"female", label:"女性" },{ value:"male", label:"男性" },{ value:"other", label:"其他" }];
const currentYear = new Date().getFullYear();
const YEARS  = Array.from({length:80},(_,i)=>String(currentYear-i));
const MONTHS = Array.from({length:12},(_,i)=>String(i+1).padStart(2,"0"));
const DAYS   = Array.from({length:31},(_,i)=>String(i+1).padStart(2,"0"));

const T = {
  ink:"#3A3530", i2:"#7A6E68", i3:"#A89E94",
  bd:"#EAE4DC", bd2:"#D6CCC0", sf:"#FFFFFF", sb:"#F0EBE3", bg:"#FAF8F5",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  sage:"#4CAF50", ss:"#EAF2EF", sm:"#388E3C",
  red:"#C4726A", reds:"#FDECEA",
  green:"#4CAF50", greenLight:"#E8F5E9",
};

const emptyForm = () => ({
  name:"", nickname:"", gender:"female", countryCode:"+886 台灣",
  phone:"", email:"", birthYear:"", birthMonth:"", birthDay:"",
  emergencyName:"", emergencyPhone:"", note:"", photo:null,
});

// mock 課程紀錄
const MOCK_HISTORY = {
  1:[
    { id:1, course:"器械 1 對 1", coach:"Sammi", date:"2026/06/20", time:"10:00~11:00", room:"靜心室", status:"attended" },
    { id:2, course:"器械 1 對 1", coach:"Sammi", date:"2026/06/15", time:"10:00~11:00", room:"靜心室", status:"attended" },
    { id:3, course:"墊上 1 對 1", coach:"Annie", date:"2026/06/10", time:"14:00~15:00", room:"靜心室", status:"cancelled" },
    { id:4, course:"器械 1 對 1", coach:"Sammi", date:"2026/06/05", time:"10:00~11:00", room:"靜心室", status:"attended" },
  ],
  2:[
    { id:1, course:"器械 1 對 1", coach:"Sammi", date:"2026/06/18", time:"17:00~18:00", room:"靜心室", status:"attended" },
    { id:2, course:"器械 1 對 1", coach:"Sammi", date:"2026/06/11", time:"17:00~18:00", room:"靜心室", status:"absent" },
  ],
};

// mock 購買紀錄
const MOCK_PURCHASES = {
  1:[
    { id:1, plan:"器械一對一 12 次", amount:17280, method:"ATM", date:"2026/01/15", status:"paid" },
    { id:2, plan:"墊上一對一 6 次",  amount:5400,  method:"QRCode", date:"2025/08/12", status:"paid" },
    { id:3, plan:"器械一對一 12 次", amount:17280, method:"ATM", date:"2025/08/12", status:"paid" },
  ],
  2:[
    { id:1, plan:"器械一對一 6 次", amount:9975, method:"ATM", date:"2025/11/03", status:"paid" },
  ],
};

// mock 課卡使用
const MOCK_CARD_USAGE = {
  1:[
    { id:1, plan:"器械一對一 12 次", course:"器械 1 對 1", date:"2026/06/20", deduct:1, remain:8 },
    { id:2, plan:"器械一對一 12 次", course:"器械 1 對 1", date:"2026/06/15", deduct:1, remain:9 },
    { id:3, plan:"墊上一對一 6 次",  course:"墊上 1 對 1", date:"2026/06/10", deduct:1, remain:1 },
  ],
  2:[
    { id:1, plan:"器械一對一 6 次", course:"器械 1 對 1", date:"2026/06/18", deduct:1, remain:2 },
  ],
};

// ── 共用 UI ──────────────────────────────────────────────────
const inp = { width:"100%", border:`1px solid ${T.bd2}`, borderRadius:9, padding:"9px 11px", fontSize:13, color:T.ink, fontFamily:"inherit", outline:"none", background:T.sf, boxSizing:"border-box" };
const lbl = { fontSize:11, color:T.i3, letterSpacing:".05em", marginBottom:5, display:"block" };
const sec = { fontSize:12, fontWeight:600, color:T.ink, marginBottom:12, paddingBottom:6, borderBottom:`1px solid ${T.bd}` };

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <span style={lbl}>{label}{required && <span style={{ color:T.red, marginLeft:2 }}>*</span>}</span>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"9px 0",borderBottom:`1px solid ${T.bd}`,gap:12 }}>
      <span style={{ fontSize:12,color:T.i3,flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:13,color:T.ink,textAlign:"right",wordBreak:"break-all" }}>{value}</span>
    </div>
  );
}

// ── 新增／編輯 Modal ─────────────────────────────────────────
function MemberModal({ member, onSave, onClose }) {
  const isEdit = !!member;
  const [form, setForm] = useState(isEdit ? { ...member } : emptyForm());
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => f("photo", ev.target.result);
    reader.readAsDataURL(file);
  };

  const toggleStudio = (s) => {};
  const addSkill = () => {};
  const canSave = form.name.trim() && form.phone.trim();

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.4)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:300,
               backdropFilter:"blur(4px)",fontFamily:"'Noto Sans TC',sans-serif",padding:"16px 0" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:T.sf, borderRadius:20, width:460, maxWidth:"94vw",
                 maxHeight:"90vh", overflowY:"auto", border:`1px solid ${T.bd}`,
                 boxShadow:"0 8px 40px rgba(58,53,48,.15)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"18px 22px 14px", borderBottom:`1px solid ${T.bd}`,
                      position:"sticky",top:0,background:T.sf,zIndex:1,borderRadius:"20px 20px 0 0" }}>
          <span style={{ fontSize:15,fontWeight:600,color:T.ink }}>{isEdit?"編輯學員":"新增會員"}</span>
          <button onClick={onClose} style={{ background:"none",border:`1px solid ${T.bd2}`,borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:T.i3,cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:"20px 22px" }}>
          <Field label="會員姓名" required><input value={form.name} onChange={e=>f("name",e.target.value)} placeholder="真實姓名" style={inp} /></Field>
          <Field label="會員暱稱"><input value={form.nickname} onChange={e=>f("nickname",e.target.value)} placeholder="暱稱（選填）" style={inp} /></Field>
          <Field label="會員性別"><select value={form.gender} onChange={e=>f("gender",e.target.value)} style={inp}>{GENDERS.map(g=><option key={g.value} value={g.value}>{g.label}</option>)}</select></Field>
          <Field label="手機號碼" required>
            <div style={{ display:"flex",gap:8 }}>
              <select value={form.countryCode} onChange={e=>f("countryCode",e.target.value)} style={{ ...inp, width:"auto", flex:"0 0 140px" }}>{COUNTRY_CODES.map(c=><option key={c}>{c}</option>)}</select>
              <input value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="09xx-xxx-xxx" style={{ ...inp, flex:1 }} />
            </div>
          </Field>
          <Field label="電子信箱"><input type="email" value={form.email} onChange={e=>f("email",e.target.value)} placeholder="student@example.com（選填）" style={inp} /></Field>
          <Field label="出生日期">
            <div style={{ display:"flex",gap:8 }}>
              <select value={form.birthYear}  onChange={e=>f("birthYear",e.target.value)}  style={{ ...inp,flex:"1 1 0" }}><option value="">年</option>{YEARS.map(y=><option key={y}>{y}</option>)}</select>
              <select value={form.birthMonth} onChange={e=>f("birthMonth",e.target.value)} style={{ ...inp,flex:"1 1 0" }}><option value="">月</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select>
              <select value={form.birthDay}   onChange={e=>f("birthDay",e.target.value)}   style={{ ...inp,flex:"1 1 0" }}><option value="">日</option>{DAYS.map(d=><option key={d}>{d}</option>)}</select>
            </div>
          </Field>
          <div style={{ ...sec, marginTop:8 }}>緊急聯絡人</div>
          <Field label="聯絡人姓名"><input value={form.emergencyName} onChange={e=>f("emergencyName",e.target.value)} placeholder="聯絡人姓名（選填）" style={inp} /></Field>
          <Field label="聯絡電話"><input value={form.emergencyPhone} onChange={e=>f("emergencyPhone",e.target.value)} placeholder="聯絡人電話（選填）" style={inp} /></Field>
          <div style={{ ...sec, marginTop:8 }}>備忘</div>
          <Field label="傷病史或特殊需求"><textarea value={form.note} onChange={e=>f("note",e.target.value)} placeholder="過敏、傷病史或特殊需求（選填）" rows={3} style={{ ...inp, resize:"vertical", lineHeight:1.6 }} /></Field>
        </div>
        <div style={{ display:"flex",gap:10,padding:"14px 22px",borderTop:`1px solid ${T.bd}`,position:"sticky",bottom:0,background:T.sf,borderRadius:"0 0 20px 20px" }}>
          <button onClick={onClose} style={{ flex:1,padding:"11px",borderRadius:12,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>取消</button>
          <button disabled={!canSave} onClick={()=>canSave&&onSave(form)} style={{ flex:2,padding:"11px",borderRadius:12,border:"none",background:canSave?T.green:"#ccc",color:"#fff",fontSize:13,fontWeight:600,cursor:canSave?"pointer":"not-allowed",fontFamily:"inherit" }}>{isEdit?"儲存變更":"儲存"}</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ member, onConfirm, onClose }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,backdropFilter:"blur(4px)",fontFamily:"'Noto Sans TC',sans-serif" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:T.sf,borderRadius:20,padding:"28px 26px",width:340,maxWidth:"90vw",border:`1px solid ${T.bd}`,boxShadow:"0 8px 40px rgba(58,53,48,.18)",textAlign:"center" }}>
        <div style={{ fontSize:32,marginBottom:12 }}>🗑</div>
        <div style={{ fontSize:15,fontWeight:600,color:T.ink,marginBottom:8 }}>確定刪除學員？</div>
        <div style={{ fontSize:13,color:T.i3,lineHeight:1.7,marginBottom:22 }}>將永久刪除 <strong style={{ color:T.ink }}>{member.name}</strong> 的所有資料，此操作無法復原。</div>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={onClose} style={{ flex:1,padding:"10px",borderRadius:12,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>取消</button>
          <button onClick={onConfirm} style={{ flex:1,padding:"10px",borderRadius:12,border:"none",background:T.red,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>確定刪除</button>
        </div>
      </div>
    </div>
  );
}

// ── 體態評估 mock 資料 ────────────────────────────────────────
const MOCK_POSTURE = {
  1: [
    {
      id: 1, date:"2026/05/22", coach:"Sammi", progress:"器械私教 1/10",
      purpose:"建立初始體態數位基準線，針對骨盆歪斜、脊椎排列與高低肩進行精準量化追蹤。",
      metrics: [
        { name:"頭部前引角度",   ideal:"< 15°",  value:23.5, status:"err",  note:"輕微烏龜頸，伴隨胸鎖乳突肌過緊。" },
        { name:"高低肩（左右差）",ideal:"0° / 水平", value:1.8,  status:"warn", note:"疑似習慣性單邊提肩，上斜方肌兩側張力不均。" },
        { name:"脊椎側彎角度",   ideal:"< 10°",  value:7.2,  status:"warn", note:"處於臨界值，建議加強核心不對稱旋轉阻力訓練。" },
        { name:"骨盆傾斜（左右）",ideal:"0° / 水平", value:2.1,  status:"warn", note:"骨盆歪斜，可能影響單側臀大肌與腰方肌發力。" },
        { name:"骨盆前傾角度",   ideal:"7°–15°", value:19.2, status:"err",  note:"下交叉綜合症，伴隨腹直肌無力、腰椎壓力過大。" },
      ],
      findings: { breath:true, core:true, winging:true, rib:true },
      springs: [
        { name:"Footwork", value:"2紅1藍" },
        { name:"Arms in Straps", value:"1紅" },
      ],
      coachNote:"學員今日初次體驗，主要痛點為長期久坐引起的骨盆前傾與輕微高低肩。在 Reformer 操作時，必須隨時注意控制肋骨外翻，並透過一紅一藍的彈簧設定來誘導深層核心與臀肌的穩定度。前 5 堂課將專注於脊椎中立位的尋找與呼吸優化，後半期則引進不對稱阻力，以改善兩側骨盆不平衡問題。",
      phase1:["橫膈膜呼吸模式優化與肋骨控制","骨盆中立位與脊椎中立線的建立","核心深層、臀大肌與腹直肌的喚醒"],
      phase2:["Reformer 跨軸三維空間的動態穩定訓練","引進不對稱阻力，針對單側弱勢肌群進行強化"],
      homework:"每日進行 3 組貓牛式 (Cat-Cow) 與泡沫軸胸廓放鬆，每組持續 60 秒。",
      freq:"每週 2 次",
      goal:"骨盆歪斜角度由 2.1° 降至 1° 以內，並顯著改善高低肩與體態不平衡問題。",
    },
  ],
};

const STATUS_STYLE = {
  ok:   { bg:"#E8F5E9", color:"#388E3C", label:"正常" },
  warn: { bg:"#FFF3E0", color:"#E65100", label:"留意" },
  err:  { bg:"#FDECEA", color:"#C4726A", label:"異常" },
};

const METRIC_DEFAULTS = [
  { name:"頭部前引角度",    ideal:"< 15°",    warnAt:15, errAt:20  },
  { name:"高低肩（左右差）", ideal:"0° / 水平", warnAt:1,  errAt:2.5 },
  { name:"脊椎側彎角度",    ideal:"< 10°",    warnAt:5,  errAt:10  },
  { name:"骨盆傾斜（左右）", ideal:"0° / 水平", warnAt:1,  errAt:2.5 },
  { name:"骨盆前傾角度",    ideal:"7°–15°",   warnAt:15, errAt:18  },
  { name:"頸椎曲線角度",    ideal:"20°–40°",  warnAt:40, errAt:45  },
];

function getStatus(val, warnAt, errAt) {
  if(val >= errAt) return "err";
  if(val >= warnAt) return "warn";
  return "ok";
}

// ── 體態報告 Tab ──────────────────────────────────────────────
function PostureTab({ member, onNew, viewReport, setViewReport }) {
  const reports = (MOCK_POSTURE[member.id] || []).concat(member.postureReports || []);
  const current = viewReport
    ? reports.find(r=>r.id===viewReport) || reports[0]
    : reports[0];

  if(reports.length === 0) return (
    <div style={{ textAlign:"center",padding:"40px 0" }}>
      <div style={{ fontSize:32,marginBottom:12 }}>📋</div>
      <div style={{ fontSize:14,color:"#3A3530",fontWeight:500,marginBottom:6 }}>尚無體態評估紀錄</div>
      <div style={{ fontSize:12,color:"#A89E94",marginBottom:18,lineHeight:1.7 }}>
        教練可在此新增體態評估報告<br/>學員完成課程後定期複檢追蹤進度
      </div>
      <button onClick={onNew}
        style={{ padding:"9px 20px",borderRadius:20,border:"none",background:"#C4957A",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:500 }}>
        ＋ 新增第一次評估
      </button>
    </div>
  );

  return (
    <div style={{ display:"flex",gap:12 }}>
      {/* 左：報告清單 */}
      <div style={{ width:140,flexShrink:0,borderRight:"1px solid #EAE4DC",marginRight:4 }}>
        <div style={{ fontSize:10,color:"#A89E94",letterSpacing:".06em",marginBottom:8,paddingBottom:6,borderBottom:"1px solid #EAE4DC" }}>歷次評估</div>
        {reports.map((r,i)=>(
          <div key={r.id} onClick={()=>setViewReport(r.id)}
            style={{ padding:"8px 9px",borderRadius:8,marginBottom:4,cursor:"pointer",
                     background:current?.id===r.id?"#F5ECE6":"transparent",
                     border:`1px solid ${current?.id===r.id?"#C4957A":"transparent"}` }}>
            <div style={{ fontSize:11,fontWeight:500,color:"#3A3530" }}>第 {i+1} 次</div>
            <div style={{ fontSize:10,color:"#A89E94",marginTop:2 }}>{r.date}</div>
            <div style={{ fontSize:10,color:"#A89E94" }}>{r.coach}</div>
          </div>
        ))}
        <button onClick={onNew}
          style={{ width:"100%",padding:"7px",borderRadius:8,border:"1px dashed #D6CCC0",background:"none",color:"#A89E94",fontSize:11,cursor:"pointer",fontFamily:"inherit",marginTop:6 }}>
          ＋ 新增評估
        </button>
      </div>

      {/* 右：報告詳情 */}
      {current && (
        <div style={{ flex:1,minWidth:0 }}>
          {/* 標題列 */}
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14,gap:8 }}>
            <div>
              <div style={{ fontSize:13,fontWeight:500,color:"#3A3530" }}>
                第 {(MOCK_POSTURE[member.id]||[]).concat(member.postureReports||[]).findIndex(r=>r.id===current.id)+1} 次體態評估報告
              </div>
              <div style={{ fontSize:11,color:"#A89E94",marginTop:2 }}>{current.date} · {current.coach} 教練 · {current.progress}</div>
            </div>
            <span style={{ fontSize:10,padding:"3px 9px",borderRadius:10,background:"#E8F5E9",color:"#388E3C",flexShrink:0 }}>已發布</span>
          </div>

          {/* 量化指標卡 */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12 }}>
            {current.metrics.map((m,i)=>{
              const st = STATUS_STYLE[m.status]||STATUS_STYLE.ok;
              const pct = Math.min((m.value / (m.status==="ok"?20:30))*100, 100);
              return (
                <div key={i} style={{ background:"#FAF8F5",borderRadius:9,padding:"9px 11px",border:"1px solid #EAE4DC" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3 }}>
                    <span style={{ fontSize:11,fontWeight:500,color:"#3A3530" }}>{m.name}</span>
                    <span style={{ fontSize:10,padding:"1px 6px",borderRadius:8,background:st.bg,color:st.color,flexShrink:0,marginLeft:4 }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize:18,fontWeight:400,color:m.status==="err"?"#C4726A":m.status==="warn"?"#E8943A":"#4CAF50",marginBottom:2 }}>{m.value}°</div>
                  <div style={{ fontSize:9,color:"#A89E94",marginBottom:5 }}>理想 {m.ideal}</div>
                  <div style={{ height:3,background:"#EAE4DC",borderRadius:2,overflow:"hidden" }}>
                    <div style={{ height:3,borderRadius:2,width:`${pct}%`,background:m.status==="err"?"#C4726A":m.status==="warn"?"#E8943A":"#4CAF50" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 篩查結果 */}
          <div style={{ background:"#FAF8F5",border:"1px solid #EAE4DC",borderRadius:9,padding:"9px 11px",marginBottom:10 }}>
            <div style={{ fontSize:10,color:"#A89E94",letterSpacing:".06em",marginBottom:7 }}>動態功能篩查</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:4 }}>
              {[
                ["呼吸模式", current.findings?.breath, "胸式呼吸為主"],
                ["核心穩定度不足", current.findings?.core, "下背離墊"],
                ["翼狀肩胛", current.findings?.winging, "肩胛骨翼狀"],
                ["肋骨外翻", current.findings?.rib, "吸氣時外翻"],
              ].map(([label,active,sub])=>(
                <div key={label} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11 }}>
                  <div style={{ width:14,height:14,borderRadius:3,border:`1.5px solid ${active?"#C4726A":"#D6CCC0"}`,background:active?"#FDECEA":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    {active && <span style={{ color:"#C4726A",fontSize:9,lineHeight:1 }}>✓</span>}
                  </div>
                  <div>
                    <span style={{ color:"#3A3530" }}>{label}</span>
                  </div>
                </div>
              ))}
            </div>
            {current.springs?.length > 0 && (
              <div style={{ marginTop:8,paddingTop:8,borderTop:"1px solid #EAE4DC" }}>
                <div style={{ fontSize:10,color:"#A89E94",marginBottom:5 }}>Reformer 彈簧設定</div>
                <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                  {current.springs.map(sp=>(
                    <span key={sp.name} style={{ fontSize:11,color:"#7A6E68" }}><span style={{ color:"#A89E94" }}>{sp.name}：</span>{sp.value}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 教練評估 */}
          <div style={{ borderLeft:"2px solid #C4957A",paddingLeft:10,marginBottom:10,fontSize:12,color:"#6E6358",lineHeight:1.7 }}>
            {current.coachNote}
          </div>

          {/* 訓練計畫 */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10 }}>
            <div style={{ background:"#FAF8F5",border:"1px solid #EAE4DC",borderRadius:9,padding:"9px 11px" }}>
              <div style={{ fontSize:11,fontWeight:500,color:"#3A3530",marginBottom:6 }}>📅 階段一訓練重點</div>
              {current.phase1?.map((p,i)=><div key={i} style={{ fontSize:11,color:"#6E6358",padding:"2px 0",lineHeight:1.5 }}>· {p}</div>)}
            </div>
            <div style={{ background:"#FAF8F5",border:"1px solid #EAE4DC",borderRadius:9,padding:"9px 11px" }}>
              <div style={{ fontSize:11,fontWeight:500,color:"#3A3530",marginBottom:6 }}>📅 階段二訓練重點</div>
              {current.phase2?.map((p,i)=><div key={i} style={{ fontSize:11,color:"#6E6358",padding:"2px 0",lineHeight:1.5 }}>· {p}</div>)}
            </div>
          </div>

          {/* 居家 + 目標 */}
          <div style={{ background:"#EAF2EF",border:"1px solid #B2D8C9",borderRadius:9,padding:"9px 11px",marginBottom:8,fontSize:11,color:"#5C7D6F" }}>
            🏠 <strong>居家建議：</strong>{current.homework}
          </div>
          <div style={{ background:"#E8F5E9",border:"1px solid #C8E6C9",borderRadius:9,padding:"9px 11px",fontSize:11,color:"#388E3C" }}>
            🎯 <strong>複檢目標：</strong>{current.goal}　建議排課：{current.freq}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 體態評估輸入 Modal ────────────────────────────────────────
function PostureInputModal({ member, onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    coach:"Sammi", progress:"", purpose:"",
    metrics: METRIC_DEFAULTS.map(m=>({...m, value:"", note:""})),
    findings:{ breath:false, core:false, winging:false, rib:false },
    springs:[{name:"Footwork",value:""},{name:"Arms in Straps",value:""}],
    coachNote:"", phase1:"", phase2:"", homework:"", freq:"每週 2 次", goal:"",
  });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const fM = (i,k,v) => setForm(p=>({ ...p, metrics:p.metrics.map((m,idx)=>idx===i?{...m,[k]:v}:m) }));
  const fFind = (k) => setForm(p=>({...p,findings:{...p.findings,[k]:!p.findings[k]}}));

  const STEPS = ["基本資料","量化分析","功能篩查","教練筆記"];
  const sel = { width:"100%",border:"1px solid #D6CCC0",borderRadius:9,padding:"8px 10px",fontSize:12,color:"#3A3530",fontFamily:"inherit",outline:"none",background:"#fff",boxSizing:"border-box" };
  const inp = { ...sel };
  const lbl = { fontSize:10,color:"#A89E94",letterSpacing:".06em",marginBottom:4,display:"block" };

  const handleSave = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,"0")}/${String(now.getDate()).padStart(2,"0")}`;
    const report = {
      id: Date.now(), date:dateStr,
      coach:form.coach, progress:form.progress, purpose:form.purpose,
      metrics: form.metrics.filter(m=>m.value!=="").map(m=>({
        name:m.name, ideal:m.ideal, value:parseFloat(m.value)||0, note:m.note,
        status: getStatus(parseFloat(m.value)||0, m.warnAt, m.errAt),
      })),
      findings:form.findings,
      springs:form.springs.filter(s=>s.value),
      coachNote:form.coachNote,
      phase1:form.phase1.split("\n").filter(Boolean),
      phase2:form.phase2.split("\n").filter(Boolean),
      homework:form.homework, freq:form.freq, goal:form.goal,
    };
    onSave(report);
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.45)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:500,
               backdropFilter:"blur(5px)",fontFamily:"'Noto Sans TC',sans-serif",padding:"16px 0" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:"#FAF8F5",borderRadius:20,width:520,maxWidth:"95vw",
                 maxHeight:"92vh",display:"flex",flexDirection:"column",
                 border:"1px solid #EAE4DC",boxShadow:"0 12px 50px rgba(58,53,48,.2)" }}>

        {/* Header */}
        <div style={{ padding:"16px 22px 12px",borderBottom:"1px solid #EAE4DC",background:"#fff",borderRadius:"20px 20px 0 0",flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
            <div>
              <div style={{ fontSize:14,fontWeight:600,color:"#3A3530" }}>新增體態評估報告</div>
              <div style={{ fontSize:11,color:"#A89E94",marginTop:2 }}>{member.name} · {member.phone}</div>
            </div>
            <button onClick={onClose} style={{ background:"none",border:"1px solid #D6CCC0",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#A89E94",cursor:"pointer" }}>✕</button>
          </div>
          {/* 步驟條 */}
          <div style={{ display:"flex",alignItems:"center" }}>
            {STEPS.map((s,i)=>(
              <div key={s} style={{ display:"flex",alignItems:"center",flex:1 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <div onClick={()=>setStep(i)}
                    style={{ width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                             fontSize:10,fontWeight:600,cursor:"pointer",
                             background:step===i?"#C4957A":step>i?"#4CAF50":"#EAE4DC",
                             color:step>=i?"#fff":"#A89E94" }}>
                    {step>i?"✓":i+1}
                  </div>
                  <span style={{ fontSize:11,color:step===i?"#3A3530":"#A89E94",fontWeight:step===i?500:400,whiteSpace:"nowrap" }}>{s}</span>
                </div>
                {i<STEPS.length-1 && <div style={{ flex:1,height:1,background:step>i?"#4CAF50":"#EAE4DC",margin:"0 6px" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1,overflowY:"auto",padding:"16px 22px" }}>

          {/* Step 0: 基本資料 */}
          {step===0 && (
            <div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
                <div><span style={lbl}>指導教練</span>
                  <select value={form.coach} onChange={e=>f("coach",e.target.value)} style={sel}>
                    <option>Sammi</option><option>Annie</option><option>Kelly</option>
                  </select>
                </div>
                <div><span style={lbl}>課程進度</span>
                  <input value={form.progress} onChange={e=>f("progress",e.target.value)} placeholder="例：器械私教 3/10" style={inp} />
                </div>
              </div>
              <div style={{ marginBottom:10 }}><span style={lbl}>評估目的</span>
                <textarea value={form.purpose} onChange={e=>f("purpose",e.target.value)} rows={3}
                  placeholder="本次評估重點說明…"
                  style={{ ...inp,resize:"vertical",lineHeight:1.6 }} />
              </div>
              <div style={{ background:"#EAF2EF",borderRadius:9,padding:"9px 12px",fontSize:11,color:"#5C7D6F",lineHeight:1.7 }}>
                💡 量化數值可由 AI 視覺體態系統自動同步，或教練手動輸入。
              </div>
            </div>
          )}

          {/* Step 1: 量化分析 */}
          {step===1 && (
            <div>
              <div style={{ fontSize:11,color:"#A89E94",marginBottom:10 }}>輸入 AI 視覺系統量測數值（未測欄位可留空）</div>
              {form.metrics.map((m,i)=>{
                const val = parseFloat(m.value)||0;
                const st = m.value!=="" ? getStatus(val, m.warnAt, m.errAt) : null;
                const stStyle = st ? STATUS_STYLE[st] : null;
                return (
                  <div key={i} style={{ padding:"10px 0",borderBottom:"1px solid #EAE4DC" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12,fontWeight:500,color:"#3A3530" }}>{m.name}</div>
                        <div style={{ fontSize:10,color:"#A89E94" }}>理想 {m.ideal}</div>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                        <input type="number" step="0.1" value={m.value}
                          onChange={e=>fM(i,"value",e.target.value)}
                          placeholder="—" style={{ ...inp,width:70,textAlign:"center" }} />
                        <span style={{ fontSize:12,color:"#A89E94" }}>°</span>
                        {stStyle && <span style={{ fontSize:10,padding:"2px 7px",borderRadius:8,background:stStyle.bg,color:stStyle.color,whiteSpace:"nowrap" }}>{stStyle.label}</span>}
                      </div>
                    </div>
                    <input value={m.note} onChange={e=>fM(i,"note",e.target.value)}
                      placeholder="AI 標籤與風險提示（選填）"
                      style={{ ...inp,fontSize:11 }} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 2: 功能篩查 */}
          {step===2 && (
            <div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11,color:"#A89E94",marginBottom:8 }}>動態功能篩查（有發現請勾選）</div>
                {[
                  ["breath",  "呼吸模式異常",  "胸式呼吸為主，橫膈膜活化不足"],
                  ["core",    "核心穩定度不足", "雙腿伸展時下背無法維持墊面接觸"],
                  ["winging", "翼狀肩胛",       "肩胛骨有翼狀跡象"],
                  ["rib",     "肋骨外翻",       "吸氣時肋骨容易外翻"],
                ].map(([key,label,sub])=>(
                  <label key={key} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"9px 0",borderBottom:"1px solid #EAE4DC",cursor:"pointer" }}>
                    <div onClick={()=>fFind(key)}
                      style={{ width:16,height:16,borderRadius:3,border:`1.5px solid ${form.findings[key]?"#C4957A":"#D6CCC0"}`,
                               background:form.findings[key]?"#F5ECE6":"transparent",
                               display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
                      {form.findings[key] && <span style={{ color:"#A87A62",fontSize:10,lineHeight:1 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize:12,color:"#3A3530" }}>{label}</div>
                      <div style={{ fontSize:10,color:"#A89E94",marginTop:1 }}>{sub}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:11,color:"#A89E94",marginBottom:8 }}>Reformer 彈簧設定基準</div>
                {form.springs.map((sp,i)=>(
                  <div key={i} style={{ display:"grid",gridTemplateColumns:"110px 1fr",gap:8,marginBottom:6,alignItems:"center" }}>
                    <span style={{ fontSize:12,color:"#6E6358" }}>{sp.name}</span>
                    <input value={sp.value}
                      onChange={e=>setForm(p=>({...p,springs:p.springs.map((s,si)=>si===i?{...s,value:e.target.value}:s)}))}
                      placeholder="例：2紅1藍" style={inp} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: 教練筆記 */}
          {step===3 && (
            <div>
              <div style={{ marginBottom:10 }}><span style={lbl}>教練評估筆記</span>
                <textarea value={form.coachNote} onChange={e=>f("coachNote",e.target.value)} rows={4}
                  placeholder="記錄今日觀察、學員主訴、課程重點…" style={{ ...inp,resize:"vertical",lineHeight:1.6 }} />
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
                <div><span style={lbl}>階段一重點（每行一項）</span>
                  <textarea value={form.phase1} onChange={e=>f("phase1",e.target.value)} rows={4}
                    placeholder="橫膈膜呼吸優化&#10;骨盆中立位建立…" style={{ ...inp,resize:"vertical",lineHeight:1.6 }} />
                </div>
                <div><span style={lbl}>階段二重點（每行一項）</span>
                  <textarea value={form.phase2} onChange={e=>f("phase2",e.target.value)} rows={4}
                    placeholder="不對稱阻力訓練&#10;三維空間穩定…" style={{ ...inp,resize:"vertical",lineHeight:1.6 }} />
                </div>
              </div>
              <div style={{ marginBottom:10 }}><span style={lbl}>居家伸展建議</span>
                <input value={form.homework} onChange={e=>f("homework",e.target.value)}
                  placeholder="例：每日 3 組貓牛式…" style={inp} />
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
                <div><span style={lbl}>建議排課頻率</span>
                  <select value={form.freq} onChange={e=>f("freq",e.target.value)} style={sel}>
                    <option>每週 2 次</option><option>每週 1 次</option><option>每週 3 次</option>
                  </select>
                </div>
                <div><span style={lbl}>複檢目標</span>
                  <input value={form.goal} onChange={e=>f("goal",e.target.value)}
                    placeholder="預期改善目標…" style={inp} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display:"flex",gap:10,padding:"12px 22px",borderTop:"1px solid #EAE4DC",background:"#fff",borderRadius:"0 0 20px 20px",flexShrink:0 }}>
          <button onClick={()=>step===0?onClose():setStep(s=>s-1)}
            style={{ flex:1,padding:"11px",borderRadius:12,border:"1px solid #D6CCC0",background:"none",color:"#7A6E68",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
            {step===0?"取消":"上一步"}
          </button>
          {step < 3
            ? <button onClick={()=>setStep(s=>s+1)}
                style={{ flex:2,padding:"11px",borderRadius:12,border:"none",background:"#C4957A",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                下一步
              </button>
            : <button onClick={handleSave}
                style={{ flex:2,padding:"11px",borderRadius:12,border:"none",background:"#4CAF50",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                生成並發布報告
              </button>
          }
        </div>
      </div>
    </div>
  );
}

// ── 購買方案 Modal ────────────────────────────────────────────
const PAYMENT_METHODS = [
  { value:"atm",   label:"ATM 虛擬帳號", icon:"🏦", desc:"系統自動產生帳號，完成轉帳後人工確認" },
  { value:"qr",    label:"QRCode 掃碼",  icon:"📱", desc:"掃碼轉帳，系統自動對帳" },
  { value:"cash",  label:"現場付款",     icon:"💵", desc:"到場後現金或當面轉帳" },
];
const TYPE_LABELS = { exp:"初次體驗", count:"次數方案", period:"期間方案", points:"點數方案" };

function BuyPlanModal({ member, onClose, onConfirm }) {
  const [step, setStep] = useState(1);          // 1=選方案 2=付款 3=完成
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payMethod, setPayMethod] = useState("atm");
  const [note, setNote] = useState("");
  const [filterType, setFilterType] = useState("all");

  const visiblePlans = allPlans.filter(p => p.visible && (filterType === "all" || p.type === filterType));
  const typeKeys = ["all", ...new Set(allPlans.filter(p=>p.visible).map(p=>p.type))];

  const handleConfirm = () => {
    if (!selectedPlan) return;
    const newPass = {
      name:   selectedPlan.name,
      remain: selectedPlan.type === "count" ? parseInt(selectedPlan.sub) : 1,
      total:  selectedPlan.type === "count" ? parseInt(selectedPlan.sub) : 1,
      expiry: selectedPlan.sub.includes("天") ? `購後 ${selectedPlan.sub.match(/\d+/)?.[0]} 天` : "無期限",
      status: "active",
    };
    onConfirm(newPass);
  };

  const mInp = { border:`1px solid #D6CCC0`, borderRadius:9, padding:"9px 11px", fontSize:13, color:"#3A3530", fontFamily:"inherit", outline:"none", background:"#fff", boxSizing:"border-box", width:"100%" };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(58,53,48,.45)",display:"flex",
               alignItems:"center",justifyContent:"center",zIndex:500,
               backdropFilter:"blur(5px)",fontFamily:"'Noto Sans TC',sans-serif",padding:"16px 0" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:"#FAF8F5",borderRadius:20,width:540,maxWidth:"95vw",
                 maxHeight:"92vh",display:"flex",flexDirection:"column",
                 border:"1px solid #EAE4DC",boxShadow:"0 12px 50px rgba(58,53,48,.2)" }}>

        {/* ── Header ── */}
        <div style={{ padding:"18px 22px 14px",borderBottom:"1px solid #EAE4DC",
                      display:"flex",alignItems:"center",justifyContent:"space-between",
                      background:"#fff",borderRadius:"20px 20px 0 0",flexShrink:0 }}>
          <div>
            <div style={{ fontSize:15,fontWeight:600,color:"#3A3530" }}>為學員購買方案</div>
            <div style={{ fontSize:11,color:"#A89E94",marginTop:2 }}>{member.name}・{member.phone}</div>
          </div>
          <button onClick={onClose}
            style={{ background:"none",border:"1px solid #D6CCC0",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#A89E94",cursor:"pointer" }}>✕</button>
        </div>

        {/* ── 步驟指示器 ── */}
        <div style={{ display:"flex",alignItems:"center",padding:"14px 22px",background:"#fff",borderBottom:"1px solid #EAE4DC",flexShrink:0 }}>
          {[{n:1,label:"選擇方案"},{n:2,label:"付款方式"},{n:3,label:"確認完成"}].map((s,i)=>(
            <div key={s.n} style={{ display:"flex",alignItems:"center",flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                <div style={{ width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,
                              background:step>=s.n?"#4CAF50":"#EAE4DC",color:step>=s.n?"#fff":"#A89E94" }}>
                  {step>s.n?"✓":s.n}
                </div>
                <span style={{ fontSize:11,color:step===s.n?"#3A3530":step>s.n?"#4CAF50":"#A89E94",fontWeight:step===s.n?500:400 }}>{s.label}</span>
              </div>
              {i<2 && <div style={{ flex:1,height:1,background:step>s.n?"#4CAF50":"#EAE4DC",margin:"0 8px" }} />}
            </div>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ flex:1,overflowY:"auto",padding:"18px 22px" }}>

          {/* Step 1: 選方案 */}
          {step===1 && (
            <div>
              {/* 分類 tabs */}
              <div style={{ display:"flex",gap:6,marginBottom:16,flexWrap:"wrap" }}>
                {typeKeys.map(t=>(
                  <button key={t} onClick={()=>setFilterType(t)}
                    style={{ padding:"5px 13px",borderRadius:20,fontSize:11,border:`1px solid ${filterType===t?"#4CAF50":"#D6CCC0"}`,
                             background:filterType===t?"#4CAF50":"#fff",color:filterType===t?"#fff":"#6E6358",cursor:"pointer",fontFamily:"inherit" }}>
                    {t==="all"?"全部方案":TYPE_LABELS[t]||t}
                  </button>
                ))}
              </div>

              {/* 方案卡片 */}
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {visiblePlans.map(p=>(
                  <div key={p.id} onClick={()=>setSelectedPlan(p)}
                    style={{ border:`1.5px solid ${selectedPlan?.id===p.id?"#4CAF50":"#EAE4DC"}`,
                             borderRadius:12,padding:"14px 16px",cursor:"pointer",background:"#fff",
                             transition:"border-color .15s, box-shadow .15s",
                             boxShadow:selectedPlan?.id===p.id?"0 0 0 3px #4CAF5022":"none" }}>
                    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                          <span style={{ fontSize:10,padding:"2px 7px",borderRadius:10,background:"#E8F5E9",color:"#388E3C",fontWeight:500 }}>
                            {TYPE_LABELS[p.type]||p.type}
                          </span>
                          {p.orig && <span style={{ fontSize:10,color:"#A89E94",textDecoration:"line-through" }}>${p.orig.toLocaleString()}</span>}
                        </div>
                        <div style={{ fontSize:14,fontWeight:500,color:"#3A3530",marginBottom:3 }}>{p.name}</div>
                        <div style={{ fontSize:12,color:"#A89E94" }}>{p.sub}</div>
                      </div>
                      <div style={{ textAlign:"right",flexShrink:0 }}>
                        <div style={{ fontSize:20,fontWeight:600,color:"#4CAF50" }}>${p.price.toLocaleString()}</div>
                        <div style={{ width:20,height:20,borderRadius:"50%",border:`2px solid ${selectedPlan?.id===p.id?"#4CAF50":"#D6CCC0"}`,
                                      background:selectedPlan?.id===p.id?"#4CAF50":"transparent",
                                      display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"auto",marginTop:6 }}>
                          {selectedPlan?.id===p.id && <span style={{ color:"#fff",fontSize:10,lineHeight:1 }}>✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 付款方式 */}
          {step===2 && (
            <div>
              {/* 已選方案摘要 */}
              <div style={{ background:"#E8F5E9",border:"1px solid #C8E6C9",borderRadius:10,padding:"12px 14px",marginBottom:20 }}>
                <div style={{ fontSize:11,color:"#388E3C",marginBottom:3 }}>已選方案</div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:14,fontWeight:500,color:"#2E7D32" }}>{selectedPlan?.name}</div>
                    <div style={{ fontSize:11,color:"#4CAF50",marginTop:2 }}>{selectedPlan?.sub}</div>
                  </div>
                  <div style={{ fontSize:20,fontWeight:700,color:"#2E7D32" }}>${selectedPlan?.price.toLocaleString()}</div>
                </div>
              </div>

              {/* 收款方式 */}
              <div style={{ fontSize:12,fontWeight:500,color:"#3A3530",marginBottom:10 }}>選擇收款方式</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:18 }}>
                {PAYMENT_METHODS.map(m=>(
                  <div key={m.value} onClick={()=>setPayMethod(m.value)}
                    style={{ border:`1.5px solid ${payMethod===m.value?"#4CAF50":"#EAE4DC"}`,
                             borderRadius:10,padding:"12px 14px",cursor:"pointer",background:"#fff",
                             display:"flex",alignItems:"center",gap:12,
                             boxShadow:payMethod===m.value?"0 0 0 3px #4CAF5022":"none" }}>
                    <span style={{ fontSize:20 }}>{m.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:500,color:"#3A3530" }}>{m.label}</div>
                      <div style={{ fontSize:11,color:"#A89E94",marginTop:2 }}>{m.desc}</div>
                    </div>
                    <div style={{ width:18,height:18,borderRadius:"50%",border:`2px solid ${payMethod===m.value?"#4CAF50":"#D6CCC0"}`,
                                  background:payMethod===m.value?"#4CAF50":"transparent",
                                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      {payMethod===m.value && <span style={{ color:"#fff",fontSize:9,lineHeight:1 }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* ATM 提示 */}
              {payMethod==="atm" && (
                <div style={{ background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:9,padding:"11px 13px",fontSize:12,color:"#8D6E00",lineHeight:1.7,marginBottom:14 }}>
                  ⚠ 確認後系統將產生虛擬帳號，請在 <strong>3 天內</strong>完成轉帳，逾期自動失效。
                </div>
              )}

              {/* 備註 */}
              <div style={{ fontSize:12,fontWeight:500,color:"#3A3530",marginBottom:6 }}>備註（選填）</div>
              <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3}
                placeholder="例：學員已現場付款、折扣說明…"
                style={{ ...mInp, resize:"vertical", lineHeight:1.6 }} />
            </div>
          )}

          {/* Step 3: 確認完成 */}
          {step===3 && (
            <div style={{ textAlign:"center",padding:"10px 0 20px" }}>
              <div style={{ width:64,height:64,borderRadius:"50%",background:"#E8F5E9",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:28 }}>✅</div>
              <div style={{ fontSize:17,fontWeight:600,color:"#3A3530",marginBottom:6 }}>購買完成！</div>
              <div style={{ fontSize:13,color:"#7A6E68",marginBottom:20,lineHeight:1.7 }}>
                已為 <strong>{member.name}</strong> 新增<br/>
                <span style={{ color:"#4CAF50",fontWeight:500 }}>{selectedPlan?.name}</span>
              </div>

              {/* 訂單摘要 */}
              <div style={{ border:"1px solid #EAE4DC",borderRadius:12,padding:"14px",textAlign:"left",background:"#fff",marginBottom:14 }}>
                {[
                  ["方案",   selectedPlan?.name],
                  ["金額",   `$${selectedPlan?.price.toLocaleString()}`],
                  ["收款方式", PAYMENT_METHODS.find(m=>m.value===payMethod)?.label],
                  ["建立時間", new Date().toLocaleString("zh-TW",{hour12:false})],
                  ...(note ? [["備註", note]] : []),
                ].map(([l,v])=>(
                  <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F0EBE3",fontSize:12 }}>
                    <span style={{ color:"#A89E94" }}>{l}</span>
                    <span style={{ color:"#3A3530",fontWeight:l==="金額"?600:400 }}>{v}</span>
                  </div>
                ))}
              </div>

              {payMethod==="atm" && (
                <div style={{ background:"#E8F5E9",border:"1px solid #C8E6C9",borderRadius:9,padding:"11px 13px",fontSize:12,color:"#388E3C",lineHeight:1.7 }}>
                  📋 虛擬帳號已產生，請提醒學員在 3 天內完成轉帳。
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer buttons ── */}
        <div style={{ display:"flex",gap:10,padding:"14px 22px",borderTop:"1px solid #EAE4DC",
                      background:"#fff",borderRadius:"0 0 20px 20px",flexShrink:0 }}>
          {step===3 ? (
            <button onClick={handleConfirm}
              style={{ flex:1,padding:"12px",borderRadius:12,border:"none",background:"#4CAF50",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
              完成
            </button>
          ) : (
            <>
              <button onClick={()=>step===1?onClose():setStep(s=>s-1)}
                style={{ flex:1,padding:"12px",borderRadius:12,border:"1px solid #D6CCC0",background:"none",color:"#7A6E68",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
                {step===1?"取消":"上一步"}
              </button>
              <button
                disabled={step===1&&!selectedPlan}
                onClick={()=>setStep(s=>s+1)}
                style={{ flex:2,padding:"12px",borderRadius:12,border:"none",
                         background:step===1&&!selectedPlan?"#ccc":"#4CAF50",
                         color:"#fff",fontSize:13,fontWeight:600,
                         cursor:step===1&&!selectedPlan?"not-allowed":"pointer",fontFamily:"inherit" }}>
                {step===1?"下一步：付款方式":"確認購買"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 學員詳情 Panel ───────────────────────────────────────────
function MemberDetail({ selected, onEdit, onDelete, isMobile, onBack, onUpdate }) {
  const [tab, setTab] = useState("home");
  const [note, setNote] = useState(selected.note || "");
  const [noteSaved, setNoteSaved] = useState(false);
  const [buyModal, setBuyModal] = useState(false);
  const [postureModal, setPostureModal] = useState(false);
  const [postureView,  setPostureView]  = useState(null);

  const TABS = [
    { id:"home",    label:"主頁"     },
    { id:"history", label:"課程紀錄" },
    { id:"carduse", label:"課卡使用紀錄" },
    { id:"purchase",label:"購買紀錄" },
    { id:"posture", label:"體態報告" },
    { id:"health",  label:"健康評估" },
    { id:"family",  label:"家庭成員" },
    { id:"info",    label:"基本資料" },
  ];

  const history  = MOCK_HISTORY[selected.id]   || [];
  const purchases= MOCK_PURCHASES[selected.id]  || [];
  const cardUses = MOCK_CARD_USAGE[selected.id] || [];

  const statusBadge = {
    attended:  { bg:"#E8F5E9", color:"#388E3C", label:"已出席" },
    cancelled: { bg:"#FFF3E0", color:"#E65100", label:"已取消" },
    absent:    { bg:"#FDECEA", color:"#C4726A", label:"未出席" },
  };

  const birthDisplay = (m) => m.birthYear ? `${m.birthYear}/${m.birthMonth}/${m.birthDay}` : "—";

  const saveNote = () => {
    onUpdate({ ...selected, note });
    setNoteSaved(true);
    setTimeout(()=>setNoteSaved(false), 2000);
  };

  const totalSpent  = purchases.reduce((s,p)=>s+p.amount, 0);
  const totalHours  = history.filter(h=>h.status==="attended").length;
  const cancelCount = history.filter(h=>h.status==="cancelled").length;
  const monthSessions = history.filter(h=>h.status==="attended" && h.date.startsWith("2026/06")).length;

  return (
    <div className={s.detail}>
      {/* ── Header ── */}
      <div style={{ padding:"18px 20px 0", borderBottom:`1px solid ${T.bd}`, background:T.sf }}>
        {isMobile && (
          <button onClick={onBack} style={{ background:"none",border:"none",fontSize:12,color:T.i3,cursor:"pointer",marginBottom:10,padding:0,fontFamily:"inherit" }}>← 返回</button>
        )}

        {/* 頭像 + 基本資訊 + 購買方案 */}
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14,gap:12 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            {/* 頭像（可上傳） */}
            <label style={{ cursor:"pointer",flexShrink:0 }}>
              <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{
                const file=e.target.files[0]; if(!file) return;
                const r=new FileReader(); r.onload=ev=>onUpdate({...selected,photo:ev.target.result}); r.readAsDataURL(file);
              }} />
              <div style={{ width:60,height:60,borderRadius:"50%",overflow:"hidden",background:selected.bg,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            color:selected.color,fontSize:22,border:`2px solid ${T.bd2}`,position:"relative" }}>
                {selected.photo
                  ? <img src={selected.photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                  : selected.initial}
              </div>
            </label>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                <span style={{ fontSize:18,fontWeight:500,color:T.ink }}>{selected.name}</span>
                {selected.nickname && <span style={{ fontSize:12,color:T.i3 }}>({selected.nickname})</span>}
              </div>
              <div style={{ fontSize:11,color:T.i3,marginBottom:3,display:"flex",alignItems:"center",gap:5 }}>
                🕐 加入時間：{selected.joined}
              </div>
              <div style={{ display:"flex",gap:14,fontSize:12,color:T.i2,flexWrap:"wrap",gap:10 }}>
                {selected.phone && <span>📞 {selected.phone}</span>}
                {selected.email && <span>✉ {selected.email}</span>}
              </div>
            </div>
          </div>
          <div style={{ display:"flex",gap:6,flexShrink:0,flexDirection:"column",alignItems:"flex-end" }}>
            <button onClick={()=>setBuyModal(true)} style={{ padding:"8px 16px",borderRadius:20,border:"none",background:T.green,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>
              ＋ 購買方案
            </button>
            <div style={{ display:"flex",gap:6 }}>
              <Btn onClick={onEdit}>編輯</Btn>
              <button onClick={onDelete} style={{ padding:"5px 10px",borderRadius:20,border:`1px solid ${T.red}30`,background:T.reds,color:T.red,fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>刪除</button>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex",gap:0,overflowX:"auto",scrollbarWidth:"none" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{ padding:"8px 14px",fontSize:12,border:"none",background:"none",cursor:"pointer",
                       fontFamily:"inherit",whiteSpace:"nowrap",color:tab===t.id?T.green:T.i3,
                       borderBottom:`2px solid ${tab===t.id?T.green:"transparent"}`,
                       fontWeight:tab===t.id?600:400,transition:"all .15s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ flex:1,overflowY:"auto",padding:"18px 20px" }}>

        {/* 主頁 */}
        {tab==="home" && (
          <div>
            {/* 統計數字 */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,border:`1px solid ${T.bd}`,borderRadius:10,overflow:"hidden",marginBottom:18 }}>
              {[
                { l:"總消費金額",      v: `${totalSpent.toLocaleString()}`, green:true },
                { l:"累積上課時數",    v: totalHours, green:true },
                { l:"取消預約次數",    v: cancelCount, green:true },
                { l:"平均上課頻率(月)",v: monthSessions, green:true },
              ].map((x,i)=>(
                <div key={x.l} style={{ padding:"14px 10px",textAlign:"center",background:T.sf,borderRight:i<3?`1px solid ${T.bd}`:"none" }}>
                  <div style={{ fontSize:10,color:T.i3,marginBottom:8,lineHeight:1.4 }}>{x.l}</div>
                  <div style={{ fontSize:24,fontWeight:400,color:T.green }}>{x.v}</div>
                </div>
              ))}
            </div>

            {/* 使用中方案 */}
            <div style={{ border:`1px solid ${T.bd}`,borderRadius:10,overflow:"hidden",marginBottom:18 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 80px 80px",background:"#F5F4F2",padding:"10px 14px",fontSize:11,fontWeight:500,color:T.i3 }}>
                <span>使用中方案</span><span style={{ textAlign:"center" }}>預約中</span><span style={{ textAlign:"center" }}>剩餘</span>
              </div>
              {selected.passes.length===0 ? (
                <div style={{ padding:"24px",textAlign:"center",fontSize:13,color:T.i3 }}>尚未有使用中方案</div>
              ) : selected.passes.map((p,i)=>(
                <div key={i} style={{ display:"grid",gridTemplateColumns:"1fr 80px 80px",padding:"12px 14px",borderTop:`1px solid ${T.bd}`,alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:13,color:T.ink,marginBottom:2 }}>{p.name}</div>
                    <div style={{ fontSize:11,color:T.i3 }}>到期：{p.expiry}</div>
                    <div style={{ marginTop:6,background:T.bd,borderRadius:4,height:4,overflow:"hidden" }}>
                      <div style={{ height:4,background:p.status==="active"?T.green:"#E65100",borderRadius:4,width:`${(p.remain/p.total)*100}%` }} />
                    </div>
                  </div>
                  <div style={{ textAlign:"center",fontSize:13,color:T.i2 }}>0</div>
                  <div style={{ textAlign:"center",fontSize:13,fontWeight:500,color:T.ink }}>{p.remain}</div>
                </div>
              ))}
            </div>

            {/* 備註 */}
            <div style={{ border:`1px solid ${T.bd}`,borderRadius:10,overflow:"hidden" }}>
              <div style={{ background:"#F5F4F2",padding:"10px 14px",fontSize:11,fontWeight:500,color:T.i3 }}>
                備註 (僅後台人員查看)
              </div>
              <div style={{ padding:14 }}>
                <textarea value={note} onChange={e=>setNote(e.target.value)} rows={4}
                  style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"10px 12px",fontSize:13,color:T.ink,fontFamily:"inherit",resize:"vertical",lineHeight:1.6,outline:"none",boxSizing:"border-box" }}
                  placeholder="輸入備忘，僅管理員可見…" />
              </div>
            </div>

            {/* footer buttons */}
            <div style={{ display:"flex",gap:10,marginTop:14,paddingTop:14,borderTop:`1px solid ${T.bd}` }}>
              <button style={{ flex:1,padding:"11px",borderRadius:12,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>取消</button>
              <button onClick={saveNote} style={{ flex:2,padding:"11px",borderRadius:12,border:"none",background:T.green,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                {noteSaved?"✓ 已儲存":"確認儲存"}
              </button>
            </div>
          </div>
        )}

        {/* 課程紀錄 */}
        {tab==="history" && (
          <div>
            <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:14 }}>課程出席紀錄</div>
            {history.length===0 ? (
              <div style={{ textAlign:"center",color:T.i3,fontSize:13,padding:"30px 0" }}>尚無課程紀錄</div>
            ) : history.map((h,i)=>(
              <div key={h.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.bd}` }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:2 }}>{h.course}</div>
                  <div style={{ fontSize:11,color:T.i3 }}>{h.date}　{h.time}　{h.coach}　{h.room}</div>
                </div>
                <span style={{ fontSize:11,padding:"3px 10px",borderRadius:20,background:statusBadge[h.status]?.bg,color:statusBadge[h.status]?.color,flexShrink:0 }}>
                  {statusBadge[h.status]?.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 課卡使用紀錄 */}
        {tab==="carduse" && (
          <div>
            <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:14 }}>課卡扣點紀錄</div>
            {cardUses.length===0 ? (
              <div style={{ textAlign:"center",color:T.i3,fontSize:13,padding:"30px 0" }}>尚無使用紀錄</div>
            ) : (
              <div style={{ border:`1px solid ${T.bd}`,borderRadius:10,overflow:"hidden" }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 80px 60px 60px",background:"#F5F4F2",padding:"9px 14px",fontSize:11,fontWeight:500,color:T.i3,gap:8 }}>
                  <span>方案</span><span>課程</span><span>日期</span><span style={{ textAlign:"center" }}>扣點</span><span style={{ textAlign:"center" }}>剩餘</span>
                </div>
                {cardUses.map((u,i)=>(
                  <div key={u.id} style={{ display:"grid",gridTemplateColumns:"1fr 1fr 80px 60px 60px",padding:"11px 14px",borderTop:`1px solid ${T.bd}`,fontSize:12,color:T.ink,gap:8,alignItems:"center",background:i%2===0?T.sf:"#FAFAF8" }}>
                    <span style={{ color:T.i2 }}>{u.plan}</span>
                    <span>{u.course}</span>
                    <span style={{ color:T.i3 }}>{u.date.slice(5)}</span>
                    <span style={{ textAlign:"center",color:T.red }}>-{u.deduct}</span>
                    <span style={{ textAlign:"center",fontWeight:500 }}>{u.remain}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 購買紀錄 */}
        {tab==="purchase" && (
          <div>
            <div style={{ fontSize:13,fontWeight:500,color:T.ink,marginBottom:14 }}>方案購買紀錄</div>
            {purchases.length===0 ? (
              <div style={{ textAlign:"center",color:T.i3,fontSize:13,padding:"30px 0" }}>尚無購買紀錄</div>
            ) : (
              <div style={{ border:`1px solid ${T.bd}`,borderRadius:10,overflow:"hidden" }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 90px 70px 80px 70px",background:"#F5F4F2",padding:"9px 14px",fontSize:11,fontWeight:500,color:T.i3,gap:8 }}>
                  <span>方案名稱</span><span style={{ textAlign:"right" }}>金額</span><span>方式</span><span>購買日期</span><span>狀態</span>
                </div>
                {purchases.map((p,i)=>(
                  <div key={p.id} style={{ display:"grid",gridTemplateColumns:"1fr 90px 70px 80px 70px",padding:"11px 14px",borderTop:`1px solid ${T.bd}`,fontSize:12,color:T.ink,gap:8,alignItems:"center",background:i%2===0?T.sf:"#FAFAF8" }}>
                    <span style={{ fontWeight:500 }}>{p.plan}</span>
                    <span style={{ textAlign:"right",color:T.green,fontWeight:600 }}>${p.amount.toLocaleString()}</span>
                    <span style={{ color:T.i2 }}>{p.method}</span>
                    <span style={{ color:T.i3,fontSize:11 }}>{p.date}</span>
                    <span style={{ fontSize:10,padding:"2px 8px",borderRadius:12,background:"#E8F5E9",color:"#388E3C",whiteSpace:"nowrap" }}>已付款</span>
                  </div>
                ))}
                <div style={{ padding:"10px 14px",borderTop:`1px solid ${T.bd}`,display:"flex",justifyContent:"space-between",background:"#F5F4F2" }}>
                  <span style={{ fontSize:12,color:T.i3 }}>總計</span>
                  <span style={{ fontSize:14,fontWeight:600,color:T.green }}>${purchases.reduce((s,p)=>s+p.amount,0).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 體態報告 */}
        {tab==="posture" && (
          <PostureTab member={selected} onNew={()=>setPostureModal(true)} viewReport={postureView} setViewReport={setPostureView} />
        )}

        {/* 家庭成員 */}
        {tab==="family" && (
          <div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
              <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>家庭成員</div>
              <button style={{ padding:"6px 14px",borderRadius:20,border:`1px solid ${T.bd2}`,background:T.sf,color:T.i2,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>＋ 新增成員</button>
            </div>
            <div style={{ textAlign:"center",color:T.i3,fontSize:13,padding:"30px 0",border:`1px dashed ${T.bd2}`,borderRadius:10 }}>
              尚無家庭成員<br/>
              <span style={{ fontSize:11,marginTop:4,display:"block" }}>新增後可共用課卡方案</span>
            </div>
          </div>
        )}

        {/* 健康評估 */}
        {tab==="health" && (
          <div>
            {selected.healthForm ? (
              <>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                  <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>身體狀況評估表</div>
                  <span style={{ fontSize:10,padding:"2px 9px",borderRadius:10,background:"#E8F5E9",color:"#388E3C" }}>已完成</span>
                </div>
                <div style={{ fontSize:11,color:T.i3,marginBottom:14 }}>填寫時間：2026/06/20</div>
                {[
                  ["心臟疾病或心血管問題",false],["脊椎或椎間盤問題",true],
                  ["關節或骨骼舊傷",false],["近6個月內動過手術",false],
                  ["目前懷孕或產後6個月內",false],["運動中曾暈眩/胸痛/呼吸困難",false],
                  ["其他慢性疾病",false],
                ].map(([l,v])=>(
                  <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.bd}`,fontSize:12 }}>
                    <span style={{ color:T.i3 }}>{l}</span>
                    <span style={{ color:v?"#C4726A":"#4CAF50",fontWeight:500 }}>{v?"是":"否"}</span>
                  </div>
                ))}
                <div style={{ marginTop:10,padding:"10px 12px",background:T.sb,borderRadius:9,fontSize:12,color:T.ink,lineHeight:1.6 }}>
                  補充說明：腰椎第四節輕微滑脫，動作需放慢，避免過度後彎。
                </div>
                <div style={{ marginTop:10,display:"flex",justifyContent:"space-between",fontSize:12 }}>
                  <span style={{ color:T.i3 }}>留意部位</span>
                  <span style={{ color:T.ink }}>下背 / 腰椎</span>
                </div>
              </>
            ) : (
              <div style={{ textAlign:"center",padding:"30px 0" }}>
                <div style={{ fontSize:28,marginBottom:10 }}>📋</div>
                <div style={{ fontSize:13,color:T.i3,marginBottom:4 }}>學員尚未填寫健康評估表</div>
                <div style={{ fontSize:11,color:T.i3 }}>可於偏好設定中開啟「上課前需填寫」</div>
              </div>
            )}
          </div>
        )}

        {/* 基本資料 */}
        {tab==="info" && (
          <div>
            <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:12 }}>
              <Btn onClick={onEdit}>編輯基本資料</Btn>
            </div>
            <div style={{ fontSize:11,color:T.i3,letterSpacing:".06em",marginBottom:4 }}>個人資訊</div>
            <InfoRow label="姓名"   value={selected.name} />
            <InfoRow label="暱稱"   value={selected.nickname||"—"} />
            <InfoRow label="性別"   value={{ female:"女性", male:"男性", other:"其他" }[selected.gender]||"—"} />
            <InfoRow label="手機"   value={`${selected.countryCode?.split(" ")[0]||"+886"} ${selected.phone}`} />
            <InfoRow label="Email"  value={selected.email||"—"} />
            <InfoRow label="出生日期" value={selected.birthYear?`${selected.birthYear}/${selected.birthMonth}/${selected.birthDay}`:"—"} />
            <div style={{ height:1,background:T.bd,margin:"14px 0" }} />
            <div style={{ fontSize:11,color:T.i3,letterSpacing:".06em",marginBottom:4 }}>緊急聯絡人</div>
            <InfoRow label="姓名" value={selected.emergencyName||"—"} />
            <InfoRow label="電話" value={selected.emergencyPhone||"—"} />
          </div>
        )}
      </div>
      {postureModal && <PostureInputModal member={selected} onClose={()=>setPostureModal(false)} onSave={(r)=>{ onUpdate({...selected, postureReports:[...(selected.postureReports||[]),r]}); setPostureModal(false); setPostureView(r.id); }} />}
      {buyModal && <BuyPlanModal member={selected} onClose={()=>setBuyModal(false)} onConfirm={(newPass)=>{ onUpdate({...selected, passes:[...selected.passes, newPass]}); setBuyModal(false); }} />}
    </div>
  );
}

// ── 主頁面 ───────────────────────────────────────────────────
export default function Members() {
  const { isMobile } = useBreakpoint();
  const [members, setMembers] = useState(initMembers);
  const [selected, setSelected] = useState(initMembers[0]);
  const [showDetail, setShowDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [mFilters, setMFilters] = useState({ status:"all", joined:"all" });
  const setMF = (k,v) => setMFilters(p=>({...p,[k]:v}));
  const resetMFilters = () => { setSearch(""); setMFilters({ status:"all", joined:"all" }); };

  const [addModal,    setAddModal]    = useState(false);
  const [editModal,   setEditModal]   = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const nextId = useMemo(()=>Math.max(...members.map(m=>m.id))+1,[members]);

  const filtered = useMemo(() => members.filter(m => {
    if (search && !m.name.includes(search) && !m.phone.includes(search) && !(m.nickname||"").toLowerCase().includes(search.toLowerCase())) return false;
    if (mFilters.status !== "all" && m.status !== mFilters.status) return false;
    if (mFilters.joined !== "all" && !m.joined.startsWith(mFilters.joined)) return false;
    return true;
  }), [members, search, mFilters]);

  const handleAdd = (form) => {
    const palette = AV_PALETTES[nextId % AV_PALETTES.length];
    const newM = {
      ...form, id:nextId, initial:form.name[0]||"新",
      bg:palette.bg, color:palette.color,
      joined: new Date().toLocaleDateString("zh-TW",{year:"numeric",month:"2-digit",day:"2-digit"}),
      totalSessions:0, monthSessions:0, totalSpent:0, status:"none", passes:[],
    };
    setMembers(p=>[...p,newM]);
    setSelected(newM);
    setAddModal(false);
  };

  const handleEdit   = (form) => { const u={...selected,...form}; setMembers(p=>p.map(m=>m.id===selected.id?u:m)); setSelected(u); setEditModal(false); };
  const handleDelete = () => { const rest=members.filter(m=>m.id!==selected.id); setMembers(rest); setSelected(rest[0]||null); setDeleteModal(false); setShowDetail(false); };
  const handleUpdate = (updated) => { setMembers(p=>p.map(m=>m.id===updated.id?updated:m)); setSelected(updated); };

  return (
    <div className={s.page}>
      <Topbar title="學員">
        <Btn>匯出</Btn>
        <Btn variant="primary" onClick={()=>setAddModal(true)}>＋ 新增學員</Btn>
      </Topbar>

      <div className={s.body}>
        <FilterBar
          search={search} onSearch={setSearch} searchPlaceholder="搜尋姓名、手機、暱稱…"
          filters={[
            { key:"status", label:"所有狀態", options:[{value:"active",label:"方案有效"},{value:"expiring",label:"即將到期"},{value:"none",label:"無方案"}] },
            { key:"joined", label:"加入年份", options:[{value:"2026",label:"2026年"},{value:"2025",label:"2025年"},{value:"2024",label:"2024年"}] },
          ]}
          values={mFilters} onChange={setMF} onReset={resetMFilters}
          resultCount={filtered.length}
        />
        <div className={`${s.layout} ${isMobile&&showDetail?s.showDetail:""}`}>
          {/* 左欄清單 */}
          <div className={s.listPanel}>
            {filtered.map(m=>(
              <div key={m.id}
                className={`${s.mRow} ${selected?.id===m.id?s.mRowActive:""}`}
                onClick={()=>{ setSelected(m); if(isMobile) setShowDetail(true); }}>
                <div className={s.mAv} style={{ background:m.bg, color:m.color }}>
                  {m.photo ? <img src={m.photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%" }} /> : m.initial}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div className={s.mName}>{m.name}{m.nickname&&<span style={{ fontSize:11,color:"#A89E94",marginLeft:5 }}>({m.nickname})</span>}</div>
                  <div className={s.mPhone}>{m.phone}</div>
                </div>
                <div className={s.mDot} style={{ background:statusDot[m.status] }} />
              </div>
            ))}
            <div className={s.listFoot}>共 {members.length} 位學員{search&&`・找到 ${filtered.length} 位`}</div>
          </div>

          {/* 右欄詳情 */}
          {selected && (
            <MemberDetail
              selected={selected}
              onEdit={()=>setEditModal(true)}
              onDelete={()=>setDeleteModal(true)}
              isMobile={isMobile}
              onBack={()=>setShowDetail(false)}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>

      {addModal    && <MemberModal onSave={handleAdd}  onClose={()=>setAddModal(false)} />}
      {editModal   && <MemberModal member={selected}   onSave={handleEdit} onClose={()=>setEditModal(false)} />}
      {deleteModal && <DeleteModal member={selected}   onConfirm={handleDelete} onClose={()=>setDeleteModal(false)} />}
    </div>
  );
}
