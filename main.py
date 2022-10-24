import os
import json
from flask import Flask
from flask import request
from flask import jsonify
from flask import Markup
from flask import render_template

app = Flask(__name__)

@app.route("/")
def root():
    return "root, please go to /kassa or /db"

@app.route("/kassa")
def kassa():
    return render_template("kassa.html")

@app.route("/db")
def database():
    hello = "test"
    return render_template("db.html", variable_hello=hello)


if __name__ == "__main__":
    # Set working dir to path of main.py
    os.chdir(os.path.dirname(os.path.realpath(__file__)))

    # Start Flask
    app.run(
        host="localhost",
        port="5000",
        debug=False
    )