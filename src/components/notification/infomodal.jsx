// import React from "react";
// import { Modal, Typography, Button } from "@mui/material";

// const InfoModal = ({ open, onClose, onSave, success, schedule }) => {
//   const handleApprove = () => {
//     onSave("approved");
//   };

//   const handleReject = () => {
//     onSave("reject");
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
//         <Typography variant="h6" gutterBottom>
//           Schedule Details
//         </Typography>
//         <Typography variant="body1">
//           Student Name: {schedule.username}
//         </Typography>
//         <Typography variant="body1">
//           Student Number: {schedule.studentNum}
//         </Typography>
//         <Typography variant="body1">
//           Course: {schedule.course}
//         </Typography>
//         <Typography variant="body1">
//           Department: {schedule.department}
//         </Typography>
//         <Typography variant="body1">
//           Reason: {schedule.reasonMessage}
//         </Typography>
//         <Typography variant="body1">
//           Start: {schedule.start}
//         </Typography>
//         <Typography variant="body1">
//           End: {schedule.end}
//         </Typography>
//         {success && <Typography variant="body1">Message saved successfully!</Typography>}
//         <Button onClick={handleApprove} sx={{ mr: 2 }} variant="contained" color="primary">Approve</Button>
//         <Button onClick={handleReject} variant="contained" color="error">Reject</Button>
//         <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>Close</Button>
//       </div>
//     </Modal>
//   );
// };

// export default InfoModal;
