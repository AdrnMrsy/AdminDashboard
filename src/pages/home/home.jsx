import React, { useState } from 'react';
import "./home.css"
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
//import Card from "../../components/card/card";
import NotificationComponent from '../../components/notification/notification';

//import Hero from '../../components/hero/hero';

const Home = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [notificationVisible, setNotificationVisible] = useState(false);

 
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
  };
  return (
    <div className='mainhome'> 
    <div className="home" >
      
      {sidebarVisible && <Sidebar />}
        <div className="homeContainer">
        { <Navbar toggleSidebar={toggleSidebar} toggleNotification={toggleNotification}/>}
        
        <div className="guidance">
        {notificationVisible && <NotificationComponent />}
            </div>
        
    
      
       
        </div>
    </div>
    </div>
  )
}

export default Home
