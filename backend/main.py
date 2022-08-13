import base64
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from base64 import encodebytes
from PIL import Image
from entities.count_result_model import CountResult
from entities.count_result_schema import CountResultSchema
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

@app.route('/swallow_container_and_return_image')
def swallow_container_and_return_image():
    # result is a tuple (img, amount)
    # result = machine_actions.swallow_container_and_return_image()

    return jsonify('backend called')
    #TODO: Hier image ook nog jsonifyen?
    
@app.route('/save_result_and_push_out_container')
def save_result_and_push_out_container():
    print('save_result_and_push_out_container')

@app.route('/get_image')
def get_image():
    image_path = './assets/images/colony_with_count.jpg' # point to your image location
    base64_image = get_response_image(image_path)
    
    result = CountResult(base64_image, 25, 'xxxx-xxxx-xxxx-xxxx')
    
    schema = CountResultSchema(many=False)
    resultSchema = schema.dump(result)
    
    return jsonify(resultSchema) # send the result to client
    
@app.route('/save_image', methods=['POST'])
def save_count_result():
    saved_count_result = CountResultSchema().load(request.get_json())
    
    result = CountResult(**saved_count_result)
    
    #save result to disk
    with open(build_image_name(result.count, result.serialnumber), "wb") as fh:
        fh.write(base64.b64decode((result.base64_image)))
    
    return jsonify('Success')

def build_image_name(count, serialnumber):
    return f'results/{count:.0f} -- {serialnumber}.jpg'     

if __name__=="__main__":
    app.run()