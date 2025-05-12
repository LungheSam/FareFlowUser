import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ContactPage = () => {
  const navigate = useNavigate();

  const contactOptions = [
    {
      name: 'WhatsApp',
      icon: 'bx bxl-whatsapp',
      description: 'Fastest Support',
      action: () => window.open('https://wa.me/256742618584', '_blank')
    },
    {
      name: 'Call',
      icon: 'bx bxs-phone-call',
      description: 'Speak to Us',
      action: () => window.open('tel:+256742618584')
    },
    {
      name: 'Email Us',
      icon: 'bx bxs-envelope',
      description: 'Write an email to us',
      action: () => window.open('mailto:support@fareflow.com')
    }
  ];

  const handleBackClick = () => {
    navigate('/profile');
  };

  return (
    <div id="container" className="container">
      <Header onProfileClick={() => navigate('/profile')} />
      
      <main id="main-content">
        <div id="contact" className="page">
          <div className="title">
            <button onClick={handleBackClick}>
              <i className='bx bxs-left-arrow-circle'></i>
            </button>
            <h2 style={{ marginLeft: '0.5rem' }}>Contact Us</h2>
          </div>
        
          <p>If you have any questions, feel free to reach out!</p>
        
          <div className="contact-options">
            {contactOptions.map((option, index) => (
              <div 
                key={index} 
                className="card-contact" 
                onClick={option.action}
              >
                <i className={option.icon}></i>
                <div className="contact-info">
                  <h4>{option.name}</h4>
                  <p>{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;