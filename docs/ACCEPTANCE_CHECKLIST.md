# Forge Studio v0.6-alpha Acceptance Checklist

- 판정일: 2026-07-30
- 전체 판정: **완료 아님—외부 검수 1건과 배포 라이선스 결정 대기**

## 제품과 자동 검증

- [x] Blocker·Critical·Major 재현 제품 결함 0건
- [x] AT-001~020 전체 통과
- [x] 필수 테스트 skipped 0건
- [x] 20종 template fixture 및 GLB reload 통과
- [x] v0.5 migration과 Schema v2 round-trip 통과
- [x] 손상 JSON, 상위 version, 20MB 초과, invalid graph 처리 통과
- [x] `icosahedron` radius/detail와 rock data 보존 통과
- [x] GLB GLTFLoader reload 및 Khronos Validator errors/warnings 0
- [ ] Godot·Unity actual editor smoke — KI-001
- [x] Windows Chrome E2E 4/4
- [x] Windows Edge E2E 4/4
- [x] 기준 Scene 성능 NFR-PERF-001~008 통과
- [x] CSP violation, unhandled rejection, 반복 console error 0
- [x] High/Critical dependency 취약점 0

## 문서와 버전

- [x] source/package/document version `0.6.0-alpha`
- [x] README와 사용자·개발·배포 안내
- [x] Architecture와 ADR-001~008
- [x] Schema와 migration mapping
- [x] Shortcut, Template, Test, Performance, Security
- [x] THIRD_PARTY_LICENSES
- [x] Known Issues, Regression Matrix
- [x] Requirements Traceability
- [ ] public production deployment license decision — KI-002

## UAT

| ID     | 결과   | 증거                             |
| ------ | ------ | -------------------------------- |
| UAT-01 | 통과   | template fixture/E2E             |
| UAT-02 | 통과   | service test/E2E Inspector       |
| UAT-03 | 통과   | world transform error test/E2E   |
| UAT-04 | 통과   | capability/E2E disabled controls |
| UAT-05 | 통과   | history test                     |
| UAT-06 | 통과   | Schema v2 round-trip/E2E save    |
| UAT-07 | 통과   | corrupted file state unchanged   |
| UAT-08 | 통과   | hidden/locked GLB test           |
| UAT-09 | 미실행 | KI-001                           |
| UAT-10 | 통과   | Chrome·Edge 1366×768             |

UAT-09 결과가 없으므로 이 문서는 최종 인수 완료를 선언하지 않는다.
