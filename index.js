const {World, Engine, Runner, Render, Bodies, Body, Events} = Matter;
const width = window.innerWidth, height = window.innerHeight;
const gridWidth = 6, gridHeight = 6;
const unitLengthX = width/gridWidth;
const unitLengthY = height/gridHeight;
const engine = Engine.create();
engine.world.gravity.y = 0;
const {world} = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        height,
        width,
        wireframes: false
    },
    
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
    Bodies.rectangle(width/2,0, width, 5, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 5, {isStatic: true}),   
    Bodies.rectangle(0, height/2, 5, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 5, height, {isStatic: true})
]
World.add(world, walls);

const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
const verticals = Array(gridSize).fill(null).map(() => Array(gridSize-1).fill(false));
const horizontals = Array(gridSize-1).fill(null).map(() => Array(gridSize).fill(false));

// get starting position for the Player in the grid
const startRow = Math.floor(Math.random()*gridSize);
const startColumn = Math.floor(Math.random()*gridSize);

const step = (row, col) => {
    // if visited, then return
    if(grid[row][col]) {
        return; //already visited cell
    }
    grid[row][col] = true;

    const neighbors = shuffle([
        [row-1, col, 'up'],
        [row+1, col, 'down'] ,
        [row, col-1, 'left'],
        [row, col+1, 'right']
    ]);

    for (let neighbor of neighbors) {
        const [nextRow, nextCol, direction] = neighbor;
        if(nextRow < 0 || nextRow >= gridSize || 
           nextCol < 0 || nextCol >= gridSize) {
            continue;
        }
        if(grid[nextRow][nextCol]) {
            continue;
        }
        switch(direction) {
            case 'left':
                verticals[row][col-1] = true;
                break;
            case 'right':
                verticals[row][col] = true;
                break;
            case 'up':
                horizontals[row-1][col] = true;
                break;
            case 'down':
                horizontals[row][col] = true;
                break;
        }
        step(nextRow, nextCol);
    }
};

step(startRow, startColumn);



// Add walls based on the true/false values of generated maze values;
const addWalls = (arr, orientation) => {
    arr.forEach((row, rIndx) => {
        row.forEach((passage, cIndx) => {
            if(passage) {return};
            let xPos, yPos, w, h;
            if(orientation === "horizontal") {
                xPos = cIndx * unitLength + unitLength / 2
                yPos = rIndx * unitLength + unitLength;
                w = unitLength;
                h = 5;
            } else if (orientation === "vertical") {
                xPos = cIndx * unitLength + unitLength;
                yPos = rIndx * unitLength + unitLength / 2
                w = 5;
                h = unitLength;
                
            }
            const wall = Bodies.rectangle(xPos, yPos, w, h, 
                { 
                    isStatic:true, 
                    label: 'wall'
                });
            World.add(world, wall);
        });
    });
}
addWalls(horizontals, "horizontal");
addWalls(verticals, "vertical");

// Goal
const goal = Bodies.rectangle(width - unitLength/2, height - unitLength/2, unitLength/2, unitLength/2,
    {
        isStatic: true,
        label: 'goal'
    });
World.add(world, goal);

// Player
const player = Bodies.circle(
    unitLength/2,
    unitLength/2,
    unitLength/4,
    {
        restitution: .25,
        label: 'player'
    }
);
World.add(world, player);

document.addEventListener('keydown', event => {
    const {x,y} = player.velocity;
    switch(event.keyCode) {
        case 38:
        case 87:
            Body.setVelocity(player, {x, y: y - 5});
            break;
        case 39:
        case 68:
            Body.setVelocity(player, {x: + 5, y});
            break;
        case 40:
        case 83:
            Body.setVelocity(player, {x, y: y + 5});
            break;
        case 37:
        case 65:
            Body.setVelocity(player, {x: - 5, y});
            break;
        case 32:
            console.log("space jump!");
        default:
            console.log(event.keyCode);
    }
});

// Win Condition
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach((collision) => {
        const labels = ['player', 'goal'];
        if(labels.includes(collision.bodyA.label) &&
           labels.includes(collision.bodyB.label)) {
               world.gravity.y = 1;
               world.bodies.forEach(body => {
                   if(body.label === 'wall') {
                       Body.setStatic(body, false);
                   }
               })
           }
    })
})