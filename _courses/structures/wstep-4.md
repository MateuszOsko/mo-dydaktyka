---
layout: default
title: Wstęp - Stworzenie VectorTools
course_id: structures
order: 4
---

## Wstęp - Stworzenie VectorTools

1. **Przygotowanie pierwszej wersji programu**

Zgodnie z założeniami zajęć, chcemy poznawane przez nas metody obudowywać w działający program. Na początku jednak przygotować musimy szkielet apliakcji.
Poniżej przedstawiam bardzo prosty pomysł na przygotowanie prostego okienka. Aplikację da się uruchomić, a w menu opcji wybrać zamknięcie programu. W przyszłości do menu trafi dużo więcej elementów - chociażby wczytanie pliku - na razie jednak zależy nam na samym szkielecie.

Do realizacji UI wykorzystano bibliotekę tkinter.

Mój przykład:

```python
import tkinter as tk

# Definicje metod:

def close_program():
    window.destroy()


# Utworzenie głównego okna + canvas:

window = tk.Tk()
window.title("VectorTools")
window.resizable(False, False)

canvas = tk.Canvas(
    window,
    width=650,
    height=550,
    highlightthickness=0
)

canvas.pack()


# Grafika tła:

background_screen = tk.PhotoImage(file="ekran.png")

canvas.create_image(
    0,
    0,
    image=background_screen,
    anchor="nw"
)


# Tytuł programu:
canvas.create_text(
    200,
    50,
    text="VectorTools",
    font=("Arial", 30, "bold"),
    fill="white"
)


# Menu:

canvas.create_text(
    180,
    420,
    text="Wybierz operację:",
    font=("Arial", 16, "bold"),
    fill="white"
)


# Przycisk zamknięcia:

canvas.create_text(
    180,
    465,
    text="Zamknij program",
    font=("Arial", 11, "bold"),
    fill="white",
    tags="zamknij"
)

canvas.tag_bind(
    "zamknij",
    "<Button-1>",
    lambda event: close_program()
)

canvas.tag_bind(
    "zamknij",
    "<Enter>",
    lambda event: canvas.itemconfig(
        "zamknij",
        fill="#90E0EF"
    )
)

canvas.tag_bind(
    "zamknij",
    "<Leave>",
    lambda event: canvas.itemconfig(
        "zamknij",
        fill="white"
    )
)

# Główna pętla programu:

window.mainloop()
```

Powyższy kod odpowiada za przygotowanie następującego widoku:

![](./img/VT_01.png)

Jak widzicie w tym przykładzie program zyskał twarz sympatycznego żółwia, jednak wy śmiało dostosujcie pomysły na wasze programy zgodnie z własną inwencją i estetyką!
