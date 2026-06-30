import { useState } from "react";

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
const mono = { fontFamily:"'Courier New',monospace" };

// ── shared ────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display:"flex", gap:3, marginBottom:16, background:T.sb, borderRadius:20, padding:3, width:"fit-content", flexWrap:"wrap" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding:"5px 15px", borderRadius:18, fontSize:12,
          color: active===t.id ? T.ink : T.i3,
          background: active===t.id ? T.sf : "none",
          border:"none", cursor:"pointer", fontFamily:"inherit",
          fontWeight: active===t.id ? 500 : 400, transition:"all .15s"
        }}>{t.label}</button>
      ))}
    </div>
  );
}

function Tag({ children, bg, color, size=10 }) {
  return <span style={{ fontSize:size, padding:"2px 9px", borderRadius:10, background:bg, color, fontWeight:500, display:"inline-block", whiteSpace:"nowrap" }}>{children}</span>;
}

function Card({ title, subtitle, accent=T.rose, accentBg=T.rs, children, icon }) {
  return (
    <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:14, overflow:"hidden" }}>
      <div style={{ padding:"12px 16px", background:accentBg, borderBottom:`1px solid ${accent}30`, display:"flex", alignItems:"center", gap:9 }}>
        {icon && <span style={{ fontSize:16 }}>{icon}</span>}
        <div>
          <div style={{ fontSize:13, fontWeight:500, color:accent }}>{title}</div>
          {subtitle && <div style={{ fontSize:11, color:accent, opacity:.7, marginTop:2 }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ padding:14 }}>{children}</div>
    </div>
  );
}

function Field({ name, type, note, pk, fk, fkColor, indent=0 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0 3px " + (indent*20) + "px", fontSize:11 }}>
      <span style={{ width:20, fontSize:10, color:T.amb, fontWeight:700, flexShrink:0 }}>{pk?"PK":fk?"FK":""}</span>
      <span style={{ flex:1, ...mono, color: fkColor || T.ink }}>{name}</span>
      <span style={{ ...mono, fontSize:10, color:T.i3 }}>{type}</span>
      {note && <span style={{ fontSize:10, color:T.i3, fontStyle:"italic" }}>{note}</span>}
    </div>
  );
}

function Divider() { return <div style={{ height:1, background:T.bd, margin:"5px 0" }} />; }

function InfoBox({ icon, title, children, color=T.sm, bg=T.ss }) {
  return (
    <div style={{ background:bg, border:`1px solid ${color}30`, borderRadius:10, padding:"11px 14px", marginBottom:10 }}>
      <div style={{ fontSize:12, fontWeight:500, color, marginBottom:5 }}>{icon} {title}</div>
      <div style={{ fontSize:11, color, lineHeight:1.7, opacity:.9 }}>{children}</div>
    </div>
  );
}

function SqlBox({ children }) {
  return (
    <div style={{ background:"#1A1A1A", borderRadius:10, padding:"12px 14px", overflowX:"auto", marginBottom:10 }}>
      <pre style={{ ...mono, fontSize:10.5, color:"#D4CFC8", lineHeight:1.7, margin:0 }}>{children}</pre>
    </div>
  );
}

function Arrow({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, margin:"6px 0", paddingLeft:20 }}>
      <div style={{ width:2, height:16, background:T.bd2 }} />
      <span style={{ fontSize:10, color:T.i3, fontStyle:"italic" }}>{label}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 1: 架構總覽
