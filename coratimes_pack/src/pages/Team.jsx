import Topbar from "../components/Topbar";
export default function Team() {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
      <Topbar title="Team" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--i3)",fontSize:13}}>
        Team 頁面 — 開發中
      </div>
    </div>
  );
}
