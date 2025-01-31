import { createContext, useContext, useState } from "react";

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({
    photos: [],
    videos: [],
    audios: [],
  });

  const addContent = (type, data) => {
    setContent((prevState) => ({
      ...prevState,
      [type]: [...prevState[type], data],
    }));
  };

  const removeContent = (type, id) => {
    setContent((prevState) => ({
      ...prevState,
      [type]: prevState[type].filter((item) => item.id !== id),
    }));
  };

  return (
    <ContentContext.Provider value={{ content, addContent, removeContent }}>
      {children}
    </ContentContext.Provider>
  );
};
