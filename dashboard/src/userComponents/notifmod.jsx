import React, { useState } from 'react';
import { Box, Modal, Button, Typography } from '@mui/material';
import NotificationComponent from './notifcom';

const NotificationModal = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button style={{color:"black", fontSize:"30px"}} onClick={handleOpen}>
      <ion-icon name="notifications-sharp"></ion-icon>      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="notification-modal-title"
        aria-describedby="notification-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="notification-modal-title" variant="h6" component="h2">
            Upcoming Notifications
          </Typography>
          <NotificationComponent />
        </Box>
      </Modal>
    </div>
  );
};

export default NotificationModal;
