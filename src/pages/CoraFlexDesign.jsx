import { useNavigate } from "react-router-dom";
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

// ── Primitives ───────────────────────────────────────────────
function Tabs({ items, active, onChange }) {
  return (
    <div style={{ display:"flex", gap:3, marginBottom:18, background:T.sb, borderRadius:20, padding:3, width:"fit-content" }}>
      {items.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding:"5px 16px", borderRadius:18, fontSize:12,
          color:active===t.id?T.ink:T.i3,
          background:active===t.id?T.sf:"none",
          border:"none", cursor:"pointer", fontFamily:"inherit",
          fontWeight:active===t.id?500:400, transition:"all .15s"
        }}>{t.label}</button>
      ))}
    </div>
  );
}

function Section({ title, sub, children }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:14, fontWeight:500, color:T.ink, letterSpacing:".04em" }}>{title}</div>
        {sub && <div style={{ fontSize:12, color:T.i3, marginTop:3 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function InfoBox({ title, color=T.sage, bg=T.ss, children }) {
  return (
    <div style={{ background:bg, border:`1px solid ${color}40`, borderLeft:`3px solid ${color}`, borderRadius:10, padding:"11px 14px", marginTop:8 }}>
      {title && <div style={{ fontSize:11, fontWeight:500, color, marginBottom:5, letterSpacing:".04em" }}>{title}</div>}
      <div style={{ fontSize:12, color:T.i2, lineHeight:1.7 }}>{children}</div>
    </div>
  );
}

function Tag({ children, bg, color, sm }) {
  return (
    <span style={{
      fontSize: sm ? 10 : 11, padding: sm ? "1px 7px" : "2px 9px",
      borderRadius:12, background:bg||T.sb, color:color||T.i2,
      fontWeight:500, display:"inline-block", whiteSpace:"nowrap"
    }}>{children}</span>
  );
}

function TableCard({ icon, name, badge, headBg, headColor, borderColor, columns }) {
  return (
    <div style={{ borderRadius:12, overflow:"hidden", minWidth:190, flexShrink:0,
      boxShadow:"0 2px 8px rgba(58,53,48,.07)", border:`1.5px solid ${borderColor}`, background:T.sf }}>
      <div style={{ padding:"9px 13px", background:headBg, display:"flex", alignItems:"center", gap:7 }}>
        <span style={{ fontSize:14 }}>{icon}</span>
        <span style={{ fontSize:12, fontWeight:500, color:headColor, letterSpacing:".02em" }}>{name}</span>
        <Tag sm bg={borderColor} color="#fff">{badge}</Tag>
      </div>
      <div style={{ padding:"5px 0" }}>
        {columns.map((c, i) => c.divider
          ? <div key={i} style={{ height:1, margin:"3px 13px", background:`${T.bd}` }} />
          : <div key={i} style={{ display:"flex", alignItems:"center", padding:"3px 13px", fontSize:11 }}>
              <span style={{ width:18, fontSize:10, color:T.amb, fontWeight:700 }}>{c.key||""}</span>
              <span style={{ flex:1, ...mono, fontSize:10.5, color:c.fk||T.ink }}>{c.name}</span>
              <span style={{ fontSize:10, opacity:.55, ...mono, marginLeft:4 }}>{c.type}</span>
              {c.note && <span style={{ fontSize:9.5, marginLeft:5, color:T.i3 }}>{c.note}</span>}
            </div>
        )}
      </div>
    </div>
  );
}

function Arrow({ label, vertical }) {
  if (vertical) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"2px 0" }}>
      <div style={{ width:1.5, height:16, background:T.bd2 }} />
      {label && <div style={{ fontSize:9, color:T.i3, letterSpacing:".04em", whiteSpace:"nowrap" }}>{label}</div>}
      <div style={{ width:1.5, height:8, background:T.bd2 }} />
    </div>
  );
  return (
    <div style={{ display:"flex", alignItems:"center", gap:2, color:T.sand3, flexShrink:0, marginTop:16 }}>
      {label && <span style={{ fontSize:9, color:T.i3, transform:"rotate(-90deg)", transformOrigin:"center" }}>{label}</span>}
      <span style={{ fontSize:16 }}>→</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 1 — 空間彈性設計
// ══════════════════════════════════════════════════════════════
function SpaceTab() {
  const [expanded, setExpanded] = useState(null);

  const concepts = [
    {
      id:"inherit",
      icon:"🔗", color:T.rose, bg:T.rs,
      title:"三層繼承覆寫",
      sub:"公司設定預設值 → 場館可覆寫 → 教室再細化",
      detail:`
公司層（Company）設定品牌預設值，例如：預約提前天數 = 7 天、取消截止 = 24 小時。
場館層（Venue）可以「繼承公司預設，或個別覆寫」，例如旗艦店開放提前 14 天預約，分館維持 7 天。
教室層（Room）可以設定「特殊開放時段」、「可容許的課程類型」、「同時使用上限（occupancy）」。
關鍵欄位：每個可覆寫的設定都有 override_*  欄位，null = 繼承上層，有值 = 套用自身設定。`
    },
    {
      id:"occupancy",
      icon:"📐", color:T.sage, bg:T.ss,
      title:"格位制（Occupancy）",
      sub:"教室不只有「人數上限」，還有格位邏輯",
      detail:`
傳統只有「最多幾人」，但現實中一台 Reformer 要佔 2 格，一個墊子佔 1 格。
rooms 表加入 total_slots（格位總數），courses 表加入 slots_required（每人佔幾格）。
預約時系統計算：已用格位 + slots_required ≤ total_slots，而非只算人數。
這讓「一台器械同時上 1 對 2」、「器械課和墊上課共用教室」等情境都能正確處理。`
    },
    {
      id:"multiroom",
      icon:"🔀", color:T.lav, bg:T.lavs,
      title:"跨教室 / 合併場次",
      sub:"一個場次可橫跨多間教室",
      detail:`
大型工作坊或特殊活動可能需要打通兩間教室。
session_rooms（中間表）讓一個 session 關聯多個 room，每間教室各自提供格位數。
總可用格位 = Σ(各教室格位)，系統自動合計。
這個設計同時支援未來「線上課程」（room_id = null, is_online = true）。`
    },
  ];

  return (
    <div>
      {/* ERD */}
      <Section title="空間層級 ERD" sub="Company → Venue → Room → Session（課程場次）">
        <div style={{ display:"flex", alignItems:"flex-start", gap:10, overflowX:"auto", paddingBottom:4 }}>
          <TableCard icon="🏢" name="companies" badge="公司" headBg={T.rs} headColor={T.rm} borderColor={T.rose} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { name:"name", type:"varchar" },
            { divider:true },
            { name:"default_booking_advance_days", type:"int", note:"預設提前天數" },
            { name:"default_cancel_cutoff_hours",  type:"int", note:"預設取消截止" },
            { name:"default_max_per_member",       type:"int", note:"每人可預約上限" },
          ]} />
          <Arrow />
          <TableCard icon="📍" name="venues" badge="場館" headBg={T.ambs} headColor={T.amb} borderColor={T.amb} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"company_id", type:"uuid", fk:T.rose },
            { name:"name / address / slug", type:"" },
            { divider:true },
            { name:"override_booking_advance", type:"int?",  note:"null=繼承公司" },
            { name:"override_cancel_cutoff",   type:"int?",  note:"null=繼承公司" },
            { name:"override_max_per_member",  type:"int?",  note:"null=繼承公司" },
            { name:"timezone",                 type:"varchar",note:"時區設定" },
          ]} />
          <Arrow />
          <TableCard icon="🚪" name="rooms" badge="教室" headBg={T.mists} headColor={T.mist} borderColor={T.mist} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"venue_id", type:"uuid", fk:T.amb },
            { name:"name / color_hex", type:"" },
            { name:"capacity",    type:"int",  note:"人數上限" },
            { name:"total_slots", type:"int",  note:"格位總數" },
            { divider:true },
            { name:"open_hours",  type:"jsonb", note:"開放時段" },
            { name:"allowed_course_types", type:"jsonb", note:"允許課程類型" },
            { name:"equipment",   type:"text[]", note:"設備標籤" },
            { name:"is_active",   type:"bool" },
          ]} />
          <Arrow />
          <TableCard icon="📅" name="sessions" badge="場次" headBg={T.ss} headColor={T.sm} borderColor={T.sage} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"course_id", type:"uuid" },
            { key:"FK", name:"room_id",   type:"uuid?", note:"可為 null（線上）" },
            { key:"FK", name:"coach_id",  type:"uuid" },
            { name:"start_at / end_at", type:"timestamptz" },
            { divider:true },
            { name:"max_capacity",   type:"int",  note:"覆寫課程預設" },
            { name:"slots_required", type:"int",  note:"此場次每人佔幾格" },
            { name:"is_online",      type:"bool" },
            { name:"status",         type:"enum", note:"active/paused/cancelled" },
          ]} />
        </div>
      </Section>

      {/* session_rooms 中間表 */}
      <Section title="跨教室中間表">
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          <TableCard icon="🔀" name="session_rooms" badge="中間表" headBg={T.lavs} headColor={T.lav} borderColor={T.lav} columns={[
            { key:"FK", name:"session_id", type:"uuid", fk:T.sage },
            { key:"FK", name:"room_id",    type:"uuid", fk:T.mist },
            { name:"slot_allocation", type:"int", note:"此教室提供幾格" },
          ]} />
          <InfoBox title="使用場景">
            大型工作坊打通兩間教室 → 一個 session 關聯兩筆 session_rooms。<br/>
            總格位 = 靜心室(4格) + 舒活室(6格) = 10 格。<br/>
            一般課程只用單一教室，不需此表（session.room_id 直接填入即可）。
          </InfoBox>
        </div>
      </Section>

      {/* 設計概念 */}
      <Section title="三個核心設計概念">
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {concepts.map(c => (
            <div key={c.id} style={{ border:`1px solid ${T.bd}`, borderRadius:12, overflow:"hidden", background:T.sf }}>
              <div onClick={() => setExpanded(expanded===c.id?null:c.id)}
                style={{ padding:"11px 15px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", background: expanded===c.id ? c.bg : T.sf }}>
                <span style={{ fontSize:16 }}>{c.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color: expanded===c.id ? c.color : T.ink }}>{c.title}</div>
                  <div style={{ fontSize:11, color:T.i3, marginTop:1 }}>{c.sub}</div>
                </div>
                <span style={{ fontSize:12, color:T.i3 }}>{expanded===c.id?"▲":"▼"}</span>
              </div>
              {expanded===c.id && (
                <div style={{ padding:"12px 15px 14px", borderTop:`1px solid ${T.bd}`, fontSize:12, color:T.i2, lineHeight:1.8, background:T.bg }}>
                  {c.detail.trim().split("\n").map((line, i) => (
                    <div key={i} style={{ marginBottom: line.trim()==="" ? 4 : 2 }}>
                      {line.trim().startsWith("關鍵欄位") || line.trim().startsWith("總可用") || line.trim().startsWith("這個設計") || line.trim().startsWith("這讓")
                        ? <span style={{ color:c.color, fontWeight:500 }}>{line.trim()}</span>
                        : line.trim()
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 2 — 課程彈性設計
// ══════════════════════════════════════════════════════════════
function CourseTab() {
  return (
    <div>
      <Section title="課程架構 ERD" sub="課程定義（Course Template）→ 課程場次（Session）→ 預留（Booking）">
        <div style={{ display:"flex", alignItems:"flex-start", gap:10, overflowX:"auto", paddingBottom:4 }}>
          <TableCard icon="📚" name="course_templates" badge="課程定義" headBg={T.rs} headColor={T.rm} borderColor={T.rose} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"company_id", type:"uuid", fk:T.rose },
            { name:"name / description", type:"" },
            { name:"type", type:"enum", note:"solo/group/space" },
            { divider:true },
            { name:"default_duration_min",  type:"int",  note:"預設時長（分鐘）" },
            { name:"default_capacity",      type:"int",  note:"預設人數上限" },
            { name:"default_slots_required",type:"int",  note:"每人佔幾格" },
            { name:"color_hex",             type:"varchar" },
            { name:"tags",                  type:"text[]", note:"分類標籤" },
            { name:"is_visible",            type:"bool" },
          ]} />
          <Arrow label="實例化" />
          <TableCard icon="📅" name="sessions" badge="場次" headBg={T.ss} headColor={T.sm} borderColor={T.sage} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"course_id",  type:"uuid", fk:T.rose },
            { key:"FK", name:"room_id",    type:"uuid", fk:T.mist },
            { key:"FK", name:"coach_id",   type:"uuid" },
            { name:"start_at / end_at",   type:"timestamptz" },
            { divider:true },
            { name:"override_capacity",   type:"int?",  note:"null=繼承課程" },
            { name:"override_slots",      type:"int?",  note:"null=繼承課程" },
            { name:"is_online",           type:"bool" },
            { name:"status",              type:"enum" },
            { name:"recurrence_id",       type:"uuid?", note:"循環排程群組" },
          ]} />
          <Arrow label="預留" />
          <TableCard icon="🎫" name="bookings" badge="預留" headBg={T.lavs} headColor={T.lav} borderColor={T.lav} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"session_id",     type:"uuid", fk:T.sage },
            { key:"FK", name:"member_id",      type:"uuid" },
            { key:"FK", name:"member_pass_id", type:"uuid?", fk:T.amb, note:"用哪張方案" },
            { divider:true },
            { name:"status",       type:"enum", note:"confirmed/cancelled/attended" },
            { name:"checked_in_at",type:"timestamptz?" },
            { name:"cancelled_at", type:"timestamptz?" },
            { name:"cancel_reason",type:"text?" },
            { name:"deducted",     type:"bool",  note:"已扣次/點" },
          ]} />
        </div>
      </Section>

      <Section title="循環排程" sub="recurrences 表管理循環群組，修改時可選擇只改此場次或改整個系列">
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          <TableCard icon="🔄" name="recurrences" badge="循環群組" headBg={T.ambs} headColor={T.amb} borderColor={T.amb} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"course_id", type:"uuid" },
            { name:"rule",       type:"jsonb", note:"rrule 字串" },
            { name:"starts_on",  type:"date" },
            { name:"ends_on",    type:"date?" },
            { name:"is_active",  type:"bool" },
          ]} />
          <InfoBox title="修改邏輯（三選一）" color={T.amb} bg={T.ambs}>
            <b>只改此場次</b>：在該 session 上直接 override 欄位，recurrence_id 保留原樣。<br/>
            <b>改此場次之後的全部</b>：舊 recurrence ends_on 設為今天，產生新 recurrence 從明天開始。<br/>
            <b>改整個系列</b>：更新所有同 recurrence_id 的 sessions（或只更新未來場次）。
          </InfoBox>
        </div>
      </Section>

      <InfoBox title="為什麼課程定義和場次分開？" color={T.rose} bg={T.rs}>
        <b>Course Template（課程定義）</b>是「模板」，只存不變的屬性：名稱、類型、預設時長、顏色。<br/>
        <b>Session（場次）</b>是「排班結果」，每次排課都是一個 session，可覆寫時長、容量、教室。<br/>
        好處：同一門課「器械一對一」可以在不同場館、不同教室、不同時長排班，但都共用同一個課程定義，報表統計時可以聚合分析。
      </InfoBox>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 3 — 方案彈性設計
