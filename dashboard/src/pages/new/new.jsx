import React, { useState } from 'react';
import "./new.css";
//import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect } from "react";
import { doc, serverTimestamp, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import SidebarMainAdmin from '../../components/sidebarMainAdmin/sidebarMainAdmin';
import { Modal, Box, Button } from '@mui/material';


const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    username: "",
    displayName: "",
    studentNumber: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    role: "",
    course: "",
    year: "",
    birthday: "",
    department:"" // Initialize birthday with an empty string
  });
  const [per, setPerc] = useState(null);
  const [emailError, setEmailError] = useState(""); // State for email error
  const [usernameError, setUsernameError] = useState(""); // State for username error
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal


  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, retrieve user data from Firestore
        console.log(user.uid);
      } else {
        // No user is signed in.
        console.log('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
  
    // Check if any required field is empty
    let requiredInputs = ["email", "password", "phone", "role", "username", "displayName", "birthday"];

    if (data.role !== "admin") {
      requiredInputs = [...requiredInputs, "course", "year", "studentNumber"];
    }
    const isAnyFieldEmpty = requiredInputs.some((inputId) => !data[inputId]);
  
    if (isAnyFieldEmpty) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true); // Start loading

  
    const checkUsernameExists = async (username) => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "users"), where("username", "==", username))
        );
        return !querySnapshot.empty;
      } catch (error) {
        console.error("Error checking username existence:", error);
        return false;
      }
    };
  
    // Check if username already exists
    const usernameExists = await checkUsernameExists(data.username);
    if (usernameExists) {
      setUsernameError("Username already exists.");
      setLoading(false); // Stop loading

      return;
    } else {
      setUsernameError(""); // Clear the error message
    }
  
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        timeStamp: serverTimestamp(),
      });
      
      setLoading(false); // Stop loading
      setShowSuccessModal(true); // Show success modal

    } catch (err) {
      console.error("Error signing up:", err);
      setEmailError(err.message); // Set the email error message
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
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate(-1);
  };
  return (
    <div className="new">
      <SidebarMainAdmin/>
      <Navbar />
      <div className="newContainer">
        
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  {(input.id === "department" ||input.id === "course" || input.id === "year" || input.id === "studentNumber") && data.role === "admin" ? null : (
                    <>
                      <label>{input.label}</label>
                      {input.type === "select" ? (
                        <select
                          id={input.id}
                          onChange={handleInput}
                          value={data[input.id]}
                        >
                          <option value="" disabled>
                            {input.placeholder}
                          </option>
                          {input.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : input.type === "date" ? (
                        <input
                          id={input.id}
                          type={input.type}
                          onChange={handleInput}
                          value={data[input.id]}
                        />
                      ) : (
                        <input
                          id={input.id}
                          type={input.type}
                          placeholder={input.placeholder}
                          onChange={handleInput}
                        />
                      )}
                    </>
                  )}
                  {input.id === "email" && emailError && (
                    <span className="errorMessage">{emailError}</span>
                  )}
                  {input.id === "username" && usernameError && (
                    <span className="errorMessage">{usernameError}</span>
                  )}
                </div>
              ))}

              <button disabled={per !== null && per < 100} type="submit">
              {loading ? 'Loading...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
       {/* Material-UI Modal for Success */}
       <Modal
        open={showSuccessModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          width: 400,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: 'none',
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
        }}>
          <h2>User Added Successfully!</h2>
          <Button onClick={handleCloseSuccessModal}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default New;



