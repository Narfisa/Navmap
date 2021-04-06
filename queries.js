const db = require("./db")

// get number of rows
function getCount(){
    db.one("SELECT count(*) as value FROM map")
        .then(data => {
            return data.value
        })
        .catch(error => {
            console.log("ERROR: ", error)
        });
}

// if endpoint == startpoint or startpoint==startpoint or endpoint=endpoint then roads are adjacent
function isAdjacent(firstRoad, secondRoad){    
    return (firstRoad.startPointX == secondRoad.endPointX) 
    || (firstRoad.startPointX == secondRoad.startPointX) 
    || (firstRoad.endPointX == secondRoad.endPointX)
}

function getRoad(index){
    db.one(`SELECT * AS result FROM map ORDER BY osm_id LIMIT 1 OFFSET ${index-1}`)
    .then(data => {
        return data.result;
    })
    .catch(error => {
        console.log("ERROR: ", error)
    });
}

module.exports = {getRoad, getCount, isAdjacent}