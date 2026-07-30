# Security and Privacy Review

## 입력 경계

파일 확장자, UTF-8 byte 크기 20MB, JSON parse, schema version, migration, standalone Schema, semantic graph validation 순서를 적용한다. 실패하면 현재 state와 history를 교체하지 않는다.

이름과 metadata는 `textContent`로 출력한다. 사용자 문자열을 `innerHTML`, URL fetch, script, module, HTML로 실행하지 않는다. `__proto__`, `prototype`, `constructor` own key는 validation 전에 거부한다.

## 실행 정책

- `eval`, `new Function`, inline script 없음
- Ajv는 build-time standalone validator
- runtime CDN·외부 request 없음
- telemetry, analytics, 광고, 프로젝트 업로드 없음
- object URL은 download click 뒤 해제
- CSP response header에 `frame-ancestors 'none'` 포함

Playwright는 Chrome·Edge scenario에서 console error, page error, 외부 origin request를 수집하며 0건을 확인한다.

## Dependency audit

2026-07-30 `npm audit --json` 결과:

| Info | Low | Moderate | High | Critical | Total |
| ---: | --: | -------: | ---: | -------: | ----: |
|    0 |   0 |        0 |    0 |        0 |     0 |

dependency metadata: production 8, development 316, optional 36, 전체 323. 전체 설치 tree의 라이선스 288건은 `THIRD_PARTY_LICENSES.md`에 있고 UNKNOWN/UNLICENSED는 0건이다.

## 접근성

toolbar, dialog, form control은 접근 가능한 이름을 가지며 `:focus-visible` outline을 표시한다. native modal dialog가 focus를 내부에 유지하고 Escape 후 실행 버튼으로 복귀하는 것을 Chrome·Edge에서 검증한다. 선택은 텍스트·border, 오류는 role=alert·코드, 잠금/표시는 아이콘·title·Inspector text를 함께 사용한다.

다크 UI의 일반 본문 `#e8eaf0`/`#191c22`는 WCAG AA 목표를 만족하는 높은 대비 조합이다. muted text는 큰 도움말/보조 상태에 제한한다.
