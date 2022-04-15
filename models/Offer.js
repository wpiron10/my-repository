// --------------------------------------------------------------------------------------------------------
// Je déclare mongoose pour déclarer mon modèle

const mongoose = require("mongoose");

// --------------------------------------------------------------------------------------------------------
// Déclaration du modèle Offer

const Offer = mongoose.model("Offer", {
  product_name: String,
  product_description: String,
  product_price: Number,
  product_details: Array,
  product_image: { type: mongoose.Schema.Types.Mixed, default: {} },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// --------------------------------------------------------------------------------------------------------
// J'exporte mon modèle

module.exports = Offer;
