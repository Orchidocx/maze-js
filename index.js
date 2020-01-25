/**
 * Matter JS Notes
 * World - knows all 'things'
 * Engine - calculates changes and positions of all shapes in the world
 * Runner - run 60 times per second?
 * Render - shows object on screen based on engine calculations
 * Body - the object displayed
 */
const {World, Engine, Runner, Render, Bodies} = Matter;
const engine = Engine.create();
const {world} = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        height: 600,
        width: 800
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

const shape = Bodies.rectangle(200,200, 50,50, {
    isStatic: true
});
World.add(world, shape);