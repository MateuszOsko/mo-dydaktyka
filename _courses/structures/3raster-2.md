---
layout: default
title: Raster - Przetwarzanie
course_id: structures
order: 10
---

## Raster - przetwarzanie


**Dane do ćwiczeń**

<ul>
    <li>
        <a href="{{ '/dane/raster/DEM_kotlina_klodzka.tif' | relative_url }}" download>
            DEM obszaru Kotliny Kłodzkiej
        </a>
    </li>
    <li>
        <a href="{{ '/dane/raster/praga.png' | relative_url }}" download>
            Zrzut ekranu fragmentu mapy obejmującego centrum Pragi
        </a>
    </li>
</ul>

<small>*Źródło danych: https://www.quickmaptools.com/download-satellite-imagery + https://mapgridder.com/map + opracowanie własne*</small>


**0. Rozgrzewka przed tematem**

Pobierz załączony do bloku plik DEM. Następnie wyświetl go za pomocą rasterio i matplotlib, używając kolorów (cmap) które wyraźnie będą obrazowały różnice wysokości, na pierwszy rzut oka pozwalając określić gdzie znajdują się góry, a gdzie sama kotlina oraz niżej położone tereny.

Rozwiązanie problemu znajduje się potem w punkcie 1, zachęcam jednak najpierw do samodzielnego zmierzenia się z zadaniem, bez czytania podpowiedzi.


**1. Jak zbadać i rozwiązać problem z poprzedniego ćwiczenia?**

```python
import rasterio
import numpy as np
import matplotlib.pyplot as plt

# Załadowanie i wstępna inspekcja pliku:
path_to_files = "../dane/raster/"
with rasterio.open(path_to_files+"DEM_kotlina_klodzka.tif") as src:
    dem0 = src.read()

print(dem0.shape)

dem_to_plot = np.moveaxis(dem0, 0, -1)
plt.imshow(dem_to_plot, cmap="terrain")
plt.colorbar()
plt.show()

# Wersja z Masked=True:

with rasterio.open(path_to_files+"DEM_kotlina_klodzka.tif") as src:
    dem = src.read(masked=True)

dem_to_plot = np.moveaxis(dem, 0, -1)
plt.imshow(dem_to_plot, cmap="terrain")
plt.colorbar()
plt.show()

# Co zmienia maskowanie?

print(dem0.min())
print(dem0.max())
print(dem.min())
print(dem.max())

with rasterio.open(path_to_files+"DEM_kotlina_klodzka.tif") as src:
    print(src.nodata)
    print(np.sum(dem0 == src.nodata))

    rows, cols = np.where(dem0[0] == src.nodata)
    for row, col in zip(rows, cols):
        print(row, col)

print(dem.mask.sum())

# Maskowanie jest też możliwe już po otwarciu pliku:
dem1 = np.ma.masked_equal(dem0, -9999)
print(dem1.mask.sum())
```


**2. Jak próbkować i modyfikować wartości rastrów?**

Próbkowanie:

```python
# Najprostszy sposób próbkowania rastra to po prostu:
print(dem[0][100, 200]) # Co oznacza tu 0, a co 100 i 200?
print(dem[0][100:105, 200:205])

# Przypomnienie, że możemy też poza wartościami odczytywać współrzędne:
with rasterio.open(path_to_files+"DEM_kotlina_klodzka.tif") as src:
    print(src.xy(100, 200))

# Jeśli zamiast indeksów chcemy wyjść od współrzędnych by odczytać wartości rastra, możemy to zrobić poprzez:
with rasterio.open(path_to_files+"DEM_kotlina_klodzka.tif") as src:
    points = [(16.85, 50.45), (16.85, 50.55)]
    print(list(src.sample(points)))

    # Albo w nieco bardziej elegancki sposób wyświetlania:
    values = list(src.sample(points))
    for point, value in zip(points, values): #iterowanie po 2 listach
        print(point, ' -> ', value[0])
```

Modyfikowanie:

```python
# Wartości rastra możemy nadpisywać bezpośrednio - punktowo lub w przedziale:
dem[0][100, 200] = 300
print(dem[0][100, 200])

dem[0][100:110, 200:210] = 300

# Możemy też wykorzystywać warunki:
dem[0][dem[0] > 300] = 300 # Zwrócmy uwagę na brak konieczności pisania pętli

# Lub w bardziej eleganckiej formie:
dem_modified = np.where(dem[0] > 300, 300, dem[0]) # Co oznacza ten zapis?
```

**3. Na czym polega i jak wykonać transformacje rastra?**

Geotransformaty. Modyfikacja wielkości siatki.