// ══════════════════════════════════════════════════════════════
function PassTab() {
  const passTypes = [
    { type:"count",    label:"次數方案",  color:T.rose,  bg:T.rs,    desc:"買 N 次，不限時間，每次扣一次（或自訂扣幾次）" },
    { type:"period",   label:"期間方案",  color:T.sage,  bg:T.ss,    desc:"在指定期間內無限次（或有限次）使用" },
    { type:"points",   label:"點數方案",  color:T.amb,   bg:T.ambs,  desc:"買 N 點，不同課程扣不同點數，彈性最高" },
    { type:"trial",    label:"體驗方案",  color:T.lav,   bg:T.lavs,  desc:"限購一次、限定課程種類的入門方案" },
    { type:"bundle",   label:"組合方案",  color:T.mist,  bg:T.mists, desc:"多種課程打包，各類別分別計次" },
  ];

  return (
    <div>
      {/* ERD */}
      <Section title="方案架構 ERD" sub="方案定義（Pass Template）→ 學員持有方案（Member Pass）→ 扣除紀錄（Pass Ledger）">
        <div style={{ display:"flex", alignItems:"flex-start", gap:10, overflowX:"auto", paddingBottom:4 }}>
          <TableCard icon="🎫" name="pass_templates" badge="方案定義" headBg={T.rs} headColor={T.rm} borderColor={T.rose} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"company_id",  type:"uuid" },
            { name:"name / description",   type:"" },
            { name:"type",                 type:"enum", note:"count/period/points/trial/bundle" },
            { divider:true },
            { name:"price",                type:"int",  note:"售價（分）" },
            { name:"original_price",       type:"int?", note:"原價（促銷用）" },
            { name:"total_count",          type:"int?", note:"次數（次數方案）" },
            { name:"total_points",         type:"int?", note:"點數（點數方案）" },
            { name:"valid_days",           type:"int?", note:"購後有效天數" },
            { name:"valid_from / valid_to", type:"date?",note:"固定區間" },
            { name:"purchase_limit",       type:"int?", note:"每人限購幾次" },
            { name:"sales_limit",          type:"int?", note:"總銷售上限" },
            { name:"course_rules",         type:"jsonb", note:"課程限制規則" },
            { name:"deduct_rules",         type:"jsonb", note:"扣除規則" },
            { name:"is_visible",           type:"bool" },
            { name:"sort_order",           type:"int" },
          ]} />
          <Arrow label="購買" />
          <TableCard icon="💳" name="member_passes" badge="學員方案" headBg={T.ambs} headColor={T.amb} borderColor={T.amb} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"member_id",        type:"uuid" },
            { key:"FK", name:"pass_template_id", type:"uuid", fk:T.rose },
            { key:"FK", name:"payment_id",       type:"uuid?", fk:T.sage },
            { divider:true },
            { name:"status",           type:"enum", note:"active/expired/depleted/frozen" },
            { name:"remain_count",     type:"int?",  note:"剩餘次數" },
            { name:"remain_points",    type:"int?",  note:"剩餘點數" },
            { name:"activated_at",     type:"timestamptz?" },
            { name:"expires_at",       type:"timestamptz?" },
            { name:"snapshot",         type:"jsonb",  note:"購買時方案快照" },
          ]} />
          <Arrow label="扣除" />
          <TableCard icon="📒" name="pass_ledger" badge="扣除帳本" headBg={T.ss} headColor={T.sm} borderColor={T.sage} columns={[
            { key:"PK", name:"id", type:"uuid" },
            { key:"FK", name:"member_pass_id", type:"uuid", fk:T.amb },
            { key:"FK", name:"booking_id",     type:"uuid?", fk:T.lav },
            { name:"type",        type:"enum", note:"deduct/refund/adjust/bonus" },
            { name:"amount",      type:"int",  note:"次數或點數（正負）" },
            { name:"note",        type:"text?" },
            { name:"created_by",  type:"uuid",  note:"系統或管理員" },
            { name:"created_at",  type:"timestamptz" },
          ]} />
        </div>
      </Section>

      {/* 五種方案類型 */}
      <Section title="五種方案類型">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
          {passTypes.map(p => (
            <div key={p.type} style={{ background:p.bg, border:`1.5px solid ${p.color}30`, borderLeft:`3px solid ${p.color}`, borderRadius:10, padding:"11px 13px" }}>
              <Tag sm bg={p.color} color="#fff">{p.label}</Tag>
              <div style={{ fontSize:11, color:T.i2, marginTop:7, lineHeight:1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* course_rules & deduct_rules */}
      <Section title="course_rules 與 deduct_rules（JSONB）" sub="方案彈性的核心在這兩個 JSON 欄位">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div style={{ background:"#1C1C1C", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:11, color:"#C9A96E", marginBottom:8, letterSpacing:".06em" }}>course_rules — 哪些課程可以用這張方案</div>
            <pre style={{ ...mono, fontSize:11, color:"#D4CFC8", lineHeight:1.7, margin:0 }}>{`{
  "mode": "whitelist",
  // "whitelist" | "blacklist" | "tag"

  // 白名單：只能上這些課
  "course_ids": ["uuid-A", "uuid-B"],

  // 或用 tag 比對
  // "mode": "tag",
  // "tags": ["器械", "私教"],

  // 黑名單：除了這些都能上
  // "mode": "blacklist",
  // "course_ids": ["uuid-C"]
}`}</pre>
          </div>
          <div style={{ background:"#1C1C1C", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:11, color:"#7A9E8E", marginBottom:8, letterSpacing:".06em" }}>deduct_rules — 每次上課扣多少</div>
            <pre style={{ ...mono, fontSize:11, color:"#D4CFC8", lineHeight:1.7, margin:0 }}>{`{
  "mode": "fixed",
  // "fixed" | "per_course" | "per_duration"

  // 固定扣：每次固定扣 1 次
  "amount": 1,

  // 依課程設定扣
  // "mode": "per_course",
  // 從 course_templates.deduct_cost 讀取

  // 依時長扣點
  // "mode": "per_duration",
  // "points_per_hour": 10,

  // 特殊覆寫（某課程額外收費）
  "overrides": {
    "uuid-特殊課": { "amount": 2 }
  }
}`}</pre>
          </div>
        </div>
      </Section>

      {/* snapshot 欄位說明 */}
      <InfoBox title="snapshot 欄位——版本化的關鍵" color={T.amb} bg={T.ambs}>
        <b>問題</b>：方案改價後，已購買的學員應該維持舊條件（次數、規則、有效期）。<br/>
        <b>解法</b>：member_passes.snapshot 在購買當下存下 pass_template 的完整 JSON 快照。<br/>
        日後系統算剩餘次數、核對扣除規則，一律讀 snapshot 而非 pass_templates，確保歷史一致性。<br/>
        pass_templates 改動不影響任何現有的 member_passes。
      </InfoBox>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TAB 4 — 整合視圖
// ══════════════════════════════════════════════════════════════
function IntegrationTab() {
  const flows = [
    {
      title:"學員預約一堂課",
      color:T.rose, bg:T.rs,
      steps:[
        "取得學員可用的 member_passes（status=active）",
        "取得 session 資訊，計算剩餘格位：slots_left = total_slots − Σ(existing bookings × slots_required)",
        "比對 member_pass.snapshot.course_rules，確認此課程可用",
        "計算本次扣除量：讀 snapshot.deduct_rules",
        "建立 booking（status=confirmed），尚不扣除",
        "上課確認到場後，建立 pass_ledger 記錄，更新 remain_count / remain_points",
      ]
    },
    {
      title:"教室格位衝突偵測",
      color:T.sage, bg:T.ss,
      steps:[
        "排班時系統查詢同教室、時間重疊的所有 sessions",
        "計算已用格位：Σ(overlapping sessions × slots_required × confirmed bookings)",
        "剩餘格位 = room.total_slots − 已用格位",
        "若新 session 的預估用量 > 剩餘格位 → 回傳衝突警告（不強制阻擋，交由管理員決定）",
      ]
    },
    {
      title:"方案繼承與覆寫計算",
      color:T.amb, bg:T.ambs,
      steps:[
        "booking 建立時，讀 member_pass.snapshot.deduct_rules",
        "若 deduct_rules.mode = 'per_course'，讀 course_templates.deduct_cost 欄位",
        "若 deduct_rules.overrides 有此課程的特殊設定，優先使用 overrides 值",
        "最終扣除量寫入 pass_ledger.amount（負數 = 扣除，正數 = 退還）",
      ]
    },
  ];

  const principles = [
    { icon:"📦", title:"定義與實例分離", desc:"Course Template / Pass Template 是定義，Session / Member Pass 是實例。定義改了不影響已建立的實例。" },
    { icon:"🔧", title:"覆寫而非複製", desc:"場館不需複製公司設定。null = 繼承，有值 = 覆寫。層層繼承，減少重複設定。" },
    { icon:"📸", title:"快照凍結時態", desc:"購買當下的方案條件被快照保存，確保歷史一致性，允許方案隨時改版。" },
    { icon:"📒", title:"帳本追蹤所有變動", desc:"所有次數/點數的增減都透過 pass_ledger 追蹤，支援退款、補贈、調整，並有完整稽核軌跡。" },
    { icon:"🎯", title:"JSONB 做彈性規則", desc:"course_rules 和 deduct_rules 用 JSONB 存，不需加欄位就能支援新的計費邏輯。" },
    { icon:"📐", title:"格位制取代純人數", desc:"slots_required + total_slots 讓教室資源管理更精確，支援器械佔位、混合課型等複雜場景。" },
  ];

  return (
    <div>
      <Section title="核心業務流程">
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {flows.map(f => (
            <div key={f.title} style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:12, overflow:"hidden" }}>
              <div style={{ padding:"10px 15px", background:f.bg, borderBottom:`1px solid ${f.color}20`, display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ fontSize:13, fontWeight:500, color:f.color }}>{f.title}</div>
              </div>
              <div style={{ padding:"12px 15px" }}>
                {f.steps.map((s, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom: i < f.steps.length-1 ? 8 : 0 }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:f.bg, color:f.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:500, flexShrink:0, marginTop:1 }}>{i+1}</div>
                    <div style={{ fontSize:12, color:T.i2, lineHeight:1.6 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="六個設計原則">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9 }}>
          {principles.map(p => (
            <div key={p.title} style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:10, padding:"13px 14px" }}>
              <div style={{ fontSize:18, marginBottom:8 }}>{p.icon}</div>
              <div style={{ fontSize:12, fontWeight:500, color:T.ink, marginBottom:5 }}>{p.title}</div>
              <div style={{ fontSize:11, color:T.i3, lineHeight:1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────
export default function CoraFlexDesign() {
  const [tab, setTab] = useState("space");
  const TABS = [
    { id:"space",       label:"空間架構" },
    { id:"course",      label:"課程架構" },
    { id:"pass",        label:"方案架構" },
    { id:"integration", label:"整合原則" },
  ];

  return (
    <div style={{ background:T.bg, minHeight:"100vh", padding:20, fontFamily:"'Noto Sans TC',sans-serif" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:300, color:T.ink, letterSpacing:".06em" }}>Cora Times — 彈性架構設計</div>
        <div style={{ fontSize:12, color:T.i3, marginTop:3 }}>公司 / 場館 / 教室・課程 / 課卡 / 方案 最大彈性設計</div>
      </div>
      <Tabs items={TABS} active={tab} onChange={setTab} />
      {tab === "space"       && <SpaceTab />}
      {tab === "course"      && <CourseTab />}
      {tab === "pass"        && <PassTab />}
      {tab === "integration" && <IntegrationTab />}
    </div>
  );
}
