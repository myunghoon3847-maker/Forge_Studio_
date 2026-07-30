# Test Strategy and Results

## 명령

```powershell
npm ci
npm run test:all
npm run audit
npm run performance
```

`test:all`은 lint → format check → Vitest → production build → system Chrome·Edge Playwright 순서다. 필수 suite에는 `skip`, `todo`, `fixme`가 없다.

## 자동 테스트

| 범위               | 파일                                                | 현재 결과                                                                                                    |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| AT-001, AT-003~012 | `tests/unit/editor-core.test.js`                    | Primitive, selection/capability, transform, duplicate/delete, Group/Ungroup, inheritance, 100 history, dirty |
| AT-002             | `tests/unit/templates.test.js`                      | 20종 fixture와 registry 확장                                                                                 |
| AT-013~018         | `tests/unit/project-io.test.js`, `shortcut.test.js` | v2, migration, hostile input, graph limit, focus guard                                                       |
| AT-019             | `tests/unit/glb-export.test.js`                     | filter, 20종 reload, rock geometry, Khronos Validator                                                        |
| AT-020             | `tests/e2e/editor.spec.js`                          | Chrome·Edge 각각 4개 scenario                                                                                |

Vitest는 5개 파일 46 test, Playwright는 8 test를 실행한다. skipped는 0건이다.

## 브라우저 환경

- OS: Windows 11 계열 25H2, build `26200.8875`
- Chrome: `150.0.7871.187`
- Edge: `150.0.4078.105`
- viewport: 1366×768, DPR 1
- Playwright: system `chrome`, `msedge` channel, headless

두 브라우저에서 생성·이름 XSS literal 표시·focus guard·다중 선택·Group/Ungroup·Undo/Redo·Schema 저장·GLB download·손상 파일 무변경·v0.5 rock migration·dialog focus·CSP header를 검증한다. console error, page error, 외부 request는 0건이어야 한다.

## GLB

GLTFLoader로 다시 열고 official npm Khronos `gltf-validator`를 실행한다. 자동 fixture 결과:

- v0.6 export: errors 0, warnings 0
- v0.5 frozen cube/oak/sword GLB: 각각 errors 0, warnings 0
- hidden subtree 제외, visible locked 포함
- editor metadata 제외
- +Y Up, +Z Front, meter

## 수동/UAT 상태

UAT-01~08과 UAT-10은 자동 E2E·integration test 및 화면 증거로 재현됐다. UAT-09 Godot·Unity 실제 editor import는 이 머신에 실행 가능한 editor가 없어 미실행이다. GLTFLoader와 Khronos Validator 대체 검증은 통과했지만 엔진 smoke를 통과로 간주하지 않는다.

## 증거

- `docs/assets/v05-oak-runtime.png`
- `docs/assets/v05-rock-visual-parity.png`
- `docs/assets/v06-rock-visual-parity.png`
- `docs/assets/v06-migrated-rock-flatshading-preservation.png`
- `docs/assets/performance-scene-200-mesh.png`
- `docs/evidence/performance-results.json`
