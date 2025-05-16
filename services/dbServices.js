const ActivationToken = require("../models/ActivationToken");
const User = require("../models/User");
const Role = require("../models/Role");
const PasswordResetToken = require("../models/PasswordResetToken");
const RefreshToken = require("../models/RefreshToken");
async function findActivationToken(token) {
  return await ActivationToken.findOne({ token });
}

async function findUserByIdAndUpdate(userId, updateData) {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
}

async function findUserByEmail(email) {
  const user = await User.findOne({ email }).populate('role', 'name');
  if (user) {
    return user;
  }
  return false;
}

async function findRoleByName(roleName) {
  const role = await Role.findOne({ name: roleName });
  if (role) {
    return role;
  }
  return false;
}

async function createPartialUser(email, roleId) {
  return await User.create({ email, role: roleId, status: "inactive" });
}

async function createActivationToken(userId, token, expires) {
  await ActivationToken.create({ user: userId, token, expires });
  return true;
}

async function deletePassResetTokenByUserId(userId) {
  await PasswordResetToken.deleteOne({ user: userId });
  return true;
}

async function createPasswordResetToken(userId, token, expires) {
  await PasswordResetToken.create({ userId, token, expires });

  return true;
}

async function findPasswordResetToken(token) {
  return await PasswordResetToken.findOne({ token });
}

async function findUserById(userId) {
  const user = await User.findById(userId);

  return user;
}

async function findRefreshToken(refreshToken) {
  return await RefreshToken.findOne({refreshToken});
}

async function deleteRefreshToken(refreshToken) {
  await RefreshToken.deleteOne({ token: refreshToken });
}

async function findAllUsers() {
  const users = await User.find()
    .select("-password") // убрать поле password из выдачи
    .populate("role", "name") // вместо ObjectId отдаём { name }
    .lean(); // преобразуем в JSON
  return users;
}

async function getUserProfileById(id) {
  return await User.findById(id).select("-password").populate("role", "name");
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

async function assignRoleToUser(id, roleId) {
  return await User.findByIdAndUpdate(
    id,
    { role: roleId },
    { new: true } // возвращает обновлённый документ
  )
    .select("-password")
    .populate("role", "name")
    .lean();
};

async function saveUser(user) {
   await user.save();
    return user;
  
};

async function deleteResettoken(record) {
  await record.deleteOne();
  return true;
};

module.exports = {
  findActivationToken,
  findUserByIdAndUpdate,
  findUserByEmail,
  findRoleByName,
  createPartialUser,
  createActivationToken,
  deletePassResetTokenByUserId,
  createPasswordResetToken,
  findPasswordResetToken,
  findUserById,
  findRefreshToken,
  deleteRefreshToken,
  findAllUsers,
  getUserProfileById,
  deleteUser,
  assignRoleToUser,
  saveUser,
  deleteResettoken,
};
