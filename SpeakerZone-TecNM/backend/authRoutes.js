import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRoutes = (pool) => {
  const router = express.Router();

  // Registro de usuario
  router.post("/register", async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
      const rolesPermitidos = ["asistente", "conferencista", "administrativo"];
      if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({ error: "Rol inválido" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id",
        [nombre, email, hashedPassword, rol]
      );

      res.json({ message: "Usuario registrado con éxito", userId: result.rows[0].id });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });

  // Login de usuario
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

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

      const token = jwt.sign(
        { id: user.id, rol: user.rol },
        process.env.JWT_SECRET || "clave_secreta_super_segura",
        { expiresIn: "1h" }
      );

      res.json({ message: "Login exitoso", token });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  return router;
};

export default authRoutes;
