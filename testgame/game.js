var mySprite;
var boxes = [];

window.onload = function()
{
    //document.write("loaded");
    createCanvas(800, 600, document.getElementById("container"));
    mySprite = new Sprite("sprite.png", 32, 32);
    play();
}

onUpdate = function()
{
    mySprite.x++;
    mySprite.y++;
    
    for(var i = 0; i < boxes.length; i++)
    {
        //boxes[i].x++;
        //boxes[i].y++;
        draw(boxes[i]);
    }
    
    draw(mySprite);
    
    draw(new Text("hello world!", "60px monospace", "yellow", false, 50, 50));
    draw(new Text("hello again", "40px Arial", "orange", true, 70, 70));
    
}

function removeSprite()
{
    hide(mySprite);
}

function countSprites()
{
    console.log("Sprites: " + (boxes.length));
}

onMouseMove = function(x, y)
{
    //var newSprite = new Sprite("sprite.png", 32, 32, x, y);
    //boxes.push(newSprite);
    //var newShape = new Shape("rectangle", 32, 32, "#00ff55", false, x, y);
    newLine = new Line(new Point(x, y), new Point(0, 0), "blue");
    
    boxes.push(newLine);
}