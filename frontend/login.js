document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get the username and password from the form
    const username = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    try {
      // Send a POST request to the server with username and password
      const response = await fetch("http://localhost:8000/api/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          password: password,
        }),
      });

      if (response.ok) {
        // If login is successful
        const data = await response.json();
        alert(data.message);  // Show success message
        window.location.href = "./dashboard.html"; // Redirect to dashboard
      } else {
        // If login fails
        const errorData = await response.json();
        alert(
          `Error: ${errorData.message || "Login failed. Please try again."}`
        );
      }
    } catch (error) {
      alert("An error occurred while logging in.");
      console.error(error);
    }
  });