import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

const createToken = (user) => jwt.sign(
  { id: user.id, rol: user.rol },
  process.env.JWT_SECRET || "clave_secreta_super_segura",
  { expiresIn: "8h" }
);

const authRoutes = (pool) => {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    const { nombre, name, email, password, rol, role } = req.body;
    const finalName = nombre || name;
    const finalRol = rol || frontendRoleToDbRole(role || "attendee");

    if (!finalName || !email || !password || !finalRol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
      const existing = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);

      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "Este correo ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO usuarios (nombre, email, password, rol)
         VALUES ($1, $2, $3, $4)
         RETURNING id, nombre, email, rol`,
        [finalName, email, hashedPassword, finalRol]
      );

      const user = result.rows[0];

      res.status(201).json({
        message: "Usuario registrado con éxito",
        token: createToken(user),
        user: {
          id: user.id,
          name: user.nombre,
          email: user.email,
          role: dbRoleToFrontendRole(user.rol),
          avatarUrl: ""
        }
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

      if (result.rows.length === 0) {
        return res.status(400).json({ error: "Usuario no encontrado" });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
      }

      res.json({
        message: "Login exitoso",
        token: createToken(user),
        user: {
          id: user.id,
          name: user.nombre,
          email: user.email,
          role: dbRoleToFrontendRole(user.rol),
          avatarUrl: ""
        }
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  return router;
};

export default authRoutes;