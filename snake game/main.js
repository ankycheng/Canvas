/*jshint esversion: 6 */

var Vector = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype.add = function (v) {
    return new Vector(this.x + v.x, this.y + v.y);
};
Vector.prototype.sub = function (v) {
    return new Vector(this.x -= v.x, this.y -= v.y);
};
Vector.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
};
Vector.prototype.equal = function (v) {
    return (this.x == v.x && this.y == v.y);
};
Vector.prototype.mul = function (s) {
    return new Vector(this.x * s, this.y * s);
};
Vector.prototype.clone = function (s) {
    return new Vector(this.x, this.y);
};

var Snake = function () {
    this.body = [];
    this.maxLength = 5;
    this.head = new Vector();
    this.speed = new Vector(1, 0);
    this.direction = "Right";
};

Snake.prototype.update = function () {
    let newHead = this.head.add(this.speed);
    this.body.push(this.head);
    this.head = newHead;
    while (this.body.length > this.maxLength) {
        this.body.shift();
    }
};

Snake.prototype.setDirection = function (dir) {
    var target;
    if (dir == "Up") {
        target = new Vector(0, -1);
    }
    if (dir == "Down") {
        target = new Vector(0, 1);
    }
    if (dir == "Right") {
        target = new Vector(1, 0);
    }
    if (dir == "Left") {
        target = new Vector(-1, 0);
    }
    if (target.equal(this.speed.mul(-1)) == false) {
        this.speed = target;
    }
};

Snake.prototype.checkBoundry = function(gameWidth) {
    let xInRange = (0 <= this.head.x && this.head.x < gameWidth);
    let yInRange = (0 <= this.head.y && this.head.y < gameWidth);
    return xInRange && yInRange;
};

var Game = function () {
    this.bw = 12;
    this.bs = 2;
    this.gameWidth = 40;
    this.speed = 30;
    this.snake = new Snake();
    this.foods = [];
    this.start = false;
};

Game.prototype.init = function () {
    this.canvas = document.getElementById("mycanvas");
    this.canvas.width = this.bw * this.gameWidth + this.bs * (this.gameWidth - 1);
    this.canvas.height = this.canvas.width;
    this.ctx = this.canvas.getContext("2d");
    this.render();
    this.update();
    this.generateFood();
};

Game.prototype.getPosition = function (x, y) {
    return new Vector(
        x * this.bw + (x - 1) * this.bs,
        y * this.bw + (y - 1) * this.bs
    );
};

Game.prototype.drawBlock = function (v, color) {
    this.ctx.fillStyle = color;
    var pos = this.getPosition(v.x, v.y);
    this.ctx.fillRect(pos.x, pos.y, this.bw, this.bw);
};

Game.prototype.drawEffect = function(x,y){
    var r = 2;
    var pos = this.getPosition(x,y);
    var _this = this;
    var effect = function(){
        r++;
        _this.ctx.strokeStyle = "rgba(255,0,0,"+(100-r)/100+")";
        _this.ctx.beginPath();
        _this.ctx.arc(pos.x+_this.bw/2,pos.y+_this.bw/2,r,0,Math.PI*2);
        _this.ctx.stroke();

        if(r<100){
            requestAnimationFrame(effect);
        }
    };
    requestAnimationFrame(effect);
};


Game.prototype.render = function () {
    this.ctx.fillStyle = "rgba(0,0,0,0.3)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (var x = 0; x < this.gameWidth; x++) {
        for (var y = 0; y < this.gameWidth; y++) {
            this.drawBlock(new Vector(x, y), "rgba(255,255,255,0.03)");
        }
    }
    this.snake.body.forEach((sp, i) => {
        this.drawBlock(sp, "white");
    });
    this.foods.forEach((p) => {
        this.drawBlock(p, "red");
    });
    requestAnimationFrame(() => {
        this.render();
    });
};

Game.prototype.generateFood = function () {
    var x = parseInt(Math.random() * this.gameWidth);
    var y = parseInt(Math.random() * this.gameWidth);
    this.foods.push(new Vector(x, y));
    this.drawEffect(x,y);
    this.playSound("E5",-20);
    this.playSound("A5", -20,50);
};

Game.prototype.update = function () {
    if (this.start) {
        this.playSound("A2",-30);
        this.snake.update();
        this.foods.forEach((food, i) => {
            if (this.snake.head.equal(food)) {
                this.snake.maxLength++;
                this.foods.splice(i, 1);
                this.generateFood();
            }
        });
        this.snake.body.forEach((bp) => {
            if (this.snake.head.equal(bp)) {
                console.log("GG");
                this.endGame();
            }
        });
        if (this.snake.checkBoundry(this.gameWidth) == false) {
            this.endGame();
        }
    }
    this.speed = Math.sqrt(this.snake.body.length)+5;
    setTimeout(() => {
        this.update();
    }, parseInt(1000/this.speed));
};

Game.prototype.playSound = function(note, volume,when){
    setTimeout(function(){
        var synth = new Tone.Synth().toMaster();
        synth.volume = volume || -12;
        synth.triggerAttackRelease(note,"8n");
    },when || 0);
};

Game.prototype.startGame = function () {
    this.start = true;
    document.getElementById("panel").style.visibility = "hidden";
    this.snake = new Snake();
    this.playSound("C#5",-20);
    this.playSound("E5", -20, 200);
};

Game.prototype.endGame = function () {
    this.start = false;
    document.getElementById("score").innerText = "Score: " + (this.snake.maxLength - 5) * 10;
    document.getElementById("panel").style.visibility = "visible";
    this.playSound("A3");
    this.playSound("E2",-10,200);
    this.playSound("A2",-10,400);
};

var game = new Game();
game.init();

window.addEventListener("keydown", function (evt) {
    console.log(evt.key);
    game.snake.setDirection(evt.key.replace("Arrow", ""));
});

btn = document.getElementById("start");
btn.addEventListener("click", () => game.startGame());



// game.startGame();
// canvas = document.getElementById("mycanvas");
// ctx = canvas.getContext("2d");
// ctx.fillRect(0,0,100,100);