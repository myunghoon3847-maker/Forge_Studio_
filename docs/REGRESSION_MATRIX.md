# v0.5 → v0.6-alpha Regression Matrix

| 흐름        | v0.5                            | v0.6-alpha                                                     |
| ----------- | ------------------------------- | -------------------------------------------------------------- |
| 앱 시작     | CDN 연결 필요, 단일 HTML        | npm local bundle, empty state, WebGL2 안내                     |
| Primitive   | 6종, 생성 기본 Y≈1.1            | 6종, v1.2 기본 transform `[0,0,0]`                             |
| 템플릿      | builder 12종, UI 노출 4종       | registry 20종, 검색·category, Root/Part                        |
| 빠른 템플릿 | tree/rock/potion ID 오류        | oak/crate/sword 정상                                           |
| 선택        | 단일                            | 단일·Shift 다중·active selection                               |
| Transform   | Mesh 직접 수정, History 누락    | Domain Command commit, Gizmo·Inspector 동기화                  |
| Hierarchy   | flat list                       | parentId tree, collapse, group/mesh, visible/locked            |
| Group       | 없음                            | 같은 부모 Group/Ungroup, world transform 보존                  |
| History     | 60 snapshot, 일부 작업 누락     | 100 Command, merge, redo branch, dirty revision                |
| 저장        | flat `version:2` JSON           | `.forge.json` Schema v2 + semantic validation                  |
| 열기 실패   | clear 후 parse 가능             | validation 완료 전 state 불변                                  |
| v0.5 rock   | IcosahedronGeometry             | Schema `icosahedron`, radius/detail 무손실 migration           |
| 이름 출력   | `innerHTML` 삽입                | `textContent`, control/XSS 검증                                |
| GLB         | visible 개념 없음, clone export | filtered independent Scene, hidden/helper/editor metadata 제외 |
| 의존성      | jsDelivr Three 0.181.1          | npm Three 0.181.1 exact lock                                   |
| 브라우저    | 수동 Chromium                   | system Chrome·Edge E2E                                         |

의도적으로 달라진 기본 transform과 Template Root 선택은 SRS v1.2가 v0.5보다 우선하기 때문이다. v0.5 thin Box plane은 migration에서 `plane`으로 바꾸지 않고 box로 유지해 외형을 보존한다.
