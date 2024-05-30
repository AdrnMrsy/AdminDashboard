// import React, { useState, useEffect } from "react";
// import { db, auth } from "../../firebase";
// import { List, Typography, ListItem, ListItemText, Button, Select, MenuItem } from "@mui/material";
// import { getDocs,getDoc, doc, collection, where, query, updateDoc } from "firebase/firestore";
// import "./notification.css";
// import MessageModal from "./messagemodal";

// function formatDate(dateString) {
//   const date = new Date(dateString);
//   const options = {
//     weekday: 'short',
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true
//   };
//   return date.toLocaleString('en-US', options);
// }
// function formatTime(dateString) {
//   const date = new Date(dateString);
//   const options = {
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true
//   };
//   return date.toLocaleString('en-US', options);
// }

// const NotificationComponent = () => {
//   const [username, setUsername] = useState('');
//   const [selectedState, setSelectedState] = useState('pending');
//   const [schedules, setSchedules] = useState([]);
//   const [messageModalOpen, setMessageModalOpen] = useState(false);
//   const [selectedScheduleId, setSelectedScheduleId] = useState(null);
//   const [selectedScheduleState, setSelectedScheduleState] = useState(null);
//   const [modalSuccess, setModalSuccess] = useState(false); // State to track modal success

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         fetchUserData(user.uid);
//       } else {
//         setUsername('');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const fetchUserData = async (userId) => {
//     try {
//       const userDoc = await getDoc(doc(db, 'users', userId));
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const fetchedUsername = userData.username;
//         setUsername(fetchedUsername);
//       } else {
//         console.log('User document does not exist.');
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   useEffect(() => {
//     if (username) {
//       const fetchSchedules = async () => {
//         try {
//           const q = query(
//             collection(db, "schedule"),
//             where("counselor", "==", username),
//             where("state", "==", selectedState)
//           );
//           const querySnapshot = await getDocs(q);
//           const fetchedSchedules = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
//           // Iterate through fetched schedules
//           fetchedSchedules.forEach(async (schedule) => {
//             if (schedule.state === 'pending' && new Date(schedule.start) < new Date()) {
//               try {
//                 const scheduleRef = doc(db, 'schedule', schedule.id);
//                 await updateDoc(scheduleRef, { 
//                   state: 'reject',
//                   message: 'Counselor did not respond'
//                 });
//               } catch (error) {
//                 console.error("Error updating schedule state:", error);
//               }
//             } else if (schedule.state === 'approved' && new Date(schedule.end) < new Date()) {
//               try {
//                 const scheduleRef = doc(db, 'schedule', schedule.id);
//                 await updateDoc(scheduleRef, { 
//                   state: 'done'
//                 });
//               } catch (error) {
//                 console.error("Error updating schedule state:", error);
//               }
//             }
//           });
  
//           // Set schedules state after updating database
//           setSchedules(fetchedSchedules);
//         } catch (error) {
//           console.error("Error fetching schedules:", error);
//         }
//       };
      
//       fetchSchedules();
//     }
//   }, [username, selectedState]);
  
//   const handleUpdateState = async (scheduleId, state) => {
//     try {
//       setSelectedScheduleId(scheduleId);
//       setSelectedScheduleState(state);
//       setMessageModalOpen(true);

//     } catch (error) {
//       console.error("Error updating schedule state:", error);
//     }finally{
//     }
//   };

//   const handleSaveMessage = async (message) => {
//     try {
//       const scheduleRef = doc(db, 'schedule', selectedScheduleId);
  
//       await updateDoc(scheduleRef, { 
//         state: selectedScheduleState, 
//         message: message 
//       });
  
//       setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule.id !== selectedScheduleId));
  
//       setMessageModalOpen(false);
//        // Set modal success state to true
//     } catch (error) {
//       console.error("Error updating schedule state:", error);
//     }finally{
//       setModalSuccess(true);
//     }
//   };

//   return (
//     <div className="notification-container">
//       <Typography variant="h6" > Your Schedules</Typography>
//       <Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}
//       sx={{
//         marginBottom:"10px",
//         color:"white",
//         border: "#b46279", // Border color
//         borderRadius: "5px", // Border radius
//         backgroundColor: "#b46279", // Background color
//           borderColor: "white"}}>
//         <MenuItem value="pending">Pending</MenuItem>
//         <MenuItem value="approved">Approved</MenuItem>
//         <MenuItem value="reject">Rejected</MenuItem>
//         <MenuItem value="done">Done</MenuItem>
//       </Select>
//       <List>
//         {schedules.map((schedule) => (
//           <ListItem key={schedule.id}
//             sx={{
//               backgroundColor:"white",
//               marginBottom:"10px",
//               borderRadius:"5px",
//               boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
//             }}
//           >
//             <ListItemText
//                 primary={schedule.username}
//                 secondary={
//                   <>
//                     Student Number: {schedule.studentNum} <br />
//                     Course: {schedule.course} <br />
//                     Department: {schedule.department} <br />
//                     Reason: {schedule.reasonMessage} <br />
//                     {selectedState !== "pending" && (
//                       <>
//                         Message: {schedule.message} <br />
//                       </>
//                     )}
//                     {formatDate(schedule.start)} <br /> to {formatTime(schedule.end)}
//                   </>
//                 }
//               />
//             {selectedState === 'pending' && (
//               <>
//                 <Button onClick={() => handleUpdateState(schedule.id, 'approved')}>Approve</Button>
//                 <Button onClick={() => handleUpdateState(schedule.id, 'reject')}>Reject</Button>
//               </>
//             )}
//           </ListItem>
//         ))}
//       </List>
      
//       <MessageModal 
//         open={messageModalOpen} 
//         onClose={() => {
//           setMessageModalOpen(false);
//           setModalSuccess(false); // Reset modal success state on close
//         }} 
//         onSave={handleSaveMessage} 
//         success={modalSuccess} // Pass modal success state as prop
//       />
//     </div>
//   );
// };

// export default NotificationComponent;
