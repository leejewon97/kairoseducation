# Kairos Education — 프로젝트 컨텍스트

Cursor와 협업할 때 이 파일을 기준으로 합니다. AI용 상세 규칙은 [.cursor/rules/kairos-netlify.mdc](.cursor/rules/kairos-netlify.mdc)에 있습니다.

## 배포 (Netlify)

| 항목 | 값 |
|------|-----|
| **라이브 URL** | https://kairoseducation.org |
| **커스텀 도메인** | `kairoseducation.org` |
| **배포 방식** | 수동 업로드 (Netlify Git 연동 없음) |
| **게시 폴더** | `public/` |
| **빌드 명령** | `node scripts/build-all.mjs` (또는 `npm run build`, npm 불필요) |
| **동기화 검증** | `node scripts/verify-sync.mjs` (또는 `npm run verify`) |

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

### 배포 전 체크리스트

1. `node scripts/build-all.mjs` (origin + study-korea + index + `langs.js` 생성)
2. `node scripts/verify-sync.mjs` — `locales/`와 `public/` 불일치 시 exit 1
3. Netlify에 `public/` 폴더 재업로드

### 원본 vs 산출물 (직접 수정 금지)

| | 원본 (수정 대상) | 산출물 (빌드 결과, 직접 수정 X) |
|--|------------------|--------------------------------|
| **번역** | `locales/{origin,study-korea,index}/` | `public/locales/{origin,study-korea,index}/` |
| **HTML** | `src/templates/*.njk` | `public/{index,origin,study-korea}.html` |
| **CSS/JS** | `src/assets/` | `public/assets/` |
| **언어 상수** | `config/langs.mjs` | `src/assets/langs.js` (빌드 시 자동 생성) |

