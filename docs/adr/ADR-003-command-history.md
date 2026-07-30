# ADR-003: Snapshot Command와 revision 기반 dirty state

- 상태: Accepted
- 날짜: 2026-07-30

## 결정

모든 영구 편집은 clone된 state에 실행하는 `SnapshotCommand`를 사용한다. 100건을 유지하고 500ms 이내 같은 merge key를 합친다. 명시적 저장 revision을 넘어 merge하지 않는다.

## 근거

v0.5의 60단계 부분 snapshot은 Transform·Inspector를 기록하지 않고 실패 원자성을 보장하지 못했다.

## 결과

실패한 producer는 store와 history를 바꾸지 않는다. 선택·camera·panel은 transient라 Undo/Redo 대상이 아니다. 대용량 Scene의 snapshot 비용은 성능 fixture로 감시한다.
