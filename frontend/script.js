document
  .getElementById("registrationForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Create the address object and append it as a JSON string
    const address = {
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      country: formData.get("country"),
    };

    // Remove individual address fields to avoid duplicates
    formData.delete("street");
    formData.delete("city");
    formData.delete("state");
    formData.delete("zipCode");
    formData.delete("country");

    // Append the address object as a stringified JSON
    formData.append("address", JSON.stringify(address));

    try {
      const response = await fetch(
        "http://localhost:8000/api/customers/register",
        {
          method: "POST",
          body: formData, // FormData handles files and other data
        }
      );

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
