import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { authenticateToken } from "./middleware/authMiddleware.js";

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

      const result = await pool.query(
        `
        INSERT INTO usuarios (
          nombre,
          email,
          password,
          rol,
          is_active
        )
        VALUES ($1, $2, $3, $4, TRUE)
        RETURNING id, nombre, email, rol, is_active;
        `,
        [finalName, finalEmail, hashedPassword, finalRol]
      );

      const user = result.rows[0];

      res.status(201).json({
        message: "Usuario registrado con éxito",
        token: createToken(user),
        user: formatUser(user),
      });
    } catch (error) {
      console.error("Error en registro:", error);

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
        SELECT id, nombre, email, password, rol, is_active
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

      res.status(500).json({
        error: "Error al iniciar sesión",
      });
    }
  });

  return router;
};

export default authRoutes;