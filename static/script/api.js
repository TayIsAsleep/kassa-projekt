function api(url, data, _callback){
    $.post(url, JSON.stringify(
        Object.assign({"token": readCookie("token")}, data)
    )).done(function (data){
        if (
            typeof(data) == typeof([]) && 
            data.length >= 2 &&
            typeof(data[0]) == typeof(-2) && 
            data[0] == -2
        ){
            console.log(data);
            switch (data[1]) {
                case "bad token":
                    alert("Your token has expired. Please log in again")
                    break;
                case "token is not ADMIN":
                    alert("You are not logged in as an admin, but you are trying to access a ADMIN only page.")
                    break;
                case "no json included, missing token":
                case "no token in data":
                    alert("No token was sent. Logging out.")
                    break;
                default:
                    alert(data)
                    break;
            }
            window.location = "/logout"
        }
        _callback(data)
    })
}

// api_test_function("/db/get_money", {
// }, data=>{
//     console.log(data);
// })