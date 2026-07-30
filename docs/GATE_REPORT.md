# Gate 0–7 Progress Report

## Gate 0 — 통과

- 변경: 원본 ZIP 동결, 전체 파일/SHA-256, 실제 v0.5 분석, JSON·GLB fixture, 화면 증거
- 검증: v0.5 생성·History·저장·GLB·오류 재현, 원본 GLB Validator 0/0
- 차이: 원본 변경 없음
- 미완료/skipped: 0
- 위험: B-002는 ADR-008 승인으로 해제

## Gate 1 — 통과

- 변경: Node/npm exact version, Vite/Vitest/Playwright, lockfile, layer 설계, migration mapping, ADR-001~008
- 검증: clean install 계획, production build
- 차이: CDN을 npm local bundle로 교체, Three.js revision 0.181.1 유지
- 미완료/skipped: 0
- 위험: project public license 미결정

## Gate 2 — 통과

- 변경: app shell, CSS token, EditorApp/Store/Adapter, empty/error/dialog, Chrome·Edge harness
- 검증: lint, format, build, 1366×768, accessibility names
- 원본 대비: WebGL2 안내와 recovery error UI 추가
- 미완료/skipped: 0
- 위험: 없음

## Gate 3 — 통과

- 변경: Primitive, selection, Transform, edit Commands, Group/Ungroup, Hierarchy, Visible/Locked, 100 history, shortcuts
- 검증: AT-001, AT-003~012, world error ≤1e-6, Chrome·Edge flow
- 원본 대비: SRS 제한 다중 선택, Command/dirty state
- 미완료/skipped: 0
- 위험: shear가 필요한 reparent는 복구 가능한 오류로 거부

## Gate 4 — 통과

- 변경: 5 nature, 4 building, 6 prop, 4 weapon, 1 character template, 검색/category
- 검증: 20/20 fixture, triangle/pivot/Y=0, 20/20 GLB reload
- 원본 대비: UI 노출 4종에서 정상 20종으로 확장
- 미완료/skipped: 0
- 위험: 없음

## Gate 5 — 조건부

- 변경: Schema v2, static validator, semantic validator, serializer/loader, v0.5 migration, filtered GLB
- 검증: AT-013~019, v0.5 rock, 20MB/version/graph, GLTFLoader, Khronos errors/warnings 0
- 원본 대비: transactional load와 `icosahedron` 정식 타입
- 미완료/skipped: G5-08 Godot·Unity actual editor smoke
- 위험: KI-001. 표준 GLB 검증은 통과했으나 엔진별 importer 결과 미확정

## Gate 6 — 통과

- 변경: CSP header, build-time Schema codegen, external-request/console audit, performance harness, dependency/license scan
- 검증: Chrome/Edge 8/8, NFR-PERF 8/8, audit 0 vulnerabilities, console/external request 0
- 원본 대비: runtime CDN·inline module·unsafe DOM 제거
- 미완료/skipped: 0
- 위험: 비압축 JS chunk warning은 non-blocking backlog

## Gate 7 — 조건부

- 변경: README, User, Architecture, Schema, Migration, Template, Shortcut, Test, Performance, Security, Deployment, License, Known Issues, Traceability, Acceptance, Regression 문서
- 검증: version 정합성, production build, 문서 경로
- 원본 대비: 재현 가능한 설치·검수·배포 지침
- 미완료/skipped: UAT-09, public production license decision
- 위험: KI-001, KI-002가 해결되기 전 전체 완료/배포 승인으로 표현하지 않음
