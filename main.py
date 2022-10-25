import os
import json
import uuid
import hashlib
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
    return jsonify(change_money_in_db(request.get_json(force=True)))

@app.route("/db/calc_change", methods=['GET', 'POST'])
def db_calc_change():
    post_data = request.get_json(force=True)
    return jsonify(växla_pengar(post_data['money'], post_data['total_cost'])) 

@app.route("/db/make_purchase", methods=['GET', 'POST'])
def db_make_purchase():
    post_data = request.get_json(force=True)

    items_in_stock = get_items()[1]["items"]
    
    # Check that correct ammount of money was given and that we have växel
    total_price_to_pay = sum(items_in_stock[x]["price"] * post_data["products_bought"][x] for x in post_data["products_bought"])
    växel_return = växla_pengar(post_data["pay_with_notations"], total_price_to_pay)
    if växel_return[0] < 0:
        return jsonify(växel_return)
    

    # Check that all the items purchased are in stock
    for item_id in post_data["products_bought"]:
        if not item_id in items_in_stock:
            return jsonify(-1, "item id not in db", item_id)
        if items_in_stock[item_id]["item_count"] < post_data["products_bought"][item_id]:
            return jsonify(-1, "not enough items in stock for item id ", item_id)
    
    # Change money value in the DB
    all_money_change = {}
    for money_n in get_money()["types"]:
        all_money_change[money_n] = 0
        if money_n in post_data["pay_with_notations"]:
            all_money_change[money_n] += post_data["pay_with_notations"][money_n]
        if money_n in växel_return[1]:
            all_money_change[money_n] += växel_return[1][money_n] * -1
    r = change_money_in_db(all_money_change)
    if r[0] < 0:
        return jsonify(r)

    # Change product stock in DB
    for product_id in post_data['products_bought']:
        buy_count = post_data['products_bought'][product_id]
        if product_id in items_in_stock:
            if items_in_stock[product_id]["item_count"] >= buy_count:
                change_item_count(product_id, buy_count * -1)

    # Make purchase history and add to DB
    db_purchase_history = load_db(db_purchase_history_src)
    db_purchase_history.append({
        "date_of_transaction": datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
        "products_bought": post_data['products_bought'],
        "price_paid":{
            "total_money_in": total_price_to_pay,
            "notations_changed": post_data["pay_with_notations"]
        }
    })
    save_db(db_purchase_history_src, db_purchase_history)
    
    return jsonify(0, "ok", db_purchase_history[0])
    

