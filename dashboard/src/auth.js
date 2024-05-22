import { useEffect, useState } from 'react';
import { auth } from './firebase'; // Assuming you exported the auth instance from your firebase.js file

const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { currentUser, loading };
};

export default useFirebaseAuth;
