document.getElementById("comment-submit-btn").addEventListener("click", async () => {
    const comment = document.getElementById("comment-input").value; // Lấy nội dung bình luận từ input
    const articleId = window.location.pathname.split("/").pop(); // Lấy articleId từ URL

    if (!comment) {
        alert("Please enter a comment.");
        return;
    }

    const token = localStorage.getItem("token"); // Lấy access token từ localStorage

    try {
        const response = await fetch(`/api/v1/comments/${articleId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ content: comment }),
        });

        const res = await response.json();
        console.log("Response:", res);

        if (response.status === 201) {
            alert("Comment posted successfully.");
            document.getElementById("comment-input").value = "";
        } else {
            console.error("Server Error:", res.message);
            alert(res.message || "Failed to post comment.");
        }
    } catch (error) {
        console.error("Request Error:", error);
        alert("Failed to post comment.");
    }
});