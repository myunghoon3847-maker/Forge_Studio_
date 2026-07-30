# ADR-007: Domain에서 독립 GLB export Scene 생성

- 상태: Accepted
- 날짜: 2026-07-30

## 결정

editor Scene을 직접 serialize하지 않고 Domain object에서 별도 Three.js Scene을 만든다. effective hidden subtree를 제외하고 visible locked object는 포함한다. userData와 editor helper는 포함하지 않는다.

## 근거

직접 export는 camera, Grid, Gizmo, lock metadata 유출과 runtime selection state 결합 위험이 있다.

## 결과

binary GLB는 +Y Up, +Z Front, meter 기준을 유지한다. GLTFLoader round-trip과 공식 Khronos Validator를 자동 실행한다.
