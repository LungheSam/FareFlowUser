import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title = 'FareFlow', onHomeClick, onProfileClick }) => {
  const navigate = useNavigate();

  // Default click handlers if none provided
  const handleHomeClick = onHomeClick || (() => navigate('/'));
  const handleProfileClick = onProfileClick || (() => navigate('/profile'));

  return (
    <header>
      <div className="header-content">
        <h1 onClick={handleHomeClick}>{title}</h1>
        <div className="user-image" onClick={handleProfileClick}>
          <i className='bx bxs-user'></i>
        </div>
      </div>
    </header>
  );
};

export default Header;