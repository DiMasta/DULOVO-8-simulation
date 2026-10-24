# DULOVO-8-simulation
A simulator of an 8 bit computer used for teaching kids how computers work and how to create one by themselves. 

## Running

It is a static site with no build step: open `index.html` in a browser
(or serve the folder, e.g. with GitHub Pages).

## Levels

1. **Адресите на паметта** — fill the address column of the empty 16-cell RAM with 0–15.
2. **Адресите в двоичен код** — write the same addresses as 4-bit binary (0000–1111).
3. **Двоичен код без подсказки** — the same binary addresses without the decimal helper column.

## Updating

Pages load CSS/JS with a `?v=N` suffix so browsers don't run a stale cached
script against new HTML. When you change any file in `css/` or `js/`, bump
the number in every `.html` file:

    sed -i -E 's/\?v=[0-9]+/?v=NEW/' *.html
