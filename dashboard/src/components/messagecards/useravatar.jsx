import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const IoniconFallback = () => (
  <ion-icon name="person-circle-outline" style={{ fontSize: '50px' }}></ion-icon>
);

const UserAvatar = ({ username }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (username === 'anonymous') {
      setAvatarUrl(null); // Do not fetch avatar if username is anonymous
    } else {
      const fetchUserAvatar = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));
          querySnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.username === username) {
              setAvatarUrl(userData.img); // Set the avatar URL
              return; // Exit the loop once the matching username is found
            }
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserAvatar();
    }
  }, [username]);

  const handleImageError = () => {
    // Handle image loading error
    setImageError(true);
  };

  return (
    <div className="profilemessages">
      {username === 'Anonymous' || !avatarUrl || imageError ? (
        <IoniconFallback />
      ) : (
        <img src={avatarUrl} alt="User Avatar" onError={handleImageError} />
      )}
    </div>
  );
};

export default UserAvatar;
