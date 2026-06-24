# Kairos Education

대학 입시 컨설팅 랜딩 사이트. **순수 HTML/CSS** 정적 사이트이며, 영문 기준 **5언어**(en/ko/zh/th/vi)는 locale JSON + **mini-template** (`.njk`)을 빌드해 생성합니다.

**라이브:** [https://kairoseducation.org](https://kairoseducation.org)

상세 레퍼런스·locale 키·폼·페이지별 수정 절차·AI 작업 규칙은 [.cursor/rules/kairos-netlify.mdc](.cursor/rules/kairos-netlify.mdc)를 참고하세요.

---

## Quick start

**요구 사항:** [Node.js](https://nodejs.org/) (npm은 선택). favicon·OG 재생성 시 [Python](https://www.python.org/) 3.

```bash
git clone <repository-url>
cd kairoseducation

node scripts/build-all.mjs
cd public && npx --yes serve .
```

브라우저에서 `/`, `/origin/`, `/study-korea/`, `/origin/contact.html` 등을 확인합니다. **폼 제출**은 배포 URL에서만 Netlify로 전달됩니다.

### npm 스크립트 (선택)


| 명령                          | 설명                            |
| --------------------------- | ----------------------------- |
| `npm run build`             | 전체 빌드                         |
| `npm run build:origin`      | origin만                       |
| `npm run build:study-korea` | study-korea만                  |
| `npm run build:index`       | `/` 만                         |
| `npm run verify`            | 빌드 산출물·템플릿 검증 (`verify-sync.mjs`) |

단일 페이지: `node scripts/build-one.mjs <id>` — `origin`, `origin-contact`, `study-korea`, `study-korea-contact`, `index`.

`npm run build:origin` 등은 **해당 랜딩(또는 index) HTML + locale만** 갱신합니다. contact HTML·다른 페이지는 `build-all` 또는 `build-one`으로 빌드하세요.

빌드 구조·config 파일·주의사항은 [kairos-netlify.mdc](.cursor/rules/kairos-netlify.mdc) § 빌드 파이프라인.


---

## 협업


| 역할              | 담당                                               |
| --------------- | ------------------------------------------------ |
| **코드·번역 수정**    | Collaborator — feature branch → **Pull Request** |
| **PR 검토·merge** | 저장소 관리자                                          |
| **라이브 배포**      | 저장소 관리자 — Netlify에 `public/` 수동 업로드              |


- Collaborator는 **PR만** 제출 (`master` 직접 push 금지).
- merge만으로는 [https://kairoseducation.org](https://kairoseducation.org) 가 바뀌지 않습니다.

### PR 제출 전

1. 원본만 수정 (`locales/`, `src/templates/`, `src/assets/`, `config/`) — `public/` 직접 수정 금지
2. `node scripts/build-all.mjs` (끝에 `verify-sync` 포함)
3. PR에 **변경 페이지·언어** 명시 (예: origin ko `services`만)

---

## 배포 (Netlify)


| 항목        | 값                              |
| --------- | ------------------------------ |
| **배포 방식** | 수동 업로드 (Git 연동 없음)             |
| **게시 폴더** | `public/` (폴더 **자체**를 드래그앤드롭)  |
| **빌드**    | `node scripts/build-all.mjs` (끝에 `verify-sync` 포함) |


**Git**에는 프로젝트 전체를 커밋하고, **Netlify**에는 `public/`만 올립니다.

### 배포 전 (관리자)

1. `node scripts/build-all.mjs`
2. [Netlify](https://app.netlify.com) Deploys → `public/` 업로드 → Published 확인

폼·연락처 변경 후에는 재배포가 필요합니다. Forms·필드 상세는 [kairos-netlify.mdc](.cursor/rules/kairos-netlify.mdc) § Netlify Forms.

---

## 원본 vs 산출물


|        | 수정 대상            | 빌드 산출물 (직접 수정 X)                                         |
| ------ | ---------------- | -------------------------------------------------------- |
| 번역     | `locales/`       | `public/locales/`                                        |
| HTML   | `src/templates/` | `public/*.html`, `public/origin/`, `public/study-korea/` |
| CSS/JS | `src/assets/`    | `public/assets/`                                         |
| 상수     | `config/`        | `public/assets/langs.js` 등 (빌드 시 생성·복사)               |


`public/`을 직접 고친 뒤 빌드하지 않으면 `verify-sync`가 실패합니다.

---

## 더 알아보기

[kairos-netlify.mdc](.cursor/rules/kairos-netlify.mdc) — 페이지별 수정 절차, **빌드 파이프라인**, 섹션·locale 키, Netlify Forms, footer/nav, AI 작업 규칙.