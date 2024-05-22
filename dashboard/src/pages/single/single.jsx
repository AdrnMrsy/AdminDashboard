import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
//import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import "./single.css"
import SidebarMainAdmin from "../../components/sidebarMainAdmin/sidebarMainAdmin";
import Threads3 from "../../components/fetchdata/questionadmin";
const Single = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          // User data found, set it in state
          setUserData(userSnapshot.data());
          setEditedData(userSnapshot.data()); // Initialize edited data

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

  const isAdmin = userData && userData.role === "admin";

  const [sidebarVisible, setSidebarVisible] = useState(true);
 
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const saveChanges = async () => {
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, editedData);
      setUserData(editedData); // Update displayed data with edited data
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="single">
      {sidebarVisible && <SidebarMainAdmin />}
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="singleContainer">
        
        <div className="top">
          <div className="left">
          <div className="editButton" onClick={toggleEditMode}>
              {editMode ? "Cancel" : "Edit"}
            </div>
            <h1 className="title">Information</h1>
            {userData && (
              <div className="itemimage">
                <img
                  src={userData.img} // Assuming img is part of user data
                  alt=""
                  className="itemImg"
                />
                <div className="details">
                  <h1 className="itemTitle">
{                    userData.username
}                  
                </h1>
                  <div className="detailItem">
                    <span className="itemKey">Full Name:</span>
                    <span className="itemValue">{editMode ? (
                        <input
                          type="text"
                          name="displayName"
                          value={editedData.displayName}
                          onChange={handleInputChange}
                        />
                      ) : (userData.displayName )} 
                      </span>
                  </div>
                  
                  {!isAdmin && (
                  <div className="detailItem">
                    <span className="itemKey">Student No.:</span>
                      <span className="itemValue">
                        {editMode ? (
                          <input
                            type="text"
                            name="studentNumber"
                            value={editedData.studentNumber}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userData.studentNumber
                        )}</span>
                  </div>
                  )}
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{userData.email }</span>
                  </div>
                  
                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">{editMode ? (
                        <input
                          type="text"
                          name="phone"
                          value={editedData.phone}
                          onChange={handleInputChange}
                        />
                      ) : (userData.phone )}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{editMode ? (
                        <input
                          type="text"
                          name="address"
                          value={editedData.address}
                          onChange={handleInputChange}
                        />
                      ) : (userData.address)}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Birthday:</span>
                    <span className="itemValue">{editMode ? (
                        <input
                          type="date"
                          name="birthday"
                          value={editedData.birthday}
                          onChange={handleInputChange}
                        />
                      ) : (userData.birthday )}</span>
                  </div>
                  {!isAdmin && (
                  <div className="detailItem">
                    <span className="itemKey">Department:</span>
                    <span className="itemValue">{editMode ? (
                        <input
                          type="text"
                          name="department"
                          value={editedData.department}
                          onChange={handleInputChange}
                        />
                      ) : (userData.department )}</span>
                  </div>
                  )}
                  {!isAdmin && (
                  <div className="detailItem">
                    <span className="itemKey">Year:</span>
                    <span className="itemValue">{editMode ? (
                        <input
                          type="text"
                          name="year"
                          value={editedData.year}
                          onChange={handleInputChange}
                        />
                      ) : (userData.year )}</span>
                  </div>
                  )}
                  {!isAdmin && (
                    <div className="detailItem">
                      <span className="itemKey">Course:</span>
                      <span className="itemValue">{editMode ? (
                        <input
                          type="text"
                          name="course"
                          value={editedData.course}
                          onChange={handleInputChange}
                        />
                      ) : (userData.course )}</span>
                    </div>
                  )}
                  {isAdmin && (
                  <div className="detailItem">
                    <span className="itemKey">Info:</span>
                      <span className="itemValue">
                        {editMode ? (
                          <input
                            type="text"
                            name="info1"
                            value={editedData.info1}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userData.info1
                        )}</span>
                  </div>
                  )}
                  {isAdmin && (
                  <div className="detailItem">
                    <span className="itemKey"></span>
                      <span className="itemValue">
                        {editMode ? (
                          <input
                            type="text"
                            name="info2"
                            value={editedData.info2}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userData.info2
                        )}</span>
                  </div>
                  )}
                  {isAdmin && (
                  <div className="detailItem">
                    <span className="itemKey"></span>
                      <span className="itemValue">
                        {editMode ? (
                          <input
                            type="text"
                            name="info3"
                            value={editedData.info3}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userData.info3
                        )}</span>
                  </div>
                  )}
                </div>
              </div>
            )}
             {editMode && (
              <button className="saveButton" onClick={saveChanges}>
                Save
              </button>
            )}
          </div>
        </div>
        {userData && (
        <Threads3 usernamecouncelor={userData.username}/>
        )}
      </div>
    </div>
  );
};

export default Single;
