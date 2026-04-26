import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { authenticateToken } from "./middleware/authMiddleware.js";
import { sendVerificationEmail } from "./services/emailVerificationService.js";

const dbRoleToFrontendRole = (rol) => {
  if (rol === "administrativo") return "admin";
  if (rol === "conferencista") return "speaker";
  return "attendee";
};

const frontendRoleToDbRole = (role) => {
  if (role === "admin") return "administrativo";
  if (role === "speaker") return "conferencista";
  return "asistente";
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const isSchemaMismatchError = (error) =>
  error?.code === "42703" || // undefined_column
  error?.code === "42P01"; // undefined_table
const schemaMismatchMessage =
  "La base de datos no está actualizada para el módulo de autenticación. Aplica la migración más reciente y reinicia el servicio.";

const formatUser = (user) => ({
  id: user.id,
  name: user.nombre,
  email: user.email,
  role: dbRoleToFrontendRole(user.rol),
  avatarUrl: "",
});

const createToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      rol: user.rol,
      role: dbRoleToFrontendRole(user.rol),
    },
    process.env.JWT_SECRET || "clave_secreta_super_segura",
    { expiresIn: "8h" }
  );

const authRoutes = (pool) => {
  const router = express.Router();
  const defaultFrontendUrl = "https://hubacademico.mx";
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhostUrl = (value = "") => /https?:\/\/(localhost|127\.0\.0\.1)/i.test(value);
  const resolveFrontendUrl = (value) => {
    if (value && /^https?:\/\//.test(value)) {
      if (isProduction && isLocalhostUrl(value)) {
        return defaultFrontendUrl;
      }
      return value;
    }
    return defaultFrontendUrl;
  };
  const getRequestBaseUrl = (req) =>
    `${
      req.headers["x-forwarded-proto"]?.toString().split(",")[0] || req.protocol
    }://${req.get("host")}`;
  const getFrontendBaseUrlFromRequest = (req) => {
    return resolveFrontendUrl(process.env.FRONTEND_URL);
  };
  const buildVerificationUrl = (req, token, frontendBaseUrl) =>
    `${frontendBaseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const RESEND_COOLDOWN_MS = 30 * 1000;

  const verifyEmailToken = async (token) => {
    const result = await pool.query(
      `
      UPDATE usuarios
      SET
        email_verified = TRUE,
        email_verification_token = NULL,
        email_verification_expires = NULL,
        updated_at = NOW()
      WHERE
        email_verification_token = $1
        AND email_verification_expires > NOW()
      RETURNING id;
      `,
      [token]
    );

    return result.rows.length > 0;
  };

  router.post("/verify-email-token", async (req, res) => {
    const token =
      typeof req.body?.token === "string" ? req.body.token.trim() : "";

    if (!token) {
      return res.status(400).json({
        error: "Token inválido",
      });
    }

    try {
      const verified = await verifyEmailToken(token);
      if (!verified) {
        return res.status(400).json({
          error: "El enlace de verificación expiró o ya no es válido.",
        });
      }

      return res.json({
        message: "Correo verificado correctamente.",
      });
    } catch (error) {
      console.error("Error verificando token de correo:", error);
      return res.status(500).json({
        error: "No se pudo verificar el correo.",
      });
    }
  });

  router.get("/verify-email", async (req, res) => {
    const { token } = req.query;
    const redirectFromQuery =
      typeof req.query.redirect === "string" ? req.query.redirect : "";
    const redirectBase = resolveFrontendUrl(
      redirectFromQuery || process.env.FRONTEND_URL
    );

    if (!token || typeof token !== "string") {
      return res.redirect(
        `${redirectBase}/login?verified=error&reason=token_invalido`
      );
    }

    try {
      const verified = await verifyEmailToken(token);
      if (!verified) {
        return res.redirect(
          `${redirectBase}/login?verified=error&reason=token_expirado`
        );
      }

      return res.redirect(`${redirectBase}/login?verified=ok`);
    } catch (error) {
      console.error("Error verificando correo:", error);
      return res.redirect(
        `${redirectBase}/login?verified=error&reason=servidor`
      );
    }
  });

  router.post("/resend-verification", async (req, res) => {
    const finalEmail = normalizeEmail(req.body.email);

    if (!finalEmail) {
      return res.status(400).json({
        error: "Correo obligatorio",
      });
    }

    try {
      const userResult = await pool.query(
        `
        SELECT id, nombre, email, email_verified, email_verification_last_sent_at
        FROM usuarios
        WHERE email = $1;
        `,
        [finalEmail]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          error: "No existe una cuenta con ese correo.",
        });
      }

      const user = userResult.rows[0];

      if (user.email_verified) {
        return res.status(400).json({
          error: "Este correo ya fue verificado. Ya puedes iniciar sesión.",
        });
      }

      if (user.email_verification_last_sent_at) {
        const elapsedMs =
          Date.now() - new Date(user.email_verification_last_sent_at).getTime();
        if (elapsedMs < RESEND_COOLDOWN_MS) {
          const retryAfterSeconds = Math.ceil(
            (RESEND_COOLDOWN_MS - elapsedMs) / 1000
          );
          return res.status(429).json({
            error: `Espera ${retryAfterSeconds} segundos para reenviar el correo.`,
            retryAfterSeconds,
          });
        }
      }

      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const frontendBaseUrl = getFrontendBaseUrlFromRequest(req);

      await pool.query(
        `
        UPDATE usuarios
        SET
          email_verification_token = $2,
          email_verification_expires = $3,
          email_verification_last_sent_at = NOW(),
          updated_at = NOW()
        WHERE id = $1;
        `,
        [user.id, verificationToken, verificationExpires]
      );

      await sendVerificationEmail({
        to: user.email,
        name: user.nombre,
        token: verificationToken,
        verificationUrl: buildVerificationUrl(
          req,
          verificationToken,
          frontendBaseUrl
        ),
        loginUrl: `${frontendBaseUrl}/login`,
      });

      return res.json({
        message: "Correo de verificación reenviado correctamente.",
      });
    } catch (error) {
      console.error("Error al reenviar verificación:", error);
      if (isSchemaMismatchError(error)) {
        return res.status(503).json({
          error: schemaMismatchMessage,
        });
      }
      return res.status(500).json({
        error: "No se pudo reenviar el correo de verificación.",
      });
    }
  });

  /**
   * GET /api/auth/me
   * Valida si el token actual sigue vigente y devuelve el usuario real.
   */
  router.get("/me", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT id, nombre, email, rol, is_active
        FROM usuarios
        WHERE id = $1;
        `,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          error: "La sesión ya no es válida. Inicia sesión nuevamente.",
        });
      }

      if (!result.rows[0].is_active) {
        return res.status(403).json({
          error: "Esta cuenta está desactivada. Contacta a administración.",
        });
      }

      res.json(formatUser(result.rows[0]));
    } catch (error) {
      console.error("Error al validar sesión:", error);

      res.status(500).json({
        error: "Error al validar la sesión",
      });
    }
  });

  /**
   * POST /api/auth/register
   * Registro público.
   * Por seguridad, el registro público solo crea asistentes.
   */
  router.post("/register", async (req, res) => {
    const { nombre, name, email, password, rol, role } = req.body;

    const finalName = String(nombre || name || "").trim();
    const finalEmail = normalizeEmail(email);
    const requestedRole = role || rol || "attendee";

    const normalizedRequestedRole =
      requestedRole === "asistente"
        ? "attendee"
        : requestedRole === "conferencista"
          ? "speaker"
          : requestedRole === "administrativo"
            ? "admin"
            : requestedRole;

    if (!finalName || !finalEmail || !password) {
      return res.status(400).json({
        error: "Nombre, correo y contraseña son obligatorios",
      });
    }

    if (finalName.length < 3) {
      return res.status(400).json({
        error: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    if (normalizedRequestedRole !== "attendee") {
      return res.status(403).json({
        error:
          "El registro público solo permite crear cuentas de asistente. Las cuentas de conferencista o administrador deben ser creadas por administración.",
      });
    }

    const finalRol = frontendRoleToDbRole("attendee");

    try {
      const existing = await pool.query(
        `
        SELECT id
        FROM usuarios
        WHERE email = $1;
        `,
        [finalEmail]
      );

      if (existing.rows.length > 0) {
        return res.status(409).json({
          error: "Este correo ya está registrado",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const result = await pool.query(
        `
        INSERT INTO usuarios (
          nombre,
          email,
          password,
          rol,
          is_active,
          email_verified,
          email_verification_token,
          email_verification_expires,
          email_verification_last_sent_at
        )
        VALUES ($1, $2, $3, $4, TRUE, FALSE, $5, $6, NOW())
        RETURNING id, nombre, email, rol, is_active;
        `,
        [
          finalName,
          finalEmail,
          hashedPassword,
          finalRol,
          verificationToken,
          verificationExpires,
        ]
      );

      const user = result.rows[0];

      try {
        const frontendBaseUrl = getFrontendBaseUrlFromRequest(req);
        await sendVerificationEmail({
          to: finalEmail,
          name: finalName,
          token: verificationToken,
          verificationUrl: buildVerificationUrl(
            req,
            verificationToken,
            frontendBaseUrl
          ),
          loginUrl: `${frontendBaseUrl}/login`,
        });
      } catch (mailError) {
        await pool.query(
          `
          DELETE FROM usuarios
          WHERE id = $1;
          `,
          [user.id]
        );

        throw mailError;
      }

      res.status(201).json({
        message:
          "Cuenta creada. Revisa tu correo para verificar la cuenta antes de iniciar sesión.",
        requiresEmailVerification: true,
        user: formatUser(user),
      });
    } catch (error) {
      console.error("Error en registro:", error);
      if (isSchemaMismatchError(error)) {
        return res.status(503).json({
          error: schemaMismatchMessage,
        });
      }

      res.status(500).json({
        error: "Error al registrar usuario",
      });
    }
  });

  /**
   * POST /api/auth/login
   */
  router.post("/login", async (req, res) => {
    const finalEmail = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!finalEmail || !password) {
      return res.status(400).json({
        error: "Correo y contraseña son obligatorios",
      });
    }

    try {
      const result = await pool.query(
        `
        SELECT id, nombre, email, password, rol, is_active, email_verified
        FROM usuarios
        WHERE email = $1;
        `,
        [finalEmail]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          error: "Correo o contraseña incorrectos",
        });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({
          error: "Esta cuenta está desactivada. Contacta a administración.",
        });
      }

      if (!user.email_verified) {
        return res.status(403).json({
          error:
            "Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.",
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({
          error: "Correo o contraseña incorrectos",
        });
      }

      res.json({
        message: "Login exitoso",
        token: createToken(user),
        user: formatUser(user),
      });
    } catch (error) {
      console.error("Error en login:", error);
      if (isSchemaMismatchError(error)) {
        return res.status(503).json({
          error: schemaMismatchMessage,
        });
      }

      res.status(500).json({
        error: "Error al iniciar sesión",
      });
    }
  });

  return router;
};

export default authRoutes;