import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);

  const addPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const updateLikes = (postId) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? {...post, likes: post.likes + 1} : post
    ));
  };

  const addStory = (newStory) => {
    setStories(prev => [newStory, ...prev]);
  };

  return (
    <AppContext.Provider value={{ posts, addPost, updateLikes, stories, users, setUsers }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
