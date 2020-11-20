import React, { Fragment, useEffect, useContext } from 'react';
import Spinner from '../layout/Spinner';
import Repos from '../repos/Repos';
import { Link } from 'react-router-dom';
import GithubContext from '../../context/github/githubContext';

const User = ({ match }) => {
  const githubContext = useContext(GithubContext);

  const { loading, user, getUser, getUserRepos, repos } = githubContext;

  const {
    name,
    comics = {},
    events = {},
    series = {},
    stories = {},
    urls,
    thumbnail: { extension, path } = {},
  } = user;

  // console.log(name);

  useEffect(() => {
    getUser(match.params.login);

    // async function series() {
    if (series.items != undefined) {
      getUserRepos(series.items);
    }
    // eslint-disable-next-line
  }, [name]);

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  if (loading) return <Spinner />;

  return (
    <Fragment>
      <Link to="/" className="btn btn-light">
        Back to Search
      </Link>
      <div className="card grid-2">
        <div className="all-center">
          <img
            src={`${path}.${extension}`}
            className="round-img"
            alt=""
            style={{ width: '150px' }}
          />
          <h1>{name}</h1>
        </div>
        <div>
          {urls && (
            <Fragment>
              {urls.map((url) => {
                if (url.type === 'detail') {
                  return '';
                } else {
                  return (
                    <div>
                      <h4>{url.type.capitalize()}</h4>
                      <a href={url.url}>Link to {url.type}</a>
                    </div>
                  );
                }
              })}
            </Fragment>
          )}
        </div>
      </div>
      <div className="card text-center">
        <div className="badge badge-primary">Comics: {comics.available}</div>
        <div className="badge badge-success">Events: {events.available}</div>
        <div className="badge badge-light">Series: {series.available}</div>
        <div className="badge badge-dark">Stories: {stories.available}</div>
      </div>
      {/* <Repos repos={repos} /> */}
    </Fragment>
  );
};

export default User;
