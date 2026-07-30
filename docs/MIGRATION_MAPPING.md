# v0.5 → Schema v2 Migration Mapping

`src/io/migrations/migrateV05.js`는 입력을 수정하지 않고 새 project를 만든다. 결과는 Schema와 semantic validator를 통과한 뒤에만 Editor state를 교체한다.

| v0.5                       | v2                                         | 보정                                         |
| -------------------------- | ------------------------------------------ | -------------------------------------------- |
| `version: 2` flat payload  | `schemaVersion: 2`, project/settings/scene | 파일명을 migration project name으로 사용     |
| 배열 순서                  | `scene.objects`                            | 순서 의미 없음                               |
| optional `id`              | UUID `id`                                  | 유효한 UUID는 유지, 아니면 새 UUID           |
| optional `parentId`        | UUID `parentId`                            | legacy ID map으로 remap, 누락 참조는 거부    |
| `type: box`                | box `2×2×2`, segments 1                    | v0.5 생성 코드 값                            |
| `type: sphere`             | sphere radius 1.1, 24×16                   | v0.5 생성 코드 값                            |
| `type: cylinder`           | cylinder radius 1, height 2.2, radial 24   | v0.5 생성 코드 값                            |
| `type: cone`               | cone radius 1.1, height 2.4, radial 24     | v0.5 생성 코드 값                            |
| `type: plane`              | thin box `3×0.12×3`                        | v0.5가 실제로 BoxGeometry를 사용해 외형 보존 |
| `type: torus`              | torus 1.05/0.34/16/36                      | v0.5 생성 코드 값                            |
| `type: rock`               | `icosahedron`                              | radius 1.2, detail 1 기본값                  |
| `position`                 | transform.position                         | 누락 시 plane Y=.06, 그 외 Y=1.1             |
| `rotation`                 | transform.rotation.radians                 | order XYZ                                    |
| `scale`                    | transform.scale                            | 누락 [1,1,1], 0 이하 값은 1                  |
| numeric `color`            | `#RRGGBB`                                  | 범위 clamp 후 uppercase                      |
| roughness/metalness        | material                                   | 누락 0.55/0.05                               |
| opacity/transparent        | material                                   | 누락 opacity 1                               |
| wireframe/flatShading/side | material                                   | 값이 있으면 보존                             |
| visible/locked             | object                                     | 값이 있으면 보존, 기본 true/false            |

## `rock` 무손실 기준

`IcosahedronGeometry(radius, detail)`의 position attribute를 migration 전 기대 geometry와 직접 비교한다. name, hierarchy, transform, material, color, flatShading을 fixture로 검사하고, GLB 재로딩 후 vertex count·bounding radius·transform·material color를 확인한다. 필드가 없는 실제 v0.5 파일은 기존 `IcosahedronGeometry(1.2,1)` 생성값을 쓴다.

## 실패

지원하지 않는 type, 누락 parent, 잘못된 결과 Schema/semantic state는 `PROJECT_MIGRATION_FAILED` 또는 validation error로 거부한다. 원본 객체와 현재 Editor state는 바꾸지 않는다.
