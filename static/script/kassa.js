
$.get("/db/get_items").done(function (data){
    Object.keys(data[1].items).forEach(e=>{
        console.log(data[1].items[e])

        var info = data[1].items[e];
        products(info);
    })
})


function products(data){

    var div = $("<div>").attr({"class":"produkter", "onclick": `kundvagn(${data})`});
    var img = $("<img>").attr({"src": data.image_src, "class":"itemImage"});
    div.append(img);
    $("#content").append(div);

}

let kundvagn = (id) => 
{
    let arr=[];
    arr+=id;
    console.log(arr);
}