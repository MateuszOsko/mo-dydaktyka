---
layout: default
title: Wektor - Tworzenie obiektów
course_id: structures
order: 7
---

## Wektor - tworzenie obiektów


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


**4. Jak wykorzystywać operacje na warstwach by tworzyć nowe geometrie?**


**5. Problemy do samodzielnego rozwiązania:**


**6. Rozbudowa VectorTools:**
