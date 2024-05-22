import React, { useState } from 'react';
import SidebarMainAdmin from '../../components/sidebarMainAdmin/sidebarMainAdmin';
import Navbar from '../../components/navbar/navbar';
import FlaggedComments from '../../components/flaggedcomment/flaggedcomment';
import LoginHistory from '../../components/flaggedcomment/loginhistory';
import Scheduletable from '../../components/flaggedcomment/scheduletable';
import Messagetable from '../../components/flaggedcomment/messagetable';
import Questions from '../../components/flaggedcomment/questions';
import Users from '../../components/flaggedcomment/users';
import Reportedtable from '../../components/flaggedcomment/reported';

const Report = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedSection, setSelectedSection] = useState('LoginHistory');

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleChangeSection = (section) => {
    setSelectedSection(section);
  };
  
  return (
    
      <div style={{ display:"flex"}}>
        {sidebarVisible && <SidebarMainAdmin />}
        <Navbar toggleSidebar={toggleSidebar} />
      
      <div style={{ width:"100px", flex:"10",paddingLeft:"20px",paddingRight:"20px",paddingBottom:"20px", marginTop:"70px"}}>
        <select value={selectedSection} onChange={(e) => handleChangeSection(e.target.value)} 
        style={{ width:"200px", height:"40px", fontSize:"25px" ,marginBottom:"20px",
          border:"none",    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
          borderRadius:"5px",
          fontSize: "16px", /* Change the font size */
    padding: "8px" /* Change the padding */,marginLeft:"20px",

         }}>
          <option value="LoginHistory">Login History</option>
          <option value="Schedules">Schedule Table</option>
          <option value="Messages">Message Table</option>
          <option value="FlaggedComments">Flagged Comments</option>
          <option value="Questions">Questions</option>
          <option value="ReportedMessages">Reported Messages</option>


        </select>
        
        {selectedSection === 'LoginHistory' && <LoginHistory />}
        {selectedSection === 'Schedules' && <Scheduletable />}
        {selectedSection === 'Messages' && <Messagetable />}
        {selectedSection === 'FlaggedComments' && <FlaggedComments />}
        {selectedSection === 'Questions' && <Questions />}
        {selectedSection === 'Users' && <Users />}
        {selectedSection === 'ReportedMessages' && <Reportedtable />}


      </div>
    </div>
  );
};

export default Report;
