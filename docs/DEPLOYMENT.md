# Build and Deployment

## 재현 가능한 build

```powershell
npm ci
npm run build
```

산출물은 `dist/`에 생성된다. Node `24.14.0`, npm `11.9.0`, exact dependency와 `package-lock.json`을 사용한다. 앱은 정적 파일만 필요하며 서버 API, service worker, 외부 CDN은 없다.

## 보안 header

production hosting은 최소 다음 header를 제공해야 한다.

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
```

Vite dev/preview는 이 header를 설정한다. `frame-ancestors`는 meta CSP로 유효하지 않으므로 hosting response header가 필수다.

## 배포 승인 상태

`LICENSES.md` 정책에 따라 프로젝트 소스·문서·템플릿의 공개 라이선스가 아직 결정되지 않았다. 제품 책임자가 비공개·전권 보유, 승인된 오픈소스, 상용/이중 라이선스 중 하나를 결정하기 전 public production 배포는 차단한다. 이 저장소 작업은 build 가능한 로컬 납품까지이며 공개 URL을 생성하지 않는다.

외부 패키지 고지는 `THIRD_PARTY_LICENSES.md`를 함께 배포한다.
