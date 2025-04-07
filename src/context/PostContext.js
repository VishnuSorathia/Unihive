import React, { createContext, useReducer, useContext } from "react";
import uuid from "react-native-uuid";

const initialState = {
  posts: [],
  stories: [],
  homePosts: [],
  likedPosts: [],
};

const ADD_POST = "ADD_POST";
const ADD_LIKE = "ADD_LIKE";
const REMOVE_LIKE = "REMOVE_LIKE";
const ADD_STORY = "ADD_STORY";
const ADD_TO_HOME = "ADD_TO_HOME";

const postReducer = (state, action) => {
  if (!state) return initialState;

  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        homePosts: [action.payload, ...state.homePosts],
      };
    case ADD_LIKE:
      return {
        ...state,
        likedPosts: [...state.likedPosts, action.payload],
      };
    case REMOVE_LIKE:
      return {
        ...state,
        likedPosts: state.likedPosts.filter((post) => post.id !== action.payload),
      };
    case ADD_STORY:
      return { ...state, stories: [action.payload, ...state.stories] };
    case ADD_TO_HOME:
      return { ...state, homePosts: [action.payload, ...state.homePosts] };
    default:
      return state;
  }
};

const PostContext = createContext(initialState);

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
