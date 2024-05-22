import React, { useState } from 'react';
import './comment.css';
import SendIcon from '@mui/icons-material/Send';
import { Timestamp } from 'firebase/firestore';

const AddCommentForm = ({ index, onAddComment, username }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check if the comment is not empty before adding
    if (comment.trim() !== '') {
      // Call the onAddComment function from the parent component (Threads)
      onAddComment(index, comment, username);
  
      // Reset the comment input field
      setComment('');
    }
  };
  
  
  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className='commentinput'>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          className="comment-input"
        />
        <button type="submit" className="comment-button">
          <SendIcon />
        </button>
      </div>
    </form>
  );
};

export default AddCommentForm;

