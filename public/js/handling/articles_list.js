document.addEventListener('DOMContentLoaded', () => {
    const selectMenu = document.querySelector('.articlesMenu');
    const articlesList = document.querySelector('.articles-list');
    const articlesCount = document.querySelector('.articlesCount');
    const allArticles = Array.from(articlesList.children);
    let allArticlesPremium = allArticles.concat();
    const dropdownButton = document.getElementById('dropdownStatus');
    const premiumCheckbox = document.getElementById('premiumCheckbox');
    let previousStatus = 'all';

    premiumCheckbox.addEventListener('change', () => {
        const isPremium = premiumCheckbox.checked;
        const filteredArticles = allArticlesPremium.filter(article => {
            return article.getAttribute('is-premium') === isPremium.toString();
        });

        articlesCount.innerText = filteredArticles.length;
        articlesList.innerHTML = '';
        filteredArticles.forEach(article => articlesList.appendChild(article));
    });

    // Filter articles based on the selected status
    Array.from(selectMenu.children).forEach((state) => {
        state.addEventListener('click', () => {
            const isPremium = premiumCheckbox.checked;
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
                allArticlesPremium = allArticles.concat();

                const filterPremium = allArticles.filter(article => {
                    return article.getAttribute('is-premium') === isPremium.toString();
                });
                articlesCount.innerText = filterPremium.length;
                articlesList.innerHTML = '';
                filterPremium.forEach(article => articlesList.appendChild(article));
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

            allArticlesPremium = filteredArticles.concat();
            const filterPremium = filteredArticles.filter(article => {
                return article.getAttribute('is-premium') === isPremium.toString();
            });
            articlesCount.innerText = filterPremium.length;
            articlesList.innerHTML = '';
            filterPremium.forEach(article => articlesList.appendChild(article));
            // filteredArticles.forEach(article => articlesList.appendChild(article));
        });
    });
});
