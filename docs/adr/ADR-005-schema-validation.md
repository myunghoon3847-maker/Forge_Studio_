# ADR-005: Schema와 semantic validation의 이중 신뢰 경계

- 상태: Accepted
- 날짜: 2026-07-30

## 결정

Draft 2020-12 `project.schema.v2.json`으로 구조·범위를 검사하고 UUID 중복, parent, cycle, depth, template reference는 semantic validator가 검사한다. validation 완료 후에만 state를 교체한다.

## 근거

JSON Schema만으로 graph 무결성을 완전히 표현할 수 없다. 반대로 수동 validator만 사용하면 형식 계약이 분산된다.

## 결과

20MB, 5,000 object, depth 64 제한을 적용한다. CSP 때문에 Ajv runtime compile은 사용하지 않고 build-time standalone validator를 commit한다.
