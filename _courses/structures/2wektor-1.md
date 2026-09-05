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

* [Dane punktowe o wulkanach na świecie]( {{ '/dane/wulkany.zip' | relative_url }} )

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
