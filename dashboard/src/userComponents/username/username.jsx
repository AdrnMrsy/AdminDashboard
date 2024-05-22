import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
const MyUsername = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, retrieve user data from Firestore
        fetchUserData(user.uid);
      } else {
        // No user is signed in.
        setUsername('');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const username = userData.username;
        setUsername(username); // Update the state with username
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    // Your JSX for the component goes here
    <div>
      <p>{username}</p>
    </div>
  );
};

export default MyUsername
