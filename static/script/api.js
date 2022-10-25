function api(url, data, _callback){
    
    $.post(url, JSON.stringify(
        Object.assign({"token": readCookie("token")}, data)
    )).done(function (data){
        if (
            typeof(data) == typeof([]) && 
            data.length >= 2 &&
            typeof(data[0]) == typeof(-1) && 
            data[0] < 0
        ){
            console.log(data);
            alert(data)
            window.location = "/login"
        }
        _callback(data)
    })
}

// api_test_function("/db/get_money", {
// }, data=>{
//     console.log(data);
// })