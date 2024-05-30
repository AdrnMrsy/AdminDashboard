import React, { useState } from 'react'
import SignUpForm from '../../components/importcreate/importcreate'
import Navbar from '../../components/navbar/navbar'
import SidebarMainAdmin from '../../components/sidebarMainAdmin/sidebarMainAdmin'
 
const Massnew = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
 
    const toggleSidebar = () => {
      setSidebarVisible(!sidebarVisible);
    };
    return (
      <div style={{display:"flex"}}>
        {sidebarVisible && <SidebarMainAdmin/>}
          { <Navbar toggleSidebar={toggleSidebar}/>} 
          <div style={{flex:"10"}}>
            <SignUpForm/>
          </div>
    </div>
  )
}

export default Massnew
