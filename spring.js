const TWOPI = 2*Math.PI;

let springInstance = {
    canvas: undefined,
    run: false,
};

class SpringCanvas {
    #updateFunction     = () => {};
    #renderFunction     = () => {};

    #clickFunction      = () => {};
    #mousemoveFunction  = () => {};
    #mousedownFunction  = () => {};
    #mouseupFunction    = () => {};

    constructor(canvasElement) {
        // setup graphics
        this.canvas = canvasElement;
        this.context = this.canvas.getContext("2d");
        this.bounding = this.canvas.getBoundingClientRect();

        this.mouseState = new MouseState();

        // setup input
        this.canvas.addEventListener("click", () => {
            this.#clickFunction();
        });
        this.canvas.addEventListener("mousemove", (e) => {
            this.mouseState.x = e.clientX - this.bounding.x;
            this.mouseState.y = e.clientY - this.bounding.y;

            this.#mousemoveFunction();
        });
        this.canvas.addEventListener("mousedown", (e) => {
            this.mouseState.buttons.left    = (e.buttons & 0x1);
            this.mouseState.buttons.right   = (e.buttons & 0x2);
            this.mouseState.buttons.middle  = (e.buttons & 0x4);

            this.#mousedownFunction();
        });
        this.canvas.addEventListener("mouseup", (e) => {
            this.mouseState.buttons.left    = (e.buttons & 0x1);
            this.mouseState.buttons.right   = (e.buttons & 0x2);
            this.mouseState.buttons.middle  = (e.buttons & 0x4);

            this.#mouseupFunction();
        });
    }
    
