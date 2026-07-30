# Forge Studio License and Asset Policy

Forge Studio v0.6-alpha 소스·문서·템플릿에 대한 공개 라이선스는 이 저장소가 임의로 부여하지 않는다. 제품 책임자의 별도 결정 전 외부 공개 배포와 재라이선스는 승인된 것으로 간주하지 않는다.

runtime·development 전체 dependency tree의 package, exact version, scope, SPDX/license, repository는 `THIRD_PARTY_LICENSES.md`에 있다. UNKNOWN 또는 UNLICENSED 패키지는 0건이다.

20종 template geometry는 저장소 코드로 직접 정의했다. thumbnail은 Unicode text, favicon은 저장소 소유 SVG다. 외부 model, texture, icon pack, webfont, telemetry, analytics 자산은 포함하지 않는다.

공개 배포 전 다음을 확인한다.

- 프로젝트 라이선스 결정
- `THIRD_PARTY_LICENSES.md` 동봉
- runtime dependency license와 vulnerability 재검수
- hosting CSP/security header
- 사용자 생성 콘텐츠 권리를 앱이 자동 취득하지 않는다는 정책 유지
