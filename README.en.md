# Quartet

A pixel art word game: sixteen words hide four groups of four. Find what links them.

*Version française : [README.md](README.md)*

**The grids are in French**: the words and the themes are French (the interface is translated).

## Controls

- **Click** a word, or **arrows** then **Space**: pick or drop a word.
- **Enter** or **SUBMIT**: submit the four picked words.
- **M** or **SHUFFLE**: shuffle the remaining words.
- **Backspace** or **CLEAR**: deselect everything.

## How it works

- Groups can be simple (planets, cheeses) or tricky (words that follow « coup de », a country hidden inside a word, words that read the same both ways).
- Every grid has **traps**: words that seem to fit two groups. Only one arrangement works for all sixteen.
- A group found becomes a coloured band: **yellow** for the easiest, then green, blue, and **purple** for the trickiest.
- **Four mistakes** allowed. “One away!” when three words out of four are right. The same guess never counts twice.
- After four mistakes, the missing groups are revealed one by one.
- **Twenty handwritten grids**. The game always offers the next grid not solved yet.

## Stats

The Bests panel keeps the number of **grids solved**, **perfect** grids and **games**.

## Data and sync

Your solved grids and totals are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Quartet → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