`public/` 파일을 직접 고친 뒤 빌드하지 않으면 `verify-sync`가 실패합니다.

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
  index.html              # / — 언어·진로 선택 (빌드 산출, 직접 수정 X)
  origin.html             # 영문 HTML만 (빌드 결과, 직접 수정 X)
  study-korea.html        # Study in KR (영문 HTML만, 빌드 산출)
  locales/origin/*.json   # 빌드 복사본 (원본: locales/origin/)
  locales/study-korea/*.json
  locales/index/*.json
  assets/origin-site.css
  assets/origin-locale.js
  assets/origin-i18n.js
  assets/index-locale.js
  assets/hash-scroll.js       # 교차 페이지 # 앵커 재스크롤 (locale 후)
  assets/nav-mobile.js        # 모바일 nav 햄버거 토글 + focus trap
  assets/langs.js             # 언어 상수 (빌드 시 config/langs.mjs에서 생성)
  assets/study-korea-site.css
  assets/study-korea-locale.js
  assets/study-korea-i18n.js
  assets/seo-i18n.js
  assets/kairos_logo-web.png  # 페이지 로고 (512px, 생성)
  assets/og-image.png         # OG/Twitter (1200×630, 생성)
  assets/favicon-48x48.png    # Google 검색 favicon (48px)
  assets/apple-touch-icon.png # iOS 홈 화면
  favicon.ico                 # public/ 루트 (16·32·48 multi-size)

src/assets/kairos_logo.png    # 마스터 (배포 X, generate-favicons.py 입력)

config/langs.mjs              # SITE, LANGS, HREFLANG, OG_LOCALE (단일 소스)
locales/origin/{en,ko,zh,th,vi}.json
locales/study-korea/{en,ko,zh,th,vi}.json
locales/index/{en,ko,zh,th,vi}.json
src/templates/origin-page.njk
src/templates/study-korea-page.njk
src/templates/index-page.njk
scripts/build-all.mjs
scripts/build-origin-plain.mjs
scripts/build-study-korea-plain.mjs
scripts/build-index-plain.mjs
scripts/verify-sync.mjs
```

예전 `/en/`, `/ko/`, `/vi/`, `/us.html` … → [`public/_redirects`](public/_redirects) 리다이렉트.

**이미지:** 마스터 `src/assets/kairos_logo.png` → `python scripts/generate-favicons.py`로 favicon·`kairos_logo-web.png`(512px)·`og-image.png`(1200×630) 생성 후 `public/`에 복사(빌드 스크립트의 `copyFavicons`). 화면 `<img>`는 `/assets/kairos_logo-web.png`, OG/Twitter는 `/assets/og-image.png`.

**SEO·hreflang:** 콘텐츠 페이지는 `origin.html?lang=ko`, `study-korea.html?lang=zh` 형식. `<head>`에 hreflang·canonical·OG(`og-image.png`)는 빌드 시 주입(`scripts/lib/seo-head.mjs`). locale JSON의 `title`·`metaDescription`은 JS로 언어 전환 시 갱신. 본문은 JS i18n(크롤러는 메타·hreflang 위주).

### 5언어(영문 기준) 수정 절차

1. **번역 문구** → [`locales/origin/ko.json`](locales/origin/ko.json) 등 (HTML 밖)
2. **레이아웃·영문 기본** → [`src/templates/origin-page.njk`](src/templates/origin-page.njk)
3. **스타일** → [`src/assets/origin-site.css`](src/assets/origin-site.css)
4. `node scripts/build-all.mjs` (또는 `node scripts/build-origin-plain.mjs`만) → `origin.html` + `public/locales/origin/*.json` 갱신
5. Netlify에 `public/` 재업로드

`origin.html`·`study-korea.html`에는 **영문만** 들어 있습니다. `/`에서 고른 언어는 각각 `origin-locale.js` / `study-korea-locale.js`가 JSON을 불러와 **같은 DOM**에 채웁니다 (`sessionStorage` 키 `kairos-lang` 공유).

### Study in KR 5언어 수정 절차

1. **번역 문구** → `locales/study-korea/{lang}.json`
2. **레이아웃·영문 기본** → `src/templates/study-korea-page.njk`
3. **스타일** → `src/assets/study-korea-site.css`
4. `node scripts/build-all.mjs` (또는 `node scripts/build-study-korea-plain.mjs`만) → `public/study-korea.html` 갱신
5. Netlify에 `public/` 재업로드

`public/study-korea.html`을 직접 고치지 말 것.

### `/` (언어·진로 선택) 수정 절차

1. **번역 문구** → `locales/index/{lang}.json`
2. **레이아웃·영문 기본** → `src/templates/index-page.njk`
3. `node scripts/build-all.mjs` (또는 `node scripts/build-index-plain.mjs`) → `public/index.html` 갱신
4. Netlify에 `public/` 재업로드

`public/index.html`을 직접 고치지 말 것.

### 푸터

origin·study-korea **동일 구조**: 브랜드(tagline) + 섹션 링크 2열 + 하단 copyright·meta.

- locale `footer`: `col1` = 현재 페이지 nav와 **href 동일**, `col2` = 반대 페이지 (`/origin.html#…` ↔ `/study-korea.html#…`). 열 제목은 `col1Heading` / `col2Heading`.
- 상담 CTA는 nav `#contact`만. 이메일·카카오는 푸터 링크 열이 아니라 `footer.meta`·`contact` 섹션.
- nav 섹션을 바꾸면 양쪽 `footer`와 템플릿·`*-i18n.js`도 함께 맞출 것.
- 푸터 2열(반대 페이지 `#…` 링크)은 [`src/assets/hash-scroll.js`](src/assets/hash-scroll.js)가 locale·폰트 적용 후 고정 nav 높이를 고려해 재스크롤.

### 모바일 nav

- **반응형 전환:** 고정 900px 기준이 아님. [`src/assets/nav-mobile.js`](src/assets/nav-mobile.js)가 **현재 UI 언어**(`sessionStorage` `kairos-lang`)와 `window.innerWidth`로 `body.nav-mobile`을 토글한다. 해당 너비 이하에서 2줄(햄버거) 모드, +1px부터 1줄(가로 nav). 언어별 상한(px, 4px 그리드 올림): vi 1072, en 1044, th 1020, zh 924, ko 900. 언어를 바꾸면(`kairos:langchange`) breakpoint도 함께 갱신된다.
- **모바일 모드 (`body.nav-mobile`):** 상단 `.nav-bar`는 로고 + CTA(origin) 또는 back·CTA(study-korea) + `.nav-toggle`. 열면 `.nav-panel`에 섹션 링크·언어 스위처.
- **데스크톱 모드:** 가로 nav — 섹션 링크·언어 스위처·CTA가 한 줄에 표시. 상한을 넘기면 열린 메뉴는 자동으로 닫힌다.
- **구조:** `.nav-bar`(70px 고정) + `.nav-panel` + `.nav-end`
- **JS:** locale `nav.menuOpen`/`menuClose` aria-label, focus trap, ESC·바깥 클릭·링크 클릭 시 닫기, `body.nav-open` 스크롤 잠금, 리사이즈·언어 전환 시 모드 재판정.
- **빌드:** `build-all.mjs`가 `nav-mobile.js`·`hash-scroll.js`·`langs.js`를 `public/assets/`로 복사.

