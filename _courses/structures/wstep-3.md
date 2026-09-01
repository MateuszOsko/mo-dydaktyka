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
print (df)

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

...

4. **W jaki sposób możemy filtrować dane za pomocą warunków?**
   
...

5. **W jaki sposób możemy modyfikować dane w istniejącym obiekcie?**

...

6. **Jak odczytywać i zapisywać dane do pliku?**

...