import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const mapActivity = (row) => ({
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
  registeredCount: Number(row.registered_count || 0),

  requiresRegistration: row.requires_registration,
  registrationType: row.registration_type,
  externalRegistrationUrl: row.external_registration_url,

  certificateAvailable: row.certificate_available,
  requirements: row.requirements || [],

  imageUrl: row.image_url,
  tags: row.tags || [],

  speaker: {
    id: row.speaker_id,
    name: row.speaker_name || "Por confirmar",
    role: row.speaker_role || "Conferencista",
    bio: row.speaker_bio || "",
    avatarUrl: row.speaker_avatar_url || "",
    organization: row.speaker_organization || "",
  },

  program: {
    id: row.program_id,
    name: row.program_name,
  },
});

const selectActivityById = async (pool, id) => {
  const result = await pool.query(
    `
    SELECT
      a.*,
      p.name AS program_name,

      s.id AS speaker_id,
      s.name AS speaker_name,
      s.role AS speaker_role,
      s.bio AS speaker_bio,
      s.avatar_url AS speaker_avatar_url,
      s.organization AS speaker_organization,

      COUNT(r.id) AS registered_count

    FROM activities a

    INNER JOIN programs p
      ON p.id = a.program_id

    LEFT JOIN speakers s
      ON s.id = a.speaker_id

    LEFT JOIN registrations r
      ON r.activity_id = a.id
      AND r.status <> 'cancelada'

    WHERE a.id = $1

    GROUP BY
      a.id,
      p.name,
      s.id;
    `,
    [id]
  );

  return result.rows[0] ? mapActivity(result.rows[0]) : null;
};

