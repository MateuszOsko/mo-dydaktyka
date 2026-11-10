---
layout: default
title: Wstęp - RasterTools
course_id: algorithms
order: 1
---

## Wstęp

**1. Stworzenie RasterTools:**

Nie będziemy tworzyć RasterTools od zera - wykorzystamy już istniejący projekt VectorTools. Możemy albo połączyć to w jedno narzędzie (i np. przemianować je na GeoTools) albo skopiować cały kod źródłowy i zbudować analogiczny drugi program.


Jeśli zdecydujemy się skopiować kod, to w wersji RasterTools usunąć musimy wszystkie operacje dla wektora (może poza zamknięciem programu) i zacząć pisać nowe własne. Jeśli chcemy zaś utrzymać 1 program, będziemy musieli do wybranych istniejących operacji (np wczytania plików) dodać rozpoznawanie formatu na podstawie którego zdecydujemy czy chcemy wykorzystać funkcje związane z biblioteką geopandas czy rasterio. Wybór zostawiam wam.


Niezależnie od tego, powstała aplikacja powinna mieć funkcje:
- Wczytania rastra (może być na razie w ograniczeniu do tylko 1 kanału na raz)
- Zapisu rastra (z zapamiętanym profile z wczytanego rastra)
- Wyświetlenia podstawowych informacji i metadanych o rastrze
- Wyświetlania rastra (proste - bez normalizacji czy modyfikacji)
