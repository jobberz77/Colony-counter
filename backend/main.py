from tkinter import image_types
import RPi.GPIO as GPIO
import cv2
import board
import neopixel
import time
import serial
from picamera import PiCamera
import RPi.GPIO as GPIO
import numpy as np
import os

#run in sudo
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

M_F = 20 #voor
M_R = 19 #achter
M_S = 12
sf = 6
sr = 5

start = 24
power = 25
start_led = 13
power_led = 26

GPIO.setup(start, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(power, GPIO.IN, pull_up_down = GPIO.PUD_UP)

GPIO.setup(start_led, GPIO.OUT)
GPIO.setup(power_led, GPIO.OUT)


def darkfield(pwm_servo, led_r, led_g, led_b, servo_pos):
    servo_pos = (servo_pos/20)+2.5
    GPIO.setup(pwm_servo, GPIO.OUT)
    servo = GPIO.PWM(pwm_servo,50)
    servo.start(5)

    pixel_pin = board.D18
    num_pixels = 16
    ORDER = neopixel.RGB
    pixels = neopixel.NeoPixel(pixel_pin, num_pixels, auto_write=False, pixel_order=ORDER)

    pixels.fill((led_r, led_g, led_b))
    pixels.show()
    servo.ChangeDutyCycle(servo_pos)
    time.sleep(1)

def motion(move_f, move_r, pwm_s, sen_f, sen_r, move):
    GPIO.setup(move_f, GPIO.OUT)
    GPIO.setup(move_r, GPIO.OUT)
    GPIO.setup(pwm_s, GPIO.OUT)
    GPIO.setup(sf, GPIO.IN, pull_up_down = GPIO.PUD_UP)
    GPIO.setup(sr, GPIO.IN, pull_up_down = GPIO.PUD_UP)

    pwm = GPIO.PWM(pwm_s,100)
    pwm.start(0)
    speed = 100

    forward = False
    reverse = False

    if move == 'r':
        reverse = True
        print("reverse")
        
    while reverse:
        GPIO.output(move_f,0)
        GPIO.output(move_r,1)
        pwm.ChangeDutyCycle(speed)
        if GPIO.input(sen_r) == 1:
            GPIO.output(move_f,0)
            GPIO.output(move_r,0)
            pwm.ChangeDutyCycle(0)
            reverse = False
            print("postion_rear")
            
    if move == 'f':
        forward = True
        print("forward")

    while forward:
        GPIO.output(move_f,1)
        GPIO.output(move_r,0)
        pwm.ChangeDutyCycle(speed)
        if GPIO.input(sen_f) == 1:
            GPIO.output(move_f,0)
            GPIO.output(move_r,0)
            pwm.ChangeDutyCycle(0)
            forward = False
            print("postion_front")  

def picture(qr_code):
    camera = cv2.VideoCapture(0)
    for i in range(1):
        return_value, image = camera.read()
        cv2.imwrite('/home/pi/Desktop/'+ qr_code + '_original' +'.png', image)
    del(camera)
    return image

def qr_code():
    check = True
    serialport = serial.Serial("/dev/ttyACM0", 115200, timeout= 2)
    cw = [0x7E,0x00,0x08,0x01,0x00,0x02,0x01,0xAB,0xCD]
    serialport.write(serial.to_bytes(cw))
    response = serialport.readlines(None)
    code = str(response[0])
    print(code)
    code = code.split("x0031")
    code = code[1]
    if code == "'":
        check = False
        print('No object')
    else:
        print(code)
    qr_code = [code, check]
    return qr_code

def counting(img, qr_code):
    # Read image. 
    #os.chdir(os.path.dirname(os.path.abspath(__file__)))
    #img = cv2.imread(image, cv2.IMREAD_COLOR)

    print('original dimensions : ',img.shape)

    scale_precent = 100 / 100
    width = int(img.shape[1] * scale_precent)
    height = int(img.shape[0] * scale_precent)
    dim = (width, height)

    img = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
    
    # Convert to grayscale. 
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 
    
    # Blur using 3 * 3 kernel. 
    gray_blurred = cv2.blur(gray, (3, 3))

    
    # Apply Hough transform on the blurred image. 
    detected_circles = cv2.HoughCircles(gray_blurred,  
                    cv2.HOUGH_GRADIENT, 1, 20, param1 = 50, 
                param2 = 30, minRadius = 0, maxRadius = 40) 
    
    amount = 0

    # Draw circles that are detected. 
    if detected_circles is not None: 
    
        # Convert the circle parameters a, b and r to integers. 
        detected_circles = np.uint16(np.around(detected_circles)) 
    
        for pt in detected_circles[0, :]: 
            a, b, r = pt[0], pt[1], pt[2] 
    
            # Draw the circumference of the circle. 
            cv2.circle(img, (a, b), r, (0, 255, 0), 2) 
    
            # Draw a small circle (of radius 1) to show the center. 
            cv2.circle(img, (a, b), 1, (0, 0, 255), 3)
            
            amount += 1

    cv2.imshow("Detected Circle", img)
    cv2.imshow("gray", gray_blurred) 
    cv2.imwrite('/home/pi/Desktop/'+ qr_code + '_count' +'.png', img)
    print ('amount', amount)
    cv2.waitKey(0)

while True:
    GPIO.output(start_led, 0)
    run = False
    wait = True

    if GPIO.input(start) == 1:
            run = True
            GPIO.output(start_led, 1)
            print("start")
    
    while run:
        motion(M_F, M_R, M_S, sf, sr, 'f') #forward

        while wait:
            if GPIO.input(start) == 1:
                wait = False


                print("thanks")
        wait = True

        motion(M_F, M_R, M_S, sf, sr, 'r') #backward 

        code = qr_code()
        
        r = int(input("Collor red:\n"))
        g = int(input("Collor green:\n"))
        b = int(input("Collor blue:\n"))
        d = int(input("intensity:\n"))

        darkfield(17,g,r,b,d)
 
        img = picture(code[0])
        
        motion(M_F, M_R, M_S, sf, sr, 'f') #forward
        time.sleep(2)

        counting(img, code[0])

        while wait:
            if GPIO.input(start) == 1:
                wait = False

        wait = True
        
        motion(M_F, M_R, M_S, sf, sr, 'r') #backward
        time.sleep(2)

        run = False
        print("stop")
        GPIO.output(start_led, 0)




