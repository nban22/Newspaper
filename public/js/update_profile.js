document.getElementById('updateProfileForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission
    const form = event.target; // Get the form element
    const formData = new FormData(form); // Create FormData from the form fields

    try {
        const accessToken = localStorage.getItem('accessToken'); // Get the access token from local storage

        const response = await fetch(`/api/v1/users/me`, {
            method: 'PUT', // Use PUT method
            headers: {
                'Authorization': `Bearer ${accessToken}` // Add the access token to the headers
            },
            body: formData // Send the form data
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            window.location.href = '/'; // Redirect to the profile page
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`); // Show error message if the request fails
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the profile.');
    }
});
