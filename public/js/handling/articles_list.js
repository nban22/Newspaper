document.addEventListener('DOMContentLoaded', () => {
    const selectMenu = document.querySelector('.articlesMenu');
    const articlesList = document.querySelector('.articles-list');
    const articlesCount = document.querySelector('.articlesCount');
    const allArticles = Array.from(articlesList.children);
    const dropdownButton = document.getElementById('dropdownStatus');
    let previousStatus = 'all';

    Array.from(selectMenu.children).forEach((state) => {
        state.addEventListener('click', () => {
            // Update the dropdown text to show the selected status
            dropdownButton.innerText = state.innerText;
            

            // Update the previous status
            const status = state.getAttribute('status');
            if (status === previousStatus) {
                return;
            }
            previousStatus = status;

            // Filter articles based on the selected status

            // If the selected status is 'all', show all articles
            if (status === 'all') {
                articlesCount.innerText = allArticles.length;
                articlesList.innerHTML = '';
                allArticles.forEach(article => articlesList.appendChild(article));
                return;
            }

            // Otherwise, show only articles with the selected status
            const filteredArticles = allArticles.filter(article => {
                if (status === 'published') {
                    return article.getAttribute('status') === 'published' || article.getAttribute('status') === 'pending';
                }
                else {
                    return article.getAttribute('status') === status
                }
            }
            );

            articlesCount.innerText = filteredArticles.length;
            articlesList.innerHTML = '';
            filteredArticles.forEach(article => articlesList.appendChild(article));
        });
    });
});
