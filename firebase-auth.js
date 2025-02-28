// firebase-auth.js

// Firebase configuration (replace with your own Firebase config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Function to handle login using email and password
function loginUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log('Logged in as:', user.email);
            storeSession(user);
            window.location.href = 'index.html'; // Redirect after successful login
        })
        .catch(error => {
            console.error('Login error:', error.message);
            alert('Login failed! Please try again.');
        });
}

// Function to store user session information (you can store it in sessionStorage or localStorage)
function storeSession(user) {
    sessionStorage.setItem('userId', user.uid);
    sessionStorage.setItem('userEmail', user.email);
    // Store other user details as needed
}

// Function to check if the user is logged in (called on home page load)
function checkUserSession() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        console.log('User is logged in');
        displayUserInfo();
    } else {
        console.log('User not logged in');
        window.location.href = 'login.html'; // Redirect to login page if not logged in
    }
}

// Function to display logged-in user's info on the home page
function displayUserInfo() {
    const userEmail = sessionStorage.getItem('userEmail');
    document.getElementById('user-info').textContent = `Logged in as: ${userEmail}`;
}

// Function to handle logout
function logoutUser() {
    auth.signOut().then(() => {
        sessionStorage.clear(); // Clear session data
        window.location.href = 'login.html'; // Redirect to login page after logout
    }).catch(error => {
        console.error('Logout error:', error.message);
    });
}

// Listen for authentication state changes
auth.onAuthStateChanged(user => {
    if (user) {
        // User is logged in
        console.log('User is logged in:', user.email);
    } else {
        // User is logged out
        console.log('User is logged out');
    }
});

// Check user session on page load of home.html
if (window.location.pathname.includes('index.html')) {
    checkUserSession();
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
}
