import React, { useState } from 'react';
import { Modal, Button, TextField ,IconButton, Menu, MenuItem} from '@mui/material';
import { db } from '../../firebase';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const ThreadOptions = ({ threadId, userRole, currentUsername,thread, username, currentuser}) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);
  const [reportSuccessModalOpen, setReportSuccessModalOpen] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleReport = async () => {
    try {
      // Add the report message to the reports collection in Firestore
      await addDoc(collection(db, 'reports'), {
        threadId: threadId,
        //thread:thread.content,
        message: reportMessage,
        reportedName:username,
        reportedBy:currentuser,
        createdAt: new Date(),
      });
      // Close the report modal
      setReportModalOpen(false);
      // Open report success modal
      setReportSuccessModalOpen(true);
      setAnchorEl(null);

    } catch (error) {
      console.error('Error reporting thread:', error);
      // Optionally, you can handle errors here
    }
  };

  const handleDelete = async () => {
    try {
      // Get the reference to the thread document
      const threadRef = doc(db, 'threads', threadId);
  
      // Delete the thread from the "threads" collection
      await deleteDoc(threadRef);
      const threadRef1 = doc(db, 'questions', threadId);
  
      // Delete the thread from the "threads" collection
      await deleteDoc(threadRef1);

      const querySnapshot = await getDocs(query(collection(db, 'reports'), where('threadId', '==', threadId)));

querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
});

  
      
      setDeleteModalOpen(false);
      // Open delete success modal
      setDeleteSuccessModalOpen(true);
      setAnchorEl(null);

    } catch (error) {
      console.error('Error deleting thread:', error);
      // Optionally, you can handle errors here
    }
  };
  const handleEdit = async () => {
    try {
      const threadRef = doc(db, 'threads', threadId);
      await setDoc(threadRef, { content: editMessage }, { merge: true });
      setEditModalOpen(false);
      setAnchorEl(null);

    } catch (error) {
      console.error('Error editing thread:', error);
    }
  };
  

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <div>
        <IconButton
        aria-controls="thread-options-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="thread-options-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
       <MenuItem onClick={() => { handleMenuClose(); setReportModalOpen(true) }}>Report</MenuItem>
        {(userRole === 'admin' || currentUsername === thread.studentNum) && <MenuItem onClick={() => { handleMenuClose(); setDeleteModalOpen(true) }}>Delete</MenuItem>}
        {currentUsername === thread.studentNum && <MenuItem onClick={() => { handleMenuClose(); setEditModalOpen(true) }}>Edit</MenuItem>}
      </Menu>

      {/* Report Modal */}
      <Modal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        aria-labelledby="report-modal-title"
        aria-describedby="report-modal-description"
      >
        <div className="modal-content" style={{ maxWidth: '500px' }}>
          <h2 id="report-modal-title">Report Thread</h2>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter your report message"
            value={reportMessage}
            onChange={(e) => setReportMessage(e.target.value)}
            fullWidth
            style={{ marginTop: '20px',marginBottom: '20px' }}
          />
          <Button onClick={handleReport}>Submit Report</Button>
          <Button onClick={() => setReportModalOpen(false)}>Cancel</Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div className="modal-content" style={{ maxWidth: '500px' }}>
          <h2 id="delete-modal-title">Delete Thread</h2>
          <p style={{ marginTop: '20px',marginBottom: '20px' }}>Are you sure you want to delete this thread?</p>
          <Button onClick={handleDelete}>Delete</Button>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
        </div>
      </Modal>


      {/* Report Success Modal */}
      <Modal
        open={reportSuccessModalOpen}
        onClose={() => setReportSuccessModalOpen(false)}
        aria-labelledby="report-success-modal-title"
        aria-describedby="report-success-modal-description"
      >
        <div className="modal-content" style={{ maxWidth: '500px' }}>
          <h2 id="report-success-modal-title">Report Submitted</h2>
          <p style={{ marginTop: '20px',marginBottom: '20px' }}>Your report has been submitted successfully.</p>
          <Button onClick={() => setReportSuccessModalOpen(false)}>Close</Button>
        </div>
      </Modal>

      {/* Delete Success Modal */}
      <Modal
        open={deleteSuccessModalOpen}
        onClose={() => setDeleteSuccessModalOpen(false)}
        aria-labelledby="delete-success-modal-title"
        aria-describedby="delete-success-modal-description"
      >
        <div className="modal-content" style={{ maxWidth: '500px' }}>
          <h2 id="delete-success-modal-title">Thread Deleted</h2>
          <p style={{ marginTop: '20px',marginBottom: '20px' }}>The thread has been deleted successfully.</p>
          <Button onClick={() => setDeleteSuccessModalOpen(false)}>Close</Button>
        </div>
      </Modal>
{/* Edit Modal */}
<Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <div className="modal-content" style={{ maxWidth: '500px' }}>
          <h2 id="edit-modal-title">Edit Thread</h2>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter your edited message"
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            fullWidth
            style={{ marginTop: '20px', marginBottom: '20px' }}
          />
          <Button onClick={handleEdit}>Submit Edit</Button>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
        </div>
      </Modal>
     
    </div>
  );
};

export default ThreadOptions;
