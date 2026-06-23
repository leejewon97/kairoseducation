# Design migration follow-ups

디자인 이식(Phase 1–3) 후속·검증·미완 항목. **새 대화에서 작업을 이어갈 때 이 문서를 먼저 읽을 것.**

---

## 현재 상태 스냅샷 (2026-06-23)

### Git·브랜치

| 항목 | 값 |
|------|-----|
| 브랜치 | `design/style-off` |
| Phase 3 study-korea 커밋 | `5fb5bad` — *Restyle study-korea page with staging-aligned origin shell and en/ko copy.* |
| 직전 | `ab08b49` — contact SPA·공유 view CSS, `7b1fd9c` — origin 스테이징 정렬 |
| 원격 | `origin/design/style-off` 대비 **2커밋 ahead** (push·PR은 사용자 요청 시) |
| `master` | Phase 1–3 미머지 (`master` @ `8af93b0`) |

### 배포·검증 (사용자 액션)

| 항목 | 상태 |
|------|------|
| 로컬 빌드·동기화 | ✅ `verify-sync` 통과, 재빌드 시 `public/` 변경 없음 (2026-06-23 확인) |
| Netlify `public/` 업로드 | ⏳ **미완** — push/merge와 무관, **폴더 전체** 드래그앤드롭 |
| G5 5언어 스모크 | ⏳ 배포 전·후 수동 QA 권장 |
| G6 라이브 폼 테스트 | ⏳ `contact` (origin), `study-korea` (study-korea) 각 1회 |

**라이브 URL:** https://kairoseducation.org

### Phase 완료 요약

| Phase | 페이지 | 상태 | 비고 |
|-------|--------|------|------|
| 1 | `/` index | ✅ | design tokens, en/ko (`416100b`) |
| 2 | `/origin.html` | ✅ | 스테이징 셸·en/ko (`7b1fd9c`) |
| 3 | `/study-korea.html` | ✅ 구현·커밋 | en/ko 스테이징 + 예외 반영 (`5fb5bad`); **배포·G5/G6 미완** |

---

## Study Korea — 구현 요약 (Phase 3)

스테이징(Vercel) 디자인을 origin 디자인 시스템으로 이식. Universities는 초기 pill 칩 시도 후 **구 study-korea식 `uni-card` 그리드로 확정**.

### 페이지 흐름 (`view-us` 안)

```
scarcity → hero (arc + marquee) → worries (cream) → why-korea (process/step)
→ proof (네이비) → pathways (pkg-grid) → universities (uni-grid, cream)
→ packages (pkg-grid + ala-list terms) → FAQ → video CTA → footer
```

Contact는 **`view-contact` SPA** (`data-view="contact"`). 하단 `#contact` 인라인 스크롤만으로 끝내지 않음.

### CSS·JS

| 리소스 | 역할 |
|--------|------|
| `origin-site.css` | 레이아웃·컴포넌트 대부분 (빌드 시 `public/assets/` 복사) |
| `study-korea-site.css` | KR 전용 오버라이드만 (~85줄): view 전환, uni-card 등 |
| `interactions.js` | header·burger·sticky·contact SPA·앵커 스크롤 (origin과 동일 패턴) |
| `study-korea-i18n.js` | `applyLocale`, 섹션별 렌더러 |
| `study-korea-locale.js` | JSON fetch; `hash-scroll.js` import (교차 페이지 `#` 재스크롤) |

`nav-mobile.js`는 `public/assets/`에 복사되지만 **현재 어떤 템플릿도 로드하지 않음** (구형 nav 잔재). origin·study-korea·index는 모두 `interactions.js`.

### Locale (5언어)

| 언어 | 상태 |
|------|------|
| **en / ko** | 스테이징 `kr.*`·`contact.*` 매핑 + 아래 **예외** 반영 |
| **zh / th / vi** | `en.json`과 동일 스키마 **영문 스텁** — 본번역 없음 |

