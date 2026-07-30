# Forge Studio v0.6-alpha

Forge Studio는 Godot·Unity용 저폴리 에셋을 브라우저에서 조립하고 `.forge.json` 또는 binary GLB로 저장하는 로컬 편집기다. v0.6-alpha는 v0.5의 흐름을 유지하면서 Domain state, Three.js view, DOM UI, Command history, project IO를 분리했다.

## 요구 환경

- Windows 10 또는 11
- Chrome 또는 Edge 최신 안정 버전과 WebGL2
- Node.js `24.14.0` Active LTS
- npm `11.9.0`

정확한 버전은 `.nvmrc`, `package.json`, `package-lock.json`에 고정돼 있다.

## 설치와 실행

```powershell
npm ci
npm run dev
```

표시된 `http://127.0.0.1:5173` 주소를 Chrome 또는 Edge에서 연다. 런타임 CDN, 서버, 계정, telemetry는 사용하지 않는다.

## 빌드와 검증

```powershell
npm run build
npm run test:pages
npm run test:all
npm run audit
npm run licenses
```

`test:pages`는 GitHub Pages 저장소 하위 경로를 모의해 production CSS·JavaScript·WebGL2 초기화를 Chrome·Edge에서 확인한다. `test:all`은 lint, format, 46개 unit/integration test, production build와 artifact 검사, Chrome·Edge E2E를 순서대로 실행한다. 성능 기준 Scene의 5분 검수는 별도로 실행한다.

```powershell
npm run performance
```

## 주요 기능

- Primitive 6종과 data-driven 템플릿 20종
- 단일 선택, Shift 다중 선택, Hierarchy·Inspector·Gizmo 동기화
- Duplicate, Delete, Rename, Ground Align, Group/Ungroup, Visible, Locked
- Command 기반 최대 100단계 Undo/Redo와 dirty state
- Schema v2 `.forge.json`, semantic validation, v0.5 migration
- `icosahedron` 정식 geometry와 v0.5 rock 무손실 migration
- hidden subtree와 editor helper를 제외하는 binary GLB

다중 선택에서는 Group, Delete, Duplicate, Lock, Hide만 사용할 수 있다. Transform과 Inspector 수치 입력은 단일 객체 또는 단일 그룹에만 활성화된다.

## 문서

- 사용자 안내: `docs/USER_GUIDE.md`
- 아키텍처: `docs/ARCHITECTURE.md`
- Schema: `docs/SCHEMA.md`
- v0.5 migration: `docs/MIGRATION_MAPPING.md`
- 단축키: `docs/SHORTCUTS.md`
- 테스트: `docs/TESTING.md`
- 성능: `docs/PERFORMANCE.md`
- 보안: `docs/SECURITY.md`
- 배포: `docs/DEPLOYMENT.md`
- 알려진 문제: `docs/KNOWN_ISSUES.md`
- 요구사항 추적: `docs/REQUIREMENTS_TRACEABILITY.md`
- 인수 체크리스트: `docs/ACCEPTANCE_CHECKLIST.md`

프로젝트 소스 라이선스는 아직 부여되지 않았다. 공개 배포 전 제품 책임자의 별도 라이선스 결정이 필요하며, 외부 패키지 고지는 `THIRD_PARTY_LICENSES.md`에 있다.
