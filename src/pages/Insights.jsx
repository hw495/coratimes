import Topbar from "../components/Topbar";
import Btn from "../components/Btn";
import { insights } from "../data/mock";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import s from "./Insights.module.css";

export default function Insights() {
  const kpis = [
    { l: "本月收入",  v: `$${insights.revenue.toLocaleString()}`, d: `↑ ${insights.revGrowth}%`, up: true  },
    { l: "總場次",    v: insights.sessions,                        d: `↑ ${insights.sessGrowth} 場`, up: true  },
    { l: "到場率",    v: `${insights.attendance}%`,               d: `↓ ${Math.abs(insights.attGrowth)}%`, up: false },
    { l: "在籍學員",  v: insights.students,                        d: `↑ ${insights.studGrowth} 位`, up: true  },
  ];

  return (
    <div className={s.page}>
      <Topbar title="洞察">
        <select className={s.sel}><option>2026 年 5 月</option><option>2026 年 4 月</option></select>
        <Btn>匯出</Btn>
      </Topbar>
      <div className={s.body}>
        <div className={s.krow}>
          {kpis.map(k => (
            <div key={k.l} className={s.kcard}>
              <div className={s.kl}>{k.l}</div>
              <div className={s.kv}>{k.v}</div>
              <div className={s.kd} style={{ color: k.up ? "var(--sm)" : "var(--rose)" }}>{k.d}</div>
            </div>
          ))}
        </div>
        <div className={s.charts}>
          <div className={s.chartCard}>
            <div className={s.chartTitle}>場次排行</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={insights.topCourses} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "var(--i3)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--i2)" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--bd)" }} />
                <Bar dataKey="count" fill="var(--rose)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={s.chartCard}>
            <div className={s.chartTitle}>時光類型分布</div>
            <div className={s.donutRow}>
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={insights.typeBreakdown} dataKey="value" innerRadius={36} outerRadius={54} paddingAngle={2}>
                    {insights.typeBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className={s.legend}>
                {insights.typeBreakdown.map(e => (
                  <div key={e.name} className={s.legRow}>
                    <div className={s.legDot} style={{ background: e.color }} />
                    <span className={s.legName}>{e.name}</span>
                    <span className={s.legVal}>{e.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
