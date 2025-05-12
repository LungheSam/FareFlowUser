import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();

  return (
    <div id="container" className="container">
      <Header onProfileClick={() => navigate('/profile')} />
      
      <main id="main-content">
        <div id="user-profile" className="page">
          <div className="title">
            <button onClick={() => navigate('/profile')}>
              <i className='bx bxs-left-arrow-circle'></i>
            </button>
            <h2 style={{ marginLeft: '0.5rem' }}>User Profile</h2>
          </div>
          
          <div className="user-profile-card">
            <div className="profile-field">
              <p className="label">First Name</p>
              <p className="value">{userData?.firstName || 'Not provided'}</p>
            </div>
            
            <div className="profile-field">
              <p className="label">Last Name</p>
              <p className="value">{userData?.lastName || 'Not provided'}</p>
            </div>
            
            <div className="profile-field">
              <p className="label">Email</p>
              <p className="value">{userData?.email || 'Not provided'}</p>
            </div>
            
            <div className="profile-field">
              <p className="label">Phone</p>
              <p className="value">{userData?.phone || 'Not provided'}</p>
            </div>
            
            <div className="profile-field">
              <p className="label">Card UID</p>
              <p className="value">{userData?.cardUID || 'Not assigned'}</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/profile')}
            style={{ marginTop: '20px', width: '100%' }}
          >
            Back to Profile
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;