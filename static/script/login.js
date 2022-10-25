
$.post("/db/verify_token", JSON.stringify({
    "token": readCookie("token")
})).done(function (data){
    console.log(data);

    if (data[1] == "valid"){
        location.href = "/kassa";
    }

})



function login(){
    let username = $("#username").val();
    let password = $("#password").val();

    $.post("/db/login", JSON.stringify({
        "username": username,
        "password": password
    })).done(function (data){
        console.log(data);

        if (data[0] < 0){
            alert(data[1])
        }
        else{
            createCookie("token", data[1]["token"]);
            location.reload();
        }
    })
}




api("/db/change_money", {
    "20": -1
}, data=>{
    console.log(data);
})