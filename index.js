/**
 * Matter JS Notes
 * World - knows all 'things'
 * Engine - calculates changes and positions of all shapes in the world
 * Runner - run 60 times per second?
 * Render - shows object on screen based on engine calculations
 * Body - the object displayed
 */
const {World, Engine, Runner, Render, Bodies, MouseConstraint, Mouse} = Matter;
const width = 600, height = 600;
const engine = Engine.create();
const {world} = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        height: height,
        width: width,
        wireframes: false
    },
    
});
Render.run(render);
Runner.run(Runner.create(), engine);

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}));

// Walls
const walls = [
    Bodies.rectangle(width/2,0, width, 40, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 40, {isStatic: true}),   
    Bodies.rectangle(0, height/2, 40, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 40, height, {isStatic: true})
]

// Random Shapes

// Create random circles
const randomCircles = (num) => {
    const circles = [];
    for(let i = 0; i < num; i++) {
        circles.push(Bodies.circle(100,100, Math.random()*40+5));
    }
    return circles;
}

World.add(world, walls);
World.add(world, randomCircles(20));
