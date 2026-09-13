---
layout: default
title: Wektor - Łączenie danych
course_id: structures
order: 8
---

## Wektor - łączenie danych


**Dane do ćwiczeń**


<ul>
    <li>
        <a href="{{ '/dane/hj1.geojson' | relative_url }}" download>
            Dane o kontynentach
        </a>
    </li>
    <li>
        <a href="{{ '/dane/pg3.geojson' | relative_url }}" download>
            Dane o jeziorach na świecie
        </a>
    </li>
</ul>

<small>*Źródło danych: https://mapplab.pl + opracowanie własne*</small>


**1. W jaki sposób możemy testować relacje przestrzenne między geometriami?**

Testowanie geometrii zaczniemy na przykładzie relacji contains(). 
Odpowiedzmy sobie na pytania: jakie jeziora znajdują się w całości Europie? Ile jest ich w zbiorze?

```python
import geopandas as gpd
import matplotlib.pyplot as plt

path_to_files = "../dane/"

lakes = gpd.read_file(path_to_files+"hj1.geojson")

continents = gpd.read_file(path_to_files+"pg3.geojson")
europe = continents[continents["nazwa"] == "Europa"]
print(europe)

# Przykład dla jednego jeziora - porównanie 1 geometrii do 1 geometrii:
print(lakes.iloc[0]["nazwa"])

is_first_lake_in_europe = europe.geometry.contains(lakes.geometry.iloc[0], align=False)
# Za co odpowiada argument align ?
print(is_first_lake_in_europe)


# Sprawdźmy teraz podobny warunek dla wszystkich jezior:
is_lake_in_europe = lakes.geometry.apply(
    lambda lake: europe.iloc[0].geometry.contains(lake)
)
print(is_lake_in_europe)
lakes_in_europe = lakes[is_lake_in_europe]
print(len(lakes_in_europe))
lakes_in_europe.plot()
plt.show() # Ponieważ plot() nie jest na końcu, dodajmy plt.show() dla zachowania kolejności

# Możemy też zapisać ten sam test za pomocą within() zamiast contains():
is_lake_in_europe2 = lakes.geometry.within(
    europe.iloc[0].geometry
)
lakes_in_europe2 = lakes[is_lake_in_europe2]
print(len(lakes_in_europe2))
# Jaka jest różnica pomiędzy contains() a within() ?
```

**Zadanie dodatkowe:**
* Dla podanych warstw sprawdź implementację metod:
  * intersects
  * touches
  * disjoint
  * equals
  * overlaps
  * crosses
* Czym charakteryzują się te relacje? Czy w zbiorze znajdują się geometrie dla których dana relacja zachodzi? Czy wszystkie mają sens dla tych 2 zbiorów?


**2. W jaki sposób możemy wykonywać operacje na wielu warstwach?**

Do wykonywania operacji przestrzennych na wielu warstwach służy funkcja overlay(), przyjmująca rodzaj operacji jako parametr.

```python
# Poniżej przykłady dla intersection, difference, union, symmetric difference
# Czym różnią się te operacje, co oznaczają ich wyniki?
africa = continents[continents["nazwa"] == "Afryka"]

# Intersection
lakes_in_africa = gpd.overlay(
    lakes,
    africa,
    how="intersection"
)

print(len(lakes_in_africa))
lakes_in_africa.plot()
plt.show()


# Difference
lakes_outside_africa = gpd.overlay(
    lakes,
    africa,
    how="difference"
)

print(len(lakes_outside_africa))
lakes_outside_africa.plot()
plt.show()


# Union
lakes_and_africa = gpd.overlay(
    lakes,
    africa,
    how="union"
)

print(len(lakes_and_africa))
lakes_and_africa.plot()
plt.show()


# Symmetric difference
lakes_or_africa = gpd.overlay(
    lakes,
    africa,
    how="symmetric_difference"
)

print(len(lakes_or_africa))
lakes_or_africa.plot()
plt.show()
```

Innym rodzajem przydatnej operacji jest przepisanie atrybutów po lokalizacji, wykonywane poprzez sjoin() (spatial join). Poniżej stworzenie i uzupełnienie kolumny "Kontynent" na podstawie danych.

```python
# Połączenie atrybutów dwóch warstw w jedno po warunku przestrzennym:
lakes_with_continent = gpd.sjoin(
    lakes,
    continents,
    predicate="within"
)
print(lakes_with_continent.head())

# Wersja z dodaniem tylko 1 kolumny do oryginalnych danych:
lakes["kontynent"] = gpd.sjoin(
    lakes,
    continents,
    predicate="within"
)["nazwa_right"] # Warto zwrócić uwagę na dodane '_right' do kolumny

print(lakes.head())
```


**3. W jaki sposób możemy łączyć wiele warstw w jedną?**


**4. Problemy do samodzielnego rozwiązania:**


**5. Rozbudowa VectorTools:**
