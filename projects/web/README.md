# Plate / Frontend Web Service

## Getting Started

### Requirements

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
