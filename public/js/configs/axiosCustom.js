const axiosInstance = axios.create({
    baseURL: "http://localhost:3002/api/v1",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Gắn instance vào global scope
window.axiosInstance = axiosInstance;
