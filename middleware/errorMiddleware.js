/**
 * Global Error Handler.
 * Should be the last middleware in the chain.
 *
 * @param {Error} err        - The error object passed from any route or middleware.
 * @param {Request} req      - Express request object.
 * @param {Response} res     - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
function errorHandler(err, req, res, next) {
  // Log full error stack for debugging
  console.error("Error:", err.stack || err);          

  // Handle validation errors from express-validator
  if (typeof err.array === "function") {                   
    const errors = err.array().map(e => ({ 
      field: e.param, 
      message: e.msg                                     
    }));
    return res.status(400).json({ 
      status: "error", 
      errors 
    });
  }

  // Use custom status code if provided, else default to 500
  const statusCode = err.statusCode || err.status || 500;  // 
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message
  });
}

module.exports = errorHandler;
