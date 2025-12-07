import './infotab.css'; // Import your CSS file
import { Link } from 'react-router-dom';
import MyUsername from '../../userComponents/username/username';
import React, { useEffect, useState } from 'react';
import { auth, db } from "../../firebase";
import {  doc, getDoc, getDocs, collection, where } from "firebase/firestore";
import NotificationModal from '../../userComponents/notifmod';

function NavigationItem({ icon, title, to, onClick }) {
  return (
    <li>
     <Link to={to} className='linking'onClick={onClick}>
        <span className="icon">
          <ion-icon name={icon}></ion-icon>
        </span>
        <span className="title">{title}</span>
      </Link>
    </li>
  );
}
export { NavigationItem };


const GetCurrentUserId = () => {
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return currentUser ? currentUser.uid : null;
};



export {GetCurrentUserId};

function Infotab() {
  const [cardData, setCardData] = useState(null);
  const [isNavActive, setIsNavActive] = useState(false);
  const toggleNav = () => setIsNavActive(!isNavActive);
  const [cardData1, setCardData1] = useState(null); // Initialize cardData with null
  const [userData, setUserData] = useState(null);

const handleLinkClick = () => {
    // Check if the current view is mobile/tablet size (e.g., < 992px)
    if (window.innerWidth <= 991) {
      setIsNavActive(false);
    }
  };
  
  useEffect(() => {
    const fetchCardData = async () => {
      try {
          const docRef = doc(db, "content", "infotab"); // Create reference to the document
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

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const counselorList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "admin"); // Filter users by role "admin"
      setCardData1(counselorList);
    } catch (err) {
      console.log("Error fetching counselor data:", err);
    }
  };
  
    fetchData(); // Fetch counselor data when component mounts
  
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
    <span className="profileicon" >
      <ion-icon name="person-circle-outline" className="profileicon" ></ion-icon>
    </span>
  )}             {isNavActive ? null : <div className="name">{<MyUsername/>}</div>}
           </div>
         </div>
       </div>
        )} 
          <NavigationItem to="/infotab" icon="information-circle" title="Info"onClick={handleLinkClick} />
          <NavigationItem to="/inspotab" icon="star" title="Inspo" onClick={handleLinkClick}/>
          <NavigationItem to="/communitytab"icon="chatbubbles" title="Community"onClick={handleLinkClick} />
          <NavigationItem to="/scheduletab"icon="calendar" title="Schedule"onClick={handleLinkClick} />
          <NavigationItem to="/apptab" icon="rocket" title="App"onClick={handleLinkClick} />
          <NavigationItem to="/settingstab"icon="settings" title="Settings" onClick={handleLinkClick}/>
          

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
                <div className="cardName">{cardData.info1}</div>
                {/* <button className="title_button" id="title_button">
                            <div className="button-icon"><ion-icon name="heart"></ion-icon></div>
                            Learn more about Ga-Bai
                        </button> */}
              </div>
              <div className="gabai_pic">
                        <img src="inspo.png" alt="bg_profile" width="50%" className="gabai_pic"/> 
                    </div> 
            </div>
          )}
        </div>



        <div className="cardBox" id="myCard1">
          {cardData && (
            <div className="card">
              <div>
                <div className="numbers">{cardData.title2}</div>
                <div className="cardName">{cardData.info2}</div>
                <a href="https://www.facebook.com/DYCIGC">
      <button className="title_button" id="title_button">
        <div className="button-icon"><ion-icon name="heart"></ion-icon></div>
        Learn more about the DYCI Guidance
      </button>
    </a>
              </div>
              <div className="guidance_pic">
                        <img src="guidancedyci.jpg" alt="bg_profile" width="100%" className="guidance_pic"/>
                    </div> 
            </div>
          )}
        </div>

        <div className="cardBox">
        {cardData && (
          <div className="card">
            <div>
              <div className="numbers">{cardData.title3}</div>
              <div className="cardName">{cardData.info3}
              
</div>
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=dyci.gc@dyci.edu.ph">
      <button className="title_button" id="title_button">
        <div className="button-icon" ><ion-icon name="heart"></ion-icon></div>
        Contact Us
      </button>
    </a>
            </div>
            {/* <div className="iconBx">
              <ion-icon name="person-circle-outline"></ion-icon>
            </div> */}
          </div>
        )}
        </div>

        <div className="cardBoxS">
        <div className='scrollable-container'>

        {cardData1 && cardData1.map((counselor, index) => (
  <div className="card" key={index}>
    <div>
      <div className="numbers">{counselor.username}</div>
      <div className="cardName">{counselor.info1}</div>
      <div className="cardName">{counselor.info2}</div>
      <div className="cardName">{counselor.info3}</div>
      {/* <a href={counselor.link}>
                            <button className="title_button" id="title_button">
                            <div className="button-icon"><ion-icon name="heart"></ion-icon></div>
                                Social Link 
                            </button>
                        </a> */}
      {/* Add additional counselor information as needed */}
    </div>
    <div className="iconBx">
    <img src={counselor.img} width="100%" className="counsellors"/>
    </div>
  </div>
))}

</div>
</div>

       
      
        {/* Additional Content (Modal) */}
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close">&times;</span>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Infotab;
