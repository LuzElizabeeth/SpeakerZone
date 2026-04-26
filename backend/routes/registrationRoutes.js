import express from "express";
import crypto from "crypto";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const registrationRoutes = (pool) => {
  const router = express.Router();

  /**
   * POST /api/registrations
   * Registrar asistente a una actividad
   */
  router.post(
    "/",
    authenticateToken,
    authorizeRoles("attendee"),
    async (req, res) => {
      try {
        const attendeeId = req.user.id;
        const { activityId } = req.body;

        if (!activityId) {
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
          [activityId]
        );

        if (activityResult.rows.length === 0) {
          return res.status(404).json({
            error: "Actividad no encontrada",
          });
        }

        const activity = activityResult.rows[0];

        // Si no requiere registro, igual permitimos
        // confirmar asistencia para historial, QR y certificados

        if (
          Number(activity.registered_count) >=
          Number(activity.capacity)
        ) {
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
          [attendeeId, activityId]
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
          RETURNING *;
          `,
          [attendeeId, activityId, qrCode]
        );

        res.status(201).json({
          id: result.rows[0].id,
          attendeeId: result.rows[0].attendee_id,
          activityId: result.rows[0].activity_id,
          registeredAt: result.rows[0].registered_at,
          status: result.rows[0].status,
          qrCode: result.rows[0].qr_code,
          activityTitle: activity.title,
        });
      } catch (error) {
        console.error(
          "Error al registrar actividad:",
          error
        );

        res.status(500).json({
          error: "Error al registrar actividad",
        });
      }
    }
  );

  /**
   * GET /api/registrations/me
   * Mis registros como attendee
   */
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

            a.id AS activity_id,
            a.title AS activity_title,
            a.activity_date,
            a.start_time,
            a.end_time,
            a.location,
            a.activity_type,
            a.certificate_available,

            p.id AS program_id,
            p.name AS program_name

          FROM registrations r

          INNER JOIN activities a
            ON a.id = r.activity_id

          INNER JOIN programs p
            ON p.id = a.program_id

          WHERE r.attendee_id = $1
          ORDER BY a.activity_date ASC, a.start_time ASC;
          `,
          [attendeeId]
        );

        const reservations = result.rows.map((row) => ({
          id: row.id,
          status: row.status,
          registeredAt: row.registered_at,
          qrCode: row.qr_code,

          activity: {
            id: row.activity_id,
            title: row.activity_title,
            date: row.activity_date,
            time: row.start_time?.slice(0, 5),
            endTime:
              row.end_time?.slice(0, 5) || null,
            location: row.location,
            activityType: row.activity_type,
            certificateAvailable:
              row.certificate_available,
          },

          program: {
            id: row.program_id,
            name: row.program_name,
          },
        }));

        res.json(reservations);
      } catch (error) {
        console.error(
          "Error al obtener registros:",
          error
        );

        res.status(500).json({
          error: "Error al obtener registros",
        });
      }
    }
  );

  /**
   * DELETE /api/registrations/:id
   * Cancelar registro
   */
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
        console.error(
          "Error al cancelar registro:",
          error
        );

        res.status(500).json({
          error: "Error al cancelar registro",
        });
      }
    }
  );

  /**
   * GET /api/registrations
   * Admin - todos los registros
   */
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

            u.nombre AS attendee_name,
            u.email AS attendee_email,

            a.title AS activity_title,
            a.activity_date,

            p.name AS program_name

          FROM registrations r

          INNER JOIN usuarios u
            ON u.id = r.attendee_id

          INNER JOIN activities a
            ON a.id = r.activity_id

          INNER JOIN programs p
            ON p.id = a.program_id

          ORDER BY r.registered_at DESC;
          `
        );

        const registrations = result.rows.map(
          (row) => ({
            id: row.id,
            status: row.status,
            registeredAt: row.registered_at,
            qrCode: row.qr_code,

            attendee: {
              name: row.attendee_name,
              email: row.attendee_email,
            },

            activity: {
              title: row.activity_title,
              date: row.activity_date,
            },

            program: {
              name: row.program_name,
            },
          })
        );

        res.json(registrations);
      } catch (error) {
        console.error(
          "Error al obtener registros admin:",
          error
        );

        res.status(500).json({
          error: "Error al obtener registros",
        });
      }
    }
  );

  /**
   * POST /api/registrations/check-in
   * Escaneo QR
   */
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
          SELECT
            r.id,
            r.qr_code,
            r.status,

            a.title AS activity_title,

            u.nombre AS attendee_name

          FROM registrations r

          INNER JOIN activities a
            ON a.id = r.activity_id

          INNER JOIN usuarios u
            ON u.id = r.attendee_id

          WHERE r.qr_code = $1
            AND r.status = 'confirmada';
          `,
          [qrCode]
        );

        if (registrationResult.rows.length === 0) {
          return res.status(404).json({
            error:
              "QR inválido o registro no confirmado",
          });
        }

        const registration =
          registrationResult.rows[0];

        await pool.query(
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
            checked_by = $2;
          `,
          [registration.id, req.user.id]
        );

        res.json({
          ok: true,
          attendeeName:
            registration.attendee_name,
          activityTitle:
            registration.activity_title,
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
