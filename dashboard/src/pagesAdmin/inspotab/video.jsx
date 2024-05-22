import React, { useState } from 'react';
import { storage, db } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import '../infotab/infotab.css'; // Import your CSS file

const VideoUpload = ({ docId }) => {
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleVideoChange = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (docId && video) {
      const storageRef = ref(storage, `videos/${video.name}`);
      const uploadTask = uploadBytesResumable(storageRef, video);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.error('Error uploading video:', error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const videoDocRef = doc(db, 'video', docId);
            await setDoc(videoDocRef, { url: downloadURL, updatedAt: new Date() }, { merge: true });
            setProgress(0);
            setVideo(null);
            setUploading(false);
            alert('Video updated successfully!');
          } catch (error) {
            console.error('Error updating video URL in Firestore:', error);
          }
        }
      );
      setUploading(true);
    } else {
      alert('Please select a video to upload and provide a valid document ID.');
    }
  };

  return (
    <div className="video-upload-container">
      <input className="vidinput" type="file" accept="video/*" onChange={handleVideoChange} />
      <button className="buttonvid" onClick={handleUpload} disabled={uploading}>
        {uploading ? `Uploading ${progress}%` : 'Upload Video'}
      </button>
      {progress > 0 && <progress className="progressvid" value={progress} max="100" />}
    </div>
  );
};

export default VideoUpload;
