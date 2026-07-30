# Forge Studio v0.6-alpha 사용자 안내

## 시작

왼쪽의 템플릿 또는 Primitive를 누르면 Scene root에 생성된다. 템플릿은 Root가 선택되며 Hierarchy를 펼쳐 Part를 직접 선택할 수 있다. viewport의 빈 곳을 누르면 선택이 해제되고 Shift+클릭은 선택을 추가하거나 제거한다.

## 편집

- Q/W/E/R 또는 toolbar에서 Select, Move, Rotate, Scale을 고른다.
- Inspector Position은 meter, Rotation 표시는 degree, Scale은 양수 배율이다. 저장 값의 회전은 XYZ radian이다.
- 이름과 MeshStandard 재질의 color, roughness, metalness, opacity, wireframe, flat shading을 Inspector에서 수정한다.
- Ground Align은 world bounding box의 최저점을 Y=0으로 이동한다.
- Hierarchy의 눈·자물쇠 버튼 또는 toolbar로 Visible·Locked를 바꾼다. 부모 상태는 subtree에 상속된다.

다중 선택에서는 Group, Delete, Duplicate, Lock, Hide만 허용된다. Move, Rotate, Scale, Rename, Ground Align, 재질 입력은 비활성화되며 Inspector에 이유가 표시된다.

## 계층

같은 부모 아래의 두 개 이상 항목만 Group할 수 있다. 조상과 자식이 동시에 선택되면 조상만 대상으로 정규화한다. Group/Ungroup은 가능한 경우 각 자식의 world transform을 `1e-6` 이내로 유지하며, shear 없이는 보존할 수 없는 조합은 상태 변경 없이 거부한다.

## 저장과 열기

저장은 `<project-name>.forge.json`을 내려받는다. 파일은 Schema v2와 semantic validator를 모두 통과한 뒤에만 Scene을 교체한다. 최대 파일 크기는 20MB, 객체는 5,000개, 계층 깊이는 64다.

v0.5 JSON을 열면 별도 migration이 실행된다. `rock`은 `icosahedron`으로 보존되며 필드가 없으면 기존 생성 코드의 `radius=1.2`, `detail=1`을 사용한다. 오류가 나면 현재 프로젝트는 유지된다.

## GLB

GLB 내보내기는 visible Mesh와 계층·local transform·PBR 재질을 포함한다. hidden subtree, camera, Grid, Helper, Gizmo, lock/editor metadata는 제외한다. 좌표 기준은 오른손, +Y Up, +Z Front, meter다.

## 미저장 변경

Command 이후 상태는 “저장 안 됨”으로 표시된다. 마지막 저장 revision으로 Undo하면 다시 “저장됨”이 된다. 미저장 상태에서 새 프로젝트 또는 열기를 선택하면 변경사항 확인 dialog가 열린다.
