from marshmallow import Schema, fields

class CountResultSchema(Schema):
    base64_image = fields.Str()
    count = fields.Number()