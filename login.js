// Sample hardcoded admin credentials (for demonstration purposes)
const adminCredentials = {
    username: 'IDY',  // Replace with the actual admin username
    password: 'Idrees124.'  // Replace with the actual admin password
};

// Check if there's an active session (i.e., if the admin is already logged in)
if (localStorage.getItem('loggedIn') === 'true') {
    window.location.href = 'admin.html'; // Redirect to the admin portal if already logged in
}

// Handle form submission
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting normally

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate the credentials
    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Successful login
        localStorage.setItem('loggedIn', 'true'); // Store the logged-in state in LocalStorage
        window.location.href = 'admin.html'; // Redirect to the admin portal
    } else {
        // Failed login
        alert('Invalid username or password. Please try again.');
    }
});
