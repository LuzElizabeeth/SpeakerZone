import express from "express";

const mapConference = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  date: row.conference_date,
  time: row.start_time?.slice(0, 5),
  endTime: row.end_time?.slice(0, 5) || null,
  location: row.location,
  type: row.type,
  status: row.status,
  capacity: row.capacity,
  registeredCount: Number(row.registered_count || 0),
  imageUrl: row.image_url,
  tags: row.tags || [],
  speaker: {
    id: row.speaker_id,
    name: row.speaker_name || "Por confirmar",
    role: row.speaker_role || "Conferencista",
    bio: row.speaker_bio || "",
    avatarUrl: row.speaker_avatar_url || "",
    organization: row.speaker_organization || ""
  },
  event: {
    id: row.event_id,
    name: row.event_name
  }
});

const selectConferenceById = async (pool, id) => {
  const result = await pool.query(
    `
    SELECT
      c.*,
      e.name AS event_name,
      s.id AS speaker_id,
      s.name AS speaker_name,
      s.role AS speaker_role,
      s.bio AS speaker_bio,
      s.avatar_url AS speaker_avatar_url,
      s.organization AS speaker_organization,
      COUNT(r.id) AS registered_count
    FROM conferences c
    INNER JOIN events e ON e.id = c.event_id
    LEFT JOIN speakers s ON s.id = c.speaker_id
    LEFT JOIN registrations r ON r.conference_id = c.id AND r.status <> 'cancelada'
    WHERE c.id = $1
    GROUP BY c.id, e.name, s.id;
    `,
    [id]
  );
  return result.rows[0] ? mapConference(result.rows[0]) : null;
};

const conferenceRoutes = (pool) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const { search, type, status } = req.query;
      const values = [];
      const where = [];

      if (search) {
        values.push(`%${search}%`);
        where.push(`(c.title ILIKE $${values.length} OR c.description ILIKE $${values.length} OR s.name ILIKE $${values.length})`);
      }
      if (type && type !== "todas") {
        values.push(type);
        where.push(`c.type = $${values.length}`);
      }
      if (status) {
        values.push(status);
        where.push(`c.status = $${values.length}`);
      }

      const query = `
        SELECT
          c.*,
          e.name AS event_name,
          s.id AS speaker_id,
          s.name AS speaker_name,
          s.role AS speaker_role,
          s.bio AS speaker_bio,
          s.avatar_url AS speaker_avatar_url,
          s.organization AS speaker_organization,
          COUNT(r.id) AS registered_count
        FROM conferences c
        INNER JOIN events e ON e.id = c.event_id
        LEFT JOIN speakers s ON s.id = c.speaker_id
        LEFT JOIN registrations r ON r.conference_id = c.id AND r.status <> 'cancelada'
        ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
        GROUP BY c.id, e.name, s.id
        ORDER BY c.conference_date ASC, c.start_time ASC;
      `;

      const result = await pool.query(query, values);
      res.json(result.rows.map(mapConference));
    } catch (error) {
      console.error("Error al obtener conferencias:", error);
      res.status(500).json({ error: "Error al obtener conferencias" });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const conference = await selectConferenceById(pool, req.params.id);
      if (!conference) return res.status(404).json({ error: "Conferencia no encontrada" });
      res.json(conference);
    } catch (error) {
      console.error("Error al obtener conferencia:", error);
      res.status(500).json({ error: "Error al obtener conferencia" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { eventId, speakerId, title, description, date, time, endTime, location, type, capacity, imageUrl, tags } = req.body;
      if (!eventId || !title || !date || !time || !location) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
      }

      const result = await pool.query(
        `
        INSERT INTO conferences (event_id, speaker_id, title, description, conference_date, start_time, end_time, location, type, capacity, image_url, tags)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING id;
        `,
        [
          eventId,
          speakerId || null,
          title,
          description || "",
          date,
          time,
          endTime || null,
          location,
          type || "presencial",
          Number(capacity || 100),
          imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
          tags || []
        ]
      );

      const conference = await selectConferenceById(pool, result.rows[0].id);
      res.status(201).json(conference);
    } catch (error) {
      console.error("Error al crear conferencia:", error);
      res.status(500).json({ error: "Error al crear conferencia" });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const { speakerId, title, description, date, time, endTime, location, type, capacity, imageUrl, tags, status } = req.body;
      const result = await pool.query(
        `
        UPDATE conferences
        SET
          speaker_id = COALESCE($1, speaker_id),
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          conference_date = COALESCE($4, conference_date),
          start_time = COALESCE($5, start_time),
          end_time = COALESCE($6, end_time),
          location = COALESCE($7, location),
          type = COALESCE($8, type),
          capacity = COALESCE($9, capacity),
          image_url = COALESCE($10, image_url),
          tags = COALESCE($11, tags),
          status = COALESCE($12, status),
          updated_at = NOW()
        WHERE id = $13
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
          type || null,
          capacity ? Number(capacity) : null,
          imageUrl || null,
          tags || null,
          status || null,
          req.params.id
        ]
      );

      if (result.rows.length === 0) return res.status(404).json({ error: "Conferencia no encontrada" });
      const conference = await selectConferenceById(pool, req.params.id);
      res.json(conference);
    } catch (error) {
      console.error("Error al actualizar conferencia:", error);
      res.status(500).json({ error: "Error al actualizar conferencia" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const result = await pool.query("DELETE FROM conferences WHERE id = $1 RETURNING id", [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Conferencia no encontrada" });
      res.json({ ok: true });
    } catch (error) {
      console.error("Error al eliminar conferencia:", error);
      res.status(500).json({ error: "Error al eliminar conferencia" });
    }
  });

  return router;
};

export default conferenceRoutes;
