# Plate / Frontend Web Service

## Getting Started

### Setting up from Supabase

#### Database

Before test this project with new Supabase project, enable aggregate functions via following SQL command, at SQL Editor:

```sql
ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
NOTIFY pgrst, 'reload config';
```

Then add tables and set RLSs (Row Level Policy) to adjust permissions. Details will be updated.

Before access to the page including "/translate" pathname, run a command below to set query function for getting contents of the page.
```sql
CREATE OR REPLACE FUNCTION resources_with_dictionary(
  resource_id INT DEFAULT NULL
)
RETURNS SETOF jsonb
SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  RETURN QUERY
  SELECT
    jsonb_build_object( 
      "id", before.id,
      "key", before.key,
      "origin", before.origin,
      "category", before.category,
      "parent_id", before.parent_id,
      "group_idx", before.group_idx,
      "context", before.context,
      "results",
        CASE WHEN resource_id THEN
          COALESCE (
            (
              SELECT jsonb_agg(after.*)
              FROM results AS after
              WHERE
                before.id == after.origin_id
                AND before.lang_code == after.lang_code
            ),
            "[]"::jsonb
          )
        ELSE
          COALESCE (
            (
              SELECT jsonb_agg(after.*)
              FROM results AS after
              WHERE
                before.id == after.origin_id
                AND before.lang_code == after.lang_code
                AND after.approved
            ),
            "[]"::jsonb
          )
        END,
      "dictionary", COALESCE (
        (
          SELECT jsonb_agg(d.*)
          FROM dictionary AS d
          WHERE
            resource_id IS NOT NULL
            AND before.origin LIKE "%" || d.origin || "%"
        ),
        "[]"::jsonb
      )
    )
  FROM resources AS before;
END;
$$ LANGUAGE plpgsql;
```

> **Why these commands are required?**
> Some pages uses aggregate functions to query data from multiple tables; and Supabase database basically disabled this feature as default.

### Requirements

- Node.js 20 or higher
- `corepack enable`, `git clone`, and `yarn set version stable` to check if latest version of package manager installed in your computer. Yarn v1 Classic is not supported for this project.
- .env File to save secrets

| 값 | 설명 |
| -- | ----- |
| PUBLIC_SUPABASE_PROJECT_URL | Project URL of Supabase. DO NOT INCLUDE `/` end of an address. |
| PUBLIC_SUPABASE_ANON_KEY | ANON Key of Supabase. |
| SUPER_ADMIN_EMAIL | E-mail address of Super Administrator. |
| S3_BUCKET | Bucket name of S3 or S3-Compatible Object Storage |
| S3_ENDPOINT | Address of S3 or S3-Compatible Object Storage. DO NOT INCLUDE `/` end of an address. |
| S3_ALIAS | Pulic Address of S3 or S3-Compatible Object Storage. Database saves address and path of uploaded files based on this address. DO NOT INCLUDE `/` end of an address. |
| S3_REGION | Region of S3 or S3-Compatible Object Storage. Note that Compatible Services may not support region or requires `auto` instead of specify a region to save objects. |
| AWS_ACCESS_KEY | Access Key of S3 or S3-Compatible Object Storage. |
| AWS_SECRET_ACCESS_KEY | Secret Access key of S3 or S3-Compatible Object Storage. |
| S3_PERMISSION | Default access permission of S3, S3-Compatible Object Storage. Some compatible services like CloudFlare R2 requires `private` value. |
| PUBLIC_BASE_URL | Network address of this project. For example, local development server will have `http://localhost:5173` here. DO NOT INCLUDE `/` end of an address too. |

> Please note that due to Supabase Product Update since Q3 2025, ANON Key is an old way to use Supabase data. Migration for token-based access will be supported after Q4 2025.

## Known Issues

- See Issues tab in GitHub

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
