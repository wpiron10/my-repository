// --------------------------------------------------------------------------------------------------------
// J'importe mes packages + express router (pas besoin de copier les packages de cryptages uid / sha256)

const express = require("express");
const formidableMiddleware = require("express-formidable");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const mongoose = require("mongoose");
const app = express();

// on utilise `express-formidable` sur toutes les routes
// cela aura un impact uniquement sur les routes qui reçoivent un FormData
app.use(formidableMiddleware());

// --------------------------------------------------------------------------------------------------------
// Connexion à la BDD
mongoose.connect("mongodb://localhost:27017/Vinted");

// --------------------------------------------------------------------------------------------------------
// J'importe mon modèle

const Offer = require("./models/Offer");
const Owner = require("./models/User");

// --------------------------------------------------------------------------------------------------------
// Import des routes

const LogIn = require("./routes/LogIn");
app.use(LogIn);

const SignUp = require("./routes/SignUp");
app.use(SignUp);

const Offers = require("./routes/Offers");
app.use(Offers);

const Publish = require("./routes/Publish");
app.use(Publish);

// --------------------------------------------------------------------------------------------------------
// Creation de la route : page introuvable

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Page introuvable",
  });
});

// --------------------------------------------------------------------------------------------------------
// Lancement du serveur

app.listen(3000, () => console.log("Server started"));
