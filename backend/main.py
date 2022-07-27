from flask import Flask, jsonify
from flask_cors import CORS

# from machine import machine_actions

app = Flask(__name__)
CORS(app)

@app.route('/hans', methods=['GET'])

def root():
    return jsonify("Hello world")


if __name__=="__main__":
    app.run()