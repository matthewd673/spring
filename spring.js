var canvas;
var context;
var resourcesReady;

var sprites = [];

//SETUP
function createCanvas(width, height, parent = null)
{
    var canvasCode = "<canvas id='spring-surface'></canvas>";
    
    var stringWidth = width.toString();
    var stringHeight = height.toString();
    
    var newCanvas = document.createElement("canvas");
    newCanvas.setAttribute("id", "spring-surface");
    newCanvas.setAttribute("width", stringWidth);
    newCanvas.setAttribute("height", stringHeight);
    
    if(parent == null)
    {
        document.body.appendChild(newCanvas);
    }
    else
    {
        var parent = document.getElementById(parent);
        parent.appendChild(newCanvas);
    }
    
    canvas = newCanvas;
    context = canvas.getContext("2d");
    
}

function setCanvas(canvasId)
{
    canvas = document.getElementById(canvasId);
    context = canvas.getContext("2d");
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
        image.onload = function() { this.ready = true; }
        image.src = imageSource;
        
        this.image = image;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        sprites.push(this);
    }
    
    hide()
    {
        this.render = false;
    }
    
    show()
    {
        this.render = true;
    }
    
    move(x, y)
    {
        this.x = x;
        this.y = y;
    }
    
}
//END RENDERING CLASSES

//UPDATE FUNCTIONS
function update()
{
    onUpdate();
    //check each resource to see if it's ready
    if(!resourcesReady)
    {
        var readyCount = 0;
        for(var i = 0; i < sprites.length; i++)
        {
            if(sprites[i].ready)
                readyCount++;
        }
        if(readyCount == sprites.length - 1)
            resourcesReady = true;
    }
    render();
}

function onUpdate() {} //just here to prevent errors

function render()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < sprites.length; i++)
    {
        var currentSprite = sprites[i];
        if(currentSprite.render)
        {
            //render it
            context.drawImage(currentSprite.image, currentSprite.x, currentSprite.y);
        }
    }
}
//END UPDATE FUNCTIONS

function play(fps = 60)
{
    window.setInterval(update, 1000 / fps);
}