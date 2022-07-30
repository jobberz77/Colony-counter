

class CountResult:
    def __init__(self, base64_image, count):
        self.base64_image = base64_image
        self.count = count
        
    def __repr__(self):
        return "<Count(count={self.name!r})>"