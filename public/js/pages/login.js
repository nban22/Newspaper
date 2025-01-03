const loginForm = document.querySelector('#login-form');
const email = loginForm.querySelector('#email');
const password = loginForm.querySelector('#password');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch('/api/v1/login', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            handleLoginSuccess(data.data);
        } else {
            document.querySelector('#error-message').textContent = data.message;
        }
    })
})

const handleLoginSuccess = (data) => {
    const accessToken = data.accessToken;
    localStorage.setItem('accessToken', accessToken);
    window.location.href = '/';
}