import React, { useState } from 'react'
import SidebarMainAdmin from '../../components/sidebarMainAdmin/sidebarMainAdmin'
import Navbar from '../../components/navbar/navbar'
import Card from '../../components/card/card'
import './mainadmin.css'
import LineChart from '../../components/flaggedcomment/linecharts'
import BarChartComponent from '../../components/flaggedcomment/barcharts'
const Mainadmin = () => {

    const [sidebarVisible, setSidebarVisible] = useState(true);
 
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  return (
    <div className='mainadmin'>
      {sidebarVisible && <SidebarMainAdmin/>}
        { <Navbar toggleSidebar={toggleSidebar}/>} 
    <div className='admin'>
      
        <section className='cards'>
          <Card/>
        </section>

        <div style={{display:"flex", justifyContent:"center"}}>
        <section className='cards'>
          <BarChartComponent/>
        </section>
        <section className='cards'>
          <LineChart  />
        </section>
       
        </div>
    </div>
    </div>
  )
}

export default Mainadmin
