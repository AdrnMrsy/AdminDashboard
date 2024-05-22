import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Make sure the path is correct
import { collection ,query ,where, getDocs  } from "firebase/firestore";
import './card.css'
const Card = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStudentUsers, setTotalStudentUsers] = useState(0);
  const [totalAdminUsers, setTotalAdminUsers] = useState(0);
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalGamers, setTotalGamers] = useState(0);

  

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const totalUsersCount = usersSnapshot.docs.length;
        setTotalUsers(totalUsersCount);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalUsers();
    const fetchTotalStudentUsers = async () => {
      try {
        // Construct a query to get users where the role is "student"
        const q = query(collection(db, "users"), where("role", "==", "student"));
        
        // Execute the query
        const usersSnapshot = await getDocs(q);
        
        // Get the total number of student users
        const totalStudentUsersCount = usersSnapshot.docs.length;
        
        // Set the state with the total number of student users
        setTotalStudentUsers(totalStudentUsersCount);
      } catch (error) {
        console.error("Error fetching total student users:", error);
      }
    };
  
    fetchTotalStudentUsers();
  
    const fetchTotalAdminUsers = async () => {
      try {
        // Construct a query to get users where the role is "student"
        const q = query(collection(db, "users"), where("role", "==", "admin"));
        
        // Execute the query
        const usersSnapshot = await getDocs(q);
        
        // Get the total number of student users
        const totalAdminUsersCount = usersSnapshot.docs.length;
        
        // Set the state with the total number of student users
        setTotalAdminUsers(totalAdminUsersCount);
      } catch (error) {
        console.error("Error fetching total student users:", error);
      }
    };
  
    fetchTotalAdminUsers();

    const fetchTotalSchedules = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "schedule"));
        const totalSchedulesCount = usersSnapshot.docs.length;
        setTotalSchedules(totalSchedulesCount);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalSchedules();

    const fetchTotalMessages = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "threads"));
        const totalMessagesCount = usersSnapshot.docs.length;
        setTotalMessages(totalMessagesCount);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalMessages();
    const fetchTotalGamers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "gameDB"));
        const totalMessagesCount = usersSnapshot.docs.length;
        setTotalGamers(totalMessagesCount);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalGamers();
  
  }, []);

  

  

  return (
    <div className="cardsdiv">
    <div className="cardo">
      <h2>Total Users</h2>
      <h1>{totalUsers}</h1>
    </div>
     <div className="cardo">
      <h2>Sprout Users</h2>
      <h1>{totalGamers}</h1>
    </div>
    <div className="cardo">
    <h2>Student Users</h2>
    <h1>{totalStudentUsers}</h1>
  </div>
  <div className="cardo">
    <h2>Coucelor Users</h2>
    <h1>{totalAdminUsers}</h1>
  </div>
  <div className="cardo">
    <h2>All Schedules</h2>
    <h1>{totalSchedules}</h1>
  </div>
  <div className="cardo">
    <h2>All Messages</h2>
    <h1>{totalMessages}</h1>
  </div>
  </div>
  );
};

export default Card;
