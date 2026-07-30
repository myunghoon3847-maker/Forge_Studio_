# `.forge.json` Schema v2

권위 원본은 저장소 root의 `project.schema.v2.json`이다. Draft 2020-12를 사용하며 root의 `schemaVersion`은 정수 `2`다.

## Geometry

지원 kind는 `box`, `sphere`, `cylinder`, `cone`, `plane`, `torus`, `icosahedron`이다. 각 geometry는 `{ "kind", "parameters" }`이고 추가 필드를 허용하지 않는다.

`icosahedron` 최소 표현:

```json
{
  "kind": "icosahedron",
  "parameters": {
    "radius": 1.2,
    "detail": 1
  }
}
```

- `radius`: finite number, `0.000001`보다 크고 `10000` 이하
- `detail`: 0 이상 정수, 자원 고갈 방지를 위해 v0.6-alpha에서 최대 5

## Object

공통 필드는 UUID `id`, `group|mesh` type, 1~120자 plain-text name, nullable `parentId`, visible, locked, transform, optional editor metadata다. Mesh는 geometry와 MeshStandard material이 필수다.

Transform은 Position meter 3-vector, XYZ radian rotation, 양수 Scale 3-vector다. 저장 JSON에는 `NaN` 또는 `Infinity`를 허용하지 않는다.

## Semantic validation

Schema 다음에 다음 규칙을 검사한다.

- UUID 중복 금지
- 존재하지 않는 parent 금지, parent는 group만 허용
- cycle 금지, 최대 깊이 64
- 최대 객체 5,000개
- template Root/Part reference 무결성
- 이름의 제어문자 금지

standalone validator는 `npm run schema:generate`로 생성한다. Schema 변경 후 생성 파일과 Schema test를 함께 갱신해야 한다.
