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

Do naszego programu dodamy 3 nowe funkcjonalności, bazujące na zdobytych umiejętnościach w tej sekcji kursu. Będzie to:
* Wczytywanie warstwy
* Wyświetlanie warstwy
* Odczytywanie informacji o warstwie

Jak zawsze, VectorTools możecie budować zgodnie z waszym pomysłem. Poniżej przedstawiam jedynie propozycję implementacji:

**Wczytanie warstwy:**

Nasza funkcja wczytywania warstwy powinna pytać użytkownika o podanie ścieżki do pliku, a następnie próbować go otworzyć za pomocą GeoPandas.
Jeśli to się uda, załadowany plik powinien zostać zapamiętany i udostępniony pozostałym częściom programu. Jeśli nie – powinniśmy pokazać komunikat o błędzie.

Nowa funkcja (w nowym pliku wewnątrz folderu /menu_operations/ )
```python
import geopandas as gpd
from tkinter import filedialog, messagebox

from src.data_service import set_layer


def load_data_and_remember_outcome():
    layer = load_data()
    set_layer(layer)
    

def load_data():
    path = filedialog.askopenfilename(
        title="Wybierz warstwę"
    )

    if not path:
        return None

    try:
        layer = gpd.read_file(path)
    except Exception:
        messagebox.showwarning(
            "Błąd wczytywania",
            "Nie udało się wczytać wybranego pliku.\n"
            "Upewnij się, że jest to prawidłowy plik GIS."
        )
        return None

    return layer

```

Od razu rzuca się w oczy to, że load_data opakowana jest w load_data_and_remember_outcome. Jest to funkcja z nowe pliku, data_service:

```python
_layer = None

def set_layer(layer_to_remember):
    global _layer
    _layer = layer_to_remember

def get_layer():
    return _layer
```

Który zapisuje nam warstwę w pamięci i pozwala potem na jej odpytywanie przez inne fragmenty naszego programu, za pomocą prostej struktury GET+SET.

To właśnie load_data_and_remember_outcome() będzie odpytywana przez odświeżone app.py:

```python
from src.create_window import create_window
from src.create_menu_option import create_menu_option
from src.menu_operations.close_program import close_program
from src.menu_operations.load_data import load_data_and_remember_outcome
from src.data_service import get_layer

def update_menu():
    canvas.delete("layer_status")

    if get_layer() is not None:
        canvas.create_text(
            180,
            380,
            text="PLIK ZAŁADOWANY PRAWIDŁOWO",
            fill="green",
            tags="layer_status"
        )

window, canvas = create_window()

create_menu_option(canvas, 465, "Wczytaj warstwę", lambda: load_data_and_remember_outcome(), lambda: update_menu())
create_menu_option(canvas, 500, "Zamknij program", lambda: close_program(window))

window.mainloop()
```

Zauważmy że teraz przycisięnicie napisu "Wczytaj warstwę" wywołuje nie 1, a 2 funkcje. Pierwsza to wczytanie warstwy, druga - update widoku menu. Jeśli warstwa prawidłowo została załadowana, dodajemy zielony tekst PLIK ZAŁADOWANY PRAWIDŁOWO.

Wymaga to od nas jeszcze jeden drobnej zmiany. W create_menu_options.py , zmieniamy deklarację argumentów na:
```python
def create_menu_option(
    canvas: tk.Canvas,
    height: int,
    text: str,
    *operations: Callable
```
A poniżej zamiast operation():
```python
    canvas.tag_bind(
        text_id,
        "<Button-1>",
        lambda event: [operation() for operation in operations]
    )
```

Po tych zmianach mamy już prawidłowo zbudowany program pozwalający wczytywać dane wektorowe.

**Dodanie wyświetlania warstwy oraz informacji o niej**

Dodajemy 2 nowe operacje:

Show layer:
```python
import matplotlib.pyplot as plt

from src.data_service import get_layer


def show_layer():
    layer = get_layer()

    if layer is None:
        return

    layer.plot()
    plt.show()
```

Show layer info:
```python
from tkinter import messagebox

from src.data_service import get_layer

def show_layer_info():
    layer = get_layer()

    if layer is None:
        return

    info = (
        f"Liczba obiektów: {len(layer)}\n"
        f"Liczba kolumn: {len(layer.columns)}\n"
        f"Typ geometrii: {', '.join(layer.geom_type.unique())}\n"
        f"Układ współrzędnych: {layer.crs}"
    )

    messagebox.showinfo(
        "Informacje o warstwie",
        info
    )

```

Oraz deklarujemy je w app.py:

```python
create_menu_option(canvas, 400, "Wyświetl warstwę", lambda: show_layer())
create_menu_option(canvas, 435, "Wyświetl informacje o warstwie", lambda: show_layer_info())

```

Przy okazji w przypadku aplikacji pokazowej konieczne okazała się ręczna zmiana wysokości elementów, by mieściły się one w okne - takie rzeczy w przyszłości nasz program powinien móc obliczać samemu, ale na razie zostawmy to w ten sposób.

Jedyną dodatkową zmianą jaką należało by zrobić jest przeniesienie metody update_menu() do osobnego pliku,
update_menu.py:

```python
from src.data_service import get_layer

def update_menu(canvas):
    canvas.delete("layer_status")

    if get_layer() is not None:
        canvas.create_text(
            180,
            280,
            text="PLIK ZAŁADOWANY PRAWIDŁOWO",
            fill="green",
            tags="layer_status"
        )
```

A nasz app.py ponownie odchudzamy do:

```python
from src.create_window import create_window
from src.create_menu_option import create_menu_option
from src.update_menu import update_menu
from src.menu_operations.close_program import close_program
from src.menu_operations.load_data import load_data_and_remember_outcome
from src.menu_operations.show_layer import show_layer
from src.menu_operations.show_layer_info import show_layer_info


window, canvas = create_window()

create_menu_option(canvas, 365, "Wczytaj warstwę", lambda: load_data_and_remember_outcome(), lambda: update_menu(canvas))
create_menu_option(canvas, 400, "Wyświetl warstwę", lambda: show_layer())
create_menu_option(canvas, 435, "Wyświetl informacje o warstwie", lambda: show_layer_info())
create_menu_option(canvas, 470, "Zamknij program", lambda: close_program(window))

window.mainloop()
```

Na tym etapie wszystkie operacje są dostępne niezależnie od tego czy warstwa została wczytana. Funkcje są zabezpieczone i sprawdzają czy warstwa istnieje, zanim spróbują na niej operować, jest to jednak pewna niedoskonałość.
W przyszłości możemy wykorzystać przechowywany stan aplikacji do dynamicznego budowania menu.
