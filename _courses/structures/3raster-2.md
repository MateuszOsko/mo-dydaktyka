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
</ul>


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

. . .


**3. Na czym polega i jak wykonać transformacje rastra?**

. . .


**4. Jak wczytywać niegeograficzne dane obrazowe i dokonywać ich georeferencji?**

. . .


**5. Problemy do samodzielnego rozwiązania:**

. . .


**6. Rozbudowa RasterTools:**

. . .
