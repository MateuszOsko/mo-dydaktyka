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

Filtrowanie danych w GeoPandas może mieć charakter przestrzenny jak i nieprzestrzenny. Na ten moment skupmy się na nieprzestrzennym - analogicznie jak w zwykłym Pandas, używając warunków przeszukajmy dane odpowiadając na zadane pytania:

```python
# Wyfiltrujmy tylko te wulkany, których nazwa zaczyna się od litery "E" a następnie obliczmy jaki jest to % wszystkich wulkanów

vulcans_E = vulcans[ vulcans["nazwa"].str.startswith("E") ] # Co zwraca samo vulcans["nazwa"].str.startswith("E") ?
print(vulcans_E.head())

vulcans_count = len(vulcans)
vulcans_E_count = len(vulcans_E)
result = ( vulcans_E_count * 100 ) / vulcans_count

print(f"Wulkanów na literę 'E' jest w zbiorze {vulcans_E_count}. Stanowi to ~{result:.2f}% wszystkich wulkanów.")

# Wyfiltrujmy tylko te rzeki, których długość wynosi ponad 4000 km. Wykorzystajmy do tego zawarte pole w danych "długość", a nie liczoną długość geometrii

print(rivers.długość.head()) # Jaka jest różnica między rivers.długość a dotychczas używanym zapisie rivers["długość"] ?

# Standaryzacja danych:
print(rivers["długość"].isna().sum()) # Czy mamy puste wartości?
rivers["długość_stand"] = rivers["długość"]
rivers["długość_stand"] = rivers["długość_stand"].fillna(0)

rivers["długość_stand"] = (
    rivers["długość_stand"].astype(str)
    .str.replace("km", "", regex=False)
    .str.replace(r"\s+", "", regex=True)
) # Usunięcie białych znaków czy jednostki "km"

rivers["długość_stand"] = rivers["długość_stand"].astype(int)

# Warunek na długość ponad 4000 km:
rivers4000 = rivers[rivers["długość_stand"] > 4000]
rivers4000_count = len(rivers4000)
rivers4000_names_as_text = ", ".join(rivers4000.sort_values("długość_stand", ascending=False)["nazwa"])

# Warto zwrócić uwagę na to jak w GeoPandas / Pandas unikamy klasycznych pętli, zamiast tego wykorzystując pracę bezpośrednio na strukturze danych
# Takie podejście często określamy jako wektoryzację: zamiast ręcznie przetwarzać każdy element, wykonujemy operację na całej serii lub kolumnie
# Przykład z wykorzystaniem pętli:
rivers4000_names2 = []
for river in rivers4000.sort_values("długość_stand", ascending=False)["nazwa"]:
    rivers4000_names2.append(river)
rivers4000_names_as_text = ", ".join(rivers4000_names2)
# Pętle nie są oczywiście złe same w sobie - ale znacznie komplikują zapis, a często nawet zmniejszają wydajnosć operacji.
# Jesli to możliwe - starajmy się ich unikać pracując z GeoDataFrame

print(f"Ilość rzek o zadeklarowanej długości ponad 4000 km w zbiorze: {rivers4000_count}. Są to: {rivers4000_names_as_text}")
```

**5. Problemy do samodzielnego rozwiązania:**

<ol type="a">
  <li>Dla warstwy z rzekami policz ile jest obiektów których MultiLineString zawiera dokładnie między 2 a 10 części składowych geometrii</li>
  <li>Dla warstwy demograficznej wyświetl na mapie kraje, w których odsetek osób w wieku 65+ wynosi ponad 18%</li>
  <li>Dla warstwy z wulkanami stwórz podzbiór wulkanów znajdujących się w Stanach Zjednoczonych. Następnie wypisz wszystkie typy wulkanów występujące w tym podzbiorze oraz oblicz, jaki procent wszystkich wulkanów w USA stanowi każdy z typów</li>
</ol>

**6. Rozbudowa VectorTools:**

