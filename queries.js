const db = require("./db")

// get a number of roads
function getCount(){
    return db.one("SELECT count(*) as value FROM roads")
        .then(data => {
            return data.value;
        })
        .catch(error => {
            console.log("ERROR: ", error)
        });
}

// get a road by id 
function getRoad(index){
    return db.one(`SELECT * FROM roads ORDER BY gid LIMIT 1 OFFSET ${index-1}`)
    .then(data => {
        return data
    })
    .catch(error => {
        console.log("ERROR: ", error)
    });
}

module.exports = {getCount, getRoad}