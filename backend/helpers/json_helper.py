import json
import os
from entities.darkfield_values_model import DarkfieldSettings

darkfield_values_json_path = 'assets/data/darkfield_settings.json'

def save_darkfield_values(red, green, blue, intensity):
    json_string = create_darkfield_values_json(red, green, blue, intensity)
    with open(darkfield_values_json_path, 'w+') as outfile:
        json.dump(json_string, outfile)

def get_darkfield_values_json():
    print(os.getcwd())
    print(darkfield_values_json_path)
    with open(darkfield_values_json_path) as json_file:
        data = json.load(json_file)

        return data

def get_darkfield_values_as_object():
    json_values = get_darkfield_values_json()
    darkfield_settings = DarkfieldSettings(**json_values)

    return darkfield_settings

def create_darkfield_values_json(red, green, blue, intensity):
    return {
        'red': red,
        'green': green,
        'blue': blue,
        'intensity': intensity
    }