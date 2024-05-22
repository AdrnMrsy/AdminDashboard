import React, { useState } from 'react';
import { storage, db } from '../../firebase'; // Adjust the path according to your project structure
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
//import './ImageUpload.css'; // Create a CSS file for styling if needed
import { CircularProgress } from '@mui/material';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        setError(true);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, 'images'), {
          url: downloadURL,
          createdAt: new Date(),
        });
        setFile(null);
        setSuccess(true);
        setUploading(false);
        alert('Video updated successfully!');

      }
    );
  };

  return (
    <div className="image-upload-container">
      <input type="file" onChange={handleFileChange} />
      {uploading && <CircularProgress variant="determinate" value={uploadProgress} />}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {success && <p>Image uploaded successfully!</p>}
      {error && <p>Error uploading image. Please try again.</p>}
    </div>
  );
};

export default ImageUpload;
