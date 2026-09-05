---
layout: default
title: Wstęp - Numpy
course_id: structures
order: 2
---

## Wstęp - Numpy

Odpowiedzmy sobie na następujące pytania:

1. **Do czego służy numpy? Czym jest numpy array? Jakie są różnice między numpy array a "zwykłym" array?**

Przy rozważaniach zwróc uwagę na następujące zachowania:

```python
import numpy as np

py_list = [1, 6, 20]
np_array = np.array([1,6,20])

print(py_list)
print(np_array)

print (py_list * 2)
print(np_array * 2)

#print (py_list + 3) # Czemu ta linijka jest zakomentowana?
print(np_array + 3)
```

2. **W jaki sposób można przepytywać obie struktury w poszukiwaniu statystyk?**

Sprawdźmy na przykładzie średniej oraz mediany.

```python
# Średnia
py_list_mean = sum(py_list) / len(py_list)
np_array_mean = np_array.mean()
print('średnia', py_list_mean)
print('średnia', np_array_mean)

# Mediana
sorted_list = sorted(py_list)
n = len(sorted_list)
if n % 2 == 1:
    py_list_median = sorted_list[n // 2]
else:
    py_list_median = (sorted_list[n // 2 - 1] + sorted_list[n // 2]) / 2

np_array_median = np.median(np_array) # Dlaczego nie: np_array.median() ?

print('mediana', py_list_median)
print('mediana', np_array_median)
# Dla zwykłej listy można by też wykorzystać zewnętrzne pakiety, jak statistics
```

3. **W jaki sposób można przepytywać obie struktury w poszukiwaniu danych?**

Dla listy 1 wymiarowej i 2 wymiarowej (macierzy).

```python
# Szukanie wartości po indeksie:
print(py_list[1])
print(np_array[1])

# Slicing
print(py_list[0:2])
print(np_array[0:2])
# Czy sformułowanie [1:1] zwróci pustą listę czy element o indeksie 1 ?

# Dla macierzy:
py_matrix = [[10, 20, 30],
            [40, 50, 60],
            [70, 80, 90]]
np_matrix = np.asarray(
            [[10, 20, 30],
            [40, 50, 60],
            [70, 80, 90]]
            )

# Macierz: szukanie wartości po indeksie:
print(py_matrix[2][0])
print(np_matrix[2,0])

# Macierz: zwróć cały wiersz:
print(py_matrix[1])
print(np_matrix[1]) # lub: print(np_matrix[1,:])

#Macierz: zwróc całą kolumnę:
print([row[1] for row in py_matrix]) 
# użycie list comprehension - alternatywnie zwykła pętla for:
# result = []
# for row in py_matrix:
#     result.append(row[1])
print(np_matrix[:,1])
```

4. **Odpytywanie struktur pod kątem wymiarów**

Czym różnią się poniższe 3 właściwości?
```python
print(np_matrix.shape)
print(np_matrix.ndim)
print(np_matrix.size)
```
Implementacja dla zwykłej tablicy byłyby już dużo bardziej złożona i prawdopodobnie nie uniknelibyśmy pisania funkcji rekurencyjnych, wchodząc w głąb każdej kolejnej zagnieżdżonej tablicy by odczytywać liczebność elementów.

Np_array rzeczywiście jest regularną strukturą wielowymiarową - py_array to tak naprawdę tylko zagnieżdżone listy list.
Np_array nie pozwoli nam w prosty sposób wprowadzić nieregularnych długości wierszy bo zniszczy do integralność stuktury, py_array nie będzie miał z tym problemu.
Wniosek: py_array jest dużo bardziej macierzą w znaczniu "na słowo honoru".

5. **Filtrowanie po warunkach**

```python
np_array_to_filter = np.array([5, 12, 7, 20, 3])

# Czym różnią się poniższe zapisy?
print(np_array_to_filter > 10)
print(np_array_to_filter[np_array_to_filter > 10])
print(np.where(np_array_to_filter > 10))

# Przykład dla py_array - wyszukiwanie indeksów po warunku na wartości:
py_list_to_filter = np_array_to_filter.tolist() # Transformacja poprzedniej struktury na listę

result = []
for i, value in enumerate(py_list_to_filter): # Użycie enumerate by iterować po indeksach + wartościach
    if value > 10:
        result.append(i)
print(result)
```

6. **Tworzenie nowych obiektów**

Jak było już zaprezentowane na początku, strukturę numpy array można stworzyć po prostu przez: np.array(...) z podawaną listą pythonową do transformacji.
Istnieją też jednak inne przydatne sposoby:

```python
# Tworzenie tablicy z domyślnymi wartościami:
print(np.zeros(5))
print(np.ones(5))
print(np.full(5, 10))

# Tworzenie tablicy z kolejnymi wartościami:
print(np.arange(0, 10))
print(np.arange(0, 20, 5))

# Tworzenie tablicy wielowymiarowej z domyślnymi wartościami:
print(np.zeros((4, 4)))
```

7. **Problemy do samodzielnego rozwiązania:**

*Do przygotowania odpowiedzi poza już pokazanymi powyżej metodami konieczne może być poszukanie analogicznych rozwiązań na własną rękę.*

<ol type="a">
  <li>Stwórz losową 1-wymiarową numpy array o długości 15 elementów. Następnie oblicz jej minimum, maksimum oraz odchylenie standardowe.</li>
  <li>Stwórz losową tablicę 2-wymiarową numpy array 4 wiersze x 4 kolumny, a następnie oblicz sumę wartości dla każdej kolumny oraz dla każdego wiersza.</li>
  <li>Stwórz tablicę 2-wymiarową 5 wierszy x 5 wierszy, w której każda wartość będzie o 3 większa od poprzedniej. Podaj indeksy każdej wartości parzystej większej od 10.</li>
</ol>
