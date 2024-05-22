import React, { useState } from "react";
import { Modal, Typography, Button } from "@mui/material";

const DeleteEventModal = ({ selectedEvent, onClose, onDelete }) => {
  return (
    <Modal open={!!selectedEvent} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          border: "2px solid #000",
          boxShadow: 24,
          padding: "16px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Delete Event
        </Typography>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this event?
        </Typography>
        <Button
          variant="contained"
          onClick={onDelete}
          style={{ marginRight: "8px" }}
        >
          Delete
        </Button>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteEventModal;
