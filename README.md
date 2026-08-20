# PokeGrind

저장소마다 포켓몬 한 마리. 커밋이 쌓이면 진화하고, 머지되면 도감에 등재된다.

<!-- POKEGRIND:START -->
<table><tr>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/272.gif" width="72" alt="ludicolo"><br><b>Ludicolo</b><br><sub>Lv.30</sub><br><sub><a href="https://github.com/wantaekchoi/kbotop">kbotop</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/129.gif" width="72" alt="magikarp"><br><b>Magikarp</b><br><sub>Lv.19</sub><br><sub><a href="https://github.com/wantaekchoi/claude-skills">claude-skills</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/507.gif" width="72" alt="herdier"><br><b>Herdier</b><br><sub>Lv.19</sub><br><sub><a href="https://github.com/wantaekchoi/watch">watch</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/166.gif" width="72" alt="ledian"><br><b>Ledian</b><br><sub>Lv.18</sub><br><sub><a href="https://github.com/wantaekchoi/wantaekchoi.github.io">wantaekchoi.github.io</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/659.png" width="72" alt="bunnelby"><br><b>Bunnelby</b><br><sub>Lv.16</sub><br><sub><a href="https://github.com/eGovFramework/egovframe-runtime">egovframe-runtime</a></sub></td>
<td align="center" width="110"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/438.gif" width="72" alt="bonsly"><br><b>Bonsly</b><br><sub>Lv.15</sub><br><sub><a href="https://github.com/wantaekchoi/wantaekchoi">wantaekchoi</a></sub></td>
</tr></table>

**도감 32/37** 잡음 · 저장소 33곳 · 기여 33건 · 2026-08-20
<!-- POKEGRIND:END -->

## 다는 법

프로필 저장소(`<아이디>/<아이디>`)의 README에 표시를 넣고,

```html
<!-- POKEGRIND:START -->
<!-- POKEGRIND:END -->
```

워크플로를 하나 만든다.

```yaml
name: pokegrind
on:
  schedule: [{ cron: "0 21 * * *" }]
  workflow_dispatch:
permissions: { contents: write }
jobs:
  grind:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: wantaekchoi/pokegrind@v1
```

설정은 전부 `with:` 로 넘긴다. 항목과 기본값은 위 Marketplace 화면에 있다.

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

PokeGrind는 **비공식 비영리 팬 프로젝트**로, Nintendo · Game Freak · Creatures Inc. · The Pokémon Company와 아무 관련이 없고 승인·후원·보증을 받지 않았다. "포켓몬"과 관련된 모든 이름·캐릭터·이미지의 상표권과 저작권은 각 권리자에게 있으며, 이 프로젝트는 그에 대해 어떤 권리도 주장하지 않는다.

- **이 저장소와 배포물에는 포켓몬 그림이 들어 있지 않다.** 스프라이트는 [PokéAPI](https://pokeapi.co)가 알려주는 주소를 그대로 참조할 뿐이며, 그 이미지의 권리는 각 권리자에게 있다.
- 종 이름·수치·진화 데이터는 PokéAPI가 BSD-3-Clause로 공개한 것을 쓴다.
- 개인적·비영리 용도로 무료 제공된다.
- 권리자로서 문제가 있다면 이슈를 열어 알려주면 즉시 대응한다.
