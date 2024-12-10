document.getElementById("comment-submit-btn").addEventListener("click", async () => {
    const comment = document.getElementById("comment-input").value;

    if (!comment) {
        alert("Please enter a comment.");
        return;
    } else {
        alert("Comment posted successfully!");
    }


    // try {
    //     const response = await fetch("/api/v1/comments", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ article_id: articleId, content }),
    //     });

    //     const data = await response.json();

    //     if (response.ok) {
    //       alert("Comment posted successfully!");
    //       commentInput.value = ""; // Clear input field
    //       // Optionally: Update the UI to display the new comment
    //     } else {
    //       alert(data.message || "Failed to post comment.");
    //     }
    //   } catch (error) {
    //     console.error("Error posting comment:", error);
    //     alert("An error occurred. Please try again later.");
    //   }

});
