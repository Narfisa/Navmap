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

//find road with given index with geogson format
async function getGeoJSON(id){
    return db.one(`SELECT st_AsGeoJSON(the_geom) as road FROM roads where gid=${id}`)
    .then(data => {
        let coord = data.road.split('[').pop()
        coord = coord.replace('}', ''); 
        coord = coord.replace(']]', ''); 
        coord = coord.split(',').reverse()
        return coord
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
    return db.one(`SELECT gid, x1, y1, x2, y2, the_geom, ST_DISTANCE(the_geom, ST_SetSrid(ST_POINT(${point.lng}, ${point.lat}),4326)) AS Distance
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

module.exports = {getCount, getRoad, getNearestRoad, getVertices, getGeoJSON}