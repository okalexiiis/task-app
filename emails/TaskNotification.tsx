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
import * as React from "react";

interface TaskNotificationEmailProps {
  assigneeUsername: string;
  taskName: string;
  oldStatus: string;
  newStatus: string;
  groupName?: string;
}

const defaultPfp =
  "https://i.pinimg.com/736x/a9/5e/7a/a95e7a415633a614613e757bac4246ed.jpg";

const statusLabels: Record<string, string> = {
  DONE: "Completada",
  CANCELED: "Cancelada",
};

export const TaskNotificationEmail = ({
  assigneeUsername = "Usuario",
  taskName = "Tarea",
  oldStatus = "PENDING",
  newStatus = "DONE",
  groupName,
}: TaskNotificationEmailProps) => {
  const statusLabel = statusLabels[newStatus] || newStatus;
  const previewText = `Tarea "${taskName}" ${statusLabel.toLowerCase()}`;

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
            src={defaultPfp}
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
              marginBottom: "8px",
            }}
          >
            Hola,
          </Text>

          <Text
            style={{
              color: "#2d2926",
              fontSize: "14px",
              lineHeight: "1.5",
              marginBottom: "24px",
            }}
          >
            <strong>{assigneeUsername}</strong> ha{" "}
            <strong>{statusLabel.toLowerCase()}</strong> la tarea:{" "}
            <strong>{taskName}</strong>
            {groupName && <span> en el grupo &quot;{groupName}&quot;</span>}
          </Text>

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
            Estás recibiendo este correo porque eres owner o admin del grupo.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TaskNotificationEmail;