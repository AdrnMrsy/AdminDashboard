import React, { useEffect, useState } from 'react';
import '../infotab/infotab.css'; // Import your CSS file
import { NavigationItem } from '../infotab/infotab';
import MyUsername from '../../userComponents/username/username';
import UserChats from '../../userComponents/userchats/userchats';
import { GetCurrentUserId } from '../infotab/infotab';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import NotificationModal from '../../userComponents/notifmod';

function Communitytab() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isUserChatVisible, setIsUserChatVisible] = useState(false); // State to manage UserChats visibility

  const toggleNav = () => setIsNavActive(!isNavActive);
  const toggleUserChat = () => setIsUserChatVisible(!isUserChatVisible); // Function to toggle UserChats visibility
  const [cardData, setCardData] = useState(null);
  const [userData, setUserData] = useState(null);



  useEffect(() => {
    const fetchCardData = async () => {
      try {
          const docRef = doc(db, "content", "community"); // Create reference to the document
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
    <div className="profileicon" >
      <ion-icon name="person-circle-outline" className="profileicon"></ion-icon>
    </div>
  )}
             {isNavActive ? null : <div className="name">{<MyUsername/>}</div>}
           </div>
         </div>
       </div>
        )}
          <NavigationItem to="/infotab" icon="information-circle" title="Info" />
          <NavigationItem to="/inspotab" icon="star" title="Inspo" />
          <NavigationItem to="/communitytab"icon="chatbubbles" title="Community" />
          <NavigationItem to="/scheduletab"icon="calendar" title="Schedule" />
          <NavigationItem to="/apptab" icon="rocket" title="App" />
          <NavigationItem to="/settingstab"icon="settings" title="Settings" />
        </ul>
      </div>

      <div className={`main ${isNavActive ? 'active' : ''}`}>
        <div className="topbar">
        <div style={{display:"flex", alignItems:"center"}}>
          <div className="toggle" onClick={toggleNav}>
            <ion-icon name="menu-outline"></ion-icon>
            </div>
            <div><NotificationModal/></div>
            </div>
        </div>

        <div className="cardBox" id="myCard">
        {cardData && (
          <div className="card" onClick={toggleUserChat}> {/* Add onClick handler to toggle UserChats visibility */}
            <div>
              <div className="numbers">{cardData.title1}</div>
              <div className='card-cta'>CLICK HERE TO OPEN</div>
              <div className="cardName">
              {cardData.info1}
              </div>
              {isUserChatVisible && <UserChats/>}
            </div>
            
          </div>
        )}
        
        </div>



        <div className="cardBox">
  {cardData && (
    <div className="card ">
      <div style={{width:"100%"}}>
        <div className="numbers">{cardData.title2}</div>
        <div className="cardName">{cardData.info2}</div>
      </div>
      <div className="cardBoxS cardodalisay">
        <div className="cardScrollWrapper"> 
          <div className="card">
            <div>
            <div className="pic"><img src="1 copy.jpg" alt='' className="pic"/></div>
              <div className="numbers">{cardData.cardtitle1}</div>
              <div className="cardName">{cardData.card1}
              <a href="https://www.facebook.com/ProyektoPasaHERO">
      <button className="title_button" id="title_button">
        <span className="button-icon"><ion-icon name="heart"></ion-icon></span>
        Learn more about this project
      </button>
    </a>
</div>

            </div>
          </div>
          {/* Repeat the above card elements as needed */}
         
        </div>
      </div>
    </div>
  )}
</div>


        <div className="cardBox">
        {cardData && (
          <div className="card">
            <div style={{width:"100%"}}>
              <div className="numbers">{cardData.title3}</div>
              <div className="cardName">
              {cardData.info3}              </div>
            </div>
            <div className="cardBoxS cardodalisay">
            <div className="cardScrollWrapper"> 
              <div className="card">
                
                <div>
                <div className="pic"><img src="2 copy.jpg" alt='' className="pic"/></div>


                  <div className="numbers">{cardData.cardtitle2}
</div>
                  <div className="cardName" >{cardData.card2}
                  <a href="https://www.facebook.com/ProyektoPasaHERO">
      <button className="title_button" id="title_button">
        <span className="button-icon"><ion-icon name="heart"></ion-icon></span>
        Learn more about this project
      </button>
    </a>
</div>


                </div>
              </div>

              
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Communitytab;
