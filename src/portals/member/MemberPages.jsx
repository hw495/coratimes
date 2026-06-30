import { useState } from "react";
import { useNavigate } from "react-router-dom";

const T = {
  bg:"#FAF8F5", sb:"#F0EBE3", sf:"#FFFFFF", sand2:"#E8E0D6", sand3:"#D6CCC0",
  rose:"#C4957A", rs:"#F5ECE6", rm:"#A87A62",
  sage:"#7A9E8E", ss:"#EAF2EF", sm:"#5C7D6F",
  ink:"#3A3530", i2:"#6E6358", i3:"#A89E94",
  bd:"#EAE4DC", bd2:"#D6CCC0",
  amb:"#B8924A", ambs:"#F5EDD8",
  lav:"#9B8FAE", lavs:"#F0EDF5",
};

function PageWrap({ children, noPad }) {
  return (
    <div style={{ flex:1, overflowY:"auto", padding: noPad ? 0 : "18px 20px",
      fontFamily:"'Noto Sans TC',sans-serif" }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontSize:15, fontWeight:300, color:T.ink, letterSpacing:".06em",
    marginBottom:14 }}>{children}</div>;
}

function Card({ children, style }) {
  return <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16,
    overflow:"hidden", ...style }}>{children}</div>;
}

function Tag({ children, bg, color }) {
  return <span style={{ fontSize:10, padding:"2px 9px", borderRadius:12,
    background:bg||T.sb, color:color||T.i2, fontWeight:500, display:"inline-block" }}>{children}</span>;
}

// ── 1. 工作室首頁 ─────────────────────────────────────────────
export function MemberHome() {
  const navigate = useNavigate();
  const todaySessions = [
    { id:1, time:"10:00", name:"器械 1 對 1", coach:"Sammi", room:"靜心室", quota:0, max:1, color:T.rose },
    { id:2, time:"14:00", name:"墊上 1 對 2", coach:"Annie", room:"靜心室", quota:1, max:2, color:T.lav  },
    { id:3, time:"19:00", name:"器械 1 對 1", coach:"Sammi", room:"靜心室", quota:0, max:1, color:T.rose },
    { id:4, time:"20:10", name:"體驗時光",    coach:"Sammi", room:"靜心室", quota:3, max:4, color:T.sage },
  ];
  const myPass = { name:"器械一對一 12 次", remain:8, total:12, expiry:"無期限" };

  return (
    <PageWrap noPad>
      {/* Hero banner */}
      <div style={{ background:`linear-gradient(160deg,${T.rs} 0%,${T.ss} 100%)`,
        padding:"28px 22px 24px", borderBottom:`1px solid ${T.bd}` }}>
        <div style={{ fontSize:11, color:T.rm, letterSpacing:".08em", marginBottom:6 }}>S.T Pilates</div>
        <div style={{ fontSize:22, fontWeight:300, color:T.ink, letterSpacing:".04em" }}>
          歡迎回來，<span style={{ color:T.rose }}>莊書語</span>
        </div>
        <div style={{ fontSize:12, color:T.i2, marginTop:5 }}>你的時光從這裡開始 🌿</div>
        {/* My pass mini */}
        <div style={{ marginTop:16, background:"rgba(255,255,255,.7)", borderRadius:12,
          padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:11, color:T.i3, marginBottom:3 }}>目前方案</div>
            <div style={{ fontSize:13, color:T.ink, fontWeight:500 }}>{myPass.name}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22, fontWeight:300, color:T.sm }}>{myPass.remain}</div>
            <div style={{ fontSize:10, color:T.i3 }}>次剩餘</div>
          </div>
        </div>
      </div>

      <div style={{ padding:"18px 20px" }}>

        {/* 健康評估表提醒（公司設定為必填且尚未完成時顯示） */}
        <div onClick={()=>navigate("/member/app/health")}
          style={{ background:T.ambs, border:`1px solid ${T.amb}40`, borderRadius:14,
            padding:"13px 15px", marginBottom:16, cursor:"pointer",
            display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:22 }}>📋</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:500, color:"#9A7030" }}>請完成身體狀況評估表</div>
            <div style={{ fontSize:11, color:"#9A7030", marginTop:2, opacity:.85 }}>上課前需填寫完成，僅需 2 分鐘</div>
          </div>
          <div style={{ fontSize:16, color:T.amb }}>›</div>
        </div>

        {/* Quick actions */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:22 }}>
          {[
            { icon:"🗓", label:"立即預約", sub:"查看今日可預約場次", path:"/member/schedule", color:T.rose, bg:T.rs },
            { icon:"💳", label:"我的時光券", sub:`剩餘 ${myPass.remain} 次`, path:"/member/passes", color:T.sage, bg:T.ss },
          ].map(a => (
            <div key={a.label} onClick={() => navigate(a.path)} style={{
              background:a.bg, border:`1px solid ${a.color}30`, borderRadius:14,
              padding:"14px 15px", cursor:"pointer" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{a.icon}</div>
              <div style={{ fontSize:13, fontWeight:500, color:a.color }}>{a.label}</div>
              <div style={{ fontSize:11, color:T.i2, marginTop:2 }}>{a.sub}</div>
            </div>
          ))}
        </div>

        {/* Today sessions */}
        <SectionTitle>今日場次</SectionTitle>
        <Card style={{ marginBottom:20 }}>
          {todaySessions.map((s, i) => (
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12,
              padding:"11px 15px", borderBottom: i<todaySessions.length-1 ? `1px solid ${T.bd}` : "none" }}>
              <div style={{ width:3, height:36, borderRadius:2, background:s.color, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:T.ink }}>{s.name}</div>
                <div style={{ fontSize:11, color:T.i3, marginTop:2 }}>{s.time} · {s.coach} · {s.room}</div>
              </div>
              {s.quota > 0
                ? <button onClick={() => navigate("/member/app/booking")} style={{
                    background:T.rose, border:"none", color:"#fff",
                    padding:"5px 14px", borderRadius:20, fontSize:11,
                    cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>預約</button>
                : <Tag bg={T.sb} color={T.i3}>已額滿</Tag>
              }
            </div>
          ))}
        </Card>

        {/* Recent history */}
        <SectionTitle>最近到場</SectionTitle>
        <Card>
          {[
            { date:"06/20", name:"器械 1 對 1", coach:"Sammi" },
            { date:"06/18", name:"器械 1 對 1", coach:"Sammi" },
            { date:"06/15", name:"墊上 1 對 2", coach:"Annie" },
          ].map((r, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"10px 15px", borderBottom: i<2 ? `1px solid ${T.bd}` : "none" }}>
              <div style={{ fontSize:11, color:T.i3, width:40, flexShrink:0 }}>{r.date}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:T.ink }}>{r.name}</div>
                <div style={{ fontSize:11, color:T.i3 }}>{r.coach}</div>
              </div>
              <Tag bg={T.ss} color={T.sm}>已到場</Tag>
            </div>
          ))}
        </Card>
      </div>
    </PageWrap>
  );
}

