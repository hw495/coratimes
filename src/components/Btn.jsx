import s from "./Btn.module.css";

export default function Btn({ children, variant = "ghost", onClick, type = "button" }) {
  return (
    <button
      type={type}
      className={`${s.btn} ${s[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
