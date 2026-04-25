import express from "express";

const programRoutes = (pool) => {
  const router = express.Router();

  /**
   * GET /api/programs
   * Lista de programas principales
   */
  router.get("/", async (_req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          p.*,
          COUNT(DISTINCT a.id) AS total_activities,
          COUNT(DISTINCT r.id) AS total_attendees
        FROM programs p
        LEFT JOIN activities a
          ON a.program_id = p.id
        LEFT JOIN registrations r
          ON r.activity_id = a.id
          AND r.status <> 'cancelada'
        GROUP BY p.id
        ORDER BY p.start_date ASC;
      `);

      const programs = result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        startDate: row.start_date,
        endDate: row.end_date,
        location: row.location,
        imageUrl: row.image_url,
        status: row.status,
        registrationOpen: row.registration_open,
        featured: row.featured,
        totalAttendees: Number(row.total_attendees || 0),
        totalActivities: Number(row.total_activities || 0),
      }));

      res.json(programs);
    } catch (error) {
      console.error("Error al obtener programas:", error);

      res.status(500).json({
        error: "Error al obtener programas",
      });
    }
  });

  /**
   * GET /api/programs/:id
   * Detalle de programa
   */

  router.get("/:id/activities", async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          a.*,
          s.name AS speaker_name,
          s.organization AS speaker_organization
        FROM activities a
        LEFT JOIN speakers s
          ON s.id = a.speaker_id
        WHERE a.program_id = $1
        ORDER BY a.activity_date ASC, a.start_time ASC;
        `,
        [req.params.id]
      );

    const activities = result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,

    date: row.activity_date,
    time: row.start_time?.slice(0, 5),
    endTime: row.end_time?.slice(0, 5) || null,

    location: row.location,

    activityType: row.activity_type,
    modality: row.modality,
    status: row.status,

    capacity: row.capacity,

    requiresRegistration: row.requires_registration,
    registrationType: row.registration_type,
    externalRegistrationUrl: row.external_registration_url,

    certificateAvailable: row.certificate_available,

    imageUrl: row.image_url,
    tags: row.tags || [],

    speaker: {
        id: row.speaker_id,
        name: row.speaker_name || 'Por confirmar',
        organization: row.speaker_organization || '',
    },
    }));

    res.json(activities);


    } catch (error) {
      console.error("Error al obtener actividades del programa:", error);

      res.status(500).json({
        error: "Error al obtener actividades del programa",
      });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          p.*,
          COUNT(DISTINCT a.id) AS total_activities,
          COUNT(DISTINCT r.id) AS total_attendees
        FROM programs p
        LEFT JOIN activities a
          ON a.program_id = p.id
        LEFT JOIN registrations r
          ON r.activity_id = a.id
          AND r.status <> 'cancelada'
        WHERE p.id = $1
        GROUP BY p.id;
        `,
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Programa no encontrado",
        });
      }

      const row = result.rows[0];

      res.json({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        startDate: row.start_date,
        endDate: row.end_date,
        location: row.location,
        imageUrl: row.image_url,
        status: row.status,
        registrationOpen: row.registration_open,
        featured: row.featured,
        totalAttendees: Number(row.total_attendees || 0),
        totalActivities: Number(row.total_activities || 0),
      });
    } catch (error) {
      console.error("Error al obtener programa:", error);

      res.status(500).json({
        error: "Error al obtener programa",
      });
    }
  });

  return router;
};

export default programRoutes;

