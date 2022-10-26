var vagn={

}
//hämtar från databasen och definerar variabler.
//main funktion
api("/db/get_items", {}, data=>{
    Object.keys(data[1].items).forEach(e=>{
        vagn[e]=0;
        var info = data[1].items[e];
        allproducts(info);
    })
    data[1].categorys.forEach(e=>{
        console.log(e)
        category(e);
    })
    //Visar endast produkter som är i den valda kategorin
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
    $("#submitbutton").click(function(){
        let disname = $("#displayinput").val();
        let categry = $("#categoryinput").val();
        let priced = $("#priceinput").val();
        let imgpath = $("#imageinput").val();
        let bbfdate = $("#bbinput").val();
        let prodid = $("#productidinput").val();
        let amount = $("#amountinput").val();
        $.post("/db/create_item", JSON.stringify({
            "display_name": disname,
            "category": categry,
            "price": priced,
            "image_src": imgpath,
            "best_before": bbfdate,
            "product_id": prodid,
            "item_count": amount,
        })).done(function (data){
            console.log(data);
        })
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