// ── 2. 課程瀏覽 ───────────────────────────────────────────────
export function MemberCourses() {
  const [filter, setFilter] = useState("all");
  const courses = [
    { id:1, name:"器械 1 對 1", type:"solo",  typeLabel:"專屬陪練", color:T.rose, bg:T.rs,
      duration:60, desc:"教練全程陪伴，深度調整體態與核心力量。", tags:["器械","私教"] },
    { id:2, name:"墊上 1 對 1", type:"solo",  typeLabel:"專屬陪練", color:T.rose, bg:T.rs,
      duration:60, desc:"以自身體重為主，強化穩定度與柔軟度。",   tags:["墊上","私教"] },
    { id:3, name:"墊上 1 對 2", type:"group", typeLabel:"小班共練", color:T.lav,  bg:T.lavs,
      duration:50, desc:"與搭檔一同練習，互相激勵。",             tags:["墊上","小班"] },
    { id:4, name:"體驗時光",    type:"trial", typeLabel:"初次體驗", color:T.sage, bg:T.ss,
      duration:50, desc:"適合初次接觸皮拉提斯的你。",             tags:["體驗","新生"] },
  ];
  const types = [
    { id:"all", label:"全部" }, { id:"solo", label:"專屬陪練" },
    { id:"group", label:"小班共練" }, { id:"trial", label:"初次體驗" },
  ];
  const filtered = filter === "all" ? courses : courses.filter(c => c.type === filter);

  return (
    <PageWrap>
      <SectionTitle>課程瀏覽</SectionTitle>
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {types.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{
            padding:"5px 14px", borderRadius:20, border:`1px solid ${filter===t.id?T.rose:T.bd2}`,
            background: filter===t.id ? T.rs : T.sf, color: filter===t.id ? T.rm : T.i2,
            fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(c => (
          <Card key={c.id} style={{ display:"flex", overflow:"visible" }}>
            <div style={{ width:4, background:c.color, flexShrink:0, borderRadius:"16px 0 0 16px" }} />
            <div style={{ padding:"14px 16px", flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ fontSize:14, fontWeight:500, color:T.ink }}>{c.name}</div>
                <Tag bg={c.bg} color={c.color}>{c.typeLabel}</Tag>
              </div>
              <div style={{ fontSize:12, color:T.i2, lineHeight:1.6, marginBottom:10 }}>{c.desc}</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ fontSize:11, color:T.i3 }}>⏱ {c.duration} 分鐘</div>
                <div style={{ display:"flex", gap:5 }}>
                  {c.tags.map(tag => (
                    <span key={tag} style={{ fontSize:10, padding:"1px 8px", borderRadius:10,
                      background:T.sb, color:T.i3 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageWrap>
  );
}

// ── 3. 教練介紹 ───────────────────────────────────────────────
export function MemberCoaches() {
  const coaches = [
    { name:"Sammi", initial:"S", bg:T.rs, color:T.rm,
      title:"資深皮拉提斯教練", exp:"8 年", skills:["器械","墊上","復健"],
      desc:"專注於脊椎矯正與核心肌群訓練，每位學員都能感受到細緻的調整與陪伴。" },
    { name:"Annie", initial:"A", bg:T.mists, color:T.mist,
      title:"瑜珈暨皮拉提斯教練", exp:"5 年", skills:["墊上","瑜珈"],
      desc:"結合瑜珈與皮拉提斯的訓練哲學，幫助你找回身體的自然平衡。" },
  ];
  const T2 = { mist:"#8A9BAE", mists:"#EEF2F6" };
  return (
    <PageWrap>
      <SectionTitle>教練介紹</SectionTitle>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {coaches.map(c => (
          <Card key={c.name} style={{ padding:"20px" }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:c.bg,
                color:c.color, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:22, fontWeight:300, flexShrink:0 }}>{c.initial}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:400, color:T.ink }}>{c.name}</div>
                <div style={{ fontSize:11, color:T.i3, marginTop:2 }}>{c.title} · {c.exp}資歷</div>
                <div style={{ display:"flex", gap:5, marginTop:8, flexWrap:"wrap" }}>
                  {c.skills.map(s => (
                    <span key={s} style={{ fontSize:10, padding:"2px 9px", borderRadius:10,
                      background:T.sb, color:T.i2 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ fontSize:12, color:T.i2, lineHeight:1.7, marginTop:12,
              paddingTop:12, borderTop:`1px solid ${T.bd}` }}>{c.desc}</div>
          </Card>
        ))}
      </div>
    </PageWrap>
  );
}

// ── 4. 預約時光（時光表） ─────────────────────────────────────
export function MemberSchedule() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const sessions = [
    { id:1, date:"今天",    day:"週四", time:"10:00", name:"器械 1 對 1", coach:"Sammi", quota:1, max:1, color:T.rose },
    { id:2, date:"今天",    day:"週四", time:"14:00", name:"墊上 1 對 2", coach:"Annie", quota:1, max:2, color:T.lav  },
    { id:3, date:"今天",    day:"週四", time:"19:00", name:"器械 1 對 1", coach:"Sammi", quota:0, max:1, color:T.rose },
    { id:4, date:"明天",    day:"週五", time:"10:00", name:"體驗時光",    coach:"Sammi", quota:3, max:4, color:T.sage },
    { id:5, date:"明天",    day:"週五", time:"19:30", name:"器械 1 對 1", coach:"Sammi", quota:1, max:1, color:T.rose },
    { id:6, date:"06/28",  day:"週六", time:"11:00", name:"墊上 1 對 2", coach:"Annie", quota:2, max:2, color:T.lav  },
  ];
  const grouped = sessions.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = { day:s.day, sessions:[] };
    acc[s.date].sessions.push(s); return acc;
  }, {});

  return (
    <PageWrap>
      <SectionTitle>預約時光</SectionTitle>
      {Object.entries(grouped).map(([date, { day, sessions }]) => (
        <div key={date} style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, color:T.i3, letterSpacing:".06em", marginBottom:8 }}>
            {date} <span style={{ color:T.i3 }}>·</span> {day}
          </div>
          <Card>
            {sessions.map((s, i) => (
              <div key={s.id} onClick={() => setSelected(s.id===selected ? null : s.id)}
                style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"12px 15px", cursor:"pointer",
                  borderBottom: i<sessions.length-1 ? `1px solid ${T.bd}` : "none",
                  background: selected===s.id ? T.rs : T.sf }}>
                <div style={{ width:3, height:36, borderRadius:2, background:s.color, flexShrink:0 }} />
                <div style={{ width:40, flexShrink:0 }}>
                  <div style={{ fontSize:12, color:T.ink, fontWeight:400 }}>{s.time}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:T.ink }}>{s.name}</div>
                  <div style={{ fontSize:11, color:T.i3, marginTop:1 }}>{s.coach}</div>
                </div>
                {s.quota > 0
                  ? <Tag bg={T.ss} color={T.sm}>剩 {s.quota} 位</Tag>
                  : <Tag bg={T.sb} color={T.i3}>已額滿</Tag>
                }
              </div>
            ))}
          </Card>
          {/* Expanded booking panel */}
          {sessions.filter(s => s.id === selected).map(s => (
            <div key={s.id} style={{ background:T.rs, border:`1px solid ${T.rose}30`,
              borderRadius:12, padding:"14px 16px", marginTop:6 }}>
              <div style={{ fontSize:13, fontWeight:500, color:T.rm, marginBottom:4 }}>{s.name}</div>
              <div style={{ fontSize:11, color:T.i2, marginBottom:12 }}>
                {s.date} {s.time} · {s.coach} · 剩 {s.quota} 位
              </div>
              <button onClick={() => navigate("/member/app/booking")} style={{
                background:T.rose, border:"none", color:"#fff",
                padding:"10px 24px", borderRadius:20, fontSize:13, fontWeight:500,
                cursor:"pointer", fontFamily:"inherit" }}>選擇此場次 →</button>
            </div>
          ))}
        </div>
      ))}
    </PageWrap>
  );
}

