import base64
from flask import Flask, jsonify, request, send_file
from flask_api import status
from flask_cors import CORS, cross_origin
from base64 import encodebytes
from PIL import Image
from entities.darkfield_values_model import DarkfieldSettings
from entities.darkfield_values_schema import DarkfieldSettingsSchema
from entities.count_result_model import CountResult
from entities.count_result_schema import CountResultSchema
import io
from machine import machine_actions
from helpers import json_helper

app = Flask(__name__)
CORS(app, resources={ r"/*": { 'origins': '*' }})

def get_response_image(image_path):
    pil_img = Image.open(image_path, mode='r') # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG') # convert the PIL image to byte array
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
    return encoded_img

@app.route('/swallow_container_and_return_image')
def swallow_container_and_return_image():
    try:
        # result is a CountResult
        result = machine_actions.swallow_container_and_return_countresult()
        
        schema = CountResultSchema(many=False)
        resultSchema = schema.dump(result)
        
    except Exception as e:
        return jsonify(e.args), status.HTTP_400_BAD_REQUEST 
    
    return jsonify(resultSchema)

@app.route('/save_image', methods=['POST'])
@cross_origin()
def save_result_and_push_out_container():
    try: 
        saved_count_result = CountResultSchema().load(request.get_json())
        result = CountResult(**saved_count_result)

        #save result to disk
        with open(build_image_name(result.count, result.serialnumber), "wb+") as fh:
            fh.write(base64.b64decode((result.base64_image)))

        machine_actions.push_out_container() 
        
    except Exception as e: 
        return jsonify(e, 400)
    
    return jsonify('Success')

@app.route('/retake_photo', methods=['GET'])
def retake_photo():
    try:
        args = request.args
        result = machine_actions.take_photo_and_return_image_and_count(args.get('qr_code'))
        
        schema = CountResultSchema(many=False)
        resultSchema = schema.dump(result)
        
    except Exception as e:
        return jsonify(e.args), status.HTTP_400_BAD_REQUEST 
    
    return jsonify(resultSchema)

@app.route('/get_plateau')
def get_plateau():
    machine_actions.push_out_container()

    return jsonify('Success')

@app.route('/shutdown')
def shutdown():
    machine_actions.push_in_container()

    return jsonify('Success')

@app.route('/end_cycle_prematurely')
def end_cycle_prematurely():
    machine_actions.push_out_container()
    
    return jsonify('Success')

@app.route('/save_darkfield_settings', methods=['POST'])
def save_darkfield_settings():
    darkfield_settings = DarkfieldSettingsSchema().load(request.get_json())
    result = DarkfieldSettings(**darkfield_settings)

    json_helper.save_darkfield_values(result.red, result.green, result.blue, result.intensity)

    return jsonify('Success')

@app.route('/get_darkfield_settings')
def get_darkfield_settings():
    return json_helper.get_darkfield_values_json()

def build_image_name(count, serialnumber):
    return f"results/{count:.0f}--{serialnumber[:-3]}.jpg"     

if __name__=="__main__":
    app.run()