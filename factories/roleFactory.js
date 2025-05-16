const Role = require("../models/Role");

/**
 * RoleFactory encapsulates and caches role-loading logic.
 * Use RoleFactory.get('admin') instead of Role.findOne()
 * to obtain a role object with an array of permission keys.
 *
 * @class
 */
class RoleFactory {
  // In-memory cache for faster lookups
  static cache = new Map(); // Map<roleName, { name: string, permissions: string[] }>

  /**
   * Retrieves a role by name, including its permission keys.
   * Caches the result to avoid repeated DB calls.
   *
   * @param {string} roleName - The name of the role to fetch.
   * @returns {Promise<{ name: string, permissions: string[] }>}
   * @throws {Error} If no role with the given name is found.
   */
  static async get(roleName) {
    // Return from cache if available
    if (RoleFactory.cache.has(roleName)) {
      return RoleFactory.cache.get(roleName);
    }

    // Otherwise load from database
    const roleDoc = await Role.findOne({ name: roleName })
      .populate("permissions") // fetch Permission documents
      .lean();                 // ← CHANGED: add lean() for plain JS object

    if (!roleDoc) {
      throw new Error(`Role "${roleName}" not found`);
    }

    // Extract only permission keys
    const role = {
      name: roleDoc.name,
      permissions: roleDoc.permissions.map((p) => p.key),
    };

    // Cache for future requests
    RoleFactory.cache.set(roleName, role);
    return role;
  }

  /**
   * Clears the in-memory cache.
   * Call this method after updating roles or permissions in the database
   * to ensure subsequent calls fetch fresh data.
   *
   * @returns {void}
   */
  static clearCache() {
    RoleFactory.cache.clear();
  }
}

module.exports = RoleFactory;
