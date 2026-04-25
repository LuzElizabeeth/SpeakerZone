import express from "express";
import crypto from "crypto";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const ACTIVE_REGISTRATION_STATUSES = ["confirmada", "pendiente"];

const mapRegistration = (row) => ({
  id: row.registration_id,
  attendeeId: row.attendee_id,
  conferenceId: row.conference_id,
  registeredAt: row.registered_at,
  status: row.registration_status,
  qrCode: row.qr_code,
  checkedIn: Boolean(row.checked_in),
  checkedInAt: row.checked_in_at || null,
  attendee: {
    id: row.attendee_id,
    name: row.attendee_name,
    email: row.attendee_email,
  },
  conference: {
    id: row.conference_id,
    title: row.conference_title,
    description: row.conference_description,
    date: row.conference_date,
    time: row.start_time?.slice(0, 5),
    endTime: row.end_time?.slice(0, 5) || null,
    location: row.conference_location,
    type: row.conference_type,
    status: row.conference_status,
    capacity: Number(row.capacity || 0),
    registeredCount: Number(row.registered_count || 0),
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
    event: {
      id: row.event_id,
      name: row.event_name,
    },
  },
});

const registrationSelect = `
  SELECT
    r.id AS registration_id,
    r.attendee_id,
    r.conference_id,
    r.registered_at,
    r.status AS registration_status,
    r.qr_code,

    u.nombre AS attendee_name,
    u.email AS attendee_email,

    c.title AS conference_title,
    c.description AS conference_description,
    c.conference_date,
    c.start_time,
    c.end_time,
    c.location AS conference_location,
    c.type AS conference_type,
    c.status AS conference_status,
    c.capacity,
    c.image_url,
    c.tags,

    e.id AS event_id,
    e.name AS event_name,

    s.id AS speaker_id,
    s.name AS speaker_name,
    s.role AS speaker_role,
    s.bio AS speaker_bio,
    s.avatar_url AS speaker_avatar_url,
    s.organization AS speaker_organization,

    COALESCE(a.checked_in, FALSE) AS checked_in,
    a.checked_in_at,

    (
      SELECT COUNT(*)
      FROM registrations active_r
      WHERE active_r.conference_id = c.id
        AND active_r.status <> 'cancelada'
    ) AS registered_count

  FROM registrations r
  INNER JOIN usuarios u ON u.id = r.attendee_id
  INNER JOIN conferences c ON c.id = r.conference_id
  INNER JOIN events e ON e.id = c.event_id
  LEFT JOIN speakers s ON s.id = c.speaker_id
  LEFT JOIN attendances a ON a.registration_id = r.id
`;

const selectRegistrationById = async (db, id) => {
  const result = await db.query(
    `${registrationSelect}
     WHERE r.id = $1;`,
    [id]
  );

  return result.rows[0] ? mapRegistration(result.rows[0]) : null;
};

const selectRegistrationByQrCode = async (db, qrCode) => {
  const result = await db.query(
    `${registrationSelect}
     WHERE r.qr_code = $1;`,
    [qrCode]
  );

  return result.rows[0] ? mapRegistration(result.rows[0]) : null;
};

