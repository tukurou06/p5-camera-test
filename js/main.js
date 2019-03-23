/*
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var URL = window.URL || window.webkitURL;
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
var RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
var RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;        
*/

var canvas;
var width_main = $(".main").width();
var cnt = 0;

let capture;

let system;

function setup(){
    window.addEventListener("touchstart",function(event){
        event.preventDefault();
    }, {passive: false});
    window.addEventListener("touchmove", function(event){
        event.preventDefault();
    }, {passive: false});

    canvas = createCanvas(width_main, windowHeight);
    background(51);
    system = new ParticleSystem(createVector(width / 2, windowHeight / 2));

    capture = createCapture(VIDEO);
    capture.size(640, 480);

    // 元のビデオは隠す
    capture.hide();    


    /*
    let video_sorce_id;
    let video_cnt = 0;
    let video_no = 1;
    getVideoSources(function(cam) {
        console.log("cam", cam);
        if(video_cnt == video_no){
            video_sorce_id = cam.id;
            console.log("video_sorce_id", video_sorce_id);

            var constraints = {
                video: {
                    //facingMode: "user"
                    //facingMode: "environment"
                    //facingMode: { 
                    //   exact: "environment"
                    //},
                    optional: [{sourceId: video_sorce_id}]
                },
                audio: false
            };
        
            createCanvas(640, 480);
            //capture = createCapture(VIDEO);
            capture = createCapture(constraints);
            capture.size(640, 480);
        
            // 元のビデオは隠す
            //capture.hide();    
        }
        video_cnt++;
    });
    */
}

function draw(){
    //background(51);


    //image(capture, 0, 0, 640, 480);

    capture.loadPixels();
    let d = pixelDensity();
    let center = 1 * ( (640 * d ) * (240 * d) + (320 * d) ) ;
    background(pixels[center], pixels[center + 1], pixels[center + 2]);

    system.addParticl();
    system.run();


    fill('#fff');
    textSize(24);
    text(cnt,10,30);
    /*
    text(rotationX ,10,60);
    text(rotationY ,10,90);
    text(rotationZ ,10,120);
    */
    /*
    text(pixels[center] ,10,60);
    text(pixels[center+1] ,10,90);
    text(pixels[center+2] ,10,120);
    text(pixels.length ,10,150);
    */
    cnt++;
}

// A simple Particle class
let Particle = function(position){
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1,1), random(-1, 1));
    this.position = position.copy();
    this.lifespan = 255;
};

Particle.prototype.run = function(){
    this.update();
    this.display();
};

// Method to update position
Particle.prototype.update = function(){
    this.acceleration.x = 0.05 * sin(radians(rotationY));
    this.acceleration.y = 0.05 * sin(radians(rotationX));
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function(){
    stroke(200, this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 12,12);
};

// Is the particle still usefull?
Particle.prototype.isDead = function(){
    return this.lifespan < 0;
};

let ParticleSystem = function(position){
    this.origin = position.copy();
    this.particles = [];
};

ParticleSystem.prototype.addParticl = function(){
    this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function(){
    for (let i = this.particles.length-1; i >=0; i--){
        let p = this.particles[i];
        p.run();
        if(p.isDead()){
            this.particles.splice(i,1);
        }
    }
};

function getVideoSources(callback) {
    if (!navigator.mediaDevices) {
        console.log("MediaStreamTrack");
        MediaStreamTrack.getSources(function(cams) {
            cams.forEach(function(c, i, a) {
                if (c.kind != 'video') return;
                callback({
                    name: c.facing,
                    id: c.id
                });
            });
        });
    } else {
        navigator.mediaDevices.enumerateDevices().then(function(cams) {
            cams.forEach(function(c, i, a) {
                //console.log("mediaDevices", c);
                if (c.kind != 'videoinput') return;
                callback({
                    name: c.label,
                    id: c.deviceId
                });
            });
        });
    }
}
