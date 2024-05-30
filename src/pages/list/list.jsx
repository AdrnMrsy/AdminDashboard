import "./list.css"
import Navbar from "../../components/navbar/navbar"
import Datatable from "../../components/datatable/datatable"
import { useState } from "react"
import SidebarMainAdmin from "../../components/sidebarMainAdmin/sidebarMainAdmin"

const List = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
 
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }
  return (
    <div className="list">
      {sidebarVisible && <SidebarMainAdmin />}
      <Navbar toggleSidebar={toggleSidebar}/>

      <div className="listContainer">
        <Datatable/>

      </div>
    </div>
  )
}

export default List
