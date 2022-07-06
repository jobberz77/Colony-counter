from flask import Flask, render_template

from machine import machine_actions

app = Flask(__name__)

@app.route('/', methods=['GET'])

def root():
    return "Hello world"

if __name__=="__main__":
    app.run()