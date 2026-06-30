import Topbar from "../components/Topbar";
export default function Coaches() {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
      <Topbar title="Coaches" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--i3)",fontSize:13}}>
        Coaches 頁面 — 開發中
      </div>
    </div>
  );
}
