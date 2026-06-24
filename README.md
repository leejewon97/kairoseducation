# Kairos Education

대학 입시 컨설팅 랜딩 사이트. **순수 HTML/CSS** 정적 사이트이며, 영문 기준 **5언어**(en/ko/zh/th/vi)는 locale JSON + Nunjucks 템플릿을 빌드해 생성합니다.

**라이브:** https://kairoseducation.org

---

## 협업 워크플로

| 역할 | 담당 |
|------|------|
| **코드·번역 수정** | Collaborator — feature branch에서 작업 후 **Pull Request** |
| **PR 검토·승인·merge** | 저장소 관리자 (필수) |
| **라이브 배포** | 저장소 관리자 — Netlify에 `public/` 수동 업로드 |

- Collaborator는 **PR만** 제출합니다. `master`에 직접 push하지 않습니다.
- 모든 PR은 **저장소 관리자 승인 후** merge됩니다.
- `git push`·merge만으로는 https://kairoseducation.org 가 바뀌지 않습니다. merge 후 관리자가 빌드·검증·Netlify 업로드를 진행합니다.

### PR 제출 전 체크리스트

1. 원본만 수정 (`locales/`, `src/templates/`, `src/assets/`, `config/`) — `public/` 직접 수정 금지
2. `node scripts/build-all.mjs` (또는 `npm run build`)
3. `node scripts/verify-sync.mjs` (또는 `npm run verify`) — 실패 시 PR 제출 전 수정
4. PR 설명에 **변경 페이지·언어** 명시 (예: origin ko `services` 문구만)

---

## Quick start

