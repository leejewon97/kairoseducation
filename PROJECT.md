# Kairos Education — 프로젝트 컨텍스트

Cursor와 협업할 때 이 파일을 기준으로 합니다. AI용 상세 규칙은 [.cursor/rules/kairos-netlify.mdc](.cursor/rules/kairos-netlify.mdc)에 있습니다.

## 배포 (Netlify)

| 항목 | 값 |
|------|-----|
| **라이브 URL** | https://kairoseducation.org |
| **커스텀 도메인** | `kairoseducation.org` |
| **배포 방식** | 수동 업로드 (Netlify Git 연동 없음) |
| **게시 폴더** | `public` ([netlify.toml](netlify.toml)) |
| **빌드 명령** | `node scripts/build-origin-plain.mjs` (npm 불필요) |

### Git vs Netlify (역할 분리)

| | Git (로컬, 본인만) | Netlify (라이브 사이트) |
|--|-------------------|-------------------------|
| **올리는 것** | 프로젝트 **전체** (`public/`, `netlify.toml`, `PROJECT.md`, `.cursor/` 등) | **`netlify.toml` + `public/`만** |
| **목적** | 변경 이력·롤백·Cursor 협업 | https://kairoseducation.org 반영 |

`git commit`만으로는 사이트가 바뀌지 않음. 라이브 반영은 Netlify 수동 업로드.

### 수동 배포 절차

Netlify Deploys에 **`netlify.toml` + `public/` 폴더만** 업로드.

1. [Netlify](https://app.netlify.com) → 해당 사이트 → **Deploys**
2. zip/드래그 업로드 시 루트에 `netlify.toml`과 `public/`이 **함께** 있어야 함 (`publish = "public"` 설정과 맞춤). `public` 안의 파일만 펼쳐 올리면 안 됨.
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
| `contact` | `/origin.html` (영어 UI) |
| `contact-kr` | `/origin.html` (한국어 UI) |
| `contact-zh` | `/origin.html` (중국어 UI) |
| `contact-th` | `/origin.html` (태국어 UI) |

연락 폼은 `data-netlify="true"`로 제출되며, 대시보드 **Forms**에도 쌓입니다.

**이메일 알림:** 설정됨. 제출 시 `formresponses@netlify.com` → `Ronkim2015@gmail.com` 으로 발송 (2026-05 테스트: `/ko/` `contact-kr` 폼). 본문 필드: `name`, `grade`, `email`, `universities`, `message`.

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

### 공통 연락처 (4개 언어 페이지 동일)

- 이메일: `Ronkim2015@gmail.com`
- 카카오: `http://pf.kakao.com/_uWJKX`

---

## 사이트 구조

```
public/
  index.html              # / — 언어 선택 → US / Study in KR
  origin.html             # 영문 HTML만 (빌드 결과, 직접 수정 X)
  locales/origin/*.json   # 번역 데이터 (배포 시 public/locales/origin/ 에 복사됨)
  study-korea.html        # Study in KR
  assets/origin-site.css
  assets/origin-locale.js # JSON fetch + 화면 번역
  assets/origin-i18n.js

locales/origin/{en,ko,zh,th}.json   # 문구 원본 (repo)
src/templates/origin-page.njk
scripts/build-origin-plain.mjs
```

예전 `/en/`, `/ko/`, `/us.html` … → [netlify.toml](netlify.toml) 리다이렉트.

### 4언어(영문 기준) 수정 절차

1. **번역 문구** → [`locales/origin/ko.json`](locales/origin/ko.json) 등 (HTML 밖)
2. **레이아웃·영문 기본** → [`src/templates/origin-page.njk`](src/templates/origin-page.njk)
3. **스타일** → [`src/assets/origin-site.css`](src/assets/origin-site.css)
4. `node scripts/build-origin-plain.mjs` → `origin.html` + `public/locales/origin/*.json` 갱신
5. Netlify에 `public/` 재업로드

`origin.html`에는 **영문만** 들어 있습니다. `/`에서 고른 언어는 `origin-locale.js`가 JSON을 불러와 **같은 DOM**에 채웁니다.

---

## 알려진 개선 후보 (우선순위 미정)

- Study in KR 다국어·템플릿화
- SEO 메타·`hreflang`·favicon
