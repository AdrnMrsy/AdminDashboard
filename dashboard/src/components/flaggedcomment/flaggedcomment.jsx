import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';


const FlaggedComments = () => {
  const [flaggedComments, setFlaggedComments] = useState([]);

  useEffect(() => {
    const fetchFlaggedComments = async () => {
      try {
        const threadsQuerySnapshot = await getDocs(collection(db, 'threads'));
        const flaggedCommentsData = [];

        threadsQuerySnapshot.forEach(threadDoc => {
          const threadData = threadDoc.data();
          if (threadData.flaggedComments) {
            Object.keys(threadData.flaggedComments).forEach(index => {
              const flaggedComment = threadData.flaggedComments[index];
              flaggedCommentsData.push({ id: index, comment: flaggedComment.content, flaggedBy: flaggedComment.commentedBy });
            });
          }
        });

        setFlaggedComments(flaggedCommentsData);
      } catch (error) {
        console.error('Error fetching flagged comments:', error);
      }
    };

    fetchFlaggedComments();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'comment', headerName: 'Comment', width: 300 },
    { field: 'flaggedBy', headerName: 'Flagged By', width: 200 },
  ];

  return (
    <div style={{ height: 500, width: '94%' ,margin:'30px' }}>
      
      <DataGrid
        rows={flaggedComments}
        // className="datagrid"
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        slots={{
          toolbar: () => (
            <div>
                <GridToolbar /> {/* This is to render the default toolbar */}
                <div>Custom Info Here</div> {/* Your custom content */}
            </div>
        ),       
       }}
      />
    </div>
  );
};

export default FlaggedComments;
