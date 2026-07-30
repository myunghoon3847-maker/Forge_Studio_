# Template Catalog

모든 템플릿은 `1.0.0` data-driven definition, ground-center Root pivot, Y=0 최저점, 2~5색 기본 palette를 사용한다.

| Category  | ID                     | 이름      | Triangle 상한 |
| --------- | ---------------------- | --------- | ------------: |
| Nature    | `nature.oak`           | 참나무    |         1,200 |
| Nature    | `nature.pine`          | 소나무    |         1,000 |
| Nature    | `nature.bush`          | 관목      |           500 |
| Nature    | `nature.rock-small`    | 소형 바위 |           300 |
| Nature    | `nature.rock-cluster`  | 바위 군집 |           800 |
| Building  | `building.wood-house`  | 목조 주택 |         3,500 |
| Building  | `building.watch-tower` | 감시탑    |         2,500 |
| Building  | `building.fence`       | 울타리    |           600 |
| Building  | `building.well`        | 우물      |         1,200 |
| Prop      | `prop.crate`           | 나무상자  |           400 |
| Prop      | `prop.barrel`          | 나무통    |           600 |
| Prop      | `prop.chest`           | 보물상자  |           800 |
| Prop      | `prop.table`           | 테이블    |           500 |
| Prop      | `prop.chair`           | 의자      |           450 |
| Prop      | `prop.campfire`        | 모닥불    |           700 |
| Weapon    | `weapon.sword`         | 검        |           300 |
| Weapon    | `weapon.axe`           | 도끼      |           350 |
| Weapon    | `weapon.shield`        | 방패      |           400 |
| Weapon    | `weapon.spear`         | 창        |           250 |
| Character | `character.slime`      | 슬라임    |           500 |

Unicode symbol thumbnail은 저장소 내 텍스트 UI이며 외부 이미지 자산을 사용하지 않는다. `tests/unit/templates.test.js`가 20개 definition의 Root/Part metadata, triangle 상한, pivot, Y=0, material palette를 검사한다. `glb-export.test.js`는 20개 모두를 export하고 Root/Part와 MeshStandard material을 재로딩한다.
