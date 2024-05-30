import "./schedules.css"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import Table from "../../components/table/Table"

const Schedules = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Table/>
      </div>
    </div>
  )
}

export default Schedules
