import os
import json
from datetime import datetime
from flask import Flask
from flask import request
from flask import jsonify
from flask import Markup
from flask import render_template

app = Flask(__name__)

# Page paths
@app.route("/")
def root():
    return "root, please go to /kassa or /db"

@app.route("/kassa")
def kassa():
    return render_template("kassa.html")

@app.route("/db")
def database():
    return render_template("db.html")

@app.route("/login")
def login():
    return render_template("login.html")

# Database paths
@app.route("/db/create_item", methods=['GET', 'POST'])
def db_create_item():
    post_data = request.get_json(force=True)
    new_item = {
        "display_name": post_data['display_name'],
        "category": post_data['category'],
        "price": float(post_data['price']),
        "image_src": post_data['image_src'],
        "best_before": post_data['best_before'],
        "product_id": post_data['product_id'],
        "item_count": int(post_data['item_count'])
    }
    db = load_db(db_items_src)
    if new_item["product_id"] in db:
        return jsonify(-1, "item exists, cannot add again. please use other api")
    else:
        db[new_item["product_id"]] = new_item
        save_db(db_items_src, db)
        return jsonify(0, "product created")

@app.route("/db/change_item_count", methods=['GET', 'POST'])
def db_change_item_count():
    post_data = request.get_json(force=True)
    return jsonify(change_item_count(post_data["product_id"], int(post_data['changeby'])))

@app.route("/db/get_items")
def db_get_items():
    return jsonify(get_items())


@app.route("/db/get_money")
def db_get_money():
    return jsonify(get_money())

@app.route("/db/change_money", methods=['GET', 'POST'])
def db_change_money():
    return jsonify(change_money(request.get_json(force=True)))


@app.route("/db/make_purchase", methods=['GET', 'POST'])
def db_make_purchase():
    post_data = request.get_json(force=True)
    # print(post_data["pay_with_notations"])
    # r = change_money(post_data["pay_with_notations"])
    # print(r)
    # if r[0] < 0:return jsonify(r)

    db_items = load_db(db_items_src)

    

    total_price_to_pay = sum(db_items[x]["price"] * post_data["products_bought"][x] for x in post_data["products_bought"])
    växel_return = växla_pengar(post_data["pay_with_notations"], total_price_to_pay)

    if växel_return[0] != 0:
        return jsonify(växel_return)

    


    items_in_stock = get_items()[1]["items"]
    for product_id in post_data['products_bought']:
        buy_count = post_data['products_bought'][product_id]
        if product_id in items_in_stock:
            if items_in_stock[product_id]["item_count"] >= buy_count:
                change_item_count(product_id, buy_count * -1)

    db_purchase_history = load_db(db_purchase_history_src)
    db_purchase_history.append({
        "date_of_transaction": datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
        "products_bought": post_data['products_bought'],
        "price_paid":{
            "total_profit": total_cost,
            "notations_changed": post_data["pay_with_notations"]
        }
    })
    save_db(db_purchase_history_src, db_purchase_history)
    
    return jsonify(0, "ok")
    

if __name__ == "__main__":
    # Set working dir to path of main.py
    os.chdir(os.path.dirname(os.path.realpath(__file__)))

    db_items_src = "db/items.json"
    db_cash_src = "db/cash.json"
    db_purchase_history_src = "db/purchase_history.json"

    if not os.path.isfile(db_items_src):
        with open(db_items_src, "w") as f:
            data = {}
            json.dump(data, f, indent=4)
    if not os.path.isfile(db_cash_src):
        with open(db_cash_src, "w") as f:
            data = {}
            for x in ("1", "2", "5", "10", "20", "50", "100", "500", "1000"):
                data[x] = 5
            
            json.dump(data, f, indent=4)       
    if not os.path.isfile(db_purchase_history_src):
        with open(db_purchase_history_src, "w") as f:
            data = []
            json.dump(data, f, indent=4)


    def load_db(db_src):
        with open(db_src) as f:
            return json.load(f)
    def save_db(db_src, data):
        with open(db_src, "w") as f:
            json.dump(data, f, indent=4)
    
    def get_items():
        db = load_db(db_items_src)
        categorys = []
        [categorys.append(db[e]['category']) for e in db if not db[e]['category'] in categorys] 

        return [0, {
            "items": db,
            "categorys": categorys
        }]
    def change_item_count(product_id, changeby):
        db = load_db(db_items_src)

        new_val = db[product_id]["item_count"] + int(changeby)
        if new_val >= 0:
            db[product_id]["item_count"] = new_val
            save_db(db_items_src, db)
            return [0, "product was changed, new total is next in array", db[product_id]["item_count"]]
        else:
            return [-1, "product total can not be less than 0, no changes was made", db[product_id]["item_count"]]

    def get_money():
        db = load_db(db_cash_src)
        return {"types":db, "total":sum(int(x) * db[x] for x in db)}  
    def change_money(data):
        db = load_db(db_cash_src)

        notations_changed = 0
        for money_notation in db:
            if money_notation in data:
                new_value = db[money_notation] + int(data[money_notation])
                if new_value >= 0:
                    db[money_notation] = new_value
                    notations_changed += 1
                else:
                    return [-1, "value can not be less than 0", f"affected value: {money_notation}. tried to set value to {new_value} ({data[money_notation]}) "]
        save_db(db_cash_src, db)
        return [0, "ok" ,f"{notations_changed} values changed"]
    def växla_pengar(money_input, total_pay_ammount):
        money_in_db = load_db(db_cash_src)

        money_sizes_avaible = []
        for x in money_in_db:
            if money_in_db[x] > 0:
                money_sizes_avaible.insert(0, [int(x), money_in_db[x]])
        
        to_return = {}
        left_to_return = sum(int(x) * money_input[x] for x in money_input) - total_pay_ammount
        return_total = left_to_return

        if left_to_return == 0:
            return [0, {}, 0, "no change needed (eaven pay)"]
        elif left_to_return < 0:
            return [-1, "customer payed too little! missing this much:", left_to_return * -1]

        for money_size in money_sizes_avaible:
            while left_to_return > 0 and left_to_return >= money_size[0] and money_size[1] >= 0:
                print(money_size[1])
                left_to_return -= money_size[0]
                money_size[1] -= 1
                
                if not str(money_size[0]) in to_return:
                    to_return[str(money_size[0])] = 1
                else:
                    to_return[str(money_size[0])] += 1
        total_able_to_return = sum(int(x) * to_return[x] for x in to_return)
        
        if total_able_to_return != return_total:
            return [-1, "could not give exact change"]
        
        return [0, to_return, return_total]

    # Start Flask
    app.run(
        host="localhost",
        port="5000",
        debug=True
    )