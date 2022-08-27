from marshmallow import Schema, fields

class DarkfieldSettingsSchema(Schema):
    red = fields.Number()
    green = fields.Number()
    blue = fields.Number()
    intensity = fields.Number()