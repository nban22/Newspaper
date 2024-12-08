
const signupForm = document.querySelector('#signup-form');
const email = signupForm.querySelector('#email');
const password = signupForm.querySelector('#password');
const confirmPassword = signupForm.querySelector('#confirmPassword');
const role = signupForm.querySelector('#role');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch('/api/v1/signup', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
            role: role.value,
        }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        console.log({data});
        
        if (data.status === 'success') {
            window.location.href = '/login';
        } else {
            alert(data.message);
        }
    })
})