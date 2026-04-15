import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  username?: string;
  resetToken: string;
  baseUrl?: string;
  pfp?: string;
}

const defaultPfp =
  "https://i.pinimg.com/736x/a9/5e/7a/a95e7a415633a614613e757bac4246ed.jpg";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export const PasswordResetEmail = ({
  username = "Usuario",
  resetToken,
  baseUrl = getBaseUrl(),
  pfp = defaultPfp,
}: PasswordResetEmailProps) => {
  const previewText = "Restablece tu contraseña";

  return (
    <Html>
      <Head>
        <Font
          fontFamily="DM Mono"
          fontWeight={400}
          fontStyle="normal"
          fallbackFontFamily="monospace"
        />
        <Font
          fontFamily="Playfair Display"
          fontWeight={400}
          fontStyle="normal"
          fallbackFontFamily="serif"
        />
      </Head>
      <Preview>{previewText}</Preview>

      <Body
        style={{
          background: "#f9f6f1",
          fontFamily: '"DM Mono", monospace',
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "48px 0",
            maxWidth: 480,
          }}
        >
          <Img
            src={pfp}
            width="64"
            height="64"
            alt="Logo"
            style={{
              display: "block",
              margin: "0 auto 32px",
              borderRadius: "50%",
            }}
          />

          <Text
            style={{
              color: "#2d2926",
              fontSize: "14px",
              lineHeight: "1.5",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            Hola, <strong>{username}</strong>
          </Text>

          <Text
            style={{
              color: "#2d2926",
              fontSize: "14px",
              lineHeight: "1.5",
              marginBottom: "32px",
            }}
          >
            Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo
            para crear una nueva contraseña. Este enlace caduca en 1 hora.
          </Text>

          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Button
              href={`${baseUrl}/reset-password/${resetToken}`}
              style={{
                background: "#c0392b",
                color: "#f9f6f1",
                fontFamily: '"DM Mono", monospace',
                fontSize: "14px",
                textDecoration: "none",
                borderRadius: "4px",
                display: "inline-block",
                padding: "12px 24px",
              }}
            >
              Restablecer contraseña
            </Button>
          </Section>

          <Hr
            style={{
              border: "none",
              borderTop: "1px solid #d4cdc2",
              margin: "32px 0",
            }}
          />

          <Text
            style={{
              color: "#9b8f82",
              fontSize: "12px",
              lineHeight: "1.5",
              textAlign: "center",
            }}
          >
            Si no solicitaste este cambio, puedes ignorar este correo.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;
