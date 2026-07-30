# Build and Deployment

## 재현 가능한 build

```powershell
npm ci
npm run build
```

산출물은 `dist/`에 생성된다. Node `24.14.0`, npm `11.9.0`, exact dependency와 `package-lock.json`을 사용한다. 앱은 정적 파일만 필요하며 서버 API, service worker, 외부 CDN은 없다.

`index.html`은 Vite 개발 진입점이므로 저장소 루트 자체를 정적 사이트로 게시하면 안 된다. production hosting에는 반드시 `dist/`의 내용만 게시한다.

## GitHub Pages

저장소에는 `.github/workflows/deploy-pages.yml`이 포함돼 있다. 이 workflow는 기본 branch의 source를 검사하고 Vite production build를 만든 다음, `dist/`만 GitHub Pages artifact로 배포한다.

1. 수정된 전체 source를 기본 branch에 push한다.
2. GitHub 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 변경한다.
3. **Actions → Deploy Forge Studio to GitHub Pages**에서 성공 여부와 배포 URL을 확인한다.
4. 기존의 **Deploy from a branch / `(root)`** 설정은 사용하지 않는다.

저장소 이름이 포함된 `https://<USER>.github.io/<REPOSITORY>/` 경로에서도 동작하도록 production asset URL은 상대 경로로 생성된다. 다음 명령은 root-absolute 경로와 개발용 `/src/` 참조를 검사하며, Chrome·Edge에서 repository subpath를 모의해 실제 초기화까지 확인한다.

```powershell
npm run verify:pages
npm run test:pages
```

화면에 서식 없는 HTML과 “WebGL2가 필요합니다”가 동시에 보이면 WebGL 오류로 단정하지 않는다. 먼저 개발용 `/src/styles.css`와 `/src/main.js`가 404인지 확인하고 Pages Source가 GitHub Actions인지 확인한다. 이 상태는 대개 루트 source가 build 없이 게시됐다는 뜻이다.

## 보안 header

production hosting은 최소 다음 header를 제공해야 한다.

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
```

Vite dev/preview는 이 header를 설정한다. `frame-ancestors`는 meta CSP로 유효하지 않으므로 hosting response header가 필수다.

GitHub Pages는 저장소별 임의 response header 설정을 제공하지 않는다. 앱의 meta CSP는 실행 코드와 외부 연결을 제한하지만 `frame-ancestors`까지 충족해야 하는 배포는 별도 header 설정이 가능한 hosting을 사용한다.

## 배포 승인 상태

`LICENSES.md` 정책에 따라 프로젝트 소스·문서·템플릿의 공개 라이선스가 아직 결정되지 않았다. 제품 책임자가 비공개·전권 보유, 승인된 오픈소스, 상용/이중 라이선스 중 하나를 결정하기 전 public production 배포는 차단한다. 이 저장소 작업은 build 가능한 로컬 납품까지이며 공개 URL을 생성하지 않는다.

외부 패키지 고지는 `THIRD_PARTY_LICENSES.md`를 함께 배포한다.
