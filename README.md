# Navmap
As my diploma this repo for finding the shortest road path. 

1. For example I got a little map of Novosibirskiy Akademgorodok(Russia) from OpenStreetMap(XML). 
2. Next I export it with osm2pgrouting(recommended) to Postregsql.
3. From ways should be removed unnecessery highways(where highway = "cicleway" and other)
4. If u loaded osm data with osm2pgrouting u do not need to divide roads at intersection points(crossroads)
5. Next should make adjacency matrix. 
    1. First step - get vertices of roads(start and end points without repeating)
    2. Second step - inital matrix(filling matrix with zero)
    3. Founding in roads where two vertices(for example, i and j vertices) are connected by a road
    4. If i and j vertices are connected, write to matrix length of the road
6. Next we can use any algorithm we wish. In this repo used modificated Dijkstra's algorithm.
