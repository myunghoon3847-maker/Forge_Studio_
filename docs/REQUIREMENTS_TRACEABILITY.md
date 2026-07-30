# Forge Studio v0.6-alpha Requirements Traceability

| 요구사항          | 구현                                                  | 자동 검증              | 상태              |
| ----------------- | ----------------------------------------------------- | ---------------------- | ----------------- |
| UX-001~007        | `index.html`, `styles.css`, `EditorApp`               | AT-003/004/018/020     | 통과              |
| FR-001~003        | `model`, `EditorService`, `ObjectViewFactory`         | AT-001                 | 통과              |
| FR-010~014        | `TemplateRegistry`                                    | AT-002, AT-019         | 통과              |
| FR-020~025        | `EditorService.select/capability`, adapter            | AT-003/004/020         | 통과              |
| FR-030~037        | transform/material/name/edit Commands                 | AT-005~007/017/020     | 통과              |
| FR-040~046        | `math`, `sceneGraph`, Group/Ungroup                   | AT-008/009/020         | 통과              |
| FR-050~052        | effective visible/locked                              | AT-010/019             | 통과              |
| FR-060~062        | MeshStandard material model/factory                   | AT-005/013/019         | 통과              |
| FR-070~078        | `CommandManager` revision/history                     | AT-007/011/012         | 통과              |
| FR-080~087        | serializer/loader/validator/migration                 | AT-013~017/020         | 통과              |
| FR-084 rock 호환  | `icosahedron`, `migrateV05`                           | AT-014/019, ADR-008    | 통과              |
| FR-090~095        | independent GLB export Scene                          | AT-019/020             | 통과              |
| FR-096            | Godot·Unity actual import                             | UAT-09                 | **미실행—KI-001** |
| FR-100~105        | adapter views/frame, shortcuts, status                | AT-018/020             | 통과              |
| DR-001~010        | `project.schema.v2.json`, semantic validator          | AT-013~017             | 통과              |
| NFR-COMP-001~005  | WebGL2 guard, Chrome/Edge config                      | AT-020                 | 통과              |
| NFR-PERF-001~008  | performance fixture/harness                           | 5분 production 측정    | 통과              |
| NFR-REL-001~004   | transactional command/load/export                     | AT-007~019/020         | 통과              |
| NFR-SEC-001~011   | CSP, static validator, safe DOM, audit                | AT-015~020, audit      | 통과              |
| NFR-A11Y-001~005  | labels, focus-visible, native dialog, non-color state | AT-020                 | 통과              |
| NFR-MAINT-001~005 | layer boundary, registry, exact lock                  | architecture/unit/lint | 통과              |

## AT-001~020

| ID     | 테스트 파일                               | 결과                               |
| ------ | ----------------------------------------- | ---------------------------------- |
| AT-001 | `editor-core.test.js`                     | 통과                               |
| AT-002 | `templates.test.js`, `glb-export.test.js` | 20/20 통과                         |
| AT-003 | `editor-core.test.js`, Chrome·Edge E2E    | 통과                               |
| AT-004 | `editor-core.test.js`, Chrome·Edge E2E    | 통과                               |
| AT-005 | `editor-core.test.js`, E2E Inspector      | 통과                               |
| AT-006 | `editor-core.test.js`                     | 통과                               |
| AT-007 | `editor-core.test.js`                     | 통과                               |
| AT-008 | `editor-core.test.js`                     | 오차 ≤1e-6                         |
| AT-009 | `editor-core.test.js`, project validator  | 통과                               |
| AT-010 | `editor-core.test.js`, GLB filter         | 통과                               |
| AT-011 | `editor-core.test.js`                     | 100단계·merge·redo branch 통과     |
| AT-012 | `editor-core.test.js`, E2E save           | 통과                               |
| AT-013 | `project-io.test.js`                      | 통과                               |
| AT-014 | `project-io.test.js`, E2E rock            | 통과                               |
| AT-015 | `project-io.test.js`, E2E corrupted file  | 통과                               |
| AT-016 | `project-io.test.js`                      | UUID/parent/cycle/depth/count 통과 |
| AT-017 | `project-io.test.js`, E2E literal XSS     | 통과                               |
| AT-018 | `shortcut.test.js`, E2E input focus       | 통과                               |
| AT-019 | `glb-export.test.js`                      | Validator errors/warnings 0        |
| AT-020 | `editor.spec.js`                          | Chrome 4/4, Edge 4/4               |

필수 자동 테스트 skipped는 0건이다.

## Gate

| Gate | 증거                                                     | 상태                             |
| ---- | -------------------------------------------------------- | -------------------------------- |
| 0    | `BASELINE_REPORT.md`, v0.5 JSON/GLB, SHA-256, 화면       | 통과                             |
| 1    | lockfile, `.nvmrc`, Architecture, Migration, ADR-001~008 | 통과                             |
| 2    | Vite shell, lint/format/unit/E2E, Chrome·Edge            | 통과                             |
| 3    | AT-001, AT-003~012                                       | 통과                             |
| 4    | AT-002, template catalog, 20 GLB reload                  | 통과                             |
| 5    | AT-013~019, Validator                                    | G5-08만 미실행                   |
| 6    | AT-020, performance, security, accessibility             | 통과                             |
| 7    | 문서·license·traceability·checklist                      | public deploy 승인과 UAT-09 대기 |
