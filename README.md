# Plate

Plate: Improved Experience for translation contributors - Graduation Project at Soonchunhyang University

**한국어** | *English* (coming soon)

---

# 한국어

## Plate란?

번역 기여자를 대상으로 향상된 경험을 제공하는 플랫폼으로, 2024학년도 2학기 캡스톤디자인 과목을 거쳐 2025학년도 1학기 산학캡스톤디자인 중 개발과 설계를 병행하고 있는 졸업작품입니다.
계획대로 진행된다면 2025년 11월 경 학술제에서 포스터 발표를 진행할 예정입니다.

### 다른 서비스와 차이점과 유사점

Weblate, Pontoon 등과 비교했을 때 아래와 같은 주요 기능을 추가로 갖출 예정입니다.

1. 그간 Context 기능으로 표시되어 온 번역 대상 문자열 간 관계를 UI 상으로 보다 명확하게 표시하여, 번역 시 문맥 이해에 들이는 시간을 줄입니다.
2. 번역 가이드라인 문서를 시스템이 이해하는 체계로 제작하여 설정과 가이드라인을 매번 수동으로 동기화해야 하는 상황을 줄입니다.

반대로 한계점도 지니고 있습니다.

1. 위와 같은 기능을 구현하기 위해 기존 문법에서 파생된 독자 문법 등을 사용하므로, 플랫폼 종속적인 형태가 될 수 있습니다.
2. 본 작품은 개발 기한이 6개월 내외이므로 기존 시스템의 모든 편의기능을 서비스할 수는 없습니다.

## 구성

### Frontend

[프로젝트 저장소](./projects/web)를 확인하세요.

### Email Templates

[프로젝트 저장소](./projects/email/)를 확인하세요.

### Locale Codes

[프로젝트 저장소](./projects/locale)를 확인하세요.

언어 코드를 가져오는 데 사용하는 [locale-codes](https://github.com/TiagoDanin/Locale-Codes) 패키지를 본 프로젝트의 필요에 맞게 업데이트 및 수정하여 관리합니다. 원본 소스코드가 과거 버전에 머물러 있기에, 가급적 최신 사양에 맞게 갱신하고 신규 속성 값을 추가하는 작업을 진행할 예정입니다.

### Back-end

- Supabase Cloud 또는 Self-Hosted Supabase가 필요합니다.
- Self-Hosted Supabase는 [링크](https://supabase.com/docs/guides/self-hosting)를 참조하시기 바랍니다.
- GitHub 로그인 기능을 사용하려면, Authentication에서 SignIn / Provider로 GitHub를 등록해야 하며 이를 위해 GitHub에서 OAuth Apps 등록이 필요합니다.
- PostgreSQL에 내장된 Row Level Policy 설정 등은 발표 자료에 등록 후 추후 별도 자료로 공개 예정입니다.

### AI & WebHook Server

- 추후 plate_AI 저장소에서 fastAPI 기반으로 WebHook 및 AI 모델 구동용 백엔드 서버 구축이 진행될 예정입니다.

## 커밋 규칙

### v1

모노레포 구성 전 및 구성 직후까지 사용된 규칙입니다.

| 접두사 | 설명 |
| --- | ---- |
| init: | 프로젝트 설정과 관련된 변경 사항을 입력합니다. |
| feat: | 새로운 기능을 추가할 때 입력합니다. |
| fix: | 오류, 또는 오류가 아니지만 사소한 고침이 발생할 때 입력합니다. 단, 문서의 경우 별도의 접두사를 사용합니다. |
| docs: | 문서를 새로 쓰거나 변경 시 사용합니다. |

### v2

v1에서 사용하는 접두사는 그대로 사용하되, 프로젝트 구분을 위해 다음과 같은 추가 접두사가 v1의 접두사보다 우선하여 붙습니다.

| 접두사 | 설명 |
| --- | ---- |
| (co) | 전체 저장소에 해당하는 변경사항을 담습니다. 주로 본 루트 폴더의 변경사항에 한합니다.
| (web) | 프론트엔드 웹 앱에서 발생하는 변경사항에 붙입니다. |
| (email) | Supabase 인증 과정에서 사용하는 이메일 템플릿 관련 변경사항에 붙입니다. |
| (locale) | locale-codes 패키지를 fork한 후 발생한 변경 사항을 반영합니다. |

백엔드 및 AI 관련 저장소는 Yarn monorepo를 사용하기 어려운 환경이므로 별도의 저장소로 분리하여 제공할 예정입니다. 개발 시 문서를 갱신하여 연결 가능한 링크를 덧붙이게 됩니다.

## Open Source Licenses

각 프로젝트 저장소에서 확인하실 수 있으며, 본 저장소는 [BSD-2-Clause 라이선스](https://github.com/yarnpkg/berry?tab=BSD-2-Clause-1-ov-file#readme)를 적용하는 Yarn의 monorepo 시스템을 사용하고 있습니다.

Plate의 모든 소스코드는 MIT License에 의거하여 배포됩니다.