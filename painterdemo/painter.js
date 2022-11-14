var colorInput
var cursorCircle;

let canvas;
let points = [];

const render = () => {
    points.forEach((c) => {
        canvas.drawCircle(c);
    });
    canvas.drawCircle(cursorCircle);
}
window.onload = function() {
    canvas = createCanvas(800, 600);
    // outlineCanvas();
    // hideCursor();
    
    colorInput = document.getElementById("color-input");
    
    cursorCircle = new Circle(0, 0, 8, "gray", false);

    canvas.onMouseMove(onMouseMove);
    canvas.onRender(render);
    canvas.begin();
}
function onMouseMove() {
    let x = canvas.mouseState.x;
    let y = canvas.mouseState.y;

    cursorCircle.x = x;
    cursorCircle.y = y;

    if (canvas.mouseState.buttons.left) {
        points.push(new Circle(x, y, 8, colorInput.value));
    }
    if (canvas.mouseState.buttons.right) {
        points.push(new Circle(x, y, 8, "white"));
    }
}