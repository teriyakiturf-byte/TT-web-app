# Grass type quiz photos

Drop the onboarding grass-type quiz photos here. The onboarding photo quiz
(`src/app/onboarding/page.tsx`, step 2) references these filenames:

| File | Grass type | Placeholder color |
|---|---|---|
| `tall-fescue.jpg` | Tall Fescue | `#2D6A4F` |
| `kentucky-bluegrass.jpg` | Kentucky Bluegrass | `#1B4332` |
| `zoysia.jpg` | Zoysia | `#74C69D` |
| `mixed.jpg` | Mixed / Not Sure | `#95D5B2` |

The committed `.jpg` files are **generated turf textures**, not photographs —
produced by `scripts/gen_grass_textures.py` (Pillow) so each card reads as grass
until real licensed photos are sourced. To swap in real photos, just replace the
files with the same names (square 1:1 JPGs, ~800×800, close-up macro shots of the
blades). If a file is ever missing, the card falls back to its colored
placeholder box (the "Not Sure" card also shows a "?" glyph).

Regenerate the textures with:

```bash
pip install Pillow
python3 scripts/gen_grass_textures.py
```
