// backend/middleware/errorMiddleware.js
/**
 * Global Error Handler.
 * Должен быть последний в цепочке middleware.
 */
function errorHandler(err, req, res, next) {
  console.error("💥 Error:", err);

  // Ошибки от express-validator имеют метод array()
  if (err.array) {
    const errors = err.array().map((e) => ({ field: e.param, msg: e.msg }));
    return res.status(400).json({ status: "error", errors });
  }

  // Пользовательские ошибки могут содержать status
  const code = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(code).json({ status: "error", message });
}

module.exports = errorHandler;
