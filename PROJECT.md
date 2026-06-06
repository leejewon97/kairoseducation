# Kairos Education — 프로젝트 컨텍스트

Cursor와 협업할 때 이 파일을 기준으로 합니다. AI용 상세 규칙은 [.cursor/rules/kairos-netlify.mdc](.cursor/rules/kairos-netlify.mdc)에 있습니다.

## 배포 (Netlify)

| 항목 | 값 |
|------|-----|
| **라이브 URL** | https://kairoseducation.org |
| **커스텀 도메인** | `kairoseducation.org` |
| **배포 방식** | 수동 업로드 (Netlify Git 연동 없음) |
| **게시 폴더** | `public/` |
| **빌드 명령** | `node scripts/build-origin-plain.mjs`, `node scripts/build-study-korea-plain.mjs` (npm 불필요) |

### Git vs Netlify (역할 분리)

| | Git (로컬, 본인만) | Netlify (라이브 사이트) |
|--|-------------------|-------------------------|
| **올리는 것** | 프로젝트 **전체** (`public/`, `PROJECT.md`, `.cursor/` 등) | **`public/` 폴더만** |
| **목적** | 변경 이력·롤백·Cursor 협업 | https://kairoseducation.org 반영 |

`git commit`만으로는 사이트가 바뀌지 않음. 라이브 반영은 Netlify 수동 업로드.

### 수동 배포 절차

Netlify Deploys에 **`public/` 폴더**를 드래그앤드롭.

1. [Netlify](https://app.netlify.com) → 해당 사이트 → **Deploys**
2. `public/` 폴더를 드래그앤드롭 (폴더 안 파일만 펼쳐 올리지 말 것 — `public` 폴더 자체를 끌어다 놓기).
3. **Published** 확인 후 https://kairoseducation.org 에서 `/`, `/origin.html` 등 열기

### 로컬 미리보기

```bash
cd public
npx --yes serve .
```

폼 제출은 배포된 URL에서만 Netlify로 전달됩니다.

---

## Netlify Forms

| 폼 name | 페이지 |
|---------|--------|
| `contact` | `/origin.html` (5언어 공통, hidden `language`: en/ko/zh/th/vi) |
| `study-korea` | `/study-korea.html` (5언어 공통, hidden `language`: en/ko/zh/th/vi) |

연락 폼은 `data-netlify="true"`로 제출되며, 대시보드 **Forms**에도 쌓입니다.

**이메일 알림:** 설정됨. 제출 시 `formresponses@netlify.com` → `ronkim@kairos-education.org` 으로 발송 (2026-05 테스트: `/origin.html` `contact` 폼). 본문 필드: `name`, `grade`, `email`, `universities`, `message`.

사이트에 `/.netlify/functions/emails` Function이 배포되어 있을 수 있으나, 현재 HTML 폼은 Function이 아니라 **Netlify Forms** 경로를 사용합니다.

무료 플랜: 월 제출 한도(약 100건) — [Netlify Forms 문서](https://docs.netlify.com/forms/setup/) 참고.

폼 HTML·`name`·`form-name` hidden 필드를 바꾼 뒤에는 **반드시 재배포**해야 폼이 다시 스캔됩니다.

---

## 작업 범위 (수정 요청 시 기본값)

아래를 바꿀 때는 요청 메시지에도 같이 적어 주세요.

| 항목 | 현재 기본값 |
|------|-------------|
| **콘텐츠 기준본** | [`locales/origin/en.json`](locales/origin/en.json) + [`src/templates/origin-page.njk`](src/templates/origin-page.njk) |
| **기본 수정 언어** | 요청에 명시된 언어만 (명시 없으면 물어봄) |
| **배포 담당** | 사용자 (Netlify 수동 업로드) |
| **스택** | 순수 HTML/CSS, 프레임워크 없음 |

### 공통 연락처 (5개 locale UI 동일)

- 이메일: `ronkim@kairos-education.org`
- 카카오: `http://pf.kakao.com/_uWJKX`

---

## 사이트 구조

```
public/
  index.html              # / — 언어 선택 → US / Study in KR
  origin.html             # 영문 HTML만 (빌드 결과, 직접 수정 X)
  locales/origin/*.json   # 번역 데이터 (배포 시 public/locales/origin/ 에 복사됨)
  study-korea.html        # Study in KR (영문 HTML만, 빌드 산출)
  locales/study-korea/*.json
  assets/origin-site.css
  assets/origin-locale.js
  assets/origin-i18n.js
  assets/study-korea-site.css
  assets/study-korea-locale.js
  assets/study-korea-i18n.js
  assets/kairos_logo-web.png  # 페이지 로고 (512px, 생성)
  assets/og-image.png         # OG/Twitter (1200×630, 생성)
  assets/favicon-48x48.png    # Google 검색 favicon (48px)
  assets/apple-touch-icon.png # iOS 홈 화면
  favicon.ico                 # public/ 루트 (16·32·48 multi-size)

src/assets/kairos_logo.png    # 마스터 (배포 X, generate-favicons.py 입력)

locales/origin/{en,ko,zh,th,vi}.json
locales/study-korea/{en,ko,zh,th,vi}.json
src/templates/origin-page.njk
src/templates/study-korea-page.njk
scripts/build-origin-plain.mjs
scripts/build-study-korea-plain.mjs
```

예전 `/en/`, `/ko/`, `/vi/`, `/us.html` … → [`public/_redirects`](public/_redirects) 리다이렉트.

**이미지:** 마스터 `src/assets/kairos_logo.png` → `python scripts/generate-favicons.py`로 favicon·`kairos_logo-web.png`(512px)·`og-image.png`(1200×630) 생성 후 `public/`에 복사(빌드 스크립트의 `copyFavicons`). 화면 `<img>`는 `/assets/kairos_logo-web.png`, OG/Twitter는 `/assets/og-image.png`.

**SEO·hreflang:** 콘텐츠 페이지는 `origin.html?lang=ko`, `study-korea.html?lang=zh` 형식. `<head>`에 hreflang·canonical·OG(`og-image.png`)는 빌드 시 주입(`scripts/lib/seo-head.mjs`). locale JSON의 `title`·`metaDescription`은 JS로 언어 전환 시 갱신. 본문은 JS i18n(크롤러는 메타·hreflang 위주).

### 5언어(영문 기준) 수정 절차

1. **번역 문구** → [`locales/origin/ko.json`](locales/origin/ko.json) 등 (HTML 밖)
2. **레이아웃·영문 기본** → [`src/templates/origin-page.njk`](src/templates/origin-page.njk)
3. **스타일** → [`src/assets/origin-site.css`](src/assets/origin-site.css)
4. `node scripts/build-origin-plain.mjs` → `origin.html` + `public/locales/origin/*.json` 갱신
5. Netlify에 `public/` 재업로드

`origin.html`·`study-korea.html`에는 **영문만** 들어 있습니다. `/`에서 고른 언어는 각각 `origin-locale.js` / `study-korea-locale.js`가 JSON을 불러와 **같은 DOM**에 채웁니다 (`sessionStorage` 키 `kairos-lang` 공유).

### Study in KR 5언어 수정 절차

1. **번역 문구** → `locales/study-korea/{lang}.json`
2. **레이아웃·영문 기본** → `src/templates/study-korea-page.njk`
3. **스타일** → `src/assets/study-korea-site.css`
4. `node scripts/build-study-korea-plain.mjs` → `public/study-korea.html` 갱신
5. Netlify에 `public/` 재업로드

`public/study-korea.html`을 직접 고치지 말 것.

---
