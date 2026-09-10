---
layout: default
title: Wektor - Struktura
course_id: structures
order: 6
---

## Wektor - struktura


**Dane do ćwiczeń**

<ul>
    <li>
        <a href="{{ '/dane/pl_miasta_wojewódzkie.geojson' | relative_url }}" download>
            Dane o miastach wojewódzkich w Polsce
        </a>
    </li>
    <li>
        <a href="{{ '/dane/pl_rzeki.geojson' | relative_url }}" download>
            Dane o rzekach w Polsce
        </a>
    </li>
    <li>
        <a href="{{ '/dane/pl_pasy_ukształtowania.geojson' | relative_url }}" download>
            Dane o pasach ukształtowania w Polsce
        </a>
    </li>
</ul>

<small>*Źródło danych: https://mapplab.pl + opracowanie własne*</small>


**1. Rozgrzewka przed tematem**

Podzieleni na grupy otrzymacie po 1 formacie danych wektorowych do opracownia. Korzystając z wykładów, własnej wiedzy, z innych zajęć, internetu czy AI znajdźcie informacje o sposobie w jaki dany format przechowuje informacje. Znajdźcie przykładowy plik tego formatu i jeśli to możliwe otwórzcie go w różnych edytorach. Czy Wasz VectorTools da radę go otworzyć? Jak wygląda po otworzeniu w VSC/Notatniku?

Zwróćcie uwagę na następujące zagadnienia:
- Czy dane zapisane są w postaci binarnej czy tekstowej?
- Czym się charakteryzuje dana struktura?
- Czy można w ramach jednego pliku zapisać wiele warstw?
- Do jakich zastosowań dobrze się nadaje?
- Czy pliki dużo ważą? Czy następuje kompresja danych?
- Jeśli da się to określić - w jaki sposób przechowywana jest geometria? W jaki sposób atrybuty?

Przygotowane krótkie omówienia będziemy prezentować na zajęciach.

**2. Jak zapisywać załadowane dane do różnych formatów?**

Zapis do pliku odbywa się analogicznie do odczytu - większość formatów wektorowych zapiszemy za pomocą zunifikowanej metody to_file(). Struktura zapisywanych danych jest determinowana przez bibliotekę na podstawie zadeklarowanego rozszerzenia w nazwie pliku.

```python
import geopandas as gpd

path_to_files = "../dane/"
cities = gpd.read_file(path_to_files+"pl_miasta_wojewódzkie.geojson")

# Zapis do pliku, np jako .gpkg:
cities.to_file("dane.gpkg")

# Możemy też zamiast w formacie danych przestrzennych dane zapisać do CSV:
cities.to_csv("dane.csv", 
    index=False, 
    sep=";",
    decimal=",",
    encoding="utf-8")
cities.to_csv("dane.txt", index=False) # Mimo zmiany rozszerzenia na .txt używając metody to_csv() gwarantujemy strukturę tabelaryczną

# Czy odpalając dwa razy ten sam zapis plik się nadpisze, powstanie kopia czy program wyrzuci błąd?
```


**3. Jak odczytywać informacje z geometrii?**

```python
# Przypomnienie - typ geometrii każdego rekordu w Gdf zbadać możemy przez:
print(cities.iloc[0].geometry.geom_type)

# Dla punktów sprawdzić możemy np:
print(cities.iloc[0].geometry)
print(cities.iloc[0].geometry.x) # Bezpośrednio x
print(cities.iloc[0].geometry.y) # Bezpośrednio y

# Możemy też te wartości przypisać do kolumny:
cities["x"] = cities.geometry.x
cities["y"] = cities.geometry.y
print(cities.head())
```

Dla danych liniowych i poligonowych analogicznie możemy odczytywać ich statystyki:

```python
rivers = gpd.read_file(path_to_files+"pl_rzeki.geojson")
zones = gpd.read_file(path_to_files+"pl_pasy_ukształtowania.geojson")

print(rivers.iloc[0].geometry.length) # W jakiej jednostce jest podana długość?
print(zones.iloc[0].geometry.length) # Co zwraca length dla poligonu?

print(zones.iloc[0].geometry.area) # Powierzchnia
print(zones.iloc[0].geometry.centroid) # Centroid

print(zones.iloc[0].geometry.bounds) # BB
print(zones.iloc[0].geometry.envelope) # Też BB - jaka jest różnica między bounds a envelope?
```
Podane informacje są tylko przykładem możliwości informacji jakie wyciągnąć można bezpośrednio z gdf - warto zaglądać do dokumentacji / szukać opcji znanych z programów GISowych przez AI!


**4. Jak zarządzać układem współrzędnych danych?**


```python
# Wiemy już że układ współrzędnych danych możemy sprawdzić za pomocą:
print(cities.crs)
# Możemy też:
print(cities.crs.name)
print(cities.crs.to_epsg())

# Jeśli dane nie mają przypisanego układu, można zrobić to poprzez:
cities.set_crs("EPSG:4326", inplace=True) # Co robi parametr inplace, dostępny przy wielu metodach gpd? 
print(cities.crs) 
# Dlaczego set_crs nie jest transformacją układu?

# Transformacja:
print(rivers.iloc[0].geometry.length)
rivers2 = rivers.to_crs("EPSG:2180")
print(rivers2.iloc[0].geometry.length)
```


