import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const LoadBalancePage = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { userData, updateBalance } = useAuth();
  const [newBalance,setNewBalance]=useState(0);
  const navigate = useNavigate();

  const handleLoadBalance = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || Number(amount) <= 0 || Number(amount)>50000) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setNewBalance(Number(userData.balance)+Number(amount));
      await updateBalance(Number(amount));
      await fetch('https://fareflowserver-production.up.railway.app/notify-balance-load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardUID: userData.cardUID,
          amount,
          newBalance:Number(userData.balance)+Number(amount),
          email: userData.email,
          phone: userData.phone,
          firstName: userData.firstName,
        })
      });
      console.log("Message Sent");
      setSuccess(`Successfully loaded ${amount} UGX`);
      setAmount('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to load balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="container" className="container">
      <Header onProfileClick={() => navigate('/profile')} />
      
      <main id="main-content">
        <div id="load-balance" className="page">
          <div className="title">
            <button onClick={() => navigate('/profile')}>
              <i className='bx bxs-left-arrow-circle'></i>
            </button>
            <h2 style={{ marginLeft: '0.5rem' }}>Load Balance</h2>
          </div>
          
          <div className="card-home" style={{ backgroundColor: '#123524', color: '#fff' }}>
            <p style={{ fontWeight: '600' }}>Current Balance:</p> 
            <h3 className="balance" style={{ color: '#fff' }}>
              {userData?.balance || '0'} UGX
            </h3>
          </div>
          
          <form onSubmit={handleLoadBalance}>
            <div className="load-amount-container">
              <input
                type="number"
                id="load-amount"
                placeholder="Enter amount in UGX"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Load Balance'}
            </button>
          </form>
          
          {error && (
            <div id="load-status" style={{ color: 'red', marginTop: '10px' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div id="load-status" style={{ color: 'green', marginTop: '10px' }}>
              {success}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LoadBalancePage;