import React, { useEffect,useState } from 'react';
import '../infotab/infotab.css'; // Import your CSS file
import { NavigationItem } from '../infotab/infotab';
import MyUsername from '../../userComponents/username/username';
import { GetCurrentUserId } from '../infotab/infotab';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import NotificationModal from '../../userComponents/notifmod';

function Apptab() {
  const [isNavActive, setIsNavActive] = useState(false);
  const toggleNav = () => setIsNavActive(!isNavActive);
  const [cardData, setCardData] = useState(null);
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    const fetchCardData = async () => {
      try {
          const docRef = doc(db, "content", "app"); // Create reference to the document
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
  )}             {isNavActive ? null : <div className="name">{<MyUsername/>}</div>}
           </div>
         </div>
       </div>
        )}
          <NavigationItem to="/infotab" icon="information-circle" title="Info" />
          <NavigationItem to="/inspotab" icon="star" title="Inspo" />
          <NavigationItem to="/communitytab" icon="chatbubbles" title="Community" />
          <NavigationItem to="/scheduletab" icon="calendar" title="Schedule" />
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
          <div className="card">
            <div>
              <div className="numbers">{cardData.title1}</div>
              <div className="cardName">{cardData.info1}
</div>
            </div>
          </div>
        )}
        </div>

        <div className="cardBox">
        {cardData && (
          <div className="card">
            <div>
              <div className="numbers">{cardData.title2}</div>
              <div className="cardName">{cardData.info2}</div>
            </div>
          </div>
        )}
        </div>

        <div className="cardBox">
        {cardData && (
          <div className="card">
            <div>
              <div className="numbers">{cardData.title3}</div>
            </div>
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

export default Apptab;
