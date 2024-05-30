import React from 'react';
import './sidebar.css';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className='sidebar'>
      <div className="center">
        <ul>
          <p className="titleadmin">Main</p>
          <Link to="/" className="nav-link">
            <li>
              <HomeIcon />
              <span className="nav">Home</span>
            </li>
          </Link>
          {/* <Link to="/users" className="nav-link">
            <li>
              <PeopleAltIcon className="icon" />
              <span className="nav">Users</span>
            </li>
          </Link> */}
          <Link to="/calendar" className="nav-link">
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
          
          <p className="titleadmin">User</p>
          <li>
            <AccountCircleIcon />
            <span className="nav">Profile</span>
          </li>
          <li>
            <SettingsIcon />
            <span className="nav">Settings</span>
          </li>
          <li>
            <PowerSettingsNewIcon />
            <span onClick={handleLogout} className="nav">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
