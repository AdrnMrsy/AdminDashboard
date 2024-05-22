import React, { useEffect, useState } from 'react';
import '../infotab/infotab.css'; // Import your CSS file
import { NavigationItemAdmin } from '../infotab/infotab';
//import UserCalendar from '../../userComponents/usercalendar/usercalendar';
import Calendar from '../../pages/calendar/calendar';
import MyUsername from '../../userComponents/username/username';
import { GetCurrentUserId } from '../infotab/infotab';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import NotificationModalAdmin from '../../components/notification/notifmodadmin';


function ScheduletabAdmin() {
  const [isNavActive, setIsNavActive] = useState(false);
  const toggleNav = () => setIsNavActive(!isNavActive);
  const [cardData, setCardData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [showSave, setShowSave] = useState(false);


  useEffect(() => {
    const fetchCardData = async () => {
      try {
          const docRef = doc(db, "content", "schedule"); // Create reference to the document
          const docSnap = await getDoc(docRef); // Retrieve the document
          if (docSnap.exists()) { // Check if the document exists
              setCardData(docSnap.data()); // Set the card data
          } else {
              console.log("No such document!");
          }
      } catch (error) {
          console.error("Error fetching card data:", error);
      }
  };
  
  fetchCardData();
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      // User is signed in, get the UID
      const userId = user.uid;

      try {
        // Fetch user data from Firestore based on UID
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          // User data found, set it in state
          setUserData(userSnapshot.data());
          console.log(userData);
        } else {
          // User data not found, handle error or show appropriate message
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      // No user is signed in
      console.log('No user is signed in');
    }
  });

  return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    if (!editMode) {
      // Entering edit mode
      setEditedData(cardData);
      setShowSave(true);
    } else {
      // Exiting edit mode
      setShowSave(false);
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      // Update the document in Firestore
      const docRef = doc(db, "content", "schedule");
      await updateDoc(docRef, editedData);
      
      // Update the card data and exit edit mode
      setCardData(editedData);
      setEditMode(false);
      setShowSave(false);
    } catch (error) {
      console.error("Error updating card data:", error);
    }
  };

  const handleChange = (e) => {
    // Update the edited data when input fields change
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <div className={`navigation ${isNavActive ? 'active' : ''}`}>
      <ul>
      {userData &&(
         <div className={`imageBox ${isNavActive ? 'small' : ''}`} id="image_prof">
         <div className="image">
           {/* <img src="bg_prof.jpg" alt="" /> */}

           <div className="profile-info">
           {userData.img ? (
    <span className="profile">
      <img src={userData.img} alt="prof" width="100%" className="profile" />
    </span>
  ) : (
    <div className="profile" >
      <ion-icon name="person-circle-outline" style={{ fontSize: '150px' }}></ion-icon>
    </div>
  )}             {isNavActive ? null : <div className="name">{<MyUsername/>}</div>}
           </div>
         </div>
       </div>
        )}          <NavigationItemAdmin to="/" icon="information-circle" title="Info" />
          <NavigationItemAdmin to="/inspotabAdmin" icon="star" title="Inspo" />
          <NavigationItemAdmin to="/communitytabAdmin"icon="chatbubbles" title="Community" />
          <NavigationItemAdmin to="/scheduletabAdmin"icon="calendar" title="Schedule" />
          <NavigationItemAdmin to="/apptabAdmin" icon="rocket" title="App" />
          <NavigationItemAdmin to="/settingstabAdmin"icon="settings" title="Settings" />
        </ul>
      </div>

      <div className={`main ${isNavActive ? 'active' : ''}`}>
        <div className="topbar">
        <div style={{display:"flex", alignItems:"center"}}>
          <div className="toggle" onClick={toggleNav}>
            <ion-icon name="menu-outline"></ion-icon>
            </div>
            <div><NotificationModalAdmin/></div>
            </div>
            <div className="edit-button">
      {/* Render your component here */}
      {editMode ? (
        <button onClick={handleEdit}className='btnediting'>Cancel</button>
      ) : (
        <button onClick={handleEdit}className='btnediting'>Edit</button>
      )}
      {showSave && <button onClick={handleSave}className='btnediting'>Save</button>}
    </div>
        </div>

        <div className="cardBox" id="myCard">
        {cardData && (
          <div className="card">
            {editMode ? (
              <div className="cardedit">
                <input
                  type="text"
                  name="title1"
                  value={editedData?.title1 || ""}
                  onChange={handleChange}
                />
                <textarea
                  name="info1"
                  value={editedData?.info1 || ""}
                  onChange={handleChange}
                />

              </div>
            ) : (
            <div>
              <div className="numbers">{cardData.title1}</div>
              <div className="cardName">{cardData.info1}
              </div>
              <div className="UserCalendarContainer"> {/* Add a wrapper div with a class */}
        <Calendar />
      </div>
            </div>
            )}
          </div>
        )}
        </div>

        <div className="cardBox">
        {cardData && (
          <div className="card">
            {editMode ? (
              <div className="cardedit">
                <input
                  type="text"
                  name="title1"
                  value={editedData?.title2 || ""}
                  onChange={handleChange}
                />
                <textarea
                  name="info1"
                  value={editedData?.info2 || ""}
                  onChange={handleChange}
                />

              </div>
            ) : (
            <div>
              <div className="numbers">{cardData.title2}</div>
              <div className="cardName">
              {cardData.info2}</div>
            </div>
            )}
          </div>
          )}
        </div>
        
      </div>

      <div id="myModal" className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScheduletabAdmin;
