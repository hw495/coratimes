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

function Tabs({ items, active, onChange }) {
  return (
    <div style={{ display:"flex", gap:3, marginBottom:18, background:T.sb, borderRadius:20, padding:3, width:"fit-content" }}>
      {items.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding:"5px 16px", borderRadius:18, fontSize:12,
          color:active===t.id?T.ink:T.i3, background:active===t.id?T.sf:"none",
          border:"none", cursor:"pointer", fontFamily:"inherit",
          fontWeight:active===t.id?500:400, transition:"all .15s"
        }}>{t.label}</button>
      ))}
    </div>
  );
}

function Tag({ children, bg, color, sm }) {
  return <span style={{ fontSize:sm?10:11, padding:sm?"2px 7px":"2px 9px", borderRadius:12, background:bg||T.sb, color:color||T.i2, fontWeight:500, display:"inline-block", whiteSpace:"nowrap" }}>{children}</span>;
}

function InfoBox({ title, color=T.sage, bg=T.ss, children }) {
  return (
    <div style={{ background:bg, border:`1px solid ${color}40`, borderLeft:`3px solid ${color}`, borderRadius:10, padding:"11px 14px", marginTop:8 }}>
      {title && <div style={{ fontSize:11, fontWeight:500, color, marginBottom:5 }}>{title}</div>}
      <div style={{ fontSize:12, color:T.i2, lineHeight:1.7 }}>{children}</div>
    </div>
  );
}

function TableCard({ icon, name, badge, headBg, headColor, borderColor, columns, highlight }) {
  return (
    <div style={{ borderRadius:12, overflow:"hidden", minWidth:195, flexShrink:0,
      boxShadow: highlight ? `0 0 0 2px ${borderColor}` : "0 2px 8px rgba(58,53,48,.07)",
      border:`1.5px solid ${borderColor}`, background:T.sf }}>
      <div style={{ padding:"9px 13px", background:headBg, display:"flex", alignItems:"center", gap:7 }}>
        <span style={{ fontSize:14 }}>{icon}</span>
        <span style={{ fontSize:12, fontWeight:500, color:headColor }}>{name}</span>
        <Tag sm bg={borderColor} color="#fff">{badge}</Tag>
        {highlight && <Tag sm bg={T.corals} color={T.coral}>已更新</Tag>}
      </div>
      <div style={{ padding:"5px 0" }}>
        {columns.map((c, i) => c.divider
          ? <div key={i} style={{ height:1, margin:"3px 13px", background:T.bd }} />
          : <div key={i} style={{ display:"flex", alignItems:"center", padding:"3px 13px", fontSize:11 }}>
              <span style={{ width:18, fontSize:10, color:T.amb, fontWeight:700 }}>{c.key||""}</span>
              <span style={{ flex:1, ...mono, fontSize:10.5, color:c.fk||T.ink, textDecoration:c.removed?"line-through":undefined, opacity:c.removed?0.4:1 }}>{c.name}</span>
              <span style={{ fontSize:10, opacity:.5, ...mono, marginLeft:4 }}>{c.type}</span>
              {c.note && <span style={{ fontSize:9.5, marginLeft:5, color:c.new?T.rose:T.i3, fontWeight:c.new?600:400 }}>{c.note}</span>}
            </div>
        )}
      </div>
    </div>
  );
}

function CodeBlock({ lines, title }) {
  return (
    <div style={{ marginBottom:14 }}>
      {title && <div style={{ fontSize:11, fontWeight:500, color:T.i2, marginBottom:6, letterSpacing:".04em" }}>{title}</div>}
      <div style={{ background:"#1C1C1C", borderRadius:12, padding:16, overflowX:"auto" }}>
        <pre style={{ ...mono, fontSize:11, color:"#D4CFC8", lineHeight:1.7, margin:0 }}>{lines}</pre>
      </div>
    </div>
  );
}

