import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoCollectionRef = collection(db, 'video');
        const querySnapshot = await getDocs(videoCollectionRef);
        const videosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      
      <ul>
        {videos.map((video) => (
          <div key={video.id}>
          
          <video controls width="880" style={{
            marginTop:"20px"
          }}>
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
