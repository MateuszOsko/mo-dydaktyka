---
layout: default
title: Wektor - Podstawy
course_id: structures
order: 5
---

## Wektor - podstawy

Do pracy z danymi wektorowymi wykorzystamy bibliotekę **Geopandas**.
Oczywiście nie jest to jedyne możliwe narzędzie do danych wektorowych - inne warte uwagi to chociażby ogr i shapely (wykorzystywane już jako składowa w geopandas) czy QGIS API i GRASS API (przydatne, ale mocno związane z konkretnym narzędziem).

Geopandas jest bezpośrednim rozszerzeniem możliwości "zwykłego" Pandas - logika pracy oraz wszystkie podstawowe operacje znane w Pandas występują też w Geopandas. Podstawową różnicą jest natomiast dodanie konkretnej kolumny która zamiast atrybutem nieprzestrzennym oznaczona jest jako geografia, co umożliwia szeroki zakres operacji GIS.

**Dane do ćwiczeń**

<ul>
    <li>
        <a href="{{ '/dane/wulkany.zip' | relative_url }}">
            Dane o wulkanach na świecie - w różnych formatach
        </a>
    </li>
    <li>
        <a href="{{ '/dane/hr1.geojson' | relative_url }}" download>
            Dane o rzekach na świecie
        </a>
    </li>
    <li>
        <a href="{{ '/dane/lsp1.geojson' | relative_url }}" download>
            Dane demograficzne o odsetku społeczeństwa w wieku 65+ na świecie
        </a>
    </li>
</ul>

<small>*Źródło danych: https://mapplab.pl + opracowanie własne*</small>

**1. Jak wczytywać dane w Geopandas?**

```python
import geopandas as gpd

path_to_files = "../dane/wulkany/"

# SHP:

shp_v = gpd.read_file(path_to_files+"lw1/lw1.shp")
print(shp_v.head())

# GEOJSON:

geojson_v = gpd.read_file(path_to_files+"lw1.geojson")
print(geojson_v.head())

# GPKG:

gpkg_v = gpd.read_file(path_to_files+"lw1.gpkg")
print(gpkg_v.head())

# CSV:

import pandas as pd
csv_v_raw = pd.read_csv(path_to_files+"lw1.csv")
csv_v = gpd.GeoDataFrame(
    csv_v_raw,
    geometry=gpd.points_from_xy(
        csv_v_raw["x"],
        csv_v_raw["y"]
    ),
    crs="EPSG:4326"
) # Skąd wynika większe skomplikowanie przy csv?

print(csv_v_raw)
```

**2. Jak wyświetlać wczytane dane?**

```python
# Źródło danych po poprawnym załadowaniu nie ma już znaczenia dla dalszych operacji
shp_v.plot()
geojson_v.plot()
gpkg_v.plot()
csv_v.plot()

# Oczywiście funkcja plot() przyjmuje wiele możliwych parametrów dot. stylizacji
geojson_v.plot(
    marker="^",
    color="red",
    markersize=20
)

# Do bardziej skomplikowanych zobrazowań, zawierających więcej elementów niż tylko mapę, warto użyć Matplotlib
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 6))

geojson_v.plot(
    marker="^",
    column="typ",
    legend=True,
    ax=ax
)

legend = ax.get_legend()
legend.set_bbox_to_anchor((1, 0.9))

plt.show()
```

**3. Jak odczytywać różne typy geometrii danych?**

```python
path_to_files = "../dane/"

vulcans = geojson_v
rivers = gpd.read_file(path_to_files+"hr1.geojson")
demography = gpd.read_file(path_to_files+"lsp1.geojson")

print(vulcans.geom_type.unique()) # Co się stanie jeśli pominiemy .unique() ?
print(rivers.geom_type.unique())
print(demography.geom_type.unique())
# Czym różni się MultiPoint / MultiLineString / MultiPolygon od Point / LineString / Polygon ?

# Dla Demography, policzmy które kraje w zbiorze składają się z największej ilości poligonów:
demography["liczba_poligonow"] = demography.geometry.apply(lambda geom: len(geom.geoms))

ranking = (
    demography[["nazwa", "liczba_poligonow"]]
    .sort_values("liczba_poligonow", ascending=False)
)

print(ranking[:10])

# Czy 1 miejsce w rankingu rzeczywiście ma aż tyle elementów składowych? Potwierdzmy to sobie wizualnie:

print(ranking.iloc[0])

subGdf = demography.loc[[ranking.iloc[0].name]]
subGdf.plot()
```

**4. Jak filtrować dane?**


**5. Problemy do samodzielnego rozwiązania:**


**6. Rozbudowa VectorTools:**

