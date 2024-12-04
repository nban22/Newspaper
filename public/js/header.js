const categoriesList = document.querySelector("categories-list");

const logoutForm = document.querySelector('#logout-form');

logoutForm.addEventListener('submit', (e) => {
    const ok = confirm('Bạn có chắc chắn muốn đăng xuất?');
    if (!ok) {
        e.preventDefault();
    } else {
        return;
    }
})
    