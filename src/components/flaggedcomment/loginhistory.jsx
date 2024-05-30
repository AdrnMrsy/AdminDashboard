import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Typography, TextField, Toolbar } from "@mui/material";
import { DataGrid,GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from "moment"; // Import Moment.js
import './linecharts.css'
const LoginHistory = () => {
    const [loginHistory, setLoginHistory] = useState([]);
    const [filterValues, setFilterValues] = useState({
        // userId: "",
        // email: "",
        // role: "",
        // username: "",
        startDate: "",
        endDate: ""
    });
    const [infoInput, setInfoInput] = useState(""); // State to hold the input information
    const [infoInput1, setInfoInput1] = useState(""); // State to hold the input information


    useEffect(() => {
        const fetchLoginHistory = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "loginhistory"));
                const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLoginHistory(historyData);
            } catch (error) {
                console.error("Error fetching login history:", error);
            }
        };

        fetchLoginHistory();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterValues({ ...filterValues, [name]: value });
    };

    const filteredHistory = loginHistory.filter((row) => {
        const startDate = filterValues.startDate ? new Date(filterValues.startDate) : null;
        const endDate = filterValues.endDate ? new Date(filterValues.endDate) : null;
        
        return Object.entries(filterValues).every(([key, value]) => {
            if (!value) return true;
            if (key === "startDate" || key === "endDate") {
                const timestamp = new Date(row.timestamp.toDate());
                return (!startDate || timestamp >= startDate) && (!endDate || timestamp <= endDate);
            }
            return row[key].toLowerCase().includes(value.toLowerCase());
        });
    });

    const columns = [
        { field: "userId", headerName: "User ID", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "role", headerName: "Role", flex: 1 },
        { field: "username", headerName: "Username", flex: 1 },
        { field: "timestamp", headerName: "Timestamp", flex: 1, renderCell: (params) => {
            // Check if params.value is a valid date object
            if (params.value && typeof params.value.toDate === 'function') {
              // Convert the value to a date object and format it
              const formattedDate = moment(params.value.toDate()).format('MMMM DD, YYYY');
              return <div>{formattedDate}</div>;
            } else {
              // Handle the case when params.value is not a valid date
              return <div>{params.value}</div>;
            }
          } }
    ];

    function CustomToolbar() {
        return (
        <div>
           
        <div style={{paddingLeft: "38%",height:"70px",display:"flex",
        alignItems:"center", backgroundColor:"#8a344c", color:"white"}}> <h2>GA-BAI Login History Reports</h2> </div> <hr/>
          <GridToolbarContainer>
            <GridToolbarExport /> <div style={{marginLeft:"100px", marginRight:"100px"}}>info: {infoInput}</div>
          </GridToolbarContainer>
          <hr/>
          </div>
        );
      }

    return (
        <div>
            
            <div className="alldates">
                {/* <TextField
                    label="User ID"
                    name="userId"
                    value={filterValues.userId}
                    onChange={handleFilterChange}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={filterValues.email}
                    onChange={handleFilterChange}
                />
                <TextField
                    label="Role"
                    name="role"
                    value={filterValues.role}
                    onChange={handleFilterChange}
                />
                <TextField
                    label="Username"
                    name="username"
                    value={filterValues.username}
                    onChange={handleFilterChange}
                /> */}
                <div style={{marginLeft: "30px"}}>
            <div>
            <div>
            <div><span>Start</span></div>
                
                <TextField 
                    name="startDate"
                    type="date"
                    value={filterValues.startDate}
                    onChange={handleFilterChange}
                    className="textfieldall"
                /> 
                </div>
                </div>
                <div>
                <div>
            <div><span>End</span></div>
                <TextField
                    name="endDate"
                    type="date"
                    value={filterValues.endDate}
                    onChange={handleFilterChange}
                                        className="textfieldall"
                                        /> 
                 </div>
                </div>
            </div>
            <div style={{marginLeft:"20px",marginTop:"20px"}}>
            <div style={{marginBottom:"20px"}}>
            <TextField
                        label="Info"
                        variant="outlined"
                        size="small"
                        value={infoInput}
                        onChange={(e) => setInfoInput(e.target.value)}
                        
                    /></div>
                    <div>
                    <TextField
                        label="PreparedBy:"
                        variant="outlined"
                        size="small"
                        value={infoInput1}
                        onChange={(e) => setInfoInput1(e.target.value)}
                    />
                    </div>
                    </div>
                    </div>
            <div style={{ height: 500, width: '94%' ,margin:'30px' }}>
                <DataGrid
                    rows={filteredHistory}
                    columns={columns}
                    pageSize={5} // Set the number of rows per page
    pagination
                    slots={{
                        toolbar: CustomToolbar,
                        pagination: (props) => (
                        <div>
                            <hr/>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"1094px",height:"50px",backgroundColor:"#8a344c", color:"white"}}>
                                <div  >PreparedBy: {infoInput1}</div>
                                <div style={{marginRight:"200px"}}>Date:{new Date().toLocaleDateString()} </div>

                       </div> <hr/></div>
                        )  
                             
                       }}
                    
                />
            </div>
        </div>
    );
};

export default LoginHistory;
