# ADR-004: parentId 계층과 matrix 기반 Group/Ungroup

- 상태: Accepted
- 날짜: 2026-07-30

## 결정

flat object 배열과 nullable `parentId`로 계층을 저장한다. Group은 같은 부모의 top-level selection만 허용하고 world bounds 중심을 pivot으로 쓴다. reparent 전후 matrix 오차가 `1e-6` 이하일 때만 commit한다.

## 근거

중첩 transform을 position 차감만으로 처리하면 rotation·비균일 scale에서 world transform이 변한다.

## 결과

cycle, 다른 부모 그룹화, shear가 필요한 분해는 거부된다. group만 parent가 될 수 있으며 semantic validator가 파일 입력에도 같은 규칙을 적용한다.