// ── TAB 1 — 訂閱方案設計 ─────────────────────────────────────
function SubscriptionTab() {
  return (
    <div>
      <div style={{ marginBottom:16, padding:"12px 15px", background:T.corals, border:`1px solid ${T.coral}40`, borderLeft:`3px solid ${T.coral}`, borderRadius:10 }}>
        <div style={{ fontSize:12, fontWeight:500, color:T.coral, marginBottom:5 }}>設計變更原因</div>
        <div style={{ fontSize:12, color:T.i2, lineHeight:1.7 }}>
          <b>舊設計</b>：companies.plan = 'starter' | 'pro'，方案寫死在公司表。<br/>
          <b>問題</b>：無升降級歷史、無帳單週期、無試用期、無付款狀態追蹤。<br/>
          <b>新設計</b>：抽出 subscription_plans（方案定義）+ company_subscriptions（訂閱實例）兩張表，與學員時光券的設計邏輯一致。
        </div>
      </div>

      {/* ERD */}
      <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:8, marginBottom:16, alignItems:"flex-start" }}>

        <TableCard icon="🏢" name="companies" badge="公司" headBg={T.rs} headColor={T.rm} borderColor={T.rose} highlight columns={[
          { key:"PK", name:"id",         type:"uuid" },
          { name:"name",                 type:"varchar" },
          { name:"slug",                 type:"varchar", note:"UNIQUE" },
          { name:"status",               type:"enum",    note:"active/suspended" },
          { name:"logo_url",             type:"varchar" },
          { name:"created_at",           type:"timestamptz" },
          { divider:true },
          { name:"plan",                 type:"",        note:"← 移除", removed:true },
        ]} />

        <div style={{ display:"flex", alignItems:"center", color:T.sand3, fontSize:16, marginTop:20, flexShrink:0 }}>→</div>

        <TableCard icon="📋" name="subscription_plans" badge="方案定義" headBg={T.lavs} headColor={T.lav} borderColor={T.lav} highlight columns={[
          { key:"PK", name:"id",             type:"uuid" },
          { name:"name",                     type:"varchar",  note:"Starter / Pro / Enterprise" },
          { name:"code",                     type:"varchar",  note:"starter / pro / enterprise" },
          { name:"max_venues",               type:"int",      note:"場館上限（-1=無限）" },
          { name:"max_members_per_venue",    type:"int",      note:"學員上限（-1=無限）" },
          { name:"features",                 type:"jsonb",    note:"功能開關" },
          { name:"monthly_price",            type:"int",      note:"月費（元）" },
          { name:"annual_price",             type:"int",      note:"年費（元）" },
          { name:"is_active",                type:"bool" },
        ]} />

        <div style={{ display:"flex", alignItems:"center", color:T.sand3, fontSize:16, marginTop:20, flexShrink:0 }}>→</div>

        <TableCard icon="💳" name="company_subscriptions" badge="訂閱實例" headBg={T.ambs} headColor={T.amb} borderColor={T.amb} highlight columns={[
          { key:"PK", name:"id",              type:"uuid" },
          { key:"FK", name:"company_id",      type:"uuid",       fk:T.rose },
          { key:"FK", name:"plan_id",         type:"uuid",       fk:T.lav },
          { name:"status",                    type:"enum",       note:"trial/active/past_due/cancelled" },
          { name:"billing_cycle",             type:"enum",       note:"monthly / annual" },
          { name:"current_period_start",      type:"timestamptz" },
          { name:"current_period_end",        type:"timestamptz" },
          { name:"trial_ends_at",             type:"timestamptz?",note:"試用期截止" },
          { name:"cancelled_at",              type:"timestamptz?" },
          { name:"cancel_reason",             type:"text?" },
          { name:"snapshot",                  type:"jsonb",      note:"訂閱時方案快照" },
          { name:"created_at",               type:"timestamptz" },
        ]} />

        <div style={{ display:"flex", alignItems:"center", color:T.sand3, fontSize:16, marginTop:20, flexShrink:0 }}>→</div>

        <TableCard icon="📒" name="subscription_invoices" badge="帳單記錄" headBg={T.ss} headColor={T.sm} borderColor={T.sage} columns={[
          { key:"PK", name:"id",              type:"uuid" },
          { key:"FK", name:"subscription_id", type:"uuid",       fk:T.amb },
          { name:"amount",                    type:"int" },
          { name:"status",                    type:"enum",       note:"draft/paid/failed/void" },
          { name:"period_start",              type:"timestamptz" },
          { name:"period_end",                type:"timestamptz" },
          { name:"paid_at",                   type:"timestamptz?" },
          { name:"invoice_url",               type:"varchar?",   note:"PDF 連結" },
        ]} />
      </div>

      {/* features jsonb */}
      <CodeBlock title="subscription_plans.features JSONB 格式" lines={`{
  "max_venues":          5,       // 場館上限（-1 = 無限）
  "max_members":         -1,      // 學員上限（-1 = 無限）
  "analytics":           true,    // 洞察報表
  "cross_venue_report":  true,    // 跨場館報表（Pro+）
  "contract_esign":      true,    // 電子合約簽署
  "line_notify":         true,    // LINE 通知
  "invoice":             true,    // 電子發票
  "api_access":          false,   // API 存取（Enterprise）
  "custom_domain":       false,   // 自訂網域（Enterprise）
  "priority_support":    false    // 優先客服（Enterprise）
}`} />

      {/* 取得目前方案的查詢 */}
      <CodeBlock title="取得公司目前有效訂閱（API 常用查詢）" lines={`-- 取得公司目前有效訂閱及方案功能
SELECT
  cs.status,
  cs.current_period_end,
  cs.trial_ends_at,
  sp.name          AS plan_name,
  sp.max_venues,
  sp.features
FROM company_subscriptions cs
JOIN subscription_plans sp ON sp.id = cs.plan_id
WHERE cs.company_id = $1
  AND cs.status IN ('trial', 'active')
ORDER BY cs.created_at DESC
LIMIT 1;`} />

      <InfoBox title="與學員時光券設計一致" color={T.sage} bg={T.ss}>
        subscription_plans（方案定義）對應 pass_templates（時光券定義）。<br/>
        company_subscriptions（訂閱實例）對應 member_passes（學員持有方案）。<br/>
        兩者都有 snapshot 欄位凍結購買時的條件，避免方案改版影響現有客戶。<br/>
        subscription_invoices（帳單）對應 pass_ledger（扣除帳本）。
      </InfoBox>

      {/* 三種方案比較 */}
      <div style={{ marginTop:16 }}>
        <div style={{ fontSize:12, fontWeight:500, color:T.ink, marginBottom:10 }}>三種訂閱方案</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[
            { name:"Starter",    color:T.mist,  bg:T.mists, price:"$1,500/月", venues:"1 間場館", features:["基本簽到","時光表","學員管理","時光券方案","收款確認","洞察報表（單館）"] },
            { name:"Pro",        color:T.rose,  bg:T.rs,    price:"$3,500/月", venues:"5 間場館", features:["Starter 全部","跨場館報表","電子合約簽署","LINE 通知","電子發票","公開預約頁"] },
            { name:"Enterprise", color:T.lav,   bg:T.lavs,  price:"洽談",      venues:"無限場館", features:["Pro 全部","API 存取","自訂網域","優先客服","客製整合","專屬 SLA"] },
          ].map(p => (
            <div key={p.name} style={{ background:p.bg, border:`1.5px solid ${p.color}30`, borderRadius:12, padding:"14px 15px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <Tag bg={p.color} color="#fff">{p.name}</Tag>
                <span style={{ fontSize:12, fontWeight:500, color:p.color }}>{p.price}</span>
              </div>
              <div style={{ fontSize:11, color:T.i2, marginBottom:8 }}>場館：{p.venues}</div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize:11, color:T.i2, display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
                  <span style={{ color:p.color, fontSize:9 }}>✓</span>{f}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB 2 — 工程師分工 ────────────────────────────────────────
function TeamTab() {
  const [selected, setSelected] = useState("david");

  const persons = {
    david: {
      name:"David", role:"Super Admin 平台",
      color:T.lav, bg:T.lavs, platform:"admin.coratimes.com",
      platformLabel:"系統管理後台",
      desc:"負責整個 Cora Times 平台的管理介面，包含公司開通、訂閱管理、跨公司洞察，以及所有底層系統架構。",
      modules:[
        { icon:"🛡", name:"Super Admin 後台（admin.coratimes.com）", diff:"H", items:[
          "公司管理（新增、停用、進入公司視角）",
          "訂閱方案管理（subscription_plans CRUD）",
          "公司訂閱管理（升降級、帳單、到期處理）",
          "跨公司洞察報表",
          "系統公告管理",
          "平台設定",
        ]},
        { icon:"🏗", name:"系統基礎建設", diff:"H", items:[
          "多租戶資料庫建置（PostgreSQL + RLS）",
          "JWT 身份驗證（含多公司切換）",
          "RBAC 角色權限系統（5 種角色、2 層 Pivot）",
          "三入口登入頁面（app / manage / admin）",
          "CI/CD 自動部署（GitHub Actions + Vercel）",
        ]},
        { icon:"🔌", name:"第三方整合", diff:"H", items:[
          "ATM 虛擬帳號收款 + Webhook",
          "PAYUNi 信用卡 / 電子錢包",
          "藍新電子發票 API",
          "LINE Login OAuth",
          "LINE Messaging API 通知推播",
          "通知排程服務（Cron Job）",
        ]},
      ],
    },
    cindy: {
      name:"Cindy", role:"公司管理後台",
      color:T.rose, bg:T.rs, platform:"manage.coratimes.com",
      platformLabel:"公司管理後台",
      desc:"負責場館業者每天使用的管理介面，從課表排班、學員管理到收款報表，是平台最核心的操作面。",
      modules:[
        { icon:"📍", name:"場館 / 教室管理", diff:"M", items:[
          "場館列表（多分店）、新增 / 編輯 / 停用",
          "教室管理（格位制、設備、開放時段）",
          "場館架構根莖圖視覺化",
          "Company Admin 成員管理與權限設定",
        ]},
        { icon:"🗓", name:"時光表 / 排程", diff:"H", items:[
          "時光表週視圖（7 欄格線、四色語意）",
          "排程管理（循環排班、三種修改模式）",
          "衝突偵測（同教室同時段）",
          "今日簽到（到場 Toggle、自動扣次、QR碼）",
        ]},
        { icon:"👥", name:"學員 / 課程 / 方案", diff:"H", items:[
          "學員管理（列表、詳情、方案進度條）",
          "時光券方案（5 種類型、course_rules、deduct_rules）",
          "課程庫（格位制、標籤、課程與方案關聯）",
          "教練管理（照片、專長、薪資紀錄）",
        ]},
        { icon:"💰", name:"財務 / 報表 / 設定", diff:"M", items:[
          "收款確認（待確認清單、一鍵確認啟用方案）",
          "洞察報表（KPI、長條圖、甜甜圈、匯出）",
          "服務合約（富文字、動態標籤、電子簽署）",
          "偏好設定（預留規則、通知、LINE 整合）",
        ]},
      ],
    },
    amy: {
      name:"Amy", role:"學員前台",
      color:T.sage, bg:T.ss, platform:"app.coratimes.com",
      platformLabel:"學員前台",
      desc:"負責學員面對的所有頁面，從場館探索、課程預約到個人帳號管理，是 Cora Times 對外的門面。",
      modules:[
        { icon:"🌿", name:"場館探索 / 公開頁", diff:"M", items:[
          "場館介紹頁（工作室資訊、照片、地圖）",
          "教練列表（照片、專長、IG 連結）",
          "課程瀏覽（類型、時長、說明）",
          "公開時光表（對外顯示可預約場次）",
        ]},
        { icon:"🎫", name:"預約流程", diff:"H", items:[
          "選課 → 選時段 → 選方案 → 確認 → 付款",
          "ATM / QRCode / 信用卡付款頁",
          "候補名單加入與通知",
          "預約確認通知（LINE / Email）",
        ]},
        { icon:"👤", name:"學員個人頁", diff:"M", items:[
          "我的時光券（剩餘次數、到期日、進度條）",
          "我的預留紀錄（可取消、查看歷史）",
          "服務合約簽署頁",
          "個人資料編輯",
        ]},
        { icon:"🔑", name:"帳號 / 登入", diff:"M", items:[
          "Email / 密碼登入 + 忘記密碼",
          "LINE Login（一鍵登入）",
          "新學員註冊流程",
          "多場館帳號切換（同帳號可加入多間工作室）",
        ]},
      ],
    },
  };

  const p = persons[selected];

  return (
    <div>
      {/* Person selector */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
        {Object.entries(persons).map(([id, person]) => (
          <div key={id} onClick={() => setSelected(id)} style={{
            background: selected===id ? person.bg : T.sf,
            border: `${selected===id ? 2 : 1}px solid ${selected===id ? person.color : T.bd}`,
            borderRadius:14, padding:"14px 16px", cursor:"pointer", transition:"all .15s"
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:person.color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:500 }}>{person.name[0]}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color: selected===id ? person.color : T.ink }}>{person.name}</div>
                <div style={{ fontSize:11, color:T.i3 }}>{person.role}</div>
              </div>
            </div>
            <div style={{ fontSize:10, ...mono, color:selected===id ? person.color : T.i3, background: selected===id ? `${person.color}15` : T.bg, padding:"3px 8px", borderRadius:6 }}>
              {person.platform}
            </div>
          </div>
        ))}
      </div>

      {/* Detail */}
      <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", background:p.bg, borderBottom:`1px solid ${p.color}20`, display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:p.color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:500 }}>{p.name[0]}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:500, color:p.color }}>{p.name} — {p.role}</div>
            <div style={{ fontSize:12, color:T.i2, marginTop:3 }}>{p.desc}</div>
          </div>
          <div style={{ text:"right" }}>
            <Tag bg={p.color} color="#fff">{p.platformLabel}</Tag>
            <div style={{ fontSize:10, color:T.i3, marginTop:4, textAlign:"right", ...mono }}>{p.platform}</div>
          </div>
        </div>

        <div style={{ padding:18, display:"flex", flexDirection:"column", gap:14 }}>
          {p.modules.map(m => (
            <div key={m.name} style={{ border:`1px solid ${T.bd}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"10px 14px", background:T.sb, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:16 }}>{m.icon}</span>
                <span style={{ fontSize:12, fontWeight:500, color:T.ink }}>{m.name}</span>
                <Tag sm bg={m.diff==="H"?T.corals:m.diff==="M"?T.ambs:T.ss} color={m.diff==="H"?T.coral:m.diff==="M"?T.amb:T.sm}>
                  {m.diff==="H"?"高難度":m.diff==="M"?"中難度":"低難度"}
                </Tag>
              </div>
              <div style={{ padding:"10px 14px", display:"flex", flexWrap:"wrap", gap:6 }}>
                {m.items.map(item => (
                  <div key={item} style={{ fontSize:11, color:T.i2, display:"flex", alignItems:"center", gap:5, background:T.bg, padding:"4px 10px", borderRadius:20, border:`1px solid ${T.bd}` }}>
                    <span style={{ color:p.color, fontSize:9 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary table */}
      <div style={{ marginTop:14, border:`1px solid ${T.bd}`, borderRadius:12, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"80px 1fr 1fr 1fr", background:T.sb, borderBottom:`1px solid ${T.bd}` }}>
          {["","David","Cindy","Amy"].map((h,i) => (
            <div key={i} style={{ padding:"8px 12px", fontSize:11, fontWeight:500, color: i===0?T.i3:Object.values(persons)[i-1]?.color, textAlign: i===0?"left":"center" }}>{h}</div>
          ))}
        </div>
        {[
          ["平台", "admin.coratimes.com", "manage.coratimes.com", "app.coratimes.com"],
          ["使用者", "Cora Times 團隊", "場館業者 / 教練", "學員（一般用戶）"],
          ["核心難度", "🔴 高（架構 + 整合）", "🟠 高（核心業務邏輯）", "🟡 中（UX 流程）"],
          ["對外 API", "平台管理 API", "場館管理 API", "預約 / 帳號 API"],
        ].map((row, ri) => (
          <div key={ri} style={{ display:"grid", gridTemplateColumns:"80px 1fr 1fr 1fr", borderBottom:ri<3?`1px solid ${T.bd}`:"none", background:ri%2===0?T.sf:T.bg }}>
            <div style={{ padding:"9px 12px", fontSize:11, color:T.i3, fontWeight:500 }}>{row[0]}</div>
            {row.slice(1).map((cell, ci) => (
              <div key={ci} style={{ padding:"9px 12px", fontSize:11, color:T.i2, textAlign:"center" }}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────
export default function CoraTimesDesign() {
  const [tab, setTab] = useState("subscription");
  return (
    <div style={{ background:T.bg, minHeight:"100vh", padding:20, fontFamily:"'Noto Sans TC',sans-serif" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:300, color:T.ink, letterSpacing:".06em" }}>Cora Times — 設計更新</div>
        <div style={{ fontSize:12, color:T.i3, marginTop:3 }}>訂閱方案資料庫重設計 · 三人平台分工</div>
      </div>
      <Tabs items={[
        { id:"subscription", label:"訂閱方案設計" },
        { id:"team",        label:"工程師分工" },
      ]} active={tab} onChange={setTab} />
      {tab === "subscription" && <SubscriptionTab />}
      {tab === "team"         && <TeamTab />}
    </div>
  );
}
