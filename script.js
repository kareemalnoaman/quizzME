document.getElementById('visa').addEventListener('change', handlePaymentMethodChange);
document.getElementById('mastercard').addEventListener('change', handlePaymentMethodChange);
document.getElementById('paypal').addEventListener('change', handlePaymentMethodChange);

function handlePaymentMethodChange(event) {
    const paymentDetails = document.getElementById('paymentDetails');
    const cardNumberGroup = document.getElementById('cardNumberGroup');
    const expiryDateGroup = document.getElementById('expiryDateGroup');
    const cvvGroup = document.getElementById('cvvGroup');
    const paypalEmailGroup = document.getElementById('paypalEmailGroup');

    paymentDetails.classList.remove('hidden');

    if (event.target.value === 'PayPal') {
        cardNumberGroup.classList.add('hidden');
        expiryDateGroup.classList.add('hidden');
        cvvGroup.classList.add('hidden');
        paypalEmailGroup.classList.remove('hidden');
    } else {
        cardNumberGroup.classList.remove('hidden');
        expiryDateGroup.classList.remove('hidden');
        cvvGroup.classList.remove('hidden');
        paypalEmailGroup.classList.add('hidden');
    }
}

document.getElementById('checkoutForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;
    const country = document.getElementById('country').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }

    if (name === "" || email === "" || address === "" || city === "" || zip === "" || country === "") {
        alert("All fields are required.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    alert("Form submitted successfully with payment method: " + paymentMethod.value);
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
