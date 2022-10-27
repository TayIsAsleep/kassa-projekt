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
        $(".Snacks").hide();
        $(".Others").hide();
    }
    else if (this.getAttribute("category") === "Drinks"){
        $(".Food").hide();
        $(".Drinks").show();
        $(".Snacks").hide();
        $(".Others").hide();
    }
    else if (this.getAttribute("category") === "All"){
        $(".Food").show();
        $(".Drinks").show();
        $(".Snacks").show();
        $(".Others").show();
    }
    else if (this.getAttribute("category") === "Snacks"){
        $(".Food").hide();
        $(".Drinks").hide();
        $(".Snacks").show();
        $(".Others").hide();
    }
    else if (this.getAttribute("category") === "Others"){
        $(".Food").hide();
        $(".Drinks").hide();
        $(".Snacks").hide();
        $(".Others").show();
    }
    })
    //När submitbutton klickas så tar denna funktion values för inputs
    //och sätter in dem i en json fil via python
    $("#submitbutton").click(function(){
        let numone = 1;
        let disname = $("#displayinput").val();
        let categry = $("#categoryinput").val();
        let priced = $("#priceinput").val();
        let imgpath = $("#imageinput").val();
        let bbfdate = new Date($("#bbinput").val());
        let prodid = $("#productidinput").val();
        let amount = $("#amountinput").val();
        api("/db/create_item",{
            "display_name": disname,
            "category": categry,
            "price": priced,
            "image_src": imgpath,
            "best_before": bbfdate,
            "product_id": numone + prodid,
            "item_count": amount
        }, data=>{
            if (data[0] != 0){
                //display error message
                data[1];
            }
        
        })
    })
    $("changebutton").click(function(){
      let productidchange = $("#prodidadd").val();
      let changeby = $("#changeby").val();
      $.post("/db/change_item_count",({
        "product_id": productidchange,
        "changeby": changeby,
    }))}, data=>{
        if (data[0] != 0){
            //display error message
            data[1];
        }
    
    }

    )
    >>> [0, 'ok', '1 values changed']
    })
//lägger till kategorierna från databasen
let category=(kategori)=>{
    var div = $("<div>").attr({"class":"sortobject","category": kategori});
    var name = $("<h3>").html(kategori).attr("class","categoryText");
    div.append(name);
    $("#nav").append(div);
}
// visar allting på content
let allproducts=(data)=>{

    var div = $("<div>").attr({"class":"produkter " + `${data.category}`,"product_id": data.product_id});
    var div2 = $("<div>").attr({"class":"container"});
    var img = $("<img>").attr({"src": data.image_src, "class":"itemImage"});
    var name = $("<p>").attr({"class":"productname"}).add(`<h1>${data.display_name}</h1>`);
    var price = $("<p>").attr({"class":"price"}).add(`<h1>${data.price} kr</h1>`);
    div2.append(name);
    div2.append(price);
    div.append(img);
    div.append(div2);
    $("#content").append(div);

}

  


