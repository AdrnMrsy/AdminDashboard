import './infotab.css'; // Import your CSS file
import { Link } from 'react-router-dom';
import MyUsername from '../../userComponents/username/username';
import React, { useEffect, useState } from 'react';
import { auth, db } from "../../firebase";
import {  doc, getDoc, updateDoc, getDocs, collection} from "firebase/firestore";
import NotificationModalAdmin from '../../components/notification/notifmodadmin';

function NavigationItemAdmin({ icon, title, to }) {
  
  return (
    <>
     
      <li>
        <Link to={to} className='linking'>
          <span className="icon">
            <ion-icon name={icon}></ion-icon>
          </span>
          <span className="title">{title}</span>
        </Link>
      </li>
    </>
  );
}
export { NavigationItemAdmin };

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

function InfotabAdmin() {
  const [cardData, setCardData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [userData, setUserData] = useState(null);


  const [isNavActive, setIsNavActive] = useState(false);
  const toggleNav = () => setIsNavActive(!isNavActive);
  const [showSave, setShowSave] = useState(false);
  const [cardData1, setCardData1] = useState(null); // Initialize cardData with null
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track if modal is open



  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
 useEffect(() => {
  const fetchCardData = async () => {
    try {
      const docRef = doc(db, "content", "infotab");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCardData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const counselorList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "admin");
      setCardData1(counselorList);
    } catch (err) {
      console.log("Error fetching counselor data:", err);
    }
  };

  fetchCardData();
  fetchData();

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
      const docRef = doc(db, "content", "infotab");
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

  function Modal({ isOpen, onClose }) {
    return (
      <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <p>This is the additional content you want to display.</p>
          {/* Add your additional content here */}
        </div>
      </div>
    );
  }
  
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
  {isNavActive ? null : <div className="name">{<MyUsername />}</div>}
</div>

         </div>
       </div>
        )}
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
                <div className="numbers">{cardData?.title1}</div>
                <div className="cardName">{cardData?.info1}</div>
               
              </div>
            )}
            <div className="gabai_pic">
                        <img src="inspo.png" alt="bg_profile" width="50%" className="gabai_pic"/> 
                    </div> 
          </div>
        </div>

        <div className="cardBox" id="myCard">
          <div className="card">
            {editMode ? (
              <div className="cardedit">
                <input
                  type="text"
                  name="title2"
                  value={editedData?.title2 || ""}
                  onChange={handleChange}
                />
                <textarea
                  name="info2"
                  value={editedData?.info2 || ""}
                  onChange={handleChange}
                />
    
              </div>
            ) : (
              <div>
                <div className="numbers">{cardData?.title2}</div>
                <div className="cardName">{cardData?.info2}</div>
                <a href="https://www.facebook.com/DYCIGC">
      <button className="title_button" id="title_button">
        <div className="button-icon" ><ion-icon name="heart"></ion-icon></div>
        Learn more about the DYCI Guidance
      </button>
    </a>
              </div>
            )}
            <div className="guidance_pic">
                        <img src="guidancedyci.jpg" alt="bg_profile" width="100%" className="guidance_pic"/>
                    </div> 
          </div>
        </div>

        <div className="cardBox" id="myCard">
          <div className="card">
            {editMode ? (
              <div className="cardedit">
                <input
                  type="text"
                  name="title3"
                  value={editedData?.title3 || ""}
                  onChange={handleChange}
                />
                <textarea
                  name="info3"
                  value={editedData?.info3 || ""}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div>
                <div className="numbers">{cardData?.title3}</div>
                <div className="cardName">{cardData?.info3}</div>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=dyci.gc@dyci.edu.ph">
      <button className="title_button" id="title_button">
        <div className="button-icon" ><ion-icon name="heart"></ion-icon></div>
        Contact Us
      </button>
    </a>
              </div>
            )}
           
    
          </div>
        </div>


        {/* Render other cards similarly */}
        
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

<Modal isOpen={isModalOpen} onClose={closeModal} />

      </div>
    </div>
  );
}

export default InfotabAdmin;
