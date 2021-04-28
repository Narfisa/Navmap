const fs = require('fs')
const queries = require('./queries')

// reading matrix from a json file
function readMatrix(file, callback) {
    fs.readFile(file, function (err, content) {
        if (err) return callback(err)
        console.log('Reading file is ended')
        callback(null, JSON.parse(content))
    })
}

// saving matrix to a json file
function saveMatrix(matrix, file){
    // saving matrix to a json file
    fs.writeFile(file, JSON.stringify(matrix), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log(`Matrix saved to ${file} file`);
        }
    }); 
}

// if points are equals
function equals(firstVertex, secondVertex){
    if (firstVertex.x == secondVertex.x && firstVertex.y == secondVertex.y){
        return true
    }
    return false
}

// if points are connected(equals) with road in start or end point 
function isConnected(point, road){
    let start = {
        x: road.x1,
        y: road.y1
    }
    let end = {
        x: road.x2,
        y: road.y2
    }
    if (equals(point, start)){
        return 'start'
    } else if (equals(point,end)){
        return 'end'
    }
    return false 
}

// finding point index
function findIndex(vertex, vertices){
    for (let i = 0; i < vertices.length; i++){
        let checkVertex = vertices[i]
        if (equals(vertex, checkVertex)){
            return i
        }
    }
}

// init an adjacency matrix
function init(vertices){
    let matrix = [vertices.length]; 

    // making [][] arr
    for (let i=0;i<vertices.length;i++) {
        matrix[i] = [];
    }

    // initial values: 0
    for (let i=0; i < vertices.length; i++){
        for (let j=0; j < vertices.length; j++){
            matrix[i][j] = 0
            matrix[j][i] = 0
        }
    }
    console.log('matrix init ends')
    return matrix
}

// get vertices of roads
async function getVertices(count){
    let vertices = [];
    for (let i = 1; i <= count; i++){
        let currentRow = await queries.getRoad(i)
        
        let startCoord = {
            x: currentRow.x1,
            y: currentRow.y1
        }
        let endCoord = {
            x: currentRow.x2,
            y: currentRow.y2
        }
        vertices.push(startCoord)
        vertices.push(endCoord)
    }

    vertices = vertices.filter((item, index, self) => 
        index == self.findIndex((t) => 
            equals(t,item)))

    return vertices
}

// making adjacency matrix
// searching for every vertices for finding roads 
// where the vertex is a start or end point of the road
// if vertex is the start(end) point - get end(start) point of road
// and finding index of it and saving to matrix
async function adjacencyMatrix(){
    let count = await queries.getCount()
    let vertices = await getVertices(count)
    console.log(count, vertices.length)
    let matrix = init(vertices)

    for (let index = 0; index < vertices.length; index++){ // vertices
        console.log(index); 
        let vertex = vertices[index]
        for (let j = 1; j <= count; j++){ // roads
            let road = await queries.getRoad(j);
            let connected = isConnected(vertex, road);
            if (connected == 'start'){
                let endVertex = {
                    x: road.x2,
                    y: road.y2
                }
                let id = findIndex(endVertex, vertices)
                matrix[index][id] = road.length
                matrix[id][index] = road.length
                console.log('   ',id)
            } else if (connected == 'end'){
                let startVertex = {
                    x: road.x1,
                    y: road.y1
                }
                let id = findIndex(startVertex, vertices)
                matrix[index][id] = road.length
                matrix[id][index] = road.length
                console.log('   ',id)
            }
        }
    }
    console.log('matrix filling ends')

    saveMatrix(matrix, './matrix.json')
    return matrix
}

async function findRoadByVertices(firstVertex, secondVertex, count){
    for (let i = 1; i<=count; i++){
        let road = await queries.getRoad(i)
        if (isConnected(firstVertex, road) && isConnected(secondVertex, road)){
            return road
        }
    }
    return false
}
async function makeRoadPath(path, vertices, count){
    let roadPath = []
    for (let i = 0; i < path.length-1; i++){
        let firstVertex = vertices[path[i]]  
        let secondVertex = vertices[path[i+1]]
        let road = await findRoadByVertices(firstVertex, secondVertex, count)
        if (road) roadPath.push(road.the_geom)
    }
    return roadPath
}
// finding shortestPath with Dejkstra algoritm
async function shortestPath(matrix, from, to){
    let vertices = await getVertices(await queries.getCount())
    const SIZE = vertices.length // get count of vertices
    let start = findIndex(from, vertices); // finding index of start point
    let end = findIndex(to, vertices); // finding index of end point

    let ver = [];   // array of previous vertices
    
    let distance = [SIZE]; // distance array
    let v = [SIZE]; // flag - a vertex is visited or not
    let temp, minindex, min; // temp is for calculating min distance to every vertex
                             // min - current min distance, minindex- current index of vertex with min distance
    
    // init 
    // distance for all bertices is infinity
    // all vertices are not visited yet
    for (let i = 0; i<SIZE; i++)
    {
        distance[i] = Infinity;
        v[i] = false;
    }

    // for start point distance is 0 in the algorithm
    distance[start] = 0; 
    ver.push({              
        index: start,
        previos: null,
        distance: distance[start]    
    })
    // cycle
    do {
        // reset values every step to 
        // numbers about infinity
        minindex = Infinity; 
        min = Infinity;
        
        // finding vertices are not visited with min distance between other adjacent vertices
        for (let i = 0; i<SIZE; i++) { // cycle perl all vertices
            if (!v[i] && (distance[i]<min)) { // if vertex is not visited yet and it has min distance
                min = distance[i];  // now it vertex has min distance
                minindex = i;       // index of vertex with min distance

            }
        }

        // if minindex is found
        if (minindex != Infinity) {
            for (let i = 0; i<SIZE; i++) {
                if (matrix[minindex][i] > 0) { // if vertices are connected(has weight between themselves)
                    temp = min + matrix[minindex][i]; // adding new weight
                    if (temp < distance[i]) {   // if calculated distance(temp) from start point to the vertex
                                                // < then distance to the vertex is already known(distance[i]), 
                        distance[i] = temp;     // then new distance is calculated distance now
                        
                        // adding a vertex to array
                        // there are looking for a connected vertex with the min distance. If its found - added it.
                        // checking vertex(that is visiting now) is a vertex with 'minindex' index and its will be the previos vertex.
                        // a vertex connected to the cheching vertex with min distance - vertex with 'i' index
                        // there is also pushing distance between this vertices, 
                        // 'cause after checking other vertices the distance maybe less than previous value
                        ver.push({              
                            index: i,  
                            previos: minindex,  
                            distance: matrix[i][minindex]
                        })
                    }
                }
            }
            // make flag that means the vertex is visited
            v[minindex] = true;
        }
    } while (minindex < Infinity);
    console.log('calc min distances end')

    // finding path like array of vertices

    // deleting dublicates with the most length(distance)
    for (let i=0; i<ver.length; i++){
        for (let j=0; j<ver.length; j++){
            if (i != j && ver[i].index == ver[j].index){
                if (ver[i].distance > ver[j].distance){
                    ver.splice(i,1)
                } else {
                    ver.splice(j,1)
                }
            }
        }
    }
    // make a path: finding previous vertex and adding them to path
    let path = []
    do {
        let item = ver.find(x => x.index == end)        
        path.push(item.index)
        end = item.previos
    } while (end != start)
    path.push(start)
    
    return makeRoadPath(path.reverse(),vertices,SIZE)
}

module.exports = {adjacencyMatrix, shortestPath, readMatrix}