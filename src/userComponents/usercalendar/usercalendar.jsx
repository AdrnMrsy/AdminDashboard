import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../../firebase"; // Import Firebase setup including authentication
import { v4 as uuidv4 } from 'uuid'; // Import uuid library
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, List, ListItem, ListItemText, Typography, Modal, Button, Snackbar, Select, MenuItem, FormControl, InputLabel, TextField, } from "@mui/material";
import { colors } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
//import { formatDate } from "@fullcalendar/core";
import { collection, serverTimestamp, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { deleteDoc } from 'firebase/firestore';
import DeleteEventModal from "./deletemodal";
import './usercalendar.css'




const UserCalendar = () => {
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [studentNum, setStudentNum] = useState("");
  const [currentEvents, setCurrentEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
//  const [fullname, setFullname] = useState("");
  const [counselor, setCounselor] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // New state for selected date
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [username, setUsername] = useState('');
  const [eventType, setEventType] = useState("Schedule Counseling"); // State to track event type
  const [eventName, setEventName] = useState(""); // State to track event name
  const [eventInfo, setEventInfo] = useState(""); // State to track event info
  const [counselinginfo, setCouselingInfo] = useState(""); // State to track event info
  const [department, setdepartment] = useState(""); // State to track event info
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Inside the Calendar component
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [finishedEvents, setFinishedEvents] = useState([]);
  const [upcomingEventsFromDB, setUpcomingEventsFromDB] = useState([]);
  const [finishedEventsFromDB, setFinishedEventsFromDB] = useState([]);
  const [allEventsFromDB, setAllEventsFromDB] = useState([]);
 // const [selectedEventForDeletion, setSelectedEventForDeletion] = useState(null); // State to track selected event for deletion
  const [counselors, setCounselors] = useState([]);
  const [selectedOption, setSelectedOption] = useState('upcoming');
  const [selectedOption1, setSelectedOption1] = useState("upcoming"); // State to track the selected option
  const [MySchedules, setMySchedules] = useState([]);
  const [clickedEvent, setClickedEvent] = useState(null);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [approvedSchedules, setApprovedSchedules] = useState([]);
  const [rejectedSchedules, setRejectedSchedules] = useState([]);
  const [pendingSchedules, setPendingSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("approved");
  const [selectedTime, setSelectedTime] = useState(null);

  //const [modalOpendelete, setModalOpendelete] = useState(false);

  // const openDeleteModal = (event) => {
  //   setSelectedEventForDeletion(event);
  //   setModalOpendelete(true);
  // };

  // const handleCloseModaldelete = () => {
  //   setSelectedEventForDeletion(null);
  //   setModalOpendelete(false);
  // };
  
  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };
  

// Function to handle dropdown change
const handleMyScheduleChange = (event) => {
  setSelectedSchedule(event.target.value);
};


  const handleCloseModal1 = () => {
    setModalOpen1(false); // Close the modal
    setClickedEvent(null); // Clear clicked event data
  };


  const handleEventClick1 = (selected) => {
    setClickedEvent(selected.event); // Set clicked event data
    setModalOpen1(true); // Open the modal
  };
  


  function formatDate(dateString) {
    const date = new Date(dateString);
    // Format date as: Month Day, Year - Hour:Minute AM/PM
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    // Format date as: Month Day, Year - Hour:Minute AM/PM
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  }

  
  

const handleOptionChange1 = (event) => {
  setSelectedOption1(event.target.value); // Update the selected option
};


const filterEventsByOption = () => {
  switch (selectedOption1) {
    case "upcoming":
      return upcomingEventsFromDB;
    case "finished":
      return finishedEventsFromDB;
    case "allsched":
      return allEventsFromDB;
    default:
      return [];
  }
};


  const filterEvents = () => {
    switch (selectedOption) {
      case 'upcoming':
        return upcomingEvents;
      case 'finished':
        return finishedEvents;
      default:
        return currentEvents;
    }
  };
  
  // Event handler for changing the selected option
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  


  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const counselorData = querySnapshot.docs
          .filter((doc) => doc.data().role === "admin") // Filter only users with role "admin"
          .map((doc) => doc.data().username); // Extract counselor usernames
        setCounselors(counselorData);
      } catch (error) {
        console.error("Error fetching counselors:", error);
      }
    };
  
    fetchCounselors();
  }, []);

  //fetchevent datas
  useEffect(() => {    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        console.log(user);
  
        // Fetch events from the "schedule" collection
        const fetchEvents = async () => {
          try {
            const querySnapshot1 = await getDocs(collection(db, "schedule"));
            const events = querySnapshot1.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              title: `Guidance Counseling `,
            }));
  
            const currentDate = new Date();
            const upcoming = events.filter(
              (event) => new Date(event.start) > currentDate && (event.state === 'pending' || event.state === 'approved')
            );
            const finished = events.filter(
              (event) => new Date(event.start) <= currentDate && (event.state === 'pending' || event.state === 'approved' || event.state === 'done' )
            );
            setCurrentEvents(events);
            setUpcomingEvents(upcoming);
            setFinishedEvents(finished);
          } catch (error) {
            console.error("Error fetching events:", error);
          }
        };
  
        fetchEvents();

        const fetchMySchedules = async () => {
          try {
            if (username) {
              // Fetch schedules for the current user
              const q = query(
                collection(db, "schedule"),
                where("username", "==", username)
              );
              const querySnapshot = await getDocs(q);
              const scheduleData = [];
              querySnapshot.forEach((doc) => {
                scheduleData.push(doc.data());
              });
              setMySchedules(scheduleData);
              
              // Filter schedules by state
              const approved = scheduleData.filter(schedule => schedule.state === 'approved');
              const rejected = scheduleData.filter(schedule => schedule.state === 'reject');
              const pending = scheduleData.filter(schedule => schedule.state === 'pending');
              
              // Set schedules for each state
              setApprovedSchedules(approved);
              setRejectedSchedules(rejected);
              setPendingSchedules(pending);
            }
          } catch (error) {
            console.error('Error fetching schedules:', error);
          }
        };
    
        fetchMySchedules();
    
  
        // Fetch events from the "events" collection
        const fetchEventsFromDB = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "events"));
            const eventsFromDB = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              title: `${doc.data().name} info:${doc.data().info}`,
            }));
  
            const currentDate = new Date();
            const upcoming = eventsFromDB.filter(
              (event) => new Date(event.start) > currentDate
            );
            const finished = eventsFromDB.filter(
              (event) => new Date(event.start) <= currentDate
            );
  
            setUpcomingEventsFromDB(upcoming);
            setFinishedEventsFromDB(finished);
            setAllEventsFromDB(eventsFromDB);
          } catch (error) {
            console.error("Error fetching events from database:", error);
          }
        };
  
        fetchEventsFromDB();
      } else {
        setCurrentUser(null);
        setMySchedules([]);
        setCurrentEvents([]);
        setUpcomingEvents([]);
        setFinishedEvents([]);
        setUpcomingEventsFromDB([]);
        setFinishedEventsFromDB([]);
        setAllEventsFromDB([]);
      }
    });
  
    return () => unsubscribe();
  }, [username]);
  
  // Combine all events into a single array
  const allEvents = [...currentEvents, ...allEventsFromDB];
  
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
        const studentNum= userData.studentNumber;
        const year = userData.year;
        const department= userData.department;
        setdepartment(department)
        setYear(year)
        setCourse(course)
        setStudentNum(studentNum)
        setUsername(username); // Update the state with username
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };



  const calendarRef = useRef(null);

  const handleDateClick = (selected,arg) => {
    const currentDate = new Date();
    const selectedDate = new Date(selected.startStr);
    const selectedEndDate = new Date(selected.endStr);


    // Check if selected date is before current date
    const currentViewType = calendarRef.current.getApi().view.type;

    // Check if current view is month grid view
    if (currentViewType === 'dayGridMonth') {
      redirectToWeekGridView();
    } else {
      if (selectedDate < currentDate) {
        setSnackbarMessage("Cannot schedule events for past dates.");
        setSnackbarOpen(true);
        return;
      }
      setSelectedDate(selected); 
      setModalOpen(true);
      setSelectedTime(`${selectedDate.toLocaleString()} - ${selectedEndDate.toLocaleTimeString()}`);
      
    }
    

   
    
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTime(null);

  };
  const redirectToWeekGridView = () => {
    const calendarApi = calendarRef.current.getApi(); // Assuming calendarRef is a ref to your FullCalendar component

    calendarApi.changeView('timeGridWeek');
  };


  const handleAddEvent = async () => {
  if (counselor.trim() && counselinginfo.trim && username && selectedDate) { // Check if selectedDate exists
    const eventId = uuidv4();
    try {
      // Check if there is already an event scheduled at the selected time
      const overlappingEvents = MySchedules.filter(schedule =>
        new Date(schedule.start) < new Date(selectedDate.endStr) &&
        new Date(schedule.end) > new Date(selectedDate.startStr)
      );
      
      if (overlappingEvents.length > 0) {
        // If overlapping events exist, show a message and return without scheduling
        setSnackbarMessage("There is already an event scheduled at that time.");
        setSnackbarOpen(true);
        return;
      }
      
      // If no overlapping events, proceed to schedule the new event
      await setDoc(doc(db, "users", currentUser.uid, "schedules", eventId), {
        title: "Schedule",
        counselor,
        studentNum: studentNum,
        course: course,
        start: selectedDate.startStr,
        end: selectedDate.endStr,
        allDay: false,
        username: username,
        state: "pending",
        timeStamp: serverTimestamp(),
        department: department,
        read: false,
      });

      await setDoc(doc(db, "schedule", eventId), {
        title: "Schedule",
        counselor,
        studentNum: studentNum,
        course: course,
        start: selectedDate.startStr,
        end: selectedDate.endStr,
        allDay: false,
        reasonMessage: counselinginfo,
        username: username,
        state: "pending",
        timeStamp: serverTimestamp(),
        department: department,
        year: year,
        read: false,
      });
        
      setModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  }
};


//   const handleEventClick = (selected) => {
//     setSelectedEventForDeletion(selected); // Set selected event for deletion
//     setModalOpendelete(true); // Open the delete modal
//   };
  
  
//   const handleDeleteEvent = async () => {
//     const eventId = selectedEventForDeletion.id;
//     try {
//       // Delete the event document from Firestore
//       await deleteDoc(doc(db, "schedule", eventId));
//       console.log("Event deleted successfully from Firestore");
//       setSelectedEventForDeletion(null); // Clear selected event after deletion
//     } catch (error) {
//       console.error("Error deleting event from Firestore:", error);
//     }
// };

  
  
  const handleAddEventToEventsDatabase = async () => {
    if (eventName.trim() && eventInfo.trim() && username && selectedDate) { // Check if all required fields are filled
      const eventId = uuidv4();
      try {
        await setDoc(doc(db, "events", eventId), {
          name: eventName,
          info: eventInfo,
          start: selectedDate.startStr, // Use selectedDate for start
          end: selectedDate.endStr, // Use selectedDate for end
          username: username,
          timeStamp:serverTimestamp(),
        });
        setModalOpen(false);
      } catch (error) {
        console.error("Error adding event:", error);
      }
    }
  };


  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage('');
    }, 3000); // Hide the alert after 3 seconds
  };
  return (
    <div>
      
      <Box display="flex"  >
        
        <Box m="2px" flex="6" marginTop="51px" >
          <Box display="flex" justifyContent="space-between" margin="25px" border= "solid 2px #d0d0d0" borderRadius= "10px" backgroundColor="white">

            {/* CALENDAR */}
            <Box flex="1 1 100%" padding="35px">
            {alertMessage && <div className="alert">{alertMessage}</div>}

              <FullCalendar
                height="75vh"
                ref={calendarRef}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEventRows={true}
                select={handleDateClick}
                slotDuration="00:15:00" // Set the time slot duration to 15 minutes

                //eventClick={handleEventClick}
                eventClick={handleEventClick1}
                events={allEvents} // Set the combined events here
                initialEvents={allEvents}
                allDaySlot={false}
                selectAllow={(selectInfo) => {
                  const startHour = selectInfo.start.getHours();
                  const endHour = selectInfo.end.getHours();
                  const startDay = selectInfo.start.getDay();
                  
                  // Disable selection on Saturdays (6) and Sundays (0)
                  if (startDay === 0 || startDay === 6) {
                    showAlert('Cannot schedule events on weekends.');

                    return false;
                  }
            
                  // Allow selection only between 7:15 AM and 5:00 PM
                  if (
                    (startHour > 8 || startHour === 8 ) &&
                    endHour < 17
                  ) {
                    return true;
                  }
                  showAlert('Cannot schedule events outside of 8:00 AM to 5:00 PM.');

                  return false;
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="boxcontainerlist">

      <Box display="flex" justifyContent="center" >
        <Box  width="50%" p="15px"  margin="25px" border= "none" borderRadius="4px" backgroundColor="#f9f8f6" maxHeight="600px"  overflow="auto">
      <Select value={selectedOption} onChange={handleOptionChange}
      variant="outlined"
      fullWidth
      sx={{
        marginBottom:"10px",
        color:"white",
        border: "#b46279", // Border color
        borderRadius: "5px", // Border radius
        backgroundColor: "#b46279", // Background color
        "&:focus": {
          borderColor: "white", // Border color on focus
           // Box shadow on focus
        }
      }}>
  <MenuItem value="upcoming">Upcoming Schedules</MenuItem>
  <MenuItem value="finished">Finished Schedules</MenuItem>
  <MenuItem value="allsched">All Schedules</MenuItem>
</Select>

{filterEvents().map((event) => (
  <List className="schedule-list">
  <ListItem key={event.id} className="schedule-item" >
    <ListItemText
          primary={`${event.title}`}
          secondary={
            <>
             
             Counselor: {event.counselor}<br/>
             {formatDate(event.start, { year: "numeric", month: "short", day: "numeric", hour: 'numeric', minute: 'numeric' })}-
             {formatTime(event.end, {hour: 'numeric', minute: 'numeric' })}
              
            </>
          }
          className="schedule-text"
        />
  </ListItem>
  </List>
))}
</Box>
<Box  width="50%" p="15px"  margin="25px" border= "none" borderRadius="4px" backgroundColor="#f9f8f6" maxHeight="600px"  overflow="auto">
<Select value={selectedOption1} onChange={handleOptionChange1}
variant="outlined"
fullWidth
sx={{
  marginBottom:"10px",
  color:"white",
  border: "#b46279", // Border color
  borderRadius: "5px", // Border radius
  backgroundColor: "#b46279", // Background color
  "&:focus": {
    borderColor: "white", // Border color on focus
     // Box shadow on focus
  }
}}>
  <MenuItem value="upcoming">Upcoming Events</MenuItem>
  <MenuItem value="finished">Finished Events</MenuItem>
  <MenuItem value="allsched">All Events</MenuItem>
</Select>

{/* JSX for displaying the filtered events based on the selected option */}
{filterEventsByOption().map((event) => (
  <Box backgroundColor={colors.red} p="15px" borderRadius="4px" key={event.id}>
    <List className="schedule-list">
      <ListItem className="schedule-item">
        <ListItemText
          primary={`${event.name}`}
          secondary={
            <>
              Start: {formatDate(event.start, { year: "numeric", month: "short", day: "numeric", hour: 'numeric', minute: 'numeric' })}<br/>
              End: {formatDate(event.end, { year: "numeric", month: "short", day: "numeric", hour: 'numeric', minute: 'numeric' })}<br/>
              Info: {event.info}
            </>

          }
          className="schedule-text"
        />
      </ListItem>
    </List>
  </Box>
))}
</Box>
</Box>
<Box width="40%" p="15px" margin="25px" border=" none " borderRadius="4px" boxShadow= "0 0 0 0.1rem rgba(0, 0, 255, 0.02s)" backgroundColor="#f9f8f6" maxHeight="600px" overflow="auto">
  <Box backgroundColor={colors.red} p="15px" borderRadius="4px">
      <Typography variant="h6">Your Schedules</Typography>

      <Select
  value={selectedSchedule}
  onChange={handleMyScheduleChange}
  variant="outlined"
  fullWidth
  sx={{
    marginBottom:"10px",

    color:"white",
    border: "#b46279", // Border color
    borderRadius: "5px", // Border radius
    backgroundColor: "#b46279", // Background color
    "&:focus": {
      borderColor: "white", // Border color on focus
       // Box shadow on focus
    }
  }}
>
  <MenuItem value="approved">Approved Schedules</MenuItem>
  <MenuItem value="rejected">Reschedules</MenuItem>
  <MenuItem value="pending">Pending Schedules</MenuItem>
  <MenuItem value="done">Done Schedules</MenuItem>

</Select>


{selectedSchedule === "approved" && (
  <List className="schedule-list">
    {approvedSchedules.map((schedule, index) => (
      <ListItem key={index} className="schedule-item">
        <ListItemText
          primary={`${schedule.counselor}`}
          secondary={
            <>
              {schedule.message} <br />
              {formatDate(schedule.start)}-{formatTime(schedule.end)}
            </>
          }
          className="schedule-text"
        />
      </ListItem>
    ))}
  </List>
)}


      {selectedSchedule === "rejected" && (
        <List className="schedule-list">
          {rejectedSchedules.map((schedule, index) => (
      <ListItem key={index} className="schedule-item">
      <ListItemText
                primary={`${schedule.counselor}`}
                secondary={
                  <>
                    {schedule.message} <br />
                    {formatDate(schedule.start)}-{formatTime(schedule.end)}
                  </>
                }
                className="schedule-text"

              />
            </ListItem>
          ))}
        </List>
      )}

{selectedSchedule === "pending" && (
  <List className="schedule-list">
    {pendingSchedules.map((schedule, index) => (
      <ListItem key={index} className="schedule-item">
        <ListItemText 
          primary={`${schedule.counselor}`}
          secondary={
            <>
              {formatDate(schedule.start)}-{formatTime(schedule.end)}
            </>
          }
          className="schedule-text"
        />
        {/* <button onClick={() => handleEventClick(schedule)}>Cancel</button> */}
      </ListItem>
    ))}
  </List>
)}

{selectedSchedule === "done" && (
  <List className="schedule-list">
    {pendingSchedules.map((schedule, index) => (
      <ListItem key={index} className="schedule-item">
        <ListItemText 
          primary={`${schedule.counselor}`}
          secondary={
            <>
              {formatDate(schedule.start)}-{formatTime(schedule.end)}
            </>
          }
          className="schedule-text"
        />
        {/* <button onClick={() => handleEventClick(schedule)}>Cancel</button> */}
      </ListItem>
    ))}
  </List>
)}

  </Box>
</Box>

</Box>


      {/* Snackbar for displaying error message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Center the snackbar
      />
      {/* Modal for entering fullname and counselor */}
      
      <Modal open={modalOpen && selectedTime !== null} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #ccc',
            boxShadow: 24,
            borderRadius: "20px",
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Enter Schedule Details
          </Typography>
          <FormControl fullWidth margin="normal">
            <label htmlFor="event-type" id="event-type-label" fontSize="16px">
              Schedule Counseling
            </label>

          </FormControl>
          {eventType === "Schedule Counseling" && (
            <>
              <FormControl fullWidth margin="normal">
  <label style={{ fontSize: "16px", marginBottom: "5px" }}>Name: {username}</label>
  <label style={{ fontSize: "16px", marginBottom: "5px" }}>Department: {department}</label>
  <label style={{ fontSize: "16px", marginBottom: "5px" }}>Course: {course}</label>
  <label style={{ fontSize: "16px", marginBottom: "5px" }}>Student Num: {studentNum}</label>
  <label style={{ fontSize: "16px", marginBottom: "5px" }}>Year: {year} year</label>
              {selectedTime && (
              <p>Date: {selectedTime.toLocaleString()}</p>
            )}
              </FormControl>
              <TextField
                id="counseling-info"
                label="Reason For guidance counseling"
                multiline
                rows={4}
                value={counselinginfo}
                onChange={(e) => setCouselingInfo(e.target.value)}
                required
                style={{ width: "100%" }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="counselor-label">Counselor</InputLabel>
                <Select
                  labelId="counselor-label"
                  id="counselor"
                  value={counselor}
                  onChange={(e) => setCounselor(e.target.value)}
                  disabled={eventType !== "Schedule Counseling"}
                  required
                >
                  {/* Populate counselor options */}
                  {counselors.map((counselorName) => (
                    <MenuItem key={counselorName} value={counselorName}>{counselorName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          {eventType === "Event" && (
            <>
              <TextField
                id="event-info"
                label="Event Info"
                multiline
                rows={4}
                value={eventInfo}
                onChange={(e) => setEventInfo(e.target.value)}
              />
              <TextField
                id="event-name"
                label="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </>
          )}
        
          <Button variant="contained" onClick={eventType === "Schedule Counseling" ? handleAddEvent : handleAddEventToEventsDatabase} sx={{ bgcolor: '#b46279', '&:hover': { bgcolor: '#8a344c' } }}>
            {eventType === "Schedule Counseling" ? "Schedule" : "Add Event"}
          </Button>
          <Button variant="contained" onClick={handleCloseModal} sx={{ bgcolor: '#8a344c', '&:hover': { bgcolor: '#b46279' } }}>
            Cancel
          </Button>
         
        </Box>
      </Modal>
       {/* Modal for displaying event details */}
       <Modal open={modalOpen1} onClose={handleCloseModal1}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: '2px solid #ccc',
            borderRadius:"20px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Event Details
          </Typography>
          {/* Display event details */}
          {clickedEvent && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                 {clickedEvent.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                 {formatDate(clickedEvent.start)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                 {formatDate(clickedEvent.end)}
              </Typography>
              {/* You can add more event details here */}
            </>
          )}
          <Button onClick={handleCloseModal1} sx={{ color:'white',bgcolor: '#8a344c', '&:hover': { bgcolor: '#b46279' } }}>Close</Button>
        </Box>
      </Modal>
      <Modal open={successModalOpen} onClose={handleCloseSuccessModal}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #ccc',
      boxShadow: 24,
      borderRadius: "20px",
      p: 4,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Success
    </Typography>
    <Typography variant="body1" sx={{ marginBottom:"15px",}}>
      Event scheduled successfully.
    </Typography>
    <Button onClick={handleCloseSuccessModal} sx={{ color:"white",bgcolor: '#b46279', '&:hover': { bgcolor: '#8a344c' } }}>
      Close
    </Button>
  </Box>
</Modal>

      {/* <DeleteEventModal
        open={openDeleteModal}
        onClose={handleCloseModaldelete}
        onDelete={handleDeleteEvent}
        selectedEvent={selectedEventForDeletion}
      /> */}
    </div>
  );
};

export default UserCalendar;