```python
# Geotransformaty:
with rasterio.open(path_to_files+"DEM_kotlina_klodzka.tif") as src:
    transform = src.transform

    print(transform.a)
    print(transform.b)
    print(transform.c)
    print(transform.d)
    print(transform.e)
    print(transform.f)
    # Co oznacza każdy z nich?

# Zmiana rozdzielczości rastra - 40-krotne zmniejszenie ilości pikseli w kolumnach oraz wierszach:

from rasterio.enums import Resampling
from rasterio.plot import plotting_extent

with rasterio.open(path_to_files+"DEM_kotlina_klodzka.tif") as src:
    dem = src.read(1, masked=True)

    # Zmniejszenie liczby pikseli 40 razy w każdym wymiarze
    new_width = src.width // 40
    new_height = src.height // 40

    # Nowa geotransformacja
    new_transform = src.transform * src.transform.scale(
        src.width / new_width,
        src.height / new_height
    )

    # Przeskalowanie wartości rastra
    dem_resampled = src.read(
        out_shape=(src.count, new_height, new_width),
        resampling=Resampling.bilinear
    )[0]

# Zasięgi przestrzenne
original_extent = plotting_extent(
    dem,
    transform=src.transform
)

new_extent = plotting_extent(
    dem_resampled,
    transform=new_transform
)

# Zobrazowanie
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

axes[0].imshow(
    dem,
    extent=original_extent,
    cmap="terrain"
)
axes[0].set_title(
    f"Oryginał: {src.width} × {src.height}"
)

axes[1].imshow(
    dem_resampled,
    extent=new_extent,
    cmap="terrain"
)
axes[1].set_title(
    f"Po zmniejszeniu: {new_width} × {new_height}"
)

plt.show()

# Do tego przykładu użyty został algorytm Resampling.bilinear . Jak zmiana tego wyboru wpłynęłaby na wyniki?
```

Pełna reprojekcja:

```python
from rasterio.warp import calculate_default_transform, reproject

with rasterio.open(path_to_files+"DEM_kotlina_klodzka.tif") as src:

    new_crs = "EPSG:2180"

    new_transform, new_width, new_height = calculate_default_transform(
        src.crs,
        new_crs,
        src.width,
        src.height,
        *src.bounds
    )

    dem_reprojected = np.empty((new_height, new_width), dtype=src.dtypes[0])

    reproject(
        source=src.read(1, masked=True),
        destination=dem_reprojected,
        src_transform=src.transform,
        src_crs=src.crs,
        dst_transform=new_transform,
        dst_crs=new_crs,
        resampling=Resampling.bilinear
    )
    # Co oznacza każdy z wypisanych tu parametrów reproject()?

plt.imshow(dem_reprojected, cmap="terrain")
plt.show()
```


**4. Jak wczytywać niegeograficzne dane obrazowe i dokonywać ich georeferencji?**

W tym przykładzie wczytamy i zgeoreferencjujemy przykład zrzutu ekranu z mapy, zapisanego w formie zwykłego pliku .png .
Dane są współrzędne granic obrazu:
Szerokość geo.: 50°00'N - 50°10'N
Długość geo.: 14°20'E - 14°30'E

```python
from PIL import Image
from rasterio.transform import from_bounds

# Na początek załadujmy nasz .png i zobaczmy jak wygląda.

image = np.array(Image.open(path_to_files+"praga.png"))
print(image.shape) # Czego się z tego dowiadujemy?

plt.imshow(image)
plt.show()

# Teraz zmieńmy go w pełnoprawne dane GIS:
with rasterio.open(path_to_files+"praga.png") as src:
    image = src.read()

    # Zachowujemy tylko kanały RGB
    image = image[:3]

    height = src.height
    width = src.width

    left = 14 + 20/60
    bottom = 50
    right = 14 + 30/60
    top = 50 + 10/60

    transform = from_bounds(
        left,
        bottom,
        right,
        top,
        width,
        height
    )

    print(transform.a)
    print(transform.b)
    print(transform.c)
    print(transform.d)
    print(transform.e)
    print(transform.f)

with rasterio.open(
    "praga_georef.tif",
    "w",
    driver="GTiff",
    height=height,
    width=width,
    count=3,
    dtype=image.dtype,
    crs="EPSG:4326",
    transform=transform
) as dst:
    dst.write(image)
```

Następnie powstały raster wrzucić można do QGIS i sprawdzić czy georeferencja pasuje do podkładu mapowego.


**5. Problemy do samodzielnego rozwiązania:**

<ol type="a">
  <li>Przygotuj 4 zestawy próbek z DEM Kotliny Kłodzkiej: 3 losowe próbki, 30, 300 i 3000. Następnie dla każdego zbioru oblicz średnią wysokość. Porównaj ją ze średnią wysokością całego zbioru. </li>
  <li>Znajdz najwyższy punkt obszaru a następnie podaj jego współrzędne geograficzne (x,y).</li>
  <li>Podaj granice najmniejszego możliwego prostokąta który obejmuje wszystkie wartości powyżej 1000 m n.p.m. wewnątrz obszaru. Granice niech będą wyrażone w indeksie wierszy i kolumn oraz we współrzędnych geograficznych.</li>
  <li>Wykorzystując narzędzie nałożenia siatki na https://mapgridder.com/map zrób zrzut ekranu dowolnego obszaru na ziemi a następnie dokonaj jego georeferencji i wyświetl w QGIS.</li>
</ol>


**6. Rozbudowa RasterTools:**

Do RasterTools dodajmy tym razem tylko 1 nowy obowiązkowy element:
* Nową operację umożliwiającą reprojekcję po wpisaniu EPSG układu współrzędnych
