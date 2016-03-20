// Capture hands
var myhand = '';

function captureLeapmotion(){
    var controller = new Leap.Controller();
    controller.on('connect', function(){
        setInterval(function(){
            var frame = controller.frame();
            if (frame.pointables.length >0){
                if(frame.pointables[0].extended
                   &&frame.pointables[1].extended
                   &&frame.pointables[2].extended
                   &&frame.pointables[3].extended
                   &&frame.pointables[4].extended){
                    myhand = 'パー';
                } else if(!frame.pointables[0].extended
                          &&!frame.pointables[1].extended
                          &&!frame.pointables[2].extended
                          &&!frame.pointables[3].extended
                          &&!frame.pointables[4].extended){
                    myhand = 'グー';
                } else if(!frame.pointables[0].extended
                          &&!frame.pointables[4].extended){
                    if(frame.pointables[1].extended
                       ||frame.pointables[2].extended
                       ||frame.pointables[3].extended){
                            myhand = 'チョキ';
                    }
                } else {
                    myhand = '';
                }
            } else {
                myhand = '';
            }
        }, 16); // about 60FPS
    });
    controller.connect();
}

//// using Wii nunchuck via serial communication in Arduino
//var serial;
//var portName = '/dev/cu.usbmodemFA131'; // fill in your serial port name here
//var inData = 710;
//
//function serverConnected() {
//    println("We are connected!");
//}
//function gotList(thelist) {
//  for (var i = 0; i < thelist.length; i++) {
//    println(i + " " + thelist[i]);
//  }
//}
//function gotOpen() {
//  println("Serial Port is open!");
//}
//function gotError(theerror) {
//  println(theerror);
//}
//function serialEvent() {
//  inData = Number(serial.read());
//}


// Draw image with P5.js
var ball01;
    
function setup() {
    createCanvas(1420, 780);
    ball01 = new ball(710, 0, 50);
    captureLeapmotion();
    
//    // Instantiate our SerialPort object
//    serial = new p5.SerialPort();
//    var portlist = serial.list();
//    // Assuming our Arduino is connected, let's open the connection to it
//    serial.open(portName);
//    // Register some callbacks
//    serial.on('connected', serverConnected);
//    serial.on('list', gotList);
//    serial.on('data', serialEvent);
//    serial.on('error', gotError);
//    serial.on('open', gotOpen);
}

function draw() {
    background(0);
    drawLine(myhand);
    ball01.move();
    ball01.display();
}

function drawLine(hand){
    if (hand=='グー'){
        fill(255, 0, 0, 200);
        rect(0,640,1420,5);
    } else if(hand=='チョキ'){
        fill(0, 255, 0, 200);
        rect(0,640,1420,5);
    } else if(hand=='パー'){
        fill(0, 0, 255, 200);
        rect(0,640,1420,5);
    } else {
        fill(50, 50, 50, 200);
        rect(0,640,1420,5);
    }
}

function ball(tempX, tempY, tempDiameter){
    this.x = tempX;
    this.y = tempY;
    this.diameter = tempDiameter;
    this.speed = 5.0;
    this.flag = false;
    this.alpha = 255;
    //set color
    var cpuhand = '';
    var colorCode;
    function setColor(){
        var rand_num = Math.floor(Math.random() * 3);
        if(rand_num < 1){
            cpuhand = 'グー';
            colorCode = color(255, 0, 0, 200);
        } else if (rand_num < 2){
            cpuhand = 'チョキ';
            colorCode = color(0, 255, 0, 200);
        } else {
            cpuhand = 'パー';
            colorCode = color(0, 0, 255, 200);
        }
    }
    setColor();
    
    this.move = function(){
        this.y += this.speed;
        if (this.y > 780){
            this.y = 0;
            this.flag = false;
            this.diameter = tempDiameter;
            this.alpha = 255;
            setColor();
        }
    }
    
    this.display = function(){
        fill(colorCode);
        if(this.flag){
            fill(255, 255, 255, this.alpha);
            this.diameter += 80.0;
            this.alpha -=5;
        } else {
            if(this.y > (640 - this.diameter/2) && this.y < (640 + this.diameter/2 + 5) ){
                if (decideWinLose(cpuhand, myhand)==1){
                    this.flag = true;
                }
            }
            if(this.y >= (640 + this.diameter/2 + 5) ){
                if(!this.flag){
                    fill(50, 50, 50, 200); //gray
                }
            }
        }
        ellipse(this.x, this.y, this.diameter, this.diameter);
    }
}

function decideWinLose(tempCpuHand, tempMyHand){
    var result = 0;
    if(tempCpuHand == 'グー'){
        if(tempMyHand == 'グー'){
            result = 0;
        } else if (tempMyHand == 'チョキ'){
            result = -1;
        } else if (tempMyHand == 'パー'){
            result = 1;
        }
    } else if (tempCpuHand == 'チョキ'){
        if(tempMyHand == 'グー'){
            result = 1;
        } else if (tempMyHand == 'チョキ'){
            result = 0;
        } else if (tempMyHand == 'パー'){
            result = -1;
        }
    } else if(tempCpuHand == 'パー'){
        if(tempMyHand == 'グー'){
            result = -1;
        } else if (tempMyHand == 'チョキ'){
            result = 1;
        } else if (tempMyHand == 'パー'){
            result =0;
        }
    }
    return result;
}
