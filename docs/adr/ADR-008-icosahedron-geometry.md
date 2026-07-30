# ADR-008: Schema v2 정식 `icosahedron` geometry

- 상태: Accepted by product owner
- 날짜: 2026-07-30
- 관련: FR-084, FR-085, FR-090~~095, DR-005~~010, NFR-REL-001

## 상황

v0.5 `rock`은 `THREE.IcosahedronGeometry(1.2, 1)`을 사용하지만 원래 Schema v2 geometry union에는 이를 표현할 타입이 없었다.

## 결정

Schema v2에 `icosahedron`을 정식 geometry kind로 추가한다. 최소 parameters는 양의 finite `radius`와 0 이상 정수 `detail`이다. v0.6-alpha는 자원 고갈 방지를 위해 detail 최대 5를 둔다. 누락된 v0.5 값은 기존 생성 코드의 `radius=1.2`, `detail=1`로 보정한다.

마이그레이션은 position, XYZ rotation, scale, material, color, flatShading, name, hierarchy를 유지한다. ObjectViewFactory, bounds, triangle count, templates, GLB export가 같은 타입을 사용한다.

## 선택 이유

- 기존 v0.5 사용자 데이터의 무손실 보존이 스키마 최소화보다 우선한다.
- Sphere 근사 변환은 topology와 외형 손실이 발생하므로 채택하지 않는다.
- rock 포함 파일의 migration 거부는 하위 호환성 원칙에 맞지 않아 채택하지 않는다.
- `icosahedron`은 향후 Low Poly 템플릿에서도 재사용 가능한 정식 geometry 타입으로 관리한다.

## 검증

- migration 전후 `IcosahedronGeometry` position attribute 동일성
- radius/detail 누락 기본값과 invalid 범위
- name, hierarchy, transform, material, color, flatShading fixture
- GLB 재로딩 vertex count·bounding radius·material·transform
- v0.5/v0.6 실행 화면 증거

## 결과

Gate 0 B-002 충돌은 해제됐다. Schema 변경 시 standalone validator를 다시 생성해야 한다.
