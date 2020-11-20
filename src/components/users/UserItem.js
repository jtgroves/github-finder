import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const UserItem = ({ user: { name, thumbnail } }) => {
  return (
    <div className="card text-center">
      <img
        src={thumbnail.path + '.' + thumbnail.extension}
        style={{ height: '160px', width: 'auto' }}
        alt={name}
      />
      <h3>{name}</h3>
      <div>
        <Link to={`/user/${name}`} className="btn btn-dark btn-sm my-1">
          More
        </Link>
      </div>
    </div>
  );
};

UserItem.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserItem;