    onClick(fn)     { this.#clickFunction = fn; }
    onMouseMove(fn) { this.#mousemoveFunction = fn; }
    onMouseDown(fn) { this.#mousedownFunction = fn; }
    onMouseUp(fn)   { this.#mouseupFunction = fn; }
    // TODO: keyboard input

    // render helpers
    #setColor(color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
    }
    drawSprite(sprite) {
        this.context.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height);
    }

    drawRectangle(rectangle) {
        this.#setColor(rectangle.color);
        if (rectangle.filled) {
            this.context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
        else {
            this.context.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
    }

    drawCircle(circle) {
        this.#setColor(circle.color);

        this.context.beginPath();
        this.context.arc(circle.x + circle.radius,
                         circle.y + circle.radius,
                         circle.radius, 0, TWOPI);
        
        if (circle.filled) {
            this.context.closePath();
            this.context.fill();
        }
        else { this.context.stroke(); }
    }

    drawLine(line) {
        this.#setColor(line.color);

        this.context.beginPath();
        this.context.moveTo(line.startPoint.x, line.startPoint.y);
        this.context.lineTo(line.endPoint.x, line.endPoint.y);

        this.context.stroke();
    }

    drawText(text) {
        this.#setColor(text.color);
        this.context.font = text.font;

        if (text.filled)    { this.context.fillText(text.text, text.x, text.y); }
        else                { this.context.strokeText(text.text, text.x, text.y); }
    }

    // game loop
    update() { this.#updateFunction(); }
    render() {
        this.context.clearRect(0, 0, this.bounding.width, this.bounding.height);
        this.#renderFunction();
    }

    onUpdate(fn) { this.#updateFunction = fn; }
    onRender(fn) { this.#renderFunction = fn; }

    begin() {
        springInstance = this;
        springInstance.run = true;
        window.requestAnimationFrame(springInstanceLoop);
    }

    end() {
        springInstance.run = false;
    }
}

const springInstanceLoop = () => {
    if (!springInstance.run) return;
    springInstance.update();
    springInstance.render();
    window.requestAnimationFrame(springInstanceLoop);
}


var resourcesReady;

var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var leftMouseDown = false;
var middleMouseDown = false;
var rightMouseDown = false;

//SETUP
const createCanvas = (width, height, container = "") =>
{
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "spring-canvas");
    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());
    canvas.oncontextmenu = (e) => { e.preventDefault(); }

    if (container !== "")
        document.getElementById(container).appendChild(canvas);
    else
        document.body.appendChild(canvas);
    
    // setupInput();
    return new SpringCanvas(canvas);
}

const setCanvas = (id) =>
{
    canvas = document.getElementById(id);

    // setupInput();
    return new SpringCanvas(canvas);
}
//END SETUP

//RENDERING CLASSES
class Sprite
{
    constructor(imageSource, x, y, width, height,)
    {
        this.ready = false;
        
        var image = new Image();
        image.onload = () => { this.ready = true; };
        image.src = imageSource;
        
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Rectangle
{
    constructor(x, y, width, height, color = "black", filled = true)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.filled = filled;
    }
}

class Circle
{
    constructor(x, y, radius, color = "black", filled = true)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.filled = filled;
    }
}

class Line
{
    constructor(startPoint, endPoint, color)
    {
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
    constructor(text, x = 0, y = 0, font = "12px serif", color = "black", filled = true)
    {
        this.text = text;
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
        this.filled = filled;
    }
}
//END RENDERING CLASSES

//INPUT SETUP
function setupInput()
{
    canvas.addEventListener("click", canvasClicked);
    canvas.addEventListener("mousemove", canvasMouseMoved);
    canvas.addEventListener("mousedown", canvasMouseDown);
    canvas.addEventListener("mouseup", canvasMouseUp);

    window.addEventListener("keydown", windowKeyDown);
    window.addEventListener("keyup", windowKeyUp);
    window.addEventListener("keypress", windowKeyPress);
}
//END INPUT SETUP

//INPUT STUFF
class MouseState {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.buttons = {
            left:   false,
            right:  false,
            middle: false,
        };
    }
}

function canvasClicked(event)
{
    onClick(getMouseButton(event.button));
}
function onClick(button) { }

function canvasMouseMoved(event)
{
    mouseX = event.clientX - canvasBounding.left;
    mouseY = event.clientY - canvasBounding.top;
    onMouseMove(mouseX, mouseY);
}
function onMouseMove(x, y) { }

function canvasMouseDown(event)
{
    mouseDown = true;
    if (event.button == 0)
        leftMouseDown = true;
    if (event.button == 1)
        middleMouseDown = true;
    if (event.button == 2)
        rightMouseDown = true;
    
    onMouseDown(getMouseButton(event.button));
}
function onMouseDown(button) { }

function canvasMouseUp(event)
{
    mouseDown = false;
    if (event.button == 0)
        leftMouseDown = false;
    if (event.button == 1)
        middleMouseDown = false;
    if (event.button == 2)
        rightMouseDown = false;
    
    onMouseUp(getMouseButton(event.button));
}
function onMouseUp(button) { }

function windowKeyDown(event)
{
    onKeyDown(new Key(event.keyCode, String.fromCharCode(event.keyCode)));
}
function onKeyDown(key) { }

function windowKeyUp(event)
{
    onKeyUp(new Key(event.keyCode, String.fromCharCode(event.keyCode)));
}
function onKeyUp(key) { }

function windowKeyPress(event)
{
    onKeyPress(new Key(event.keyCode, String.fromCharCode(event.keyCode)));
}
function onKeyPress(key) { }

function getMouseButton(button)
{
    if (button == 0)
        return "left";
    if (button == 1)
        return "middle";
    if (button == 2)
        return "right;"
}

//END INPUT

//INPUT CLASSES

class Key
{
    constructor(code, char)
    {
        this.code = code;
        this.char = char;
    }
}
//END INPUT CLASSES

//UPDATE FUNCTIONS
// function update()
// {
//     onUpdate();
//     //check each resource to see if it's ready
//     if(!resourcesReady)
//     {
//         var readyCount = 0;
//         for(var i = 0; i < renderList.length; i++)
//         {
//             if(renderList[i].ready)
//                 readyCount++;
//         }
//         if(readyCount == renderList.length - 1)
//             resourcesReady = true;
//     }
//     render();
// }

function onUpdate() {} //just here to prevent errors

// function render()
// {

//     //turn off automatic entities for entities created in render loop
//     var oldEntitySetting = automaticEntities;
//     automaticEntities = false;

//     onRender();

//     //revert
//     automaticEntities = oldEntitySetting;

//     context.clearRect(0, 0, canvas.width, canvas.height);
//     for(var i = 0; i < renderList.length; i++)
//     {
//         var current = renderList[i];
//         var type = current.constructor.name;
        
//         if(current.render && inFrame(current))
//         {
//             if(type == "Sprite")
//                 context.drawImage(current.image, current.x, current.y, current.width, current.height);
//             if(type == "Rectangle")
//             {
//                 if(current.filled)
//                 {
//                     context.fillStyle = current.color;
//                     context.fillRect(current.x, current.y, current.width, current.height);
//                 }
//                 else
//                 {
//                     context.strokeStyle = current.color;
//                     context.strokeRect(current.x, current.y, current.width, current.height);
//                 }
//             }
//             if(type == "Circle")
//             {
//                 if(current.filled)
//                     context.fillStyle = current.color;
//                 else
//                     context.strokeStyle = current.color;
                    
//                 context.beginPath();
//                 context.arc(current.x + current.radius, current.y + current.radius, current.radius, 0, 2 * Math.PI);
//                 if(current.filled)
//                 {
//                     context.closePath();
//                     context.fill();
//                 }
//                 else
//                     context.stroke();
                
//             }
//             if(type == "Line")
//             {
//                 context.strokeStyle = current.color;
                
//                 context.beginPath();
//                 context.moveTo(current.startPoint.x, current.startPoint.y);
//                 context.lineTo(current.endPoint.x, current.endPoint.y);
//                 context.stroke();
//             }
//             if(type == "Text")
//             {
//                 if(current.filled)
//                     context.fillStyle = current.color;
//                 else
//                     context.strokeStyle = current.color;
                    
//                 context.font = current.font;
                
//                 if(current.filled)
//                     context.fillText(current.text, current.x, current.y);
//                 else
//                     context.strokeText(current.text, current.x, current.y);
//             }
//         }
//     }
    
//     renderList.splice(0, renderList.length);
    
// }

function onRender() { drawAll(); } //draw all by default

//END UPDATE FUNCTIONS

function draw(renderObject)
{
    renderList.push(renderObject);
}

function drawAll()
{
    entityList.forEach(renderObject => renderList.push(renderObject));
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

//UTILITIES
function getPNG()
{
    canvas.toDataURL("image/png");
}

function randInt(min = 0, max = 1)
{
    return Math.round(Math.random() * (max - min) + min);
}

function hideCursor()
{
    canvas.style.cursor = "none";
}

function showCursor()
{
    canvas.style.cursor = "normal";
}

function outlineCanvas()
{
    canvas.style.border = "1px solid black";
}

function disableAutomaticEntities()
{
    automaticEntities = false;
}