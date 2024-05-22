import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { NavigationItemAdmin } from "../infotab/infotab";
import MyUsername from '../../userComponents/username/username';
import '../infotab/infotab.css'; // Import your CSS file


const UserProfileAdmin = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  const [isNavActive, setIsNavActive] = useState(false);
  const toggleNav = () => setIsNavActive(!isNavActive);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          // User data found, set it in state
          setUserData(userSnapshot.data());
        } else {
          // User data not found, handle error or show appropriate message
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);
 

  return (
    <div className="container">
    <div className={`navigation ${isNavActive ? 'active' : ''}`}>
      <ul>
        <NavigationItemAdmin icon="person-circle" title={<MyUsername/>} />
        <NavigationItemAdmin to="/" icon="information-circle" title="Info" />
        <NavigationItemAdmin to="/inspotabAdmin" icon="star" title="Inspo" />
        <NavigationItemAdmin to="/communitytabAdmin"icon="chatbubbles" title="Community" />
        <NavigationItemAdmin to="/scheduletabAdmin"icon="calendar" title="Schedule" />
        <NavigationItemAdmin to="/apptabAdmin" icon="rocket" title="App" />
        <NavigationItemAdmin to="/settingstabAdmin"icon="settings" title="Settings" />
      </ul>
    </div>

    <div className={`main ${isNavActive ? 'active' : ''}`}>
      <div className="topbar">
        <div className="toggle" onClick={toggleNav}>
          <ion-icon name="menu-outline"></ion-icon>
        </div>
      </div>


      {userData && ( // Add conditional check for userData
        <div className="cardBox">
          <div className="card">
            <div>
            
            <div className="numbers">{userData.username}</div>
            <div className="cardName">Email: {userData.email} </div>
            <div className="cardName">Address: {userData.address}</div>
            <div className="cardName">Phone: {userData.phone}</div>
            <div className="cardName">Course: {userData.course}</div>
            </div>
            <img
                  src={userData.img} // Assuming img is part of user data
                  alt=""
                  className="itemImg"
                />
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default UserProfileAdmin;
