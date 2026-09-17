---
layout: default
title: Raster - Podstawy
course_id: structures
order: 9
---

## Raster - podstawy

**Dane do ćwiczeń**

. . .


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
