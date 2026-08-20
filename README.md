# PokeRepo

One Pokémon per repository. Commits level it up, merged pull requests add it to your Dex.

**[Dex](https://wantaekchoi.github.io/pokerepo/)**

<!-- POKEREPO:START -->
<table><tr>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/272.gif" width="72" alt="ludicolo"><br><b>Ludicolo</b><br><sub>Lv.30</sub><br><sub><a href="https://github.com/wantaekchoi/kbotop">kbotop</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/660.png" width="72" alt="diggersby"><br><b>Diggersby</b><br><sub>Lv.27</sub><br><sub><a href="https://github.com/eGovFramework/egovframe-runtime">egovframe-runtime</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/838.png" width="72" alt="carkol"><br><b>Carkol</b><br><sub>Lv.20</sub><br><sub><a href="https://github.com/1EdTech/digital-credentials-public-validator">digital-credentials-public-validator</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/458.gif" width="72" alt="mantyke"><br><b>Mantyke</b><br><sub>Lv.19</sub><br><sub><a href="https://github.com/spring-projects/spring-boot">spring-boot</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/129.gif" width="72" alt="magikarp"><br><b>Magikarp</b><br><sub>Lv.19</sub><br><sub><a href="https://github.com/wantaekchoi/claude-skills">claude-skills</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/507.gif" width="72" alt="herdier"><br><b>Herdier</b><br><sub>Lv.19</sub><br><sub><a href="https://github.com/wantaekchoi/watch">watch</a></sub></td>
</tr></table>

**Dex 34/39** caught · 33 repositories · updated 2026-08-20
<!-- POKEREPO:END -->

## Setup

**1.** Create a public repository named exactly your username. Its README is what GitHub shows on your profile.

**2.** Put these two lines in that README where the card should go.

```html
<!-- POKEREPO:START -->
<!-- POKEREPO:END -->
```

**3.** Add `.github/workflows/pokerepo.yml`.

```yaml
name: pokerepo
on:
  schedule: [{ cron: "0 21 * * *" }]
  workflow_dispatch:
permissions: { contents: write }
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: wantaekchoi/pokerepo@v1
```

**4.** Actions tab → `pokerepo` → Run workflow.

Options and defaults are on the Marketplace page.

## Notice

Code is [MIT](LICENSE), covering this project's own source only.

PokeRepo is an unofficial, non-commercial fan project, not affiliated with or endorsed by Nintendo, Game Freak, Creatures Inc. or The Pokémon Company. Pokémon names and imagery belong to their respective owners.

No Pokémon artwork is stored here or in any release; sprites are referenced at the addresses [PokéAPI](https://pokeapi.co) reports. Species data comes from PokéAPI under BSD-3-Clause. Rights holders with a concern can open an issue.
