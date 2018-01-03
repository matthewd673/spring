# spring

A simple JS game engine.

This README serves as a simple tutorial for getting started with spring. Follow the steps below and you'll be on your way to creating a simple game.
*Note that `[parameter]` denotes an optional parameter.*

## Getting Started

Using spring is super simple, just add spring.js with `<script src="spring.js"></script>` and begin writing your code in another script.
Once you're ready to ship the game, you can include `spring.min.js` which is significantly more compact, only a few KBs!

### Creating the Canvas

Spring can create it's own canvas or use one of yours. `createCanvas(width, height, [parent])` will create a canvas with ID `spring-surface`.

You don't need to worry about converting the width and height to a string, spring will do that part for you.
You can optionally pass it an ID to append the canvas to that element, such as a container `<div>`.
The canvas will always be appended to the end of the parent's HTML, whether it is a specific element or `document`.


If you wish to use a different canvas for whatever reason, use `setCanvas(canvasId)`.

### The Update Loop

Spring's update loop triggers alongside it's rendering system, at whatever FPS you specify when calling `play()`.
Spring can also trigger your own code whenever it updates, just override the `onUpdate()` function with `onUpdate = function() { //your code here }`.
You should note that `onUpdate()` is triggered before spring's render code.

### Drawing Images

To create an image, use the `Sprite` class like so: `var image = new Sprite(image, width, height, [x], [y])`.
Once your sprite has been initialized, it will be added to the array of sprites (`sprites`).

### Accepting Input

Input is currently a work in progress.

### Running Your Game

Once you're all set up, just `play([fps])` to run the game. The FPS defaults to 60, which should be fine for most use cases.
Only after `play()` has been called will `onUpdate()` and the other update/render functions begin to trigger.