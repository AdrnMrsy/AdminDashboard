import moment from "moment";
export const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "username",
      headerName: "User",
      width: 70,
      // renderCell: (params) => {
      //   return (
      //     <div className="cellWithImg">
      //       <img className="cellImg" src={params.row.img} alt="avatar" />
      //       {params.row.username}
      //     </div>
      //   );
      // },
    },
    
    {
      field: "year",
      headerName: "Year",
      width: 50,
    },
    {
      field: "studentNumber",
      headerName: "Student No.",
      width: 100,
    },
    {
      field: "department",
      headerName: "Department",
      width: 100,
    },
    {
      field: "displayName",
      headerName: "Full Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 190,
    },
  
    {
      field: "address",
      headerName: "Address",
      width: 100,
    },
    // {
    //   field: "role",
    //   headerName: "Role",
    //   width: 100,
    // },
    {
      field: "course",
      headerName: "Course",
      width: 100,
      // renderCell: (params) => {
      //   return (
      //     <div className={`cellWithStatus ${params.row.status}`}>
      //       {params.row.status}
      //     </div>
      //   );
      //},
    },
    {
      field: "timeStamp",
      headerName: "CreationDate",
      width: 100,
      renderCell: (params) => {
        // Check if params.value is a valid date object
        if (params.value && typeof params.value.toDate === 'function') {
          // Convert the value to a date object and format it
          const formattedDate = moment(params.value.toDate()).format('MMMM DD, YYYY');
          return <div>{formattedDate}</div>;
        } else {
          // Handle the case when params.value is not a valid date
          return <div>{params.value}</div>;
        }
      }
    },
    
  ];
  
  export const adminColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "username",
      headerName: "User",
      width: 230,
      // renderCell: (params) => {
      //   return (
      //     <div className="cellWithImg">
      //       <img className="cellImg" src={params.row.img} alt="avatar" />
      //       {params.row.username}
      //     </div>
      //   );
      // },
    },
    {
      field: "displayName",
      headerName: "Full Name",
      width: 230,
    },
    {
      field: "email",
      headerName: "Email",
      width: 230,
    },
  
    {
      field: "address",
      headerName: "Address",
      width: 100,
    },
    
    // {
    //   field: "role",
    //   headerName: "Role",
    //   width: 100,
    // },
    {
      field: "timeStamp",
      headerName: "CreationDate",
      width: 230,
      renderCell: (params) => {
        // Check if params.value is a valid date object
        if (params.value && typeof params.value.toDate === 'function') {
          // Convert the value to a date object and format it
          const formattedDate = moment(params.value.toDate()).format('MMMM DD, YYYY');
          return <div>{formattedDate}</div>;
        } else {
          // Handle the case when params.value is not a valid date
          return <div>{params.value}</div>;
        }
      }
    },
    
  ];
  
  