const activityRoutes = (pool) => {
  const router = express.Router();

  /**
   * GET /api/activities
   * Lista de actividades con filtros
   */
  router.get("/", async (req, res) => {
    try {
      const { search, activityType, status } = req.query;

      const values = [];
      const where = [];

      if (search) {
        values.push(`%${search}%`);
        where.push(`
          (
            a.title ILIKE $${values.length}
            OR a.description ILIKE $${values.length}
            OR s.name ILIKE $${values.length}
          )
        `);
      }

      if (activityType && activityType !== "todas") {
        values.push(activityType);
        where.push(`a.activity_type = $${values.length}`);
      }

      if (status) {
        values.push(status);
        where.push(`a.status = $${values.length}`);
      }

      const query = `
        SELECT
          a.*,
          p.name AS program_name,

          s.id AS speaker_id,
          s.name AS speaker_name,
          s.role AS speaker_role,
          s.bio AS speaker_bio,
          s.avatar_url AS speaker_avatar_url,
          s.organization AS speaker_organization,

          COUNT(r.id) AS registered_count

        FROM activities a

        INNER JOIN programs p
          ON p.id = a.program_id

        LEFT JOIN speakers s
          ON s.id = a.speaker_id

        LEFT JOIN registrations r
          ON r.activity_id = a.id
          AND r.status <> 'cancelada'

        ${where.length ? `WHERE ${where.join(" AND ")}` : ""}

        GROUP BY
          a.id,
          p.name,
          s.id

        ORDER BY
          a.activity_date ASC,
          a.start_time ASC;
      `;

      const result = await pool.query(query, values);

      res.json(result.rows.map(mapActivity));
    } catch (error) {
      console.error("Error al obtener actividades:", error);

      res.status(500).json({
        error: "Error al obtener actividades",
      });
    }
  });

  /**
   * GET /api/activities/:id
   * Detalle individual
   */
  router.get("/:id", async (req, res) => {
    try {
      const activity = await selectActivityById(pool, req.params.id);

      if (!activity) {
        return res.status(404).json({
          error: "Actividad no encontrada",
        });
      }

      res.json(activity);
    } catch (error) {
      console.error("Error al obtener actividad:", error);

      res.status(500).json({
        error: "Error al obtener actividad",
      });
    }
  });

  /**
   * POST /api/activities
   * Crear actividad
   */
  router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
      try {
        const {
          programId,
          speakerId,
          title,
          description,
          date,
          time,
          endTime,
          location,
          activityType,
          modality,
          capacity,
          imageUrl,
          tags,
          requiresRegistration,
          registrationType,
          externalRegistrationUrl,
          certificateAvailable,
          requirements,
        } = req.body;

        if (!programId || !title || !date || !time || !location) {
          return res.status(400).json({
            error: "Faltan datos obligatorios",
          });
        }

        const result = await pool.query(
          `
          INSERT INTO activities (
            program_id,
            speaker_id,
            title,
            description,
            activity_date,
            start_time,
            end_time,
            location,
            activity_type,
            modality,
            capacity,
            image_url,
            tags,
            requires_registration,
            registration_type,
            external_registration_url,
            certificate_available,
            requirements
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17,$18
          )
          RETURNING id;
          `,
          [
            programId,
            speakerId || null,
            title,
            description || "",
            date,
            time,
            endTime || null,
            location,
            activityType || "conferencia",
            modality || "presencial",
            Number(capacity || 100),
            imageUrl ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
            tags || [],
            requiresRegistration ?? true,
            registrationType || "internal_form",
            externalRegistrationUrl || "",
            certificateAvailable ?? false,
            requirements || [],
          ]
        );

        const activity = await selectActivityById(pool, result.rows[0].id);

        res.status(201).json(activity);
      } catch (error) {
        console.error("Error al crear actividad:", error);

        res.status(500).json({
          error: "Error al crear actividad",
        });
      }
    }
  );

  /**
   * PUT /api/activities/:id
   * Actualizar actividad
   */
  router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
      try {
        const {
          speakerId,
          title,
          description,
          date,
          time,
          endTime,
          location,
          activityType,
          modality,
          capacity,
          imageUrl,
          tags,
          status,
          requiresRegistration,
          registrationType,
          externalRegistrationUrl,
          certificateAvailable,
          requirements,
        } = req.body;

        const result = await pool.query(
          `
          UPDATE activities
          SET
            speaker_id = COALESCE($1, speaker_id),
            title = COALESCE($2, title),
            description = COALESCE($3, description),
            activity_date = COALESCE($4, activity_date),
            start_time = COALESCE($5, start_time),
            end_time = COALESCE($6, end_time),
            location = COALESCE($7, location),
            activity_type = COALESCE($8, activity_type),
            modality = COALESCE($9, modality),
            capacity = COALESCE($10, capacity),
            image_url = COALESCE($11, image_url),
            tags = COALESCE($12, tags),
            status = COALESCE($13, status),
            requires_registration = COALESCE($14, requires_registration),
            registration_type = COALESCE($15, registration_type),
            external_registration_url = COALESCE($16, external_registration_url),
            certificate_available = COALESCE($17, certificate_available),
            requirements = COALESCE($18, requirements),
            updated_at = NOW()
          WHERE id = $19
          RETURNING id;
          `,
          [
            speakerId || null,
            title || null,
            description ?? null,
            date || null,
            time || null,
            endTime || null,
            location || null,
            activityType || null,
            modality || null,
            capacity ? Number(capacity) : null,
            imageUrl || null,
            tags || null,
            status || null,
            requiresRegistration ?? null,
            registrationType || null,
            externalRegistrationUrl || null,
            certificateAvailable ?? null,
            requirements || null,
            req.params.id,
          ]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            error: "Actividad no encontrada",
          });
        }

        const activity = await selectActivityById(pool, req.params.id);

        res.json(activity);
      } catch (error) {
        console.error("Error al actualizar actividad:", error);

        res.status(500).json({
          error: "Error al actualizar actividad",
        });
      }
    }
  );

  /**
   * DELETE /api/activities/:id
   * Eliminar actividad
   */
  router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
      try {
        const result = await pool.query(
          `
          DELETE FROM activities
          WHERE id = $1
          RETURNING id;
          `,
          [req.params.id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            error: "Actividad no encontrada",
          });
        }

        res.json({
          ok: true,
        });
      } catch (error) {
        console.error("Error al eliminar actividad:", error);

        res.status(500).json({
          error: "Error al eliminar actividad",
        });
      }
    }
  );

  return router;
};

export default activityRoutes;
