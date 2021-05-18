const db = require("./db")

// get a number of roads
async function getCount(){
    return db.one("SELECT count(*) as value FROM roads")
        .then(data => {
            return data.value;
        })
        .catch(error => {
            console.log("ERROR: ", error)
        });
}

// get a road by id 
async function getRoad(index){
    return db.one(`SELECT * FROM roads ORDER BY gid LIMIT 1 OFFSET ${index}`)
    .then(data => {
        return data
    })
    .catch(error => {
        console.log("ERROR: ", error)
    });
}

async function getVertices(){
    return db.many(`SELECT * from vertices`)
    .then(data => {
        return data
    })
    .catch(error => {
        console.log("ERROR: ", error)
    });
}

async function getNearestRoad(point){
    return db.one(`SELECT x1, y1, x2, y2, ST_DISTANCE(the_geom, ST_SetSrid(ST_POINT(${point.lng}, ${point.lat}),4326)) AS Distance
        FROM roads
        INNER JOIN (SELECT ST_SetSRID(ST_POINT(${point.lng}, ${point.lat}), 4326) AS point ) AS p
        ON ST_DWithin(point, the_geom, 20)  
        ORDER BY Distance
        LIMIT 1;`)
    .then(data => {
        return data
    })
    .catch(error => {
        console.log("ERROR: ", error)
    })
}

// to do- add new vertices to adjacency matrix
async function getNearestPoint(point){
    let road = await getNearestRoad(point)
    let query = `select st_startpoint(
        st_intersection()
    )`
    return db.one(`SELECT x1, y1, x2, y2, ST_DISTANCE(the_geom, ST_SetSrid(ST_POINT(${point.lng}, ${point.lat}),4326)) AS Distance
        FROM roads
        INNER JOIN (SELECT ST_SetSRID(ST_POINT(${point.lng}, ${point.lat}), 4326) AS point ) AS p
        ON ST_DWithin(point, the_geom, 20)  
        ORDER BY Distance
        LIMIT 1;`)
    .then(data => {
        return data
    })
    .catch(error => {
        console.log("ERROR: ", error)
    })
}

module.exports = {getCount, getRoad, getNearestRoad, getVertices}