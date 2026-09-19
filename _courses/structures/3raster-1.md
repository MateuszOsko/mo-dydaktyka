---
layout: default
title: Raster - Podstawy
course_id: structures
order: 9
---

## Raster - podstawy

**Dane do ćwiczeń**

<ul>
    <li>
        <a href="{{ '/dane/raster/tucholski_fragment.tif' | relative_url }}" download>
            Zobrazowanie RGB fragmentu lasów w okolicach Tucholi
        </a>
    </li>
    <li>
        <a href="{{ '/dane/raster/wybrzeze.zip' | relative_url }}" download>
            Zobrazowanie wielokanałowe (Sentinel-2) fragmentu polskiego wybrzeża
        </a>
    </li>
</ul>

<small>*Źródło danych: https://www.quickmaptools.com/download-satellite-imagery + opracowanie własne*</small>


**1. Jak odczytywać i wyświetlać dane rastrowe pochodzące z 1 pliku?**

```python
import rasterio
import numpy as np
import matplotlib.pyplot as plt

# Odczyt rastra:
path_to_files = "../dane/raster/"
with rasterio.open(path_to_files+"tucholski_fragment.tif") as src:
    raster = src.read()
print(raster) # Co jest wynikiem print?
print(raster.shape) # Jak interpretować te dane?

# Wyświetlanie rastra:
rgb = np.moveaxis(raster[0:3], 0, -1)
plt.imshow(rgb)
plt.show()

# Czym będzie się różnić poniższy obraz od poprzedniego?
plt.imshow(raster[0], cmap="Reds")
plt.colorbar()
plt.axis("off")
plt.show()
```


**2. Jak odczytywać i wyświetlać dane rastrowe z wielu plików z kanałami?**

```python
path2 = path_to_files+"sentinel-2-l2a_2026-06-26_S2C_MSIL2A_20260626T101021_R022_T33UXA_20260626T152309/sentinel-2-l2a_2026-06-26_S2C_MSIL2A_20260626T101021_R022_T33UXA_20260626T152309_"

with rasterio.open(path2 + "B04.tif") as src:
    red = src.read(1)

with rasterio.open(path2 + "B03.tif") as src:
    green = src.read(1)

with rasterio.open(path2 + "B02.tif") as src:
    blue = src.read(1)


rgb_stacked = np.stack([red, green, blue])
print(rgb_stacked) # Połączone kanały z 3 plików

raster_rgb = np.moveaxis(rgb_stacked, 0, -1)

plt.imshow(raster_rgb)
plt.axis("off")
plt.show()
# Dlaczego nie widzimy obrazu?

# Normalizacja danych #1:
raster_rgb1 = raster_rgb / raster_rgb.max() * 255
raster_rgb1 = raster_rgb1.astype(np.uint8)

plt.imshow(raster_rgb1) # Wartości 0-255
plt.axis("off")
plt.show()

# Normalizacja danych #2:
raster_rgb2 = raster_rgb.astype(float).copy()
for i in range(3):
    low = np.percentile(raster_rgb2[:, :, i], 2)
    high = np.percentile(raster_rgb2[:, :, i], 98)

    raster_rgb2[:, :, i] = np.clip(
        (raster_rgb2[:, :, i] - low) / (high - low),
        0,
        1
    )

plt.imshow(raster_rgb2) # Wartości 0.0 - 1.0
plt.axis("off")
plt.show()
# Jakie obrazy wyszłyby gdybyśmy zmienili zakres normalizacji #2 z 2-98 na inne percentyle?
```


**3. Jak przeprowadzać inspekcje rastra oraz wyciągać podstawowe statystyki?**

```python
# Wykorzystując pobrane do numpy dane, możemy określić wiele statystyk:

print(raster_rgb2.shape) # To już robiliśmy wyżej

print(raster_rgb2.dtype)
print(raster_rgb2.min()) 
print(raster_rgb2.max())

# Średnia wartość:
print(raster_rgb2.mean()) 
print(raster_rgb2[:, :, 0].mean())
print(raster_rgb2[:, :, 1].mean())
print(raster_rgb2[:, :, 2].mean())
# Czym się różnią powyższe średnie?

# Analogicznie można badać np. medianę czy odchylenie standardowe:
print(np.median(raster_rgb2))
print(np.std(raster_rgb2))
# Jak różniłyby się rozkłady per poszczególny kanał?

# Przykładowy histogram:
plt.hist(raster_rgb2[:, :, 0].flatten(), bins=50)
plt.title("Histogram kanału czerwonego")
plt.show()

# Przykładowy histogram przed normalizacją:
plt.hist(raster_rgb[:, :, 0].flatten(), bins=50)
plt.title("Histogram kanału czerwonego")
plt.show()
# Dlaczego normalizacja aż tak zmienia wyniki histogramu? Jak wyglądałoby to dla innych kanałów?
```


**4. Jak badać przestrzenne właściwości rastra?**

```python
# Wysokość czy szerokość rastra wyciągnąć możemy ze znanego już nam raster_rgb2.shape
# Niektóre informacje można jednak pobrać tylko bezpośrednio z pliku, a nie z numpy array. Dlaczego?
with rasterio.open(path2 + "B04.tif") as src:
    print(src.nodata)
    print(src.crs)
    print(src.bounds)
    print(src.res)
    print(src.transform)
    # Jak rozumieć powyższe wartości?

    # Wykorzystując dostęp do plików możemy też przepytywać dane pod względem współrzędnych:
    print(src.xy(100, 100))
    print(src.index(658000, 6074300))
```


**5. Jak zapisywać dane rastrowe do pliku?**

```python
rgb_to_save = np.moveaxis(raster_rgb2, -1, 0)

# Wersja zapisu #1:
with rasterio.open(
    "rgb_output1.tif",
    "w",
    driver="GTiff",
    height=rgb_to_save.shape[1],
    width=rgb_to_save.shape[2],
    count=3,
    dtype=rgb_to_save.dtype
) as dst:
    dst.write(rgb_to_save)

# Wersja zapisu #2:
with rasterio.open(path2 + "B04.tif") as src:
    profile = src.profile
    print(profile)

    profile.update(
        count=3,
        dtype=rgb_to_save.dtype
    )

with rasterio.open(
    "rgb_output2.tif",
    "w",
    **profile # Rozpakowanie słownika
) as dst:
    dst.write(rgb_to_save)

# Czym różnią się obie wersje? Czy wynikowy plik będzie identyczny?
```


**6. Problemy do samodzielnego rozwiązania:**

. . .


**7. Stworzenie RasterTools:**

. . .
