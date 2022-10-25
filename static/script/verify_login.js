
$.post("/db/verify_login", JSON.stringify({
    "token": readCookie("token")
})).done(function (data){
    console.log(data);

    if (data[1] != "valid"){
        eraseCookie("token");
        location.href = "/login";
    }

})