
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

    $(".produkter").click(function(){
        let product_id = this.getAttribute("product_id");
        kundvagn(product_id)
        
    })

    data[1].categorys.forEach(e=>{
        // console.log(e)
        category(e);
    })

    //Visar endast produkter som är i den valda kategorin
   $(".sortobject").click(function(){
    if (this.getAttribute("category") === "Food"){
        $(".Food").show();
        $(".Drinks").hide();
        $(".Snacks").hide();
    }
    else if (this.getAttribute("category") === "Drinks"){
        $(".Food").hide();
        $(".Drinks").show();
        $(".Snacks").hide();
    }
    else if (this.getAttribute("category") === "All"){
        $(".Food").show();
        $(".Drinks").show();
        $(".Snacks").show();
    }
    else if (this.getAttribute("category") === "Snacks"){
        $(".Food").hide();
        $(".Drinks").hide();
        $(".Snacks").show();
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
    if(data.item_count == 0)
    {

    }
    else
    {
        var div = $("<div>").attr({"class":"produkter " + `${data.category}`,"product_id": data.product_id});
        var div2 = $("<div>").attr({"class":"container"});
        var img = $("<img>").attr({"src": data.image_src, "class":"itemImage"});
        var name = $("<p>").attr({"class":"productname"}).add(`<h1>${data.display_name}</h1>`);
        var price = $("<p>").attr({"class":"price"}).add(`<h1>${data.price} kr</h1>`);
        div2.append(name);
        div2.append(price);
        div.append(img);
        div.append(div2);
        $("#allaprodukter").append(div);
    }

}

var priset;
//lägger till grejer till kundvagnen,
let kundvagn = (id) => 
{

    api("/db/get_items", {}, data=>{
        console.log(data[1].items[id].display_name)
    
        vagn[id]++;
        console.log(vagn);
        
        priset = data[1].items[id].price * vagn[id];

        if(vagn[id]==1)
        {
            var div = $("<div>").attr({"class":`valdaProdukter ${id}`});
            var img = $("<img>").attr({"src":data[1].items[id].image_src, "class":"valdProduktImage"}); 
            var price = $("<p>").attr({"class":`vagnPris pris${id}`}).text(priset+"kr");
            var paragraph = $("<p>").text(vagn[id]).attr({"class":"vagnParagraph", "id":id});
            var plus= $("<div>").text("+").attr({"class":"vagnKnapp", "onclick":`plus(${id})`});
            var minus = $("<div>").text("-").attr({"class":"vagnKnapp","onclick":`minus(${id})`});
            var remove= $("<div>").text("remove").attr({"class":"vagnKnappR","onclick":`remove(${id})`});


            div.append(img,paragraph,price, minus, plus, remove);
            $("#kundVagn").append(div);

        }
        else if (vagn[id] > 1)
        {
            $(`#${id}`).html(vagn[id]);
            priset = data[1].items[id].price * vagn[id];
            $(`.pris${id}`).text(priset+"kr");
        }   
    });
}

let plus = (id) =>{
    vagn[id]++;
    $(`#${id}`).text(vagn[id]);
    $(`.pris${id}`).text(priset * vagn[id]+"kr");
}

let minus = (id) =>{
    if(vagn[id] === 1){
        remove(id);
    }
    else{
    vagn[id]--;
    $(`#${id}`).text(vagn[id]);
    $(`.pris${id}`).text(priset * vagn[id]+"kr");
    }
}

let remove = (id) =>{
    vagn[id] = 0;
    $(`.${id}`).remove();
}