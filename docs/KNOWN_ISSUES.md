# Known Issues and Release Blockers

## 검증 차단

### KI-001: Godot·Unity editor import smoke 미실행

- 관련: FR-096, UAT-09, G5-08
- 환경: 이 머신에서 `godot` executable과 Unity Editor를 찾지 못했다. Unity Hub 이름의 폴더만 있고 실행 가능한 editor 설치는 확인되지 않았다.
- 영향: Khronos Validator·GLTFLoader가 통과해 표준 GLB 무결성은 확인했지만 실제 엔진의 hierarchy·meter·front·material import를 승인할 수 없다.
- 재현: `Get-Command godot, unity, unityhub`와 일반 설치 경로 검사 결과 editor 없음.
- 시도: system PATH와 `C:\Program Files\Godot*`, `C:\Program Files\Unity*` 검사.
- 권장: 승인된 Godot/Unity 버전이 설치된 검수 머신에서 `tests/fixtures/v05/glb`와 v0.6 export를 import하고 UAT-09 기록.

### KI-002: 공개 production 배포 라이선스 결정 필요

- 관련: LICENSES 정책, G7 배포
- 영향: 로컬 build와 납품 source는 가능하지만 public URL 공개와 재라이선스는 승인되지 않았다.
- 권장: 제품 책임자가 비공개·전권 보유, 오픈소스, 상용/이중 라이선스 중 하나를 기록한 뒤 배포.

## Non-blocking backlog

### KI-003: production JS 비압축 chunk warning

- 측정: 약 748KB, gzip 약 180KB
- 영향: Vite 500KB warning. 기능 오류가 아니며 cold start 563.5ms, 기준 Scene 59.99 FPS로 성능 기준 통과.
- 권장: 다음 버전에서 GLB exporter/validator 경계를 dynamic import로 분리 검토.

## 제품 결함

현재 자동 검수에서 재현되는 Blocker, Critical, Major 제품 결함은 0건이다. KI-001은 외부 검수 환경 부재로 인한 release verification gap이며 해결 전 “전체 인수 완료”로 표현하지 않는다.
