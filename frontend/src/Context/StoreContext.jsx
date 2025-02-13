// import axios from "axios";
// import { createContext, useEffect, useState } from "react";
// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {
//   const [videos, setVideos] = useState([]); // Store all videos
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   // Fetch all videos
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("api_token");
//         if (!token) {
//           setMessage("❌ Authorization token missing. Please log in.");
//           return;
//         }
//         const response = await axios.get(
//           "https://develop.quakbox.com/admin/api/videos/qlist",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (response.status === 200 && response.data.data) {
//           setVideos(response.data.data);
//         } else {
//           setMessage("⚠️ No videos found.");
//         }
//       } catch (error) {
//         setMessage("❌ Error fetching videos.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, []);

//   const contextValue = {
//     videos,
//     loading,
//     message,
//   };

//   return (
//     <StoreContext.Provider value={contextValue}>
//       {props.children}
//     </StoreContext.Provider>
//   );
// };
// export default StoreContextProvider;
