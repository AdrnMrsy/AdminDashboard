export const userInputs = [
    {
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "john_doe",
    },
    {
      id: "displayName",
      label: "Name and surname",
      type: "text",
      placeholder: "John Doe",
    },
    
    {
      id: "email",
      label: "Email",
      type: "mail",
      placeholder: "john_doe@gmail.com",
    },
    {
      id: "phone",
      label: "Phone",
      type: "text",
      placeholder: "+63 123 4567 892",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
    },
    {
      id: "address",
      label: "Address",
      type: "text",
      placeholder: "Elton St. 216 Bocaue",
    },
    {
      id: "birthday",
      label: "Birthday",
      type: "date",
    },
    {
      id: "role",
      label: "Role",
      type: "select", // Change type to "select" for dropdown
      options: ["student", "admin"], // Define options for the dropdown
      placeholder: "Select Role", // Optionally, you can add a placeholder for the dropdown
    },
    {
      id: "studentNumber",
      label: "Student No.",
      type: "text",
      placeholder: "2020-07093",
    },
    {
      id: "course",
      label: "Course",
      type: "select", // Change type to "select" for dropdown
      options: [
        //COLLEGE OF COMPUTER STUDIES
        "BS Computer Science",
       "BS Information Technology",
        "ACT",
        "BS Computer Engineering", 

        //COLLEGE OF EDUCATION
       "Bachelor of Elementary Education",
       "Bachelor of Secondary Education",

       //COLLEGE OF ACCOUNTANCY
       "BS in Accounting Information System", 
       "BS Accountancy",

        //COLLEGE OF BUSINESS ADMINISTRATION
        "BS Business Administration",
         

        //COLLEGE OF ARTS AND SCIENCES
       "Bachelor of Arts in Psychology",
        "Bachelor of Arts in Political Science",

        //COLLEGE OF HOSPITALITY MANAGEMENT AND TOURISM
       "BS Hotel and Restaurant Management",
       "BS Tourism",

       //COLLEGE OF MARITIME EDUCATION
       "BS Marine Transportation",
       "BS Marine Engineering",

       //SCHOOL OF MECHANICAL ENGINEERING
       "BS Mechanical Engineering",

       //COLLEGE OF HEALTH SCIENCES
       "BS Nursing"],
      placeholder: "Select Course", 
    },
    
    {
      id: "year",
      label: "Year",
      type: "select", // Change type to "select" for dropdown
      options: [,"1st", "2nd", "3rd", "4th", "5th"], // Define options for the dropdown
      placeholder: "Select Year", // Optionally, you can add a placeholder for the dropdown
    },
   
    {
      id: "department",
      label: "department",
      type: "select", // Change type to "select" for dropdown
      options: [
        "COLLEGE OF HEALTH SCIENCES",
"COLLEGE OF BUSINESS ADMINISTRATION",
"COLLEGE OF EDUCATION",
"COLLEGE OF COMPUTER STUDIES",
"COLLEGE OF ACCOUNTANCY",
"COLLEGE OF ARTS AND SCIENCES",
"COLLEGE OF HOSPITALITY MANAGEMENT AND TOURISM",
"COLLEGE OF MARITIME EDUCATION",
"SCHOOL OF MECHANICAL ENGINEERING",
      ], // Define options for the dropdown
      placeholder: "Select Year", // Optionally, you can add a placeholder for the dropdown
    },
    
  ];
  
 
  