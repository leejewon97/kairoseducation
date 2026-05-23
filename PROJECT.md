# Kairos Education — 프로젝트 컨텍스트

Cursor와 협업할 때 이 파일을 기준으로 합니다. **배포·폼·작업 범위**는 아래를 채워 두세요.

## 배포 (Netlify)

| 항목 | 값 |
|------|-----|
| **라이브 URL** | `https://YOUR-SITE.netlify.app` ← Netlify Site overview에서 복사 후 붙여넣기 |
| **커스텀 도메인** | _(없으면 비움)_ |
| **배포 방식** | 수동 업로드 (Git 연동 없음) |
| **게시 폴더** | `public` ([netlify.toml](netlify.toml)) |
| **빌드 명령** | 없음 |

### 수동 배포 절차

1. [Netlify](https://app.netlify.com) → 해당 사이트 → **Deploys**
2. `netlify.toml`이 포함된 **프로젝트 루트** 또는 `public` 내용을 zip/드래그로 업로드
3. 상태가 **Published**인지 확인 후 라이브 URL에서 `/`, `/ko/`, `/en/` 등 열기

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
| `contact` | `/en/` |
| `contact-kr` | `/ko/` |
| `contact-zh` | `/zh/` |
| `contact-th` | `/th/` |

### 알림 설정 체크리스트

Netlify → **Forms** → 각 폼 → **Form notifications**:

- [ ] 이메일 알림 추가 (권장: `Ronkim2015@gmail.com`)
- [ ] 테스트 제출 1건 후 수신 확인
- [ ] 스팸함 확인

무료 플랜: 월 제출 한도(약 100건) — [Netlify Forms 문서](https://docs.netlify.com/forms/setup/) 참고.

폼 HTML·`name`·`form-name` hidden 필드를 바꾼 뒤에는 **반드시 재배포**해야 폼이 다시 스캔됩니다.

---

## 작업 범위 (수정 요청 시 기본값)

아래를 바꿀 때는 요청 메시지에도 같이 적어 주세요.

| 항목 | 현재 기본값 |
|------|-------------|
| **콘텐츠 기준본** | 영어 [`public/en/index.html`](public/en/index.html) — 가장 상세함 |
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
  index.html      # 언어 선택
  en/index.html   # 영어 (~1060줄, results 등 가장 풍부)
  ko/index.html
  zh/index.html
  th/index.html
```

스타일은 각 HTML에 인라인. 네비·푸터·가격·폼 변경 시 보통 **언어별 파일 4개**를 함께 고려합니다.

---

## 알려진 개선 후보 (우선순위 미정)

- 제출 후 감사 페이지 (`/thank-you.html` 등)
- 공통 CSS 파일 분리 (`public/assets/styles.css`)
- SEO 메타·`hreflang`·favicon
- 영어 vs 타언어 콘텐츠 동기화
