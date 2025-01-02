document.getElementById('search-form').style.opacity = 0;
document.getElementById('search-icon').onclick = function() {
    document.getElementById('search-form').style.opacity = 1;
    document.getElementById('search-form').focus();
    document.getElementById('search-icon').style.opacity = 0;
}
// fetch("/api/v1/getme", {
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
//     },
//     method: "GET",
//     credentials: "include"
// })
// .then(response => {
//     if (response.status === 401) {
//         throw new Error("Not logged in");
//     }
//     return response.json();
// })
// .then(data => {
//     console.log({data});
// })
// .catch(err => {
//     console.error(err);
//     window.location.href = "/login";
// })