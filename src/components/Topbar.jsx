import s from "./Topbar.module.css";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function Topbar({ title, children }) {
  const { isMobile } = useBreakpoint();
  return (
    <div className={s.topbar}>
      <h1 className={s.title}>{title}</h1>
      {!isMobile && <div className={s.actions}>{children}</div>}
      {isMobile && <div className={s.mobileActions}>
        {Array.isArray(children)
          ? children.filter(c => c?.props?.variant === "primary")
          : children?.props?.variant === "primary" ? children : null}
      </div>}
    </div>
  );
}
