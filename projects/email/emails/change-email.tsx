import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const ConfirmSignup = () => (
  <Html>
    <Head>
      <Font
        fontFamily="IBM Plex Sans KR"
        fallbackFontFamily={"sans-serif"}
        webFont={{
          url: "https://raw.githubusercontent.com/IBM/plex/refs/heads/master/packages/plex-sans-kr/fonts/complete/woff2/hinted/IBMPlexSansKR-Text.woff2",
          format: "woff2"
        }}
        fontWeight={400}
        fontStyle="normal" />
      <Font
        fontFamily="IBM Plex Sans KR"
        fallbackFontFamily={"sans-serif"}
        webFont={{
          url: "https://raw.githubusercontent.com/IBM/plex/refs/heads/master/packages/plex-sans-kr/fonts/complete/woff2/hinted/IBMPlexSansKR-SemiBold.woff2",
          format: "woff2"
        }}
        fontWeight={600}
        fontStyle="normal" />
    </Head>
    <Preview>이메일 변경 확인 / Confirm Change of Email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://raw.githubusercontent.com/lego37yoon/plate_FE/refs/heads/main/projects/web/static/favicon.png" width={"48px"} style={{ margin: "16px 0 8px -8px" }} />
        <Heading style={h1}>이메일 변경 확인</Heading>
        <Text style={h2}>Confirm Change of Email</Text>
        <Text style={text}>
            확인 버튼을 눌러 이메일 변경 절차를 마무리하세요.<br />
            Click the Confirm button to complete changing your email address of an account.
        </Text>
        <Button
          href="{{ .ConfirmationURL }}"
          target="_blank"
          style={{
            background: "#ECEFD5",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#333",
            borderRadius: "10px",
            margin: "16px 0",
          }}
        >
          확인 Confirm
        </Button>
        <hr style={hr} />
        <Text style={{ ...text, fontSize: "13px", marginBottom: "14px" }}>
          또는 아래 링크를 브라우저에 붙여 넣어 완료하실 수 있습니다.<br />
          or copy and paste this link to complete changing your email:
        </Text>
        <code style={code}>{`{{ .SiteURL }}/account/migration/confirm?token_hash={{ .TokenHash }}&type=change_email`}</code>
        <hr style={hr} />
        <Text
          style={{
            ...text,
            color: "#ababab",
            lineHeight: "120%",
            fontSize: "12px"
          }}
        >
          이메일 변경을 요청하지 않았다면, 서비스로 이동하여 계정 보안을 점검하세요. <br />
          If you didn&apos;t try to change your email, check your account security at our service.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ConfirmSignup;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#7D863F",
  fontFamily:
    "IBM Plex Sans KR, IBM Plex KR, SUITE, SUITE Variable, Pretendard, Pretendard Variable, SUIT, SUIT Variable, Noto Sans CJK KR, Noto Sans KR, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0",
  padding: "0",
};

const h2 = {
  color: "#ECEFD5",
  fontFamily:
    "IBM Plex Sans KR, IBM Plex KR, SUITE, SUITE Variable, Pretendard, Pretendard Variable, SUIT, SUIT Variable, Noto Sans CJK KR, Noto Sans KR, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "400",
  margin: "0 0 48px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontFamily:
    "IBM Plex Sans KR, IBM Plex KR, SUITE, SUITE Variable, Pretendard, Pretendard Variable, SUIT, SUIT Variable, Noto Sans CJK KR, Noto Sans KR, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  lineHeight: "140%",
  margin: "0 0",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  fontSize: "12px",
  fontFamily:
    "IBM Plex Sans KR, IBM Plex KR, SUITE, SUITE Variable, Pretendard, Pretendard Variable, SUIT, SUIT Variable, Noto Sans CJK KR, Noto Sans KR, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};

const hr = {
  border: "none",
  height: "1px",
  background: "#b6b6b6",
  borderRadius: "5px"
}
