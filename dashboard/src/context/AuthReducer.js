const AuthReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN": {
        const userData = action.payload;
  return {
    currentUser: {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      // Only store non-sensitive fields
    },
  };
      }
      case "LOGOUT": {
        return {
          currentUser: null,
        };
      }
      
      default:
        return state;
    }
  };
  
  export default AuthReducer;
  