# Forge Studio v0.6-alpha — Gate 0 기준선 보고서

- 보고서 버전: 2.1
- 조사일: 2026-07-30 (Asia/Seoul)
- 기준 원본: `forge-studio-v05.zip`
- 기준 문서: Forge Studio Development Package v1.2
- Gate 0 판정: **통과**
- 해제된 이슈: B-001 — v0.5 전체 원본 부재
- 해제된 이슈: B-002 — 승인된 `icosahedron` 정식 geometry 타입으로 해결

## 1. 판정 요약

추가된 `forge-studio-v05.zip`은 정상적으로 열리며 Forge Studio v0.5의 전체 구현이 단일 HTML에 포함되어 있다. Chrome 기반 브라우저에서 실제 실행했고 Primitive, 참나무 템플릿, 선택, 복제, 삭제, Undo/Redo, 프로젝트 저장 호출과 GLB 내보내기 완료 상태를 검수했다.

기존 원본 부재 차단 B-001은 해제한다. G0-01~G0-07은 실제 원본 조사 결과로 교체했다.

제품 책임자는 2026-07-30에 Schema v2에 `icosahedron`을 정식 geometry 타입으로 추가하는 권장안을 승인했다. `radius`와 `detail`을 저장하고, v0.5 `rock`을 Three.js 기본 생성값 `radius=1.2`, `detail=1`로 보정하는 migration을 채택했다. 결정과 기각 대안은 `docs/adr/ADR-008-icosahedron-geometry.md`에 기록한다. B-002는 해제됐으며 Gate 1~7 진행을 차단하지 않는다.

## 2. 원본 동결

### 2.1 Archive

| 파일                                            | 크기(bytes) | SHA-256                                                            |
| ----------------------------------------------- | ----------: | ------------------------------------------------------------------ |
| `C:\Users\mnm21\Downloads\forge-studio-v05.zip` |       8,775 | `A65DDF872FC1F82724BAA8D080CD71A0D021B29F4481994288EEAAC581F8DA88` |

원본 보존 복사본:

```text
work/gate0/original/forge-studio-v05.zip
```

분석용 전개본:

```text
work/gate0/v05-source/forge-studio-v05/
```

ZIP entry는 상대 경로만 사용하며 path traversal entry가 없다.

### 2.2 전체 파일 목록

| 상대 경로                     | 크기(bytes) | SHA-256                                                            |
| ----------------------------- | ----------: | ------------------------------------------------------------------ |
| `forge-studio-v05/index.html` |      23,632 | `6185A7AA765CDF629733083EE6B843EAE5EE2EEBA0151F4BFF394655EF649492` |
| `forge-studio-v05/README.txt` |         298 | `BB5D20889A6F20C5DF72534F408EFA16A88F5594126621220B1B59D32BDB9AB5` |

원본 ZIP은 Git 저장소가 아니다.

- branch: 해당 없음
- commit: 해당 없음
- dirty 상태: 해당 없음
- 기준 식별자: archive SHA-256

### 2.3 문서 패키지 기준선

| 파일                                        | SHA-256                                                            |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `Forge_Studio_Development_Package_v1.2.zip` | `B826EDAF1947A1E180AD04F12E38371014D18360ED8890E33AA11474B88C17B8` |
| `project.schema.v2.json`                    | `88FD95B00F902A06DC4D8FDD66B7026848DA77BD8C37BC9ED07911D88C0CF38E` |
| `Forge_Studio_개발기획서_SRS_v1.2.md`       | `41222F8C35F35D75A74A84FD43D1083B3FC4BC6AC66FC725767C83C1BD0C2206` |
| `Forge_Studio_작업명세서_v1.2.md`           | `B8C0479450DD81990B49E50F4E208455C5FBC1AAF1CC488C50CACAA1332FC35A` |
| `Forge_Studio_아키텍처설계서_SAD_v1.2.md`   | `6F070DD35BF52E0B4D82E31C3EAB8D6D4B17EA9F3A93A718B56B31CEA2B4BC10` |

## 3. 실행 방법과 환경

