import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Typography, Paper, TextField, Button } from "@mui/material";
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from "moment"; // Import Moment.js
import "./linecharts.css";

const Reportedtable = () => {
    const [loginHistory, setLoginHistory] = useState([]);
    const [filterValues, setFilterValues] = useState({
        startDate: "",
        endDate: ""
    });
    const [infoInput, setInfoInput] = useState(""); // State to hold the input information
    const [infoInput1, setInfoInput1] = useState(""); // State to hold the input information

    useEffect(() => {
        const fetchLoginHistory = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "reports"));
                const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLoginHistory(historyData);
            } catch (error) {
                console.error("Error fetching login history:", error);
            }
        };

        fetchLoginHistory();
    }, []);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilterValues({ ...filterValues, [name]: value });
    };

    const filteredHistory = loginHistory.filter((row) => {
        const startDate = filterValues.startDate ? moment(filterValues.startDate) : null;
        const endDate = filterValues.endDate ? moment(filterValues.endDate) : null;

        return (
            (!startDate || moment(row.createdAt.toDate()).isSameOrAfter(startDate, 'day')) &&
            (!endDate || moment(row.createdAt.toDate()).isSameOrBefore(endDate, 'day'))
        );
    });

    const handleDelete = async (id, threadId) => {
        try {
            await deleteDoc(doc(db, "reports", id));
            await deleteDoc(doc(db, "threads", threadId));
            setLoginHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    function CustomToolbar() {
        return (
            <div>
                <div style={{ paddingLeft: "38%", height: "70px", display: "flex", alignItems: "center", backgroundColor: "#8a344c", color: "white" }}>
                    <h2>GA-BAI Reported Messages</h2>
                </div>
                <hr />
                <GridToolbarContainer>
                    <GridToolbarExport />
                    <div style={{ marginLeft: "100px", marginRight: "100px" }}>info: {infoInput}</div>
                </GridToolbarContainer>
                <hr />
            </div>
        );
    }

    return (
        <div>
            <div className="alldates">
                <div style={{ marginLeft: "30px" }}>
                    <div>
                        <div>
                            <div><span>Start</span></div>
                            <TextField
                                name="startDate"
                                type="date"
                                value={filterValues.startDate}
                                onChange={handleDateChange}
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
                                onChange={handleDateChange}
                                className="textfieldall"
                            />
                        </div>
                    </div>
                </div>
                <div style={{ marginLeft: "20px", marginTop: "20px" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <TextField
                            label="Info"
                            variant="outlined"
                            size="small"
                            value={infoInput}
                            onChange={(e) => setInfoInput(e.target.value)}
                        />
                    </div>
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
            <div style={{ height: 500, width: '94%', margin: '30px' }}>
                <DataGrid
                    rows={filteredHistory}
                    columns={[
                        { field: "id", headerName: "Message ID", flex: 1 },
                        { field: 'threadId', headerName: 'threadId', flex: 1 },
                        { field: 'reportedName', headerName: 'reportedName', flex: 1 },
                        { field: 'reportedBy', headerName: 'reportedBy', flex: 1 },
                        { field: 'message', headerName: 'message', flex: 1 },
                        {
                            field: 'actions',
                            headerName: 'Actions',
                            flex: 1,
                            renderCell: (params) => (
                                <Button
    variant="contained"
    sx={{ 
        backgroundColor: 'red', 
        color: 'white',
        '&:hover': {
            backgroundColor: 'darkred',
        },
    }}
    onClick={() => handleDelete(params.row.id, params.row.threadId)}
>
    Delete
</Button>

                            ),
                        },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    slots={{
                        toolbar: CustomToolbar,
                        pagination: (props) => (
                            <div>
                                <hr />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "1094px", height: "50px", backgroundColor: "#8a344c", color: "white" }}>
                                    <div>PreparedBy: {infoInput1}</div>
                                    <div style={{ marginRight: "200px" }}>Date: {new Date().toLocaleDateString()}</div>
                                </div>
                                <hr />
                            </div>
                        ),
                    }}
                />
            </div>
        </div>
    );
};

export default Reportedtable;
