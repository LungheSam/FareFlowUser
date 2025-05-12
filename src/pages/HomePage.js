
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Header from '../components/Header';
// import MessageRotator from '../components/MessageRotator';

// const HomePage = () => {
//   const navigate = useNavigate();
//   const { userData } = useAuth();

//   const recentTransactions = [
//     { date: 'Feb 27', time: '06:00 am', amount: '4000.00' },
//     { date: 'Feb 24', time: '04:55 pm', amount: '1500.00' },
//     { date: 'Feb 24', time: '04:55 pm', amount: '1500.00' },
//     { date: 'Feb 24', time: '04:55 pm', amount: '1500.00' }
//   ];

//   const handleFindTaxi = () => navigate('/find-taxi');
//   const handleProfileClick = () => navigate('/profile');

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 18) return 'Good Afternoon';
//     return 'Good Evening';
//   };

//   // Show loading while waiting for userData
//   if (!userData) {
//     return (
//       <div className="loading-screen">
//         <h2>Loading your dashboard...</h2>
//       </div>
//     );
//   }

//   return (
//     <div id="container" className="container">
//       <Header onProfileClick={handleProfileClick} />
//       <main id="main-content">
//         <div id="home" className="page">
//           <h2>
//             <span className="salutation">
//               {getGreeting()} <span className="user-name">{userData.firstName}</span>!
//             </span>
//           </h2>

//           <div className="card-home" id="home-message-container">
//             <MessageRotator />
//           </div>

//           <div className="card-home">
//             <p>Current Balance:</p>
//             <h3 id="balance" className="balance">{userData.balance} UGX</h3>
//           </div>

//           <div className="card-home">
//             <p>Recent Transactions:</p>
//             <ul id="recent-transactions">
//               {recentTransactions.map((transaction, index) => (
//                 <li key={index}>
//                   <span className="date">{transaction.date}</span> - {transaction.time} - UGX {transaction.amount}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <button 
//             id="find-near-taxi-bus" 
//             className="" 
//             onClick={handleFindTaxi}
//           >
//             <i className='bx bxs-bus'></i> Find a near taxi bus
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HomePage;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import Header from '../components/Header';
// import MessageRotator from '../components/MessageRotator';
// import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
// import { db } from '../services/firebase';

// const HomePage = () => {
//   const navigate = useNavigate();
//   const { userData } = useAuth();
//   const [recentTransactions, setRecentTransactions] = useState([]);
//   const [loadingTransactions, setLoadingTransactions] = useState(true);

//   useEffect(() => {
//     const fetchRecentTransactions = async () => {
//       if (!userData?.cardUID) return;
      
//       try {
//         const transactionsRef = collection(db, 'users', userData.cardUID, 'transactions');
//         const q = query(
//           transactionsRef,
//           where('type', '==', 'payment'), // Only payment transactions
//           orderBy('date', 'desc'), // Newest first
//           limit(4) // Only get 4 most recent
//         );
        
//         const querySnapshot = await getDocs(q);
//         const transactions = [];
        
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           transactions.push({
//             id: doc.id,
//             date: data.date?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//             time: data.date?.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
//             amount: data.amount?.toFixed(2)
//           });
//         });
        
//         setRecentTransactions(transactions);
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       } finally {
//         setLoadingTransactions(false);
//       }
//     };

//     fetchRecentTransactions();
//   }, [userData?.cardUID]);

//   const handleFindTaxi = () => navigate('/find-taxi');
//   const handleProfileClick = () => navigate('/profile');

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 18) return 'Good Afternoon';
//     return 'Good Evening';
//   };

//   if (!userData) {
//     return (
//       <div className="loading-screen">
//         <h2>Loading your dashboard...</h2>
//       </div>
//     );
//   }

//   return (
//     <div id="container" className="container">
//       <Header onProfileClick={handleProfileClick} />
//       <main id="main-content">
//         <div id="home" className="page">
//           <h2>
//             <span className="salutation">
//               {getGreeting()} <span className="user-name">{userData.firstName}</span>!
//             </span>
//           </h2>

//           <div className="card-home" id="home-message-container">
//             <MessageRotator />
//           </div>

//           <div className="card-home">
//             <p>Current Balance:</p>
//             <h3 id="balance" className="balance">{userData.balance} UGX</h3>
//           </div>

//           <div className="card-home">
//             <p>Recent Transactions:</p>
//             {loadingTransactions ? (
//               <p>Loading transactions...</p>
//             ) : recentTransactions.length === 0 ? (
//               <p>No recent transactions</p>
//             ) : (
//               <ul id="recent-transactions">
//                 {recentTransactions.map((transaction) => (
//                   <li key={transaction.id}>
//                     <span className="date">{transaction.date}</span> - {transaction.time} - UGX {transaction.amount}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <button 
//             id="find-near-taxi-bus" 
//             className="" 
//             onClick={handleFindTaxi}
//           >
//             <i className='bx bxs-bus'></i> Find a near taxi bus
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HomePage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import MessageRotator from '../components/MessageRotator';

const HomePage = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (!userData?.transactions) return;

    const sortedTransactions = [...userData.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4)
      .map((tx, index) => {
        const dateObj = new Date(tx.date);
        return {
          id: index,
          date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          amount: Number(tx.amount || 0).toFixed(2),
          type: tx.type || 'unknown'
        };
      });

    setRecentTransactions(sortedTransactions);
  }, [userData]);

  const handleFindTaxi = () => navigate('/find-taxi');
  const handleProfileClick = () => navigate('/profile');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!userData) {
    return (
      <div className="loading-screen">
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  return (
    <div id="container" className="container">
      <Header onProfileClick={handleProfileClick} />
      <main id="main-content">
        <div id="home" className="page">
          <h2>
            <span className="salutation">
              {getGreeting()} <span className="user-name">{userData.firstName}</span>!
            </span>
          </h2>

          <div className="card-home" id="home-message-container">
            <MessageRotator />
          </div>

          <div className="card-home">
            <p>Current Balance:</p>
            <h3 id="balance" className="balance">{String(userData.balance || 0)} UGX</h3>
          </div>

          <div className="card-home" id="recent-transactions">
            <p>Recent Transactions:</p>
            {recentTransactions.length === 0 ? (
              <p>No recent transactions</p>
            ) : (
              <ul id="recent-transactions">
                {recentTransactions.map((tx) => {
                  const sign = tx.type === 'deposit' ? '+' : '-';
                  return (
                    <li key={tx.id}>
                      <span className="date">{tx.date}</span> - {tx.time}  
                      <strong style={{ marginLeft: '15px' }}>
                        {sign} {tx.amount} UGX
                      </strong>
                    </li>
                  );
                })}
              </ul>

            )}
          </div>

          <button 
            id="find-near-taxi-bus" 
            className="" 
            onClick={handleFindTaxi}
          >
            <i className='bx bxs-bus'></i> Find a near taxi bus
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