const registrationRoutes = (pool) => {
  const router = express.Router();

  /**
   * POST /api/registrations
   * Crea una reservación para el asistente autenticado.
   */
  router.post(
    "/",
    authenticateToken,
    authorizeRoles("attendee"),
    async (req, res) => {
      const { conferenceId } = req.body;

      if (!conferenceId) {
        return res.status(400).json({
          error: "El ID de la conferencia es obligatorio",
        });
      }

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const conferenceResult = await client.query(
          `
          SELECT id, capacity, status
          FROM conferences
          WHERE id = $1
          FOR UPDATE;
          `,
          [conferenceId]
        );

        if (conferenceResult.rows.length === 0) {
          await client.query("ROLLBACK");

          return res.status(404).json({
            error: "Conferencia no encontrada",
          });
        }

        const conference = conferenceResult.rows[0];

        if (["cancelada", "finalizada"].includes(conference.status)) {
          await client.query("ROLLBACK");

          return res.status(409).json({
            error: "Esta conferencia ya no acepta reservaciones",
          });
        }

        const existingResult = await client.query(
          `
          SELECT id, status
          FROM registrations
          WHERE attendee_id = $1
            AND conference_id = $2;
          `,
          [req.user.id, conferenceId]
        );

        const existingRegistration = existingResult.rows[0];

        if (
          existingRegistration &&
          ACTIVE_REGISTRATION_STATUSES.includes(existingRegistration.status)
        ) {
          await client.query("COMMIT");

          const reservation = await selectRegistrationById(
            pool,
            existingRegistration.id
          );

          return res.status(200).json(reservation);
        }

        const countResult = await client.query(
          `
          SELECT COUNT(*)::int AS registered_count
          FROM registrations
          WHERE conference_id = $1
            AND status <> 'cancelada';
          `,
          [conferenceId]
        );

        const registeredCount = Number(countResult.rows[0]?.registered_count || 0);
        const capacity = Number(conference.capacity || 0);

        if (registeredCount >= capacity) {
          await client.query("ROLLBACK");

          return res.status(409).json({
            error: "La conferencia ya no tiene cupos disponibles",
          });
        }

        let registrationId;

        if (existingRegistration?.status === "cancelada") {
          const updateResult = await client.query(
            `
            UPDATE registrations
            SET
              status = 'confirmada',
              registered_at = NOW()
            WHERE id = $1
            RETURNING id;
            `,
            [existingRegistration.id]
          );

          registrationId = updateResult.rows[0].id;
        } else {
          const qrCode = `SZ-${crypto.randomUUID()}`;

          const insertResult = await client.query(
            `
            INSERT INTO registrations (
              attendee_id,
              conference_id,
              status,
              qr_code
            )
            VALUES ($1, $2, 'confirmada', $3)
            RETURNING id;
            `,
            [req.user.id, conferenceId, qrCode]
          );

          registrationId = insertResult.rows[0].id;
        }

        await client.query("COMMIT");

        const reservation = await selectRegistrationById(pool, registrationId);

        return res.status(existingRegistration ? 200 : 201).json(reservation);
      } catch (error) {
        await client.query("ROLLBACK");

        if (error.code === "23505") {
          return res.status(409).json({
            error: "Ya existe una reservación para esta conferencia",
          });
        }

        console.error("Error al crear reservación:", error);

        return res.status(500).json({
          error: "Error al crear reservación",
        });
      } finally {
        client.release();
      }
    }
  );

  /**
   * GET /api/registrations/me
   * Obtiene las reservaciones activas del asistente autenticado.
   */
  router.get(
    "/me",
    authenticateToken,
    authorizeRoles("attendee"),
    async (req, res) => {
      try {
        const result = await pool.query(
          `${registrationSelect}
           WHERE r.attendee_id = $1
             AND r.status <> 'cancelada'
           ORDER BY c.conference_date ASC, c.start_time ASC;`,
          [req.user.id]
        );

        res.json(result.rows.map(mapRegistration));
      } catch (error) {
        console.error("Error al obtener mis reservaciones:", error);

        res.status(500).json({
          error: "Error al obtener mis reservaciones",
        });
      }
    }
  );

  /**
   * DELETE /api/registrations/:id
   * Cancela una reservación.
   * No borra físicamente el registro; lo marca como cancelado.
   */
  router.delete("/:id", authenticateToken, async (req, res) => {
    try {
      const result = await pool.query(
        `
        UPDATE registrations
        SET status = 'cancelada'
        WHERE id = $1
          AND (
            attendee_id = $2
            OR $3 = 'admin'
          )
        RETURNING id;
        `,
        [req.params.id, req.user.id, req.user.role]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Reservación no encontrada o sin permisos para cancelarla",
        });
      }

      res.json({ ok: true });
    } catch (error) {
      console.error("Error al cancelar reservación:", error);

      res.status(500).json({
        error: "Error al cancelar reservación",
      });
    }
  });

  /**
   * GET /api/registrations
   * Obtiene todos los registros.
   * Uso principal: administrador.
   */
  router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    async (_req, res) => {
      try {
        const result = await pool.query(
          `${registrationSelect}
           ORDER BY r.registered_at DESC;`
        );

        res.json(result.rows.map(mapRegistration));
      } catch (error) {
        console.error("Error al obtener reservaciones:", error);

        res.status(500).json({
          error: "Error al obtener reservaciones",
        });
      }
    }
  );

  /**
   * GET /api/registrations/conference/:conferenceId
   * Obtiene registros por conferencia.
   * Útil para AdminAttendees y páginas de conferencista.
   */
  router.get(
    "/conference/:conferenceId",
    authenticateToken,
    authorizeRoles("admin", "speaker"),
    async (req, res) => {
      try {
        const result = await pool.query(
          `${registrationSelect}
           WHERE r.conference_id = $1
           ORDER BY r.registered_at DESC;`,
          [req.params.conferenceId]
        );

        res.json(result.rows.map(mapRegistration));
      } catch (error) {
        console.error("Error al obtener reservaciones por conferencia:", error);

        res.status(500).json({
          error: "Error al obtener reservaciones por conferencia",
        });
      }
    }
  );

  /**
   * POST /api/registrations/check-in
   * Valida un QR y registra check-in.
   */
  router.post(
    "/check-in",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
      const { qrCode } = req.body;

      if (!qrCode) {
        return res.status(400).json({
          error: "El código QR es obligatorio",
        });
      }

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const registrationResult = await client.query(
          `
          SELECT id, status
          FROM registrations
          WHERE qr_code = $1
          FOR UPDATE;
          `,
          [qrCode]
        );

        if (registrationResult.rows.length === 0) {
          await client.query("ROLLBACK");

          return res.status(404).json({
            error: "Código QR no encontrado",
          });
        }

        const registration = registrationResult.rows[0];

        if (registration.status === "cancelada") {
          await client.query("ROLLBACK");

          return res.status(409).json({
            error: "Esta reservación fue cancelada",
          });
        }

        const previousAttendanceResult = await client.query(
          `
          SELECT checked_in
          FROM attendances
          WHERE registration_id = $1;
          `,
          [registration.id]
        );

        const alreadyCheckedIn = Boolean(
          previousAttendanceResult.rows[0]?.checked_in
        );

        const attendanceResult = await client.query(
          `
          INSERT INTO attendances (
            registration_id,
            checked_in,
            checked_in_at,
            checked_by
          )
          VALUES ($1, TRUE, NOW(), $2)
          ON CONFLICT (registration_id)
          DO UPDATE SET
            checked_in = TRUE,
            checked_in_at = COALESCE(attendances.checked_in_at, NOW()),
            checked_by = EXCLUDED.checked_by
          RETURNING checked_in_at;
          `,
          [registration.id, req.user.id]
        );

        await client.query("COMMIT");

        const checkedInAt = attendanceResult.rows[0]?.checked_in_at || null;
        const reservation = await selectRegistrationByQrCode(pool, qrCode);

        res.json({
          ok: true,
          alreadyCheckedIn,
          message: alreadyCheckedIn
            ? "Este QR ya tenía check-in registrado"
            : "Check-in registrado correctamente",
          checkedInAt,
          registration: reservation,
        });
      } catch (error) {
        await client.query("ROLLBACK");

        console.error("Error al registrar check-in:", error);

        res.status(500).json({
          error: "Error al registrar check-in",
        });
      } finally {
        client.release();
      }
    }
  );

  return router;
};

export default registrationRoutes;