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

const useDatabaseUrl = Boolean(process.env.DATABASE_URL);
const dbPassword = process.env.DB_PASSWORD || process.env.DB_PASS;
const dbSsl = process.env.DB_SSL === "true";

if (!useDatabaseUrl && !dbPassword) {
  throw new Error("DB_PASSWORD o DB_PASS no está definido");
}

const pool = new Pool(
  useDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "speakerzone_tecnm",
        password: dbPassword,
        port: Number(process.env.DB_PORT || 5432),
        ssl: dbSsl ? { rejectUnauthorized: false } : false,
      }
);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "https://speakerzone.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes(pool));
app.use("/api/activities", activityRoutes(pool));
app.use("/api/events", eventRoutes(pool));
app.use("/api/programs", programRoutes(pool));
app.use("/api/speakers", speakerRoutes(pool));
app.use("/api/registrations", registrationRoutes(pool));
app.use("/api/users", userRoutes(pool));

app.get("/", (_req, res) => {
  res.send("Hub Académico backend funcionando ✅");
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