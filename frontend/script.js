document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    // Construct address object
    const address = {
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      country: formData.get("country"),
    };
  
    // Build the request payload
    const payload = {
      userName: formData.get("userName"),
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      password: formData.get("password"),
      phoneNumber: formData.get("phoneNumber"),
      occupation: formData.get("occupation"),
      dob: formData.get("dob"),
      address: address,
    };
  
    // Add avatar file if present
    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile.size > 0) {
      payload.avatar = avatarFile;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/customers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("User registered successfully!");
        this.reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Registration failed."}`);
      }
    } catch (error) {
      alert("An error occurred while registering the user.");
      console.error(error);
    }
  });
  