**SEO:** `title`·`metaDescription`은 기존 kairoseducation.org 카피 **유지** (이번 Phase 3에서 변경 없음).

### 사용자 확정 예외 (Q0–Q10)

| 항목 | 결정 |
|------|------|
| Sticky 톤 | US 학부모 (origin ko sticky와 동일 방향) |
| Contact | SPA `view-contact` 유지 |
| Hero CTA | 로컬 — `무료 상담 예약 →` / `유학 경로 보기` |
| ko marquee | 한글 대학명 (서울대, 고려대, …) |
| Universities | **uni-card** (flag / rank / name / detail); pill 칩 아님 |
| Packages CTA | **시작하기** 유지 (스테이징 Get started 아님) |
| proof.sub | 로컬 문구 유지 |
| 폼 | Netlify **7필드** 유지; ko 라벨·placeholder 로컬 유지 |

### 미결정·후속 콘텐츠

| 항목 | 상태 |
|------|------|
| 대학 카드 클릭 UX | 미결정 (링크 / 스크롤 / 없음) |
| ko `contact.expect` 톤 | 스테이징식 표현 잔존 가능 — 별도 문구 수정 요청 시 |
| zh/th/vi study-korea 번역 | 스텁만 — 요청 시 언어별 작업 |

### 주요 소스 파일

- `locales/study-korea/{en,ko,zh,th,vi}.json`
- `src/templates/study-korea-page.njk`
- `src/assets/study-korea-i18n.js`, `study-korea-site.css`
- `scripts/build-study-korea-plain.mjs`

---

## Phase 3 검증 게이트

각 하위 작업 후:

```bash
node scripts/build-all.mjs && node scripts/verify-sync.mjs
rg "\{% else" public/ || true
```

| 게이트 | 통과 조건 | 상태 (2026-06-23) |
|--------|-----------|-------------------|
| G0 Preflight | origin/index Phase 2 QA 유지 | ✅ (회귀 시 재확인) |
| G1 Locale | 빌드 성공, 폼 필드명 diff 없음 | ✅ |
| G2 Template | `{% else %}` leak 없음, `view-contact` 존재 | ✅ |
| G3 i18n | 풀네임 lang, sticky/chat 버튼 색·SVG | ✅ 구현; 배포 QA ⏳ |
| G4 Shared | index reveal + origin 슬라이더 + contact 뷰 | ✅ 구현; 배포 QA ⏳ |
| G5 5언어 | 3페이지 × 5언어 스모크 | ⏳ 사용자 |
| G6 배포 전 | 배포 URL 폼 각 1회 | ⏳ 사용자 |

### G5 스모크 체크리스트 (배포 URL 권장)

각 페이지에서 `?lang=en|ko|zh|th|vi` (또는 `/`에서 언어 선택 후 진입):

1. **/** — 언어·진로 선택, reveal, 로고 비율
2. **/origin.html** — nav·sticky·contact SPA·Admit 슬라이더·언어 풀네임
3. **/study-korea.html** — scarcity·hero marquee·universities 카드·contact SPA·sticky

공통: burger 메뉴, lang 드롭다운, `#contact` → `view-contact`, Kakao 링크 동작.

### G6 폼 필드 (변경 금지 확인)

**origin `contact`:** `name`, `grade`, `email`, `universities`, `message`, hidden `language`

**study-korea `study-korea`:** `name`, `country`, `email`, `goal`, `korean_level`, `universities`, `message`, hidden `language`

폼 `name`·필드 변경 후 Netlify **재배포 필수** (폼 재스캔).

---

## Phase 2 교훈 (재발 방지)

Phase 2 일괄 이식 후 **수동 비교**로만 잡힌 결함. 이후 작업에서도 체크리스트로 사용.

