import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, adminColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import './datatable.css';
import moment from 'moment'; // Import Moment.js
import { Modal, TextField, Button } from "@mui/material";
import {  GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';



const Datatable = () => {
  const [data, setData] = useState({ admin: [], student: [] });
  const [selectedUserType, setSelectedUserType] = useState("admin");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);
const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false); // New state variable
const [infoInput, setInfoInput] = useState(""); // State to hold the input information
const [infoInput1, setInfoInput1] = useState(""); // State to hold the input information


const handleCloseSuccessModal = () => {
  setShowDeleteSuccessModal(false);
};
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let adminList = [];
      let studentList = [];
      snapshot.docs.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        if (userData.role === "admin") {
          adminList.push(userData);
        } else if (userData.role === "student") {
          studentList.push(userData);
        }
      });
      setData({ admin: adminList, student: studentList });
    }, (error) => {
      console.log(error);
    });

    return () => {
      unsub();
    };
  }, []);


  

  // const handleDelete = async (id) => {
  //   try {
  //     await deleteDoc(doc(db, "users", id));
  //     setData({
  //       admin: data.admin.filter((item) => item.id !== id),
  //       student: data.student.filter((item) => item.id !== id)
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleDelete = async (id) => {
    setShowDeleteModal(true);
    setSelectedUserId(id);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", selectedUserId));
      setData({
        admin: data.admin.filter((item) => item.id !== selectedUserId),
        student: data.student.filter((item) => item.id !== selectedUserId),
      });
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true)
    } catch (err) {
      console.log(err);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/users/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div className="deleteButton" onClick={() => handleDelete(params.row.id)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const handleExportCSV = () => {
    const rows = selectedUserType === "admin" ? data.admin : data.student;
    const columns = selectedUserType === "admin" ? adminColumns : userColumns;

    const formattedRows = rows.map(row => ({
      ...row,
      timeStamp: moment(row.timeStamp.toDate()).format("MMMM DD, YYYY") // Apply Moment.js formatting
    }));
    
    const csvContent = [
      columns.map(column => column.headerName).join(','),
      ...formattedRows.map(row => columns.map(column => row[column.field]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const fileName = `export_${selectedUserType}.csv`;
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const handleUserTypeChange = (event) => {
    setSelectedUserType(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  // Filter data based on selected start and end dates
  
  const filteredData = selectedUserType === "admin" ? data.admin : data.student;
  // Filter data based on selected start and end dates
const filteredAndFormattedData = filteredData
.filter(row => {
  if (!startDate && !endDate) return true;
  const rowDate = moment(row.timeStamp.toDate()); // Convert Firebase Timestamp to Moment.js object
  const start = startDate ? moment(startDate) : null;
  const end = endDate ? moment(endDate) : null;
  return (!start || rowDate.isSameOrAfter(start, 'day')) && (!end || rowDate.isSameOrBefore(end, 'day'));
})
.map(row => ({
  ...row,
  timeStamp: moment(row.timeStamp.toDate()).format("MMMM DD, YYYY") // Convert Firebase Timestamp to formatted date string
}));

function CustomToolbar() {
  return (
  <div>
     
  <div style={{paddingLeft: "45%",height:"70px",display:"flex",
  alignItems:"center", backgroundColor:"#8a344c", color:"white"}}> <h2>GA-BAI Users</h2> </div> <hr/>
    <GridToolbarContainer>
      <GridToolbarExport /> <div style={{marginLeft:"100px", marginRight:"100px"}}>info: {infoInput}</div>
    </GridToolbarContainer>
    <hr/>
    </div>
  );
}

  return (
    
      <div className="datatable">
        <div className="datatableTitle">
          <div style={{ display:"flex", justifyContent:"space-between"}}>
          <div className="dropdownmenu">
            <select value={selectedUserType} onChange={handleUserTypeChange}>
              <option value="admin">Admin Users</option>
              <option value="student">Student Users</option>
            </select>
            </div>
            <div style={{ display:"flex"}}>
            <Link to="/users/new" className="nav-link"><button className="link">Create Account</button></Link>
            <Link to="/massnew" className="nav-link">
        <button className="buttonnewimport">MultipleCreation</button>
        </Link>
        </div>
            {/* <button onClick={handleExportCSV}>Export to CSV</button> */}
          
          </div>
          <div className="filterdate">
            <input type="date" value={startDate} onChange={handleStartDateChange} className="fildate" />
            <input type="date" value={endDate} onChange={handleEndDateChange} className="fildate"/>
          </div>
        </div>
        <div style={{ height: 500, width: '95%' }}>
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
          <DataGrid
            className="datagrids"
            rows={filteredAndFormattedData}
            columns={selectedUserType === "admin" ? adminColumns.concat(actionColumn) : userColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={9}
            pagination
                    
            slots={{
                toolbar: CustomToolbar,
                pagination: (props) => (
                <div>
                    <hr/>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"1289px",height:"50px",backgroundColor:"#8a344c", color:"white"}}>
                        <div >PreparedBy: {infoInput1}</div>
                        <div style={{marginRight:"200px"}}>Date:{new Date().toLocaleDateString()} </div>
                       
               </div> <hr/></div>
                )  
                     
               }}
            
          />
        </div>
        <Modal
       open={showDeleteModal}
       onClose={handleCloseModal}
       aria-labelledby="delete-modal-title"
       aria-describedby="delete-modal-description"
       style={{
         width:"500px",
         height: "300px",
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         marginLeft:"30%",
         marginTop:"10%",
       }}
      >
        <div style={{
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         borderRadius:"5px"
       }}>
          <div style={{
         backgroundColor:"white",
         padding:'20px',
         borderRadius:"5px"

       }}>
            <h2 id="delete-modal-title" style={{marginBottom:"10px"}}>Are you sure you want to delete this account?</h2>
            <div className="modal-actions">
              <Button onClick={handleConfirmDelete} style={{marginRight:"5px"}}variant="contained" color="error">
                Delete
              </Button>
              <Button onClick={handleCloseModal} variant="contained" color="primary">
                No
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={showDeleteSuccessModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="delete-success-modal-title"
        aria-describedby="delete-success-modal-description"
        style={{
          width: "500px",
          height: "300px",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: "30%",
          marginTop: "10%",
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: "5px"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: '20px',
            borderRadius: "5px"
          }}>
            <h2 id="delete-success-modal-title" style={{marginBottom:"10px"}}>Account deleted successfully.</h2>
            <Button onClick={handleCloseSuccessModal} variant="contained" color="primary">
              Close
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    
  );
};

export default Datatable;
