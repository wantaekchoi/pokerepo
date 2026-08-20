# PokeRepo

저장소마다 포켓몬 한 마리. 커밋이 쌓이면 진화하고, 머지되면 도감에 등재된다.

**[도감 보기](https://wantaekchoi.github.io/pokerepo/)** — 번호순 격자, 있는 것만 보기, 저장소별 상세.

<!-- POKEREPO:START -->
<table><tr>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/272.gif" width="72" alt="ludicolo"><br><b>Ludicolo</b><br><sub>Lv.30</sub><br><sub><a href="https://github.com/wantaekchoi/kbotop">kbotop</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/660.png" width="72" alt="diggersby"><br><b>Diggersby</b><br><sub>Lv.27</sub><br><sub><a href="https://github.com/eGovFramework/egovframe-runtime">egovframe-runtime</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/838.png" width="72" alt="carkol"><br><b>Carkol</b><br><sub>Lv.20</sub><br><sub><a href="https://github.com/1EdTech/digital-credentials-public-validator">digital-credentials-public-validator</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/458.gif" width="72" alt="mantyke"><br><b>Mantyke</b><br><sub>Lv.19</sub><br><sub><a href="https://github.com/spring-projects/spring-boot">spring-boot</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/129.gif" width="72" alt="magikarp"><br><b>Magikarp</b><br><sub>Lv.19</sub><br><sub><a href="https://github.com/wantaekchoi/claude-skills">claude-skills</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/507.gif" width="72" alt="herdier"><br><b>Herdier</b><br><sub>Lv.19</sub><br><sub><a href="https://github.com/wantaekchoi/watch">watch</a></sub></td>
</tr></table>

**도감 34/39** 잡음 · 저장소 33곳 · 기여 33건 · 2026-08-20
<!-- POKEREPO:END -->

## 다는 법

터미널 없이 브라우저에서 다 된다.

**1. 프로필 저장소를 만든다.** [github.com/new](https://github.com/new) 에서 저장소 이름을 **자기 아이디와 똑같이** 짓고 Public 으로 만든다. 이 저장소의 README 는 프로필 첫 화면에 뜬다. 이미 있으면 건너뛴다.

**2. README 에 자리를 표시한다.** 카드를 넣고 싶은 위치에 두 줄을 넣는다. 화면에는 안 보인다.

```html
<!-- POKEREPO:START -->
<!-- POKEREPO:END -->
```

**3. 워크플로를 만든다.** 같은 저장소에서 `Add file → Create new file`, 파일 이름을 `.github/workflows/pokerepo.yml` 로 하고 아래를 붙여넣는다.

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

**4. 한 번 돌린다.** `Actions` 탭 → 왼쪽에서 `pokerepo` → `Run workflow`. 이후로는 매일 자동으로 돈다.

설정을 바꾸려면 `- uses:` 아래에 `with:` 를 붙인다. 항목과 기본값은 Marketplace 화면에 있다.

```yaml
      - uses: wantaekchoi/pokerepo@v1
        with:
          party: 8
          sprite: artwork
```

## 규칙

| 기여 | 게임 |
| --- | --- |
| 내가 만든 저장소 | 알에서 부화 |
| 포크 | 야생에서 조우 — 도감 *본 것* |
| 머지된 PR | 포획 성공 — 도감 *잡은 것* |
| 그 저장소에 남은 내 커밋 | 그 종의 경험치 |
| 상류 저장소의 별 수 | 희귀도 |

경험치 곡선·진화 조건·포획률은 실제 게임 값을 쓴다. 저장소를 지워도 도감과 레벨은 남는다.

## 라이선스와 고지

코드는 [MIT](LICENSE). MIT는 이 저장소가 직접 쓴 코드에만 적용되며, 제3자의 상표·그림·데이터에 대한 권리를 주지 않는다.

PokeRepo는 **비공식 비영리 팬 프로젝트**로, Nintendo · Game Freak · Creatures Inc. · The Pokémon Company와 아무 관련이 없고 승인·후원·보증을 받지 않았다. "포켓몬"과 관련된 모든 이름·캐릭터·이미지의 상표권과 저작권은 각 권리자에게 있으며, 이 프로젝트는 그에 대해 어떤 권리도 주장하지 않는다.

- **이 저장소와 배포물에는 포켓몬 그림이 들어 있지 않다.** 스프라이트는 [PokéAPI](https://pokeapi.co)가 알려주는 주소를 그대로 참조할 뿐이며, 그 이미지의 권리는 각 권리자에게 있다.
- 종 이름·수치·진화 데이터는 PokéAPI가 BSD-3-Clause로 공개한 것을 쓴다.
- 개인적·비영리 용도로 무료 제공된다.
- 권리자로서 문제가 있다면 이슈를 열어 알려주면 즉시 대응한다.
