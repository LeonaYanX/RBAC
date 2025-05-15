/**
 * JWT Configuration Constants
 *
 * Contains secrets and lifetimes for both access and refresh tokens.
 * Splitting secrets and lifetimes allows:
 *   1) Short-lived access tokens (~15 minutes)
 *   2) Long-lived refresh tokens (7 days) for obtaining new access tokens
 *
 * @constant {string} accessTokenSecret - Secret key for signing access tokens
 * @constant {string} refreshTokenSecret - Secret key for signing refresh tokens
 * @constant {string} accessTokenLife - Access token time-to-live (e.g., "15m")
 * @constant {string} refreshTokenLife - Refresh token time-to-live (e.g., "7d")
 */
module.exports = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "access-secret-example",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "refresh-secret-example",

  // Token lifetimes: can be configured via environment or left as defaults
  accessTokenLife: "15m", // 15 minutes
  refreshTokenLife: "7d", // 7 days
};
