import React, { useState } from 'react';
import Threads from '../../components/messagecards/messagecards';
import AddThread from '../../components/messagecards/addmessage';
import './userchats.css';
import Threads2 from '../../components/messagecards/questioncards';
import AllQ from '../../components/messagecards/allquestion';

const UserChats = () => {
  const [threads, setThreads] = useState([]);
  const [isAddingThread, setIsAddingThread] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
        {isAddingThread && <AddThread onAddThread={addThread} />}

        <div style={{borderRadius:"10px",backgroundColor:"#BA5255",color:"white", paddingLeft:"155px",paddingRight:"155px",paddingTop:"10px",paddingBottom:"5px"}} ><h2>Feautured Question</h2></div>
        <Threads2 threads={threads} onLike={handleLike} onAddComment={handleAddComment} />
        <div onClick={toggleModal} style={{ cursor: 'pointer',paddingBottom:"10px" }}>see more...</div>

        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
        <div style={{borderRadius:"10px",backgroundColor:"#BA5255",color:"white", paddingLeft:"215px",paddingRight:"215px",paddingTop:"10px",paddingBottom:"5px"}}><h2>Messages</h2></div>
        <Threads threads={threads} onLike={handleLike} onAddComment={handleAddComment} />
      </div>
    </div>
    {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }} onClick={toggleModal}>
          
          <div style={ {
  backgroundColor: 'white',
  height:"500px",
  overflow:"auto",
  padding: '50px',
  borderRadius: '10px',
  width: '80%',
  maxWidth: '600px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  zIndex: 1001,
}} onClick={stopPropagation}>
          <div style={{borderRadius:"10px",backgroundColor:"#BA5255",color:"white", paddingLeft:"180px",paddingTop:"10px",paddingBottom:"5px"}} ><h2>Feautured Questions</h2></div>

            <button style={{
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  color: '#BA5255',
}} onClick={toggleModal}>Close</button>
            <AllQ />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChats;
