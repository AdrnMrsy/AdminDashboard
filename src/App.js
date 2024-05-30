//import Home from "./pages/home/home";
import Login from "./pages/login/login";
import List from "./pages/list/list";
import Single from "./pages/single/single";
import New from "./pages/new/new";
//import Calendar from "./pages/calendar/calendar";
import {  userInputs } from "./formsource";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
//import Chats from "./pages/chats/chats";
import InspoTab from "./pagesUser/inspotab/inspotab";
import Infotab from "./pagesUser/infotab/infotab";
import Communitytab from "./pagesUser/communitytab/communitytab";
import Scheduletab from "./pagesUser/scheduletab/scheduletab";
import Apptab from "./pagesUser/apptab/apptab";
import Settingstab from "./pagesUser/settingstab/settingstab";
import UserProfile from "./pagesUser/userprofile/userprofile";
import { useEffect, useState } from 'react';
//import useFirebaseAuth from "./auth";
import { db } from './firebase'; // Import the initialized Firestore instance
import { doc, getDoc } from "firebase/firestore";
import Mainadmin from "./pages/MainAdmin/mainadmin";
import Report from "./pages/reports/report";
import Massnew from "./pages/massnew/massnew";

import InspoTabAdmin from "./pagesAdmin/inspotab/inspotab";
import InfotabAdmin from "./pagesAdmin/infotab/infotab";
import CommunitytabAdmin from "./pagesAdmin/communitytab/communitytab";
import ScheduletabAdmin from "./pagesAdmin/scheduletab/scheduletab";
import ApptabAdmin from "./pagesAdmin/apptab/apptab";
import SettingstabAdmin from "./pagesAdmin/settingstab/settingstab";
import UserProfileAdmin from "./pagesAdmin/userprofile/userprofile";

function App() {

  const { currentUser } = useContext(AuthContext);  // Assuming you have a custom hook to handle Firebase authentication

  const [userRole, setUserRole] = useState(null);
  

  useEffect(() => {
    if (currentUser) {
      const fetchUserRole = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
            
          } else {
            // Handle case where user document does not exist
          }
        } catch (error) {
          console.error('Error getting user role:', error);
        }
      };
      fetchUserRole();
    }
  }, [currentUser]);

  console.log(userRole)
  
  // const RequireAuth = ({children}) => {
  //   return currentUser ? children : <Navigate to="/login"/>;
  // };

  const RequireAuth = ({ children, requiredRole }) => {
    if (currentUser ) {
      if(userRole === requiredRole){return children}
      else if (userRole !== requiredRole){
        if( userRole==="student" && (requiredRole === "admin" || requiredRole === "mainadmin")){
        return <Navigate to="/infotab" />;}
        else if( userRole==="admin" && (requiredRole === "mainadmin" || requiredRole === "student")){
          return <Navigate to="/" />;}
        else if( userRole==="mainadmin" && (requiredRole === "student" || requiredRole === "admin")){
            return <Navigate to="/mainadmin" />;}
        else if (currentUser === null ) {
          return <Navigate to="/login" />;}
       
        }
        else if (currentUser === null ) {
          return <Navigate to="/login" />;}
    } 
    else if (currentUser === null ) {
      return <Navigate to="/login" />;}
    
  };
  

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
   
          <Route path="/">
            <Route path="login" element={<Login/>}/>
            <Route index element={
              <RequireAuth requiredRole="admin">
              <InfotabAdmin/>
              </RequireAuth>
            }/>
            <Route path="inspotabAdmin" element={<RequireAuth requiredRole="admin"><InspoTabAdmin/></RequireAuth>}/>
            <Route path="communitytabAdmin" element={<RequireAuth requiredRole="admin"><CommunitytabAdmin/></RequireAuth>}/>
            <Route path="scheduletabAdmin" element={<RequireAuth requiredRole="admin"><ScheduletabAdmin/></RequireAuth>}/>
            <Route path="apptabAdmin" element={<RequireAuth requiredRole="admin"><ApptabAdmin/></RequireAuth>}/>
            <Route path="settingstabAdmin" element={<RequireAuth requiredRole="admin"><SettingstabAdmin/></RequireAuth>}/>
           {/* <Route path=":userIdAdmin" element={<RequireAuth requiredRole="admin"><UserProfileAdmin/></RequireAuth>}/>  */}
            
            {/* <Route path="calendar" element={<RequireAuth requiredRole="admin"><Calendar/></RequireAuth>}/>
            <Route path="chats" element={<RequireAuth requiredRole="admin"><Chats/></RequireAuth>}/> */}
            <Route path="users">
              <Route index element={<RequireAuth requiredRole="mainadmin"><List/></RequireAuth>}/>
              <Route path=":userId" element={<RequireAuth requiredRole="mainadmin"><Single/></RequireAuth>}/>
              <Route 
                path="new"
                element={<RequireAuth requiredRole="mainadmin"><New inputs={userInputs} title="Add New User" /></RequireAuth>}
              />
              </Route>

            {/* <Route path=":userId" element={<RequireAuth requiredRole="admin"><Single/></RequireAuth>}/> */}
            <Route 
                path="massnew"
                element={<RequireAuth requiredRole="mainadmin"><Massnew/></RequireAuth>}
              />



            <Route path="infotab" element={<RequireAuth requiredRole="student"><Infotab/></RequireAuth>}/>
            <Route path="inspotab" element={<RequireAuth requiredRole="student"><InspoTab/></RequireAuth>}/>
            <Route path="communitytab" element={<RequireAuth requiredRole="student"><Communitytab/></RequireAuth>}/>
            <Route path="scheduletab" element={<RequireAuth requiredRole="student"><Scheduletab/></RequireAuth>}/>
            <Route path="apptab" element={<RequireAuth requiredRole="student"><Apptab/></RequireAuth>}/>
            <Route path="settingstab" element={<RequireAuth requiredRole="student"><Settingstab/></RequireAuth>}/>
            <Route path=":userId" element={<UserProfile />} />
            <Route path="mainadmin" element={<RequireAuth requiredRole="mainadmin"><Mainadmin/></RequireAuth>}/>
            <Route path="report" element={<RequireAuth requiredRole="mainadmin"><Report/></RequireAuth>}/>


          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
