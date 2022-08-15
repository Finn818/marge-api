let customers = [];
const users = document.getElementById('#feed');

fetch('http://localhost:8080/')
.then((res) => res.json())
.then((data) => {
    customers = data;
    console.log(data);
    displayUsers(data);
});

function displayUsers(users) {
    feed.innerHTML = "";
    //LOOP through users to get values onto the screen
    users.forEach((user) => {
        //html display
        feed.innerHTML += `
        <div>3 
        <h4>${user.id}</h4>
        <h4>${user.prodName}</h4>
        <h4>${user.prodDesc}</h4>
        <h4>${user.prodType}</h4>
        <h4>${user.prodPrice}</h4>
        <h4>${user.prodImg_URL}</h4>
        <h4>${user.prodSerial_Code}</h4>
        <h4>${user.email}</h4>
        <h4>${user.password}</h4>
        </div>
        `;
    })
}
displayUsers(users);