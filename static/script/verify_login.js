
$.post("/db/verify_token", JSON.stringify({
    "token": readCookie("token")
})).done(function (data){
    console.log(data);

    if (data[1] != "valid"){
        eraseCookie("token");
        location.href = "/login";
    }

})