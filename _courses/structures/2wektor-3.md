---
layout: default
title: Wektor - Tworzenie obiektów
course_id: structures
order: 7
---

## Wektor - tworzenie obiektów


**Dane do ćwiczeń**

<ul>
    <li>
        <a href="{{ '/dane/fw2.geojson' | relative_url }}" download>
            Dane o wyspach na świecie
        </a>
    </li>
</ul>



**1. Jak tworzyć własne dane punktowe, liniowe i poligony?**

```python
from shapely import Point, LineString, Polygon
import geopandas as gpd

# Obiekty punktowe możemy tworzyć po prostu podając współrzędne
p1 = Point(10, 10)
p2 = Point(20, 20)
p3 = Point(40, 10)
p4 = Point(30, 0)

print(p1)

# Z wielu obiektów punktowych możemy układać linie:
line = LineString([p1, p2, p3, p4])

print(line)

# Możemy w ten sposób tworzyć też poligony:
polygon = Polygon([p1, p2, p3, p4])

print(polygon) # Dlaczego ten print zwraca 5 współrzędnych mimo że podaliśmy tylko 4 punkty?

# Zarówno linie jak i poligony możemy też konstruować z czystych współrzędnych, nie zamkniętych w obiekt Point:
line2 = LineString([
    (40, 40),
    (40, 50),
    (55, 55)
])

print(line2)

# Możemy też stworzyć poligon bezpośrednio z linii będącej pierścieniem
ring = LineString([
    (10, 10),
    (20, 10),
    (20, 20),
    (10, 10)
])
polygon2 = Polygon(ring)

print(polygon2)

# Mając ręcznie stworzoną geometrię w shapely bez problemu możemy na jej podstawie ułożyć geodataframe:
gdf = gpd.GeoDataFrame(
    {
        "name": ["Poligon"]
    },
    geometry=[polygon],
    crs="EPSG:2180"
)

gdf.plot()

# Możemy też stworzyć obiekt który zawiera od razu wiele geometrii:
gdf2 = gpd.GeoDataFrame(
    {
        "name": ["Point1", "Point2", "Point3", "Point4"]
    },
    geometry=[p1, p2, p3, p4],
    crs="EPSG:2180"
)

gdf2.plot()

# Lub obiekt który ma tylko 1 geometrię, jest ona jednak złożona:
from shapely import MultiLineString

multiline = MultiLineString([line, line2])
gdf3 = gpd.GeoDataFrame(
    {
        "name": ["Multilinia"]
    },
    geometry=[multiline],
    crs="EPSG:2180"
)

gdf3.plot()
```


**2. Jak tworzyć poligony z dziurami?**

Możemy tworzyć poligony zawierające dziury dzięki dodatkowemu parametrowi w konstruktorze Polygon() - holes.

```python
outer = [
    (10, 10),
    (50, 10),
    (50, 50),
    (10, 50)
]

hole1 = [
    (15, 25),
    (25, 15),
    (25, 25),
    (15, 30)
]

hole2 = [
    (15, 35),
    (45, 25),
    (35, 45)
]

polygon_with_holes = Polygon(
    outer,
    holes=[hole1, hole2]
)

print(polygon_with_holes)

gdf = gpd.GeoDataFrame(
    geometry=[polygon_with_holes],
    crs="EPSG:2180"
)

gdf.plot()
```

**3. Jak rozbijać obiekt na nowe, mniejsze elementy?**

GeoDataFrame możemy rozbijać, tworząc w tej sposób nowe elementy, na dwa sposoby: poprzez geometrię oraz poprzez atrybuty.

Dane początkowe:
```python
islands = gpd.read_file("../dane/fw2.geojson")
print(islands.head())
print(islands.plot())
```


Rozbicie poprzez geometrię:
```python
# Do rozbijania geometrii służy funkcja explode():
print(islands.geom_type.unique())
print(len(islands))

geoexploded_islands = islands.explode()

print(geoexploded_islands.geom_type.unique())
print(len(geoexploded_islands))

# Geometrie można potem składać funkcją dissolve(), która - w pewnym sensie - jest przeciwieństwem explode():
geodissolved_islands = geoexploded_islands.dissolve(by="nazwa")
print(geodissolved_islands.geom_type.unique())
print(len(geodissolved_islands))

# Ponieważ len() islands i geodissolved_islands się różnią, sprawmy dlaczego:
duplicate = islands.loc[
    islands["nazwa"].duplicated(),
    "nazwa"
].unique()
print(duplicate)

# Dodatkowo inną formą rozbicia jest filtrowanie gdf po warunkach nałożonych na geometrię:
mean = islands.geometry.area.mean()

large_islands = islands[islands.geometry.area > mean ]
small_islands = islands[islands.geometry.area <= mean]
# Jaka jest obecnie największa wada tej implementacji?

large_islands.plot()
small_islands.plot()
```

