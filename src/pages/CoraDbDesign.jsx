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

// ── Shared UI ────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display:"flex", gap:3, marginBottom:16, background:T.sb, borderRadius:20, padding:3, width:"fit-content" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding:"5px 16px", borderRadius:18, fontSize:12, color:active===t.id?T.ink:T.i3,
          background:active===t.id?T.sf:"none", border:"none", cursor:"pointer",
          fontFamily:"inherit", fontWeight:active===t.id?500:400, transition:"all .15s"
        }}>{t.label}</button>
      ))}
    </div>
  );
}

function Tag({ children, bg, color }) {
  return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:bg, color, fontWeight:500, display:"inline-block" }}>{children}</span>;
}

function InfoBox({ color, bg, title, children }) {
  return (
    <div style={{ background:bg, border:`1px solid ${color}`, borderRadius:12, padding:"12px 15px" }}>
      <div style={{ fontSize:11, fontWeight:500, color, marginBottom:6 }}>{title}</div>
      <div style={{ fontSize:11, color, lineHeight:1.7, opacity:.9 }}>{children}</div>
    </div>
  );
}

// ── ERD Table card ────────────────────────────────────────────
function TableCard({ icon, name, badge, headBg, headColor, borderColor, columns, badgeBg }) {
  return (
    <div style={{ borderRadius:12, overflow:"hidden", minWidth:200, flexShrink:0, boxShadow:"0 2px 8px rgba(58,53,48,.06)", border:`1.5px solid ${borderColor}`, background:T.sf }}>
      <div style={{ padding:"9px 14px", background:headBg, borderBottom:`1px solid ${borderColor}30`, display:"flex", alignItems:"center", gap:7 }}>
        <span style={{ fontSize:14 }}>{icon}</span>
        <span style={{ fontSize:13, fontWeight:500, color:headColor, letterSpacing:".02em" }}>{name}</span>
        <span style={{ marginLeft:"auto", fontSize:9, padding:"1px 7px", borderRadius:10, background:badgeBg||borderColor, color:"#fff", fontWeight:500 }}>{badge}</span>
      </div>
      <div style={{ padding:"6px 0" }}>
        {columns.map((col, i) => (
          <div key={i}>
            {col.divider
              ? <div style={{ height:1, margin:"4px 14px", background:"rgba(0,0,0,.06)" }} />
              : <div style={{ display:"flex", alignItems:"center", gap:0, padding:"3px 14px", fontSize:11 }}>
                  <span style={{ width:18, flexShrink:0, fontSize:10, color:T.amb, fontWeight:700 }}>{col.key||""}</span>
                  <span style={{ flex:1, ...mono, fontSize:11, color:col.fk||T.ink }}>{col.name}</span>
                  <span style={{ fontSize:10, opacity:.55, marginLeft:6, ...mono }}>{col.type}</span>
                  {col.note && <span style={{ fontSize:10, marginLeft:5, opacity:.65 }}>{col.note}</span>}
                </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ERD TAB ───────────────────────────────────────────────────
function ErdTab() {
  return (
    <div>
      {/* legend */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:14, padding:"10px 14px", background:T.sf, border:`1px solid ${T.bd}`, borderRadius:12 }}>
        {[[T.lav,"使用者帳號"],[T.rose,"公司"],[T.sage,"公司成員關聯（Pivot）"],[T.coral,"場館成員關聯（Pivot）"],[T.amb,"場館 / 教室"]].map(([c,l])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:T.i2 }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:c }} />{l}
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div style={{ display:"flex", gap:14, justifyContent:"center", marginBottom:28, flexWrap:"wrap" }}>
        <TableCard icon="👤" name="users" badge="帳號" headBg={T.lavs} headColor={T.lav} borderColor={T.lav} badgeBg={T.lav} columns={[
          { key:"PK", name:"id", type:"uuid" },
          { name:"email", type:"varchar", note:"UNIQUE" },
          { name:"password_hash", type:"varchar" },
          { name:"name", type:"varchar" },
          { name:"phone", type:"varchar" },
          { name:"line_uid", type:"varchar", note:"nullable" },
          { name:"is_super_admin", type:"bool", note:"default false" },
          { name:"created_at", type:"timestamptz" },
        ]} />

        <TableCard icon="🔗" name="company_members" badge="Pivot" headBg={T.ss} headColor={T.sm} borderColor={T.sage} badgeBg={T.sage} columns={[
          { key:"PK", name:"id", type:"uuid" },
          { key:"FK", name:"user_id", type:"uuid", fk:T.lav },
          { key:"FK", name:"company_id", type:"uuid", fk:T.rose },
          { divider:true },
          { name:"role", type:"enum" },
          { name:"  company_admin", type:"" },
          { name:"  coach", type:"" },
          { name:"  staff", type:"" },
          { name:"  member", type:"" },
          { divider:true },
          { name:"status", type:"enum", note:"active/invited/suspended" },
          { name:"joined_at", type:"timestamptz" },
          { name:"invited_by", type:"uuid", note:"FK→users" },
          { divider:true },
          { name:"UNIQUE(user_id, company_id)", type:"", note:"" },
        ]} />

        <TableCard icon="🏢" name="companies" badge="公司" headBg={T.rs} headColor={T.rm} borderColor={T.rose} badgeBg={T.rose} columns={[
          { key:"PK", name:"id", type:"uuid" },
          { name:"name", type:"varchar" },
          { name:"slug", type:"varchar", note:"UNIQUE" },
          { name:"plan", type:"enum", note:"starter/pro/enterprise" },
          { name:"status", type:"enum", note:"active/suspended" },
          { name:"logo_url", type:"varchar" },
          { name:"created_at", type:"timestamptz" },
        ]} />
      </div>

      {/* Row 2 */}
      <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
        <TableCard icon="🔗" name="venue_members" badge="Pivot" headBg={T.corals} headColor={T.coral} borderColor={T.coral} badgeBg={T.coral} columns={[
          { key:"PK", name:"id", type:"uuid" },
          { key:"FK", name:"user_id", type:"uuid", fk:T.lav },
          { key:"FK", name:"venue_id", type:"uuid", fk:T.amb },
          { divider:true },
          { name:"role", type:"enum" },
          { name:"  venue_manager", type:"" },
          { name:"  coach", type:"" },
          { name:"  assistant", type:"" },
          { divider:true },
          { name:"is_active", type:"bool" },
          { name:"permissions", type:"jsonb", note:"細粒度開關" },
          { divider:true },
          { name:"UNIQUE(user_id, venue_id)", type:"", note:"" },
        ]} />

        <TableCard icon="📍" name="venues" badge="場館" headBg={T.ambs} headColor={T.amb} borderColor={T.amb} badgeBg={T.amb} columns={[
          { key:"PK", name:"id", type:"uuid" },
          { key:"FK", name:"company_id", type:"uuid", fk:T.rose },
          { name:"name", type:"varchar" },
          { name:"address", type:"varchar" },
          { name:"slug", type:"varchar" },
          { name:"status", type:"enum" },
          { name:"phone", type:"varchar" },
          { name:"created_at", type:"timestamptz" },
        ]} />

        <TableCard icon="🚪" name="rooms" badge="教室" headBg={T.mists} headColor={T.mist} borderColor={T.mist} badgeBg={T.mist} columns={[
          { key:"PK", name:"id", type:"uuid" },
          { key:"FK", name:"venue_id", type:"uuid", fk:T.amb },
          { name:"name", type:"varchar" },
          { name:"capacity", type:"int" },
          { name:"equipment", type:"text" },
          { name:"color_hex", type:"varchar" },
          { name:"open_hours", type:"jsonb" },
          { name:"is_active", type:"bool" },
        ]} />
      </div>

      {/* Notes */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:14 }}>
        <InfoBox color={T.sm} bg={T.ss} title="🔑 核心設計：兩層 Pivot 表">
          company_members：一個 user 可加入多間公司，每間公司有獨立的 role。<br/>
          venue_members：在同一公司內可指派到不同場館，場館層再用 jsonb permissions 細控開關，例如 {"{"}"checkin":true,"schedule":false{"}"} 。
        </InfoBox>
        <InfoBox color={T.coral} bg={T.corals} title="⚠ 關鍵約束">
          venue_members 裡的 venue_id 對應的 venues.company_id，必須等於該 user 在 company_members 已有的 company_id。<br/>
          即：只有先加入公司，才能被指派到該公司旗下的場館。用 CHECK constraint 或 application layer 強制執行。
        </InfoBox>
      </div>
    </div>
  );
}

// ── SCENARIO TAB ──────────────────────────────────────────────
function Cell({ children, bg, color }) {
  return <span style={{ fontSize:11, padding:"2px 8px", borderRadius:7, background:bg||T.sb, color:color||T.i2, ...mono, display:"inline-block" }}>{children}</span>;
}

function ScenarioTab() {
  return (
    <div>
      <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:14, overflow:"hidden", marginBottom:12 }}>
        <div style={{ padding:"12px 16px", background:T.sb, borderBottom:`1px solid ${T.bd}`, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:16 }}>👩</span>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:T.ink }}>Sammi — 同時任職兩間公司、三個場館</div>
            <div style={{ fontSize:11, color:T.i3 }}>users.id = user-sammi | email: sammi@coratimes.com</div>
          </div>
        </div>
        <div style={{ padding:16 }}>

          {/* users row */}
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".06em", marginBottom:8 }}>USERS — 只有一筆，不管加幾間公司</div>
          <div style={{ background:T.bg, border:`1px solid ${T.bd}`, borderRadius:9, padding:"10px 13px", marginBottom:14 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <Cell bg={T.lavs} color={T.lav}>id: user-sammi</Cell>
              <Cell>email: sammi@coratimes.com</Cell>
              <Cell>name: Sammi Chen</Cell>
              <Cell>is_super_admin: false</Cell>
            </div>
          </div>

          {/* company_members */}
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".06em", marginBottom:8 }}>COMPANY_MEMBERS — 兩筆（兩間公司，角色不同）</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
            {[
              { label:"公司 A：S.T Pilates", co:"co-st-pilates", role:"coach", roleColor:[T.ss,T.sm] },
              { label:"公司 B：Body Lab",   co:"co-body-lab",   role:"company_admin", roleColor:[T.ambs,T.amb] },
            ].map(r => (
              <div key={r.label} style={{ background:T.bg, border:`1.5px solid ${T.sage}`, borderRadius:9, padding:"10px 13px" }}>
                <div style={{ fontSize:10, color:T.sm, fontWeight:500, marginBottom:7 }}>{r.label}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <Cell bg={T.lavs} color={T.lav}>user_id: user-sammi</Cell>
                  <Cell bg={T.rs} color={T.rm}>company_id: {r.co}</Cell>
                  <Cell bg={r.roleColor[0]} color={r.roleColor[1]}>role: {r.role}</Cell>
                  <Cell>status: active</Cell>
                </div>
              </div>
            ))}
          </div>

          {/* venue_members */}
          <div style={{ fontSize:10, color:T.i3, letterSpacing:".06em", marginBottom:8 }}>VENUE_MEMBERS — 三筆（三個場館，每館角色獨立）</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[
              { label:"S.T · 信義旗艦",   vid:"v-xinyi",     role:"coach",         rc:[T.ss,T.sm],     perms:'{"checkin":true}' },
              { label:"S.T · 大安分館",   vid:"v-daan",      role:"venue_manager", rc:[T.corals,T.coral], perms:'{"all":true}' },
              { label:"Body Lab · 中山館", vid:"v-zhongshan", role:"venue_manager", rc:[T.corals,T.coral], perms:'{"all":true}' },
            ].map(r => (
              <div key={r.label} style={{ background:T.bg, border:`1.5px solid ${T.coral}`, borderRadius:9, padding:"10px 13px" }}>
                <div style={{ fontSize:10, color:T.coral, fontWeight:500, marginBottom:7 }}>{r.label}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <Cell bg={T.lavs} color={T.lav}>user_id: user-sammi</Cell>
                  <Cell bg={T.ambs} color={T.amb}>venue_id: {r.vid}</Cell>
                  <Cell bg={r.rc[0]} color={r.rc[1]}>role: {r.role}</Cell>
                  <Cell style={{ fontSize:10 }}>perms: {r.perms}</Cell>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:12, padding:"10px 13px", background:T.sb, borderRadius:9, fontSize:11, color:T.i3, lineHeight:1.8 }}>
            ✅ Sammi 登入後查詢 company_members → 找到兩筆 → 前端顯示公司切換器<br/>
            選「S.T Pilates」→ 查 venue_members WHERE company_id = co-st-pilates → 得到信義、大安兩館<br/>
            選「Body Lab」→ 只有中山館，且 role = venue_manager，可看跨場館報表
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SQL TAB ───────────────────────────────────────────────────
const KW = ({ c }) => <span style={{ color:"#C9A96E" }}>{c}</span>;
const TY = ({ c }) => <span style={{ color:"#9B8FAE" }}>{c}</span>;
const CM = ({ c }) => <span style={{ color:"#6E6A64", fontStyle:"italic" }}>{c}</span>;
const ST = ({ c }) => <span style={{ color:"#7A9E8E" }}>{c}</span>;

