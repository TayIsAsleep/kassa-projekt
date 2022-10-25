var vagn={

}
//hämtar från databasen och definerar variabler.
//main funktion
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

   $(".sortobject").click(function(){
    if (this.getAttribute("category") === "Food"){
        $(".Food").show();
        $(".Drinks").hide();
    }
    else if (this.getAttribute("category") === "Drinks"){
        $(".Food").hide();
        $(".Drinks").show();
    }
    else if (this.getAttribute("category") === "All"){
        $(".Food").show();
        $(".Drinks").show();
    }
    })
})

//lägger till kategorierna från databasen
let category=(kategori)=>{
    var div = $("<div>").attr({"class":"sortobject","category": kategori});
    var name = $("<h3>").html(kategori);
    div.append(name);
    $("#nav").append(div);
}
// visar allting på content
let allproducts=(data)=>{

    var div = $("<div>").attr({"class":"produkter " + `${data.category}`,"product_id": data.product_id});
    var img = $("<img>").attr({"src": data.image_src, "class":"itemImage"});
    var name = $("<p>").attr({"class":"productname"}).add(`<h1>${data.display_name}</h1>`);
    div.append(name);
    div.append(img);
    $("#content").append(div);

}



//lägger till grejer till kundvagnen,
let kundvagn = (id) => 
{
    // console.log(arr);

    $.get("/db/get_items").done(function (data){
        console.log(data[1].items[id].display_name)
    
        vagn[id]++;
        console.log(vagn);

        if(vagn[id]==1)
        {
            var div = $("<div>").attr({"class":"valdaProdukter"});
            var img = $("<img>").attr({"src":data[1].items[id].image_src, "class":"valdProduktImage"}); 
            
            
            div.append(img);
            $("#kundVagn").append(div);
    
        }
        else if (vagn[id] > 1)
        {
    
        }

    });




}