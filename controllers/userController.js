const { toUserVM } = require("../viewModels/userViewModel");
const {
  findAllUsers,
  getUserProfileById,
  deleteUserService,
  findRoleByName,
  assignRoleToUserService,         
} = require("../services/dbServices");

/**
 * Retrieves a list of all users.
 *
 * GET /api/users
 *
 * @param {import('express').Request}  req  Express request
 * @param {import('express').Response} res  Express response
 */
exports.getUserList = async (req, res) => {
  const users = await findAllUsers();
  if (!users || users.length === 0) {
    return res
      .status(404)
      .json({ status: "error", message: "No users found" });           
  }
  res.status(200).json({ status: "success", data: users.map(toUserVM) });
};

/**
 * Retrieves a single user by ID.
 *
 * GET /api/users/:id
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
exports.getUser = async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!id || id.length !== 24) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid user ID" });         
  }

  const user = await getUserProfileById(id);
  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found" });
  }

  // toUserVM accepts a single object
  res.status(200).json({ status: "success", data: toUserVM(user) });   
};

/**
 * Deletes a user by ID.
 *
 * DELETE /api/users/:id
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id || id.length !== 24) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid user ID" });
  }

  const result = await deleteUserService(id);
  if (!result) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found" });
  }

  res
    .status(200)
    .json({ status: "success", message: "User deleted successfully" });
};

/**
 * Assigns a new role to a user.
 *
 * PUT /api/users/:id/role
 * Body: { roleName: string }
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
exports.assignRoleToUser = async (req, res) => {
  const { id } = req.params;
  const { roleName } = req.body;

  if (!id || id.length !== 24) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid user ID" });
  }
  if (!roleName) {
    return res
      .status(400)
      .json({ status: "error", message: "Role name is required" });
  }

  // 1) find the role
  const role = await findRoleByName(roleName);
  if (!role) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid role name" });
  }

  // 2) update user role
  const updatedUser = await assignRoleToUserService(id, role._id);
  if (!updatedUser) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found" });
  }

  res.status(200).json({
    status: "success",
    message: "Role assigned",
    data: toUserVM(updatedUser),                                
  });
};
