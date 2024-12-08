const updateCategoryModal = document.querySelector('#updateCategoryModal');
const updateCategoryForm = document.querySelector('#updateCategoryForm');

updateCategoryModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;

    const categoryId = button.getAttribute('data-category-id');
    const categoryName = button.getAttribute('data-category-name');
    const categoryParent = button.getAttribute('data-category-parent-name');

    updateCategoryForm.setAttribute('action', `/api/v1/categories/update/${categoryId}?_method=PUT`);

    const categoryNameInput = updateCategoryModal.querySelector('#categoryNameInput');
    const categoryParentInput = updateCategoryModal.querySelector('#parentNameInput');
    
    categoryNameInput.value = categoryName;
    categoryParentInput.value = categoryParent;
});

const deleteCategoryModal = document.querySelector('#deleteCategoryModal');
deleteCategoryModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;

    const categoryId = button.getAttribute('data-category-id');
    const categoryName = button.getAttribute('data-category-name');

    const categoryNameTag = deleteCategoryModal.querySelector('#categoryName');
    categoryNameTag.textContent = categoryName;

    const deleteCategoryForm = document.querySelector('#deleteCategoryForm');
    deleteCategoryForm.setAttribute('action', `/api/v1/categories/delete/${categoryId}?_method=DELETE`);

});