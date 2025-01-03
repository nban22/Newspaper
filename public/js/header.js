

// document.getElementById("search-form").style.display = "none";
// document.getElementById("search-icon").onclick = function () {
//     document.getElementById("search-form").style.display = "block";
//     document.getElementById("search-form").focus();
// };

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        const query = searchInput.value.trim();

        if (query) {
            // Default parameters
            const params = new URLSearchParams({
                q: query,
                limit: "10",
                page: "1",
                sort: "view_count",
                order: "desc",
            });

            // Navigate to the search page with query parameters
            window.location.href = `/search?${params.toString()}`;
        } else {
            alert("Please enter a search term.");
        }
    });
});
