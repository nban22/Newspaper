// Function to handle comment submission
async function submitComment() {
    const commentInput = document.getElementById("comment-input");
    const comment = commentInput.value.trim(); // Get the trimmed comment
    const articleId = window.location.pathname.split("/").pop(); // Extract articleId from URL

    if (!comment) {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Please enter a comment.",
        });
        return;
    }

    const token = localStorage.getItem("token"); // Get access token from localStorage

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

        if (response.status === 201) {
            Swal.fire({
                icon: "success",
                title: "Hoàn tất",
                text: "Bình luận đã được gửi.",
            });
            commentInput.value = ""; // Clear input
            window.location.reload(); // Reload to show the new comment
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: res.message || "Failed to post comment.",
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to post comment. Please try again.",
        });
    }
}

// Debounce handler
let isSubmitting = false; 

document.getElementById("comment-submit-btn")?.addEventListener("click", async () => {
    if (isSubmitting) return; // Block if already submitting

    isSubmitting = true; // Set submitting state
    await submitComment(); // Call the submit function
    isSubmitting = false; // Reset state after completion
});
