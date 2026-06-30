import { useState } from "react";

const T = {
  bg:"#F5F5F5", sf:"#FFFFFF",
  ink:"#1A1A1A", i2:"#4A4A4A", i3:"#8A8A8A",
  bd:"#E0E0E0", bd2:"#CACACA",
  green:"#4CAF50", greens:"#E8F5E9", greend:"#388E3C",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  amber:"#FF9800", ambers:"#FFF3E0",
  red:"#E53935", reds:"#FFEBEE",
  blue:"#1976D2", blues:"#E3F2FD",
};

const MEMBERS = [
  { id:1, name:"莊書語", initial:"莊", bg:"#F5ECE6", color:"#A87A62", phone:"0912-345-678", sessions:24, lastEval:"2026/05/22", healthFlagged:true,  healthNote:"腰椎第四節輕微滑脫，動作需放慢" },
  { id:2, name:"陳怡君", initial:"陳", bg:"#EEF2F6", color:"#8A9BAE", phone:"0933-221-447", sessions:10, lastEval:"—",          healthFlagged:false },
  { id:3, name:"林美玲", initial:"林", bg:"#F0EDF5", color:"#9B8FAE", phone:"0966-889-123", sessions:8,  lastEval:"2026/05/18", healthFlagged:true,  healthNote:"腰椎第四節輕微滑脫，避免過度後彎" },
  { id:4, name:"黃思穎", initial:"黃", bg:"#F5EDD8", color:"#B8924A", phone:"0955-667-890", sessions:1,  lastEval:"—",          healthFlagged:false },
];

const FINDING_OPTS = [
  { key:"breath",  label:"呼吸模式異常",  sub:"胸式呼吸為主，橫膈膜活化不足" },
  { key:"core",    label:"核心穩定度不足", sub:"雙腿伸展時下背離開墊面" },
  { key:"winging", label:"翼狀肩胛",       sub:"肩胛骨有翼狀跡象" },
  { key:"rib",     label:"肋骨外翻",       sub:"吸氣時肋骨容易外翻" },
  { key:"pelvis",  label:"骨盆歪斜",       sub:"左右骨盆高低不一" },
  { key:"neck",    label:"頸部緊繃",       sub:"頸椎活動度受限" },
];

const METRICS_OPT = [
  { key:"head",     name:"頭部前引",  unit:"°", ranges:["< 15（正常）","15–20（留意）","> 20（異常）"], warnAt:15, errAt:20 },
  { key:"shoulder", name:"高低肩差",  unit:"°", ranges:["< 1（正常）","1–2.5（留意）","> 2.5（異常）"], warnAt:1, errAt:2.5 },
  { key:"spine",    name:"脊椎側彎",  unit:"°", ranges:["< 5（正常）","5–10（留意）","> 10（異常）"], warnAt:5, errAt:10 },
  { key:"pelvisLR", name:"骨盆傾斜",  unit:"°", ranges:["< 1（正常）","1–2.5（留意）","> 2.5（異常）"], warnAt:1, errAt:2.5 },
  { key:"pelvisAP", name:"骨盆前傾",  unit:"°", ranges:["7–15（正常）","15–18（留意）","> 18（異常）"], warnAt:15, errAt:18 },
];

const METRIC_PRESETS = {
  head:     [12, 16, 18, 20, 23, 25, 28, 30],
  shoulder: [0.5, 1.0, 1.5, 1.8, 2.0, 2.5, 3.0, 3.5],
  spine:    [3, 5, 6, 7, 8, 9, 10, 12],
  pelvisLR: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
  pelvisAP: [10, 13, 15, 16, 17, 18, 19, 20, 22, 25],
};

const SPRING_MOVES = ["Footwork","Arms in Straps","Leg Circles","Short Box","Elephant","Long Stretch","Side Splits"];
const SPRING_VALS  = ["1紅","2紅","1藍","2藍","1紅1藍","2紅1藍","1紅2藍","1黃","無彈簧"];
const FREQ_OPTS    = ["每週 1 次","每週 2 次","每週 3 次","隔週 1 次"];
const COACH_NOTES_QUICK = [
  "首次評估，建立體態基準線",
  "骨盆前傾明顯，長期久坐所致",
  "高低肩可能與慣用手側有關",
  "核心啟動待加強，呼吸模式需改善",
  "體態整體穩定，進入進階訓練",
  "複評，各項指標持續改善中",
];
const PHASE1_QUICK = [
  "橫膈膜呼吸模式優化與肋骨控制",
  "骨盆中立位與脊椎中立線的建立",
  "核心深層、臀大肌與腹直肌的喚醒",
  "頸椎活動度訓練與上斜方肌放鬆",
  "單側不對稱肌力訓練",
  "本體感覺與身體感知訓練",
];
const PHASE2_QUICK = [
  "Reformer 跨軸三維空間動態穩定訓練",
  "引進不對稱阻力，針對單側弱勢肌群強化",
  "功能性動作整合與日常姿勢應用",
  "全側鏈肌群強化訓練",
  "進階平衡與協調性訓練",
];
const HOMEWORK_QUICK = [
  "每日 3 組貓牛式，各 60 秒",
  "每日泡沫軸胸廓放鬆 5 分鐘",
  "每日單腳站立 30 秒 × 3 組",
  "每日仰臥脊椎旋轉 10 次 × 2 組",
  "每日肩頸伸展操，各方向 30 秒",
  "每日臀橋 15 次 × 3 組",
];

