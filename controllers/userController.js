// backend/controllers/userController.js

const { toUserVM } = require("../viewModels/userViewModel");
const {
  findAllUsers,
  getUserProfileById,
  deleteUser,
  findRoleByName,
  assignRoleToUser,
} = require("../services/dbServices");

/**
 * 1) Получить список всех пользователей
 * GET /api/users
 */
exports.getUserList = async (req, res) => {
  try {
    const users = await findAllUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.json({ status: 200, data: users.map(toUserVM) });
  } catch (err) {
    console.error("getUserList error:", err);
    res.status(500).json({ error: "Server error fetching users" });
  }
};

/**
 * 2) Получить одного пользователя по ID
 * GET /api/users/:id
 */
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    // проверка валидности ObjectId (можно использовать mongoose.isValidObjectId)
    const user = await getUserProfileById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ status: 200, data: user.map(toUserVM) });
  } catch (err) {
    console.error("getUser error:", err);
    res.status(500).json({ error: "Server error fetching user" });
  }
};

/**
 * 3) Удалить пользователя по ID
 * DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteUser(id);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ error: "Server error deleting user" });
  }
};

/**
 * 4) Назначить роль пользователю
 * PUT /api/users/:id/role
 * Body: { roleName: string }
 */
exports.assignRoleToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

    // 1) находим роль по имени
    const role = await findRoleByName(roleName);
    if (!role) {
      return res.status(400).json({ error: "Invalid role name" });
    }

    // 2) обновляем пользователя
    const user = await assignRoleToUser(id, role._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Role assigned", user });
  } catch (err) {
    console.error("assignRoleToUser error:", err);
    res.status(500).json({ error: "Server error assigning role" });
  }
};
