// Store frame for motion functions
var previousFrame = null;
// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: false, frameEventName: 'animationFrame'};
// Capture hands
var myhand = '';

function captureLeapmotion(){
    var controller = new Leap.Controller();
    controller.on('deviceFrame', function(frame){
        if (frame.pointables.length >0){
            if(frame.pointables[0].extended&&frame.pointables[1].extended&&frame.pointables[2].extended&&frame.pointables[3].extended&&frame.pointables[4].extended){
                myhand = 'パー';
            } else if(!frame.pointables[0].extended&&!frame.pointables[1].extended&&!frame.pointables[2].extended&&!frame.pointables[3].extended&&!frame.pointables[4].extended){
                myhand = 'グー';
            } else if(!frame.pointables[0].extended&&!frame.pointables[4].extended){
                if(frame.pointables[1].extended||frame.pointables[2].extended||frame.pointables[3].extended){
                        myhand = 'チョキ';
                }
            } else {
                myhand = '';
            }
        } else {
            myhand = '';
        }
        // Store frame for motion functions
        previousFrame = frame;
    });
    controller.connect();
}

// Draw image with P5.js
var time = 0;
var ball01;
var red = color(255, 0, 0, 200);
var green = color(0, 255, 0, 200);
var blue = color(0, 0, 255, 200);
    
function setup() {
    createCanvas(1420, 780);
    noStroke();
    background(0, 0, 0);
    ball01 = new ball(710, 0, 50);
}

function draw() {
    background(0);
    captureLeapmotion();
    drawLine(myhand)
    
    ball01.move();
    ball01.display();
    
    time += 5;
    if (time>780){
        time = 0;
    }
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
        ellipse(710, this.y, this.diameter, this.diameter);
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

function effect(){
    
}
