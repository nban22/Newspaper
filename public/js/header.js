const categoriesList = document.querySelector("categories-list");

// categoriesList.innerHTML = `
//     <ul class="dropdown-menu">
//         <li><a href="/categories/1">Category 1</a></li>
//         <li><a href="/categories/2">Category 2</a></li>
//         <li><a href="/categories/3">Category 3</a></li>
//     </ul>
// `;



// fetch("http://localhost:3002/api/v1/categories", {
//     headers: {
//         "Content-Type": "application/json"
//     },
//     method: "GET"
// })
// .then(response => response.json())
// .then(data => {
//     console.log({data});
// })

window.axiosInstance.get("/categories")
.then(response => {
    console.log(response);
})
.catch(error => {
    console.log(error);
});