function SqlBlock({ label, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11, fontWeight:500, color:T.i2, marginBottom:6, letterSpacing:".04em" }}>{label}</div>
      <div style={{ background:"#1C1C1C", borderRadius:12, padding:16, overflowX:"auto" }}>
        <pre style={{ ...mono, fontSize:11, color:"#D4CFC8", lineHeight:1.7, margin:0 }}>{children}</pre>
      </div>
    </div>
  );
}

function SqlTab() {
  const sql1 = `CREATE TABLE users (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email            VARCHAR(255) NOT NULL UNIQUE,
  password_hash    VARCHAR(255) NOT NULL,
  name             VARCHAR(100) NOT NULL,
  phone            VARCHAR(20),
  avatar_url       VARCHAR(500),
  line_uid         VARCHAR(100) UNIQUE,          -- LINE 第三方登入
  is_super_admin   BOOLEAN      NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);`;

  const sql2 = `CREATE TABLE company_members (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
  company_id   UUID        NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role         VARCHAR(30) NOT NULL,
  -- 'company_admin' | 'coach' | 'staff' | 'member'
  status       VARCHAR(20) NOT NULL DEFAULT 'invited',
  -- 'active' | 'invited' | 'suspended'
  joined_at    TIMESTAMPTZ,
  invited_by   UUID        REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)   -- 同一人在同一公司只有一筆
);`;

  const sql3 = `CREATE TABLE venue_members (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  venue_id     UUID        NOT NULL REFERENCES venues(id)  ON DELETE CASCADE,
  role         VARCHAR(30) NOT NULL,
  -- 'venue_manager' | 'coach' | 'assistant'
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  permissions  JSONB       NOT NULL DEFAULT '{}',
  -- {"checkin":true, "schedule":true, "members":false, "payments":false}
  UNIQUE(user_id, venue_id)
);
-- 確保 venue 屬於使用者已加入的公司（Application Layer 強制）
-- 或用 Trigger 檢查`;

  const sql4 = `-- 索引
CREATE INDEX ON company_members(user_id, status);
CREATE INDEX ON venue_members(user_id, venue_id);
CREATE INDEX ON venues(company_id);
CREATE INDEX ON rooms(venue_id);

-- Supabase Row Level Security 範例
CREATE POLICY "只能看自己公司的場館"
ON venues FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM company_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);`;

  return (
    <div>
      <SqlBlock label="1. users — 全域帳號，每人唯一一筆">{sql1}</SqlBlock>
      <SqlBlock label="2. company_members — user ↔ company 多對多 Pivot">{sql2}</SqlBlock>
      <SqlBlock label="3. venue_members — user ↔ venue 多對多 Pivot（含細粒度權限）">{sql3}</SqlBlock>
      <SqlBlock label="4. 索引與 RLS">{sql4}</SqlBlock>
    </div>
  );
}

