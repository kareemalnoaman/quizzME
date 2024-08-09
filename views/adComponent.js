// adComponent.js

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function shouldShowAd() {
    // Determine if the user is logged in by checking the local storage for a token
    const token = localStorage.getItem('token');
    if (token) {
        return false;
    }

    // Show ad to random users (e.g., 50% chance)
    return getRandomInt(2) === 0;
}

// function displayAd() {
//     const adContainer = document.getElementById('ad-container');
//     if (shouldShowAd()) {
//         adContainer.innerHTML = `
//       <div class="ad">
//         <h2>Special Offer!</h2>
//         <p>Subscribe now to get access to premium quizzes!</p>
//         <button onclick="window.location.href='subscribe.html'">Subscribe</button>
//       </div>
//     `;
//     }
// }

displayAd();
