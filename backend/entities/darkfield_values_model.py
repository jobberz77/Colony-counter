class DarkfieldSettings:
    def __init__(self, red, green, blue, intensity):
        self.red = red
        self.green = green
        self.blue = blue
        self.intensity = intensity

    def __repr__(self):
        return "<DarkfieldSettings(setting={self.name!r})>"