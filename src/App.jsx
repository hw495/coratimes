import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useBreakpoint } from "./hooks/useBreakpoint";
import DesignNav from "./components/DesignNav";

// Design hub
import DesignHub       from "./pages/DesignHub";
import CoraTimesDesign from "./pages/CoraTimesDesign";
import CoraDbDesign    from "./pages/CoraDbDesign";
import CoraFlexDesign  from "./pages/CoraFlexDesign";
import CoraFlexArch    from "./pages/CoraFlexArch";
import CoraTimesBrand  from "./pages/CoraTimesBrand";
import PostureAppFlow  from "./pages/PostureAppFlow";
import ResellerPortal from "./pages/ResellerPortal";

// Login pages
import { MemberLogin, CompanyLogin, SuperLogin } from "./pages/CORALoginPages";

// Member portal
import MemberLayout from "./portals/member/MemberLayout";
import {
  MemberHome, MemberCourses, MemberCoaches, MemberSchedule,
  MemberBooking, MemberPasses, MemberHistory, MemberContracts, MemberProfile, MemberPosture, MemberHealthForm,
} from "./portals/member/MemberPages";

// Manage portal
import Sidebar  from "./components/Sidebar";
import CheckIn  from "./pages/CheckIn";
import Calendar from "./pages/Calendar";
import Plans    from "./pages/Plans";
import Members  from "./pages/Members";
import Payments from "./pages/Payments";
import Insights from "./pages/Insights";
import { Schedule, Courses, Coaches, Settings, Contracts, Team, PostureReports } from "./portals/manage/ManagePages";

// Super Admin portal
import {
  SuperAdminLayout, SACompanies, SAPlans, SABilling,
  SAInsights, SAAnnounce, SASettings, SAResellers,
} from "./portals/superadmin/SuperAdminPortal";

import "./index.css";

// ─────────────────────────────────────────────────────────────
// Shared wrapper：頂部導覽列
// ─────────────────────────────────────────────────────────────
function WithNav({ children }) {
  return (
    <>
      <DesignNav />
      <div style={{ paddingTop: 38 }}>{children}</div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 登入頁元件（加 onLogin callback）
// ─────────────────────────────────────────────────────────────
const BG = { member:"#F0EDE8", manage:"#F0EDE8", superadmin:"#0C0C0C" };

function MemberLoginPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:"calc(100vh - 38px)", background:BG.member,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:900, borderRadius:20, overflow:"hidden",
        boxShadow:"0 24px 72px rgba(58,53,48,.18)" }}>
        <MemberLogin onLogin={() => navigate("/member/app")} />
      </div>
    </div>
  );
}

function CompanyLoginPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:"calc(100vh - 38px)", background:BG.manage,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:900, borderRadius:20, overflow:"hidden",
        boxShadow:"0 24px 72px rgba(58,53,48,.18)" }}>
        <CompanyLogin onLogin={() => navigate("/manage/checkin")} />
      </div>
    </div>
  );
}

function SuperLoginPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:"calc(100vh - 38px)", background:BG.superadmin,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:900, borderRadius:20, overflow:"hidden",
        boxShadow:"0 24px 72px rgba(0,0,0,.6)" }}>
        <SuperLogin onLogin={() => navigate("/superadmin/app")} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 公司後台（含 Sidebar）
// ─────────────────────────────────────────────────────────────
function ManageApp() {
  const { isMobile } = useBreakpoint();
  return (
    <div style={{ display:"flex", height:"calc(100vh - 38px)",
      paddingBottom: isMobile ? 60 : 0 }}>
      <Sidebar />
      <div style={{ flex:1, overflow:"hidden" }}>
        <Routes>
          <Route index             element={<Navigate to="checkin" replace />} />
          <Route path="checkin"   element={<CheckIn />} />
          <Route path="calendar"  element={<Calendar />} />
          <Route path="schedule"  element={<Schedule />} />
          <Route path="courses"   element={<Courses />} />
          <Route path="plans"     element={<Plans />} />
          <Route path="members"   element={<Members />} />
          <Route path="coaches"   element={<Coaches />} />
          <Route path="payments"  element={<Payments />} />
          <Route path="insights"  element={<Insights />} />
          <Route path="settings"  element={<Settings />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="team"      element={<Team />} />
          <Route path="posture"    element={<PostureReports />} />
        </Routes>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <WithNav>
        <Routes>
          {/* ── Hub 首頁 ── */}
          <Route path="/"       element={<DesignHub />} />
          <Route path="/design" element={<CoraTimesDesign />} />
          <Route path="/db"     element={<CoraDbDesign />} />
          <Route path="/flex"   element={<CoraFlexDesign />} />
          <Route path="/arch"   element={<CoraFlexArch />} />
          <Route path="/brand"  element={<CoraTimesBrand />} />
          <Route path="/posture" element={<PostureAppFlow />} />
          <Route path="/reseller/*" element={<ResellerPortal />} />

          {/* ── 學員前台 ──
               /member       → 登入頁
               /member/app/* → 功能頁（有 sidebar） */}
          <Route path="/member"       element={<MemberLoginPage />} />
          <Route path="/member/app"   element={<MemberLayout />}>
            <Route index              element={<MemberHome />} />
            <Route path="courses"     element={<MemberCourses />} />
            <Route path="coaches"     element={<MemberCoaches />} />
            <Route path="schedule"    element={<MemberSchedule />} />
            <Route path="booking"     element={<MemberBooking />} />
            <Route path="passes"      element={<MemberPasses />} />
            <Route path="history"     element={<MemberHistory />} />
            <Route path="contracts"   element={<MemberContracts />} />
            <Route path="profile"     element={<MemberProfile />} />
            <Route path="posture"     element={<MemberPosture />} />
            <Route path="health"      element={<MemberHealthForm />} />
          </Route>

          {/* ── 公司後台 ──
               /manage       → 登入頁
               /manage/*     → 功能頁（有 sidebar） */}
          <Route path="/manage"    element={<CompanyLoginPage />} />
          <Route path="/manage/*"  element={<ManageApp />} />

          {/* ── Super Admin ──
               /superadmin       → 登入頁
               /superadmin/app/* → 功能頁（有 sidebar） */}
          <Route path="/superadmin"       element={<SuperLoginPage />} />
          <Route path="/superadmin/app"   element={<SuperAdminLayout />}>
            <Route index                  element={<SACompanies />} />
            <Route path="plans"           element={<SAPlans />} />
            <Route path="billing"         element={<SABilling />} />
            <Route path="resellers"       element={<SAResellers />} />
            <Route path="insights"        element={<SAInsights />} />
            <Route path="announce"        element={<SAAnnounce />} />
            <Route path="settings"        element={<SASettings />} />
          </Route>
        </Routes>
      </WithNav>
    </BrowserRouter>
  );
}
