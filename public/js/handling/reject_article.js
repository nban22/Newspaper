const rejectArticleModal = document.querySelector('#rejectArticleModal');
const rejectArticleForm = document.querySelector('#rejectArticleForm');

rejectArticleModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;

    const articleId = button.getAttribute('data-article-id');

    const rejectArticleForm = document.querySelector('#rejectArticleForm');
    rejectArticleForm.setAttribute('action', `/articles/reject/${articleId}?_method=PUT`);
});