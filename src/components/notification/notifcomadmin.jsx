import React, { useState, useEffect } from 'react';
import { Box,Button, Modal, List, ListItem, ListItemText, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase.js';
import dayjs from 'dayjs';
import Threads4 from '../fetchdata/reportedmessageview.jsx';

const NotificationComponentAdmin = () => {
  const [pendings, setPendings] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [username, setUsername] = useState('');
  const [reportedMessages, setReportedMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (username) {
      fetchUpcomingSchedules();
      fetchUpcomingEvents();
      fetchPendingSchedules();
      fetchReportedMessages();

    }
  }, [username]);

  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUpcomingSchedules = async () => {
    try {
      const q = query(collection(db, 'schedule'), where('counselor', '==', username), where('state', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      const schedules = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(schedule => new Date(schedule.start) > new Date())
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      setUpcomingSchedules(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchPendingSchedules = async () => {
    try {
      const q = query(collection(db, 'schedule'), where('counselor', '==', username), where('state', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const schedules = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(schedule => new Date(schedule.start) > new Date())
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      setPendings(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const q = query(collection(db, 'events'));
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => new Date(event.start) > new Date())
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      setUpcomingEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchReportedMessages = async () => {
    try {
      const q = query(collection(db, 'reports'));
      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(a.createdAt.toDate()) - new Date(b.createdAt.toDate()));

      setReportedMessages(messages);
    } catch (error) {
      console.error('Error fetching reported messages:', error);
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('ddd, MMM D, YYYY h:mm A');
  };

  const handleOpenModal = (threadId) => {
    setSelectedThread(threadId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedThread(null);
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Upcoming Schedules</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {upcomingSchedules.map(schedule => (
              <ListItem key={schedule.id} sx={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", width:"100%",backgroundColor:"#F9F8F6",'&:hover': { backgroundColor: '#F9F8F6' } }}>
                <ListItemText
                  primary={`Counseling with ${schedule.username}`}
                  secondary={`On ${formatDate(schedule.start)}`}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Pending Schedules</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {pendings.map(schedule => (
              <ListItem key={schedule.id} sx={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", width:"100%",backgroundColor:"#F9F8F6",'&:hover': { backgroundColor: '#F9F8F6' } }}>
                <ListItemText
                  primary={`Counseling with ${schedule.username}`}
                  secondary={`On ${formatDate(schedule.start)}`}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Upcoming Events</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {upcomingEvents.map(event => (
              <ListItem key={event.id} sx={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", width:"100%",backgroundColor:"#F9F8F6",'&:hover': { backgroundColor: '#F9F8F6' } }}>
                <ListItemText
                  primary={`Event: ${event.name}`}
                  secondary={`On ${formatDate(event.start)}`}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Reported Messages</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {reportedMessages.map(message => (
              <ListItem key={message.id} sx={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", width: "100%", backgroundColor: "#F9F8F6", '&:hover': { backgroundColor: '#F9F8F6' } }}>
                <ListItemText
                  primary={`Reported by: ${message.reportedBy}`}
                  secondary={`Message: ${message.message} - On ${formatDate(message.createdAt.toDate())}`}
                />
                                <Button variant="contained" color="primary" onClick={() => handleOpenModal(message.threadId)}>View Thread</Button>

              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 800, height: 500, overflow: "auto" }}>
          <Threads4 messageID={selectedThread} />
        </Box>
      </Modal>
    </Box>
  );
};

export default NotificationComponentAdmin;
