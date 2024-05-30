import React, { useState } from 'react';
import { auth, db, storage } from '../../firebase';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse'; // Import PapaParse library for CSV parsing
import './importcreate.css';

const New = ({ title }) => {
  const [files, setFiles] = useState([]);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleInput = (index, fieldName, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [fieldName]: value };
    setData(newData);
  };

  const handleAddRow = () => {
    setData([...data, {}]);
    setErrors([...errors, '']);
    setFiles([...files, null]);
  };

  const handleFileChange = (index, file) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);

    // Parse CSV file
    parseCSVFile(file);
  };

  const handleRemoveRow = (indexToRemove) => {
    setData(data.filter((_, index) => index !== indexToRemove));
    setErrors(errors.filter((_, index) => index !== indexToRemove));
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const parseCSVFile = (file) => {
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        // Log parsed data
        console.log('Parsed CSV data:', results.data);
        // Update state with CSV data
        setData(results.data);
      },
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = Array(data.length).fill('');
    setErrors(newErrors);

    try {
      // Loop through each account data
      for (let index = 0; index < data.length; index++) {
        const account = data[index];

        try {
          if (!validateEmail(account.email)) {
            throw new Error('Invalid email address');
          }

          // Create user
          const res = await createUserWithEmailAndPassword(
            auth,
            account.email,
            account.password
          );

          // Set user data in Firestore
          await setDoc(doc(db, 'users', res.user.uid), {
            username: account.username,
            displayName: account.displayName,
            email: account.email,
            password:account.password,
            phone: account.phone,
            address: account.address,
            role: account.role,
            course: account.course,
            birthday: account.birthday,
            year: account.year,
            studentNumber: account.studentNumber,
            department:account.department,
            timeStamp: serverTimestamp(),
          });

          // Upload file if available
          if (files[index]) {
            await uploadFile(files[index], res.user.uid);
          }
        } catch (error) {
          newErrors[index] = error.message;
        }
      }

      // Check if any errors occurred during user creation
      if (newErrors.some((error) => error)) {
        throw new Error('Some accounts were not created successfully.');
      }

      // Clear form after successful sign-up
      setData([]);
      setErrors([]);
      setFiles([]);
      navigate(-1);
    } catch (error) {
      setErrors(newErrors);
      console.error(error);
      // Handle error, display message, or perform any necessary action
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const uploadFile = async (file, userId) => {
    const storageRef = ref(storage, `${userId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    await uploadTask;
  };

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSignUp}>
              <input
                type="file"
                id="file-upload" // Add id attribute
                onChange={(e) => handleFileChange(0, e.target.files[0])}
                accept=".csv"
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload">
                {/* Ensure htmlFor matches the id of the input */}
                Import CSV File
                <DriveFolderUploadOutlinedIcon className="icon" />
              </label>

              <div className="formInputs">
                <div className="header">
                  <span>Student No.</span>
                  <span>Username</span>
                  <span>Full Name</span>
                  <span>Email</span>
                  <span>Phone</span>
                  <span>Address</span>
                  <span>Password</span>
                  <span>Role</span>
                  <span>Course</span>
                  <span>Year</span>
                  <span>Birthday</span>
                  <span>Department</span>
                </div>
                {data.map((rowData, index) => (
  <div key={index} className="formInputimport">

                    <input
                      type="text"
                      value={rowData.studentNumber || ''}
                      onChange={(e) =>
                        handleInput(index, 'studentNumber', e.target.value)
                      }
                      required
                    />
                    
                    <input
                      type="text"
                      value={rowData.username || ''}
                      onChange={(e) =>
                        handleInput(index, 'username', e.target.value)
                      }
                      required
                    />       <span className="error">{errors[index]}</span>

                    <input
                      type="text"
                      value={rowData.displayName || ''}
                      onChange={(e) =>
                        handleInput(index, 'displayName', e.target.value)
                      }
                      required
                    />
                    <input
                      type="email"
                      value={rowData.email || ''}
                      onChange={(e) =>
                        handleInput(index, 'email', e.target.value)
                      }
                      required
                    />       <span className="error">{errors[index]}</span>

                    <input
                      type="tel"
                      value={rowData.phone || ''}
                      onChange={(e) =>
                        handleInput(index, 'phone', e.target.value)
                      }
                      required
                    />
                    <input
                      type="text"
                      value={rowData.address || ''}
                      onChange={(e) =>
                        handleInput(index, 'address', e.target.value)
                      }
                      required
                    />
                    <input
                      type="password"
                      value={rowData.password || ''}
                      onChange={(e) =>
                        handleInput(index, 'password', e.target.value)
                      }
                      required
                    />       <span className="error">{errors[index]}</span>

                    <input
                      type="text"
                      value={rowData.role || ''}
                      onChange={(e) =>
                        handleInput(index, 'role', e.target.value)
                      }
                      required
                    />
                    <input
                      type="text"
                      value={rowData.course || ''}
                      onChange={(e) =>
                        handleInput(index, 'course', e.target.value)
                      }
                      required
                    />
                    <input
                      type="text"
                      value={rowData.year || ''}
                      onChange={(e) =>
                        handleInput(index, 'year', e.target.value)
                      }
                      required
                    />
                    <input
                      type="text"
                      value={rowData.birthday || ''}
                      onChange={(e) =>
                        handleInput(index, 'birthday', e.target.value)
                      }
                      required
                    />
                    <input
                      type="text"
                      value={rowData.department || ''}
                      onChange={(e) =>
                        handleInput(index, 'department', e.target.value)
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove Row
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={handleAddRow}>
                Add Row
              </button>
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
