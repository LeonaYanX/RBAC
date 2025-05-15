const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  key: {
    // уникальный идентификатор права, например: 'user.create', 'post.delete'
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Permission", PermissionSchema);
