

class CountResult:
    def __init__(self, base64_image, count, serialnumber):
        self.base64_image = base64_image
        self.count = count
        self.serialnumber = serialnumber
        
    def __repr__(self):
        return "<Count(count={self.name!r})>"