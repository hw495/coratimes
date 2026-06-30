import Topbar from "../components/Topbar";
export default function Settings() {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
      <Topbar title="Settings" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--i3)",fontSize:13}}>
        Settings 頁面 — 開發中
      </div>
    </div>
  );
}
