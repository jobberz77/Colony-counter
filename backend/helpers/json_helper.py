import json

darkfield_values_json_path = '../assets/data/darkfield_values.json'

def save_darkfield_values(red, green, blue, intensity):
    json_string = create_darkfield_values_json(red, green, blue, intensity)
    with open(darkfield_values_json_path, 'w') as outfile:
        json.dump(json_string, outfile)

def get_darkfield_values():
    with open(darkfield_values_json_path) as json_file:
        data = json.load(json_file)
        return data

def create_darkfield_values_json(red, green, blue, intensity):
    return {
        'red': red,
        'green': green,
        'blue': blue,
        'intensity': intensity
    }