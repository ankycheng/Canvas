/*jshint esversion: 6 */

var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext("2d");
ww = canvas.width = window.innerWidth;
wh = canvas.height = window.innerHeight;

window.addEventListener("resize",()=>{
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;
})

function drawVector(v,trans){
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.save();
  ctx.rotate(v.angle());
  ctx.fillText(v, v.length()/2,10);
  ctx.lineTo(v.length(),0);
  ctx.lineTo(v.length()-5,-4);
  ctx.lineTo(v.length()-5,4);
  ctx.lineTo(v.length(),0);
  ctx.strokeStyle ="black";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
  if(trans){
    ctx.translate(v.x,v.y);
  }

}

function draw(){
  ctx.clearRect(0,0,ww,wh);
  var v1 = new Vector(250,0);
  var v2 = new Vector(0,200);
  var v3 = v1.add(v2).mul(-1);
  var c = new Vector(ww/2,wh/2);
  // ctx.translate(ww/2,wh/2);
  // drawVector(v1,true);
  // drawVector(v2,true);
  // drawVector(v3,true);
  ctx.restore();
  ctx.save();
  ctx.translate(c.x,c.y);
  var md = mousePos.sub(c);
  drawVector(md.mul(1/md.length()).mul(100),false);
  ctx.restore();
}

// setTimeout(draw,0)


// var mousePos 
// canvas.addEventListener("mousemove",function(evt){
//   mousePos = new Vector(evt.pageX,evt.pageY)
//   console.log("m:" +mousePos)
  
// })
setInterval(draw,30);
canvas.addEventListener("mousemove",function(evt){
  mousePos = new Vector(evt.pageX,evt.pageY)
  console.log("m:" +mousePos)
  
})

setInterval(draw,30);

console.clear()

var Vector = function(x,y){
  this.x = x;
  this.y = y;
}

Vector.prototype.move = function(x,y){
  this.x += x;
  this.y += y;
  return this;
}

Vector.prototype.add = function(v){
  return new Vector(this.x + v.x, this.y + v.y);
}

Vector.prototype.sub = function(v){
  return new Vector(this.x-v.x, this.y-v.y);
}

Vector.prototype.mul = function(s){
  return new Vector(this.x*s, this.y*s);
}

Vector.prototype.angle = function(){
  return Math.atan2(this.y,this.x);
}

Vector.prototype.length = function(){
  return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vector.prototype.toString = function(v){
  return "(" + this.x + "," + this.y + ")";
}

Vector.prototype.set = function(x,y){
  this.x = x;
  this.y = y;
  return this;
}

Vector.prototype.equal = function(v){
  return (this.x == v.x) && (this.y == v.y);
}

Vector.prototype.clone = function(){
  return new Vector(this.x,this.y);
}

var a = new Vector(4,0);
var b = new Vector(6,8);

var c = a.add(b);
var c2 = a.add(b);
var c3 = a.sub(b);