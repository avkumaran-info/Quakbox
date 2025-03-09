import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const UseLogout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      console.log("Clearing local storage...");
      localStorage.clear();
    }
  }, [location.pathname]); // Runs every time pathname changes

  return null; // This is a hook, so it shouldn't render anything
};

export default UseLogout;