// ── FLOW TAB ──────────────────────────────────────────────────
function FlowTab() {
  const steps = [
    {
      num:1, bg:T.lavs, fg:T.lav,
      title:"Email + 密碼驗證，取得 user.id",
      sql:`SELECT id, is_super_admin FROM users
WHERE email = $1 AND password_hash = crypt($2, password_hash)`,
    },
    {
      num:2, bg:T.rs, fg:T.rm,
      title:"查詢此帳號加入的所有公司",
      sql:`SELECT c.id, c.name, c.slug, cm.role
FROM company_members cm
JOIN companies c ON c.id = cm.company_id
WHERE cm.user_id = $1 AND cm.status = 'active'
ORDER BY cm.joined_at`,
      note:"若只有一間公司 → 自動選入，不顯示切換器",
    },
    {
      num:3, bg:T.ss, fg:T.sm,
      title:"使用者選定公司後，查詢可存取場館",
      sql:`SELECT v.id, v.name, vm.role, vm.permissions
FROM venue_members vm
JOIN venues v ON v.id = vm.venue_id
WHERE vm.user_id = $1
  AND v.company_id = $2
  AND vm.is_active = true`,
    },
    {
      num:4, bg:T.corals, fg:T.coral,
      title:"Issue JWT — 將公司、場館、角色、權限全寫入",
      sql:`// JWT payload
{
  "sub": "user-uuid",
  "company_id": "co-st-pilates",
  "venues": [
    { "id": "v-xinyi", "role": "coach",         "perms": {"checkin":true} },
    { "id": "v-daan",  "role": "venue_manager",  "perms": {"all":true}    }
  ],
  "is_super_admin": false,
  "exp": 1750000000
}`,
    },
    {
      num:5, bg:T.sb, fg:T.i2,
      title:"每支 API 從 JWT 讀取 company_id 做資料隔離",
      sql:`-- Supabase RLS：自動套用，不需每支 API 手寫 WHERE
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "只看自己公司場館" ON venues
FOR SELECT USING (
  company_id = current_setting('app.company_id')::uuid
);`,
      note:"切換公司時重新 issue JWT，不需重新登入",
    },
  ];

  return (
    <div>
      <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:14, padding:18, marginBottom:12 }}>
        <div style={{ fontSize:13, fontWeight:500, color:T.ink, marginBottom:14 }}>🔑 登入 → 選公司 → 取場館清單 → Issue JWT</div>
        {steps.map((s, i) => (
          <div key={s.num} style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom: i < steps.length-1 ? 16 : 0 }}>
            <div style={{ width:22, height:22, borderRadius:"50%", background:s.bg, color:s.fg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:500, flexShrink:0, marginTop:2 }}>{s.num}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:T.ink, marginBottom:5 }}>{s.title}</div>
              <div style={{ background:"#1C1C1C", borderRadius:8, padding:"9px 12px", overflowX:"auto" }}>
                <pre style={{ ...mono, fontSize:10, color:"#D4CFC8", lineHeight:1.6, margin:0 }}>{s.sql}</pre>
              </div>
              {s.note && <div style={{ fontSize:11, color:T.i3, marginTop:5, display:"flex", alignItems:"center", gap:5 }}>💡 {s.note}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:T.sb, borderRadius:12, padding:"12px 15px", fontSize:11, color:T.i2, lineHeight:1.8 }}>
        <div style={{ fontWeight:500, color:T.ink, marginBottom:6 }}>⚡ 效能優化</div>
        建議索引：<code style={{ background:T.sf, padding:"1px 6px", borderRadius:4, ...mono, fontSize:10 }}>company_members(user_id, status)</code>、
        <code style={{ background:T.sf, padding:"1px 6px", borderRadius:4, ...mono, fontSize:10 }}>venue_members(user_id, venue_id)</code><br/>
        公司切換時重新 issue JWT 即可，不需重新輸入密碼。<br/>
        Supabase / PostgreSQL RLS 可直接用 JWT claim 做行級隔離，整個 company 的資料天然隔離。
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export default function CoraDbDesign() {
  const [tab, setTab] = useState("erd");
  const TABS = [
    { id:"erd",      label:"ERD 關聯圖" },
    { id:"scenario", label:"情境範例" },
    { id:"sql",      label:"DDL Schema" },
    { id:"flow",     label:"登入查詢流程" },
  ];
  return (
    <div style={{ background:T.bg, minHeight:"100vh", padding:20, fontFamily:"'Noto Sans TC',sans-serif" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:300, color:T.ink, letterSpacing:".06em" }}>Cora Times — 資料庫設計</div>
        <div style={{ fontSize:12, color:T.i3, marginTop:3 }}>多租戶 SaaS・同帳號多公司・多場館角色</div>
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "erd"      && <ErdTab />}
      {tab === "scenario" && <ScenarioTab />}
      {tab === "sql"      && <SqlTab />}
      {tab === "flow"     && <FlowTab />}
    </div>
  );
}
