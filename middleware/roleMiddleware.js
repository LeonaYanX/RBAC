/**
 * Checks if the authenticated user has one of the allowed roles.
 * Usage:
 *   router.get('/path', authenticate, allowRoles('admin', 'superadmin'), handler);
 *
 * @param  {...string} allowedRoles - List of role names that are permitted
 * @returns {import('express').RequestHandler} Express middleware
 */
exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // middleware authenticate must be called before this one
    // and must set req.user with the roleName
    const roleName = req.user && req.user.roleName;
    if (!roleName) {
      // No roleName in req.user
      //This means the user is not authenticated
      // or the authenticate middleware failed
      return res
        .status(401)
        .json({ status: 'error', message: 'User not authenticated' });
    }

    // Check if the roleName is in the allowedRoles
    if (!allowedRoles.includes(roleName)) {
      // the user have role but don't dave the required permissions
      return res
        .status(403)
        .json({ status: 'error', message: 'Forbidden: insufficient role' });
    }

    
    next();
  };
};
