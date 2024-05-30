import React, { useState } from "react";
import { Modal, TextField, Button, Typography } from "@mui/material";

const MessageModal = ({ open, onClose, onSave }) => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    onSave(message);
    setMessage(""); // Clear the message input after saving
    setSuccess(true); // Set success status to true
  };

  const handleClose = () => {
    onClose();
    setMessage(""); // Clear the message input when closing the modal
    setSuccess(false); // Reset success status
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px" }}>
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          rows={4}
        />
        <Button variant="contained" style={{marginRight:"10px",backgroundColor:"blue"}} onClick={handleSave}>Save</Button>
        <Button variant="contained" style={{backgroundColor:"red"}} onClick={handleClose}>Close</Button>
        {success && (
          <Typography variant="body2" style={{ color: "green", marginTop: "10px" }}>Message sent successfully!</Typography>
        )}
      </div>
    </Modal>
  );
};

export default MessageModal;
