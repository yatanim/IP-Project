function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Example hardcoded admin credentials
    const adminUsername = "admin";
    const adminPassword = "admin";

    if (username === adminUsername && password === adminPassword) {
        //alert("Login successful!");
        // Redirect to the admin dashboard
        window.location.href = "admin-dashboard.html";
        return false; // Prevent form submission
    } else {
        errorMessage.textContent = "Invalid username or password";
        errorMessage.style.display = "block";
        return false;
    }
}
