import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

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

const roleLabels = {
  asistente: "Asistente",
  conferencista: "Conferencista",
  administrativo: "Administrador",
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const formatUser = (row) => ({
  id: row.id,
  name: row.nombre,
  email: row.email,
  role: dbRoleToFrontendRole(row.rol),
  roleLabel: roleLabels[row.rol] || row.rol,
  isActive: Boolean(row.is_active),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  linkedSpeakerId: row.speaker_id || null,
});

const generateTemporaryPassword = () => {
  return `Sz-${crypto.randomBytes(4).toString("hex")}`;
};

const ensureSpeakerProfile = async (client, user) => {
  const existing = await client.query(
    `
    SELECT id
    FROM speakers
    WHERE user_id = $1;
    `,
    [user.id]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  const result = await client.query(
    `
    INSERT INTO speakers (
      user_id,
      name,
      role,
      bio,
      organization,
      avatar_url
    )
    VALUES ($1, $2, 'Conferencista', '', '', '')
    RETURNING id;
    `,
    [user.id, user.nombre]
  );

  return result.rows[0].id;
};

const userRoutes = (pool) => {
  const router = express.Router();

  router.use(authenticateToken);
  router.use(authorizeRoles("admin"));

  /**
   * GET /api/users
   * Lista usuarios reales del sistema.
   */
  router.get("/", async (_req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          u.id,
          u.nombre,
          u.email,
          u.rol,
          u.is_active,
          u.created_at,
          u.updated_at,
          s.id AS speaker_id
        FROM usuarios u
        LEFT JOIN speakers s ON s.user_id = u.id
        ORDER BY u.created_at DESC;
        `
      );

      res.json(result.rows.map(formatUser));
    } catch (error) {
      console.error("Error al listar usuarios:", error);

      res.status(500).json({
        error: "Error al listar usuarios",
      });
    }
  });

  /**
   * POST /api/users
   * Crea usuarios desde administración.
   */
  router.post("/", async (req, res) => {
    const { name, email, password, role } = req.body;

    const finalName = String(name || "").trim();
    const finalEmail = normalizeEmail(email);
    const finalRole = role || "attendee";
    const dbRole = frontendRoleToDbRole(finalRole);

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

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existing = await client.query(
        `
        SELECT id
        FROM usuarios
        WHERE email = $1;
        `,
        [finalEmail]
      );

      if (existing.rows.length > 0) {
        await client.query("ROLLBACK");

        return res.status(409).json({
          error: "Este correo ya está registrado",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userResult = await client.query(
        `
        INSERT INTO usuarios (
          nombre,
          email,
          password,
          rol,
          is_active
        )
        VALUES ($1, $2, $3, $4, TRUE)
        RETURNING id, nombre, email, rol, is_active, created_at, updated_at;
        `,
        [finalName, finalEmail, hashedPassword, dbRole]
      );

      const createdUser = userResult.rows[0];

      if (dbRole === "conferencista") {
        await ensureSpeakerProfile(client, createdUser);
      }

      await client.query("COMMIT");

      const fullUser = await pool.query(
        `
        SELECT
          u.id,
          u.nombre,
          u.email,
          u.rol,
          u.is_active,
          u.created_at,
          u.updated_at,
          s.id AS speaker_id
        FROM usuarios u
        LEFT JOIN speakers s ON s.user_id = u.id
        WHERE u.id = $1;
        `,
        [createdUser.id]
      );

      res.status(201).json(formatUser(fullUser.rows[0]));
    } catch (error) {
      await client.query("ROLLBACK");

      console.error("Error al crear usuario:", error);

      res.status(500).json({
        error: "Error al crear usuario",
      });
    } finally {
      client.release();
    }
  });

  /**
   * PUT /api/users/:id
   * Actualiza nombre, correo y rol.
   */
  router.put("/:id", async (req, res) => {
    const { name, email, role } = req.body;

    const finalName = String(name || "").trim();
    const finalEmail = normalizeEmail(email);
    const dbRole = frontendRoleToDbRole(role || "attendee");

    if (!finalName || !finalEmail) {
      return res.status(400).json({
        error: "Nombre y correo son obligatorios",
      });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const currentResult = await client.query(
        `
        SELECT id, nombre, email, rol
        FROM usuarios
        WHERE id = $1;
        `,
        [req.params.id]
      );

      if (currentResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          error: "Usuario no encontrado",
        });
      }

      const duplicateEmail = await client.query(
        `
        SELECT id
        FROM usuarios
        WHERE email = $1
          AND id <> $2;
        `,
        [finalEmail, req.params.id]
      );

      if (duplicateEmail.rows.length > 0) {
        await client.query("ROLLBACK");

        return res.status(409).json({
          error: "Otro usuario ya utiliza este correo",
        });
      }

      const updateResult = await client.query(
        `
        UPDATE usuarios
        SET
          nombre = $1,
          email = $2,
          rol = $3,
          updated_at = NOW()
        WHERE id = $4
        RETURNING id, nombre, email, rol, is_active, created_at, updated_at;
        `,
        [finalName, finalEmail, dbRole, req.params.id]
      );

      const updatedUser = updateResult.rows[0];

      if (dbRole === "conferencista") {
        await ensureSpeakerProfile(client, updatedUser);
      }

      await client.query("COMMIT");

      const fullUser = await pool.query(
        `
        SELECT
          u.id,
          u.nombre,
          u.email,
          u.rol,
          u.is_active,
          u.created_at,
          u.updated_at,
          s.id AS speaker_id
        FROM usuarios u
        LEFT JOIN speakers s ON s.user_id = u.id
        WHERE u.id = $1;
        `,
        [req.params.id]
      );

      res.json(formatUser(fullUser.rows[0]));
    } catch (error) {
      await client.query("ROLLBACK");

      console.error("Error al actualizar usuario:", error);

      res.status(500).json({
        error: "Error al actualizar usuario",
      });
    } finally {
      client.release();
    }
  });

  /**
   * PATCH /api/users/:id/status
   * Activa o desactiva un usuario.
   */
  router.patch("/:id/status", async (req, res) => {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        error: "El estado isActive debe ser booleano",
      });
    }

    if (req.params.id === req.user.id && isActive === false) {
      return res.status(409).json({
        error: "No puedes desactivar tu propia cuenta",
      });
    }

    try {
      const result = await pool.query(
        `
        UPDATE usuarios
        SET
          is_active = $1,
          updated_at = NOW()
        WHERE id = $2
        RETURNING id, nombre, email, rol, is_active, created_at, updated_at;
        `,
        [isActive, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Usuario no encontrado",
        });
      }

      const speakerResult = await pool.query(
        `
        SELECT id AS speaker_id
        FROM speakers
        WHERE user_id = $1;
        `,
        [req.params.id]
      );

      res.json(
        formatUser({
          ...result.rows[0],
          speaker_id: speakerResult.rows[0]?.speaker_id || null,
        })
      );
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);

      res.status(500).json({
        error: "Error al cambiar estado del usuario",
      });
    }
  });

  /**
   * PATCH /api/users/:id/password
   * Resetea contraseña y devuelve una temporal.
   */
  router.patch("/:id/password", async (req, res) => {
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    try {
      const result = await pool.query(
        `
        UPDATE usuarios
        SET
          password = $1,
          updated_at = NOW()
        WHERE id = $2
        RETURNING id, nombre, email, rol, is_active, created_at, updated_at;
        `,
        [hashedPassword, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Usuario no encontrado",
        });
      }

      const speakerResult = await pool.query(
        `
        SELECT id AS speaker_id
        FROM speakers
        WHERE user_id = $1;
        `,
        [req.params.id]
      );

      res.json({
        user: formatUser({
          ...result.rows[0],
          speaker_id: speakerResult.rows[0]?.speaker_id || null,
        }),
        temporaryPassword,
      });
    } catch (error) {
      console.error("Error al resetear contraseña:", error);

      res.status(500).json({
        error: "Error al resetear contraseña",
      });
    }
  });

  return router;
};

export default userRoutes;