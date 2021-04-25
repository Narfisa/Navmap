# Navmap
As my diploma this repo for finding the shortest road path. 

1. For example I got a little map of Novosibirskiy Akademgorodok(Russia) from OpenStreetMap(XML). 
2. Next I export it with osm2pgrouting(recommended) to Postregsql.
3. From ways should be removed unnecessery highways(where highway = "cicleway" and other)
4. If u loaded osm data with osm2pgrouting u do not need to divide roads at intersection points(crossroads)
5. Next should make adjacency matrix. 
5. 1. First step - get vertices of roads(start and end points without repeating)
5. 2. Second step - inital th
6. Next we can use any algorithm we wish. In this repo used modificated Dijkstra's algorithm.
