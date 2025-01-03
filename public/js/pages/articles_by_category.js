// Function to fetch and display tags for an article
async function fetchTags(articleId) {
    try {
        const response = await fetch(`/api/v1/tags/article/${articleId}`);
        const result = await response.json();

        if (result.status === "success" && result.data.tags) {
            const tagsContainer = document.getElementById(`tags-${articleId}`);

            if (tagsContainer) {
                // Clear any existing tags
                tagsContainer.innerHTML = "";

                // Add each tag directly from the tags array
                result.data.tags.forEach((tag) => {
                    const tagLink = document.createElement("a");
                    tagLink.className = "tag";
                    tagLink.href = `/nhan/${tag._id}`;
                    tagLink.textContent = tag.name;
                    tagsContainer.appendChild(tagLink);
                });
            }
        }
    } catch (error) {
        console.error("Error fetching tags:", error);
    }
}

// Fetch tags for all articles when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const articles = document.querySelectorAll(".article-card");
    articles.forEach((article) => {
        // Extract article ID from the href attribute
        const articleLink = article.querySelector("a");
        if (articleLink) {
            const articleId = articleLink.href.split("/").pop();
            fetchTags(articleId);
        }
    });
});
