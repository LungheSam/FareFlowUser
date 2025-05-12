// components/MessageRotator.js
import React, { useState, useEffect } from 'react';

const MessageRotator = () => {
  const messages = [
    "🚖 Did you know that FareFlow helps you save on daily transport costs?",
    "Yes! Enjoy exclusive discounts and promotions on your taxi fares.",
    "📊 Wondering how to track your spending on transport?",
    "FareFlow provides a clear history of your transactions to help you manage your budget.",
    "🚌 Need a quick and easy way to find a taxi bus near you?",
    "Use FareFlow to locate the nearest taxi bus with just one tap!",
    "💳 Want to enjoy a hassle-free ride without carrying cash?",
    "FareFlow allows you to pay digitally, making your journey more convenient.",
    "🔔 Ever missed out on transport updates or fare changes?",
    "FareFlow keeps you informed with real-time updates to help you plan your trips better."
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeState('fade-out');
      
      // After fade out completes, change message and fade in
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => 
          (prevIndex + 1) % messages.length
        );
        setFadeState('fade-in');
      }, 300); // Match this with your CSS transition time
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <p 
      id="home-message" 
      className={`message-transition ${fadeState}`}
    >
      {messages[currentMessageIndex]}
    </p>
  );
};

export default MessageRotator;