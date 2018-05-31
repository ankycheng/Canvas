/*jshint esversion: 6 */

//初始化Canvas
var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext("2d");
ww = canvas.width = window.innerWidth;
wh = canvas.height = window.innerHeight;

// 偵測 Window resize 事件
window.addEventListener("resize",()=>{
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;
});

//Vector 基本操作：
// 初始化Vector
var Vector = function (x, y) {
  this.x = x;
  this.y = y;
};
// 更新Vector位置
Vector.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  return this;
};
Vector.prototype.add = function (v) {
  return new Vector(this.x + v.x, this.y + v.y);
};
Vector.prototype.sub = function (v) {
  return new Vector(this.x - v.x, this.y - v.y);
};
Vector.prototype.mul = function (s) {
  return new Vector(this.x * s, this.y * s);
};
// 回傳Vector角度
Vector.prototype.angle = function () {
  return Math.atan2(this.y, this.x);
};
Vector.prototype.length = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector.prototype.toString = function (v) {
  return "(" + this.x + "," + this.y + ")";
};
Vector.prototype.set = function (x, y) {
  this.x = x;
  this.y = y;
  return this;
};
Vector.prototype.equal = function (v) {
  return (this.x == v.x) && (this.y == v.y);
};
//複製Vector 為新的Vector
Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};


// 畫出向量
function drawVector(v,trans){
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.save();
  ctx.rotate(v.angle());
  ctx.fillText(v, 10,20);
  //畫箭頭
  ctx.lineTo(v.length(),0);
  ctx.lineTo(v.length()-5,-4);
  ctx.lineTo(v.length()-5,4);
  ctx.lineTo(v.length(),0);
  ctx.strokeStyle ="black";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
  // 是否延續上個線段繼續畫
  if(trans){
    ctx.translate(v.x,v.y);
  }
}

var mousePos = new Vector(0,0);
canvas.addEventListener("mousemove", function (evt) {
  mousePos = new Vector(evt.pageX, evt.pageY);
  console.log("m:" + mousePos);
});

function draw(){
  ctx.clearRect(0,0,ww,wh);
  var c = new Vector(ww/2,wh/2);
  ctx.restore();
  ctx.save();
    ctx.translate(c.x,c.y);
    var md = mousePos.sub(c);
    drawVector(md.mul(1/md.length()).mul(100),false);
  ctx.restore();
}

setInterval(draw, 30);
console.clear();


