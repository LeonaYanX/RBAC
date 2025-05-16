const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("../config/jwt");
const RoleFactory = require("../factories/roleFactory");

/**
 * Verifies the Access Token from the Authorization header.
 * On success, attaches the decoded payload ({ id, roleName }) to req.user.
 * On failure, responds with 401 Unauthorized.
 *
 * @param {import('express').Request}  req  Express request
 * @param {import('express').Response} res  Express response
 * @param {import('express').NextFunction} next  Express next middleware
 */
async function authenticate(req, res, next) {
  // 1. Read Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ status: "error", message: "No authorization header" });        
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({
        status: "error",                                                     
        message: 'Bad authorization header format. Use "Bearer <token>"',
      });
  }

  // 2. Verify token
  let payload;
  try {
    payload = jwt.verify(token, accessTokenSecret);
  } catch (err) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token" });        
  }

  // 3. Attach user info to request
  req.user = {
    id: payload.id,
    roleName: payload.role,
  };

  return next();
}

/**
 * Checks that the authenticated user has the specified permission.
 * Uses RoleFactory.get(roleName) to load and cache the role’s permissions.
 *
 * @param {string} requiredPermission  Permission key, e.g. "user.create"
 * @returns {import('express').RequestHandler}
 */
function authorize(requiredPermission) {
  return async (req, res, next) => {
    // 1. Ensure user is authenticated
    if (!req.user || !req.user.roleName) {
      return res
        .status(401)
        .json({ status: "error", message: "User not authenticated" });      
    }

    // 2. Load permissions via RoleFactory
    let role;
    try {
      role = await RoleFactory.get(req.user.roleName);
    } catch (err) {
      console.error("Authorize middleware error:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });       
    }

    // 3. Check permission presence
    const { permissions } = role;
    const hasPermission = permissions.some((p) => {
      if (p === "*") return true;
      if (p.endsWith(".*")) {
        const prefix = p.slice(0, -2);
        return requiredPermission.startsWith(prefix + ".");
      }
      return p === requiredPermission;
    });

    if (!hasPermission) {
      return res
        .status(403)
        .json({ status: "error", message: "Forbidden: insufficient permissions" }); 
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
