
document.querySelector("#reset_password_form").addEventListener("submit", async (e) => { 
    e.preventDefault();
    const password = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#password_confirm").value;

    const urlParams = new URLSearchParams(window.location.search);

    const resetToken = urlParams.get("resetToken");
    const email = urlParams.get("email");

    if (password !== passwordConfirm) {
        alert("Passwords do not match");
        return;
    }

    const response = await fetch("/api/v1/reset_password", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            email,
            resetToken,
            password,
        }),
    });

    const data = await response.json();

    if (data.status === "success") {
        alert("Password reset successful");
        window.location.href = "/login";
    } else {
        alert(data.message);
    }
})