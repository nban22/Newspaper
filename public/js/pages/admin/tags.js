const updateTagModal = document.querySelector('#updateTagModal');
const updateTagForm = document.querySelector('#updateTagForm');

updateTagModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;

    const tagId = button.getAttribute('data-tag-id');
    const tagName = button.getAttribute('data-tag-name');
    updateTagForm.setAttribute('action', `/api/v1/tags/update/${tagId}?_method=PUT`);

    const tagNameInput = updateTagModal.querySelector('#tagNameInput');
    
    tagNameInput.value = tagName;
});

const deleteTagModal = document.querySelector('#deleteTagModal');
deleteTagModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;

    const tagId = button.getAttribute('data-tag-id');
    const tagName = button.getAttribute('data-tag-name');

    const tagNameTag = deleteTagModal.querySelector('#tagName');
    tagNameTag.textContent = tagName;

    const deleteTagForm = document.querySelector('#deleteTagForm');
    deleteTagForm.setAttribute('action', `/api/v1/tags/delete/${tagId}?_method=DELETE`);

});