import React, { useState } from 'react';
import Threads from '../../components/messagecards/messagecards';
import AddThread from '../../components/messagecards/addquestion';
import './chats.css';
import Threads2 from '../../components/messagecards/questioncards';
import AllQ from '../../components/messagecards/allquestion';
const Chats = () => {
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

  const stopPropagation = (event) => {
    event.stopPropagation();
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
 

  return (
    <div>
      <div className='basecontainer' onClick={stopPropagation}>
        <div className='create-message'>
          <button className='create-button' onClick={toggleAddThreadPopup}>
            {isAddingThread ? 'Close' : 'Create Message'}
          </button>
         
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

        <div style={{borderRadius:"10px",backgroundColor:"#BA5255",color:"white", paddingLeft:"155px",paddingRight:"155px",paddingTop:"10px",paddingBottom:"5px"}} ><h2>Featured Question</h2></div>
        {isAddingThread && <AddThread onAddThread={addThread} />}
        <Threads2 threads={threads} onLike={handleLike} onAddComment={handleAddComment} />
        <div onClick={toggleModal} style={{ cursor: 'pointer',paddingBottom:"10px" }}>see more...</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

        <div style={{borderRadius:"10px",backgroundColor:"#BA5255",color:"white", paddingLeft:"215px",paddingRight:"215px",paddingTop:"10px",paddingBottom:"5px"}}><h2>Messages</h2></div>

        <Threads threads={threads} onLike={handleLike} onAddComment={handleAddComment} />
        </div>
        
      </div>
      {isModalOpen && (
  <div className="uc-modal-overlay" onClick={toggleModal}>
    <div className="uc-modal-content" onClick={stopPropagation}>
      <div className="uc-modal-header"><h2>Featured Questions</h2></div>

      <button className="uc-modal-close" onClick={toggleModal}>CLOSE</button>

      <AllQ />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;
