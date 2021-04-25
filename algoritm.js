const fs = require('fs')
const queries = require('./queries')

// reading matrix from a json file
function readFile(file, callback) {
    fs.readFile(file, function (err, content) {
        if (err) return callback(err)
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

// finding shortestPath with Dejkstra algoritm
function shortestPath(matrix, from, to){
    const SIZE = matrix[0].length
    console.log(SIZE)
    let d = [SIZE]; // min distance
    let v = [SIZE]; // is visited
    let temp, minindex, min;
    let begin_index = findIndex(from, matrix);
    
    // init 
    for (let i = 0; i<SIZE; i++)
    {
        d[i] = 10000;
        v[i] = false;
    }
    d[begin_index] = 0; // for first vertices value is 0

    // Шаг алгоритма
    do {
        minindex = 10000;
        min = 10000;
        for (let i = 0; i<SIZE; i++) { // Если вершину ещё не обошли и вес меньше min
            if (v[i] && (d[i]<min)) { // Переприсваиваем значения
                min = d[i];
                minindex = i;
            }
        }
        // Добавляем найденный минимальный вес
        // к текущему весу вершины
        // и сравниваем с текущим минимальным весом вершины
        if (minindex != 10000) {
            for (let i = 0; i<SIZE; i++) {
                if (matrix[minindex][i] > 0) {
                    temp = min + matrix[minindex][i];
                    if (temp < d[i]) {
                        d[i] = temp;
                    }
                }
            }
            v[minindex] = 0;
        }
    } while (minindex < 10000);

    // Восстановление пути
    let ver = [SIZE]; // массив посещенных вершин
    let end = findIndex(to, matrix)+1; // индекс конечной вершины
    ver[0] = end-1; // начальный элемент - конечная вершина
    let k = begin_index+1;
    let weight = d[end]; // вес конечной вершины
    console.log(weight)
    
    while (end != begin_index) { // пока не дошли до начальной вершины
        for (let i = 0; i<SIZE; i++) { // просматриваем все вершины
            if (matrix[i][end] != 0) {  // если связь есть
                let temp = weight - matrix[i][end]; // определяем вес пути из предыдущей вершины
                if (temp == d[i]) { // если вес совпал с рассчитанным значит из этой вершины и был переход
                    weight = temp; // сохраняем новый вес
                    end = i;       // сохраняем предыдущую вершину
                    ver[k] = i + 1; // и записываем ее в массив
                    k++;
                }
            }
        }
    }
    
    return ver.reverse()
}

module.exports = {adjacencyMatrix, shortestPath, readFile}