### 3.1 원본 안내

`README.txt`는 Chrome 또는 Edge에서 `index.html`을 열도록 안내하며 Three.js CDN 사용을 위해 인터넷 연결을 요구한다.

### 3.2 실제 실행

Gate 0에서는 원본을 수정하지 않고 로컬 HTTP로 제공해 실행했다.

```text
http://127.0.0.1:4173/
```

실행 환경:

| 항목                 | 값                            |
| -------------------- | ----------------------------- |
| OS                   | Windows                       |
| Chrome 설치 버전     | `150.0.7871.187`              |
| Edge 설치 버전       | `150.0.4078.105`              |
| 실제 Gate 0 브라우저 | Codex in-app Chromium browser |
| 화면 제목            | `Forge Studio Free Test`      |
| Git                  | `2.53.0.windows.3`            |

실행 증거:

```text
docs/assets/v05-oak-runtime.png
```

### 3.3 Three.js와 외부 의존성

`index.html`의 ES module import:

| 모듈              | 버전·경로                                                       |
| ----------------- | --------------------------------------------------------------- |
| Three.js          | `https://cdn.jsdelivr.net/npm/three@0.181.1/+esm`               |
| OrbitControls     | `three@0.181.1/examples/jsm/controls/OrbitControls.js/+esm`     |
| TransformControls | `three@0.181.1/examples/jsm/controls/TransformControls.js/+esm` |
| GLTFExporter      | `three@0.181.1/examples/jsm/exporters/GLTFExporter.js/+esm`     |

원본은 build step, package manager, lockfile, local dependency 또는 CSP가 없다. 런타임이 jsDelivr CDN 가용성에 의존한다.

Three.js revision은 package URL 기준 `0.181.1`이다.

## 4. v0.5 구조 분석

v0.5는 99줄로 압축된 단일 `index.html`이다. CSS, DOM, domain data, Three.js Scene, Command 유사 History, 파일 IO와 GLB export가 모두 한 module scope에 결합되어 있다.

주요 전역 상태:

- `scene`, `camera`, `renderer`
- `orbit`, `transform`
- `objects` 배열
- `selected`, `serial`, `mode`
- `undoStack`, `redoStack`, `restoring`
- `raycaster`, `pointer`

구조적 특성:

- 편집 원본은 Three.js `Mesh`와 `objects` 배열이다.
- 별도 domain object, UUID, group graph 또는 store가 없다.
- Inspector가 Three.js Mesh를 직접 변경한다.
- Hierarchy가 아니라 flat Scene list만 제공한다.
- UI 재렌더링은 수동 `refresh`, `sync`, `refreshList`, `stats` 호출이다.
- History는 JSON 전체 snapshot을 저장한다.
- 저장 데이터는 Three.js runtime 객체에서 직접 투영한다.
- GLB는 editor Scene을 직접 내보내지는 않지만 각 Mesh clone을 별도 Scene에 추가한다.

## 5. 실제 기능과 사용자 동작

### 5.1 제공 기능

- Primitive 6종: Cube, Sphere, Cylinder, Cone, Plane, Torus
- 단일 선택: Viewport raycast 또는 장면 목록 클릭
- Q Select, W Move, E Rotate, R Scale
- TransformControls와 Inspector 동기화
- 이름, Position, Rotation degree UI, Scale 편집
- Material color, roughness, metalness 편집
- Duplicate, Delete, Ground Align
- Orbit, Pan, Zoom
- Front, Top, Perspective camera preset
- Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y
- Ctrl+D, Ctrl+S, Delete, Backspace
- JSON 프로젝트 저장·열기
- Binary GLB 내보내기
- 객체·triangle·선택 상태 표시

### 5.2 실제 실행 결과

