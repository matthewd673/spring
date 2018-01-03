var mySprite;

window.onload = function()
{
    //document.write("loaded");
    createCanvas(800, 600);
    mySprite = new Sprite("sprite.png", 32, 32);
    play();
}

onUpdate = function()
{
    mySprite.move(mySprite.x + 1, mySprite.y + 1);
}