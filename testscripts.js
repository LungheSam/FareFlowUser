// Display the home page by default
document.addEventListener("DOMContentLoaded", function () {
    showHome();
});

function showHome() {
    hideAllPages();
    document.getElementById("home").style.display = "block";
}

function showLoadBalance() {
    hideAllPages();
    document.getElementById("load-balance").style.display = "block";
}

function showTransactionHistory() {
    hideAllPages();
    document.getElementById("transaction-history").style.display = "block";
}

function showProfile() {
    hideAllPages();
    document.getElementById("profile").style.display = "block";
}

function showUserProfile() {
    hideAllPages();
    document.getElementById("user-profile").style.display = "block";
}

function showAbout() {
    hideAllPages();
    document.getElementById("about").style.display = "block";
}

function showContact() {
    hideAllPages();
    document.getElementById("contact").style.display = "block";
}

function hideAllPages() {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
        page.style.display = "none";
    });
}
function redirectTo(url) {
    window.open(url, "_blank"); // Opens in a new tab
}

function loadBalance() {
    const amount = parseFloat(document.getElementById("load-amount").value);
    const loadStatus = document.getElementById("load-status");
    
    if (!isNaN(amount) && amount > 0) {
        // Select all elements with class "balance"
        const balanceElements = document.querySelectorAll(".balance");
        
        balanceElements.forEach(balanceElement => {
            const currentBalance = parseFloat(balanceElement.innerText);
            const newBalance = (currentBalance + amount).toFixed(2);
            balanceElement.innerText = newBalance;
        });

        loadStatus.innerText = `Successfully loaded UGX ${amount}!`;
        loadStatus.classList.remove("hidden");
    } else {
        loadStatus.innerText = "Please enter a valid amount.";
        loadStatus.classList.remove("hidden");
    }
}



document.addEventListener("DOMContentLoaded", function () {
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

    let index = 0;
    const messageContainer = document.getElementById("home-message");

    function updateMessage() {
        messageContainer.style.opacity = 0; // Fade out
        messageContainer.style.transform = "translateX(-30px)"; // Move left

        setTimeout(() => {
            messageContainer.innerHTML = messages[index]; // Change text
            messageContainer.style.opacity = 1; // Fade in
            messageContainer.style.transform = "translateX(0)"; // Slide in from left
            index = (index + 1) % messages.length; // Loop back to the first message
        }, 300); // Small delay before showing the next message
    }

    setInterval(updateMessage, 5000); // Change message every 5 seconds

    
    
    
});



window.showFindTaxiPage = function () {
    document.getElementById("home").style.display = "none";
    document.getElementById("find-taxi-page").style.display = "block";
    document.getElementById("find-taxi-page").classList.add("fade-in");
};

// Function to go back to home
window.showHomePage = function () {
    document.getElementById("find-taxi-page").style.display = "none";
    document.getElementById("home").style.display = "block";
    document.getElementById("home").classList.add("fade-in");
};

// Function to initialize the map
document.addEventListener("DOMContentLoaded", function () {
    // Sample bus data
    let buses = [
        { id: 1, lat: 0.3476, lng: 32.5825, destination: "Kampala" },
        { id: 2, lat: 0.3425, lng: 32.5700, destination: "Entebbe" },
        { id: 3, lat: 0.3500, lng: 32.5900, destination: "Jinja" },
        { id: 4, lat: 0.3485, lng: 32.5650, destination: "Mukono" }
    ];

    let map = L.map('map').setView([0.3476, 32.5825], 12); // Default view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    let markers = {}; // Store markers by ID

    // Function to display buses on the map
    function displayBuses() {
        Object.values(markers).forEach(marker => map.removeLayer(marker)); // Clear previous markers

        buses.forEach(bus => {
            let marker = L.marker([bus.lat, bus.lng]).addTo(map)
                .bindPopup(`<b>Destination:</b> ${bus.destination}`);
            markers[bus.id] = marker;
        });
    }

    displayBuses(); // Load buses initially

    // Function to filter buses based on search
    window.filterBuses = function () {
        let searchQuery = document.getElementById("search-bar").value.toLowerCase();

        Object.values(markers).forEach(marker => map.removeLayer(marker)); // Clear existing markers

        buses
            .filter(bus => bus.destination.toLowerCase().includes(searchQuery))
            .forEach(bus => {
                let marker = L.marker([bus.lat, bus.lng]).addTo(map)
                    .bindPopup(`<b>Destination:</b> ${bus.destination}`);
                markers[bus.id] = marker;
            });
    };
});