| 검수                      | 결과                                           |
| ------------------------- | ---------------------------------------------- |
| 빈 Scene 실행             | 성공, 객체 0, console error 0                  |
| 참나무 생성               | 성공, Part 5개, triangle 2,976, 마지막 잎 선택 |
| 참나무 Undo               | 객체 0으로 복원                                |
| 참나무 Redo               | 객체 5개로 복원, 선택은 해제됨                 |
| 선택 후 Ctrl+D            | 객체 5→6, `복사본` 선택                        |
| Delete                    | 객체 6→5                                       |
| Delete Undo               | 객체 6으로 복원, 선택은 해제됨                 |
| Primitive 6종 생성        | 성공, 객체 6, triangle 2,040                   |
| GLB 내보내기              | 상태 `GLB 내보내기 완료`, console error 0      |
| 빠른 템플릿 `저폴리 나무` | 객체 0, 상태 `0개 파트 템플릿 추가됨`          |

### 5.3 유지할 v0.5 사용자 흐름

- 앱을 열면 빈 Viewport와 시작 카드가 보인다.
- 템플릿 또는 Primitive를 클릭하면 즉시 Scene에 생성된다.
- 생성 항목 또는 템플릿의 마지막 Part가 선택된다.
- Viewport와 Scene list 양쪽에서 선택할 수 있다.
- Q/W/E/R로 도구를 바꾼다.
- Inspector는 degree를 표시하지만 저장 rotation은 radian이다.
- Ctrl+S는 JSON, 상단 주요 버튼은 GLB를 내려받는다.
- Viewport Orbit/Pan/Zoom과 Front/Top/Perspective preset을 제공한다.
- 하단에서 객체 수와 선택 이름을 확인한다.

v0.6-alpha에서는 위 흐름을 유지하면서 v1.2가 요구하는 Template Root 선택, Hierarchy, 제한된 다중 선택, 안전한 저장과 Command History로 동작을 확장해야 한다.

## 6. Primitive 기준선

| v0.5 type  | Three.js geometry                | 기본 triangle | 기본 Position |
| ---------- | -------------------------------- | ------------: | ------------- |
| `box`      | `BoxGeometry(2,2,2)`             |            12 | `[0,1.1,0]`   |
| `sphere`   | `SphereGeometry(1.1,24,16)`      |           720 | `[0,1.1,0]`   |
| `cylinder` | `CylinderGeometry(1,1,2.2,24)`   |            96 | `[0,1.1,0]`   |
| `cone`     | `ConeGeometry(1.1,2.4,24)`       |            48 | `[0,1.1,0]`   |
| `plane`    | `BoxGeometry(3,0.12,3)`          |            12 | `[0,0.06,0]`  |
| `torus`    | `TorusGeometry(1.05,0.34,16,36)` |         1,152 | `[0,1.1,0]`   |
| `rock`     | `IcosahedronGeometry(1.2,1)`     |            80 | `[0,1.1,0]`   |

첫 Primitive 이름은 `큐브 1`, `구 2`처럼 전체 생성 serial을 공유한다. v1.2 FR-003의 형상별 `Cube`, `Cube 2` 규칙과 다르다.

## 7. 기존 템플릿 12종

소스에는 12개 template builder branch가 있다. 별도 registry, root group, thumbnail asset 또는 fixture는 없다.

| v0.5 ID       | 표시 이름 | Part | triangles | UI에서 실제 생성 가능 | 비고                         |
| ------------- | --------- | ---: | --------: | --------------------- | ---------------------------- |
| `oak`         | 참나무    |    5 |     2,976 | 시작 카드             | v1.2 상한 1,200 초과         |
| `pine`        | 소나무    |    4 |       240 | 불가                  | 버튼 없음                    |
| `rockCluster` | 바위 군집 |    3 |       240 | 불가                  | Schema v2 미지원 `rock` 사용 |
| `bush`        | 관목      |    3 |     2,160 | 불가                  | v1.2 상한 500 초과           |
| `crate`       | 보강 상자 |    5 |        60 | 빠른 템플릿·시작 카드 | 정상 연결                    |
| `barrel`      | 나무통    |    4 |     3,552 | 불가                  | v1.2 상한 600 초과           |
| `campfire`    | 모닥불    |    4 |       336 | 불가                  | 버튼 없음                    |
| `chest`       | 보물상자  |    3 |       120 | 불가                  | 버튼 없음                    |
| `sword`       | 기사 검   |    5 |       888 | 빠른 템플릿·시작 카드 | v1.2 상한 300 초과           |
| `shield`      | 방패      |    3 |       912 | 불가                  | v1.2 상한 400 초과           |
| `house`       | 목조 주택 |    6 |       192 | 빠른 템플릿·시작 카드 | 정상 연결                    |
| `tower`       | 감시탑    |    6 |       444 | 불가                  | 버튼 없음                    |

