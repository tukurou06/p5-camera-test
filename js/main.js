var canvas;
var width_main = $(".main").width();
var cnt = 0;

let capture;

function setup(){
    //canvas = createCanvas(width_main, 400);
    //canvas.parent("p5Canvas");
    background(200);
    
    var constraints = {
        video: {
            //facingMode: "user"
            //facingMode: "environment"
            facingMode: { 
               exact: "environment"
           }
        },
        audio: false
    };

    createCanvas(640, 480);
    //capture = createCapture(VIDEO);
    capture = createCapture(constraints);
    capture.size(640, 480);

    // 元のビデオは隠す
    capture.hide();    
}

function draw(){
    background(230);

    image(capture, 0, 0, 640, 480);

    fill('#fff');
    textSize(24);
    text(cnt,10,30);

    cnt++;
}