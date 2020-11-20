import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import md5 from 'js-md5';

import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
} from '../types';
import githubContext from './githubContext';

let marvelClientId;
let marvelClientSecret;

// if (process.env.NODE_ENV !== 'production') {
marvelClientId = process.env.REACT_APP_MARVEL_CLIENT_ID;
marvelClientSecret = process.env.REACT_APP_MARVEL_CLIENT_SECRET;
// } else {
//   marvelClientId = process.env.GITHUB_CLIENT_ID;
//   marvelClientSecret = process.env.GITHUB_CLIENT_SECRET;
// }

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: [],
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  const ts = Number(new Date());
  const hash = md5.create();
  hash.update(ts + marvelClientSecret + marvelClientId);

  // Search GitHub Users
  const searchUsers = async (text) => {
    setLoading();

    const res = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&nameStartsWith=${text}&apikey=${marvelClientId}&hash=${hash.hex()}`
    );

    dispatch({
      type: SEARCH_USERS,
      payload: res.data.data.results,
    });
  };

  // Get User
  const getUser = async (username) => {
    setLoading();

    const res = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&name=${username}&apikey=${marvelClientId}&hash=${hash.hex()}`
    );

    dispatch({
      type: GET_USER,
      payload: res.data.data.results[0],
    });
  };

  // Get Series
  const getUserRepos = async (series) => {
    setLoading();

    const results = [];

    for (let i = 0; i < series.length; i++) {
      const item = series[i];
      const url = item.resourceURI;
      const splitArray = url.split('/');
      const series_id = splitArray.slice(-1)[0];

      const res = await axios.get(
        `https://gateway.marvel.com:443/v1/public/series/${series_id}?ts=${ts}&apikey=${marvelClientId}&hash=${hash.hex()}`
      );
      results.push(res.data);
    }

    dispatch({
      type: GET_REPOS,
      payload: results,
    });
  };

  // Clear Users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
