import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../../firebase'; 
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import './addmessage.css'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress,FormControl
  ,InputLabel,Select, MenuItem
} from "@mui/material";
import UserAvatar from './useravatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AddThread = ({ onAddThread }) => {
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);
  const [data, setData] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading
  const [imagePreview, setImagePreview] = useState(null); // State to store image preview URL
  const [usercourse, setUsercourse] = useState();
  const [useryear, setuseryear] = useState();
  const [studentNum, setstudentNum] = useState();
  const [userdepartment, setuserdepartment] = useState();
  const [postingOption, setPostingOption] = useState('username'); // State to track posting option (username or anonymous)


  // Modal visibility states
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [isInappropriate, setIsInappropriate] = useState(false);


  // Reset modal state
  const handleCloseModals = () => {
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };

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
        const course = userData.course;
        const year= userData.year;
        const studentNumber = userData.studentNumber;
        const department = userData.department;
        setuseryear(year)
        setstudentNum(studentNumber)
        setuserdepartment(department)
        setUsercourse(course);
        setUsername(username); // Update the state with username
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      const imageData = data.img ? { img: data.img } : null;
      const isInappropriateMessage = checkIsInappropriate(content); // Check if message is inappropriate
  
      const docRef = await addDoc(collection(db, 'threads'), {
        content: content,
        image: imageData,
        like: 0,
        comment: 0,
        trueusername: username,
        username: postingOption === 'username' ? username : 'Anonymous', // Use selected posting option
        createdAt: new Date(),
        isInappropriate: isInappropriate || isInappropriateMessage ,// Include isInappropriate field in the document
        studentNum: studentNum,
        course: usercourse,
        year: useryear,
        department: userdepartment,
        
      });
  
      setContent('');
      setIsInappropriate(false); // Reset the isInappropriate state
      setFile(null); // Reset the file state to empty
      setImagePreview(null)
      setData({});
            setSuccess(true); // Setting success state to true
      setOpenSuccessModal(true); // Opening success modal
  
      console.log('Thread added successfully with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
      setError(true); // Setting error state to true
      setOpenErrorModal(true); // Opening error modal
    } finally {
      setLoading(false); // Set loading state back to false after submission
    }
  };
  
  
  
  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
            setFile(null);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const checkIsInappropriate = (message) => {
    // Define your list of inappropriate words or phrases here
    const inappropriateWords = ['tanga', 'sex','gago', 'gaga', 'putangina', 'putang','tarantado', 'puke', 'pepe', 'pokpok', 'shit', 'bullshit',
      'fuck', 'fck', 'whore', 'puta', 'tangina', 'syet', 'tite', 'kupal', 'kantot', 'hindot', 'nigga', 'motherfucker', 'kinginamo', 'taenamo',
      'asshole', 'kike', 'cum', 'pussy'
    ];
    // Split the message into words
    const words = message.split(/\s+/);
    // Check each word against the list of inappropriate words
    for (let word of words) {
      if (inappropriateWords.includes(word.toLowerCase())) {
        return true; // Return true if any inappropriate word is found
      }
    }
    return false; // Return false if no inappropriate word is found
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
  
      // Display image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="add-thread-container">
      <form onSubmit={handleSubmit} className='form-inputs'>
       <h2>Create Message</h2>
       <div style={{ display: "flex", alignItems: 'center' }}>
          {postingOption === 'username' ? (
          <UserAvatar username={postingOption === 'username' ? username : 'anonymous'} />
        ) : (
            <AccountCircleIcon style={{ fontSize: 40 }} />
          )}
          <div style={{ marginLeft: '10px' }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="posting-option-label">Post As</InputLabel>
              <Select
                labelId="posting-option-label"
                id="posting-option"
                value={postingOption}
                onChange={(e) => setPostingOption(e.target.value)}
              >
                <MenuItem value="username">{username}</MenuItem>
                <MenuItem value="anonymous">Anonymous</MenuItem>
              </Select>
            </FormControl>
        <p style={{fontSize:"10px", marginLeft:"10px"}}>{new Date().toLocaleString()}</p>

        </div>
        </div>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Message Content..."
          className="input-field"
          required
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Selected File"
            className="selected-image"
          />
        )}
        <div style={{marginLeft:"30px",marginRight:"30px", display: "flex", alignItems:"center", justifyContent:"space-between" }}>
        <div className="formInput">
          <div style={{display:"flex", alignItems:'center'}}>
          <label htmlFor="file">
             <AddPhotoAlternateIcon className="icon" style={{fontSize:"35px"}} /> 
          </label>
          <p>Image</p>
          </div>
          <input
            type="file"
            id="file"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
        </div>
        <button type="submit" className="submit-button">Add Message</button>
        </div>
        {loading && <CircularProgress />}
      </form>
      {/* Success Modal */}
    <Dialog open={openSuccessModal} onClose={handleCloseModals}>
      <DialogTitle>Success</DialogTitle>
      <DialogContent>
        <p> Added successfully!</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModals}>OK</Button>
      </DialogActions>
    </Dialog>

    {/* Error Modal */}
    <Dialog open={openErrorModal} onClose={handleCloseModals}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <p>Failed to add. Please try again later.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModals}>OK</Button>
      </DialogActions>
    </Dialog>
    {checkIsInappropriate(content) && (
      <p className="inappropriate-warning">This message contains inappropriate content.</p>
    )}
    </div>
  );
  
};

export default AddThread;
