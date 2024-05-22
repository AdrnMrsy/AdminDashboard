import React, { useEffect, useState } from 'react'
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import '../infotab/infotab.css'; // Import your CSS file
import { NavigationItemAdmin } from '../infotab/infotab';
import MyUsername from '../../userComponents/username/username';
import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew';
import { GetCurrentUserId } from '../infotab/infotab';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import NotificationModalAdmin from '../../components/notification/notifmodadmin';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';


const SettingstabAdmin = () => {
  const [userData, setUserData] = useState(null);
  const [isNavActive, setIsNavActive] = useState(false);
  const toggleNav = () => setIsNavActive(!isNavActive);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [updatedUserData, setUpdatedUserData] = useState(null); // Track updated user data
  const [error, setError] = useState(null); // Track error state

  const [successMessage, setSuccessMessage] = useState(null); // Track success message state
  const [passwordEditMode, setPasswordEditMode] = useState(false); // Track password edit mode
  const [updatedPassword, setUpdatedPassword] = useState(''); // Track updated password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePasswords = () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return false;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return false;
    }
    return true;
  };


const savePasswordChanges = async () => {
  if (!validatePasswords()) return;

  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordEditMode(false);
    setError(null);
    setSuccessMessage("Password updated successfully.");
    setTimeout(() => setSuccessMessage(null), 3000);
  } catch (error) {
    console.error("Error updating password:", error);
    setError("Current password is incorrect or there was an error updating the password. Please try again.");
  }
};

  const togglePasswordEditMode = () => {
    setPasswordEditMode(!passwordEditMode);
    setUpdatedPassword('');
  };

  const handlePasswordChange = (e) => {
    setUpdatedPassword(e.target.value);
  };
  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  
  
  const cancelPasswordEdit = () => {
    setPasswordEditMode(false);
    setUpdatedPassword('');
    setError(null);
  };
  

  const toggleEditMode = () => {
    setEditMode(!editMode);
    // Initialize updatedUserData with userData when entering edit mode
    if (!editMode) setUpdatedUserData(userData);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the corresponding field in updatedUserData
    setUpdatedUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      // Check if the new username already exists in the database
      // const q = query(collection(db, 'users'), where('username', '==', updatedUserData.username));
      // const querySnapshot = await getDocs(q);
      // if (!querySnapshot.empty) {
      //   setError("Username already exists. Please choose a different username.");
      //   return; // Exit function if username already exists
      // }

      // If username is unique, update the user data
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, updatedUserData);
      setUserData(updatedUserData);
      setEditMode(false); // Exit edit mode after saving changes
      setError(null); // Clear any previous errors
      setSuccessMessage("Changes saved successfully."); // Set success message
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (error) {
      console.error("Error saving changes:", error);
      setError("An error occurred while saving changes. Please try again later.");
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setModalVisible(true); // Show modal when file is selected
  };

  const cancelEdit = () => {
    setEditMode(false); // Exit edit mode
    setUpdatedUserData(userData); // Reset updatedUserData to original user data
    setError(null);
  };
  const handleUpload = async () => {
    try {
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile_images/${userId}`);
        await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(storageRef);
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { img: downloadURL });
        setUserData({ ...userData, img: downloadURL });
        setModalVisible(false); // Hide modal after upload
        console.log("Photo uploaded successfully");
      } else {
        console.log("No file selected");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

    const { dispatch } = useContext(AuthContext);

    const handleLogout = () => {
      dispatch({ type: 'LOGOUT' });
    };


    useEffect(() => {
      
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, get the UID
        const userId = user.uid;
        setUserId(userId)
  
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

    
    <div>
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
        </div>
        {userData && (
  <div className="cardBox">
    <div className="card">
      <div>
    <div>
      <div className="iconBx">
        <img src={userData.img} alt="" className="itemImg" />
      </div>
      <label htmlFor="fileInput">
  <DriveFolderUploadOutlinedIcon /> Upload File
</label>
<input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />


      </div>
      <div style={{display: "grid", margin:"5px"}}>
        {/* Render different content based on user's role */}
        {editMode ? (
          <>
<div className="numbers">{userData.username}</div>
        <div className="cardName">Email: {userData.email}</div>     
        <input type="text"placeholder="address" className="cardName" name="address" value={updatedUserData.address} onChange={handleInputChange} />
       <input type="text"placeholder="phone" className="cardName" name="phone" value={updatedUserData.phone} onChange={handleInputChange} />
       <input 
  type="date"
  placeholder="birthday"
  className="cardName"
  name="birthday"
  value={updatedUserData.birthday ? new Date(updatedUserData.birthday).toISOString().split('T')[0] : ''}
  onChange={handleInputChange}
/>

       <input type="text" placeholder="Role" className="cardName" name="info1" value={updatedUserData.info1} onChange={handleInputChange} />
       <input type="text" placeholder="Education" className="cardName" name="info2" value={updatedUserData.info2} onChange={handleInputChange} />
       <input type="text" placeholder="Additional Info" className="cardName" name="info3" value={updatedUserData.info3} onChange={handleInputChange} />

     </>
   ) : (
          <>
            <div className="numbers">{userData.username}</div>
            <div className="cardName">Phone: {userData.phone}</div>
            <div className="cardName">Address: {userData.address}</div>
            <div className="cardName">Birthday: {userData.birthday}</div>
            <div className="cardName">Role: {userData.info1}</div>
            <div className="cardName">Education: {userData.info2}</div>
            <div className="cardName">{userData.info3}</div>
            {passwordEditMode && (
  <div className="passwordModal">
    <div className="passwordModal-content">
      <input type="password" placeholder="Current Password" value={currentPassword} onChange={handleCurrentPasswordChange} />
      <input type="password" placeholder="New Password" value={newPassword} onChange={handleNewPasswordChange} />
      <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
      {error && <div className="error-message">{error}</div>}
      <div style={{display:"flex"}}>
        <button className="logoutbtn" style={{marginRight:"10px"}} onClick={savePasswordChanges}>Save</button>
        <button className="logoutbtn" onClick={cancelPasswordEdit}>Cancel</button>
      </div>
    </div>
  </div>
)}
<div style={{display:"grid"}}>
<div style={{marginTop:"10px"}}>
<div className="logoutbtn" onClick={togglePasswordEditMode} style={{  fontSize:"15px" }} >Change Password</div>
{successMessage && <div className="success-message">{successMessage}</div>}
</div>
<div style={{marginTop:"10px"}}>
        <div className="logoutbtn"> 
        <PowerSettingsNew />
        <div onClick={handleLogout} >Logout</div>
        </div></div>
        </div>
          </>
        )}
      </div>
      </div>
      <div>
      {editMode ? (
                  <div>
                  <SaveIcon onClick={saveChanges} />
                  <CancelIcon onClick={cancelEdit} />
                  </div>
                ) : (
                  <EditIcon onClick={toggleEditMode} />
                )}
             </div>
    </div>
    {error && <div className="errorMessage" style={{color:"red"}}>{error}</div>}
{/* Display success message if exists */}
{successMessage && <div className="successMessage" style={{color:"green"}}>{successMessage}</div>}
       
  </div>
)}

{/* Modal */}
{modalVisible && (
  <div className="modaluser">
    <div className="modaluser-content">
      {/* Display selected image */}
      {selectedFile && (
        <img src={URL.createObjectURL(selectedFile)} alt="Selected" />
      )}

      {/* Buttons for uploading and canceling */}
      <div>
        <button onClick={handleUpload}>Upload</button>
        <button onClick={() => setModalVisible(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

        
       
      </div>
    </div>
  )
}

export default SettingstabAdmin
