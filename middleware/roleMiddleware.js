// backend/middleware/roleMiddleware.js

/**
 * Проверка допуска по списку разрешённых ролей.
 * Используйте так:
 *   router.get('/path', authenticate, allowRoles('admin','superadmin'), handler);
 */
exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // middleware authenticate до этого должен прописать req.user.roleName
    const roleName = req.user && req.user.roleName;
    if (!roleName) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // если роль пользователя нет в списке allowedRoles — 403
    if (!allowedRoles.includes(roleName)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    // иначе — пропускаем дальше
    next();
  };
};
