import nodemailer from "nodemailer";

const getFrontendBaseUrl = () =>
  process.env.NODE_ENV === "production"
    ? "https://hubacademico.mx"
    : process.env.FRONTEND_URL || "http://localhost:5173";

const getBackendBaseUrl = () =>
  process.env.NODE_ENV === "production"
    ? process.env.BASE_URL || `http://localhost:${process.env.PORT || 5001}`
    : `http://localhost:${process.env.PORT || 5001}`;

const createTransporter = () => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

export const sendVerificationEmail = async ({
  to,
  name,
  token,
  verificationUrl,
  loginUrl,
}) => {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error(
      "No hay configuración de correo. Define EMAIL_USER y EMAIL_PASS."
    );
  }

  const finalVerificationUrl =
    verificationUrl ||
    `${getBackendBaseUrl()}/api/auth/verify-email?token=${token}`;
  const finalLoginUrl = loginUrl || `${getFrontendBaseUrl()}/login`;

  await transporter.sendMail({
    from: `"Hub Académico" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Confirma tu correo - Hub Académico",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; max-width: 560px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; padding: 18px 20px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 999px; background: rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; font-weight: 700;">
            HA
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 700;">Hub Académico</div>
            <div style="font-size: 13px; opacity: 0.9;">Confirmación de correo</div>
          </div>
        </div>
        <div style="padding: 22px 20px;">
          <p style="margin: 0 0 12px;">Hola ${name}, confirma tu correo para activar tu cuenta.</p>
          <div style="text-align: center; margin: 22px 0;">
            <a href="${finalVerificationUrl}" style="display:inline-block;padding:12px 22px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">
              Verificar mi correo
            </a>
          </div>
          <p style="margin: 0; font-size: 13px; color: #4b5563;">
            Si el botón no abre, usa este enlace:
            <a href="${finalVerificationUrl}">${finalVerificationUrl}</a>
          </p>
          <p style="margin: 14px 0 0; font-size: 13px; color: #4b5563;">
            Después inicia sesión en:
            <a href="${finalLoginUrl}">${finalLoginUrl}</a>
          </p>
        </div>
      </div>
    `,
  });
};
