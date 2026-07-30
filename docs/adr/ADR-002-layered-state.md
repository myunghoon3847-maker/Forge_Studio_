# ADR-002: Domain state를 영구 편집 원본으로 사용

- 상태: Accepted
- 날짜: 2026-07-30

## 결정

plain-data Domain state를 유일한 영구 원본으로 사용한다. Three.js Object3D와 DOM은 store 구독으로 재구축되는 view다. Domain과 Application 모듈은 DOM·Three.js를 import하지 않는다.

## 근거

v0.5는 Mesh, DOM, 저장 데이터가 결합돼 History·migration·validation을 독립 검증할 수 없었다.

## 결과

Command와 IO를 headless unit test할 수 있다. Scene이 바뀔 때 ObjectView를 재구축하므로 대규모 Scene 최적화는 이후 측정 기반으로 진행한다.