빠른 템플릿의 `tree`, `rock`, `potion` ID는 builder branch와 연결되지 않는다. 실제 클릭 시 welcome을 숨기지만 객체를 생성하지 않고 `0개 파트 템플릿 추가됨`을 표시한다.

Thumbnail은 외부 이미지가 아니라 다음 emoji만 사용한다.

- 🌳 나무
- 🪨 바위
- 📦 상자
- ⚔️ 검
- 🏠 집
- 🧪 포션

Template Root가 없고 모든 Part가 Scene root의 독립 Mesh로 생성된다. 생성 직후 마지막 Part를 선택한다.

## 8. History와 편집 기준선

### 8.1 History

- 전체 프로젝트 JSON snapshot 방식
- 최대 60단계
- 새 snapshot 후 redo stack 초기화
- Template, Delete, Duplicate, Ground Align은 실행 전 snapshot을 저장
- Primitive `add()`는 생성 후 snapshot을 저장해 첫 Undo가 생성 취소로 동작하지 않는다.
- TransformControls 변경은 History에 기록하지 않는다.
- Inspector 이름·Transform·Material 변경은 History에 기록하지 않는다.
- Undo/Redo 후 selection이 해제된다.
- 저장 revision과 dirty state가 없다.

### 8.2 선택·Hierarchy

- 단일 선택만 제공
- Shift 다중 선택 없음
- Group/Ungroup 없음
- flat list만 제공
- UUID와 parent 관계 없음
- visible·locked 상태 없음

### 8.3 입력 검증

- Scale은 Inspector에서 `Math.max(0.05, value)`로 보정한다.
- Position·Rotation은 `Number` 변환 결과를 그대로 적용한다.
- 이름은 빈 문자열일 때 이전 이름을 유지하지만 길이·제어문자 검증이 없다.
- Scene list가 사용자 이름을 `innerHTML` template literal로 삽입한다.
- `input` 중 Ctrl+S가 typing guard보다 먼저 실행되어 저장 단축키 충돌이 발생한다.

## 9. v0.5 저장 형식

다운로드 파일명은 `forge-studio-project.json`이다. 앱 버전은 v0.5지만 저장 payload의 최상위 `version`은 `2`다.

```json
{
  "version": 2,
  "objects": [
    {
      "type": "box",
      "name": "큐브 1",
      "color": 2068218,
      "roughness": 0.55,
      "metalness": 0.05,
      "position": [0, 1.1, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1]
    }
  ]
}
```

특성:

- `schemaVersion`, `appVersion`, project metadata와 settings 없음
- UUID, parentId, group, visible, locked 없음
- geometry는 `type` 문자열 하나로 저장
- material color는 24-bit integer
- Transform은 flat array
- rotation은 radian
- opacity, transparent, wireframe, flatShading, side 없음
- unknown field, type, range, finite number, object count, depth 검증 없음
- 파일 크기와 확장자 검증 없음

Loader는 JSON parse 직후 현재 Scene을 `clear()`하고 각 object를 추가한다. 중간 object에서 실패하면 원래 Scene을 잃거나 부분 Scene이 남을 수 있다.

Gate 0에서 다음 migration fixture를 동결했다.

```text
tests/fixtures/v05/v05-cube.json
tests/fixtures/v05/v05-oak.json
tests/fixtures/v05/v05-sword.json
```

## 10. v0.5 GLB 출력

### 10.1 실제 동작

