var mySprite;
var boxes = [];

var helloText;
var hello2Text;
var mouseText;

window.onload = function()
{
    //document.write("loaded");
    createCanvas(800, 600, document.getElementById("container"));
    mySprite = new Sprite("sprite.png", 0, 0, 32, 32);

    helloText = new Text("hello world!", 50, 50, "60px monospace", "green", false);
    hello2Text = new Text("hello again", 70, 70, "40px Arial", "orange");
    mouseText = new Text(mouseX + " " + mouseY, 700, 500);

    play();
}

onUpdate = function()
{
    //update logic
    mySprite.x++;
    mySprite.y++;
}

onRender = function()
{
    for(var i = 0; i < boxes.length; i++)
    {
        //boxes[i].x++;
        //boxes[i].y++;
        draw(boxes[i]);
    }
    
    //draw sprite
    draw(mySprite);
    
    mouseText.text = "M: " + mouseX + ", " + mouseY;

    //draw text
    draw(helloText)
    draw(hello2Text)
    draw(mouseText)

    //draw test shapes
    draw(new Rectangle(150, 150, 20, 40, "#ff00ff", true));
    draw(new Circle(200, 150, 15, "cyan", true));
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