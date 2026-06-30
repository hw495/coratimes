import { useState } from "react";
import Topbar from "../components/Topbar";
import Btn from "../components/Btn";
import { todaySessions, members } from "../data/mock";
import s from "./CheckIn.module.css";
import { useBreakpoint } from "../hooks/useBreakpoint";

const typeLabel = { solo: "專屬陪練", group: "小班共練", space: "空間借用" };
const typeBorder = { solo: "#C4957A", group: "#9B8FAE", space: "#B8924A", paused: "#D6CCC0" };

export default function CheckIn() {
  const { isMobile } = useBreakpoint();
  const [sessions, setSessions] = useState(todaySessions);
  const [showDetail, setShowDetail] = useState(false);
  const [activeId, setActiveId] = useState(1);

  const active = sessions.find(s => s.id === activeId);
  const arrived = sessions.reduce((a, s) => a + s.attendees.filter(x => x.arrived).length, 0);
  const absent  = sessions.reduce((a, s) => a + s.attendees.filter(x => !x.arrived).length, 0);

  function toggle(sessId, memberId) {
    setSessions(prev => prev.map(sess =>
      sess.id !== sessId ? sess : {
        ...sess,
        attendees: sess.attendees.map(at =>
          at.memberId !== memberId ? at : { ...at, arrived: !at.arrived }
        )
      }
    ));
  }

  return (
    <div className={s.page}>
      <Topbar title="今日簽到">
        <Btn>◀</Btn>
        <span className={s.dateChip}>5 月 19 日・周二</span>
        <Btn>今天</Btn>
        <Btn>▶</Btn>
        <span className={s.sep} />
        <Btn>QR 簽到碼</Btn>
        <Btn variant="primary">＋ 新增預留</Btn>
      </Topbar>

      <div className={s.body}>
        <div className={s.krow}>
          {[
            { label: "今日場次", value: sessions.length, accent: false },
            { label: "已到場",   value: arrived, accent: true },
            { label: "未到",     value: absent,  accent: false },
            { label: "取消預留", value: 0,        accent: false },
          ].map(k => (
            <div key={k.label} className={s.kcard}>
              <div className={s.klabel}>{k.label}</div>
              <div className={s.kvalue} style={k.accent ? { color: "var(--sage)" } : {}}>{k.value}</div>
            </div>
          ))}
        </div>

        <div className={s.two} style={isMobile ? {display:"block"} : {}}>
          <div className={s.panel} style={isMobile&&showDetail?{display:"none"}:{}}>
            <div className={s.ph}><span className={s.phTitle}>今日場次</span><span className={s.phMeta}>{sessions.length} 場</span></div>
            {sessions.map(sess => (
              <div
                key={sess.id}
                className={`${s.si} ${sess.id === activeId ? s.siActive : ""}`}
                onClick={() => { setActiveId(sess.id); if(isMobile) setShowDetail(true); }}
              >
                <span className={s.siTime}>{sess.time}</span>
                <div className={s.siBar} style={{ background: typeBorder[sess.type] || "#D6CCC0" }} />
                <div className={s.siInfo}>
                  <div className={s.siName}>{sess.course}</div>
                  <div className={s.siMeta}>{sess.coach}・{sess.room}</div>
                </div>
                <span className={s.siBadge} style={
                  sess.quota === 0
                    ? { background: "var(--rs)", color: "var(--rm)" }
                    : { background: "var(--ss)", color: "var(--sm)" }
                }>{sess.quota}/{sess.max}</span>
              </div>
            ))}
          </div>

          <div className={s.panel}>
            {isMobile && showDetail && (
              <button onClick={()=>setShowDetail(false)} style={{display:"flex",alignItems:"center",gap:5,padding:"10px 14px",borderBottom:"1px solid var(--bd)",background:"none",border:"none",borderBottom:"1px solid var(--bd)",width:"100%",fontSize:12,color:"var(--rm)",cursor:"pointer",fontFamily:"inherit"}}>← 返回場次列表</button>
            )}
            {active && (
              <>
                <div className={s.ph}>
                  <div>
                    <div className={s.phTitle}>{active.course}</div>
                    <div className={s.phMeta2}>{active.time}–{active.end}・{active.room}・{active.coach}</div>
                  </div>
                  <span className={s.typeTag}>{typeLabel[active.type] || active.type}</span>
                </div>
                <div className={s.detailBody}>
                  <div className={s.sectionLabel}>學員名單</div>
                  {active.attendees.length === 0 && (
                    <div className={s.empty}>此場次目前無預留學員</div>
                  )}
                  {active.attendees.map(at => {
                    const member = members.find(m => m.id === at.memberId);
                    if (!member) return null;
                    const pass = member.passes[0];
                    const hasHealthFlag = member.healthForm && member.healthFlagged;
                    return (
                      <div key={at.memberId}>
                        <div className={s.atRow} style={hasHealthFlag ? { borderLeft:"3px solid #E53935", paddingLeft:9 } : {}}>
                          <div className={s.atAv} style={{ background: member.bg, color: member.color }}>{member.initial}</div>
                          <div className={s.atInfo}>
                            <div className={s.atName} style={{ display:"flex", alignItems:"center", gap:6 }}>
                              {member.name}
                              {hasHealthFlag && (
                                <span title="健康狀況請留意" style={{ fontSize:10, padding:"1px 7px", borderRadius:10, background:"#FDECEA", color:"#C62828", fontWeight:600, display:"inline-flex", alignItems:"center", gap:3 }}>
                                  ⚠ 健康留意
                                </span>
                              )}
                            </div>
                            {pass && <div className={s.atPlan}>{pass.name}・剩 {pass.remain} 次</div>}
                          </div>
                          <button
                            className={`${s.tog} ${at.arrived ? s.togOn : s.togOff}`}
                            onClick={() => toggle(active.id, at.memberId)}
                            aria-label="切換到場"
                          />
                          <div className={s.atBtns}>
                            <button className={s.atBtn}>備忘</button>
                            <button className={`${s.atBtn} ${s.atBtnDanger}`}>取消</button>
                          </div>
                        </div>
                        {hasHealthFlag && (
                          <div style={{ margin:"2px 0 10px 46px", padding:"7px 11px", background:"#FDECEA", border:"1px solid #F5C6C2", borderRadius:8, fontSize:11, color:"#C62828", lineHeight:1.6 }}>
                            ⚠ <strong>{member.healthNote || "學員填寫健康評估表時標註身體狀況，請於指導時留意並調整動作強度。"}</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className={s.divider} />
                  {active.attendees[0] && (() => {
                    const member = members.find(m => m.id === active.attendees[0].memberId);
                    const pass = member?.passes[0];
                    if (!pass) return null;
                    return (
                      <div className={s.tiles}>
                        <div className={s.tile}><div className={s.tileLabel}>方案名稱</div><div className={s.tileVal}>{pass.name}</div></div>
                        <div className={s.tile}><div className={s.tileLabel}>本次扣除</div><div className={s.tileVal}>1 次</div></div>
                        <div className={s.tile}><div className={s.tileLabel}>剩餘次數</div><div className={s.tileVal} style={{ color: "var(--sm)", fontWeight: 500 }}>{pass.remain} 次</div></div>
                        <div className={s.tile}><div className={s.tileLabel}>有效期限</div><div className={s.tileVal}>{pass.expiry}</div></div>
                      </div>
                    );
                  })()}
                  <div className={s.notice}>ℹ 確認到場後將自動扣除一次。</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