- 빈 Scene은 상태 메시지로 내보내기를 거부한다.
- 각 `objects` Mesh를 `clone()`해 새 `THREE.Scene`에 추가한다.
- `GLTFExporter.parse(..., {binary:true})`를 사용한다.
- 다운로드 파일명은 `forge-studio-model.glb`다.
- 실제 6 Primitive Scene 내보내기 호출은 성공 상태를 반환했고 console error는 0건이었다.

### 10.2 포함·제외

포함:

- 모든 `objects` Mesh
- local Position·Rotation·Scale
- MeshStandardMaterial color·roughness·metalness
- Mesh `userData.type`가 exporter extras로 포함될 가능성

제외:

- editor camera
- GridHelper
- AxesHelper
- TransformControls helper
- light

v0.5에는 hidden·locked·group이 없으므로 해당 정책은 구현되어 있지 않다. meter/+Y Up은 Three.js 기본 좌표와 수치 단위를 그대로 사용하며, asset front +Z를 검증하는 fixture는 없다. GLTFLoader round-trip, Khronos Validator, Godot와 Unity 검수 기록도 없다.

## 11. v1.2와 원본 차이 — 요구사항 ID별

| 요구사항          | v0.5 실제 상태                                              | v0.6-alpha 조치                               |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------- |
| UX-001            | 일부 버튼은 텍스트가 있으나 tooltip·일관된 접근성 이름 없음 | accessible name·tooltip 추가                  |
| UX-002            | Viewport·flat list·Inspector 단일 Mesh 동기화만 존재        | UUID 기반 Viewport·Hierarchy·Inspector 동기화 |
| UX-003            | 새 작업·열기·이탈 시 확인 없음                              | dirty 확인 구현                               |
| UX-004            | 실행 불가 명령 disabled·이유 없음                           | command capability와 이유 표시                |
| UX-005            | status 문자열만 존재                                        | typed AppError와 복구 행동                    |
| UX-006            | 1366×768에서 좌우 폭 고정, overflow 가능                    | 최소 화면 검수                                |
| UX-007            | input 중 Ctrl+S가 실행됨                                    | focus guard 수정                              |
| FR-001~003        | 6종 존재, 이름·초기 위치 규칙 불일치                        | Schema 기본값·형상별 이름 규칙 적용           |
| FR-010~014        | builder 12개, 8개 UI 미노출, Root 없음, 다수 triangle 초과  | registry 기반 20종과 Root·Part fixture        |
| FR-020~025        | 단일 선택만 존재                                            | Shift 다중 선택과 명령 제한                   |
| FR-030~033        | Transform·Inspector 존재, 유효성 검증 불충분                | finite/range 검증과 Command commit            |
| FR-034            | 단일 Mesh clone, UUID 없음                                  | subtree UUID remap                            |
| FR-035            | 단일 Mesh delete, lock 없음                                 | subtree atomic delete·locked 차단             |
| FR-036            | 단일 Mesh Ground Align                                      | 단일 object/group world bounds                |
| FR-037            | 이름 길이·제어문자·XSS 방어 없음                            | Unicode plain text 검증·textContent           |
| FR-040~046        | Group·Hierarchy 없음                                        | world Transform 보존 Group/Ungroup            |
| FR-050~052        | Visible·Locked 없음                                         | inheritance와 Command 구현                    |
| FR-060~062        | color·roughness·metalness만 존재                            | opacity·wireframe·flatShading·side 추가       |
| FR-070~078        | snapshot 60단계, 일부 명령만 기록, dirty 없음               | Command 100단계·merge·revision                |
| FR-080~087        | 비표준 flat JSON, transactional load 없음                   | Schema v2·semantic validation·migration       |
| FR-090~096        | binary GLB 성공, Validator·엔진 검수 없음                   | filter·reload·Validator·engine smoke          |
| FR-100            | Orbit/Pan/Zoom, Front·Top·Perspective만 존재                | 7개 view preset 완성                          |
| FR-101            | F frame 없음                                                | 구현                                          |
| FR-102            | Q/W/E/R 존재                                                | 보존                                          |
| FR-103            | Ctrl+G·Ctrl+Shift+G 없음                                    | 구현                                          |
| FR-104            | 객체·triangle·선택 표시, current tool 불완전                | 상태바 완성                                   |
| FR-105            | Ctrl+S가 성공 여부와 무관하게 preventDefault                | 성공 시작 시점 정책 구현                      |
| DR-001~010        | 실행 가능한 Schema와 semantic validation 없음               | authoritative Schema 연동                     |
| NFR-COMP-001~005  | CDN 연결 시 Chromium 실행, WebGL2 안내 없음                 | Chrome·Edge·WebGL2 검수                       |
| NFR-PERF-001~008  | 측정 harness 없음                                           | 기준 Scene 측정                               |
| NFR-REL-001~004   | loader 부분 변경 가능, History 불완전                       | transactional state                           |
| NFR-SEC-001~011   | CDN, inline script, innerHTML 사용자 삽입, 검증 없음        | local bundle·CSP·안전한 DOM·resource limit    |
| NFR-A11Y-001~005  | modal·focus 관리·상태 전달 미흡                             | keyboard·focus·contrast 검수                  |
| NFR-MAINT-001~005 | DOM·Three.js·state 완전 결합                                | Domain/Application/Adapter 분리               |

