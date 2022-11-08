var vagn={

}

let base64String = "";
function imageUploaded() {
    var file = document.querySelector(
        'input[type=file]')['files'][0];
  
    var reader = new FileReader();
    console.log("next");
      
    reader.onload = function () {
        base64String = reader.result.replace("data:", "")
            .replace(/^.+,/, "");
  
        imageBase64Stringsep = base64String;
  
        // alert(imageBase64Stringsep);
        console.log(base64String);
    }
    reader.readAsDataURL(file);
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
        let disname = $("#displayinput").val();
        let categry = $("#categoryinput").val();
        let priced = $("#priceinput").val();
        let imgpath = base64String;
        let bbfdate = new Date($("#bbinput").val());
        let prodid = $("#productidinput").val();
        let amount = $("#amountinput").val();
        let numone = 1;

        api("/db/create_item",{
            "display_name": disname,
            "category": categry,
            "price": priced,
            "image_src": imgpath,
            "best_before": bbfdate,
            "product_id": numone + prodid,
            "item_count": amount
        }, data=>{
            console.log(data);
            if (data[0] != 0){
                alert(data);
            }
            else{
                location.reload()
            }
        })
    })
    //Lägger till antal produkter på en specifik produktID
    $("#changebutton").click(function(){
        let productidchange = $("#prodidadd").val();
        let changeby = $("#changeby").val();
        api("/db/change_item_count",{
            "product_id": productidchange,
            "changeby": changeby,
        },data=>{
            if (data[0] != 0){
                alert(data[1])
            }
            else{
                location.reload()
            }
        
        })
    })
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
    var name = $("<p>").attr({"class":"productname"}).add(`<p>${data.best_before}</p><h4>Stock:${data.item_count}</h4><h1>${data.display_name}</h1>`);
    var price = $("<p>").attr({"class":"price"}).add(`<h1>${data.price} kr</h1>`);
    div2.append(name);
    div2.append(price);
    div.append(img);
    div.append(div2);
    $("#content").append(div);
}

// Hämtar dagens datum och delar upp det till År Månad och Dag
var date1 = new Date();
var year = date1.getFullYear();
var month = date1.getMonth() +1;
// padStart Lägger till variabel / sträng "0" tills det uppnår den specificerade längden "2"
var day = String(date1.getDate()).padStart(2,'0');

api("/db/purchase_history", {}, data=>{
    console.log(data)
    // Jämnför månad och skriver ut allt som säldes under den månaden
    let boughtMonth = (year,month) =>{
    // Lägger ihopp År och Månad med - mellan
    var fullDate = [year,month].join("-");
    Object.keys(data).forEach(i => {
        if(fullDate == date[i].date_of_transaction.slice(0,-3))
        {
            console.log(data[i].date_of_transaction);
            console.log(data[i].products_bought);
            console.log(data[i].price_paid.total_money_in);
        }
    });}

    // Samma som functionen ovan men jämnför dagen också.
    let boughtDay = (year,month,day) =>{
    var fullDate = [year,month,day].join("-");
    Object.keys(data).forEach(i => {
        if(fullDate == data[i].date_of_transaction)
        {
            console.log(data[i].date_of_transaction);
            console.log(data[i].products_bought);
            console.log(data[i].price_paid.total_money_in);
        }
    });}
})
