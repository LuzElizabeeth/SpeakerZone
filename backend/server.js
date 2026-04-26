import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

import authRoutes from "./authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
import fs from "fs";

if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
  console.log("Usando configuración local (.env.local)");
}

const { Pool } = pkg;

const useDatabaseUrl =
  (process.env.NODE_ENV === "production" ||
    process.env.USE_DATABASE_URL === "true") &&
  Boolean(process.env.DATABASE_URL);
const dbPassword = process.env.DB_PASSWORD || process.env.DB_PASS;
const dbSsl = process.env.DB_SSL === "true" || useDatabaseUrl;

if (!useDatabaseUrl && !dbPassword) {
  throw new Error("DB_PASSWORD o DB_PASS no está definido");
}

const pool = new Pool(
  useDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: dbSsl
          ? {
              rejectUnauthorized: false,
            }
          : false,
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "speakerzone_tecnm",
        password: dbPassword,
        port: Number(process.env.DB_PORT || 5432),
        ssl: dbSsl
          ? {
              rejectUnauthorized: false,
            }
          : false,
      }
);

pool.on("error", (error) => {
  console.error("Error inesperado en el pool de PostgreSQL:", error);
});

const app = express();

const configuredFrontendUrl = process.env.FRONTEND_URL;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://speakerzone.netlify.app",
  "https://hubacademico.mx",
  ...(configuredFrontendUrl ? [configuredFrontendUrl] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowedOrigin = allowedOrigins.includes(origin);
      const isLocalNetworkFrontend =
        /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/.test(origin);
      const isLegacyLocalhost8080 = origin === "http://localhost:8080";

      if (isAllowedOrigin || isLocalNetworkFrontend || isLegacyLocalhost8080) {
        return callback(null, true);
      }

      return callback(new Error("CORS: origin no permitido"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes(pool));
app.use("/api/programs", programRoutes(pool));
app.use("/api/activities", activityRoutes(pool));
app.use("/api/registrations", registrationRoutes(pool));
app.use("/api/speakers", speakerRoutes(pool));
app.use("/api/users", userRoutes(pool));

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

const ensureEmailVerificationColumns = async () => {
  await pool.query(`
    ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
  `);

  await pool.query(`
    ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS email_verification_token TEXT;
  `);

  await pool.query(`
    ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP;
  `);

  await pool.query(`
    ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS email_verification_last_sent_at TIMESTAMP;
  `);
};

const startServer = async () => {
  try {
    try {
      await ensureEmailVerificationColumns();
    } catch (migrationError) {
      // No tumbamos el servidor por una migración fallida en producción;
      // la app sigue levantando para exponer errores controlados y permitir diagnóstico.
      console.error(
        "Advertencia: no se pudo aplicar migración de verificación de correo:",
        migrationError
      );
    }

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