Rozbicie poprzez atrybuty:
```python
# Zacznijmy od przykładu stworzenia nowego gdf poprzez filtorwanie atrybutów
# Z poprzedniej sekcji dowiedzieliśmy się że mamy duplikat ze względu na nazwę. Sprawdźmy to więc dalej:

duplicate_islands = islands[islands["nazwa"] == duplicate[0]]
print(duplicate_islands.head())
# Wyjaśnij na czym polega błąd w danych i czym prawdopodobnie został spowodowany?

# Wracając do klasycznego rozbijania - tabelę atrybutów możemy grupować po wartościach, a następnie tworzyć nowe obiekty według grup:
attrgroup_islands = islands.groupby("ocean")

groups = {}
for ocean, group in attrgroup_islands:
    groups[ocean] = group

for ocean, gdf in groups.items():
    ax = gdf.plot()
    ax.set_title(ocean)
# Niektóre dane mogą wymagać czyszczenia - spróbujcie je wystandaryzować i jeszcze raz puścić grupowanie!
```

**4. Jak wykorzystywać operacje na warstwach by tworzyć nowe geometrie?**

```python
# Buffer:
point = gpd.GeoDataFrame(
    geometry=[Point(100,100)],
    crs="EPSG:2180"
)

buffer = point.geometry.buffer(10)
buffer.plot()

buffer2 = point.geometry.buffer(10, 3)
buffer2.plot()
# Jak interpretować drugi parametr (resolution) w buffer?

# Centroid:
example_island = islands.iloc[[10]]
example_island.plot()

centroid = example_island.geometry.centroid
ax = example_island.plot()
centroid.plot(ax=ax, color="black", marker="*", markersize=100)

# Convex_hull:
from shapely import MultiPoint
many_points = gpd.GeoDataFrame(
    geometry=[
        MultiPoint([
            Point(100,100),
            Point(34, 52),
            Point(20, 67),
            Point(105, 120),
            Point(80,96),
            Point(100, 62),
            Point(90,90)
        ])
    ],
    crs="EPSG:2180"
)
many_points.plot()

convex_hull = many_points.geometry.convex_hull
# Czemu buffer był wywoływany z nawiasami () a centroid czy convex_hull już nie? Czym się różnią?

convex_hull.plot()
# Czym będzie się różnił powstały poligon od poligonu który po prostu został stworzony bezpośrednio z podanych punktów?
# Np.: Polygon([Point(100,100), Point(34, 52) ....])

# Simplify
not_simplified = example_island.to_crs("3395")

simplify1 = not_simplified.simplify(2000)
simplify2 = not_simplified.simplify(5000)
simplify3 = not_simplified.simplify(10000)
# Co oznacza wartość parametru?

not_simplified.plot()
simplify1.plot()
simplify2.plot()
simplify3.plot()
```


**5. Problemy do samodzielnego rozwiązania:**

<ol type="a">
  <li>Stwórz warstwę liniową, która po wyświetleniu będzie zawierała pierwsze 3 drukowane litery Twojego imienia i pierwsze 3 drukowane litery Twojego nazwiska. Każda literka powinna być osobnym rekordem w GeoDataFrame. Wyeksportuj te dane i wyświetl w QGIS.</li>
  <li>Z danych o wyspach stwórz słownik, gdzie kluczem będą nazwy krajów a wartością lista geometrii wysp do nich przypisanych. Następnie stwórz ranking top 10 krajów które mają największą sumaryczną powierzchnię wysp w m2</li>
  <li>Z danych o wyspach stwórz nowy GeoDataFrame zawierający tylko wyspy należące do Japonii. Przeprowadź dla nich 3 wizualizacje różniące się poziomem uproszczenia geometrii. Dla każdego poziomu wypisz: ilość krawędzi (linii) oraz ilość wierzchołków (punktów) z których się składa</li>
</ol>


**6. Rozbudowa VectorTools:**

