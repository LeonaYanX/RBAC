const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    // название роли, например: 'admin', 'user', 'moderator'
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  permissions: [
    {
      // массив ссылок на Permission
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission',
    },
  ],
});

module.exports = mongoose.model('Role', RoleSchema);
