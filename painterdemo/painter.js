var colorInput
var cursorCircle;

onStart = function() {
    createCanvas(800, 600);
    outlineCanvas();
    hideCursor();
    
    colorInput = document.getElementById("color-input");
    
    cursorCircle = new Circle(0, 0, 8, "gray", false);

    play();
}
onMouseMove = function(x, y) {

    cursorCircle.x = x;
    cursorCircle.y = y;

    if (leftMouseDown) {
        new Circle(x, y, 8, colorInput.value);
    }
    if (rightMouseDown) {
        new Circle(x, y, 8, "white");
    }
}