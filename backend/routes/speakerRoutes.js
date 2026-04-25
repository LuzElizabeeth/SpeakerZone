import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const mapSpeaker = (row) => ({
  id: row.id,
  name: row.name,
  role: row.role,
  bio: row.bio,
  avatarUrl: row.avatar_url,
  organization: row.organization,
  totalConferences: Number(row.total_conferences || 0),
});

const speakerRoutes = (pool) => {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          s.*,
          COUNT(c.id) AS total_conferences
        FROM speakers s
        LEFT JOIN conferences c ON c.speaker_id = s.id
        GROUP BY s.id
        ORDER BY s.name ASC;
      `);

      res.json(result.rows.map(mapSpeaker));
    } catch (error) {
      console.error("Error al obtener conferencistas:", error);

      res.status(500).json({
        error: "Error al obtener conferencistas",
      });
    }
  });

  router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
      const { name, role, bio, organization, avatarUrl } = req.body;

      if (!name || !role || !organization) {
        return res.status(400).json({
          error: "Nombre, cargo y organización son obligatorios",
        });
      }

      try {
        const result = await pool.query(
          `
          INSERT INTO speakers (
            name,
            role,
            bio,
            organization,
            avatar_url
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *, 0 AS total_conferences;
          `,
          [name, role, bio || "", organization, avatarUrl || ""]
        );

        res.status(201).json(mapSpeaker(result.rows[0]));
      } catch (error) {
        console.error("Error al crear conferencista:", error);

        res.status(500).json({
          error: "Error al crear conferencista",
        });
      }
    }
  );

  router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
      const { name, role, bio, organization, avatarUrl } = req.body;

      if (!name || !role || !organization) {
        return res.status(400).json({
          error: "Nombre, cargo y organización son obligatorios",
        });
      }

      try {
        const result = await pool.query(
          `
          UPDATE speakers
          SET
            name = $1,
            role = $2,
            bio = $3,
            organization = $4,
            avatar_url = $5,
            updated_at = NOW()
          WHERE id = $6
          RETURNING *,
            (
              SELECT COUNT(*)
              FROM conferences c
              WHERE c.speaker_id = speakers.id
            ) AS total_conferences;
          `,
          [name, role, bio || "", organization, avatarUrl || "", req.params.id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            error: "Conferencista no encontrado",
          });
        }

        res.json(mapSpeaker(result.rows[0]));
      } catch (error) {
        console.error("Error al actualizar conferencista:", error);

        res.status(500).json({
          error: "Error al actualizar conferencista",
        });
      }
    }
  );

  router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
      try {
        const result = await pool.query(
          "DELETE FROM speakers WHERE id = $1 RETURNING id",
          [req.params.id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            error: "Conferencista no encontrado",
          });
        }

        res.json({ ok: true });
      } catch (error) {
        console.error("Error al eliminar conferencista:", error);

        res.status(500).json({
          error: "Error al eliminar conferencista",
        });
      }
    }
  );

  return router;
};

export default speakerRoutes;