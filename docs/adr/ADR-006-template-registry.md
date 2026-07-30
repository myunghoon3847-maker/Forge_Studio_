# ADR-006: data-driven TemplateRegistry

- 상태: Accepted
- 날짜: 2026-07-30

## 결정

20종 템플릿을 category, palette, triangle limit, Part geometry/material/transform 데이터로 등록한다. build 결과는 metadata가 있는 Root group과 Part Mesh다.

## 근거

v0.5의 조건 분기 builder와 UI ID 불일치 때문에 12종 중 8종이 노출되지 않았고 신규 템플릿 추가가 editor core 변경을 요구했다.

## 결과

새 템플릿은 registry 정의만으로 추가할 수 있다. fixture가 수량, Root/Part, triangle, Y=0, palette를 일괄 검사한다.
