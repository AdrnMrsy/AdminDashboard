import { useContext, useState, useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress


const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(false); // State to track loading


  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserData(userList);
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };

    fetchData(); // Fetch user data when component mounts
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Find the user with matching email
        const currentUser = userData.find((userData) => userData.email === email);

        if (currentUser) {
            // Dispatch based on user role
            if (currentUser.role === "admin") {
                dispatch({ type: "LOGIN", payload: user });
                navigate("/");
            } else if (currentUser.role === "student") {
                dispatch({ type: "LOGIN", payload: user });
                navigate("/infotab");
            } else if (currentUser.role === "mainadmin") {
                dispatch({ type: "LOGIN", payload: user });
                navigate("/mainadmin");
            } else {
                // Handle other roles if necessary
            }

            // Add login history to Firestore
            const loginData = {
              userId: user.uid,
                email: email,
                role: currentUser.role, // Include user role
                username: currentUser.username, // Include username
                timestamp: new Date()
              
              
          };

          await addDoc(collection(db, "loginhistory"), loginData);
        } else {
            console.log("User not found in database");
        }
    } catch (error) {
        setError(true);
        console.log("Error signing in:", error);
    }finally {
      setLoading(false); // Set loading state back to false after login
  }
};


  
  return (
    <div className="login-container">
    <div className="twoforms">
    
    <form className="login-form" onSubmit={handleLogin}>
  <div className="logintext"> <h2> Login </h2> </div>
  <div className="input-container">
    <span className="input-icon"><EmailIcon/></span>
    <input
      className="input"
      type="email"
      name="email"
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    /> 
  </div>
  <div className="input-container">
    <span className="input-icon"><LockIcon/></span>
    <input
      className="input"
      type="password"
      name="password"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
  <button type="submit" className="button-login">
    Login
  </button>
  {loading && <CircularProgress />} {/* Show loading indicator when loading */}

    {error && <span className="span-error">Wrong email or password</span>}
  </form>
  <form className="info-form">
    <div className="logintextcontainer"> 
      <h1 className="loginformtext">Welcome to Ga-bai</h1>
    </div>
   <div className="">
    <img src="dashboard/src/pages/login/2.png" alt=""/>
   </div>
<div  className="logintextcontainer"><h3 className="loginformtext">Please Login to Access</h3></div>
  </form>
</div>
</div>
  );
};

export default Login;
