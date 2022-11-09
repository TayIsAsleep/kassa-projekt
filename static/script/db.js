// Hämtar dagens datum och delar upp det till År Månad och Dag
var date1 = new Date();
var year = date1.getFullYear();
var month = date1.getMonth() +1;
// padStart Lägger till variabel / sträng "0" tills det uppnår den specificerade längden "2"
var day = String(date1.getDate()).padStart(2,'0');
// Temp variabel
var boti = 0;
var boti2 = 0;
const boughtdata =[
    {
        "date_of_transaction": "2022-11-08 10:54:14",
        "products_bought": {
            "1200303": 1
        },
        "price_paid": {
            "total_money_in": 50.0,
            "notations_changed": {
                "50": -1,
                "100": -4,
                "500": 1
            }
        }
    },
    {
        "date_of_transaction": "2022-11-08 10:54:48",
        "products_bought": {
            "1949812": 3
        },
        "price_paid": {
            "total_money_in": 300.0,
            "notations_changed": {
                "100": -2,
                "500": 1
            }
        }
    },
    {
        "date_of_transaction": "2022-11-08 11:03:45",
        "products_bought": {
            "1200303": 1,
            "1312111": 1
        },
        "price_paid": {
            "total_money_in": 70.0,
            "notations_changed": {
                "10": -1,
                "20": -1,
                "100": 1
            }
        }
    },
    {
        "date_of_transaction": "2022-11-08 11:10:21",
        "products_bought": {
            "1313125": 1,
            "1415901": 1,
            "1581811": 1
        },
        "price_paid": {
            "total_money_in": 58.0,
            "notations_changed": {
                "2": -1,
                "20": -2,
                "100": 1
            }
        }
    },
    {
        "date_of_transaction": "2022-11-08 11:11:36",
        "products_bought": {},
        "price_paid": {
            "total_money_in": 0,
            "notations_changed": {}
        }
    },
    {
        "date_of_transaction": "2022-11-09 11:11:44",
        "products_bought": {
            "1312111": 1,
            "1415901": 1,
            "1581811": 1
        },
        "price_paid": {
            "total_money_in": 68.0,
            "notations_changed": {
                "2": -1,
                "10": -1,
                "20": -1,
                "100": 1
            }
        }
    },
]
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
        category(e);
    })
    //Visar endast produkter som är i den valda kategorin
   $(".sortobject").click(function(){
    if (this.getAttribute("category") === "Food"){
        $(".Food").show();
        $(".Drinks").hide();
        $(".Snacks").hide();
        $(".Others").hide();
        $(".BoughtMonth").hide();
        $(".BoughtAdd").show();
    }
    else if (this.getAttribute("category") === "Drinks"){
        $(".Food").hide();
        $(".Drinks").show();
        $(".Snacks").hide();
        $(".Others").hide();
        $(".BoughtMonth").hide();
        $(".BoughtAdd").show();
    }
    else if (this.getAttribute("category") === "All"){
        $(".Food").show();
        $(".Drinks").show();
        $(".Snacks").show();
        $(".Others").show();
        $(".BoughtMonth").hide();        
        $(".BoughtAdd").show();
    }
    else if (this.getAttribute("category") === "Snacks"){
        $(".Food").hide();
        $(".Drinks").hide();
        $(".Snacks").show();
        $(".Others").hide();
        $(".BoughtMonth").hide();
        $(".BoughtAdd").show();
    }
    else if (this.getAttribute("category") === "Others"){
        $(".Food").hide();
        $(".Drinks").hide();
        $(".Snacks").hide();
        $(".Others").show();
        $(".BoughtMonth").hide();
        $(".BoughtAdd").show();
        }
    else if (this.getAttribute("category") === "BoughtMonth"){
        $(".Food").hide();
        $(".Drinks").hide();
        $(".Snacks").hide();
        $(".Others").hide();
        $(".BoughtMonth").show();
        $(".BoughtDay").hide();
        if(boti == 0)
        BoughtMonth(year,month,boughtdata);
        
        boti++;
    }
    else if (this.getAttribute("category") === "BoughtDay"){
        $(".Food").hide();
        $(".Drinks").hide();
        $(".Snacks").hide();
        $(".Others").hide();
        $(".BoughtMonth").hide();
        $(".BoughtAdd").show();
        if(boti2 == 0)
        BoughtDay(year,month,day,boughtdata);

        boti2++;
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


let BoughtMonth = (year,month,boughtdata) =>{
    // Lägger ihopp År och Månad med - mellan
    var fullDate = [year,month].join("-");
    Object.keys(boughtdata).forEach(i => {
        var boughtProd = "";
        if(fullDate == boughtdata[i].date_of_transaction.slice(0,-12))
        {
            // Bara en temp variabel för att hålla objectet
            let myObjBD = boughtdata[i].products_bought;
            Object.keys(boughtdata[i].products_bought).forEach(i => {
                boughtProd = boughtProd.concat(i, ", ") + `${myObjBD[i]}x `;
            });
            var name = $("<p>").attr({"class":"productname BoughtMonth"}).html(`${boughtProd}`);
            var price = $("<p>").attr({"class":"price BoughtMonth"}).html(`${boughtdata[i].price_paid.total_money_in} kr`);
            var br = $("<br>");
            $("#content").append(name,price,br);
        }
    })
};
let BoughtDay = (year,month,day,boughtdata) =>{
    // Lägger ihopp År och Månad med - mellan
    var fullDate = [year,month,day].join("-");
    Object.keys(boughtdata).forEach(i => {
        var boughtProd = "";
        if(fullDate == boughtdata[i].date_of_transaction.slice(0,-9))
        {
            // Bara en temp variabel för att hålla objectet
            let myObjBD = boughtdata[i].products_bought;
            Object.keys(boughtdata[i].products_bought).forEach(i => {
                boughtProd = boughtProd.concat(i, ", ") + `${myObjBD[i]}x `;
            });
            var name = $("<p>").attr({"class":"productname BoughtDay"}).html(`${boughtProd}`);
            var price = $("<p>").attr({"class":"price BoughtDay"}).html(`${boughtdata[i].price_paid.total_money_in} kr`);
            var br = $("<br>");
            $("#content").append(name,price,br);
        }
    })
};
// api("/db/purchase_history", {}, data=>{
//     // console.log(data)

//     let BoughtMonth = (year,month,boughtdata) =>{
    // Lägger ihopp År och Månad med - mellan
//     var fullDate = [year,month].join("-");
//     Object.keys(boughtdata).forEach(i => {
//         var boughtProd = "";
//         if(fullDate == boughtdata[i].date_of_transaction.slice(0,-12))
//         {
//             Object.keys(boughtdata[i].products_bought).forEach(i => {
//                 boughtProd = boughtProd.concat(i, ",");
//             });
//             var name = $("<p>").attr({"class":"productname BoughtMonth"}).html(`${boughtProd}`);
//             var price = $("<p>").attr({"class":"price BoughtMonth"}).html(`${boughtdata[i].price_paid.total_money_in} kr`);
//             var br = $("<br>");
//             $("#content").append(name,price,br);
//         }
//     })
// };
// })
