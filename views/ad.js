document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.getElementById('close-btn');
    const adContainer = document.getElementById('ad-container');

    function hideAdForRegisteredUsers() {
        // Simulating the check for user registration status
        // This could be a call to an API or a value from localStorage
        const isRegistered = localStorage.getItem('isRegistered') === 'true';

        if (isRegistered) {
            adContainer.style.display = 'none';
        }
    }

    hideAdForRegisteredUsers();

    closeBtn.addEventListener('click', function () {
        adContainer.style.opacity = '0';
        adContainer.style.transform = 'translateY(20px)';

        setTimeout(function () {
            adContainer.style.display = 'none';
        }, 300);
    });
});
