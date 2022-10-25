var vagn={

}
$.get("/db/get_items").done(function (data){
    Object.keys(data[1].items).forEach(e=>{
        vagn[e]=0;
        var info = data[1].items[e];
        allproducts(info);
    })

    $(".produkter").click(function(){
        let product_id = this.getAttribute("product_id");
        kundvagn(product_id)
        
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

let allproducts=(data)=>{
    var div = $("<div>").attr({"class":"produkter", "product_id": data.product_id});
    var img = $("<img>").attr({"src": data.image_src, "class":"itemImage"});
    var name = $("<p>").attr({"class":"productname"}).add(`<h1>${data.display_name}</h1>`);
    div.append(name);
    div.append(img);
    $("#content").append(div);

}




let kundvagn = (id) => 
{
    // console.log(arr);

    $.get("/db/get_items").done(function (data){
        console.log(data[1].items[id].display_name)
    
        vagn[id]++;
        console.log(vagn);

    });



}