function getStatus(val, warnAt, errAt) {
  if (val >= errAt) return "err";
  if (val >= warnAt) return "warn";
  return "ok";
}
const STATUS_STYLE = {
  ok:   { bg:"#E8F5E9", color:"#388E3C", label:"正常" },
  warn: { bg:"#FFF3E0", color:"#E65100", label:"留意" },
  err:  { bg:"#FFEBEE", color:"#C62828", label:"異常" },
};

// ── 共用 UI ──────────────────────────────────────────────────
const PhoneFrame = ({ children }) => (
  <div style={{ width:375,maxWidth:"100%",background:T.sf,borderRadius:44,overflow:"hidden",
    border:"8px solid #1A1A1A",boxShadow:"0 24px 60px rgba(0,0,0,.35)",flexShrink:0 }}>
    <div style={{ background:"#1A1A1A",height:36,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:4 }}>
      <div style={{ width:120,height:24,background:"#1A1A1A",borderRadius:"0 0 18px 18px",position:"absolute",top:8 }} />
      <div style={{ fontSize:10,color:"rgba(255,255,255,.5)" }}>09:41</div>
    </div>
    <div style={{ height:700,overflowY:"auto",background:"#F5F5F5",scrollbarWidth:"none" }}>{children}</div>
    <div style={{ background:"#F5F5F5",height:28,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ width:120,height:4,background:"#1A1A1A",borderRadius:2,opacity:.3 }} />
    </div>
  </div>
);

const AppBar = ({ title, back, action, onAction }) => (
  <div style={{ background:T.sf,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`0.5px solid ${T.bd}`,position:"sticky",top:0,zIndex:10 }}>
    {back
      ? <span style={{ fontSize:13,color:T.green,cursor:"pointer" }}>← {back}</span>
      : <div style={{ width:50 }} />}
    <span style={{ fontSize:15,fontWeight:600,color:T.ink }}>{title}</span>
    {action
      ? <span onClick={onAction} style={{ fontSize:13,color:T.green,cursor:"pointer",fontWeight:500 }}>{action}</span>
      : <div style={{ width:50 }} />}
  </div>
);

// 快速選擇 chips
const Chips = ({ options, value, onChange, multi=false, small=false }) => (
  <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
    {options.map(opt=>{
      const v = typeof opt==="object" ? opt.value : opt;
      const l = typeof opt==="object" ? opt.label : opt;
      const active = multi ? (value||[]).includes(v) : value===v;
      return (
        <button key={v} onClick={()=>{
          if(multi) onChange(active?(value||[]).filter(x=>x!==v):[...(value||[]),v]);
          else onChange(active?null:v);
        }}
          style={{ padding:small?"4px 9px":"6px 12px",borderRadius:20,fontSize:small?10:12,
                   border:`1.5px solid ${active?T.green:T.bd}`,
                   background:active?T.greens:T.sf,color:active?T.greend:T.i2,
                   cursor:"pointer",fontFamily:"inherit",fontWeight:active?500:400 }}>
          {l}
        </button>
      );
    })}
  </div>
);

