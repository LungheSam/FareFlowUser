import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();

  // Menu items data
  const profileMenuItems = [
    { 
      icon: 'bx bx-wallet', 
      label: 'Load Balance', 
      action: () => navigate('/load-balance') 
    },
    { 
      icon: 'bx bx-history', 
      label: 'Transaction History', 
      action: () => navigate('/transaction-history') 
    },
    { 
      icon: 'bx bxs-bar-chart-alt-2', 
      label: 'Expenses Analysis', 
      action: () => navigate('/expense-analysis') 
    },
    { 
      icon: 'bx bx-info-circle', 
      label: 'About Us', 
      action: () => navigate('/about') 
    },
    { 
      icon: 'bx bx-phone', 
      label: 'Contact Us', 
      action: () => navigate('/contact') 
    }
  ];

  return (
    <div id="container" className="container">
      <Header onProfileClick={() => navigate('/profile')} />
      
      <main id="main-content">
        <div id="profile" className="page">
          <h2>My Account</h2>
          
          {/* User Profile Card */}
          <div className="user-profile card-profile" onClick={() => navigate('/user-profile')}>
            <div className="user-image-profile">
              <i className='bx bxs-user'></i>
            </div>
            <div className="user-profile-content">
              <h2>{userData?.firstName || 'User'} {userData?.lastName || ''}</h2>
              <p>{userData?.phone || 'No phone number'}</p>
            </div>
            <div className="user-profile-arrow">
              <i className='bx bx-chevron-right'></i>
            </div>
          </div>
          
          {/* Profile Menu */}
          <div className="profile-menu card-profile">
            {profileMenuItems.map((item, index) => (
              <button key={index} onClick={item.action}>
                <p>
                  <i className={item.icon}></i> {item.label}
                </p>
                <div className="user-profile-arrow">
                  <i className='bx bx-chevron-right'></i>
                </div>
              </button>
            ))}
            
            {/* Logout Button */}
            <button 
              onClick={logout} 
              style={{ background: '#123524', color: '#fff', justifyContent: 'center' }}
            >
              <p><i className='bx bx-log-out'></i> Logout</p>
              <div className="user-profile-arrow">
                <i className='bx bx-chevron-right'></i>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;