**5. Jak zarządzać wieloma warstwami w jednym pliku?**

```python
# Niektóre struktury danych pozwalają na przechowywanie wielu warstw w jednym pliku. Na początek wymuśmy taki obiekt poprzez stworzenie pliku .gpkg
cities.to_file(
    "polska.gpkg",
    layer="miasta"
)

rivers.to_file(
    "polska.gpkg",
    layer="rzeki"
)

zones.to_file(
    "polska.gpkg",
    layer="pasy_ukształtowania"
)

# Możemy zbadać taki obiekt:
print(gpd.list_layers("polska.gpkg"))

# Jeśli jednak spróbujemy go załadować...
pl = gpd.read_file(
    "polska.gpkg"
) # Co będzie wynikiem takiej operacji?
print(pl.head())

# Możemy bezpośrednio wskazywać na warstwy które chcemy wczytywać:
rivers3 = gpd.read_file(
    "polska.gpkg",
    layer="rzeki"
)
print (rivers3.head())
```


**6. Czym jest GeometryCollection?**

```python
from shapely import GeometryCollection, Point, LineString, Polygon
# Jaka jest relacja shapely do gdf?

geometry = GeometryCollection([
    Point(0, 0),
    LineString([(1, 1), (2, 2)]),
    Polygon([(3, 3), (3, 4), (4, 4), (4, 3)])
])

print(geometry)
print(geometry.geom_type)

# Możemy też zbudować w oparciu o taką geometrię instancję GeoDataFrame:
gdf = gpd.GeoDataFrame(
    geometry=[geometry],
    crs="EPSG:4326"
)
print(gdf)
print(gdf.geom_type)

# Lub:
gdf2 = gpd.GeoDataFrame(
    geometry=list(geometry.geoms),
    crs="EPSG:4326"
)
print(gdf2)
print(gdf2.geom_type)
```


**7. Problemy do samodzielnego rozwiązania:**

<ol type="a">
  <li>Dla warstwy z pasami ukształtowania policz ich powierzchnie w m2, korzystając z układu epsg:2180</li>
  <li>Stwórz obiekt Bounding Box dla warstwy z miastami wojewódzkimi, a następnie oblicz jego obwód</li>
  <li>Dla warstwy z rzekami stwórz nową kolumnę w której wyliczysz liczbę linii (LineString) znajdujących się wewnątrz. Analogicznie stwórz następnie drugą kolumnę w której wyliczysz łączną liczbę punktów składających się na geometrię</li>
</ol>


**8. Rozbudowa VectorTools:**

Tym razem rozbudowę VectorTools zaczniemy od zbudowania mechanizmu zapisu pliku:

```python
from tkinter import filedialog, messagebox

from src.data_service import get_layer


def save_data():
    layer = get_layer()

    if layer is None:
        return

    path = filedialog.asksaveasfilename(
        title="Zapisz warstwę",
        defaultextension=".geojson",
        filetypes=[
            ("GeoJSON", "*.geojson"),
            ("GeoPackage", "*.gpkg"),
            ("Shapefile", "*.shp"),
            ("CSV", "*.csv")
        ]
    )

    if not path:
        return

    try:
        if path.endswith(".csv"):
            layer.to_csv(path, index=False)
        else:
            layer.to_file(path)

        messagebox.showinfo(
            "Zapisano plik",
            "Warstwa została zapisana poprawnie."
        )

    except Exception:
        messagebox.showwarning(
            "Błąd zapisu",
            "Nie udało się zapisać warstwy."
        )

```

I dodaniu wywołania do app.py:

```python
# Importy...
window, canvas = create_window()

create_menu_option(canvas, 365, "Wczytaj warstwę", lambda: load_data_and_remember_outcome(), lambda: update_menu(canvas))
create_menu_option(canvas, 400, "Wyświetl warstwę", lambda: show_layer())
create_menu_option(canvas, 435, "Wyświetl informacje o warstwie", lambda: show_layer_info())
create_menu_option(canvas, 470, "Zapisz warstwę", lambda: save_data())
create_menu_option(canvas, 505, "Zamknij program", lambda: close_program(window))

window.mainloop()
```

Na tym etapie więc nasza apka ma więc następujące opcje:

![](./img/VT_04.png)

A struktura plików w projekcie wygląda w ten sposób:

![](./img/VT_05.png)


Następna paczka ulepszeń do programu będzie już miała charakter **pracy indywidualnej**, bez gotowych fragmentów kodu do przekopiowania.
Chciałbym abyście spróbowali dokonać 2 następujących usprawnień:
* Przy zapisie pliku do CSV ustawili świadomie separator na przecinek oraz kodowanie znaków na UTF-8
  * Wersja dla ambitnych: Niech program zapyta użytkownika o podanie separatora i kodowania wedle uznania!
* Dodali nową funkcję "Zmień układ wsp." i zaimplementowali jego działanie
