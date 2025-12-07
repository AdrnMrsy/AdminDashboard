import { createContext, useEffect, useReducer, useRef, useState } from "react";
import AuthReducer from "./AuthReducer";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

// Idle timeout (milliseconds) — change as needed
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [sessionExpired, setSessionExpired] = useState(false);
  const timerRef = useRef(null);

  // events that will reset the inactivity timer
  const activityEvents = ["mousedown", "keydown", "scroll", "touchstart", "click"];

  const clearSessionTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startSessionTimer = () => {
    clearSessionTimer();
    if (!state.currentUser) return;
    timerRef.current = setTimeout(() => {
      handleSessionExpired();
    }, SESSION_TIMEOUT_MS);
  };

  const resetSessionTimer = () => {
    // call this to extend session manually
    startSessionTimer();
  };

  const handleSessionExpired = async () => {
    try {
      // sign out from Firebase auth
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out on session expire:", err);
    }
    // dispatch logout to your reducer so app state clears
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    setSessionExpired(true);
  };

  // Attach activity listeners and start timer when user logs in.
  useEffect(() => {
    const handleActivity = () => resetSessionTimer();

    if (state.currentUser) {
      // start timer immediately and attach listeners
      startSessionTimer();
      activityEvents.forEach((ev) => document.addEventListener(ev, handleActivity, true));
    }

    return () => {
      // cleanup listeners and timer
      activityEvents.forEach((ev) => document.removeEventListener(ev, handleActivity, true));
      clearSessionTimer();
    };
    // we only want to (re)run this when currentUser changes
  }, [state.currentUser]);

  // Persist currentUser to localStorage (existing behavior)
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  // Optional: expose a manual logout helper
  const manualLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: state.currentUser,
        dispatch,
        sessionExpired,
        resetSessionTimer,
        manualLogout,
        handleSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};