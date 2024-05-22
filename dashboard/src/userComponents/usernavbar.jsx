// import React, { useState } from 'react';
// import "./usernavbar.css"

// const Usernavbar = () => {
//     const [isActive, setIsActive] = useState(false);
//     const [hoveredItem, setHoveredItem] = useState(null);

//     const handleToggle = () => {
//         setIsActive(!isActive);
//     };

//     const handleHover = (index) => {
//         setHoveredItem(index);
//     };

//     return (
//         <>
//             <div className={`navigation ${isActive ? 'active' : ''}`}>
//                 <ul>
//                     <li onMouseOver={() => handleHover(0)} onMouseLeave={() => handleHover(null)}>
//                         <a href="#">
//                             <span className="icon">
//                                 <ion-icon name="person-circle"></ion-icon>
//                             </span>
//                             <span className="title">Bella Cruz</span>
//                         </a>
//                     </li>

//                     <li onMouseOver={() => handleHover(1)} onMouseLeave={() => handleHover(null)}>
//                         <a href="info_tab.html">
//                             <span className="icon">
//                                 <ion-icon name="information-circle"></ion-icon>
//                             </span>
//                             <span className="title">Info</span>
//                         </a>
//                     </li>

//                     <li onMouseOver={() => handleHover(2)} onMouseLeave={() => handleHover(null)}>
//                         <a href="inspo_tab.html">
//                             <span className="icon">
//                                 <ion-icon name="star"></ion-icon>
//                             </span>
//                             <span className="title">Inspo</span>
//                         </a>
//                     </li>

//                     <li onMouseOver={() => handleHover(3)} onMouseLeave={() => handleHover(null)}>
//                         <a href="community_tab.html">
//                             <span className="icon">
//                                 <ion-icon name="chatbubbles"></ion-icon>
//                             </span>
//                             <span className="title">Community</span>
//                         </a>
//                     </li>

//                     <li onMouseOver={() => handleHover(4)} onMouseLeave={() => handleHover(null)}>
//                         <a href="schedule_tab.html">
//                             <span className="icon">
//                                 <ion-icon name="calendar"></ion-icon>
//                             </span>
//                             <span className="title">Schedule</span>
//                         </a>
//                     </li>

//                     <li onMouseOver={() => handleHover(5)} onMouseLeave={() => handleHover(null)}>
//                         <a href="app_tab.html">
//                             <span className="icon">
//                                 <ion-icon name="rocket"></ion-icon>
//                             </span>
//                             <span className="title">App</span>
//                         </a>
//                     </li>

//                     <li onMouseOver={() => handleHover(6)} onMouseLeave={() => handleHover(null)}>
//                         <a href="setting_tab.html">
//                             <span className="icon">
//                                 <ion-icon name="settings"></ion-icon>
//                             </span>
//                             <span className="title">Settings</span>
//                         </a>
//                     </li>
//                 </ul>
//             </div>

//             <div className={`main ${isActive ? 'active' : ''}`}>
//                 <div className="topbar">
//                     <div className="toggle" onClick={handleToggle}>
//                         <ion-icon name="menu-outline"></ion-icon>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Usernavbar;
