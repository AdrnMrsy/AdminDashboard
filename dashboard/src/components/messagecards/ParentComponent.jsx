import React, { useState, useEffect } from 'react';
import Threads from './Threads';
import { auth } from '../../firebase'; 

const ParentComponent = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, retrieve user data from Firestore
        setUsername(user.displayName); // Assuming displayName is available in the user object
      } else {
        // No user is signed in.
        setUsername('');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Threads username={username} />
    </div>
  );
};

export default ParentComponent;
