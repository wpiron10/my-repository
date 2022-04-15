// --------------------------------------------------------------------------------------------------------
// Je déclare mongoose pour déclarer mon modèle

const mongoose = require("mongoose");

// --------------------------------------------------------------------------------------------------------
// Déclaration du modèle User

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  account: {
    username: {
      required: true,
      type: String,
    },
    avatar: Object, // nous verrons plus tard comment uploader une image
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

// --------------------------------------------------------------------------------------------------------
// J'exporte mon modèle

module.exports = User;
