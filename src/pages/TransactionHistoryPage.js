import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const TransactionHistoryPage = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!userData?.cardUID) {
          throw new Error('User data not available');
        }

        const userDocRef = doc(db, 'users', userData.cardUID);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Sort transactions by date (newest first)
          const sortedTransactions = (userData.transactions || [])
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          setTransactions(sortedTransactions);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateTotalSpent = () => {
    return transactions
      .filter(tx => tx.type === 'payment')
      .reduce((total, tx) => total + (tx.amount || 0), 0);
  };

  return (
    <div id="container" className="container">
      <Header onProfileClick={() => navigate('/profile')} />
      
      <main id="main-content">
        <div id="transaction-history" className="page">
          <div className="title">
            <button onClick={() => navigate('/profile')}>
              <i className='bx bxs-left-arrow-circle'></i>
            </button>
            <h2 style={{ marginLeft: '0.5rem' }}>Transaction History</h2>
          </div>
        
          {/* Total Money Used Section */}
          <div className="card-home card-total-money">
            <p>Total Money Used:</p>
            <h3 id="total-money" className="total-money">
              {calculateTotalSpent().toLocaleString()} UGX
            </h3>
          </div>
        
          {loading ? (
            <div className="loading-message">Loading transactions...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="no-transactions">No transactions found</div>
          ) : (
            <ul id="transaction-list">
              {transactions.map((transaction, index) => (
                <li key={index}>
                  <span className="date">{formatDate(transaction.date)}</span>
                  <span>{formatTime(transaction.date)}</span>
                  <span>
                    {transaction.type === 'deposit' ? '+' : '-'}
                    {transaction.amount?.toLocaleString()} UGX
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionHistoryPage;