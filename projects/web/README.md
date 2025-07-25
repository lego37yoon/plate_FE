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

## 서비스 구축

### Front-end

- Node.js 20 이상 버전 필요
- `corepack enable` 및 `git clone` 후 `yarn set version stable`로 최신 버전 여부 확인 필요 (Yarn v1 Classic 미지원)
- .env 파일

| 값 | 설명 |
| -- | ----- |
| PUBLIC_SUPABASE_PROJECT_URL | Supabase의 프로젝트 URL을 입력합니다. 주소 끝 `/` 기호는 입력하지 않습니다. |
| PUBLIC_SUPABASE_ANON_KEY | Supabase의 ANON 키를 입력합니다.
| SUPER_ADMIN_EMAIL | 최고 관리자로 가입할 때 사용할 이메일 주소를 입력합니다. |
| S3_BUCKET | S3 또는 S3 호환 저장소의 버킷 이름을 지정합니다. |
| S3_ENDPOINT | S3 또는 S3 호환 저장소의 주소를 지정합니다. 주소 끝 `/` 기호는 입력하지 않습니다. |
| S3_ALIAS | S3 또는 S3 호환 저장소에서 공개용 주소가 별도로 있는 경우(CloudFlare R2 등) 파일을 읽을 수 있도록 지정합니다. 주소 끝 `/` 기호는 입력하지 않습니다. |
| S3_REGION | S3 또는 S3 호환 저장소의 지역을 지정합니다. 호환 저장소의 경우 업체마다 다르거나, `auto`와 같은 값을 요구할 수 있습니다. |
| AWS_ACCESS_KEY | S3 사용시 Access Key를 입력합니다. 호환 저장소의 경우에도 Access Key를 발급받아 입력하면 됩니다. |
| AWS_SECRET_ACCESS_KEY | S3 사용시 Secret Access Key를 입력합니다. 호환 저장소의 경우에도 Secret Access Key를 발급받아 입력하면 됩니다. |
| S3_PERMISSION | 비공개 여부입니다. 일부 호환 저장소에서 지원하지 않는 경우 private로 두어도 무방합니다. |
| PUBLIC_BASE_URL | 프로젝트가 실행 중인 주소를 나타냅니다. 주소 끝에 `/` 기호는 입력하지 않습니다. |

### Back-end

- Supabase Cloud 또는 Self-Hosted Supabase가 필요합니다.
- Self-Hosted Supabase는 [링크](https://supabase.com/docs/guides/self-hosting)를 참조하시기 바랍니다.
- GitHub 로그인 기능을 사용하려면, Authentication에서 SignIn / Provider로 GitHub를 등록해야 하며 이를 위해 GitHub에서 OAuth Apps 등록이 필요합니다.
- PostgreSQL에 내장된 Row Level Policy 설정 등은 발표 자료에 등록 후 추후 별도 자료로 공개 예정입니다.

### AI & WebHook Server

- 추후 plate_AI 저장소에서 fastAPI 기반으로 WebHook 및 AI 모델 구동용 백엔드 서버 구축이 진행될 예정입니다.

## Open Source License

- AWS SDK - [Apache 2.0 License](https://github.com/aws/aws-sdk-js-v3?tab=Apache-2.0-1-ov-file#readme)
- Paraglide-js - [MIT License](https://github.com/opral/monorepo/blob/main/inlang/packages/paraglide/paraglide-js/README.md)
- SvelteKit - [MIT License](https://github.com/sveltejs/kit?tab=MIT-1-ov-file#readme)
- TailwindCSS - [MIT License](https://github.com/tailwindlabs/tailwindcss?tab=MIT-1-ov-file#readme)
- Supabase-js SDK - [MIT License](https://github.com/supabase/supabase-js?tab=MIT-1-ov-file#readme)
- mdsvex - [MIT License](https://github.com/pngwn/mdsvex?tab=MIT-1-ov-file#readme)
- markdown-it - [MIT License](https://github.com/markdown-it/markdown-it?tab=MIT-1-ov-file#readme)
- bits-ui - [MIT License](https://github.com/huntabyte/bits-ui?tab=MIT-1-ov-file#readme)
- lucide-svelte - [ISC License](https://lucide.dev/license) 
- IBM Plex Sans KR - SIL OFL 
