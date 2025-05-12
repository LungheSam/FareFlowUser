import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AboutUsPage = () => {
  const navigate = useNavigate();

  const socialLinks = [
    {
      name: 'Twitter',
      icon: 'bx bxl-twitter',
      url: 'https://twitter.com/fareflow'
    },
    {
      name: 'Instagram',
      icon: 'bx bxl-instagram-alt',
      url: 'https://instagram.com/fareflow'
    },
    {
      name: 'LinkedIn',
      icon: 'bx bxl-linkedin-square',
      url: 'https://linkedin.com/company/fareflow'
    },
    {
      name: 'Website',
      icon: 'bx bx-globe',
      url: 'https://fareflow.com'
    }
  ];

  const handleBackClick = () => {
    navigate('/profile');
  };

  const handleSocialClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div id="container" className="container">
      <Header onProfileClick={() => navigate('/profile')} />
      
      <main id="main-content">
        <div id="about" className="page">
          <div className="title">
            <button onClick={handleBackClick}>
              <i className='bx bxs-left-arrow-circle'></i>
            </button>
            <h2 style={{ marginLeft: '0.5rem' }}>About Us</h2>
          </div>
          
          <h3>Know more about us</h3>
        
          <div className="social-cards">
            {socialLinks.map((social, index) => (
              <div 
                key={index} 
                className="card-about" 
                onClick={() => handleSocialClick(social.url)}
              >
                <div className="card-icon">
                  <i className={social.icon}></i>
                </div>
                <div className="card-text">
                  <h4>{social.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;