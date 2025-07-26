# Email Templates for Plate

Supabase의 인증 기능에 활용되는 이메일 템플릿 모음입니다. React Email로 제작되었습니다.

## Getting Started

### Requirements

실행에 앞서 다음 조건이 만족되어야 합니다. 다른 방법을 사용할 수도 있으나, 검증되지 않았으므로 발생하는 오류에 대해 책임지지 않습니다.

- Node.js v20 or higher
- Corepack installed and enabled with modern Yarn (4.2.9 or higher)
- Visual Studio Code

> 공식적으로 React Email에서는 Yarn PnP 기능을 지원하지 않고 있으나, 사용에 문제가 없어 이용 중에 있습니다.
> 따라서 Visual Studio Code와 사용 시에는 Ctrl + Shift + P를 눌러 워크스페이스에 내장된 SDK를 사용토록 설정하시기 바랍니다. 타 IDE의 경우, Yarn에서 지원할 경우 직접 `yarn sdks` 명령어를 활용하여 구성할 수 있습니다. 자세한 사항은 [문서](https://yarnpkg.com/cli/sdks/default)를 참조하세요.
> React Email does not support Yarn PnP officially, but this project uses without any errors. If you want to use with Visual Studio Code, press Ctrl + Shift + P to use SDKs genereated by Yarn. Other IDEs can set up with `yarn sdks` command if Yarn officially supports. See the [documentation](https://yarnpkg.com/cli/sdks/default) to see details.

### Install packages

```sh
yarn i
```

### Run development Server

```sh
yarn run dev
```

Open [localhost:3000](http://localhost:3000) with your browser to see the result.
[localhost:3000](http://localhost:3000) 주소로 접속하여 템플릿을 미리 보고 수정하실 수 있습니다.

### Export email templates

```sh
yarn run export
```

## Open Source License

본 프로젝트는 MIT License로 배포되며, 아래 오픈소스 소프트웨어를 사용하고 있습니다.

- React - [MIT License](https://github.com/facebook/react?tab=MIT-1-ov-file#readme)
- React Email - [MIT License](https://github.com/resend/react-email?tab=MIT-1-ov-file#readme)
- PostCSS - [MIT License](https://github.com/postcss/postcss?tab=MIT-1-ov-file#readme)
