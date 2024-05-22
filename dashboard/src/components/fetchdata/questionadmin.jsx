import React, { useEffect, useState } from 'react';
import AddCommentForm from '../messagecards/comment';
import { auth, db } from '../../firebase';
import { arrayUnion, collection, doc, getDoc, getDocs,where, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import '../messagecards/messagecards.css';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThreadOptions from '../messagecards/threadoption';
import UserAvatar from '../messagecards/useravatar';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library


const Threads3 = ({ usernamecouncelor }) => {
  // const [img, setImg] = useState([]);
  const [userRole, setUserRole] = useState(''); // Initialize userRole with appropriate initial value
  const [studentNum, setstudentNum] = useState(''); // Initialize userRole with appropriate initial value

  const [threads, setThreads] = useState([]);
 const [username, setUsername] = useState('');
 const [selectedImage, setSelectedImage] = useState(null);
 const [isModalOpen, setIsModalOpen] = useState(false);

 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setUsername('');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const username = userData.username;
        const role= userData.role;
        const studentNum= userData.studentNumber;
        setstudentNum(studentNum);
        setUserRole(role);
        setUsername(username);
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from 'questions' collection
        const querySnapshot = await getDocs(query(collection(db, 'questions'), where('username', '==', usernamecouncelor)));
        const threadList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isCommentFormVisible: false }));
  
        // Fetch data from 'threads' collection
        const querySnapshot1 = await getDocs(query(collection(db, 'threads'), where('username', '==', usernamecouncelor)));
        const threadList1 = querySnapshot1.docs.map(doc => ({ id: doc.id, ...doc.data(), isCommentFormVisible: false }));
  
        // Combine the results from both collections
        setThreads([...threadList, ...threadList1]);
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    };
  
    fetchData();
  
    // Set up real-time listeners for both collections
    const unsubscribeQuestions = onSnapshot(
      query(collection(db, 'questions'), where('username', '==', usernamecouncelor)),
      (snapshot) => {
        const threadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isCommentFormVisible: false }));
        setThreads(prevThreads => [...threadsData, ...prevThreads.filter(thread => thread.collection !== 'questions')]);
      }
    );
  
    const unsubscribeThreads = onSnapshot(
      query(collection(db, 'threads'), where('username', '==', usernamecouncelor)),
      (snapshot) => {
        const threadsData1 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isCommentFormVisible: false }));
        setThreads(prevThreads => [...threadsData1, ...prevThreads.filter(thread => thread.collection !== 'threads')]);
      }
    );
  
    // Clean up the listeners on component unmount
    return () => {
      unsubscribeQuestions();
      unsubscribeThreads();
    };
  }, [usernamecouncelor]);
  
  
  

  const handleLike = async (index) => {
    try {
      const updatedThreads = [...threads];
      const thread = updatedThreads[index];
      const threadRef = doc(db, 'questions', thread.id);
      
      if (!thread.likedBy || !thread.likedBy.includes(username)) {
        await updateDoc(threadRef, {
          like: thread.like + 1,
          likedBy: thread.likedBy ? [...thread.likedBy, username] : [username]
        });
        updatedThreads[index] = { ...thread, like: thread.like + 1, likedBy: [...(thread.likedBy || []), username] };
      } else {
        await updateDoc(threadRef, {
          like: thread.like - 1,
          likedBy: thread.likedBy.filter(u => u !== username)
        });
        updatedThreads[index] = { ...thread, like: thread.like - 1, likedBy: thread.likedBy.filter(u => u !== username) };
      }
  
      setThreads(updatedThreads);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleAddComment = async (index, comment, username) => {
    try {
      const updatedThreads = [...threads];
      const thread = updatedThreads[index];
      const threadRef = doc(db, 'questions', thread.id);
  
      // Check if the comment contains any inappropriate words
      const containsInappropriateWord = comment.split(" ").some(word => !isWordAppropriate(word));
  
      if (containsInappropriateWord) {
        const flaggedCommentId = uuidv4();

        // If the comment contains inappropriate words, add it to the database with a flag indicating it needs moderation
        await updateDoc(threadRef, {
          flaggedComments: arrayUnion({ id: flaggedCommentId,content: comment, commentedBy: username }),
          comment: thread.comment  // Increment comment count by 1
        });
      } else {
        // If the comment is clean, add it normally
        const updatedComments = [...(thread.comments || []), { content: comment, commentedBy: username }];
        await updateDoc(threadRef, {
          comments: updatedComments,
          comment: updatedComments.length // Update comment count based on the length of updatedComments array
        });
  
        // Update the local state with the updated threads data
        setThreads(updatedThreads.map((thread, idx) => idx === index ? { ...thread, comments: updatedComments, comment: updatedComments.length } : thread));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  const censorWord = (word) => {
    // Replace each character of the word with an asterisk (*)
    return word.split('').map(() => '*').join('');
  };
  const censorMessageContent = (content) => {
    // Split the content into words
    const words = content.split(" ");
    // Iterate through each word and censor inappropriate words
    const censoredContent = words.map(word => isWordAppropriate(word) ? word : censorWord(word)).join(" ");
    return censoredContent;
  };
   const isWordAppropriate = (word) => {
    // Define your list of inappropriate words or phrases here
   const inappropriateWords = ['tanga', 'gago', 'gaga','putangina', 'tarantado','puke','pepe', 'pokpok', 'shit', 'bullshit',
    'fuck', 'fck' , 'whore', 'puta', 'tangina' ,'syet', 'tite', 'kupal', 'kantot', 'hindot', 'nigga', 'motherfucker', 'kinginamo', 'taenamo'
   , 'asshole', 'kike', 'cum', 'pussy'
];
    // Convert word to lowercase for case-insensitive matching
    const lowercasedWord = word.toLowerCase();

    // Check if the word is in the list of inappropriate words
    return !inappropriateWords.includes(lowercasedWord);
  };

  const toggleCommentForm = (index) => {
    const updatedThreads = [...threads];
    updatedThreads[index].isCommentFormVisible = !updatedThreads[index].isCommentFormVisible;
    setThreads(updatedThreads);
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };
  return (
    <div> <div style={{display:"grid",justifyContent:"center"}}><h1 style={{paddingLeft:"200px"}}>Messages</h1>
       {threads.map((thread, index) => (
        <div key={index} className='threads-container'>
            
          <div className='threads'>
            
          <div style={{ padding:"15px",display: 'flex', alignItems: 'center' }}>
          <UserAvatar username={thread.username} />     
          <div style={{ display: 'flex', width: '500px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
           <h3 className='username' style={{ margin: '5px',fontSize:"18px"}}>{thread.username}</h3>
           <p className='datetime' style={{ margin: '5px'}}>{thread.createdAt && thread.createdAt.seconds && new Date(thread.createdAt.seconds * 1000).toLocaleString()}</p>
           </div>

           <ThreadOptions thread={thread} threadId={thread.id} userRole={userRole} currentUsername={studentNum} />
            </div>
          </div>


          {thread.content && <p className='contentmessage'>{censorMessageContent(thread.content)}</p>}
            <div className='image-container'>
            {thread.image && thread.image.img && (
              <img
                src={thread.image.img}
                alt={``}
                className='imagecontent'
                onClick={() => openModal(thread.image.img)}

              />
            )}
            </div>
            {thread.data && thread.data.img && <img src={thread.data.img} alt={``} />}
            <hr/>
            <button onClick={() => handleLike(index)} className='icons'><FavoriteBorderIcon fontSize="small" style={{ fontSize: '24px' }}/>{thread.like}</button>
            <button onClick={() => toggleCommentForm(index)} className='icons'><ChatBubbleOutlineIcon fontSize="small" style={{ fontSize: '23px' }} />{thread.comment}</button>
            
            <ul>
            {thread.isCommentFormVisible && <AddCommentForm index={index} onAddComment={handleAddComment} username={username}/>}

            {thread.isCommentFormVisible && thread.comments && thread.comments.map((comment, commentIndex) => (
                <li key={commentIndex} className='listcomments' >
                  <div style={{ padding:"5px",display: 'flex' }}>
                  <UserAvatar username={comment.commentedBy} />  
                  <div style={{ marginLeft:"5px", padding:"10px", backgroundColor:"#ccc"
                    ,borderRadius: "8px" ,  fontSize:"15px"
                  }}>  
                    <div >
                    <strong>{comment.commentedBy}</strong>
                    </div>
                    {comment.content.split(" ").map(word => isWordAppropriate(word) ? word : '****').join(" ")}
                    </div> 
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
      ))}
        </div>

      {isModalOpen && (
        <div  className="modalmain"onClick={closeModal}>
          <div className="modalmessage">
          <div className="modalmessage-content">
            <img src={selectedImage} alt="Selected" />
          </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default Threads3;
