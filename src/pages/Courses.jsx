import Topbar from "../components/Topbar";
export default function Courses() {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
      <Topbar title="Courses" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--i3)",fontSize:13}}>
        Courses 頁面 — 開發中
      </div>
    </div>
  );
}
