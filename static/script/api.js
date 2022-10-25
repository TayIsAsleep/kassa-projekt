function api(url, data, _callback){
    
    $.post(url, JSON.stringify(
        Object.assign({"token": readCookie("token")}, data)
    )).done(function (data){
        _callback(data)
    })
}

// api_test_function("/db/get_money", {
// }, data=>{
//     console.log(data);
// })