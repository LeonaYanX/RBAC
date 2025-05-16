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
  
    const users = await findAllUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json({data: users.map(toUserVM) });
};

/**
 * 2) Получить одного пользователя по ID
 * GET /api/users/:id
 */
exports.getUser = async (req, res) => {
  
    const { id } = req.params;
    
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await getUserProfileById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({data: user.map(toUserVM) });
};

/**
 * 3) Удалить пользователя по ID
 * DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const result = await deleteUser(id);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
};

/**
 * 4) Назначить роль пользователю
 * PUT /api/users/:id/role
 * Body: { roleName: string }
 */
exports.assignRoleToUser = async (req, res) => {

    const { id } = req.params;
    const { roleName } = req.body;
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    if (!roleName) {
      return res.status(400).json({ error: "Role name is required" });
    }

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

    res.status(200).json({ message: "Role assigned", user });
};
