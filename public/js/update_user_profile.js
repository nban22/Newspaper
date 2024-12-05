document.getElementById('updateProfileForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target; // Get the form element
    const formData = new FormData(form); // Create FormData from the form fields

    try {
        const response = await fetch(`/api/v1/users/me`, {
            method: 'PUT', // Use PUT method
            body: formData // Send the form data
        });

        if (response.ok) {
            const result = await response.json(); // Parse the response as JSON
            // console.log(result); // Log the result to the console

            alert('Profile updated successfully!');
            // Optionally, you can redirect the user or update the UI with new profile data
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`); // Show error message if the request fails
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the profile.');
    }
});
