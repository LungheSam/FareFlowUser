import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import ExpenseReportPDF from '../components/ExpenseReportPDF';
Chart.register(...registerables);

const ExpenseAnalysisPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!userData?.cardUID) return;
        
        const userDocRef = doc(db, 'users', userData.cardUID);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          const filteredTransactions = (data.transactions || [])
            .filter(tx => tx.type === 'payment')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          setTransactions(filteredTransactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userData]);

  // Calculate statistics
  const calculateStatistics = () => {
    const now = new Date();
    const currentWeek = now.getWeek();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const dailyTotals = {};
    const weeklyTotals = {};
    const monthlyTotals = Array(12).fill(0);
    const dayOfWeekTotals = Array(7).fill(0);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const week = date.getWeek();
      const day = date.getDay();
      const dateStr = date.toISOString().split('T')[0];

      // Daily totals
      dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + tx.amount;

      // Weekly totals (current year only)
      if (year === currentYear) {
        weeklyTotals[week] = (weeklyTotals[week] || 0) + tx.amount;
      }

      // Monthly totals (all years)
      monthlyTotals[month] += tx.amount;

      // Day of week totals
      dayOfWeekTotals[day] += tx.amount;
    });

    // Current week expenses
    const weekExpenses = weeklyTotals[currentWeek] || 0;

    // Current month expenses
    const monthExpenses = monthlyTotals[currentMonth];

    // Total expenses
    const totalExpenses = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    // Averages
    const transactionDays = Object.keys(dailyTotals).length;
    const transactionMonths = monthlyTotals.filter(m => m > 0).length;
    const avgDaily = transactionDays > 0 ? totalExpenses / transactionDays : 0;
    const avgMonthly = transactionMonths > 0 ? totalExpenses / transactionMonths : 0;

    return {
      totalExpenses,
      weekExpenses,
      monthExpenses,
      avgDaily,
      avgMonthly,
      monthlyTotals,
      dayOfWeekTotals,
      days
    };
  };

  const {
    totalExpenses,
    weekExpenses,
    monthExpenses,
    avgDaily,
    avgMonthly,
    monthlyTotals,
    dayOfWeekTotals,
    days
  } = calculateStatistics();

  // Chart data
  const weeklyChartData = {
    labels: days,
    datasets: [
      {
        label: 'Expenses by Day of Week',
        data: dayOfWeekTotals,
        backgroundColor: 'rgba(30, 123, 39, 0.7)',
        borderColor: 'rgba(30, 123, 39, 1)',
        borderWidth: 1
      }
    ]
  };

  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyTotals,
        backgroundColor: 'rgba(18, 53, 36, 0.7)',
        borderColor: 'rgba(18, 53, 36, 1)',
        borderWidth: 1,
        tension: 0.1
      }
    ]
  };

  // Export data preparation
  const exportData = [
    ['Metric', 'Amount (UGX)'],
    ['Total Expenses', totalExpenses],
    ['This Week', weekExpenses],
    ['This Month', monthExpenses],
    ['Avg Daily', avgDaily],
    ['Avg Monthly', avgMonthly],
    ['', ''],
    ['Day', 'Amount'],
    ...days.map((day, i) => [day, dayOfWeekTotals[i]]),
    ['', ''],
    ['Month', 'Amount'],
    ...monthlyChartData.labels.map((month, i) => [month, monthlyTotals[i]])
  ];

  const handleEmailReport = async () => {
    // In a real app, you would call a backend API to send the email
    alert(`Report will be sent to ${email}`);
    setEmail('');
  };

  if (loading) {
    return <div>Loading expense data...</div>;
  }

  return (
    <div id="container" className="container">
      <Header onProfileClick={() => navigate('/profile')} />
      
      <main id="main-content">
        <div id="expense-analysis" className="page">
          <div className="title">
            <button onClick={() => navigate('/profile')}>
              <i className='bx bxs-left-arrow-circle'></i>
            </button>
            <h2 style={{ marginLeft: '0.5rem' }}>Expense Analysis</h2>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Expenses</h4>
              <p>{totalExpenses.toLocaleString()} UGX</p>
            </div>
            <div className="stat-card">
              <h4>This Week</h4>
              <p>{weekExpenses.toLocaleString()} UGX</p>
            </div>
            <div className="stat-card">
              <h4>This Month</h4>
              <p>{monthExpenses.toLocaleString()} UGX</p>
            </div>
            <div className="stat-card">
              <h4>Avg Daily</h4>
              <p>{avgDaily.toLocaleString()} UGX</p>
            </div>
            <div className="stat-card">
              <h4>Avg Monthly</h4>
              <p>{avgMonthly.toLocaleString()} UGX</p>
            </div>
          </div>

          {/* Charts */}
          <div className="chart-container">
            <div className="chart">
              <h3>Weekly Expense Pattern</h3>
              <Bar 
                data={weeklyChartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  }
                }} 
              />
            </div>
            <div className="chart">
              <h3>Monthly Expense Trend</h3>
              <Line 
                data={monthlyChartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Export Options */}
          <div className="export-options">
            <h3>Export Report</h3>
            <div className="export-buttons">
              <PDFDownloadLink 
                document={<ExpenseReportPDF data={exportData} />} 
                fileName="fareflow_expense_report.pdf"
              >
                {({ loading }) => (
                  <button disabled={loading}>
                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>

              <CSVLink data={exportData} filename="fareflow_expense_report.csv">
                <button>Download CSV</button>
              </CSVLink>

              <div className="email-report">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleEmailReport}>Email Report</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper to get week number
Date.prototype.getWeek = function() {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

export default ExpenseAnalysisPage;