// ── 5. 確認預約 ───────────────────────────────────────────────
export function MemberBooking() {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("atm");
  const navigate = useNavigate();

  const session = { name:"器械 1 對 1", date:"06/26 週四", time:"14:00", coach:"Sammi", room:"靜心室" };
  const pass    = { name:"器械一對一 12 次", remain:8 };

  return (
    <PageWrap>
      {/* Step indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:22 }}>
        {["選擇場次","確認方案","完成預約"].map((s, i) => (
          <div key={s} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:22, height:22, borderRadius:"50%",
                background: step > i ? T.rose : step === i+1 ? T.rose : T.sb,
                color: step > i || step === i+1 ? "#fff" : T.i3,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:500, flexShrink:0 }}>
                {step > i ? "✓" : i+1}
              </div>
              <span style={{ fontSize:11, color: step===i+1 ? T.ink : T.i3 }}>{s}</span>
            </div>
            {i < 2 && <div style={{ width:20, height:1, background:T.bd, margin:"0 6px" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <SectionTitle>已選場次</SectionTitle>
          <Card style={{ padding:"16px", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:4, height:44, borderRadius:2, background:T.rose }} />
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:T.ink }}>{session.name}</div>
                <div style={{ fontSize:12, color:T.i3, marginTop:3 }}>
                  {session.date} · {session.time} · {session.coach} · {session.room}
                </div>
              </div>
            </div>
          </Card>
          <button onClick={() => setStep(2)} style={{ width:"100%", padding:"13px",
            borderRadius:12, border:"none", background:T.rose, color:"#fff",
            fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>
            繼續 →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <SectionTitle>選擇時光券</SectionTitle>
          <Card style={{ padding:"16px", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:T.ink }}>{pass.name}</div>
                <div style={{ fontSize:11, color:T.i3, marginTop:2 }}>剩 {pass.remain} 次 · 使用後剩 {pass.remain-1} 次</div>
              </div>
              <div style={{ width:20, height:20, borderRadius:"50%",
                border:`2px solid ${T.rose}`, background:T.rs,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:T.rose }} />
              </div>
            </div>
          </Card>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setStep(1)} style={{ flex:1, padding:"13px",
              borderRadius:12, border:`1px solid ${T.bd2}`, background:T.sf, color:T.i2,
              fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>← 返回</button>
            <button onClick={() => setStep(3)} style={{ flex:2, padding:"13px",
              borderRadius:12, border:"none", background:T.rose, color:"#fff",
              fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>確認預約</button>
          </div>
        </>
      )}

      {step === 3 && (
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
          <div style={{ fontSize:18, fontWeight:300, color:T.ink, marginBottom:8 }}>預約成功</div>
          <div style={{ fontSize:12, color:T.i3, marginBottom:24, lineHeight:1.7 }}>
            {session.name}<br/>{session.date} · {session.time}
          </div>
          <div style={{ background:T.ss, borderRadius:12, padding:"12px 16px",
            marginBottom:24, fontSize:12, color:T.sm }}>
            已使用 1 次，剩餘 {pass.remain-1} 次
          </div>
          <button onClick={() => navigate("/member/app")} style={{
            background:T.rose, border:"none", color:"#fff",
            padding:"12px 28px", borderRadius:20, fontSize:13, fontWeight:500,
            cursor:"pointer", fontFamily:"inherit" }}>返回首頁</button>
        </div>
      )}
    </PageWrap>
  );
}

// ── 6. 我的時光券 ─────────────────────────────────────────────
export function MemberPasses() {
  const passes = [
    { name:"器械一對一 12 次", remain:8, total:12, expiry:"無期限", status:"active" },
    { name:"墊上一對一 6 次",  remain:1, total:6,  expiry:"2026/06/30", status:"expiring" },
  ];
  return (
    <PageWrap>
      <SectionTitle>我的時光券</SectionTitle>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {passes.map((p, i) => (
          <Card key={i} style={{ padding:"16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:500, color:T.ink }}>{p.name}</div>
              <Tag bg={p.status==="active"?T.ss:T.ambs} color={p.status==="active"?T.sm:T.amb}>
                {p.status==="active"?"使用中":"即將到期"}
              </Tag>
            </div>
            <div style={{ background:T.sb, borderRadius:8, height:6, overflow:"hidden", marginBottom:8 }}>
              <div style={{ height:6, borderRadius:8,
                background: p.status==="active" ? T.sage : T.amb,
                width:`${(p.remain/p.total)*100}%`, transition:"width .3s" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.i3 }}>
              <span>剩 {p.remain} 次</span>
              <span>到期：{p.expiry}</span>
            </div>
          </Card>
        ))}
      </div>
      <SectionTitle>可購買方案</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
        {[
          { name:"墊上體驗一次", price:"$588",  badge:"初次體驗", color:T.lav, bg:T.lavs },
          { name:"器械一對一 6次", price:"$9,975", badge:"次數方案", color:T.rose, bg:T.rs },
        ].map(p => (
          <div key={p.name} style={{ background:p.bg, border:`1px solid ${p.color}30`,
            borderRadius:12, padding:"14px" }}>
            <Tag bg={p.color} color="#fff">{p.badge}</Tag>
            <div style={{ fontSize:13, color:T.ink, marginTop:8, marginBottom:4 }}>{p.name}</div>
            <div style={{ fontSize:18, fontWeight:300, color:T.ink, marginBottom:10 }}>{p.price}</div>
            <button style={{ width:"100%", padding:"8px", borderRadius:20,
              border:"none", background:p.color, color:"#fff",
              fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>購買</button>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ── 7. 預留紀錄 ───────────────────────────────────────────────
export function MemberHistory() {
  const history = [
    { date:"06/24", name:"器械 1 對 1", coach:"Sammi", status:"attended" },
    { date:"06/20", name:"器械 1 對 1", coach:"Sammi", status:"attended" },
    { date:"06/22", name:"墊上 1 對 2", coach:"Annie", status:"cancelled" },
    { date:"06/26", name:"器械 1 對 1", coach:"Sammi", status:"confirmed", future:true },
  ];
  return (
    <PageWrap>
      <SectionTitle>預留紀錄</SectionTitle>
      <Card>
        {history.map((h, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10,
            padding:"11px 15px", borderBottom: i<history.length-1 ? `1px solid ${T.bd}` : "none" }}>
            <div style={{ fontSize:11, color:T.i3, width:42, flexShrink:0 }}>{h.date}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:T.ink }}>{h.name}</div>
              <div style={{ fontSize:11, color:T.i3, marginTop:1 }}>{h.coach}</div>
            </div>
            <Tag
              bg={h.status==="attended"?T.ss:h.status==="cancelled"?T.sb:T.rs}
              color={h.status==="attended"?T.sm:h.status==="cancelled"?T.i3:T.rm}>
              {h.status==="attended"?"已到場":h.status==="cancelled"?"已取消":"即將到來"}
            </Tag>
            {h.future && (
              <button style={{ fontSize:11, color:T.coral, background:"none",
                border:`1px solid ${T.corals}`, padding:"3px 9px",
                borderRadius:12, cursor:"pointer", fontFamily:"inherit" }}>取消</button>
            )}
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

// ── 8. 服務合約 ───────────────────────────────────────────────
export function MemberContracts() {
  const [signed, setSigned] = useState(false);
  return (
    <PageWrap>
      <SectionTitle>服務合約</SectionTitle>
      <Card style={{ padding:"16px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ fontSize:13, fontWeight:500, color:T.ink }}>服務合約（定型化）</div>
          <Tag bg={signed?T.ss:T.ambs} color={signed?T.sm:T.amb}>{signed?"已簽署":"待簽署"}</Tag>
        </div>
        <div style={{ fontSize:11, color:T.i3, lineHeight:1.7, marginBottom:12 }}>
          購買方案適用 · 2026/03/10 版本
        </div>
        {!signed ? (
          <button onClick={() => setSigned(true)} style={{
            width:"100%", padding:"11px", borderRadius:12, border:"none",
            background:T.rose, color:"#fff", fontSize:13, fontWeight:500,
            cursor:"pointer", fontFamily:"inherit" }}>閱讀並簽署</button>
        ) : (
          <button style={{ width:"100%", padding:"11px", borderRadius:12,
            border:`1px solid ${T.bd2}`, background:T.sf, color:T.i2,
            fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>下載 PDF</button>
        )}
      </Card>
      <Card style={{ padding:"16px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ fontSize:13, fontWeight:500, color:T.ink }}>體驗同意書</div>
          <Tag bg={T.ss} color={T.sm}>已簽署</Tag>
        </div>
        <div style={{ fontSize:11, color:T.i3 }}>體驗時光適用 · 簽署日：2026/05/10</div>
      </Card>
    </PageWrap>
  );
}

// ── 9. 個人資料 ───────────────────────────────────────────────
export function MemberProfile() {
  const [editing, setEditing] = useState(false);
  return (
    <PageWrap>
      <SectionTitle>個人資料</SectionTitle>
      <Card style={{ padding:"20px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:T.rs,
            color:T.rm, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:22, fontWeight:300 }}>莊</div>
          <div>
            <div style={{ fontSize:16, fontWeight:300, color:T.ink }}>莊書語</div>
            <div style={{ fontSize:12, color:T.i3, marginTop:2 }}>加入於 2025/08/12</div>
          </div>
        </div>
        {[["姓名","莊書語"],["電話","0912-345-678"],["Email","zhuang@example.com"],["LINE","@zhuang"]].map(([l,v])=>(
          <div key={l} style={{ display:"flex", borderBottom:`1px solid ${T.bd}`,
            padding:"10px 0", fontSize:12 }}>
            <span style={{ width:60, color:T.i3, flexShrink:0 }}>{l}</span>
            <span style={{ color:T.ink }}>{v}</span>
          </div>
        ))}
        <button onClick={() => setEditing(!editing)} style={{
          marginTop:14, width:"100%", padding:"10px",
          borderRadius:12, border:`1px solid ${T.bd2}`, background:T.sf,
          color:T.i2, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
          {editing ? "儲存" : "編輯資料"}
        </button>
      </Card>
      <Card style={{ padding:"16px" }}>
        <div style={{ fontSize:13, fontWeight:500, color:T.ink, marginBottom:12 }}>登入方式</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:"#06C755",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontSize:12, fontWeight:700 }}>L</div>
            <span style={{ fontSize:12, color:T.ink }}>LINE 帳號已連結</span>
          </div>
          <Tag bg={T.ss} color={T.sm}>已連結</Tag>
        </div>
      </Card>
    </PageWrap>
  );
}

// ── 體態報告（學員前台）────────────────────────────────────────
const M_POSTURE_MOCK = [
  {
    id:1, date:"2026/05/22", coach:"Sammi", progress:"器械私教 1/10",
    errCount:2, warnCount:3,
    metrics:[
      { name:"頭部前引",  value:23.5, status:"err",  ideal:"< 15°",   note:"輕微烏龜頸，伴隨胸鎖乳突肌過緊。"         },
      { name:"高低肩差",  value:1.8,  status:"warn", ideal:"0°",      note:"疑似習慣性單邊提肩，上斜方肌兩側張力不均。" },
      { name:"脊椎側彎",  value:7.2,  status:"warn", ideal:"< 10°",   note:"處於臨界值，建議加強核心不對稱旋轉阻力訓練。" },
      { name:"骨盆傾斜",  value:2.1,  status:"warn", ideal:"0°",      note:"骨盆歪斜，可能影響單側臀大肌與腰方肌發力。"  },
      { name:"骨盆前傾",  value:19.2, status:"err",  ideal:"7°–15°",  note:"下交叉綜合症，伴隨腹直肌無力、腰椎壓力過大。"},
    ],
    coachNote:"學員今日初次體驗，主要痛點為長期久坐引起的骨盆前傾與輕微高低肩。前 5 堂課將專注於脊椎中立位的尋找與呼吸優化，後半期則引進不對稱阻力，以改善兩側骨盆不平衡問題。",
    phase1:["橫膈膜呼吸模式優化與肋骨控制","骨盆中立位與脊椎中立線的建立","核心深層、臀大肌與腹直肌的喚醒"],
    phase2:["Reformer 跨軸三維空間的動態穩定訓練","引進不對稱阻力，針對單側弱勢肌群進行強化"],
    homework:"每日進行 3 組貓牛式 (Cat-Cow) 與泡沫軸胸廓放鬆，每組持續 60 秒。",
    freq:"每週 2 次",
    goal:"骨盆歪斜角度由 2.1° 降至 1° 以內，並顯著改善高低肩與體態不平衡問題。",
  },
];

const MP_STATUS = {
  ok:   { bg:"#E8F5E9", color:"#388E3C", label:"正常", dot:"#4CAF50" },
  warn: { bg:"#FFF3E0", color:"#E65100", label:"留意", dot:"#FF9800" },
  err:  { bg:"#FFEBEE", color:"#C62828", label:"異常", dot:"#E53935" },
};

export function MemberPosture() {
  const [selected, setSelected] = useState(M_POSTURE_MOCK[0]);
  const [tab, setTab] = useState("overview");

  const TABS = [
    { id:"overview", label:"總覽" },
    { id:"metrics",  label:"量化數據" },
    { id:"plan",     label:"訓練計畫" },
    { id:"photos",   label:"體態照片" },
  ];

  return (
    <PageWrap>
      {/* 標題 */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
        <div>
          <SectionTitle>體態報告</SectionTitle>
          <div style={{ fontSize:11,color:T.i3,marginTop:-10 }}>由教練評估後自動同步</div>
        </div>
        <div style={{ fontSize:11,color:T.sage,background:T.ss,padding:"4px 10px",borderRadius:20 }}>
          共 {M_POSTURE_MOCK.length} 次評估
        </div>
      </div>

      {/* 歷次報告選擇 */}
      <div style={{ display:"flex",gap:8,marginBottom:18,overflowX:"auto",scrollbarWidth:"none",paddingBottom:2 }}>
        {M_POSTURE_MOCK.map((r,i)=>(
          <div key={r.id} onClick={()=>setSelected(r)}
            style={{ flexShrink:0,padding:"9px 14px",borderRadius:12,cursor:"pointer",
                     border:`1.5px solid ${selected?.id===r.id?T.rose:T.bd}`,
                     background:selected?.id===r.id?T.rs:T.sf,
                     minWidth:120 }}>
            <div style={{ fontSize:11,fontWeight:600,color:selected?.id===r.id?T.rm:T.ink }}>第 {i+1} 次</div>
            <div style={{ fontSize:10,color:T.i3,marginTop:2 }}>{r.date}</div>
            <div style={{ fontSize:10,color:T.i3 }}>{r.coach} 教練</div>
            <div style={{ display:"flex",gap:4,marginTop:5 }}>
              {r.errCount>0 && <span style={{ fontSize:9,padding:"1px 5px",borderRadius:6,background:"#FFEBEE",color:"#C62828" }}>異常{r.errCount}</span>}
              {r.warnCount>0 && <span style={{ fontSize:9,padding:"1px 5px",borderRadius:6,background:"#FFF3E0",color:"#E65100" }}>留意{r.warnCount}</span>}
              {r.errCount===0&&r.warnCount===0 && <span style={{ fontSize:9,padding:"1px 5px",borderRadius:6,background:"#E8F5E9",color:"#388E3C" }}>正常</span>}
            </div>
          </div>
        ))}
        <div style={{ flexShrink:0,padding:"9px 14px",borderRadius:12,border:`1.5px dashed ${T.bd2}`,display:"flex",alignItems:"center",gap:6,color:T.i3,fontSize:11 }}>
          📅 下次評估<br/><span style={{ fontSize:10 }}>第 11 堂後</span>
        </div>
      </div>

      {selected && (
        <>
          {/* 報告 header */}
          <Card style={{ marginBottom:14 }}>
            <div style={{ padding:"14px 16px",borderBottom:`1px solid ${T.bd}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4 }}>
                <div style={{ fontSize:14,fontWeight:500,color:T.ink }}>第 1 次體態評估報告</div>
                <span style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:T.ss,color:T.sm }}>已發布</span>
              </div>
              <div style={{ fontSize:11,color:T.i3 }}>{selected.date} · {selected.coach} 教練 · {selected.progress}</div>
            </div>
            {/* 狀態總覽 */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"12px 16px",gap:8 }}>
              {[
                { label:"異常", count:selected.errCount, ...MP_STATUS.err },
                { label:"留意", count:selected.warnCount, ...MP_STATUS.warn },
                { label:"正常", count:selected.metrics.filter(m=>m.status==="ok").length, ...MP_STATUS.ok },
              ].map(s=>(
                <div key={s.label} style={{ background:s.bg,borderRadius:9,padding:"9px",textAlign:"center" }}>
                  <div style={{ fontSize:20,fontWeight:600,color:s.color }}>{s.count}</div>
                  <div style={{ fontSize:10,color:s.color }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tabs */}
          <div style={{ display:"flex",borderBottom:`1px solid ${T.bd}`,marginBottom:14,background:T.sf,borderRadius:"12px 12px 0 0",overflow:"hidden" }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{ flex:1,padding:"10px 4px",fontSize:12,border:"none",background:"none",cursor:"pointer",
                         fontFamily:"inherit",color:tab===t.id?T.rose:T.i3,
                         borderBottom:`2px solid ${tab===t.id?T.rose:"transparent"}`,fontWeight:tab===t.id?500:400 }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab: 總覽 */}
          {tab==="overview" && (
            <div>
              <div style={{ borderLeft:`2px solid ${T.rose}`,paddingLeft:12,marginBottom:14,fontSize:13,color:T.i2,lineHeight:1.8 }}>
                {selected.coachNote}
              </div>
              <Card>
                <div style={{ padding:"12px 16px",borderBottom:`1px solid ${T.bd}`,fontSize:12,fontWeight:500,color:T.ink }}>居家伸展建議</div>
                <div style={{ padding:"12px 16px",fontSize:12,color:T.i2,lineHeight:1.7 }}>{selected.homework}</div>
              </Card>
              <div style={{ marginTop:10,padding:"10px 14px",background:T.ss,borderRadius:12,fontSize:11,color:T.sm }}>
                🎯 <strong>複檢目標：</strong>{selected.goal}
              </div>
            </div>
          )}

          {/* Tab: 量化數據 */}
          {tab==="metrics" && (
            <div>
              {selected.metrics.map((m,i)=>{
                const st = MP_STATUS[m.status];
                const maxV = m.name.includes("前傾")?35:m.name.includes("頭部")?40:20;
                const pct = Math.min((m.value/maxV)*100,100);
                return (
                  <Card key={i} style={{ padding:"13px 15px",marginBottom:9 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                      <div>
                        <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>{m.name}</div>
                        <div style={{ fontSize:10,color:T.i3,marginTop:1 }}>理想 {m.ideal}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:22,fontWeight:400,color:st.color }}>{m.value}°</div>
                        <span style={{ fontSize:10,padding:"2px 7px",borderRadius:8,background:st.bg,color:st.color }}>{st.label}</span>
                      </div>
                    </div>
                    <div style={{ height:4,background:T.bd,borderRadius:2,overflow:"hidden",marginBottom:6 }}>
                      <div style={{ height:4,borderRadius:2,width:`${pct}%`,
                        background:m.status==="err"?"#E53935":m.status==="warn"?"#FF9800":"#4CAF50" }} />
                    </div>
                    <div style={{ fontSize:11,color:T.i2,lineHeight:1.5 }}>{m.note}</div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Tab: 訓練計畫 */}
          {tab==="plan" && (
            <div>
              <Card style={{ padding:"14px 16px",marginBottom:10 }}>
                <div style={{ fontSize:12,fontWeight:500,color:T.ink,marginBottom:10 }}>📅 階段一訓練重點</div>
                {selected.phase1.map((p,i)=>(
                  <div key={i} style={{ display:"flex",gap:8,padding:"5px 0",borderBottom:i<selected.phase1.length-1?`1px solid ${T.bd}`:"none" }}>
                    <div style={{ width:18,height:18,borderRadius:"50%",background:T.rs,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:T.rose,flexShrink:0,marginTop:1 }}>{i+1}</div>
                    <div style={{ fontSize:12,color:T.i2,lineHeight:1.5 }}>{p}</div>
                  </div>
                ))}
              </Card>
              <Card style={{ padding:"14px 16px",marginBottom:10 }}>
                <div style={{ fontSize:12,fontWeight:500,color:T.ink,marginBottom:10 }}>📅 階段二訓練重點</div>
                {selected.phase2.map((p,i)=>(
                  <div key={i} style={{ display:"flex",gap:8,padding:"5px 0",borderBottom:i<selected.phase2.length-1?`1px solid ${T.bd}`:"none" }}>
                    <div style={{ width:18,height:18,borderRadius:"50%",background:T.ss,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:T.sage,flexShrink:0,marginTop:1 }}>{i+1}</div>
                    <div style={{ fontSize:12,color:T.i2,lineHeight:1.5 }}>{p}</div>
                  </div>
                ))}
              </Card>
              <div style={{ padding:"12px 14px",background:T.ss,borderRadius:12,fontSize:11,color:T.sm,marginBottom:10 }}>
                🏠 <strong>居家伸展：</strong>{selected.homework}
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <div style={{ flex:1,padding:"10px 12px",background:T.sb,borderRadius:10 }}>
                  <div style={{ fontSize:10,color:T.i3,marginBottom:2 }}>建議排課</div>
                  <div style={{ fontSize:13,fontWeight:500,color:T.ink }}>{selected.freq}</div>
                </div>
                <div style={{ flex:2,padding:"10px 12px",background:T.sb,borderRadius:10 }}>
                  <div style={{ fontSize:10,color:T.i3,marginBottom:2 }}>複檢目標</div>
                  <div style={{ fontSize:11,color:T.ink,lineHeight:1.5 }}>{selected.goal}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: 體態照片 */}
          {tab==="photos" && (
            <div>
              <div style={{ padding:"12px 14px",background:"#FFF3E0",borderRadius:10,marginBottom:14,fontSize:11,color:"#E65100",display:"flex",gap:8,alignItems:"flex-start" }}>
                <span>🔒</span>
                <div>體態照片受隱私政策保護，需通過指紋或 PIN 碼驗證後才可查閱。</div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
                {[["正面","Anterior"],["側面","Lateral"],["背面","Posterior"]].map(([l,en])=>(
                  <div key={l} style={{ borderRadius:12,overflow:"hidden",border:`1px solid ${T.bd}` }}>
                    <div style={{ height:120,background:"#2A2A2A",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6 }}>
                      <div style={{ fontSize:24,opacity:.3 }}>🔒</div>
                      <div style={{ fontSize:10,color:"rgba(255,255,255,.3)" }}>{en} View</div>
                    </div>
                    <div style={{ padding:"7px 8px",background:T.sb,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                      <span style={{ fontSize:11,color:T.i2 }}>{l}</span>
                      <button style={{ fontSize:10,padding:"3px 9px",borderRadius:10,border:`1px solid ${T.bd2}`,background:T.sf,color:T.i2,cursor:"pointer",fontFamily:"inherit" }}>解鎖</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PageWrap>
  );
}

// ── 身體狀況評估表（學員填寫）─────────────────────────────────
const HEALTH_QUESTIONS = [
  { key:"heart",    label:"心臟疾病或心血管問題", sub:"包含高血壓、心律不整、曾接受心臟手術等" },
  { key:"spine",     label:"脊椎或椎間盤問題",     sub:"椎間盤突出、脊椎滑脫、坐骨神經痛等" },
  { key:"joint",     label:"關節或骨骼舊傷",       sub:"曾骨折、韌帶撕裂、關節置換手術等" },
  { key:"surgery",   label:"近 6 個月內動過手術",  sub:"包含任何部位的外科手術" },
  { key:"pregnancy", label:"目前懷孕或產後 6 個月內", sub:"" },
  { key:"dizzy",     label:"運動中曾感到暈眩、胸痛或呼吸困難", sub:"" },
  { key:"chronic",   label:"其他慢性疾病",          sub:"糖尿病、氣喘、自律神經失調等" },
];

const BODY_PARTS = [
  "頸部","肩部","上背","下背 / 腰椎","骨盆 / 髖部",
  "膝關節","腳踝","手腕 / 手肘","其他",
];

export function MemberHealthForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(
    HEALTH_QUESTIONS.reduce((acc,q)=>({...acc,[q.key]:null}),{})
  );
  const [detail, setDetail] = useState("");
  const [painAreas, setPainAreas] = useState([]);
  const [medication, setMedication] = useState(null);
  const [medicationNote, setMedicationNote] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setAns = (key, val) => setAnswers(p=>({...p,[key]:val}));
  const togglePart = (p) => setPainAreas(prev=>prev.includes(p)?prev.filter(x=>x!==p):[...prev,p]);

  const hasYes = Object.values(answers).some(v=>v===true);
  const allAnswered = Object.values(answers).every(v=>v!==null);

  const STEPS = ["健康問卷","疼痛部位","緊急聯絡","確認送出"];

  const YesNoBtn = ({ value, onChange }) => (
    <div style={{ display:"flex",gap:8,flexShrink:0 }}>
      {[["是",true,T.coral||"#C4726A","#FDECEA"],["否",false,T.sage,T.ss]].map(([l,v,c,bg])=>(
        <button key={l} onClick={()=>onChange(v)}
          style={{ padding:"6px 16px",borderRadius:20,border:`1.5px solid ${value===v?c:T.bd}`,
            background:value===v?bg:T.sf,color:value===v?c:T.i2,fontSize:12,fontWeight:value===v?600:400,
            cursor:"pointer",fontFamily:"inherit" }}>
          {l}
        </button>
      ))}
    </div>
  );

  if(submitted) return (
    <PageWrap>
      <div style={{ textAlign:"center",padding:"60px 20px" }}>
        <div style={{ width:72,height:72,borderRadius:"50%",background:T.ss,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:32 }}>✅</div>
        <div style={{ fontSize:17,fontWeight:600,color:T.ink,marginBottom:8 }}>評估表已送出</div>
        <div style={{ fontSize:13,color:T.i3,lineHeight:1.8,marginBottom:20 }}>
          {hasYes
            ? <>教練將於您下次課程前review您的健康資訊，<br/>並依需要調整動作或鐘點安排。</>
            : <>感謝您完成填寫，祝您訓練愉快！</>}
        </div>
        {hasYes && (
          <div style={{ background:T.ambs,borderRadius:12,padding:"12px 16px",fontSize:12,color:"#9A7030",lineHeight:1.7,textAlign:"left" }}>
            ⚠ 您填寫了一項或多項健康狀況，建議於首次上課時主動告知教練詳細狀況，以利安排適合的訓練強度。
          </div>
        )}
      </div>
    </PageWrap>
  );

  return (
    <PageWrap>
      <SectionTitle>身體狀況評估表</SectionTitle>

      {/* 提示 */}
      <div style={{ background:T.sb,borderRadius:12,padding:"11px 14px",marginBottom:16,fontSize:11,color:T.i3,lineHeight:1.7 }}>
        🔒 此資料僅供教練安排適合您的課程內容使用，並受隱私政策保護。本表單不構成醫療診斷或建議，如有疑慮請先諮詢醫師。
      </div>

      {/* 步驟條 */}
      <div style={{ display:"flex",alignItems:"center",marginBottom:20 }}>
        {STEPS.map((s,i)=>(
          <div key={s} style={{ display:"flex",alignItems:"center",flex:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <div style={{ width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:600,background:step>i?T.sage:step===i?T.rose:T.bd,color:step>=i?"#fff":T.i3 }}>
                {step>i?"✓":i+1}
              </div>
              <span style={{ fontSize:10,color:step===i?T.ink:T.i3,whiteSpace:"nowrap",fontWeight:step===i?500:400 }}>{s}</span>
            </div>
            {i<STEPS.length-1 && <div style={{ flex:1,height:1,background:step>i?T.sage:T.bd,margin:"0 6px" }} />}
          </div>
        ))}
      </div>

      {/* Step 0: 健康問卷 */}
      {step===0 && (
        <div>
          <div style={{ fontSize:12,color:T.i3,marginBottom:14 }}>請依實際狀況回答以下問題</div>
          {HEALTH_QUESTIONS.map(q=>(
            <Card key={q.key} style={{ padding:"13px 15px",marginBottom:9 }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:10 }}>
                <div>
                  <div style={{ fontSize:13,color:T.ink,fontWeight:500 }}>{q.label}</div>
                  {q.sub && <div style={{ fontSize:11,color:T.i3,marginTop:2 }}>{q.sub}</div>}
                </div>
                <YesNoBtn value={answers[q.key]} onChange={v=>setAns(q.key,v)} />
              </div>
            </Card>
          ))}

          {hasYes && (
            <div style={{ marginTop:6,marginBottom:6 }}>
              <div style={{ fontSize:11,color:T.i3,marginBottom:5 }}>請補充說明（選填）</div>
              <textarea value={detail} onChange={e=>setDetail(e.target.value)} rows={3}
                placeholder="例：右膝十字韌帶手術，術後一年，深蹲動作會不適…"
                style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"10px 12px",fontSize:13,color:T.ink,fontFamily:"inherit",resize:"vertical",outline:"none",lineHeight:1.6,boxSizing:"border-box" }} />
            </div>
          )}

          <div style={{ marginTop:10 }}>
            <div style={{ fontSize:12,fontWeight:500,color:T.ink,marginBottom:8 }}>目前是否服用藥物</div>
            <YesNoBtn value={medication} onChange={setMedication} />
            {medication && (
              <input value={medicationNote} onChange={e=>setMedicationNote(e.target.value)}
                placeholder="藥物名稱或用途（選填）"
                style={{ width:"100%",marginTop:8,border:`1px solid ${T.bd2}`,borderRadius:9,padding:"9px 11px",fontSize:13,color:T.ink,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }} />
            )}
          </div>

          <button onClick={()=>setStep(1)} disabled={!allAnswered}
            style={{ width:"100%",padding:"13px",borderRadius:20,border:"none",marginTop:20,
              background:allAnswered?T.rose:"#ccc",color:"#fff",fontSize:14,fontWeight:600,
              cursor:allAnswered?"pointer":"not-allowed",fontFamily:"inherit" }}>
            下一步
          </button>
        </div>
      )}

      {/* Step 1: 疼痛部位 */}
      {step===1 && (
        <div>
          <div style={{ fontSize:12,color:T.i3,marginBottom:14 }}>請選擇目前感到不適或需要特別留意的部位（可複選，無則跳過）</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:20 }}>
            {BODY_PARTS.map(p=>{
              const active = painAreas.includes(p);
              return (
                <button key={p} onClick={()=>togglePart(p)}
                  style={{ padding:"8px 16px",borderRadius:20,border:`1.5px solid ${active?T.rose:T.bd}`,
                    background:active?T.rs:T.sf,color:active?T.rm:T.i2,fontSize:13,
                    cursor:"pointer",fontFamily:"inherit",fontWeight:active?500:400 }}>
                  {active?"✓ ":""}{p}
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={()=>setStep(0)}
              style={{ flex:1,padding:"13px",borderRadius:20,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>
              上一步
            </button>
            <button onClick={()=>setStep(2)}
              style={{ flex:2,padding:"13px",borderRadius:20,border:"none",background:T.rose,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
              下一步
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 緊急聯絡 */}
      {step===2 && (
        <div>
          <div style={{ fontSize:12,color:T.i3,marginBottom:14 }}>請填寫上課期間緊急聯絡人資訊</div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11,color:T.i3,marginBottom:5 }}>聯絡人姓名</div>
            <input value={emergencyName} onChange={e=>setEmergencyName(e.target.value)}
              style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"9px 11px",fontSize:13,color:T.ink,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11,color:T.i3,marginBottom:5 }}>聯絡電話</div>
            <input value={emergencyPhone} onChange={e=>setEmergencyPhone(e.target.value)}
              style={{ width:"100%",border:`1px solid ${T.bd2}`,borderRadius:9,padding:"9px 11px",fontSize:13,color:T.ink,fontFamily:"inherit",outline:"none",boxSizing:"border-box" }} />
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={()=>setStep(1)}
              style={{ flex:1,padding:"13px",borderRadius:20,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>
              上一步
            </button>
            <button onClick={()=>setStep(3)} disabled={!emergencyName||!emergencyPhone}
              style={{ flex:2,padding:"13px",borderRadius:20,border:"none",
                background:emergencyName&&emergencyPhone?T.rose:"#ccc",color:"#fff",fontSize:14,fontWeight:600,
                cursor:emergencyName&&emergencyPhone?"pointer":"not-allowed",fontFamily:"inherit" }}>
              下一步
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 確認送出 */}
      {step===3 && (
        <div>
          <Card style={{ padding:"16px",marginBottom:14 }}>
            <div style={{ fontSize:12,fontWeight:500,color:T.ink,marginBottom:10 }}>填寫內容摘要</div>
            {HEALTH_QUESTIONS.map(q=>(
              <div key={q.key} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.bd}`,fontSize:12 }}>
                <span style={{ color:T.i3 }}>{q.label}</span>
                <span style={{ color:answers[q.key]?"#C4726A":T.sage,fontWeight:500 }}>{answers[q.key]?"是":"否"}</span>
              </div>
            ))}
            {detail && (
              <div style={{ marginTop:8,padding:"8px 10px",background:T.bg,borderRadius:8,fontSize:11,color:T.i2,lineHeight:1.6 }}>
                補充：{detail}
              </div>
            )}
            {painAreas.length>0 && (
              <div style={{ marginTop:8,display:"flex",justifyContent:"space-between",fontSize:12 }}>
                <span style={{ color:T.i3 }}>留意部位</span>
                <span style={{ color:T.ink }}>{painAreas.join("、")}</span>
              </div>
            )}
            <div style={{ marginTop:8,display:"flex",justifyContent:"space-between",fontSize:12 }}>
              <span style={{ color:T.i3 }}>緊急聯絡人</span>
              <span style={{ color:T.ink }}>{emergencyName}（{emergencyPhone}）</span>
            </div>
          </Card>

          <label style={{ display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer",marginBottom:20 }}>
            <div onClick={()=>setAgreed(!agreed)}
              style={{ width:18,height:18,borderRadius:4,border:`1.5px solid ${agreed?T.rose:T.bd2}`,
                background:agreed?T.rs:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
              {agreed && <span style={{ color:T.rm,fontSize:11 }}>✓</span>}
            </div>
            <span style={{ fontSize:12,color:T.i2,lineHeight:1.6 }}>
              我確認以上資訊真實無誤，並了解教練將依此調整課程內容。本表單不取代專業醫療診斷或建議，如有身體不適仍應諮詢醫師。
            </span>
          </label>

          <div style={{ display:"flex",gap:10 }}>
            <button onClick={()=>setStep(2)}
              style={{ flex:1,padding:"13px",borderRadius:20,border:`1px solid ${T.bd2}`,background:"none",color:T.i2,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>
              上一步
            </button>
            <button onClick={()=>agreed&&setSubmitted(true)} disabled={!agreed}
              style={{ flex:2,padding:"13px",borderRadius:20,border:"none",
                background:agreed?T.sage:"#ccc",color:"#fff",fontSize:14,fontWeight:600,
                cursor:agreed?"pointer":"not-allowed",fontFamily:"inherit" }}>
              確認送出
            </button>
          </div>
        </div>
      )}
    </PageWrap>
  );
}