| # | 증상 | 원인 | 예방 |
|---|------|------|------|
| 1 | 언어 버튼 `EN`/`KO`만 표시 | `LANG_UI` 약어 | 풀네임 (`English`, `한국어` …); study-korea-i18n에도 동일 |
| 2 | Admit 슬라이드 Yale만 고정 | `kairos:langchange`를 `document`만 수신, dispatch는 `window` | 리스너는 **항상 `window`**; locale 스크립트와 쌍 맞출 것 |
| 3 | Scholar CTA / sticky 색 틀림 | `btn-light`·`btn-kakao`·`btn-whatsapp`이 shared에 없음 | 새 CTA 클래스는 **먼저** [`kairos-shared.css`](../src/assets/kairos-shared.css)에 정의 후 사용 |
| 4 | 상담이 페이지 맨 아래로만 이동 | `#contact` 인라인 스크롤만 | `view-us` / `view-contact` + `data-view="contact"` |
| 5 | index 빈 화면 | `reveal` 선택자가 `.view.active .reveal`만 | [`interactions.js`](../src/assets/interactions.js) `hasSpaViews()` |
| 6 | index 로고 세로로 김 | `width/height` 정사각 + 실제 300×255 | HTML 속성 = **원본 픽셀 비율**, CSS `width` + `height:auto` |
| 7 | 빌드 HTML에 `{% else %}` 노출 | [`mini-template.mjs`](../scripts/lib/mini-template.mjs) 미지원 | `btnClass`/`btnHtml` 빌드 시드 또는 `{% if %}` 분리 |
| 8 | Sticky WhatsApp 텍스트만 | `setText`로 라벨만 주입 | `renderStickyWhatsApp()` — SVG 16px + 라벨 |
| 9 | zh/th/vi universities 빈 화면 | locale이 `schools[]` 등 구 스키마 | `en.json` 스키마와 **키 구조 동기** 후 rebuild |

**공유 파일 수정 시:** `interactions.js` / `kairos-shared.css` / `hash-scroll.js` 변경 후 **index + origin + study-korea** 3페이지 스모크.

---

## SEO (B3) — deferred

- **Index / origin / study-korea:** `title`, `metaDescription`, `ogDescription` still use current kairoseducation.org copy.
- **TODO:** Draft hero-based SEO strings per locale and align with `scripts/lib/seo-head.mjs` + locale JSON.
- **Index:** `?lang=` is in the URL for sharing, but SNS crawlers still see static English meta. Wire [`seo-i18n.js`](../src/assets/seo-i18n.js) `updateSeoMeta()` in [`index-locale.js`](../src/assets/index-locale.js); fix template `og:url` / add canonical per lang.
- **og-image:** Regenerate from the new light branding when SEO copy is finalized (F4).

## WhatsApp (H2)

- FAB + sticky + contact: `wa.me/0000000000` placeholder until real number provided.
- **Status (2026-06):** still pending — no WhatsApp number provided yet.
- Update: grep `wa.me` across `src/` → rebuild → deploy → test on mobile.

## Testimonials

- Origin `#us-testimonials` hidden (`testimonials.hidden`); re-enable when copy/assets are ready.

## robots.txt / sitemap

- Not in scope for design migration; add if SEO work expands.

## Workflow (all phases)

- Do not use `vercel` in code, comments, commit messages, or repo folder names.
- Do not create temporary `*-reference/` folders; integrate assets into `src/assets/` and `locales/`.
- Commit only when user says `커밋하자` / `커밋해줘`.
- Edit `locales/`, `src/templates/`, `src/assets/`, `scripts/` only — not `public/` directly; then `node scripts/build-all.mjs`.
- **Netlify:** `public/` **폴더 전체** 수동 업로드. push만으로 라이브 반영 안 됨.

---

## 다음 작업 우선순위 (에이전트·사용자 공통)

1. **Netlify `public/` 업로드** + G5/G6 QA
2. `design/style-off` → PR → merge (관리자 워크플로)
3. WhatsApp 실번호 (H2)
4. zh/th/vi study-korea 본번역 (요청 시)
5. SEO B3 + og-image F4
6. Testimonials 재활성
7. README §모바일 nav — `interactions.js` 기준으로 유지 (legacy `nav-mobile.js` 정리는 별도)
