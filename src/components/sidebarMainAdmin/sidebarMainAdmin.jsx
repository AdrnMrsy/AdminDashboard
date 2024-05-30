import React from 'react';
import './sidebarMainAdmin.css';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
//import EventNoteIcon from '@mui/icons-material/EventNote';
//import ChatIcon from '@mui/icons-material/Chat';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ArticleIcon from '@mui/icons-material/Article';

const SidebarMainAdmin = () => {
  const { dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className='sidebar'>
      <div className="center">
        <ul>
          <p className="titleadmin">Main</p>
          <Link to="/mainadmin" className="nav-link">
            <li>
              <HomeIcon />
              <span className="nav">Dashboard</span>
            </li>
          </Link>
          <Link to="/users" className="nav-link">
            <p className="titleadmin">User</p>
            <li>
              <PeopleAltIcon className="icon" />
              <span className="nav">Users</span>
            </li>
          </Link>
          {/* <Link to="/calendar" className="nav-link">
            <li>
              <EventNoteIcon />
              <span className="nav">Schedules</span>
            </li>
          </Link>
          <Link to="/chats" className="nav-link">
            <li>
            <ChatIcon />
            <span className="nav">Chat</span>
          </li>
          </Link>
           */}
          
          {/* <li>
            <AccountCircleIcon />
            <span className="nav">Profile</span>
          </li> */}
<p className="titleadmin">Reports</p>
          <Link to="/report" className="nav-link">
          <li>
            <ArticleIcon />
            <span className="nav">Reports</span>
          </li>
          </Link>
          
          <li>
            <PowerSettingsNewIcon  className="iconic"/>
            <span className="nav"onClick={handleLogout} >Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarMainAdmin;
