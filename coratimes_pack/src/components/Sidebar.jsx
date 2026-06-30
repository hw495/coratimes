import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";
import s from "./Sidebar.module.css";

const nav = [
  { group: "日常", items: [
    { to: "/manage/checkin",   icon: "🌿", label: "今日簽到" },
    { to: "/manage/calendar",  icon: "🗓",  label: "時光表"   },
    { to: "/manage/schedule",  icon: "⊞",  label: "排班"     },
  ]},
  { group: "內容", items: [
    { to: "/manage/courses",   icon: "🌱", label: "課程庫" },
    { to: "/manage/plans",     icon: "🎫", label: "方案"   },
    { to: "/manage/members",   icon: "👥", label: "學員"   },
    { to: "/manage/coaches",   icon: "🤍", label: "教練"   },
    { to: "/manage/posture",   icon: "🩻", label: "體態評估" },
  ]},
  { group: "財務", items: [
    { to: "/manage/payments",  icon: "🧾", label: "收款確認" },
    { to: "/manage/insights",  icon: "✦",  label: "洞察"     },
  ]},
  { group: "設定", items: [
    { to: "/manage/settings",  icon: "⚙",  label: "偏好設定" },
    { to: "/manage/contracts", icon: "📄", label: "服務合約" },
    { to: "/manage/team",      icon: "🛡",  label: "成員管理" },
  ]},
];

const bottomNav = [
  { to: "/manage/checkin",  icon: "🌿", label: "簽到"   },
  { to: "/manage/coaches",  icon: "🤍", label: "教練"   },
  { to: "/manage/members",  icon: "👥", label: "學員"   },
  { to: "/manage/plans",    icon: "🎫", label: "方案"   },
  { to: "/manage/schedule", icon: "⊞",  label: "排班"   },
  { to: "/manage/insights", icon: "✦",  label: "洞察"   },
];

export default function Sidebar() {
  const { isMobile, isTablet } = useBreakpoint();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        {menuOpen && (
          <div className={s.overlay} onClick={() => setMenuOpen(false)}>
            <div className={s.drawer} onClick={e => e.stopPropagation()}>
              <div className={s.drawerHead}>
                <div className={s.brand}>
                  <div className={s.bmark}>🌿</div>
                  <div>
                    <span className={s.bname}>Cora Times</span>
                    <div className={s.bsub}>創芯時光</div>
                  </div>
                </div>
                <button className={s.closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
              </div>
              <div className={s.drawerStudio}><span>🏠</span><span>S.T Pilates</span></div>
              <div className={s.drawerNav}>
                {nav.map(g => (
                  <div key={g.group} className={s.group}>
                    <div className={s.groupLabel}>{g.group}</div>
                    {g.items.map(item => (
                      <NavLink key={item.to} to={item.to}
                        className={({ isActive }) => `${s.navItem} ${isActive ? s.active : ""}`}
                        onClick={() => setMenuOpen(false)}>
                        <span className={s.navIcon}>{item.icon}</span>{item.label}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
              <div className={s.drawerFoot}>
                <div className={s.userRow}>
                  <div className={s.userAv}>E</div>
                  <div><div className={s.userName}>Eddie</div><div className={s.userRole}>創辦人</div></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <nav className={s.bottomNav}>
          {bottomNav.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `${s.bottomItem} ${isActive ? s.bottomActive : ""}`}>
              <span className={s.bottomIcon}>{item.icon}</span>
              <span className={s.bottomLabel}>{item.label}</span>
            </NavLink>
          ))}
          <button className={s.bottomItem} onClick={() => setMenuOpen(true)}>
            <span className={s.bottomIcon}>☰</span>
            <span className={s.bottomLabel}>更多</span>
          </button>
        </nav>
      </>
    );
  }

  if (isTablet) {
    return (
      <aside className={s.sidebarCollapsed}>
        <div className={s.colBrand}><div className={s.bmark}>🌿</div></div>
        <nav className={s.colNav}>
          {nav.flatMap(g => g.items).map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `${s.colItem} ${isActive ? s.colActive : ""}`}
              title={item.label}>
              <span>{item.icon}</span>
            </NavLink>
          ))}
        </nav>
        <div className={s.colFoot}><div className={s.userAv}>E</div></div>
      </aside>
    );
  }

  return (
    <aside className={s.sidebar}>
      <div className={s.top}>
        <div className={s.brand}>
          <div className={s.bmark}>🌿</div>
          <div>
            <span className={s.bname}>Cora Times</span>
            <div className={s.bsub}>創芯時光</div>
          </div>
        </div>
        <div className={s.studio}>
          <span className={s.studioIcon}>🏠</span>
          <span className={s.studioName}>S.T Pilates</span>
        </div>
      </div>
      <nav className={s.nav}>
        {nav.map(g => (
          <div key={g.group} className={s.group}>
            <div className={s.groupLabel}>{g.group}</div>
            {g.items.map(item => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => `${s.navItem} ${isActive ? s.active : ""}`}>
                <span className={s.navIcon}>{item.icon}</span>{item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className={s.foot}>
        <div className={s.userRow}>
          <div className={s.userAv}>E</div>
          <div><div className={s.userName}>Eddie</div><div className={s.userRole}>創辦人</div></div>
          <span style={{ fontSize:13, color:"var(--i3)" }}>⋯</span>
        </div>
      </div>
    </aside>
  );
}
