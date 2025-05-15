// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config/jwt");
const RoleFactory = require("../factories/roleFactory");

/**
 * Middleware authenticate — проверяет access-токен.
 * Если токен валиден, кладёт payload (id, roleName) в req.user.
 * Если нет токена или он просрочен/неверный — возвращает 401.
 */
async function authenticate(req, res, next) {
  try {
    // 1. Читаем заголовок Authorization: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res
        .status(401)
        .json({
          error: 'Bad authorization header format. Use "Bearer <token>"',
        });
    }

    const token = parts[1];

    // 2. Верифицируем токен
    let payload;
    try {
      payload = jwt.verify(token, accessTokenSecret);
    } catch (err) {
      // возможны ошибки: TokenExpiredError, JsonWebTokenError
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // 3. Кладём данные пользователя в req.user
    //    payload должен содержать { id, roleName }
    req.user = {
      id: payload.id,
      roleName: payload.role,
    };

    next(); // всё ок, идём дальше
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Middleware authorize(permission) — проверяет, есть ли у пользователя нужное право.
 * Выполняет RoleFactory.get(req.user.roleName) и смотрит, содержится ли requiredPermission.
 * Если есть — пропускает дальше, если нет — 403 Forbidden.
 *
 * @param {string} requiredPermission — ключ права, например 'post.create'
 */
function authorize(requiredPermission) {
  return async (req, res, next) => {
    try {
      // 1. Убедимся, что предыдущий middleware authenticate уже заполнил req.user
      if (!req.user || !req.user.roleName) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // 2. Получим роль из RoleFactory (с кешем!)
      const role = await RoleFactory.get(req.user.roleName);

      // 3. Проверяем наличие права:
      //    - точное совпадение, или
      //    - wildcard 'entity.*', когда requiredPermission.startsWith(prefix),
      //    - или глобальный '*' в списке permissions.
      const perms = role.permissions;
      const hasPermission = perms.some((p) => {
        if (p === "*") return true;
        if (p.endsWith(".*")) {
          const prefix = p.slice(0, -2); // 'user.*' → 'user'
          return requiredPermission.startsWith(prefix + ".");
        }
        return p === requiredPermission;
      });

      if (!hasPermission) {
        return res
          .status(403)
          .json({ error: "Forbidden: insufficient permissions" });
      }

      next(); // разрешено
    } catch (err) {
      console.error("Authorize middleware error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = {
  authenticate,
  authorize,
};
