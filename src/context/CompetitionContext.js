import React, { createContext, useReducer, useContext } from 'react';

const CompetitionContext = createContext();

const initialState = {
  competitions: [],
};

const competitionReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_COMPETITION':
      return { ...state, competitions: [...state.competitions, action.payload] };
    case 'REMOVE_COMPETITION':
      return {
        ...state,
        competitions: state.competitions.filter(comp => comp.id !== action.payload),
      };
    default:
      return state;
  }
};

export const CompetitionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(competitionReducer, initialState);

  return (
    <CompetitionContext.Provider value={{ state, dispatch }}>
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetitions = () => useContext(CompetitionContext);
