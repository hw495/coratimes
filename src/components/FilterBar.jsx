/**
 * FilterBar — 通用篩選列元件
 * props:
 *   filters: [{ key, label, options: [{value, label}] }]
 *   values:  { [key]: value }
 *   onChange: (key, value) => void
 *   search:  string (可選)
 *   onSearch: (val) => void (可選)
 *   searchPlaceholder: string
 *   onReset: () => void
 *   resultCount: number (可選)
 */
export default function FilterBar({
  filters = [], values = {}, onChange,
  search, onSearch, searchPlaceholder = "搜尋…",
  onReset, resultCount,
}) {
  const hasActive = search || filters.some(f => values[f.key] && values[f.key] !== "all");
  const sel = {
    border: "1px solid #D6CCC0", borderRadius: 20, padding: "6px 12px",
    fontSize: 12, color: "#3A3530", fontFamily: "inherit", outline: "none",
    background: "#fff", cursor: "pointer", appearance: "none",
    paddingRight: 26, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A89E94' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  };
  return (
    <div style={{
      display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8,
      padding: "10px 0 14px", marginBottom: 4,
    }}>
      {/* 搜尋框 */}
      {onSearch !== undefined && (
        <div style={{ position: "relative", flexShrink: 0 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#A89E94" }}>🔍</span>
          <input
            value={search} onChange={e => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            style={{ border: "1px solid #D6CCC0", borderRadius: 20, padding: "6px 12px 6px 30px", fontSize: 12, color: "#3A3530", outline: "none", fontFamily: "inherit", width: 160 }}
          />
        </div>
      )}

      {/* 篩選 dropdowns */}
      {filters.map(f => {
        const active = values[f.key] && values[f.key] !== "all";
        return (
          <div key={f.key} style={{ position: "relative" }}>
            <select
              value={values[f.key] || "all"}
              onChange={e => onChange(f.key, e.target.value)}
              style={{ ...sel, borderColor: active ? "#C4957A" : "#D6CCC0", color: active ? "#A87A62" : "#3A3530", background: active ? "#F5ECE6" : "#fff", fontWeight: active ? 500 : 400 }}
            >
              <option value="all">{f.label}</option>
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        );
      })}

      {/* 重設 */}
      {hasActive && (
        <button onClick={onReset}
          style={{ fontSize: 11, color: "#C4957A", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "4px 6px" }}>
          ✕ 清除篩選
        </button>
      )}

      {/* 結果計數 */}
      {resultCount !== undefined && (
        <span style={{ fontSize: 11, color: "#A89E94", marginLeft: "auto" }}>
          共 {resultCount} 筆
        </span>
      )}
    </div>
  );
}
