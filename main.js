/*jshint esversion: 6 */
// 初始化 Canvas
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
ww = canvas.width = window.innerWidth;
wh = canvas.height = window.innerHeight;

//當視窗大小變更，更新Canvas
window.addEventListener("resize", function() {
    ww = canvas.width = window.innerWidth;
    wh = canvas.height = window.innerHeight;
});

//定義 Ball 位置、速度、加速度、半徑、是否拖曳中
var Ball = function(){
    this.p = {
        x: ww/2 ,
        y: wh/2   
    };
    this.v = {
        x: 3,
        y: 3
    };
    this.a = {
        x: 0,
        y: 1
    };
    this.r = 50;
    this.dragging = false;
};
ctx.arc();

// 在Ball中新增 draw function 
Ball.prototype.draw = function(){
    ctx.beginPath();
    ctx.save();
        ctx.translate(this.p.x,this.p.y);
        ctx.arc(0,0,this.r,0,Math.PI*2);
        ctx.fillStyle = controls.color;
        ctx.fill();
    ctx.restore();

    this.drawV();
};

//新增 update function, 如果dragging == 'true' 停止執行
Ball.prototype.update = function(){
    if(ball.dragging == false){
        this.p.x += this.v.x;
        this.p.y += this.v.y;

        this.v.x += this.a.x;
        this.v.y += this.a.y;

        this.v.x *= controls.fade;
        this.v.y *= controls.fade;

        controls.vx = this.v.x;
        controls.vy = this.v.y;
        controls.ay = this.a.y;

        this.checkBoundary();
    }
};

// 新增繪製向量圖形
// moveto vs translate
Ball.prototype.drawV = function(){
    ctx.beginPath();
    ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.scale(3, 3);
        
        ctx.moveTo(0,0);
        ctx.lineTo(this.v.x, this.v.y);
        ctx.strokeStyle = "blue";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(this.v.x,0);
        ctx.strokeStyle = "red";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.v.y);
        ctx.strokeStyle = "green";
        ctx.stroke();        

    ctx.restore();
};

// 新增checkBoundry function
Ball.prototype.checkBoundary =function() {
    if(this.p.x+this.r>ww){
        this.v.x = -Math.abs(this.v.x);
    }
    if(this.p.x-this.r<0){
        this.v.x = Math.abs(this.v.x);
    }
    if(this.p.y+this.r>wh){
        this.v.y = -Math.abs(this.v.y);
    }
    if(this.p.y-this.r<0){
        this.v.y = Math.abs(this.v.y);
    }
};

// 初始GUI化控制內容 
var controls = {
    vx: 0,
    vy: 0,
    ay: 0.6,
    fade: 0.99,
    update: true,
    color: "#fff",
    step: function(){
        ball.update();
    },
    FPS: 30
};

var gui = new dat.GUI();
gui.add(controls,"vx",-50,50).listen().onChange(function(value){
    ball.v.x = value;
});
gui.add(controls, "vy", -50, 50).listen().onChange(function (value) {
    ball.v.y = value;
});
gui.add(controls, "ay", -1, 1).step(0.001).listen().onChange(function (value) {
    ball.a.y = value;
});
gui.add(controls, "fade", 0, 1).step(0.001).listen();
gui.add(controls, "update");
gui.addColor(controls,"color");
gui.add(controls,"step");
gui.add(controls,"FPS", 1,120);

// var ball;
function init() {
    ball = new Ball();
}

init();

function update(){
    if(controls.update){
        ball.update();
    }
}

setInterval(update,1000/30);

function draw(){
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0,0,ww,wh);

    ball.draw();

    setTimeout(draw,1000/controls.FPS);
}

draw();

let mousePos = {
    x:0,
    y:0
};

function getDistance(p1,p2) {
    let temp1 = p1.x - p2.x;
    let temp2 = p1.y - p2.y;
    let dist = Math.pow(temp1,2) + Math.pow(temp2,2);
    return Math.sqrt(dist);
}

canvas.addEventListener("mousedown",function(evt){
    mousePos = {
        x: evt.x,
        y: evt.y
    };
    // console.log(mousePos);
    let dist = getDistance(mousePos,ball.p);
    if (dist < ball.r) {
        console.log("ball clicked");
        ball.dragging = true;
    }
});

canvas.addEventListener("mouseup",()=>{
    ball.dragging = false;
});

canvas.addEventListener("mousemove",function(evt){
    let nowPos = {
        x: evt.x,
        y: evt.y
    };
    if(ball.dragging){
        let dx = nowPos.x - mousePos.x;
        let dy = nowPos.y - mousePos.y;
        
        ball.p.x += dx;
        ball.p.y += dy;

        ball.v.x = dx;
        ball.v.y = dy;
    }
    let dist = getDistance(nowPos, ball.p);
    if(dist<ball.r){
        canvas.style.cursor = "move";
    }else{
        canvas.style.cursor = "initial";
    }
    mousePos = nowPos;
});

