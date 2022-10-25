
$.get("/db/get_items").done(function (data){
    Object.keys(data[1].items).forEach(e=>{
        console.log(data[1].items[e])

        
    })
})
