import { useState, useMemo } from "react";
import Topbar from "../components/Topbar";
import Btn from "../components/Btn";
import { payments } from "../data/mock";
import s from "./Payments.module.css";
import FilterBar from "../components/FilterBar";

export default function Payments() {
  const [items, setItems] = useState(payments);
  const [search, setSearch] = useState("");
  const [pFilters, setPFilters] = useState({ status:"all", method:"all" });
  const setPF = (k,v) => setPFilters(p=>({...p,[k]:v}));
  const resetPFilters = () => { setSearch(""); setPFilters({ status:"all", method:"all" }); };
  const filteredItems = useMemo(() => items.filter(p => {
    if (search && !p.member.includes(search) && !p.plan.includes(search)) return false;
    if (pFilters.status !== "all" && p.status !== pFilters.status) return false;
    if (pFilters.method !== "all" && p.method !== pFilters.method) return false;
    return true;
  }), [items, search, pFilters]);
  function confirm(id) { setItems(prev => prev.map(p => p.id === id ? { ...p, status: "done" } : p)); }
  function reject(id)  { setItems(prev => prev.filter(p => p.id !== id)); }
  const pending = items.filter(p => p.status === "pending");

  return (
    <div className={s.page}>
      <Topbar title="收款確認">
        <Btn>匯出</Btn>
      </Topbar>
      <div className={s.body}>
        <div className={s.krow}>
          {[
            { l:"等待確認", v: pending.length, accent:"var(--amb)" },
            { l:"本月已確認", v: items.filter(x=>x.status==="done").length, accent:"var(--sage)" },
            { l:"本月收入", v: "$142,680", accent:"var(--ink)" },
            { l:"退款", v: 1, accent:"var(--ink)" },
          ].map(k => (
            <div key={k.l} className={s.kcard}>
              <div className={s.kl}>{k.l}</div>
              <div className={s.kv} style={{ color: k.accent }}>{k.v}</div>
            </div>
          ))}
        </div>
        <FilterBar
          search={search} onSearch={setSearch} searchPlaceholder="搜尋學員、方案…"
          filters={[
            { key:"status", label:"所有狀態", options:[{value:"pending",label:"待確認"},{value:"done",label:"已確認"}] },
            { key:"method", label:"收款方式", options:[{value:"ATM",label:"ATM"},{value:"QRCode",label:"QRCode"},{value:"現場",label:"現場"}] },
          ]}
          values={pFilters} onChange={setPF} onReset={resetPFilters}
          resultCount={filteredItems.length}
        />
        <div className={s.tableWrap}>
          <div className={s.tHead}>
            <span>學員</span><span>方案</span><span>金額</span><span>方式</span><span>狀態</span><span>操作</span>
          </div>
          {filteredItems.map(p => (
            <div key={p.id} className={s.tRow}>
              <div className={s.mc}>
                <div className={s.mAv} style={{ background: p.mbg, color: p.mc }}>{p.member[0]}</div>
                <div><div className={s.mn}>{p.member}</div><div className={s.ms}>{p.date}</div></div>
              </div>
              <span className={s.plan}>{p.plan}</span>
              <span className={s.amount}>${p.amount.toLocaleString()}</span>
              <span className={s.method}>{p.method}</span>
              <span className={s.badge} style={p.status === "pending" ? { background:"var(--ambs)", color:"var(--amb)" } : { background:"var(--ss)", color:"var(--sm)" }}>
                {p.status === "pending" ? "待確認" : "已確認"}
              </span>
              <div className={s.acts}>
                {p.status === "pending" && <>
                  <button className={s.cfmBtn} onClick={() => confirm(p.id)}>確認</button>
                  <button className={s.rejBtn} onClick={() => reject(p.id)}>退回</button>
                </>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
