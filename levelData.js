const levels=[

//level 1 (0)
//remember to change all = to : and ; to ,
() => ({
    floorY: 350,
    worldWidth: 1200,

    platforms: [
        { x:100, y:250, width:80, height:30},
        { x:300, y: 150, width: 80, height: 30},
        { x:550, y: 200, width: 100, height: 30}
    ],
    exit: {x: 800, y: 100, ytop:50, ybottom:150, width:30, height:30, dir:1}, //{x;y;dir}
    items: [
        {x:1000, y:250, radius: 20},
        {x:500, y:150, radius: 20}
    ],
    enemies: [
        {x:100, y:300, width: 50, height:30, xleft:100, xright:1000, dir: 1}
    ]
    
}),

//level 2 (1)
() => ({
    floorY: 350,
    worldWidth: 1600,

    platforms: [
        { x:200, y:150, width:80, height:30},
        { x:400, y: 250, width: 80, height: 30},
        { x:950, y: 150, width: 100, height: 30},
        { x:1150, y: 250, width: 100, height: 30},
        { x:1250, y: 150, width: 100, height: 30},
        { x:1500, y:100, width: 100, height: 30}
    ],
    exit: {x: 800, y: 100, ytop:50, ybottom:150, width:30, height:30, dir:1}, //{x;y;dir}
    items: [
        {x:100, y:50, radius: 20},
        {x:500, y:150, radius: 20},
        {x:1550,y:80,radius: 20}
    ],
    enemies: [
        {x:100, y:300, width: 50, height:30, xleft:100, xright:1000, dir: 1}
    ]
}),

//level 3 (2)
() => ({
    floorY: 350,
    worldWidth: 1600,

    platforms: [
        { x:20, y:150, width:40, height:30},
        { x:150, y: 250, width: 40, height: 30},
        { x:300, y: 150, width: 40, height: 30},
        { x:500, y: 200, width: 40, height: 30},
        { x:700, y: 150, width: 40, height: 30},
        { x:900 , y:100, width: 40, height: 30},
        { x:1100, y: 150, width: 40, height: 30},
        { x:1300 , y:100, width: 40, height: 30},
    ],
    exit: {x: 1400, y: 100, ytop:50, ybottom:150, width:30, height:30, dir:1}, //{x;y;dir}
    items: [
        {x:120, y:50, radius: 20},
        {x:500, y:150, radius: 20},
        {x:1550,y:80,radius: 20}
    ],
    enemies: [
        {x:100, y:300, width: 50, height:30, xleft:100, xright:1000, dir: 1},
        {x:1500, y:250, width: 50, height: 30, xleft:200, xright:1500, dir: -1}
    ]
})



]