// ══════════════════════════════════════════════════════════════
function OverviewTab() {
  const layers = [
    {
      icon:"🏢", label:"公司（Company）", color:T.rose, bg:T.rs,
      desc:"租戶根節點，所有資料都屬於某間公司",
      fields:["id, name, slug, plan, status"],
    },
    {
      icon:"📍", label:"場館（Venue）", color:T.amb, bg:T.ambs,
      desc:"公司旗下的分店，有獨立的地址與預約頁",
      fields:["id, company_id, name, address, slug, timezone"],
    },
    {
      icon:"🚪", label:"資源（Resource）", color:T.sage, bg:T.ss,
      desc:"場館內的可預約資源：教室、設備、人員，可組合",
      fields:["id, venue_id, name, type, capacity, tags(jsonb)"],
      highlight:true,
    },
    {
      icon:"📚", label:"課程模板（Course Template）", color:T.lav, bg:T.lavs,
      desc:"定義一類課程的規格，不含時間，只含規則",
      fields:["id, venue_id, name, booking_rules(jsonb), pricing_rules(jsonb), resource_requirements(jsonb)"],
      highlight:true,
    },
    {
      icon:"🗓", label:"場次（Session）", color:T.mist, bg:T.mists,
      desc:"課程模板的時間實例，一個場次消耗指定資源",
      fields:["id, template_id, start_at, end_at, status, overrides(jsonb)"],
    },
    {
      icon:"🎫", label:"方案（Plan）", color:T.coral, bg:T.corals,
      desc:"學員購買的資格包，定義可用額度與兌換規則",
      fields:["id, company_id, name, quota_type, quota_config(jsonb), eligibility(jsonb), price_config(jsonb)"],
      highlight:true,
    },
    {
      icon:"📋", label:"預留（Booking）", color:T.rose, bg:T.rs,
      desc:"學員佔用某場次的紀錄，記錄扣除的方案與額度",
      fields:["id, session_id, member_id, plan_instance_id, deduction(jsonb), status"],
    },
  ];

  return (
    <div>
      <InfoBox icon="💡" title="核心設計哲學" color={T.sm} bg={T.ss}>
        傳統設計把「私教 / 團體 / 場地」寫死在 type enum 裡，一旦出現新類型（月費制、計時制、組合課）就要改程式碼。<br/>
        Cora Times 的彈性架構把所有「規則」都放進 <strong>JSONB 欄位</strong>，系統只執行規則引擎，業者自己定義規則。
      </InfoBox>

      <div style={{ display:"flex", flexDirection:"column", gap:0, alignItems:"stretch" }}>
        {layers.map((l, i) => (
          <div key={l.label}>
            <div style={{
              background:T.sf, border:`1.5px solid ${l.highlight ? l.color : T.bd}`,
              borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"flex-start", gap:12,
              boxShadow: l.highlight ? `0 0 0 3px ${l.color}15` : "none",
            }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{l.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:l.color }}>{l.label}</span>
                  {l.highlight && <Tag bg={l.bg} color={l.color}>彈性核心</Tag>}
                </div>
                <div style={{ fontSize:11, color:T.i2, marginBottom:5 }}>{l.desc}</div>
                <div style={{ fontSize:10, ...mono, color:T.i3, background:T.bg, padding:"3px 8px", borderRadius:5 }}>{l.fields[0]}</div>
              </div>
            </div>
            {i < layers.length-1 && (
              <Arrow label={["1 公司 → N 場館","1 場館 → N 資源","1 場館 → N 課程模板","1 模板 → N 場次","課程模板 ↔ 方案（多對多 eligibility）","1 場次 + 1 學員 → 1 預留"][i]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 2: 資源設計
// ══════════════════════════════════════════════════════════════
function ResourceTab() {
  const examples = [
    {
      type:"room", icon:"🚪", label:"教室",
      color:T.sage, bg:T.ss,
      json:`{
  "name": "靜心室",
  "type": "room",
  "capacity": 2,
  "tags": {
    "equipment": ["Reformer x2", "鏡牆"],
    "open_hours": {
      "mon-fri": "06:00-22:00",
      "sat-sun": "08:00-20:00"
    },
    "min_booking_minutes": 50,
    "color": "#C4957A"
  }
}`},
    {
      type:"equipment", icon:"🏋", label:"器材（可獨立預約）",
      color:T.amb, bg:T.ambs,
      json:`{
  "name": "Reformer #3",
  "type": "equipment",
  "capacity": 1,
  "tags": {
    "location": "靜心室",
    "standalone_bookable": true,
    "min_booking_minutes": 30
  }
}`},
    {
      type:"staff", icon:"👤", label:"人員（教練即資源）",
      color:T.lav, bg:T.lavs,
      json:`{
  "name": "Sammi",
  "type": "staff",
  "capacity": 1,
  "tags": {
    "user_id": "user-sammi",
    "specialties": ["器械", "墊上"],
    "max_daily_sessions": 8,
    "break_between_sessions": 10
  }
}`},
    {
      type:"lane", icon:"🏊", label:"泳道（複數可同時使用）",
      color:T.mist, bg:T.mists,
      json:`{
  "name": "泳道 A",
  "type": "lane",
  "capacity": 1,
  "tags": {
    "pool_id": "main-pool",
    "concurrent_lanes": 6,
    "meter": 25
  }
}`},
  ];

  return (
    <div>
      <InfoBox icon="🔑" title="Resource 的設計關鍵" color={T.sm} bg={T.ss}>
        把教室、器材、教練都抽象成「Resource（資源）」。一個場次可以要求多種資源的組合：例如「1 對 1 器械課」需要「教練 Sammi」+ 「靜心室」。資源用 <strong>tags JSONB</strong> 存放任意屬性，不受 schema 限制。
      </InfoBox>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        {examples.map(ex => (
          <div key={ex.type} style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:12, overflow:"hidden" }}>
            <div style={{ padding:"9px 13px", background:ex.bg, borderBottom:`1px solid ${ex.color}30`, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:15 }}>{ex.icon}</span>
              <span style={{ fontSize:12, fontWeight:500, color:ex.color }}>{ex.label}</span>
            </div>
            <div style={{ background:"#1A1A1A", padding:"10px 13px" }}>
              <pre style={{ ...mono, fontSize:10, color:"#C9A96E", lineHeight:1.6, margin:0 }}>{ex.json}</pre>
            </div>
          </div>
        ))}
      </div>

      <Card title="資源組合：一個場次需要多種資源" icon="🔗" accent={T.rose} accentBg={T.rs}>
        <div style={{ fontSize:11, color:T.i2, marginBottom:8 }}>在課程模板的 resource_requirements 欄位定義：</div>
        <SqlBox>{`-- 「1對1器械皮拉提斯」需要的資源
resource_requirements = {
  "require_all": [
    { "type": "staff",      "count": 1, "tags": { "specialties": "器械" } },
    { "type": "room",       "count": 1, "tags": { "equipment": "Reformer" } }
  ],
  "auto_assign": true      -- 系統自動配對可用資源
}

-- 「小班共練」需要的資源
resource_requirements = {
  "require_all": [
    { "type": "staff", "count": 1 },
    { "type": "room",  "count": 1, "min_capacity": 4 }
  ]
}

-- 「泳道借用」：只需一條泳道，不需教練
resource_requirements = {
  "require_all": [
    { "type": "lane", "count": 1 }
  ]
}`}</SqlBox>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 3: 課程模板設計
// ══════════════════════════════════════════════════════════════
function CourseTab() {
  const examples = [
    {
      label:"1 對 1 私教（次數制）",
      icon:"🧘", color:T.rose, bg:T.rs,
      json:`{
  "name": "器械 1 對 1",
  "duration_minutes": 60,

  "booking_rules": {
    "min_participants": 1,
    "max_participants": 1,
    "advance_book_days": 14,
    "cancel_hours_before": 24,
    "allow_waitlist": false
  },

  "resource_requirements": {
    "require_all": [
      { "type": "staff", "count": 1 },
      { "type": "room",  "count": 1 }
    ]
  },

  "pricing_rules": {
    "deduction_mode": "count",   // 扣「次數」
    "deduct_amount": 1
  }
}`},
    {
      label:"小班共練（人頭制）",
      icon:"👥", color:T.lav, bg:T.lavs,
      json:`{
  "name": "墊上小班",
  "duration_minutes": 50,

  "booking_rules": {
    "min_participants": 1,
    "max_participants": 6,
    "advance_book_days": 7,
    "cancel_hours_before": 12,
    "allow_waitlist": true,
    "waitlist_max": 3
  },

  "pricing_rules": {
    "deduction_mode": "count",
    "deduct_amount": 1,
    "or_flat_fee": true     // 也可單堂付費
  }
}`},
    {
      label:"月費制（無限次課程）",
      icon:"📅", color:T.sage, bg:T.ss,
      json:`{
  "name": "月費瑜珈班",
  "duration_minutes": 60,

  "booking_rules": {
    "max_participants": 12,
    "cancel_hours_before": 6
  },

  "pricing_rules": {
    "deduction_mode": "none",    // 月費不扣次數
    "eligible_plan_types": ["subscription"]  // 只有月費方案可預約
  }
}`},
    {
      label:"計時制（空間借用）",
      icon:"⏱", color:T.amb, bg:T.ambs,
      json:`{
  "name": "靜心室借用",
  "duration_minutes": null,      // 彈性時長

  "booking_rules": {
    "min_duration_minutes": 30,
    "max_duration_minutes": 180,
    "slot_interval_minutes": 30,  // 每 30 分鐘一格
    "max_participants": 1
  },

  "pricing_rules": {
    "deduction_mode": "minutes",  // 扣「分鐘點數」
    "deduct_per_minute": 1
  }
}`},
  ];

  return (
    <div>
      <InfoBox icon="🔑" title="Course Template 的設計關鍵" color={T.rm} bg={T.rs}>
        課程模板不存時間，只存「這類課程的規則」。booking_rules 定義預約行為，pricing_rules 定義扣費模式，resource_requirements 定義需要哪些資源。業者新增一種課型，只需填 JSON，不需改程式碼。
      </InfoBox>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {examples.map(ex => (
          <div key={ex.label} style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:12, overflow:"hidden" }}>
            <div style={{ padding:"9px 13px", background:ex.bg, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:15 }}>{ex.icon}</span>
              <span style={{ fontSize:12, fontWeight:500, color:ex.color }}>{ex.label}</span>
            </div>
            <div style={{ background:"#1A1A1A", padding:"10px 13px" }}>
              <pre style={{ ...mono, fontSize:9.5, color:"#C9A96E", lineHeight:1.6, margin:0 }}>{ex.json}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 4: 方案設計
// ══════════════════════════════════════════════════════════════
function PlanTab() {
  const examples = [
    {
      label:"次數方案（最常見）",
      icon:"🎫", color:T.rose, bg:T.rs,
      json:`{
  "name": "器械一對一 12 次",
  "quota_type": "count",
  "quota_config": {
    "total": 12,
    "per_booking": 1         // 每次預約扣 1
  },
  "eligibility": {
    "course_ids": ["course-a", "course-b"],  // 哪些課程可用
    "or_tags": ["type:solo"]                 // 或：標籤符合的課程
  },
  "validity": {
    "type": "from_purchase",
    "days": null              // null = 無期限
  },
  "price_config": {
    "price": 17280,
    "original_price": 22800,  // 劃線價
    "max_purchase": 1
  }
}`},
    {
      label:"月費訂閱制",
      icon:"📅", color:T.sage, bg:T.ss,
      json:`{
  "name": "無限團體月費",
  "quota_type": "subscription",
  "quota_config": {
    "billing_cycle": "monthly",
    "unlimited": true,
    "or_cap_per_week": 5     // 每週上限 5 堂
  },
  "eligibility": {
    "or_tags": ["type:group"]  // 只能上團體課
  },
  "validity": {
    "type": "subscription",
    "auto_renew": true
  },
  "price_config": {
    "price": 3800,
    "billing": "monthly"
  }
}`},
    {
      label:"點數方案（跨課程通用）",
      icon:"💎", color:T.amb, bg:T.ambs,
      json:`{
  "name": "彈性點數 100 點",
  "quota_type": "points",
  "quota_config": {
    "total_points": 100
  },
  "eligibility": {
    "all_courses": true        // 所有課程皆可用
  },
  "price_per_deduction": {
    "type:solo":  10,          // 私教課扣 10 點
    "type:group":  5,          // 團體課扣 5 點
    "type:space":  3           // 空間借用扣 3 點/30min
  },
  "validity": {
    "type": "from_purchase",
    "days": 180
  },
  "price_config": {
    "price": 4500
  }
}`},
    {
      label:"體驗 + 次數組合包",
      icon:"🎁", color:T.lav, bg:T.lavs,
      json:`{
  "name": "新生優惠包",
  "quota_type": "bundle",
  "quota_config": {
    "components": [
      { "type": "count", "amount": 1, "tag": "type:trial" },
      { "type": "count", "amount": 3, "tag": "type:solo"  }
    ]
  },
  "eligibility": {
    "first_purchase_only": true   // 只能買一次
  },
  "validity": {
    "type": "from_first_use",
    "days": 60
  },
  "price_config": {
    "price": 2999,
    "original_price": 6700
  }
}`},
  ];

  return (
    <div>
      <InfoBox icon="🔑" title="Plan 的設計關鍵" color={T.coral} bg={T.corals}>
        方案的核心是 quota_type + quota_config（定義「有多少額度」）和 eligibility（定義「可用於哪些課程」）。deduction_mode 在課程模板端定義，方案端只管「有沒有足夠額度」。兩者分離，讓一張方案可以同時適用多種課程類型。
      </InfoBox>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {examples.map(ex => (
          <div key={ex.label} style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:12, overflow:"hidden" }}>
            <div style={{ padding:"9px 13px", background:ex.bg, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:15 }}>{ex.icon}</span>
              <span style={{ fontSize:12, fontWeight:500, color:ex.color }}>{ex.label}</span>
            </div>
            <div style={{ background:"#1A1A1A", padding:"10px 13px" }}>
              <pre style={{ ...mono, fontSize:9.5, color:"#C9A96E", lineHeight:1.6, margin:0 }}>{ex.json}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 5: 扣費引擎
// ══════════════════════════════════════════════════════════════
function DeductionTab() {
  return (
    <div>
      <InfoBox icon="⚙" title="扣費引擎：課程模板 + 方案的交叉邏輯" color={T.sm} bg={T.ss}>
        學員預約時，系統執行「扣費引擎」：從課程模板讀取 deduction_mode，從方案實例讀取可用額度，兩者匹配後才允許預約並扣除。
      </InfoBox>

      <Card title="扣費流程" icon="🔄" accent={T.rose} accentBg={T.rs}>
        <SqlBox>{`-- 學員點「預約」時，系統執行以下邏輯

FUNCTION check_and_deduct(session_id, member_id, plan_instance_id):

  1. 取得 session 的 course_template
     → 讀取 pricing_rules.deduction_mode
     → 可能是 "count" | "minutes" | "points" | "none"

  2. 取得 plan_instance 的方案設定
     → 讀取 quota_type, quota_config, eligibility

  3. 驗證資格 (eligibility check)
     → 此課程是否在 course_ids 清單內？
     → 或 課程 tags 是否符合 or_tags 規則？

  4. 驗證額度是否足夠
     → count:   remain_count >= deduct_amount
     → minutes: remain_minutes >= session.duration
     → points:  remain_points >= price_per_deduction[course.tag]
     → none:    直接通過（月費制）

  5. 建立 booking，寫入 deduction 記錄
     deduction = {
       "mode": "count",
       "amount": 1,
       "before": 8,
       "after":  7,
       "plan_instance_id": "...",
       "reversed_at": null      -- 取消預約時用
     }

  6. 更新 plan_instance 的剩餘額度
     → remain_count -= deduct_amount`}</SqlBox>
      </Card>

      <Card title="取消預約：額度退還邏輯" icon="↩" accent={T.sage} accentBg={T.ss}>
        <SqlBox>{`-- 取消預約時，根據 booking_rules 決定是否退還

FUNCTION cancel_booking(booking_id, cancelled_by):

  1. 計算距離上課時間
     hours_until_session = session.start_at - NOW()

  2. 讀取 course_template.booking_rules.cancel_hours_before
     cancel_deadline = 24 (小時)

  3. 退還判斷
     IF hours_until_session >= cancel_deadline:
       → 全額退還（更新 remain_count + 1）
       → booking.deduction.reversed_at = NOW()

     ELSE IF cancelled_by == "coach" OR "system":
       → 強制全額退還（課程停課補償）

     ELSE:
       → 不退還（已過截止時間）
       → 可加入「逾期取消扣款」規則（booking_rules.late_cancel_penalty）`}</SqlBox>
      </Card>

      <Card title="複雜情境：點數方案跨課程計算" icon="💡" accent={T.amb} accentBg={T.ambs}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
          {[
            { label:"私教課", points:"扣 10 點/堂", color:T.rose, bg:T.rs },
            { label:"團體課", points:"扣 5 點/堂",  color:T.lav,  bg:T.lavs },
            { label:"空間借用",points:"扣 3 點/30分",color:T.amb,bg:T.ambs },
          ].map(x => (
            <div key={x.label} style={{ background:x.bg, borderRadius:9, padding:"10px 12px", textAlign:"center" }}>
              <div style={{ fontSize:12, fontWeight:500, color:x.color, marginBottom:4 }}>{x.label}</div>
              <div style={{ fontSize:11, color:x.color, opacity:.8 }}>{x.points}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:11, color:T.i2, lineHeight:1.7 }}>
          同一張「100 點方案」可以跨課程類型使用，不同課程依 <code style={{ background:T.bg, padding:"0 4px", borderRadius:3, ...mono }}>price_per_deduction</code> 欄位扣不同點數。業者可自訂任意比例，系統照規則執行。
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 6: 真實場館對比
// ══════════════════════════════════════════════════════════════
function RealWorldTab() {
  const venues = [
    {
      icon:"🧘", name:"皮拉提斯工作室", color:T.rose, bg:T.rs,
      resources:"教練（staff）+ 器械教室（room）",
      courses:"1 對 1 私教（deduction: count）\n小班共練（deduction: count）\n體驗課（deduction: count, first_only）",
      plans:"次數方案（6次/12次）\n體驗方案（1次）\n點數方案（跨課型）",
      special:"resource_requirements 組合教練 + 教室，衝突自動偵測",
    },
    {
      icon:"🏊", name:"游泳池 / 水上場館", color:T.mist, bg:T.mists,
      resources:"泳道（lane）+ 教練（staff，選配）",
      courses:"自由泳道借用（deduction: minutes）\n游泳私教（deduction: count）\n游泳課（deduction: count）",
      plans:"計時點數（分鐘制）\n次數方案\n月費無限游",
      special:"泳道 concurrent_lanes 設定同時可開放幾條；月費方案 quota: unlimited + cap_per_week",
    },
    {
      icon:"💃", name:"舞蹈 / 健身教室", color:T.lav, bg:T.lavs,
      resources:"舞蹈教室（room）+ 教練（staff）",
      courses:"團體舞蹈班（deduction: none → 月費）\n私人舞蹈課（deduction: count）",
      plans:"月費訂閱（無限團體課）\n次數方案（私教用）",
      special:"月費方案 eligibility 限定 type:group 課程；私教課只能用次數方案",
    },
    {
      icon:"🏋", name:"健身房 / 重訓中心", color:T.amb, bg:T.ambs,
      resources:"健身區（zone）+ 器材（equipment）+ 教練（staff）",
      courses:"場地入場（deduction: none → 月費）\n個人教練課（deduction: count）\n器材借用（deduction: minutes）",
      plans:"月費入場（無限次進場）\n私教方案（次數制）\n器材時數包",
      special:"入場券課程 resource: zone（容量50人），月費方案直接通過 eligibility",
    },
  ];

  return (
    <div>
      <InfoBox icon="✅" title="同一套架構，支援所有場館類型" color={T.sm} bg={T.ss}>
        只要調整 JSONB 欄位的規則，不需改程式碼，即可支援完全不同的營運模式。以下展示四種典型場館如何使用同一套資料結構。
      </InfoBox>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {venues.map(v => (
          <div key={v.name} style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:14, overflow:"hidden" }}>
            <div style={{ padding:"10px 14px", background:v.bg, borderBottom:`1px solid ${v.color}30`, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:18 }}>{v.icon}</span>
              <span style={{ fontSize:13, fontWeight:500, color:v.color }}>{v.name}</span>
            </div>
            <div style={{ padding:"12px 14px" }}>
              {[["資源配置", v.resources], ["課程類型", v.courses], ["方案設計", v.plans], ["特殊設定", v.special]].map(([l,val]) => (
                <div key={l} style={{ marginBottom:8 }}>
                  <div style={{ fontSize:10, color:T.i3, letterSpacing:".06em", marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:11, color:T.i2, lineHeight:1.6, whiteSpace:"pre-line" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 7: Schema 總覽
// ══════════════════════════════════════════════════════════════
function SchemaTab() {
  return (
    <div>
      <SqlBox>{`-- ① 資源（教室 / 器材 / 教練 / 泳道...全部統一）
CREATE TABLE resources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id    UUID NOT NULL REFERENCES venues(id),
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(30) NOT NULL,   -- 'room' | 'equipment' | 'staff' | 'lane' | 'zone'
  capacity    INT NOT NULL DEFAULT 1,
  tags        JSONB NOT NULL DEFAULT '{}',
  -- tags 可存：equipment、open_hours、color、min_booking_minutes 等任意屬性
  is_active   BOOLEAN NOT NULL DEFAULT true
);`}</SqlBox>

      <SqlBox>{`-- ② 課程模板（只存規則，不存時間）
CREATE TABLE course_templates (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id                UUID NOT NULL REFERENCES venues(id),
  name                    VARCHAR(100) NOT NULL,
  description             TEXT,
  tags                    JSONB NOT NULL DEFAULT '{}',
  -- e.g. {"type":"solo","category":"pilates"}

  duration_minutes        INT,          -- null = 彈性時長
  booking_rules           JSONB NOT NULL DEFAULT '{}',
  -- min/max_participants, advance_book_days, cancel_hours_before,
  -- allow_waitlist, waitlist_max, late_cancel_penalty ...

  resource_requirements   JSONB NOT NULL DEFAULT '{}',
  -- require_all: [{type, count, tags}]
  -- auto_assign: bool

  pricing_rules           JSONB NOT NULL DEFAULT '{}',
  -- deduction_mode: "count"|"minutes"|"points"|"none"
  -- deduct_amount, deduct_per_minute, eligible_plan_types ...

  display_color           VARCHAR(7),
  is_active               BOOLEAN NOT NULL DEFAULT true
);`}</SqlBox>

      <SqlBox>{`-- ③ 方案定義（業者設定，不含學員持有狀態）
CREATE TABLE plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id),
  name            VARCHAR(100) NOT NULL,

  quota_type      VARCHAR(20) NOT NULL,
  -- 'count' | 'points' | 'minutes' | 'subscription' | 'bundle' | 'unlimited'

  quota_config    JSONB NOT NULL,
  -- count:        { "total": 12, "per_booking": 1 }
  -- points:       { "total_points": 100 }
  -- subscription: { "billing_cycle": "monthly", "cap_per_week": 5 }
  -- bundle:       { "components": [...] }

  eligibility     JSONB NOT NULL DEFAULT '{}',
  -- course_ids: [...], or_tags: [...], all_courses: bool
  -- first_purchase_only: bool

  validity        JSONB NOT NULL,
  -- type: "from_purchase"|"from_first_use"|"subscription"
  -- days: 180 | null

  price_config    JSONB NOT NULL,
  -- price, original_price, max_purchase, billing: "once"|"monthly"

  is_visible      BOOLEAN NOT NULL DEFAULT true,
  sort_order      INT
);`}</SqlBox>

      <SqlBox>{`-- ④ 學員持有的方案實例
CREATE TABLE member_plans (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id        UUID NOT NULL REFERENCES users(id),
  plan_id          UUID NOT NULL REFERENCES plans(id),
  company_id       UUID NOT NULL REFERENCES companies(id),

  -- 當前可用額度（依 quota_type 不同欄位有值）
  remain_count     INT,           -- count 方案用
  remain_points    INT,           -- points 方案用
  remain_minutes   INT,           -- minutes 方案用

  status           VARCHAR(20) NOT NULL DEFAULT 'active',
  -- 'active' | 'expired' | 'suspended' | 'exhausted'

  activated_at     TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ,   -- null = 無期限
  purchased_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);`}</SqlBox>

      <SqlBox>{`-- ⑤ 預約與扣費記錄
CREATE TABLE bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        UUID NOT NULL REFERENCES sessions(id),
  member_id         UUID NOT NULL REFERENCES users(id),
  member_plan_id    UUID REFERENCES member_plans(id),  -- null = 免費/現場付款

  deduction         JSONB,
  -- { "mode":"count", "amount":1, "before":8, "after":7, "reversed_at":null }
  -- { "mode":"points","amount":10,"before":90,"after":80 }
  -- { "mode":"none"   -- 月費方案 }

  status            VARCHAR(20) NOT NULL DEFAULT 'confirmed',
  -- 'pending' | 'confirmed' | 'attended' | 'absent' | 'cancelled'

  attended_at       TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  cancel_reason     VARCHAR(100),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);`}</SqlBox>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════
export default function CoraFlexArch() {
  const [tab, setTab] = useState("overview");
  const TABS = [
    { id:"overview",   label:"架構總覽" },
    { id:"resource",   label:"資源設計" },
    { id:"course",     label:"課程模板" },
    { id:"plan",       label:"方案設計" },
    { id:"deduction",  label:"扣費引擎" },
    { id:"realworld",  label:"場館對比" },
    { id:"schema",     label:"Schema" },
  ];

  return (
    <div style={{ background:T.bg, minHeight:"100vh", padding:20, fontFamily:"'Noto Sans TC',sans-serif" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:300, color:T.ink, letterSpacing:".06em" }}>Cora Times — 彈性架構設計</div>
        <div style={{ fontSize:12, color:T.i3, marginTop:3 }}>公司 / 場館 / 資源・課程模板 / 方案 / 扣費引擎</div>
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "overview"  && <OverviewTab />}
      {tab === "resource"  && <ResourceTab />}
      {tab === "course"    && <CourseTab />}
      {tab === "plan"      && <PlanTab />}
      {tab === "deduction" && <DeductionTab />}
      {tab === "realworld" && <RealWorldTab />}
      {tab === "schema"    && <SchemaTab />}
    </div>
  );
}
