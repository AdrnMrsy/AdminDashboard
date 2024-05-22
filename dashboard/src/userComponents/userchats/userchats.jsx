import React, { useState } from 'react';
import Threads from '../../components/messagecards/messagecards';
import AddThread from '../../components/messagecards/addmessage';
import './userchats.css';
import Threads2 from '../../components/messagecards/questioncards';

const UserChats = () => {
  const [threads, setThreads] = useState([]);
  const [isAddingThread, setIsAddingThread] = useState(false);

  const addThread = (thread) => {
    setThreads([...threads, { ...thread, likes: 0, comments: [] }]);
    setIsAddingThread(false); // Close the add thread pop-up after adding
  };

  const handleLike = (index) => {
    const updatedThreads = [...threads];
    updatedThreads[index].likes += 1;
    setThreads(updatedThreads);
  };

  const handleAddComment = (index, comment) => {
    const updatedThreads = [...threads];
    updatedThreads[index].comments.push(comment);
    setThreads(updatedThreads);
  };

  const toggleAddThreadPopup = () => {
    setIsAddingThread(!isAddingThread);
  };

  // Function to stop event propagation
  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="user-chats" onClick={stopPropagation}>
      <div className='basecontainer'>
        <div className='create-message'>
          <button className='create-button' onClick={toggleAddThreadPopup}>
            {isAddingThread ? 'Close' : 'Create Message'}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div ><h2>Feautured Question</h2></div>
        {isAddingThread && <AddThread onAddThread={addThread} />}
        <Threads2 threads={threads} onLike={handleLike} onAddComment={handleAddComment} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
        <div ><h2>Messages</h2></div>
        <Threads threads={threads} onLike={handleLike} onAddComment={handleAddComment} />
      </div>
    </div>
    </div>
  );
};

export default UserChats;
