---
layout: default
title: Wstęp - Pandas
course_id: structures
order: 3
---

## Wstęp - Pandas

Kolejnym krokiem po utrwaleniu struktury danych dostarczanych przez pakiet Numpy jest przyjrzenie się DataFrame z biblioteki Pandas.
Tak jak poprzednio, na przykładach przejrzymy jej wybrane podstawowe możliwości.

1. **Do czego służy DataFrame? Jak tworzyć takie obiekty?**

```python
import pandas as pd

data = {
    "name": ["Adam", "Beata", "Celina"],
    "age": [25, 31, 28],
    "city": ["Poznań", "Wrocław", "Gdańsk"]
}

df = pd.DataFrame(data)
print(df)

```

DataFrame tworzyć możemy też z numpy array:
```python
import numpy as np

array = np.array([
    [25, 180],
    [31, 172],
    [28, 185]
])

df_from_np = pd.DataFrame(
    array,
    columns=["age", "height"]
)
print(df_from_np)
```

W praktyce jednak najczęściej będziemy tworzyć DataFrame poprzez wczytanie istniejących danych, np. z pliku CSV:
```python
# Zakładając, że na dysku mamy plik data.csv:
df_from_file = pd.read_csv("data.csv")
```

2. **W jaki sposób możemy odczytywać informacje o obiekcie DataFrame?**

```python
# Podstawowe informacje:
print(df.shape) # Rozmiar
print(df.columns) # Nazwy kolumn
print(df.dtypes) # Typy danych
print(df.index) # Indeksy

###
# Przy okazji: indeksy można też zmienić:
df = df.set_index("name")
print(df.index)

# ...I przywrócić z powrotem na numeryczne:
df = df.reset_index()

# Alternatywnie - resetując indeks ręcznie:
df["name"] = df.index
df = df.set_index(np.asarray([0,1,2]))
###

# Wyświetlenie początku danych:
print(df.head(1))

# Podsumowanie informacji o DataFrame wywołać można jedną metodą poprzez:
print(df.info())
```

3. **W jaki sposób możemy odczytywać dane z obiektu DataFrame?**

```python
# Odczytywanie wartości kolumny:
print(df["name"]) #Series
print(df[["name", "city"]]) # Nowa, mała DataFrame

# Odczytywanie wartości wiersza:
print(df.iloc[1])
print(df.loc[1])
# Różnicę między iloc i loc łatwo zauważymy, jeśli ponownie zmienimy indeks:
df2 = df.set_index("name")
print(df2.iloc[1])
print(df2.loc["Beata"])
# Możemy też podawać zakres, np.:
print(df.iloc[0:2])

# Odczytywanie wartości konkretnej komórki:
print(df.loc[2, "name"])
print(df.iloc[2, 2])
```

4. **W jaki sposób możemy filtrować dane za pomocą warunków?**

```python
# Tworzenie maski:
print(df["age"] > 25)

# Filtrowanie danych:
print(df[df["age"] > 25]) # Po jednej kolumnie
print(df[(df["age"] > 25) & (df["city"] == "Gdańsk")]) # Po wielu kolumnach
```

5. **W jaki sposób możemy modyfikować dane w istniejącym obiekcie?**

```python
# Dodawanie nowej kolumny:
df["height"] = [191, 170, 155] # Zewnętrzne dane
df["isAdult"] = df["age"] >= 18 # Na podstawie już istniejącej kolumny

# Edycja istniejącej kolumny:
df["age"] = df["age"] + 1

# Edycja konkretnej wartości:
df.loc[0, "name"] = "Artur"

print(df)
```

6. **Jak zapisywać dane do pliku?**

Odczytywanie danych z pliku CSV przedstawiono już powyżej, spójrzmy więc teraz na przykład zapisu:

```python
import os
path = os.path.join("temp", "data.csv") # Tworzenie ścieżki do pliku
df.to_csv(path)

# Możemy też wykorzystać parametryzację to_csv():
path2 = os.path.join("temp", "data2.csv")
df.to_csv(path2, index = False) # Czym będzie się różnił drugi wyeksportowany plik?
```

Wykorzystana tu metoda to_csv jest jedynie jednym z wielu dostępnych przez Pandas metod eksportu. Mamy chociażby to_excel(), to_json() czy to_xml(). Analogicznie istnieje wiele metod odczytywania różnych formatów pliku.

Zwrócmy uwagę, że tak zaimplementowany eksport plików ma szereg wad. Przykładowo: nie sprawdzamy czy dany folder istnieje przed próbą zapisu do niego, podobnie nie upewniamy się czy nie nadpisujemy jakiegoś już istniejącego pliku. Tego typu niedopatrzenia są jak najbardziej w porządku na potrzeby prostego skryptu w pythonie, ale budując rozwinięte narzędzie musielibyśmy ten kawałek kodu odpowiednio zabezpieczyć.

Tego rodzaju narzędziem będzie **VectorTools**, którego podstawy zbudujemy w następnej części zajęć.

7. **Problemy do samodzielnego rozwiązania:**

*Do przygotowania odpowiedzi poza już pokazanymi powyżej metodami konieczne może być poszukanie analogicznych rozwiązań na własną rękę.*

<ol type="a">
  <li>Utwórz DataFrame zawierający dane 10 osób, wzrost w centymetrach oraz masę ciała w kilogramach. Następnie na podstawie tych danych wygeneruj kolumnę zawierającą BMI każdej osoby.</li>
  <li>Utwórz własny DataFrame zawierający wybrane przez siebie dane. Zapisz go do pliku JSON, a następnie wczytaj ten plik do nowego obiektu DataFrame. Sprawdź, czy oba obiekty zawierają te same dane.</li>
  <li>Wykorzystaj DataFrame stworzony w punkcie 1. Dodaj kolumnę z wiekiem i wypełnij ją danymi. Następnie znajdź osoby starsze niż średnia wieku wszystkich osób, których BMI jest jednocześnie większe niż 25. Wyświetl imiona, wiek oraz BMI tych osób.</li>
</ol>
