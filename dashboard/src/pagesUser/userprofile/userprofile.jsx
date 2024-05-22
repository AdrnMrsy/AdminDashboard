import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { NavigationItem } from '../infotab/infotab';
import MyUsername from '../../userComponents/username/username';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';

import '../infotab/infotab.css'; // Import your CSS file


const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  const [isNavActive, setIsNavActive] = useState(false);
  const toggleNav = () => setIsNavActive(!isNavActive);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setModalVisible(true); // Show modal when file is selected
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
        <NavigationItem icon={"person-circle"} title={<MyUsername/>} />
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
        <div className="toggle" onClick={toggleNav}>
          <ion-icon name="menu-outline"></ion-icon>
        </div>
      </div>


      {userData && (
  <div className="cardBox">
    <div className="card">
      <div>
        {/* Render different content based on user's role */}
        {userData.role === 'admin' ? (
          <>
            <div className="numbers">{userData.username}</div>
            <div className="cardName">Phone: {userData.phone}</div>
            <div className="cardName">Address: {userData.address}</div>
            <div className="cardName">Birthday: {userData.birthday}</div>
            <div className="cardName">Role: {userData.info1}</div>
            <div className="cardName">Education: {userData.info2}</div>
            <div className="cardName">{userData.info3}</div>

          </>
        ) : (
          <>
            <div className="numbers">{userData.username}</div>
            <div className="cardName">Email: {userData.email}</div>
            <div className="cardName">Address: {userData.address}</div>
            <div className="cardName">Phone: {userData.phone}</div>
            <div className="cardName">Course: {userData.course}</div>
            <div className="cardName">Year: {userData.year}</div>
            <div className="cardName">Student No: {userData.studentNumber}</div>
            <div className="cardName">Birthday: {userData.birthday}</div>
            <div className="cardName">FullName: {userData.displayName}</div>
          </>
        )}
      </div>
      <div>
      <div className="iconBx">
        <img src={userData.img} alt="" className="itemImg" />
      </div>
      <label htmlFor="fileInput">
  <DriveFolderUploadOutlinedIcon /> Upload File
</label>
<input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />


      </div>
    </div>
              
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
  );
};

export default UserProfile;