if __name__ == "__main__":
    # Set working dir to path of main.py
    os.chdir(os.path.dirname(os.path.realpath(__file__)))

    # Create options.json if it does not exist
    options_template = {
        "host": "localhost",
        "port": "5000",
        "debug": True,

        "salt": uuid.uuid4().hex,
        "db_list":{
            "db_items":{
                "src": "db/items.json",
                "default": {}
            },
            "db_cash":{
                "src": "db/cash.json",
                "default": ["1", "2", "5", "10", "20", "50", "100", "500", "1000"]
            },
            "db_purchase_history":{
                "src": "db/purchase_history.json",
                "default": []
            },
            "db_userdata":{
                "src": "db/userdata.json",
                "default": {}
            }
        }
    }
    options = options_template
    if os.path.isfile("options.json"):
        with open('options.json', "r", encoding="utf-8") as f:
            try:
                options = json.load(f)
            except:
                print("ERROR! options.json was empty or broken and could not be converted to JSON. Resetting all values to default.")
                options = options_template             
    
    with open("options.json", "w") as f:
        for key in options_template:
            if not key in options:
                print(f"WARNING! Added missing key in options.json : '{key}': {options_template[key]}")
                options[key] = options_template[key]
        keys_to_delete = []
        for key in options:
            if not key in options_template:
                print(f"WARNING! Unused key found in options.json : '{key}': {options[key]}")
                keys_to_delete.append(key)
        for key in keys_to_delete:
            del options[key]
        json.dump(options, f, indent=4)
    
    # Load settings.json
    with open('options.json', "r", encoding="utf-8") as f:
        options = json.load(f)
    
    # Check and load some DB info
    for db_name in options['db_list']:
        db = options['db_list'][db_name]
        try:
            with open(db["src"], "r") as f:
                json.load(f)
        except:
            print(f"ERROR! {db['src']} was empty, broken or missing and could not be converted to JSON. Resetting all values to default.")
            with open(db["src"], "w") as f:
                json.dump(db["default"], f, indent=4)

    # Set python variables manually for the databases, because python gets mad if you don't
    db_items_src = options['db_list']['db_items']['src']
    db_cash_src = options['db_list']['db_cash']['src']
    db_purchase_history_src = options['db_list']['db_purchase_history']['src']
    db_userdata_src = options['db_list']['db_userdata']['src']

    def load_db(db_src):
        """Loads the DB file"""
        with open(db_src) as f:
            return json.load(f)
    def save_db(db_src, data):
        """Saves the DB file with new data"""
        with open(db_src, "w") as f:
            json.dump(data, f, indent=4)
    
    def get_items():
        """
            Will read and return the items currently in stock in the DB
            Will also return the categorys seperatly

            > {
                "items": item info
                "categorys": ["Fruits", "Drinks"....]
            }
        """
        db = load_db(db_items_src)
        categorys = []
        [categorys.append(db[e]['category']) for e in db if not db[e]['category'] in categorys] 

        return [0, {
            "items": db,
            "categorys": categorys
        }]
    def change_item_count(product_id, changeby):
        """
            Changes the current stock of an item in the DB

            product_id: ABC123
            changeby: 10

            > [0, "product was changed, new total is next in array", 20]
            > [code, statusmessage, stock ammount after change]
        """
        db = load_db(db_items_src)

        new_val = db[product_id]["item_count"] + int(changeby)
        if new_val >= 0:
            db[product_id]["item_count"] = new_val
            save_db(db_items_src, db)
            return [0, "product was changed, new total is next in array", db[product_id]["item_count"]]
        else:
            return [-1, "product total can not be less than 0, no changes was made", db[product_id]["item_count"]]

    def get_money():
        """
            Will read and return the money currently in the DB
            Will also return the total ammount seperatly

            > {
                "types":{
                    "1": 5,
                    "2": 5,
                    "5": 5,
                    "10": 3,
                    "20": 3,
                    "50": 7,
                    "100": 5,
                    "500": 5,
                    "1000": 5
                },
                "total": 8480
            }
        """
        db = load_db(db_cash_src)
        return {"types":db, "total":sum(int(x) * db[x] for x in db)}  
    def change_money_in_db(data):
        """
            Takes in money in different sizes, and applies the changes to the DB
            Will fail if you try to make value less than 0

            data = {
                "10": -1,
                "5": 2
            }

            > [0, "ok", "2 values changed"]
            > // Will remove 1 "10kr" value and add 2 "5kr" values to the DB.
        """
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
        """
            Takes in money in different sizes and takes in the total cost, and then returns
            the ammount to return, in the correct sizes.

            money_input:{
                "20": 1,
                "10": 1
            }

            total_pay_ammount: 25

            > [0, {"5": 1}, 5]
            > [code, {MoneySize: ammount of that type}, total change]
        """
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

    def password_encrypt(pass_input):
        return hashlib.pbkdf2_hmac("sha256", pass_input.encode(), options['salt'].encode(), 10000).hex()
    def verify_password(usr_input, pass_input):
        return password_encrypt(pass_input) == load_db(db_userdata_src)[usr_input]["password_hash"]

    def add_user(usr_input, pass_input):
        db = load_db(db_userdata_src)
        if usr_input in db:
            return -1, "Username allready exists"

        db[usr_input] = {
            "username": usr_input,
            "password_hash": password_encrypt(pass_input),
            "admin": False
        }

        save_db(db_userdata_src, db)
        return 0, "OK"

    # Start Flask
    app.run(
        host=options['host'],
        port=options['port'],
        debug=options['debug']
    )