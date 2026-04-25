import express from "express";

const eventRoutes = (pool) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          e.*,
          COUNT(DISTINCT c.id) AS total_conferences,
          COUNT(DISTINCT r.id) AS total_attendees
        FROM events e
        LEFT JOIN conferences c ON c.event_id = e.id
        LEFT JOIN registrations r ON r.conference_id = c.id AND r.status <> 'cancelada'
        GROUP BY e.id
        ORDER BY e.start_date ASC;
        `
      );

      const events = result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        startDate: row.start_date,
        endDate: row.end_date,
        location: row.location,
        imageUrl: row.image_url,
        status: row.status,
        totalAttendees: Number(row.total_attendees || 0),
        totalConferences: Number(row.total_conferences || 0),
      }));

      res.json(events);
    } catch (error) {
      console.error("Error al obtener eventos:", error);

      res.status(500).json({
        error: "Error al obtener eventos",
      });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          e.*,
          COUNT(DISTINCT c.id) AS total_conferences,
          COUNT(DISTINCT r.id) AS total_attendees
        FROM events e
        LEFT JOIN conferences c ON c.event_id = e.id
        LEFT JOIN registrations r ON r.conference_id = c.id AND r.status <> 'cancelada'
        WHERE e.id = $1
        GROUP BY e.id;
        `,
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Evento no encontrado",
        });
      }

      const row = result.rows[0];

      res.json({
        id: row.id,
        name: row.name,
        description: row.description,
        startDate: row.start_date,
        endDate: row.end_date,
        location: row.location,
        imageUrl: row.image_url,
        status: row.status,
        totalAttendees: Number(row.total_attendees || 0),
        totalConferences: Number(row.total_conferences || 0),
      });
    } catch (error) {
      console.error("Error al obtener evento:", error);

      res.status(500).json({
        error: "Error al obtener evento",
      });
    }
  });

  return router;
};

export default eventRoutes;