**요구 사항:** [Node.js](https://nodejs.org/) (npm은 선택 — `package.json` 스크립트 사용 시). favicon·OG 이미지 재생성 시 [Python](https://www.python.org/) 3.

```bash
git clone <repository-url>
cd kairoseducation

node scripts/build-all.mjs
cd public && npx --yes serve .
```

브라우저에서 표시된 URL로 `/`, `/origin/`, `/study-korea/`, `/origin/contact.html` 등을 확인합니다. **폼 제출**은 배포 URL에서만 Netlify로 전달됩니다.

### npm 스크립트 (선택)

| 명령 | 설명 |
|------|------|
| `npm run build` | 전체 빌드 (`build-all.mjs`) |
| `npm run build:origin` | origin 페이지만 |
| `npm run build:study-korea` | study-korea 페이지만 |
| `npm run build:index` | index(/) 페이지만 |
| `npm run verify` | `locales/` ↔ `public/` 동기화 검증 |
| `npm run extract-locales` | HTML에서 locale JSON 추출 (특수 용도) |
| `npm run rebuild` | extract + 전체 빌드 |

---

## 배포 (Netlify)

| 항목 | 값 |
|------|-----|
| **라이브 URL** | https://kairoseducation.org |
| **커스텀 도메인** | `kairoseducation.org` |
| **배포 방식** | 수동 업로드 (Netlify Git 연동 없음) |
| **게시 폴더** | `public/` |
| **빌드 명령** | `node scripts/build-all.mjs` (또는 `npm run build`) |
| **동기화 검증** | `node scripts/verify-sync.mjs` (또는 `npm run verify`) |

### Git vs Netlify (역할 분리)

| | Git (저장소) | Netlify (라이브 사이트) |
|--|--------------|-------------------------|
| **올리는 것** | 프로젝트 전체 | **`public/` 폴더만** |
| **목적** | 변경 이력·PR·협업 | https://kairoseducation.org 반영 |

`git commit`·merge만으로는 사이트가 바뀌지 않음. 라이브 반영은 Netlify 수동 업로드.

### 수동 배포 절차 (저장소 관리자)

Netlify Deploys에 **`public/` 폴더**를 드래그앤드롭.

1. [Netlify](https://app.netlify.com) → 해당 사이트 → **Deploys**
2. `public/` 폴더를 드래그앤드롭 (폴더 안 파일만 펼쳐 올리지 말 것 — `public` 폴더 자체를 끌어다 놓기).
3. **Published** 확인 후 https://kairoseducation.org 에서 `/`, `/origin/`, `/study-korea/` 등 열기

### 배포 전 체크리스트

1. `node scripts/build-all.mjs` (origin + study-korea + index + `langs.js` 생성)
2. `node scripts/verify-sync.mjs` — `locales/`와 `public/` 불일치 시 exit 1
3. Netlify에 `public/` 폴더 재업로드

### 원본 vs 산출물 (직접 수정 금지)

| | 원본 (수정 대상) | 산출물 (빌드 결과, 직접 수정 X) |
|--|------------------|--------------------------------|
| **번역** | `locales/{origin,study-korea,index}/` | `public/locales/{origin,study-korea,index}/` |
| **HTML** | `src/templates/*.njk` | `public/index.html`, `public/origin/`, `public/study-korea/` |
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
| `contact` | `/origin/contact.html` (5언어 공통, hidden `language`: en/ko/zh/th/vi) |
| `study-korea` | `/study-korea/contact.html` (5언어 공통, hidden `language`: en/ko/zh/th/vi) |

연락 폼은 **상담 전용 페이지**에만 있으며, 랜딩에는 `#contact` 섹션이 없습니다.

연락 폼은 `data-netlify="true"`로 제출되며, 대시보드 **Forms**에도 쌓입니다.

**이메일 알림:** 설정됨. 제출 시 `formresponses@netlify.com` → `ronkim@kairos-education.org` 으로 발송 (2026-05 테스트: origin `contact` 폼). 본문 필드: `name`, `grade`, `email`, `universities`, `message`.

사이트에 `/.netlify/functions/emails` Function이 배포되어 있을 수 있으나, 현재 HTML 폼은 Function이 아니라 **Netlify Forms** 경로를 사용합니다.

무료 플랜: 월 제출 한도(약 100건) — [Netlify Forms 문서](https://docs.netlify.com/forms/setup/) 참고.

폼 HTML·`name`·`form-name` hidden 필드를 바꾼 뒤에는 **반드시 재배포**해야 폼이 다시 스캔됩니다.

---

## 작업 범위 (기본값)

| 항목 | 기본값 |
|------|--------|
| **콘텐츠 기준본** | [`locales/origin/en.json`](locales/origin/en.json) + [`src/templates/origin-page.njk`](src/templates/origin-page.njk) |
| **수정 언어** | PR·이슈에 명시된 언어만 (명시 없으면 확인) |
| **스택** | 순수 HTML/CSS, 프레임워크 없음 |

### 다국어 수정 원칙

- **요청·PR에 명시된 언어만** 수정. "영어만" / "ko만" / "전체 5개"를 명시하지 않으면 확인할 것.
- nav·footer·가격·폼 라벨 등 **공통 구조** 변경 시: 템플릿 + 필요 시 5개 locale JSON.
- **대학명 `name`:** 영문 고유명사 유지. **`detail`:** 해당 locale 언어로.

### 공통 연락처

[`config/contacts.mjs`](config/contacts.mjs) — email·kakao·whatsapp 단일 소스. 빌드 시 `langs.js`·템플릿에 주입. 번호·이메일 변경 시 이 파일만 수정.

---

## 사이트 구조

```
public/
  index.html                    # / — 언어·진로 선택 (빌드 산출, 직접 수정 X)
  origin/
    index.html                  # /origin/ — US 랜딩 (영문 HTML만)
    contact.html                # /origin/contact.html — US 상담·폼
  study-korea/
    index.html                  # /study-korea/ — KR 랜딩
    contact.html                # /study-korea/contact.html — KR 상담·폼
  locales/origin/*.json         # 빌드 복사본 (원본: locales/origin/)
  locales/study-korea/*.json
  locales/index/*.json
  assets/origin-site.css
  assets/origin-locale.js
  assets/origin-i18n.js
  assets/contact-shell.js       # contact 페이지 전용 (reveal·lang·burger)
  assets/index-locale.js
  assets/hash-scroll.js         # 교차 페이지 # 앵커 재스크롤 (*-locale.js에서 import)
  assets/interactions.js        # 랜딩: header·burger·sticky·reveal
  assets/mobile-nav.js          # 햄버거 메뉴 (US/KR 탭·섹션·하단 CTA)
  assets/langs.js               # 언어·PATHS 상수 (빌드 시 config에서 생성)
  assets/study-korea-site.css
  assets/study-korea-locale.js
  assets/study-korea-i18n.js
  assets/seo-i18n.js
  assets/kairos_logo-web.png
  assets/og-image.png
  assets/favicon-48x48.png
  assets/apple-touch-icon.png
  favicon.ico
  robots.txt
  sitemap.xml

src/assets/kairos_logo.png        # 마스터 (배포 X, generate-favicons.py 입력)

config/langs.mjs                # SITE, LANGS, HREFLANG, OG_LOCALE
config/paths.mjs                # landing·contact URL 상수
config/contacts.mjs             # email·kakao·whatsapp 단일 소스
locales/origin/{en,ko,zh,th,vi}.json
locales/study-korea/{en,ko,zh,th,vi}.json
locales/index/{en,ko,zh,th,vi}.json
src/templates/origin-page.njk
src/templates/origin-contact-page.njk
src/templates/study-korea-page.njk
src/templates/study-korea-contact-page.njk
src/templates/includes/contact-body.njk
src/templates/includes/         # site-head, site-footer, chat-fab, …
src/templates/index-page.njk
src/assets/kairos-i18n-utils.js
scripts/build-all.mjs
scripts/build-origin-plain.mjs
scripts/build-origin-contact-plain.mjs
scripts/build-study-korea-plain.mjs
scripts/build-study-korea-contact-plain.mjs
scripts/build-index-plain.mjs
scripts/verify-sync.mjs
```

예전 `/origin.html`, `/study-korea.html` → [`public/_redirects`](public/_redirects)에서 `/origin/`, `/study-korea/`로 301. 예전 `/en/`, `/ko/`, `/us.html` … 동일 파일.

**이미지:** 마스터 `src/assets/kairos_logo.png` → `python scripts/generate-favicons.py`로 favicon·`kairos_logo-web.png`(512px)·`og-image.png`(1200×630) 생성 후 `public/`에 복사(빌드 스크립트의 `copyFavicons`). 화면 `<img>`는 `/assets/kairos_logo-web.png`, OG/Twitter는 `/assets/og-image.png`.

**SEO·hreflang:** `/origin/?lang=ko`, `/study-korea/?lang=zh`, `/origin/contact.html?lang=ko` 등. `<head>`에 hreflang·canonical·OG는 빌드 시 주입(`scripts/lib/seo-head.mjs`). locale JSON의 `title`·`metaDescription`은 JS로 언어 전환 시 갱신.

**언어 선택:** `/` 만. 랜딩·상담 페이지는 영문 HTML + `fetch('/locales/{page}/{lang}.json')`로 동일 DOM 번역 (`kairos-lang` sessionStorage 공유).

### 5언어(영문 기준) — origin 수정 절차

1. **번역 문구** → [`locales/origin/ko.json`](locales/origin/ko.json) 등 (HTML 밖)
2. **레이아웃·영문 기본** → [`src/templates/origin-page.njk`](src/templates/origin-page.njk)
3. **스타일** → [`src/assets/origin-site.css`](src/assets/origin-site.css)
4. `node scripts/build-all.mjs` (또는 `node scripts/build-origin-plain.mjs`만) → `public/origin/index.html` + `public/origin/contact.html` + `public/locales/origin/*.json` 갱신
5. PR에 빌드 산출물(`public/`) 포함 — merge 후 관리자가 Netlify 배포

`public/origin/`·`study-korea/` HTML을 직접 고치지 말 것. 랜딩·상담은 각각 `origin-page.njk`, `origin-contact-page.njk`에서 빌드됩니다.

### Study in KR 5언어 수정 절차

1. **번역 문구** → `locales/study-korea/{lang}.json`
2. **레이아웃·영문 기본** → `study-korea-page.njk` (랜딩), `study-korea-contact-page.njk` (상담)
3. **스타일** → `src/assets/study-korea-site.css`
4. `node scripts/build-all.mjs` (또는 `node scripts/build-study-korea-plain.mjs` + contact 빌드) → `public/study-korea/index.html`·`contact.html` 갱신
5. PR에 빌드 산출물 포함 — merge 후 관리자가 Netlify 배포

`public/study-korea/` HTML을 직접 고치지 말 것.

### `/` (언어·진로 선택) 수정 절차

1. **번역 문구** → `locales/index/{lang}.json`
2. **레이아웃·영문 기본** → `src/templates/index-page.njk`
3. `node scripts/build-all.mjs` (또는 `node scripts/build-index-plain.mjs`) → `public/index.html` 갱신
4. PR에 빌드 산출물 포함 — merge 후 관리자가 Netlify 배포

`public/index.html`을 직접 고치지 말 것.

### footer

origin·study-korea **동일 구조**: 브랜드(tagline) + 섹션 링크 2열 + 하단 copyright·meta.

- locale `footer`: `col1` = 현재 페이지 nav와 **동일 순서**, `col2` = 반대 페이지. href는 `/origin/#…`, `/study-korea/#…` 절대 경로 (contact 페이지에서도 동작).
- 상담 CTA는 nav·sticky·패키지 → `/origin/contact.html` 또는 `/study-korea/contact.html`. 이메일·카카오는 `footer.meta`·contact 본문.
- nav 섹션을 바꾸면 양쪽 `footer`와 템플릿·`*-i18n.js`도 함께 맞출 것.
- footer 2열(반대 페이지 `#…` 링크)은 [`src/assets/hash-scroll.js`](src/assets/hash-scroll.js)가 locale·폰트 적용 후 고정 nav 높이를 고려해 재스크롤.

### 네비·모바일·상담 (origin / study-korea)

**랜딩** (`origin-page.njk`, `study-korea-page.njk`): `.header` + 섹션 nav + lang + CTA(상담 URL) + sticky + chat-fab. [`interactions.js`](src/assets/interactions.js).

**상담** (`origin-contact-page.njk`, `study-korea-contact-page.njk`): 슬림 헤더(로고→`/`, lang, burger만) + contact 본문 + footer. sticky·chat-fab 없음. [`contact-shell.js`](src/assets/contact-shell.js) + `applyContactLocale` in `*-i18n.js`. `body.contact-page`로 contact i18n 분기.

- **로고:** 모든 페이지 브랜드 → `/` (언어는 `sessionStorage` 유지)
- **햄버거:** [`mobile-nav.js`](src/assets/mobile-nav.js) — US/KR 탭(`/origin/`, `/study-korea/`), 섹션 링크, 하단 상담·카카오 CTA (contact 페이지에서는 상담 CTA 숨김)
- **교차 페이지 `#` 앵커:** `*-locale.js` + [`hash-scroll.js`](src/assets/hash-scroll.js)

`/`(index)는 섹션 nav 없음; `interactions.js`가 `.reveal`만 처리.