// ── Step 0: 首頁 ──────────────────────────────────────────────
function StepHome({ onStart }) {
  return (
    <PhoneFrame>
      <AppBar title="體態評估" />
      <div style={{ padding:"16px" }}>
        <div onClick={onStart}
          style={{ background:`linear-gradient(135deg,${T.green},${T.greend})`,borderRadius:16,padding:"20px",marginBottom:16,cursor:"pointer" }}>
          <div style={{ fontSize:22,marginBottom:8 }}>📸</div>
          <div style={{ fontSize:16,fontWeight:600,color:"#fff",marginBottom:3 }}>新增體態評估</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,.8)",marginBottom:12 }}>拍照 · AI 分析 · 生成報告</div>
          <div style={{ background:"rgba(255,255,255,.2)",borderRadius:20,padding:"5px 14px",display:"inline-block",fontSize:12,color:"#fff" }}>開始 →</div>
        </div>
        <div style={{ fontSize:12,fontWeight:600,color:T.ink,marginBottom:10 }}>近期評估</div>
        {[{name:"莊書語",date:"2026/05/22",coach:"自己"},{name:"林美玲",date:"2026/05/18",coach:"自己"}].map((r,i)=>(
          <div key={i} style={{ background:T.sf,borderRadius:12,padding:"12px",marginBottom:8,display:"flex",alignItems:"center",gap:10,border:`1px solid ${T.bd}` }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:"#F5ECE6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#A87A62",fontWeight:600 }}>{r.name[0]}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>{r.name}</div>
              <div style={{ fontSize:11,color:T.i3 }}>{r.date}</div>
            </div>
            <span style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:T.greens,color:T.greend }}>已完成</span>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ── Step 1: 選學員 ─────────────────────────────────────────────
function StepSelectMember({ onSelect }) {
  const [search, setSearch] = useState("");
  const filtered = MEMBERS.filter(m=>m.name.includes(search)||m.phone.includes(search));
  return (
    <PhoneFrame>
      <AppBar title="選擇學員" back="取消" />
      <div style={{ padding:"12px 16px 0" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜尋姓名或電話…"
          style={{ width:"100%",border:`1px solid ${T.bd}`,borderRadius:20,padding:"9px 14px",fontSize:13,color:T.ink,background:T.sf,outline:"none",boxSizing:"border-box" }} />
      </div>
      <div style={{ padding:"10px 16px" }}>
        {filtered.map(m=>(
          <div key={m.id} onClick={()=>onSelect(m)}
            style={{ background:T.sf,borderRadius:14,padding:"13px",marginBottom:8,
              border:`1.5px solid ${m.healthFlagged?"#E53935":T.bd}`,
              display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
            <div style={{ width:44,height:44,borderRadius:"50%",background:m.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:m.color,fontWeight:300,flexShrink:0 }}>{m.initial}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:1 }}>
                <span style={{ fontSize:14,fontWeight:500,color:T.ink }}>{m.name}</span>
                {m.healthFlagged && (
                  <span style={{ fontSize:9,padding:"1px 6px",borderRadius:8,background:"#FDECEA",color:"#C62828",fontWeight:600,flexShrink:0 }}>⚠ 健康留意</span>
                )}
              </div>
              <div style={{ fontSize:11,color:T.i3 }}>{m.phone}</div>
              <div style={{ fontSize:11,color:T.i3 }}>累計 {m.sessions} 堂 · 上次評估：{m.lastEval}</div>
              {m.healthFlagged && (
                <div style={{ fontSize:10,color:"#C62828",marginTop:3,lineHeight:1.4 }}>⚠ {m.healthNote}</div>
              )}
            </div>
            <div style={{ fontSize:18,color:T.bd,flexShrink:0 }}>›</div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ── Step 2: 拍照 ───────────────────────────────────────────────
function StepCamera({ member, onDone }) {
  const VIEWS = [
    { key:"front1",  label:"正面",       sub:"1 / 5",  hint:"面向鏡頭，雙腳與肩同寬，雙手自然垂放",    icon:"👤", rotate:0,    calibration:false },
    { key:"leftSide",label:"左側面",     sub:"2 / 5",  hint:"左側面對鏡頭，目視前方，保持自然站姿",    icon:"🧍", rotate:-90,  calibration:false },
    { key:"back",    label:"背面",       sub:"3 / 5",  hint:"背對鏡頭，雙手自然垂放，後方十字準線對齊", icon:"🔙", rotate:180,  calibration:false },
    { key:"rightSide",label:"右側面",    sub:"4 / 5",  hint:"右側面對鏡頭，目視前方，保持自然站姿",    icon:"🧍", rotate:90,   calibration:false },
    { key:"front2",  label:"正面（校正）",sub:"5 / 5",  hint:"再次面向鏡頭，用於 AI 前後校正比對",     icon:"🎯", rotate:0,    calibration:true  },
  ];

  const [current, setCurrent] = useState(0);   // 目前拍第幾張 (0–4)
  const [shots,   setShots]   = useState({});   // { key: true/false }
  const [retake,  setRetake]  = useState(false);

  const v      = VIEWS[current];
  const isDone = current >= VIEWS.length && VIEWS.every(vw=>shots[vw.key]);

  const handleShot = () => {
    setShots(p=>({...p,[v.key]:true}));
    setRetake(false);
  };
  const handleRetake = () => {
    setShots(p=>({...p,[v.key]:false}));
    setRetake(true);
  };
  const handleNext = () => {
    if(current < VIEWS.length-1) setCurrent(c=>c+1);
    else onDone();
  };

  const shotDone = shots[v?.key];

  return (
    <PhoneFrame>
      <AppBar title="拍照引導" back="上一步" />
      <div style={{ padding:"12px 16px" }}>

        {/* 學員 + 進度 */}
        <div style={{ background:T.sf,borderRadius:10,padding:"9px 12px",marginBottom:member.healthFlagged?8:10,display:"flex",alignItems:"center",gap:9,border:`1px solid ${T.bd}` }}>
          <div style={{ width:30,height:30,borderRadius:"50%",background:member.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:member.color,fontWeight:600 }}>{member.initial}</div>
          <div style={{ flex:1,fontSize:13,color:T.ink,fontWeight:500 }}>{member.name}</div>
          <div style={{ fontSize:11,color:T.green,fontWeight:600 }}>{Math.min(current, VIEWS.length)}/{VIEWS.length}</div>
        </div>

        {member.healthFlagged && (
          <div style={{ background:"#FDECEA",border:"1px solid #F5C6C2",borderRadius:9,padding:"8px 11px",marginBottom:12,fontSize:11,color:"#C62828",lineHeight:1.6,display:"flex",gap:7,alignItems:"flex-start" }}>
            <span style={{ flexShrink:0 }}>⚠</span>
            <span><strong>健康狀況提醒：</strong>{member.healthNote}</span>
          </div>
        )}

        {/* 步驟點 */}
        <div style={{ display:"flex",alignItems:"center",gap:0,marginBottom:12,justifyContent:"center" }}>
          {VIEWS.map((vw,i)=>(
            <div key={vw.key} style={{ display:"flex",alignItems:"center" }}>
              <div style={{ width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:600,flexShrink:0,
                background: shots[vw.key]?"#4CAF50": i===current?"#222":T.bd,
                color: shots[vw.key]?"#fff": i===current?"#fff":T.i3,
                border:`2px solid ${shots[vw.key]?"#4CAF50":i===current?"#222":T.bd2}` }}>
                {shots[vw.key]?"✓":i+1}
              </div>
              {i<VIEWS.length-1 && <div style={{ width:18,height:2,background:shots[vw.key]?"#4CAF50":T.bd,transition:"background .3s" }} />}
            </div>
          ))}
        </div>

        {/* 目前張次標題 */}
        <div style={{ textAlign:"center",marginBottom:10 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:7,marginBottom:3 }}>
            <span style={{ fontSize:18 }}>{v.icon}</span>
            <span style={{ fontSize:16,fontWeight:600,color:T.ink }}>{v.label}</span>
            {v.calibration && (
              <span style={{ fontSize:9,padding:"2px 7px",borderRadius:8,background:"#FFF3E0",color:"#E65100",fontWeight:600 }}>校正用</span>
            )}
          </div>
          <div style={{ fontSize:11,color:T.i3 }}>{v.sub}</div>
        </div>

        {/* 取景框 */}
        <div style={{ height:300,background:shotDone&&!retake?"#111":"#1a1a1a",borderRadius:16,position:"relative",overflow:"hidden",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center" }}>
          {shotDone && !retake ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:48,marginBottom:8 }}>✅</div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,.7)",fontWeight:500 }}>拍照完成</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,.4)",marginTop:4 }}>{v.label} · {v.sub}</div>
            </div>
          ) : (
            <>
              {/* 十字基準線 */}
              <div style={{ position:"absolute",top:"50%",left:0,right:0,height:1,background:"rgba(255,255,255,.12)" }} />
              <div style={{ position:"absolute",left:"50%",top:0,bottom:0,width:1,background:"rgba(255,255,255,.12)" }} />
              {/* 取景框角 */}
              {[["top:16px","left:16px","borderTop","borderLeft"],
                ["top:16px","right:16px","borderTop","borderRight"],
                ["bottom:16px","left:16px","borderBottom","borderLeft"],
                ["bottom:16px","right:16px","borderBottom","borderRight"],
              ].map(([t,lr,bt,blr],ci)=>(
                <div key={ci} style={{ position:"absolute",...Object.fromEntries([[t.split(":")[0],t.split(":")[1]],[lr.split(":")[0],lr.split(":")[1]]]),
                  width:22,height:22,[bt]:"2px solid rgba(76,175,80,.6)",[blr]:"2px solid rgba(76,175,80,.6)" }} />
              ))}
              {/* 人形輪廓 */}
              <div style={{ fontSize:90,opacity:.12,transform:`rotate(${v.rotate}deg)` }}>🧍</div>
              {/* 校正用說明 */}
              {v.calibration && (
                <div style={{ position:"absolute",top:12,left:0,right:0,textAlign:"center" }}>
                  <div style={{ display:"inline-block",background:"rgba(255,152,0,.2)",border:"1px solid rgba(255,152,0,.4)",borderRadius:20,padding:"3px 12px",fontSize:10,color:"#FF9800" }}>
                    ⚠ 此張用於 AI 前後校正，請保持與第 1 張相同姿勢
                  </div>
                </div>
              )}
              {/* AI 提示 */}
              <div style={{ position:"absolute",bottom:10,left:0,right:0,textAlign:"center",fontSize:10,color:"rgba(255,255,255,.3)" }}>
                AI 骨架識別中… 請保持自然站姿
              </div>
            </>
          )}
        </div>

        {/* 拍攝提示 */}
        <div style={{ background:T.sf,borderRadius:10,padding:"9px 12px",marginBottom:12,border:`1px solid ${T.bd}` }}>
          <div style={{ fontSize:11,color:T.i2,lineHeight:1.6 }}>📋 {v.hint}</div>
        </div>

        {/* 操作按鈕 */}
        {!shotDone || retake ? (
          <button onClick={handleShot}
            style={{ width:"100%",padding:"14px",borderRadius:20,border:"none",background:T.green,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            📸 拍攝{v.label}
          </button>
        ) : (
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={handleRetake}
              style={{ flex:1,padding:"12px",borderRadius:20,border:`1px solid ${T.bd2}`,background:T.sf,color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              重拍
            </button>
            <button onClick={handleNext}
              style={{ flex:2,padding:"12px",borderRadius:20,border:"none",
                background: current===VIEWS.length-1?T.green:"#1976D2",
                color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
              {current===VIEWS.length-1?"送出 AI 分析 →":"下一張 →"}
            </button>
          </div>
        )}

        {/* 縮圖列（已拍） */}
        {Object.keys(shots).length>0 && (
          <div style={{ marginTop:12 }}>
            <div style={{ fontSize:10,color:T.i3,marginBottom:6 }}>已完成</div>
            <div style={{ display:"flex",gap:6 }}>
              {VIEWS.filter(vw=>shots[vw.key]).map(vw=>(
                <div key={vw.key} style={{ flex:1,background:"#111",borderRadius:8,height:44,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"1.5px solid #4CAF50" }}>
                  <div style={{ fontSize:14 }}>{vw.icon}</div>
                  <div style={{ fontSize:8,color:"rgba(255,255,255,.5)",marginTop:1 }}>{vw.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}

// ── Step 3: AI 分析 ────────────────────────────────────────────
function StepAnalyzing({ onDone }) {
  const [p, setP] = useState(0);
  useState(()=>{ const t=setInterval(()=>setP(v=>{ if(v>=100){clearInterval(t);return 100;} return v+3; }),80); return()=>clearInterval(t); });
  const phases = ["識別骨架關鍵點…","計算頭部前引…","分析脊椎側彎…","量測骨盆角度…","生成量化報告…"];
  const pi = Math.min(Math.floor(p/20), 4);
  return (
    <PhoneFrame>
      <AppBar title="AI 分析中" />
      <div style={{ padding:"40px 24px",textAlign:"center" }}>
        <div style={{ width:130,height:130,borderRadius:"50%",background:`conic-gradient(${T.green} ${p*3.6}deg,${T.bd} 0)`,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <div style={{ width:102,height:102,borderRadius:"50%",background:T.sf,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
            <div style={{ fontSize:26,marginBottom:2 }}>🔬</div>
            <div style={{ fontSize:17,fontWeight:700,color:T.green }}>{p}%</div>
          </div>
        </div>
        <div style={{ fontSize:15,fontWeight:600,color:T.ink,marginBottom:6 }}>AI 視覺骨態分析</div>
        <div style={{ fontSize:12,color:T.i3,marginBottom:28 }}>自動識別後方十字基準線與骨骼定位點</div>
        <div style={{ background:T.sf,borderRadius:12,padding:"12px",textAlign:"left",marginBottom:20 }}>
          {phases.map((ph,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:9,padding:"5px 0" }}>
              <div style={{ width:16,height:16,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,
                background:i<pi?T.green:i===pi?T.ambers:T.bd,color:i<pi?"#fff":T.i3 }}>
                {i<pi?"✓":i===pi?"…":i+1}
              </div>
              <span style={{ fontSize:11,color:i<=pi?T.ink:T.i3,fontWeight:i===pi?500:400 }}>{ph}</span>
            </div>
          ))}
        </div>
        {p>=100 && <button onClick={onDone} style={{ width:"100%",padding:"14px",borderRadius:20,border:"none",background:T.green,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>查看結果 →</button>}
      </div>
    </PhoneFrame>
  );
}

// ── Step 4: 結果確認（選範圍取代手打）────────────────────────────
function StepResults({ member, onNext }) {
  const initVals = { head:23.5, shoulder:1.8, spine:7.2, pelvisLR:2.1, pelvisAP:19.2 };
  const [vals, setVals] = useState(initVals);
  return (
    <PhoneFrame>
      <AppBar title="AI 分析結果" back="重拍" action="下一步" onAction={()=>onNext(vals)} />
      <div style={{ padding:"12px 16px" }}>
        <div style={{ background:T.sf,borderRadius:12,padding:"10px 12px",marginBottom:12,border:`1px solid ${T.bd}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:8 }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:member.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:member.color,fontWeight:600 }}>{member.initial}</div>
            <div>
              <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>{member.name}</div>
              <div style={{ fontSize:10,color:T.i3 }}>AI 已自動辨識，可直接點選調整</div>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4 }}>
            {[{l:"異常",c:"#C62828",bg:"#FFEBEE",n:METRICS_OPT.filter(m=>getStatus(vals[m.key],m.warnAt,m.errAt)==="err").length},
              {l:"留意",c:"#E65100",bg:"#FFF3E0",n:METRICS_OPT.filter(m=>getStatus(vals[m.key],m.warnAt,m.errAt)==="warn").length},
              {l:"正常",c:"#388E3C",bg:"#E8F5E9",n:METRICS_OPT.filter(m=>getStatus(vals[m.key],m.warnAt,m.errAt)==="ok").length}].map(s=>(
              <div key={s.l} style={{ background:s.bg,borderRadius:7,padding:"6px",textAlign:"center" }}>
                <div style={{ fontSize:17,fontWeight:700,color:s.c }}>{s.n}</div>
                <div style={{ fontSize:9,color:s.c }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {METRICS_OPT.map(m=>{
          const st = STATUS_STYLE[getStatus(vals[m.key],m.warnAt,m.errAt)];
          return (
            <div key={m.key} style={{ background:T.sf,borderRadius:12,padding:"11px 12px",marginBottom:8,border:`1px solid ${T.bd}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>{m.name}</div>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <span style={{ fontSize:17,fontWeight:700,color:st.color }}>{vals[m.key]}°</span>
                  <span style={{ fontSize:10,padding:"2px 7px",borderRadius:8,background:st.bg,color:st.color }}>{st.label}</span>
                </div>
              </div>
              {/* Preset chips 取代手打 */}
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                {METRIC_PRESETS[m.key].map(v=>{
                  const vst = STATUS_STYLE[getStatus(v,m.warnAt,m.errAt)];
                  const active = vals[m.key]===v;
                  return (
                    <button key={v} onClick={()=>setVals(p=>({...p,[m.key]:v}))}
                      style={{ padding:"4px 10px",borderRadius:14,fontSize:11,cursor:"pointer",fontFamily:"inherit",
                               border:`1.5px solid ${active?vst.color:T.bd}`,
                               background:active?vst.bg:T.sf,color:active?vst.color:T.i3,fontWeight:active?600:400 }}>
                      {v}°
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button onClick={()=>onNext(vals)}
          style={{ width:"100%",padding:"14px",borderRadius:20,border:"none",background:T.green,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:4 }}>
          確認結果，填寫筆記 →
        </button>
      </div>
    </PhoneFrame>
  );
}

// ── Step 5: 教練筆記（大量用選的）────────────────────────────────
function StepNotes({ member, metricVals, onDone }) {
  const [findings, setFindings] = useState([]);
  const [springs,  setSprings]  = useState([]);
  const [note,     setNote]     = useState("");
  const [quickNotes, setQuickNotes] = useState([]);
  const [phase1,   setPhase1]   = useState([]);
  const [phase2,   setPhase2]   = useState([]);
  const [homework, setHomework] = useState(null);
  const [freq,     setFreq]     = useState("每週 2 次");

  const toggleFinding = k => setFindings(p=>p.includes(k)?p.filter(x=>x!==k):[...p,k]);
  const toggleSpringMove = m => setSprings(p=>p.find(s=>s.name===m)?p.filter(s=>s.name!==m):[...p,{name:m,value:"2紅"}]);
  const setSpringVal = (name,val) => setSprings(p=>p.map(s=>s.name===name?{...s,value:val}:s));

  const SecLabel = ({children}) => <div style={{ fontSize:11,color:T.i3,letterSpacing:".05em",marginBottom:8,marginTop:4 }}>{children}</div>;

  return (
    <PhoneFrame>
      <AppBar title="教練筆記" back="查看結果" action="生成" onAction={onDone} />
      <div style={{ padding:"12px 16px" }}>

        {/* 功能篩查 — chips 多選 */}
        <div style={{ background:T.sf,borderRadius:14,padding:"12px",marginBottom:10,border:`1px solid ${T.bd}` }}>
          <SecLabel>動態功能篩查（有發現請點選）</SecLabel>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
            {FINDING_OPTS.map(f=>{
              const active = findings.includes(f.key);
              return (
                <button key={f.key} onClick={()=>toggleFinding(f.key)}
                  style={{ padding:"6px 11px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"inherit",
                    border:`1.5px solid ${active?"#E53935":T.bd}`,
                    background:active?"#FFEBEE":T.sf,color:active?"#C62828":T.i2,fontWeight:active?500:400 }}>
                  {active?"✓ ":""}{f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reformer 彈簧 — 先選動作再選彈簧 */}
        <div style={{ background:T.sf,borderRadius:14,padding:"12px",marginBottom:10,border:`1px solid ${T.bd}` }}>
          <SecLabel>Reformer 彈簧設定（選動作）</SecLabel>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:springs.length>0?10:0 }}>
            {SPRING_MOVES.map(m=>{
              const active = springs.find(s=>s.name===m);
              return (
                <button key={m} onClick={()=>toggleSpringMove(m)}
                  style={{ padding:"5px 10px",borderRadius:16,fontSize:11,cursor:"pointer",fontFamily:"inherit",
                    border:`1.5px solid ${active?T.blue:T.bd}`,
                    background:active?T.blues:T.sf,color:active?T.blue:T.i2 }}>
                  {m}
                </button>
              );
            })}
          </div>
          {springs.map(s=>(
            <div key={s.name} style={{ marginTop:7,display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:12,color:T.i2,width:110,flexShrink:0 }}>{s.name}</span>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                {SPRING_VALS.map(v=>(
                  <button key={v} onClick={()=>setSpringVal(s.name,v)}
                    style={{ padding:"4px 9px",borderRadius:12,fontSize:11,cursor:"pointer",fontFamily:"inherit",
                      border:`1.5px solid ${s.value===v?T.blue:T.bd}`,
                      background:s.value===v?T.blues:T.sf,color:s.value===v?T.blue:T.i3 }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 評估觀察 — 快選 + 可補充 */}
        <div style={{ background:T.sf,borderRadius:14,padding:"12px",marginBottom:10,border:`1px solid ${T.bd}` }}>
          <SecLabel>評估觀察（快速勾選，可複選）</SecLabel>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:quickNotes.length>0||note?8:0 }}>
            {COACH_NOTES_QUICK.map(n=>{
              const active = quickNotes.includes(n);
              return (
                <button key={n} onClick={()=>setQuickNotes(p=>active?p.filter(x=>x!==n):[...p,n])}
                  style={{ padding:"5px 11px",borderRadius:16,fontSize:11,cursor:"pointer",fontFamily:"inherit",
                    border:`1.5px solid ${active?T.rose:T.bd}`,
                    background:active?T.rs:T.sf,color:active?T.rm:T.i2 }}>
                  {n}
                </button>
              );
            })}
          </div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={2}
            placeholder="補充說明（選填）…"
            style={{ width:"100%",border:`1px solid ${T.bd}`,borderRadius:9,padding:"8px 10px",fontSize:12,color:T.ink,fontFamily:"inherit",resize:"none",outline:"none",boxSizing:"border-box" }} />
        </div>

        {/* 階段一 — chips 多選 */}
        <div style={{ background:T.sf,borderRadius:14,padding:"12px",marginBottom:10,border:`1px solid ${T.bd}` }}>
          <SecLabel>階段一訓練重點（可複選）</SecLabel>
          <Chips options={PHASE1_QUICK} value={phase1} onChange={setPhase1} multi small />
        </div>

        {/* 階段二 — chips 多選 */}
        <div style={{ background:T.sf,borderRadius:14,padding:"12px",marginBottom:10,border:`1px solid ${T.bd}` }}>
          <SecLabel>階段二訓練重點（可複選）</SecLabel>
          <Chips options={PHASE2_QUICK} value={phase2} onChange={setPhase2} multi small />
        </div>

        {/* 居家建議 — 單選 */}
        <div style={{ background:T.sf,borderRadius:14,padding:"12px",marginBottom:10,border:`1px solid ${T.bd}` }}>
          <SecLabel>居家伸展建議（單選）</SecLabel>
          <Chips options={HOMEWORK_QUICK} value={homework} onChange={setHomework} small />
        </div>

        {/* 排課頻率 — 單選 */}
        <div style={{ background:T.sf,borderRadius:14,padding:"12px",marginBottom:10,border:`1px solid ${T.bd}` }}>
          <SecLabel>建議排課頻率</SecLabel>
          <div style={{ display:"flex",gap:8 }}>
            {FREQ_OPTS.map(f=>(
              <button key={f} onClick={()=>setFreq(f)}
                style={{ flex:1,padding:"8px 4px",borderRadius:16,fontSize:11,cursor:"pointer",fontFamily:"inherit",
                  border:`1.5px solid ${freq===f?T.green:T.bd}`,
                  background:freq===f?T.greens:T.sf,color:freq===f?T.greend:T.i2,fontWeight:freq===f?500:400 }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onDone}
          style={{ width:"100%",padding:"14px",borderRadius:20,border:"none",background:T.green,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:4 }}>
          生成並發布報告 ✅
        </button>
      </div>
    </PhoneFrame>
  );
}

// ── Step 6: 完成 ───────────────────────────────────────────────
function StepDone({ member, onRestart }) {
  return (
    <PhoneFrame>
      <AppBar title="報告已發布" />
      <div style={{ padding:"40px 24px",textAlign:"center" }}>
        <div style={{ width:72,height:72,borderRadius:"50%",background:T.greens,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:32 }}>✅</div>
        <div style={{ fontSize:18,fontWeight:700,color:T.ink,marginBottom:6 }}>報告已發布！</div>
        <div style={{ fontSize:13,color:T.i3,marginBottom:24,lineHeight:1.7 }}>
          <strong style={{ color:T.ink }}>{member.name}</strong> 可在學員 APP<br/>的「體態報告」頁面查閱
        </div>
        <div style={{ background:T.sf,borderRadius:14,padding:"14px",textAlign:"left",marginBottom:20 }}>
          {[["學員",member.name],["評估日期","2026/06/30"],["教練","Sammi"],["建議頻率","每週 2 次"]].map(([l,v])=>(
            <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`0.5px solid ${T.bd}`,fontSize:12 }}>
              <span style={{ color:T.i3 }}>{l}</span>
              <span style={{ color:T.ink,fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <button style={{ flex:1,padding:"12px",borderRadius:20,border:`1px solid ${T.bd}`,background:T.sf,color:T.i2,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>查看報告</button>
          <button onClick={onRestart} style={{ flex:1,padding:"12px",borderRadius:20,border:"none",background:T.green,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>新增評估</button>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ── 主頁面 ─────────────────────────────────────────────────────
const STEPS = ["首頁","選學員","拍照","AI分析","確認結果","教練筆記","完成"];

export default function PostureAppFlow() {
  const [step, setStep]   = useState(0);
  const [member, setMember] = useState(null);
  const [metricVals, setMetricVals] = useState(null);
  const next = () => setStep(s=>s+1);
  const reset = () => { setStep(0); setMember(null); setMetricVals(null); };

  return (
    <div style={{ minHeight:"100vh",background:"linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%)",fontFamily:"'Noto Sans TC',sans-serif",paddingTop:38 }}>
      <div style={{ maxWidth:1000,margin:"0 auto",padding:"28px 24px" }}>
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.06)",borderRadius:20,padding:"5px 14px",marginBottom:12 }}>
            <span style={{ fontSize:13 }}>📱</span>
            <span style={{ fontSize:11,color:"rgba(255,255,255,.5)",letterSpacing:".08em" }}>COACH APP · 體態評估</span>
          </div>
          <h1 style={{ fontSize:26,fontWeight:600,color:"#fff",margin:"0 0 6px" }}>教練體態評估 APP 操作流程</h1>
          <p style={{ fontSize:13,color:"rgba(255,255,255,.4)",margin:0 }}>所有欄位盡量用點選完成，減少打字</p>
        </div>

        {/* 步驟列 */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:32,flexWrap:"wrap",gap:5 }}>
          {STEPS.map((l,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center" }}>
              <div onClick={()=>i<=step&&setStep(i)}
                style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,cursor:i<=step?"pointer":"default",
                  background:step===i?"rgba(76,175,80,.25)":step>i?"rgba(76,175,80,.1)":"rgba(255,255,255,.05)",
                  border:`1px solid ${step===i?"#4CAF50":step>i?"rgba(76,175,80,.3)":"rgba(255,255,255,.1)"}` }}>
                <div style={{ width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,
                  background:step>i?"#4CAF50":step===i?"rgba(76,175,80,.4)":"transparent",
                  color:step>=i?"#fff":"rgba(255,255,255,.3)",border:step>i?"none":`1px solid ${step===i?"#4CAF50":"rgba(255,255,255,.2)"}` }}>
                  {step>i?"✓":i+1}
                </div>
                <span style={{ fontSize:10,color:step>=i?"#fff":"rgba(255,255,255,.35)",whiteSpace:"nowrap" }}>{l}</span>
              </div>
              {i<STEPS.length-1&&<div style={{ width:12,height:1,background:"rgba(255,255,255,.08)",margin:"0 2px" }} />}
            </div>
          ))}
        </div>

        {/* 手機 + 說明 */}
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"center",gap:36,flexWrap:"wrap" }}>
          <div style={{ flexShrink:0 }}>
            {step===0 && <StepHome onStart={next} />}
            {step===1 && <StepSelectMember onSelect={m=>{setMember(m);next();}} />}
            {step===2 && <StepCamera member={member} onDone={next} />}
            {step===3 && <StepAnalyzing onDone={next} />}
            {step===4 && <StepResults member={member} onNext={v=>{setMetricVals(v);next();}} />}
            {step===5 && <StepNotes member={member} metricVals={metricVals} onDone={next} />}
            {step===6 && <StepDone member={member} onRestart={reset} />}
          </div>

          {/* 說明 */}
          <div style={{ width:260,paddingTop:6,flexShrink:0 }}>
            {[
              { icon:"📱",title:"首頁",        desc:"快速入口 + 近期評估紀錄，一鍵開始。" },
              { icon:"👥",title:"選學員",      desc:"搜尋姓名/電話，直接點選進入流程。" },
              { icon:"📸",title:"拍照引導",    desc:"依序完成 5 張：正面 → 左側 → 背面 → 右側 → 正面（校正）。一次拍一張，拍完確認後才能進下一張。" },
              { icon:"🔬",title:"AI 分析",     desc:"自動識別骨骼關鍵點，生成量化數值。" },
              { icon:"✅",title:"確認結果",    desc:"AI 預填數值，教練只需點選調整 — 無需手動輸入。" },
              { icon:"✍️",title:"教練筆記",    desc:"功能篩查、彈簧設定、觀察備注、訓練計畫、居家建議、頻率 — 全部點選完成。" },
              { icon:"🎉",title:"發布完成",    desc:"報告即時同步至學員 APP 與後台管理模組。" },
            ].map((info,i)=>(
              <div key={i} style={{ padding:"10px 12px",borderRadius:12,marginBottom:8,
                background:step===i?"rgba(76,175,80,.12)":"rgba(255,255,255,.04)",
                border:`1px solid ${step===i?"rgba(76,175,80,.35)":"rgba(255,255,255,.07)"}`,
                opacity:step===i?1:0.45,transition:"all .2s" }}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:3 }}>
                  <span style={{ fontSize:14 }}>{info.icon}</span>
                  <span style={{ fontSize:12,fontWeight:600,color:step===i?"#fff":"rgba(255,255,255,.6)" }}>Step {i+1}  {info.title}</span>
                </div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,.45)",lineHeight:1.6 }}>{info.desc}</div>
              </div>
            ))}
            <div style={{ marginTop:6,padding:"10px 12px",borderRadius:12,background:"rgba(76,175,80,.07)",border:"1px solid rgba(76,175,80,.18)" }}>
              <div style={{ fontSize:11,fontWeight:600,color:"#4CAF50",marginBottom:5 }}>📡 資料流向</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,.4)",lineHeight:1.8 }}>
                教練 APP 生成 →<br/>
                後台「體態評估」模組 →<br/>
                學員前台「體態報告」
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
