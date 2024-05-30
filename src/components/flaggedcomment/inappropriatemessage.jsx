// import React from "react";
// import { db } from "../../firebase"; // Make sure the path is correct
// import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

// const DeleteSchedules = () => {

//   const handleDeleteSchedules = async () => {
//     try {
//       // Define the list of counselors to delete schedules for
//       const counselorsToDelete = ["Counselor A", "Counselor B", "Counselor C"];

//       // Loop through each counselor and delete their schedules
//       for (const counselor of counselorsToDelete) {
//         const querySnapshot = await getDocs(query(collection(db, "schedule"), where("counselor", "==", counselor)));
//         querySnapshot.forEach(async (doc) => {
//           await deleteDoc(doc.ref);
//         });
//       }

//       console.log("Schedules deleted successfully.");
//     } catch (error) {
//       console.error("Error deleting schedules:", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleDeleteSchedules}>Delete Schedules</button>
//     </div>
//   );
// };

// export default DeleteSchedules;
