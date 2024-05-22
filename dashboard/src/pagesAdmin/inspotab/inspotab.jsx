import React, { useState } from 'react';
import '../infotab/infotab.css'; // Import your CSS file
import { NavigationItemAdmin } from '../infotab/infotab';
import MyUsername from '../../userComponents/username/username';
import { useEffect } from 'react';
import quotes from '../../quotes';
import { GetCurrentUserId } from '../infotab/infotab';
import { doc, getDoc,updateDoc,getDocs,collection, limit,query } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import VideoUpload from './video';
import VideoList from './videolist';
import ImageUpload from './imageupload';
import NotificationModalAdmin from '../../components/notification/notifmodadmin';

function InspoTabAdmin() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [showSave, setShowSave] = useState(false);
  const [images, setImages] = useState([]);


  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'images'), limit(4))); // Limit to 4 items
      const imagesList = querySnapshot.docs.map(doc => doc.data().url);
      setImages(imagesList);
    } catch (err) {
      console.error('Error fetching images:', err);
      
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [quote, setQuote] = useState('');

    useEffect(() => {

        const currentDate = new Date();
        const dayOfYear = currentDate.getFullYear() * 1000 + currentDate.getDate();
        const randomIndex = dayOfYear % quotes.length;
        setQuote(quotes[randomIndex]);
      }, []);

      useEffect(() => {
        const fetchCardData = async () => {
          try {
              const docRef = doc(db, "content", "inspotab"); // Create reference to the document
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

      const [currentIndex, setCurrentIndex] = useState(0);
     // const images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
    
      const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
      };
    
      const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
      };

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
          const docRef = doc(db, "content", "inspotab");
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


        {/* CardBox 1 */}
        <div className="cardBox" id="myCard">
        {cardData && (
          <div className="card" onClick={openModal}>
             {editMode ? (
              <div className="cardedit">
                <input
                  type="text"
                  name="title1"
                  value={editedData?.title1 || ""}
                  onChange={handleChange}
                />
                
                <div className='quote-container'>
                <p className='quote'>{quote}</p>
              </div>     
              </div>
            ) : (
            <div>
              <div className="numbers">{cardData.title1}</div>
              <div className='quote-container'>
                <p className='quote'>{quote}</p>
              </div>            
              </div>
              )}
              <div className="inspo_pic_quote">
                        <img src="inspo.png" alt="bg_profile" width="30%" className="inspo_pic"/>
                    </div>
          </div>
        )}
        </div>

        

        {/* CardBox 3 */}
        <div className="cardBox">
        {cardData && (
          <div className="card">
            {editMode ? (
              <div>
              <div className="cardedit">
                <input
                  type="text"
                  name="title1"
                  value={editedData?.title3 || ""}
                  onChange={handleChange}
                />
                
                <textarea
                  name="info1"
                  value={editedData?.inspo3 || ""}
                  onChange={handleChange}
                />
                
              </div>
              <ImageUpload />
              </div>
            ) : (
            <div>
              <div className="numbers">{cardData.title3}</div>
              <div className="cardName">{cardData.inspo3}</div>
              <div className="slider">
      <button onClick={prevSlide}className='prev'>&#10094;</button>
      <img src={images[currentIndex]} alt="bg_profile" className="inspo_pics" />
      <button onClick={nextSlide}className='next'>&#10095;</button>
    </div>
            </div>
            )}
          </div>
        )}
        </div>
        {/* CardBox 2 */}
        <div className="cardBox">
        {cardData && (
          <div className="card">
             {editMode ? (
              <div>
              <div className="cardedit">
                <input
                  type="text"
                  name="title1"
                  value={editedData?.title2 || ""}
                  onChange={handleChange}
                />
                
                <textarea
                  name="info1"
                  value={editedData?.inspo2 || ""}
                  onChange={handleChange}
                />
              

              </div>
              <div  className="video-upload-container">
              <VideoUpload docId={"LnHI3DQ15Q2TNnQHPwh5"}/>
              </div>
              </div>
            ) : (
            <div>
              <div className="numbers">{cardData.title2}</div>
              <div className="cardName">{cardData.inspo2}</div>
              <div className="video-player">
              <VideoList/>
              
            </div>
            </div>
            )}

          </div>
        )}
        </div>

        {/* Additional Content (Modal) */}
        {isModalOpen && (
          <div id="myModal" className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h1>Sed ut perspiciatis unde omnis iste natus error sit voluptatem...</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InspoTabAdmin;
