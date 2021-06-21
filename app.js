const app = require("./config.js")
const algoritm = require("./algoritm")
const fs = require("fs");
const queries = require("./queries")

app.post('/getpath', async function (req, res) {
    let start = req.body.start
    let end = req.body.end
    let firstRoad = await queries.getNearestRoad(start)
    let secondRoad = await queries.getNearestRoad(end)
    let firstVertex = {
        x: firstRoad.x1,
        y: firstRoad.y1
    }
    let secondVertex = {
        x: secondRoad.x2,
        y: secondRoad.y2
    }
    algoritm.shortestPath(firstVertex, secondVertex)
    .then(data => {
        res.send(data)
        return
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(404)
    })
});



