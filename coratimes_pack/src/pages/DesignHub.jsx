import { useNavigate } from "react-router-dom";

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
  green:"#4CAF50", greens:"#E8F5E9",
};

const sections = [
  {
    group: "品牌設計",
    items: [
      {
        path: "/brand",
        icon: "✦",
        title: "品牌視覺",
        sub: "Logo · 色彩系統 · 字型規範",
        color: T.rose, bg: T.rs,
        tags: ["Logo", "色彩", "字型"],
      },
      {
        path: "/member",
        icon: "🔑",
        title: "三個登入頁",
        sub: "學員前台 · 公司後台 · Super Admin",
        color: T.lav, bg: T.lavs,
        tags: ["app", "manage", "admin"],
      },
    ],
  },
  {
    group: "經銷商平台",
    items: [
      {
        path: "/reseller",
        icon: "📊", title: "經銷商儀表板",
        sub: "旗下公司 · 本月佣金 · 潛客狀態",
        color: T.amb, bg: T.ambs, tags: ["儀表板","佣金"], badge: "新",
      },
      {
        path: "/reseller/companies",
        icon: "🏢", title: "旗下公司管理",
        sub: "新增公司 · 進入後台 · 訂閱方案",
        color: T.amb, bg: T.ambs, tags: ["公司","管理"],
      },
      {
        path: "/reseller/leads",
        icon: "🎯", title: "潛客管理",
        sub: "新潛客 · Demo 中 · 洽談中 · 成交",
        color: T.amb, bg: T.ambs, tags: ["潛客","CRM"],
      },
      {
        path: "/reseller/commission",
        icon: "💰", title: "佣金紀錄",
        sub: "每月 MRR · 佣金明細 · 撥付記錄",
        color: T.amb, bg: T.ambs, tags: ["佣金","財務"],
      },
    ],
  },
  {
    group: "教練 APP",
    items: [
      {
        path: "/posture",
        icon: "📸",
        title: "體態評估 APP 操作流程",
        sub: "拍照引導 · AI 骨骼分析 · 教練筆記 · 生成報告",
        color: T.green, bg: T.greens,
        tags: ["教練", "AI", "體態", "拍照"],
        badge: "新",
      },
    ],
  },
  {
    group: "學員前台 APP",
    items: [
      {
        path: "/member/app",
        icon: "🏠",
        title: "學員首頁",
        sub: "今日課程 · 剩餘次數 · 快速預約",
        color: T.green, bg: T.greens,
        tags: ["首頁", "總覽"],
        badge: "前台",
      },
      {
        path: "/member/app/schedule",
        icon: "🗓",
        title: "預約課程",
        sub: "依排班時段選教練 · 依方案可預約課程",
        color: T.sage, bg: T.ss,
        tags: ["預約", "排班", "教練"],
        badge: "前台",
      },
      {
        path: "/member/app/courses",
        icon: "🌱",
        title: "課程瀏覽",
        sub: "篩選課程類型 · 課程介紹 · 師資",
        color: T.rose, bg: T.rs,
        tags: ["課程", "介紹"],
        badge: "前台",
      },
      {
        path: "/member/app/coaches",
        icon: "🤍",
        title: "教練介紹",
        sub: "教練資訊 · IG 連結 · 教學專長",
        color: T.lav, bg: T.lavs,
        tags: ["教練", "師資"],
        badge: "前台",
      },
      {
        path: "/member/app/passes",
        icon: "🎫",
        title: "我的方案",
        sub: "課卡進度 · 剩餘次數 · 到期日",
        color: T.amb, bg: T.ambs,
        tags: ["方案", "課卡"],
        badge: "前台",
      },
      {
        path: "/member/app/history",
        icon: "📋",
        title: "預約紀錄",
        sub: "出席 · 取消 · 未出席 · 課程明細",
        color: T.mist, bg: T.mists,
        tags: ["紀錄", "出席"],
        badge: "前台",
      },
      {
        path: "/member/app/profile",
        icon: "👤",
        title: "個人資料",
        sub: "基本資料 · 緊急聯絡 · 通知設定",
        color: T.coral, bg: T.corals,
        tags: ["個人", "設定"],
        badge: "前台",
      },
      {
        path: "/member/app/contracts",
        icon: "📄",
        title: "服務合約",
        sub: "電子簽署 · 合約查閱",
        color: T.sage, bg: T.ss,
        tags: ["合約", "簽署"],
        badge: "前台",
      },
    ],
  },
  {
    group: "公司後台",
    items: [
      {
        path: "/manage/checkin",
        icon: "🌿",
        title: "今日簽到",
        sub: "場次列表 · 到場 Toggle · QR 簽到",
        color: T.sage, bg: T.ss,
        tags: ["即時", "互動"],
      },
      {
        path: "/manage/calendar",
        icon: "🗓",
        title: "時光表",
        sub: "週視圖 · 後台幫學員預約 · 完整預約表單",
        color: T.rose, bg: T.rs,
        tags: ["週視圖", "預約"],
      },
      {
        path: "/manage/schedule",
        icon: "⊞",
        title: "排班管理",
        sub: "教練時段 · 多位教練指派 · 開放/關閉時段",
        color: T.amb, bg: T.ambs,
        tags: ["排班", "時段", "教練"],
      },
      {
        path: "/manage/courses",
        icon: "🌱",
        title: "課程庫",
        sub: "CRUD · 課程類型 · 篩選器",
        color: T.sage, bg: T.ss,
        tags: ["課程", "CRUD"],
      },
      {
        path: "/manage/plans",
        icon: "🎫",
        title: "時光券方案",
        sub: "五種類型 · 篩選器 · 上下架",
        color: T.rose, bg: T.rs,
        tags: ["方案", "定價"],
      },
      {
        path: "/manage/members",
        icon: "👥",
        title: "學員管理",
        sub: "7 個詳情 Tab · 體態報告 · 購買方案 · 課程紀錄",
        color: T.mist, bg: T.mists,
        tags: ["學員", "體態", "CRUD"],
        badge: "升級",
      },
      {
        path: "/manage/coaches",
        icon: "🤍",
        title: "教練管理",
        sub: "照片上傳 · 計薪設定 · 薪資紀錄查詢",
        color: T.lav, bg: T.lavs,
        tags: ["教練", "薪資"],
      },
      {
        path: "/manage/payments",
        icon: "🧾",
        title: "收款確認",
        sub: "待確認清單 · 篩選器 · 一鍵確認",
        color: T.sage, bg: T.ss,
        tags: ["財務", "收款"],
      },
      {
        path: "/manage/insights",
        icon: "📊",
        title: "洞察報表",
        sub: "KPI · 長條圖 · 甜甜圈 · 匯出",
        color: T.lav, bg: T.lavs,
        tags: ["報表", "圖表"],
      },
      {
        path: "/manage/settings",
        icon: "⚙",
        title: "偏好設定",
        sub: "場館資訊 · 預留規則 · 收款 · LINE 整合 · RWD",
        color: T.mist, bg: T.mists,
        tags: ["設定", "LINE"],
      },
      {
        path: "/manage/contracts",
        icon: "📄",
        title: "服務合約",
        sub: "動態標籤 · 電子簽署 · 篩選器",
        color: T.amb, bg: T.ambs,
        tags: ["合約", "簽署"],
      },
      {
        path: "/manage/team",
        icon: "🛡",
        title: "成員管理",
        sub: "邀請成員 · 逐項權限開關",
        color: T.lav, bg: T.lavs,
        tags: ["權限", "成員"],
      },
    ],
  },
  {
    group: "SaaS 管理層",
    items: [
      {
        path: "/superadmin/app",
        icon: "🏢",
        title: "Super Admin — 公司管理",
        sub: "新增公司 · 停用 · 進入公司視角",
        color: T.lav, bg: T.lavs,
        tags: ["多租戶", "公司"],
      },
      {
        path: "/superadmin/app/plans",
        icon: "💎",
        title: "Super Admin — 訂閱方案",
        sub: "Starter · Pro（含體態評估）· Enterprise（含AI趨勢分析）",
        badge: "更新",
        color: T.lav, bg: T.lavs,
        tags: ["訂閱", "方案"],
        badge: "最新",
      },
      {
        path: "/superadmin/app/insights",
        icon: "📈",
        title: "Super Admin — 跨公司洞察",
        sub: "平台 KPI · 場次佔比 · 收入比較",
        color: T.lav, bg: T.lavs,
        tags: ["洞察", "平台"],
      },
    ],
  },
  {
    group: "架構圖 & 流程圖",
    items: [
      {
        path: "/brand",
        icon: "🎨",
        title: "品牌設計系統",
        sub: "Logo · 色彩 · 字型 · 三入口視覺",
        color: T.rose, bg: T.rs,
        tags: ["品牌", "設計"],
      },
      {
        path: "/design",
        icon: "👥",
        title: "訂閱方案 & 人員分工",
        sub: "subscription_plans · David / Cindy / Amy",
        color: T.coral, bg: T.corals,
        tags: ["訂閱", "分工"],
        badge: "最新",
      },
      {
        path: "/db",
        icon: "🗄",
        title: "資料庫設計",
        sub: "ERD · 14 張資料表 · 多租戶 · 登入流程",
        color: T.sage, bg: T.ss,
        tags: ["ERD", "SQL"],
      },
      {
        path: "/flex",
        icon: "🔧",
        title: "彈性架構設計",
        sub: "空間 / 課程 / 方案 · JSONB 規則 · 帳本",
        color: T.amb, bg: T.ambs,
        tags: ["空間", "方案"],
      },
      {
        path: "/arch",
        icon: "🏗",
        title: "系統架構總覽",
        sub: "多租戶三層架構 · JWT · RBAC · 技術棧",
        color: T.mist, bg: T.mists,
        tags: ["架構", "JWT"],
      },
    ],
  },
];

