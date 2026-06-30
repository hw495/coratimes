import Topbar from "../components/Topbar";
export default function Contracts() {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
      <Topbar title="Contracts" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--i3)",fontSize:13}}>
        Contracts 頁面 — 開發中
      </div>
    </div>
  );
}
