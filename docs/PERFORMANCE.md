# Performance Report

- 측정일: 2026-07-30
- production build, system Chrome 150 headless
- Windows build `26200.8875`
- CPU: Intel Core i5-1240P, 16 logical cores
- GPU: Intel Iris Xe, ANGLE D3D11
- RAM class: 8GiB
- power profile: Samsung Mode
- viewport: 1920×1080, DPR 1, zoom 100%

## 기준 Scene

`tests/fixtures/v2/performance-scene.forge.json`은 Mesh 200개, 100,000 triangles, 30개 고유 MeshStandard material 값, texture 0개다. sphere 1개당 500 triangles를 20×10 grid로 배치한다.

## 방법

production preview를 새 system Chrome process에서 연다. cold start, fixture load, save download, rename response, Undo/Redo를 측정한다. 10초 warm-up 후 pointer Orbit 경로에서 60초간 `requestAnimationFrame` 3,600개를 수집한다. 총 5분 동안 같은 Scene을 조작한 뒤 새 Chrome process tree의 working set과 JS heap을 기록한다.

## 결과

| NFR                      |   기준 |              측정 | 판정 |
| ------------------------ | -----: | ----------------: | ---- |
| PERF-001 average FPS     |    ≥30 |            59.992 | 통과 |
| PERF-002 p95 frame time  |  ≤50ms |            16.8ms | 통과 |
| PERF-003 cold start      |    ≤5s |           563.5ms | 통과 |
| PERF-004 save            |    ≤2s |           117.9ms | 통과 |
| PERF-005 load            |    ≤5s |           441.4ms | 통과 |
| PERF-006 Undo/Redo       | ≤500ms |     191.9/132.8ms | 통과 |
| PERF-007 input response  | ≤150ms |            37.6ms | 통과 |
| PERF-008 5분 working set |  <1GiB | 678,854,656 bytes | 통과 |

5분 종료 JS heap은 24,668,457 bytes였고 runtime console/page error는 0건이다. 원시 결과는 `docs/evidence/performance-results.json`에 있다.

production bundle은 단일 JS 약 748KB, gzip 약 180KB이며 Vite의 500KB 비압축 chunk warning이 있다. cold start와 기준 Scene 성능은 통과했으므로 v0.6-alpha의 release defect로 분류하지 않고 향후 code splitting backlog로 기록한다.
