document.querySelector("#forgot_password_form").addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Forgot password form submitted");

    const email = document.querySelector("#email").value;
    const resetCode = document.querySelector("#reset_code")?.value;

    if (!resetCode) {
        const response = await fetch("/api/v1/forgot_password", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                email,
            }),
        });

        const data = await response.json();

        if (data.status === "success") {
            window.location.href = `/forgot_password?email=${email}&enterCode=true`;
        } else {
            alert(data.message || "An error occurred");
        }
    } else {
        const response = await fetch("/api/v1/forgot_password/verify_reset_code", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                email,
                resetCode,
            }),
        });

        const data = await response.json();

        if (data.status === "success") {
            window.location.href = data.data.redirectUrl;
        } else {
            alert(data.message);
        }
    }
});
