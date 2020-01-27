const {World, Engine, Runner, Render, Bodies} = Matter;
const width = 600, height = 600;
const gridSize = 6;
const unitLength = width/gridSize;
const engine = Engine.create();
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
    Bodies.rectangle(width/2,0, width, 40, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 40, {isStatic: true}),   
    Bodies.rectangle(0, height/2, 40, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 40, height, {isStatic: true})
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
            const wall = Bodies.rectangle(xPos, yPos, w, h, { isStatic:true });
            World.add(world, wall);
        });
    });
}
addWalls(horizontals, "horizontal");
addWalls(verticals, "vertical");