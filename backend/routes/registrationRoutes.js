import express from "express";
import crypto from "crypto";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const mapRegistration = (row) => ({
  id: row.id,
  attendeeId: row.attendee_id,
  activityId: row.activity_id,
  registeredAt: row.registered_at,
  status: row.status,
  qrCode: row.qr_code,
  checkedIn: Boolean(row.checked_in),
  checkedInAt: row.checked_in_at || null,

  attendee: row.attendee_name
    ? {
        id: row.attendee_id,
        name: row.attendee_name,
        email: row.attendee_email,
      }
    : undefined,

  activity: {
    id: row.activity_id,
    title: row.activity_title,
    description: row.activity_description || "",
    date: row.activity_date,
    time: row.start_time?.slice(0, 5),
    endTime: row.end_time?.slice(0, 5) || null,
    location: row.location,
    activityType: row.activity_type,
    modality: row.modality,
    status: row.activity_status || "próxima",
    capacity: Number(row.capacity || 0),
    registeredCount: Number(row.registered_count || 0),
    requiresRegistration: row.requires_registration ?? true,
    registrationType: row.registration_type || "internal_form",
    externalRegistrationUrl: row.external_registration_url || "",
    certificateAvailable: row.certificate_available || false,
    requirements: row.requirements || [],
    imageUrl: row.image_url || "",
    tags: row.tags || [],
    speaker: {
      id: row.speaker_id || "",
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
  },

  program: {
    id: row.program_id,
    name: row.program_name,
  },
});

const selectRegistrationById = async (pool, id) => {
  const result = await pool.query(
    `
    SELECT
      r.*,

      COALESCE(att.checked_in, false) AS checked_in,
      att.checked_in_at,

      u.nombre AS attendee_name,
      u.email AS attendee_email,

      a.id AS activity_id,
      a.title AS activity_title,
      a.description AS activity_description,
      a.activity_date,
      a.start_time,
      a.end_time,
      a.location,
      a.activity_type,
      a.modality,
      a.status AS activity_status,
      a.capacity,
      a.requires_registration,
      a.registration_type,
      a.external_registration_url,
      a.certificate_available,
      a.requirements,
      a.image_url,
      a.tags,

      p.id AS program_id,
      p.name AS program_name,

      s.id AS speaker_id,
      s.name AS speaker_name,
      s.role AS speaker_role,
      s.bio AS speaker_bio,
      s.avatar_url AS speaker_avatar_url,
      s.organization AS speaker_organization,

      reg_count.registered_count

    FROM registrations r

    INNER JOIN usuarios u
      ON u.id = r.attendee_id

    INNER JOIN activities a
      ON a.id = r.activity_id

    INNER JOIN programs p
      ON p.id = a.program_id

    LEFT JOIN speakers s
      ON s.id = a.speaker_id

    LEFT JOIN attendances att
      ON att.registration_id = r.id

    LEFT JOIN LATERAL (
      SELECT COUNT(*) AS registered_count
      FROM registrations active_r
      WHERE active_r.activity_id = a.id
        AND active_r.status <> 'cancelada'
    ) reg_count ON true

    WHERE r.id = $1;
    `,
    [id]
  );

  return result.rows[0] ? mapRegistration(result.rows[0]) : null;
};

const registrationRoutes = (pool) => {
  const router = express.Router();

  router.post(
    "/",
    authenticateToken,
    authorizeRoles("attendee"),
    async (req, res) => {
      try {
        const attendeeId = req.user.id;
        const { activityId, conferenceId } = req.body;
        const finalActivityId = activityId || conferenceId;

        if (!finalActivityId) {
          return res.status(400).json({
            error: "activityId es obligatorio",
          });
        }

        const activityResult = await pool.query(
          `
          SELECT
            a.id,
            a.title,
            a.capacity,
            a.requires_registration,
            a.registration_type,
            a.external_registration_url,
            COUNT(r.id) AS registered_count
          FROM activities a
          LEFT JOIN registrations r
            ON r.activity_id = a.id
            AND r.status <> 'cancelada'
          WHERE a.id = $1
          GROUP BY a.id;
          `,
          [finalActivityId]
        );

        if (activityResult.rows.length === 0) {
          return res.status(404).json({
            error: "Actividad no encontrada",
          });
        }

        const activity = activityResult.rows[0];

        // Si no requiere registro, igual permitimos
        // confirmar asistencia para historial, QR y certificados

        if (activity.registration_type === "external_link") {
          return res.status(400).json({
            error:
              "Esta actividad usa un formulario externo. Regístrate desde el enlace indicado.",
          });
        }

        if (Number(activity.registered_count) >= Number(activity.capacity)) {
          return res.status(400).json({
            error: "No hay cupos disponibles",
          });
        }

        const existingRegistration = await pool.query(
          `
          SELECT id
          FROM registrations
          WHERE attendee_id = $1
            AND activity_id = $2
            AND status <> 'cancelada';
          `,
          [attendeeId, finalActivityId]
        );

        if (existingRegistration.rows.length > 0) {
          return res.status(400).json({
            error: "Ya estás registrado en esta actividad",
          });
        }

        const qrCode = crypto.randomUUID();

        const result = await pool.query(
          `
          INSERT INTO registrations (
            attendee_id,
            activity_id,
            status,
            qr_code
          )
          VALUES ($1, $2, 'confirmada', $3)
          RETURNING id;
          `,
          [attendeeId, finalActivityId, qrCode]
        );

        const registration = await selectRegistrationById(pool, result.rows[0].id);

        res.status(201).json(registration);
      } catch (error) {
        console.error("Error al registrar actividad:", error);

        res.status(500).json({
          error: "Error al registrar actividad",
        });
      }
    }
  );

  router.get(
    "/me",
    authenticateToken,
    authorizeRoles("attendee"),
    async (req, res) => {
      try {
        const attendeeId = req.user.id;

        const result = await pool.query(
          `
          SELECT
            r.*,

            COALESCE(att.checked_in, false) AS checked_in,
            att.checked_in_at,

            u.nombre AS attendee_name,
            u.email AS attendee_email,

            a.id AS activity_id,
            a.title AS activity_title,
            a.description AS activity_description,
            a.activity_date,
            a.start_time,
            a.end_time,
            a.location,
            a.activity_type,
            a.modality,
            a.status AS activity_status,
            a.capacity,
            a.requires_registration,
            a.registration_type,
            a.external_registration_url,
            a.certificate_available,
            a.requirements,
            a.image_url,
            a.tags,

            p.id AS program_id,
            p.name AS program_name,

            s.id AS speaker_id,
            s.name AS speaker_name,
            s.role AS speaker_role,
            s.bio AS speaker_bio,
            s.avatar_url AS speaker_avatar_url,
            s.organization AS speaker_organization,

            reg_count.registered_count

          FROM registrations r

          INNER JOIN usuarios u
            ON u.id = r.attendee_id

          INNER JOIN activities a
            ON a.id = r.activity_id

          INNER JOIN programs p
            ON p.id = a.program_id

          LEFT JOIN speakers s
            ON s.id = a.speaker_id

          LEFT JOIN attendances att
            ON att.registration_id = r.id

          LEFT JOIN LATERAL (
            SELECT COUNT(*) AS registered_count
            FROM registrations active_r
            WHERE active_r.activity_id = a.id
              AND active_r.status <> 'cancelada'
          ) reg_count ON true

          WHERE r.attendee_id = $1
          ORDER BY a.activity_date ASC, a.start_time ASC;
          `,
          [attendeeId]
        );

        res.json(result.rows.map(mapRegistration));
      } catch (error) {
        console.error("Error al obtener registros:", error);

        res.status(500).json({
          error: "Error al obtener registros",
        });
      }
    }
  );

  router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("attendee"),
    async (req, res) => {
      try {
        const attendeeId = req.user.id;
        const registrationId = req.params.id;

        const result = await pool.query(
          `
          UPDATE registrations
          SET status = 'cancelada'
          WHERE id = $1
            AND attendee_id = $2
          RETURNING id;
          `,
          [registrationId, attendeeId]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            error: "Registro no encontrado",
          });
        }

        res.json({
          ok: true,
        });
      } catch (error) {
        console.error("Error al cancelar registro:", error);

        res.status(500).json({
          error: "Error al cancelar registro",
        });
      }
    }
  );

  router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    async (_req, res) => {
      try {
        const result = await pool.query(
          `
          SELECT
            r.*,

            COALESCE(att.checked_in, false) AS checked_in,
            att.checked_in_at,

            u.nombre AS attendee_name,
            u.email AS attendee_email,

            a.id AS activity_id,
            a.title AS activity_title,
            a.description AS activity_description,
            a.activity_date,
            a.start_time,
            a.end_time,
            a.location,
            a.activity_type,
            a.modality,
            a.status AS activity_status,
            a.capacity,
            a.requires_registration,
            a.registration_type,
            a.external_registration_url,
            a.certificate_available,
            a.requirements,
            a.image_url,
            a.tags,

            p.id AS program_id,
            p.name AS program_name,

            s.id AS speaker_id,
            s.name AS speaker_name,
            s.role AS speaker_role,
            s.bio AS speaker_bio,
            s.avatar_url AS speaker_avatar_url,
            s.organization AS speaker_organization,

            reg_count.registered_count

          FROM registrations r

          INNER JOIN usuarios u
            ON u.id = r.attendee_id

          INNER JOIN activities a
            ON a.id = r.activity_id

          INNER JOIN programs p
            ON p.id = a.program_id

          LEFT JOIN speakers s
            ON s.id = a.speaker_id

          LEFT JOIN attendances att
            ON att.registration_id = r.id

          LEFT JOIN LATERAL (
            SELECT COUNT(*) AS registered_count
            FROM registrations active_r
            WHERE active_r.activity_id = a.id
              AND active_r.status <> 'cancelada'
          ) reg_count ON true

          ORDER BY r.registered_at DESC;
          `
        );

        res.json(result.rows.map(mapRegistration));
      } catch (error) {
        console.error("Error al obtener registros admin:", error);

        res.status(500).json({
          error: "Error al obtener registros",
        });
      }
    }
  );

  router.get(
    "/conference/:conferenceId",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
      try {
        const activityId = req.params.conferenceId;

        const result = await pool.query(
          `
          SELECT
            r.*,

            COALESCE(att.checked_in, false) AS checked_in,
            att.checked_in_at,

            u.nombre AS attendee_name,
            u.email AS attendee_email,

            a.id AS activity_id,
            a.title AS activity_title,
            a.description AS activity_description,
            a.activity_date,
            a.start_time,
            a.end_time,
            a.location,
            a.activity_type,
            a.modality,
            a.status AS activity_status,
            a.capacity,
            a.requires_registration,
            a.registration_type,
            a.external_registration_url,
            a.certificate_available,
            a.requirements,
            a.image_url,
            a.tags,

            p.id AS program_id,
            p.name AS program_name,

            s.id AS speaker_id,
            s.name AS speaker_name,
            s.role AS speaker_role,
            s.bio AS speaker_bio,
            s.avatar_url AS speaker_avatar_url,
            s.organization AS speaker_organization,

            reg_count.registered_count

          FROM registrations r

          INNER JOIN usuarios u
            ON u.id = r.attendee_id

          INNER JOIN activities a
            ON a.id = r.activity_id

          INNER JOIN programs p
            ON p.id = a.program_id

          LEFT JOIN speakers s
            ON s.id = a.speaker_id

          LEFT JOIN attendances att
            ON att.registration_id = r.id

          LEFT JOIN LATERAL (
            SELECT COUNT(*) AS registered_count
            FROM registrations active_r
            WHERE active_r.activity_id = a.id
              AND active_r.status <> 'cancelada'
          ) reg_count ON true

          WHERE r.activity_id = $1
          ORDER BY r.registered_at DESC;
          `,
          [activityId]
        );

        res.json(result.rows.map(mapRegistration));
      } catch (error) {
        console.error("Error al obtener registros por actividad:", error);

        res.status(500).json({
          error: "Error al obtener registros por actividad",
        });
      }
    }
  );

  router.post(
    "/check-in",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
      try {
        const { qrCode } = req.body;

        if (!qrCode) {
          return res.status(400).json({
            error: "qrCode es obligatorio",
          });
        }

        const registrationResult = await pool.query(
          `
          SELECT id
          FROM registrations
          WHERE qr_code = $1
            AND status = 'confirmada';
          `,
          [qrCode]
        );

        if (registrationResult.rows.length === 0) {
          return res.status(404).json({
            error: "QR inválido o registro no confirmado",
          });
        }

        const registrationId = registrationResult.rows[0].id;

        const existingAttendance = await pool.query(
          `
          SELECT checked_in, checked_in_at
          FROM attendances
          WHERE registration_id = $1
            AND checked_in = true;
          `,
          [registrationId]
        );

        if (existingAttendance.rows.length > 0) {
          const registration = await selectRegistrationById(pool, registrationId);

          return res.json({
            ok: true,
            alreadyCheckedIn: true,
            message: "Este QR ya tenía check-in registrado.",
            checkedInAt: existingAttendance.rows[0].checked_in_at,
            registration,
          });
        }

        const attendanceResult = await pool.query(
          `
          INSERT INTO attendances (
            registration_id,
            checked_in,
            checked_in_at,
            checked_by
          )
          VALUES ($1, true, NOW(), $2)
          ON CONFLICT (registration_id)
          DO UPDATE SET
            checked_in = true,
            checked_in_at = NOW(),
            checked_by = $2
          RETURNING checked_in_at;
          `,
          [registrationId, req.user.id]
        );

        const registration = await selectRegistrationById(pool, registrationId);

        res.json({
          ok: true,
          alreadyCheckedIn: false,
          message: "Check-in registrado correctamente.",
          checkedInAt: attendanceResult.rows[0].checked_in_at,
          registration,
        });
      } catch (error) {
        console.error("Error en check-in:", error);

        res.status(500).json({
          error: "Error en check-in",
        });
      }
    }
  );

  return router;
};

export default registrationRoutes;