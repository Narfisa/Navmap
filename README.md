# Navmap
As my diploma this repo for finding the shortest road path. 

1. For example I get a little map of Novosibirsk(Russia) from OpenStreetMap(XML). 
2. Next I export it with oms2pgsql to Postregsql with PostGIS extension.
3. From planet_osm_roads should be removed unnecessery highways(where highway = "cicleway", "track" and other)
4. To make road graph should know start and end points of geometries. It can be done with PostGIS functions as ST_StartPoint() and ST_EndPoint().
5. Next should make adjacency matrix. Thats why we need start and end points. We go throught all rows in our table to find rows where start or end points matches. If it's true, in the matrix will be value of distanse between these geometries. Else - 0.
6. Next we can use any algorithm we wish. In this repo used modificated Dijkstra's algorithm.
