const app = require("./config.js")
const algoritm = require("./algoritm")
var fs = require("fs");

const file = './matrix.json'
let start = {
    x: 83.0990183,
    y: 54.856887
} 
let end = {
    x: 83.0987331,
    y: 54.858106
}
algoritm.adjacencyMatrix().then(data => {
    console.log('done')
})
// algoritm.readFile(file, function (err, content) {
//     let path = algoritm.shortestPath(content, start, end)
//     console.log(path)
// })


