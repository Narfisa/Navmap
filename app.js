const app = require("./config.js")
const algoritm = require("./algoritm")
const fs = require("fs");
const queries = require("./queries")

const file = './matrix.json'

app.post('/getpath', async function (req, res) {
    let start = req.body.start
    let end = req.body.end
    console.log(start, end)
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
    console.log(firstVertex, secondVertex)
    // for finding path we need to load adjacency matrix first
    algoritm.readMatrix(file, function (content) {
        algoritm.shortestPath(content, firstVertex, secondVertex)
        .then(data => {
            res.send(data)
            return
        })
        .catch(err => {
            console.log(err)
            return res.sendStatus(404)
        })
    })
  });