## 12. 문서와 원본의 충돌·차이

### 12.1 차단하지 않는 차이

- 문서가 요구하는 20종은 v0.5의 12 builder를 대체·확장하는 신규 요구사항이다.
- v0.5 빠른 템플릿의 잘못된 ID는 기존 의도와 실행 결과가 불일치하는 명백한 결함이므로 v0.6에서 수정한다.
- v0.5 60단계 History를 문서 기준 100단계 Command History로 교체한다.
- v0.5 CDN·inline module은 NFR-SEC 기준에 따라 local npm bundle로 교체한다.
- v0.5 flat list·flat 저장은 v1.2 Hierarchy·Schema v2로 migration한다.
- v0.5 `plane`은 얇은 Box지만 v2 Schema의 `plane`은 `PlaneGeometry` 의미다. legacy migration에서는 기존 외형 보존 여부를 fixture로 기록한다.

### 12.2 B-002: 승인 및 해제

관련 요구사항:

- Schema `$defs.geometry`
- FR-084
- FR-085
- DR-005~010
- NFR-REL-001
- WRK-002
- SAD 10.2

충돌:

1. v0.5 `rock`은 `IcosahedronGeometry(1.2,1)`이다.
2. v0.5 저장 파일은 `"type": "rock"`을 생성할 수 있다.
3. Schema v2는 `rock` 또는 custom geometry를 허용하지 않는다.
4. v0.5 user data와 외형을 그대로 보존하면서 현재 Schema v2를 통과하는 표현이 없다.

검토한 결정:

| 선택                                            | 결과                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| A. Schema v2에 `icosahedron` 추가               | 외형·triangle·사용자 데이터 보존 가능. 최우선 기준 Schema 변경 승인 필요  |
| B. `rock`을 flat-shaded Sphere로 근사 migration | 현재 Schema 유지. 외형과 topology가 달라지는 승인된 손실 필요             |
| C. `rock` 포함 v0.5 파일 거부                   | 추측·손실 없음. v0.5 migration 범위가 축소되어 FR-084 인수 기준 수정 필요 |

**A가 승인됐다.** Sphere 근사와 rock 포함 파일 거부는 사용자 데이터 무손실 보존 및 하위 호환성 원칙 때문에 기각했다. Schema, migration, fixture, GLB round-trip, 실행 화면 검증을 Gate 5에 연결한다.

## 13. Gate 0 체크 결과

