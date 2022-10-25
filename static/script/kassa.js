
$.get("/db/get_items").done(function (data){
    Object.keys(data[1].items).forEach(e=>{
        console.log(data[1].items[e])
        var info = data[1].items[e];
        products(info);
    })

    $(".produkter").click(function(){
        let product_id = this.getAttribute("product_id");

        
    })

    data[1].categorys.forEach(e=>{
        console.log(e)
        category(e);
    })
})


let category=(kategori)=>{
    var div = $("<div>").attr({"class":"sortobject"});
    var name = $("<h3>").html(kategori);
    div.append(name);
    $("#nav").append(div);
}

let products=(data)=>{
    console.log(data);
    var div = $("<div>").attr({"class":"produkter", "product_id": data.product_id});
    var img = $("<img>").attr({"src": data.image_src, "class":"itemImage"});
    var name = $("<p>").attr({"class":"productname"}).add(`<span>${data.display_name}</span>`);
    div.append(name);
    div.append(img);
    $("#content").append(div);

}

let kundvagn = (id) => 
{
    Object.keys()
    let arr=[];
    arr+=id;
    console.log(arr);
}