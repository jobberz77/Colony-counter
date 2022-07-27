from flask import Flask, jsonify, send_file
from flask_cors import CORS
from base64 import encodebytes
from PIL import Image
import io

# from machine import machine_actions

app = Flask(__name__)
CORS(app)

@app.route('/hans', methods=['GET'])

def root():
    return jsonify("Hello world")

def get_response_image(image_path):
    pil_img = Image.open(image_path, mode='r') # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG') # convert the PIL image to byte array
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
    return encoded_img

@app.route('/get_image')

def get_image():
    image_path = './assets/images/colony_image_original.jpg' # point to your image location
    encoded_img = get_response_image(image_path)
    return jsonify(encoded_img) # send the result to client
    
if __name__=="__main__":
    app.run()