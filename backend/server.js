import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

import authRoutes from "./authRoutes.js";
import conferenceRoutes from "./routes/conferenceRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

dotenv.config();

const { Pool } = pkg;

const useDatabaseUrl = Boolean(process.env.DATABASE_URL);

const pool = new Pool(
  useDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "speakerzone_tecnm",
        password: process.env.DB_PASS || "",
        port: Number(process.env.DB_PORT || 5432),
      }
);

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://speakerzone.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes(pool));
app.use("/api/conferences", conferenceRoutes(pool));
app.use("/api/events", eventRoutes(pool));
app.use("/api/speakers", speakerRoutes(pool));
app.use("/api/registrations", registrationRoutes(pool));

app.get("/", (_req, res) => {
  res.send("SpeakerZone backend funcionando ✅");
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

    res.status(500).json({
      error: "Error al conectar con la base de datos",
    });
  }
});

const PORT = Number(process.env.PORT || 5001);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});