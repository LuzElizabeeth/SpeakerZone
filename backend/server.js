import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

import authRoutes from "./authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const { Pool } = pkg;

// ✅ Detecta si existe DATABASE_URL
const useDatabaseUrl = Boolean(process.env.DATABASE_URL);

const pool = new Pool(
  useDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Render requiere SSL
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "speakerzone_tecnm",
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT || 5432),
      }
);

// ✅ Solo valida DB_PASSWORD si no usas DATABASE_URL
if (!useDatabaseUrl && !process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD no está definido");
}

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://speakerzone.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Rutas
app.use("/api/auth", authRoutes(pool));
app.use("/api/activities", activityRoutes(pool));
app.use("/api/events", eventRoutes(pool));
app.use("/api/programs", programRoutes(pool));
app.use("/api/speakers", speakerRoutes(pool));
app.use("/api/registrations", registrationRoutes(pool));
app.use("/api/users", userRoutes(pool));

app.get("/", (_req, res) => {
  res.send("Hub académico backend funcionando ✅");
});

app.get("/api/db-check", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "Conectado a PostgreSQL 🚀",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Error al conectar con PostgreSQL:", error);
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});

const PORT = Number(process.env.PORT || 5001);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
