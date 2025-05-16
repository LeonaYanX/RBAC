/**
 * RoleFactory инкапсулирует логику загрузки и кеширования роли.
 * Используйте RoleFactory.get('admin') вместо прямого Role.findOne(),
 * чтобы получить объект с массивом ключей permissions.
 */

const Role = require("../models/Role");

class RoleFactory {
  // кеш в памяти для ускорения
  static cache = new Map(); // Map для хранения ролей

  /**
   * Возвращает роль с ключами прав.
   * @param {string} roleName
   * @returns {Promise<{ name: string, permissions: string[] }>}
   */
  static async get(roleName) {
    // если есть в кеше — возвращаем сразу
    if (RoleFactory.cache.has(roleName)) {
      return RoleFactory.cache.get(roleName);
    }

    // иначе загружаем из БД
    const roleDoc = await Role.findOne({ name: roleName }).populate(
      "permissions"
    );
    if (!roleDoc) {
      throw new Error(`Role "${roleName}" not found`);
    }

    // извлекаем только ключи прав
    const role = {
      name: roleDoc.name,
      permissions: roleDoc.permissions.map((p) => p.key), // массив ключей прав
    };

    RoleFactory.cache.set(roleName, role);
    return role;
  }

  /**
   * Сбрасывает кеш (вызывать при изменении ролей в БД).
   */
  static clearCache() {
    RoleFactory.cache.clear();
  }
}

module.exports = RoleFactory;
