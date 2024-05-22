import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase.js';
import dayjs from 'dayjs';

const NotificationComponentE = ({username}) => {
  const [pendings, setPendings] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [username, setUsername] = useState('');

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
      const q = query(collection(db, 'schedule'), where('username', '==', username), where('state', '==', 'approved'));
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

  const formatDate = (dateString) => {
    return dayjs(dateString).format('ddd, MMM D, YYYY h:mm A');
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
    </Box>
  );
};

export default NotificationComponentE;
