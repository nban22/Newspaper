const approveArticleModal = document.querySelector('#approveArticleModal');
const approveArticleForm = document.querySelector('#approveArticleForm');
const categorySelect = approveArticleForm.querySelector('#category');
const publishDateInput = approveArticleForm.querySelector('#publishDate');

approveArticleModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const articleId = button.getAttribute('data-article-id');
    const category = button.getAttribute('data-article-category');
    categorySelect.value = category;
    const time = new Date();
    publishDateInput.value = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, '0')}-${time.getDate().toString().padStart(2, '0')}T${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    approveArticleForm.setAttribute('action', `/editor/articles/approve/${articleId}?_method=PUT`);
});