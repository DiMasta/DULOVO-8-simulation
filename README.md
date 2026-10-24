# DULOVO-8-simulation
A simulator of an 8 bit computer used for teaching kids how computers work and how to create one by themselves. 

## Running

It is a static site with no build step: open `index.html` in a browser
(or serve the folder, e.g. with GitHub Pages).

## Levels

1. **Адресите на паметта** — fill the address column of the empty 16-cell RAM with 0–15.
2. **Адресите в двоичен код** — write the same addresses as 4-bit binary (0000–1111).
3. **Двоичен код без подсказки** — the same binary addresses without the decimal helper column.
4. **Рождената ти дата в байтове** — write day, month and year (last two digits) as bytes in cells 1101–1111.
5. **Инструкциите OUT и STOP!** — a program that prints the date of birth on the screen in decimal.
6. **Букви с OUTC** — a program that prints the student's name; bytes are decoded as windows-1251 so Cyrillic works.

## Instructions

| Instruction | Meaning |
|---|---|
| `OUT aaaa` | Show the byte in cell `aaaa` on the screen as a decimal number |
| `OUTC aaaa` | Show the byte in cell `aaaa` on the screen as a letter (windows-1251) |
| `STOP!` | Stop the computer |

Programs start at cell 0000 and run one cell after another.

## Updating

Pages load CSS/JS with a `?v=N` suffix so browsers don't run a stale cached
script against new HTML. When you change any file in `css/` or `js/`, bump
the number in every `.html` file:

    sed -i -E 's/\?v=[0-9]+/?v=NEW/' *.html