const PORTAL_SHORTCUTS = [
  { label:"學員前台", path:"/member/app", color:T.green, bg:T.greens, icon:"📱" },
  { label:"公司後台", path:"/manage/checkin", color:T.rose, bg:T.rs, icon:"🏢" },
  { label:"經銷商平台", path:"/reseller", color:T.amb, bg:T.ambs, icon:"🤝" },
  { label:"Super Admin", path:"/superadmin/app", color:T.lav, bg:T.lavs, icon:"🔐" },
];

export default function DesignHub() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Noto Sans TC',sans-serif" }}>
      {/* Header */}
      <div style={{ background:T.ink, padding:"20px clamp(16px,4vw,40px) 18px", borderBottom:`3px solid ${T.rose}` }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:14, marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:T.rose, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🌿</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
              <span style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:22, fontWeight:300, color:"#F5F2EE", letterSpacing:".08em" }}>Cora</span>
              <span style={{ fontFamily:"Georgia,serif", fontSize:23, fontWeight:400, color:T.rose, letterSpacing:".06em", fontStyle:"italic" }}>Times</span>
            </div>
          </div>
          <div style={{ width:1, height:24, background:"rgba(255,255,255,.15)" }} />
          <span style={{ fontSize:13, color:"rgba(255,255,255,.5)", letterSpacing:".08em" }}>Design Review</span>
        </div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", letterSpacing:".06em" }}>
          創芯時光 · Cora Times · coratimes.com
        </div>
      </div>

      <div style={{ padding:"clamp(16px,4vw,32px) clamp(16px,4vw,40px)", maxWidth:1100, margin:"0 auto" }}>

        {/* 快速入口 */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:24 }}>
          {PORTAL_SHORTCUTS.map(p=>(
            <div key={p.path} onClick={()=>navigate(p.path)}
              style={{ background:p.bg, border:`1.5px solid ${p.color}30`, borderRadius:14, padding:"16px 18px",
                       cursor:"pointer", display:"flex", alignItems:"center", gap:12,
                       transition:"all .18s" }}
              onMouseEnter={e=>{ e.currentTarget.style.border=`1.5px solid ${p.color}`; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.border=`1.5px solid ${p.color}30`; e.currentTarget.style.transform="translateY(0)"; }}>
              <div style={{ fontSize:24 }}>{p.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:p.color }}>{p.label}</div>
                <div style={{ fontSize:10, color:T.i3, marginTop:2 }}>點擊進入 →</div>
              </div>
            </div>
          ))}
        </div>

        {/* Intro */}
        <div style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:16, padding:"16px 20px",
                      marginBottom:28, display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:500, color:T.ink, marginBottom:4 }}>
              Cora Times（創芯時光）設計稿 — 互動展示
            </div>
            <div style={{ fontSize:12, color:T.i3, lineHeight:1.7 }}>
              包含品牌視覺、學員前台 APP、公司後台管理介面、SaaS 管理層，以及系統架構設計。所有頁面均為可互動的高保真原型。
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0 }}>
            {[
              ["app.coratimes.com",    T.green],
              ["manage.coratimes.com", T.rose],
              ["admin.coratimes.com",  T.lav],
            ].map(([url, color]) => (
              <div key={url} style={{ fontSize:10, fontFamily:"monospace", padding:"3px 10px", borderRadius:20,
                background:T.bg, color, border:`1px solid ${color}30` }}>{url}</div>
            ))}
          </div>
        </div>

        {/* Sections */}
        {sections.map(sec => (
          <div key={sec.group} style={{ marginBottom:28 }}>
            <div style={{ fontSize:11, color:T.i3, letterSpacing:".12em", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ textTransform:"uppercase" }}>{sec.group}</span>
              <div style={{ flex:1, height:1, background:T.bd }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(220px,100%),1fr))", gap:10 }}>
              {sec.items.map(item => (
                <div key={item.path+item.title}
                  onClick={() => navigate(item.path)}
                  style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:14, padding:"16px 18px",
                           cursor:"pointer", transition:"all .18s", position:"relative", overflow:"hidden" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `1px solid ${item.color}`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}20`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = `1px solid ${T.bd}`;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:item.color, opacity:.6 }} />
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10, marginTop:4 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10,
                        background:item.badge==="前台"?T.greens:item.badge==="升級"?T.ambs:item.color,
                        color:item.badge==="前台"?T.green:item.badge==="升級"?T.amb:T.sf,
                        fontWeight:600, letterSpacing:".04em",
                        border:`1px solid ${item.badge==="前台"?T.green+"40":item.badge==="升級"?T.amb+"40":item.color+"40"}` }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:T.ink, marginBottom:4 }}>{item.title}</div>
                  <div style={{ fontSize:11, color:T.i3, marginBottom:10, lineHeight:1.5 }}>{item.sub}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {item.tags.map(tag => (
                      <span key={tag} style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:item.bg, color:item.color, fontWeight:500 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ position:"absolute", bottom:14, right:16, fontSize:16, color:item.color, opacity:.5 }}>→</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 規格文件 */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:11, color:T.i3, letterSpacing:".12em", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ textTransform:"uppercase" }}>規格文件</span>
            <div style={{ flex:1, height:1, background:T.bd }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { pdf:"CoraTimesSpec_v1.0.pdf", docx:"CoraTimesSpec_v1.0.docx", icon:"📄", label:"系統規格書", sub:"v1.0 · 功能規格 · 角色權限 · 訂閱方案 · 分工", pages:"9 章" },
              { pdf:"CoraTimesFlexSpec_v1.0.pdf", docx:"CoraTimesFlexSpec_v1.0.docx", icon:"🗄", label:"彈性架構規格書", sub:"v1.0 · 空間 · 課程 · 方案 · 訂閱 DB 設計", pages:"9 章" },
              { pdf:"CoraTimesWBS.pdf", xlsx:"CoraTimesWBS.xlsx", icon:"📊", label:"WBS 工作分解", sub:"68 天 · 關鍵路徑 · 甘特圖 · 人力分配", pages:"3 表" },
            ].map(d => (
              <div key={d.pdf} style={{ background:T.sf, border:`1px solid ${T.bd}`, borderRadius:12,
                padding:"13px 16px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:22, flexShrink:0 }}>{d.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:T.ink }}>{d.label}</div>
                  <div style={{ fontSize:11, color:T.i3, marginTop:2 }}>{d.sub}</div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <a href={`/docs/${d.pdf}`} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
                    <div style={{ padding:"5px 11px", borderRadius:20, border:`1px solid ${T.rose}`, background:T.rs, color:T.rm, fontSize:11, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap" }}>線上閱讀</div>
                  </a>
                  <a href={`/docs/${d.docx || d.xlsx}`} download style={{ textDecoration:"none" }}>
                    <div style={{ padding:"5px 11px", borderRadius:20, border:`1px solid ${T.bd2}`, background:T.sf, color:T.i2, fontSize:11, cursor:"pointer", whiteSpace:"nowrap" }}>下載原檔</div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop:`1px solid ${T.bd}`, paddingTop:16, marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:11, color:T.i3 }}>創芯時光 Cora Times · coratimes.com</div>
          <div style={{ fontSize:11, color:T.i3 }}>Design Review v1.0 · 2026</div>
        </div>
      </div>
    </div>
  );
}