| Gate 0 항목                           | 상태 | 조사 결과                                                         |
| ------------------------------------- | ---- | ----------------------------------------------------------------- |
| G0-01 전체 파일·Git·hash 기록         | 통과 | archive와 2개 파일 목록·SHA-256 기록                              |
| G0-02 실행 방법·browser·Three.js 확인 | 통과 | local HTTP 실행, Three.js 0.181.1 CDN 확인                        |
| G0-03 현재 기능·단축키 실제 검수      | 통과 | 생성·선택·History·복제·삭제·export 실행                           |
| G0-04 기존 템플릿 12종 조사           | 통과 | builder·Part·triangle·UI 노출·thumbnail 조사                      |
| G0-05 v0.5 JSON·GLB 샘플 확보         | 통과 | JSON fixture와 원본 exporter의 cube·oak·sword binary GLB 3종 동결 |
| G0-06 결합도·History·저장·export 분석 | 통과 | 단일 HTML 결합과 흐름 기록                                        |
| G0-07 알려진 오류 재현                | 통과 | 빠른 템플릿 3종 ID 불일치, History·보안·loader 오류 기록          |

Gate 0 원본 누락과 제품 충돌은 모두 해제됐다. Gate 1~7 진행 조건을 충족한다.

## 14. 알려진 v0.5 오류

| ID      | 재현                               | 실제 결과                     | 영향                    |
| ------- | ---------------------------------- | ----------------------------- | ----------------------- |
| V05-001 | 빠른 템플릿 `저폴리 나무` 클릭     | 객체 0, 성공처럼 status 표시  | 주요 템플릿 미생성      |
| V05-002 | 빠른 템플릿 `바위` 클릭            | 객체 0                        | 동일                    |
| V05-003 | 빠른 템플릿 `포션` 클릭            | 객체 0                        | 동일                    |
| V05-004 | Primitive 생성 후 Ctrl+Z           | 생성 전 상태로 돌아가지 않음  | History 신뢰성          |
| V05-005 | Transform/Inspector 변경 후 Ctrl+Z | 변경이 복원되지 않음          | 데이터 편집 회귀        |
| V05-006 | 프로젝트 열기 중 잘못된 object     | 기존 Scene을 먼저 clear       | 데이터 손실 가능        |
| V05-007 | 이름에 HTML 입력                   | Scene list `innerHTML`에 삽입 | XSS 가능                |
| V05-008 | input 편집 중 Ctrl+S               | 프로젝트 저장 실행            | focus 충돌              |
| V05-009 | Undo/Redo                          | selection 해제                | 사용자 흐름 단절        |
| V05-010 | 12 builder 조사                    | 8개가 UI에 연결되지 않음      | 문서와 실제 노출 불일치 |

## 15. Gate 0 변경·검증 기록

### 생성·갱신 파일

- `docs/BASELINE_REPORT.md`
- `docs/assets/v05-oak-runtime.png`
- `tests/fixtures/v05/v05-cube.json`
- `tests/fixtures/v05/v05-oak.json`
- `tests/fixtures/v05/v05-sword.json`
- `tests/fixtures/v05/v05-rock.json`
- `tests/fixtures/v05/glb/v05-cube.glb`
- `tests/fixtures/v05/glb/v05-oak.glb`
- `tests/fixtures/v05/glb/v05-sword.glb`

### 실행 검증

- ZIP 안전성·entry inventory
- archive와 파일 SHA-256
- 원본 source 정적 분석
- Chrome 계열 실제 실행
- Primitive 6종 생성
- 참나무 생성·Undo·Redo
- 선택·복제·삭제·Undo
- 잘못 연결된 빠른 템플릿 재현
- GLB exporter 실행과 console error 확인
- v1.2 요구사항 ID 교차검토

### 미완료·실패·skipped

- Gate 0 필수 검수 skipped: 0
- v0.5 GLB binary sample 3종 보관 및 Khronos Validator 오류·경고 0건
- Gate 0 차단 이슈: 0건

### 원본 대비 변경 동작

- 제품 원본 동작 변경 없음
- frozen 원본 ZIP과 분석용 전개본을 분리
- v0.5 저장 payload를 회귀 fixture로 추가

### 다음 작업

1. Gate 1 도구 체인·설계·ADR
2. Gate 2 앱 셸과 테스트 기반
3. Gate 3 편집·Command·Hierarchy
4. Gate 4 템플릿 20종
5. Gate 5 Schema·migration·GLB
6. Gate 6 비기능 검수
7. Gate 7 문서화·인수
