import "./navbar.css"
//import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { auth } from "../../firebase";


const Navbar = ({ toggleSidebar ,toggleNotification }) => {
  const [currentUser, setCurrentUser] = useState(null); // State to hold the current user object
  const [notificationVisible, setNotificationVisible] = useState(false);

  const toggleNotificationVisibility = () => {
    setNotificationVisible(!notificationVisible);
    toggleNotification(); // Inform Home component about notification toggle
  };


  useEffect(() => {
    // Firebase listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, update the current user state
        setCurrentUser(user);
      } else {
        // No user is signed in, set current user state to null
        setCurrentUser(null);
      }
    });

    return () => {
      // Cleanup function to unsubscribe from the listener when component unmounts
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // Function to get the UID of the current user
  const getCurrentUserId = () => {
    if (currentUser) {
      return currentUser.uid; // Return the UID if the user is authenticated
    } else {
      return null; // Return null if no user is authenticated
    }
  };
  return (
    <div className='navbar'>
      <div className="logoWrapper">
        <span className="logo">Guidance</span>
        
      </div>
      <div className="item">
        <button onClick={toggleSidebar} className="buttonmenu">
          <MenuIcon className="iconmui"/>
        </button>
            
        </div>
      <div className="items">
        {/* <div className="item" onClick={toggleNotificationVisibility}>
          <NotificationsIcon className="iconmui" />
        
        </div> */}
        
        {/* <div className="item">
          <Link to={`/${getCurrentUserId()}`} style={{ textDecoration: 'none' }}>
            <AccountCircleIcon className="avatar"/>
          </Link>
        </div> */}
        </div>
      
    </div>
  )
}

export default Navbar
