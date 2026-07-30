# ADR-001: npm·Vite 기반 고정 도구 체인

- 상태: Accepted
- 날짜: 2026-07-30

## 결정

Node `24.14.0` Active LTS, npm `11.9.0`, Vite `8.2.0`, Three.js `0.181.1`, Vitest `4.1.10`, Playwright `1.62.0`을 exact version과 `package-lock.json`으로 고정한다. package manager는 npm 하나만 사용한다.

## 근거

v0.5의 CDN·단일 HTML은 offline 재현, CSP, 테스트, dependency audit가 어렵다. Three.js는 외형 회귀를 줄이기 위해 v0.5와 같은 `0.181.1`을 유지한다.

## 결과

`npm ci`, build, unit, Chrome·Edge E2E가 재현된다. Node major 업그레이드는 별도 ADR과 회귀 검수를 요구한다.
