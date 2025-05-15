// backend/viewModels/userViewModel.js
function toUserVM(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role.name, // при populate('role','name')
    status: user.status,
    avatar: user.avatar,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = { toUserVM };
