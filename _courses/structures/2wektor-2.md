---
layout: default
title: Wektor - Struktura
course_id: structures
order: 6
---

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

Podzieleni na grupy otrzymacie po 1 formacie danych wektorowych do opracownia. Korzystając z wykładów, własnej wiedzy, z innych zajęć, internetu czy AI znajdzcie informacje o sposobie w jaki dany format przechowuje informacje. Znajdzcie przykładowy plik tego formatu i jeśli to możliwe otwórzcie go w różnych edytorach. Czy Wasz VectorTools da radę go otworzyć? Jak wygląda po otworzeniu w VSC/Notatniku?

Zwróćcie uwagę na następujące zagadnienia:
- Czy dane zapisane są w postaci binarnej czy tekstowej?
- Czym się charakteryzuje dana struktura?
- Czy można w ramach jednego pliku zapisać wiele warstw?
- Do jakich zastosowań dobrze się nadaje?
- Czy pliki dużo ważą? Czy następuje kompresja danych?
- Jeśli da się to określić - w jaki sposób przechowywana jest geometria? W jaki sposób atrybuty?

Przygotowane krótkie omówienia będziemy prezentować na zajęciach.

**2. Jak zapisywać załadowane dane do różnych formatów?**

Zapis do pliku odbywa się analogicznie do odczytu - więszkośc formatów wektorowych zapiszemy za pomocą zunifikowanej metody to_file(). Struktura zapisywanych danych jest determinowana przez bibliotekę na podstawie zadeklarowanego rozszerzenia w nazwie pliku.

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
# Przypomienie - typ geometrii każdego rekordu w Gdf zbadać możemy przez:
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


**5. Jak zarządzać wieloma warstwami w jednym obiekcie?**


**6. Czym jest GeometryCollection?**


**7. Problemy do samodzielnego rozwiązania:**


**8. Rozbudowa VectorTools:**

