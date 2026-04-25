import jwt from "jsonwebtoken";

const dbRoleToFrontendRole = (rol) => {
  if (rol === "administrativo") return "admin";
  if (rol === "conferencista") return "speaker";
  return "attendee";
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Token no proporcionado",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "clave_secreta_super_segura"
    );

    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      role: dbRoleToFrontendRole(decoded.rol),
    };

    next();
  } catch (error) {
    return res.status(403).json({
      error: "Token inválido o expirado",
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
};