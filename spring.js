var canvas;
var context;
var canvasBounding;
var resourcesReady;

var renderList = [];

//SETUP
function createCanvas(width, height, parent = document)
{
    var canvasCode = "<canvas id='spring-surface'></canvas>";
    
    var stringWidth = width.toString();
    var stringHeight = height.toString();
    
    var newCanvas = document.createElement("canvas");
    newCanvas.setAttribute("id", "spring-surface");
    newCanvas.setAttribute("width", stringWidth);
    newCanvas.setAttribute("height", stringHeight);
    
    if(parent === null)
    {
        document.body.appendChild(newCanvas);
    }
    else
    {
        parent.appendChild(newCanvas);
    }
    
    canvas = newCanvas;
    context = canvas.getContext("2d");
    canvasBounding = canvas.getBoundingClientRect();
    setupInput();
}

function setCanvas(canvasId)
{
    canvas = document.getElementById(canvasId);
    context = canvas.getContext("2d");
    canvasBounding = canvas.getBoundingClientRect();
    setupInput();
}
//END SETUP

//RENDERING CLASSES
class Sprite
{
    
    constructor(imageSource, width, height, x = 0, y = 0)
    {
        this.render = true;
        this.ready = false;
        
        var image = new Image();
        image.onload = function() { this.ready = true; };
        image.src = imageSource;
        
        this.image = image;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    
}

class Shape
{
    constructor(type, width, height, color, filled = false, x = 0, y = 0)
    {
        this.render = true;
        
        this.type = type.toLowerCase();
        this.width = width;
        this.height = height;
        this.color = color;
        this.filled = filled;
        this.x = x;
        this.y = y;
    }
    
}

class Line
{
    constructor(startPoint, endPoint, color)
    {
        this.render = true;
        
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.color = color;
    }
}

class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Text
{
    constructor(message, font = "12px monospace", color = "black", filled = true, x = 0, y = 0)
    {
        this.render = true;
        
        this.message = message;
        this.font = font;
        this.color = color;
        this.filled = filled;
        this.x = x;
        this.y = y;
    }
}
//END RENDERING CLASSES

//RENDERING HELPERS
function hide(renderObject)
{
    renderObject.render = false;
}

function show(renderObject)
{
    renderObject.render = true;
}
//END RENDERING HELPERS

//INPUT SETUP
function setupInput()
{
    canvas.addEventListener("click", canvasClicked);
    canvas.addEventListener("mousemove", canvasMouseMoved);
}
//END INPUT SETUP

//INPUT STUFF
function canvasClicked(event)
{
    onClick(event.clientX - canvasBounding.left, event.clientY - canvasBounding.top);
}

function onClick(x, y) { }

function canvasMouseMoved(event)
{
    onMouseMove(event.clientX - canvasBounding.left, event.clientY - canvasBounding.top);
}

function onMouseMove(x, y) { }

//END INPUT

//UPDATE FUNCTIONS
function update()
{
    onUpdate();
    //check each resource to see if it's ready
    if(!resourcesReady)
    {
        var readyCount = 0;
        for(var i = 0; i < renderList.length; i++)
        {
            if(renderList[i].ready)
                readyCount++;
        }
        if(readyCount == renderList.length - 1)
            resourcesReady = true;
    }
    render();
}

function onUpdate() {} //just here to prevent errors

function render()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < renderList.length; i++)
    {
        var current = renderList[i];
        var type = current.constructor.name;
        
        if(current.render && inFrame(current))
        {
            if(type == "Sprite")
                context.drawImage(current.image, current.x, current.y);
            if(type == "Shape")
            {
                //set color
                if(current.filled)
                    context.fillStyle = current.color;
                else
                    context.strokeStyle = current.color;
                
                if(current.type == "rectangle")
                {
                    if(current.filled)
                        context.fillRect(current.x, current.y, current.width, current.height);
                    else
                        context.strokeRect(current.x, current.y, current.width, current.height);
                }
                if(current.type == "circle")
                {
                    var radius = current.width / 2;
                    
                    context.beginPath();
                    context.arc(current.x + radius, current.y + radius, radius, 0, 2 * Math.PI);
                    if(current.filled)
                    {
                        context.closePath();
                        context.fill();
                    }
                    else
                        context.stroke();
                }
            }
            if(type == "Line")
            {
                context.strokeStyle = current.color;
                
                context.beginPath();
                context.moveTo(current.startPoint.x, current.startPoint.y);
                context.lineTo(current.endPoint.x, current.endPoint.y);
                context.stroke();
            }
            if(type == "Text")
            {
                if(current.filled)
                    context.fillStyle = current.color;
                else
                    context.strokeStyle = current.color;
                    
                context.font = current.font;
                
                if(current.filled)
                    context.fillText(current.message, current.x, current.y);
                else
                    context.strokeText(current.message, current.x, current.y);
            }
        }
    }
    
    renderList.splice(0, renderList.length);
    
}
//END UPDATE FUNCTIONS

function draw(renderObject, x = null, y = null)
{
    if(x !== null && y !== null)
    {
        renderObject.x = x;
        renderObject.y = y;
    }
    renderList.push(renderObject);
}

function inFrame(renderObject)
{
    var type = renderObject.constructor.name;
    var specialCheck = false;
    
    if(type == "Line")
        specialCheck = true;

    if(!specialCheck && renderObject.x > canvasBounding.width || renderObject.y > canvasBounding.height || (renderObject.x + renderObject.width) < 0 || (renderObject.y + renderObject.height) < 0) //incomplete
        return false;
    else
        return true;
    
}

function play(fps = 60)
{
    window.setInterval(update, 1000 / fps);
}