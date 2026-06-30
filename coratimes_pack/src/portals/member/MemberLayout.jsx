import { Outlet } from "react-router-dom";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import MemberSidebar from "./MemberSidebar";

export default function MemberLayout() {
  const { isMobile } = useBreakpoint();
  return (
    <div style={{ display:"flex", minHeight:"calc(100vh - 38px)",
      paddingBottom: isMobile ? 60 : 0, background:"#FAF8F5" }}>
      {!isMobile && <MemberSidebar />}
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <Outlet />
      </div>
      {isMobile && <MemberSidebar />}
    </div>
  );
}
