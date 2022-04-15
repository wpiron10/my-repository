// --------------------------------------------------------------------------------------------------------
// J'importe mes packages + express router

const express = require("express");
const formidableMiddleWare = require("express-formidable");
const { appendFile } = require("fs");
const mongoose = require("mongoose");
const { CLIENT_RENEG_WINDOW } = require("tls");
const router = express.Router();

// --------------------------------------------------------------------------------------------------------
// J'importe mon modèle

const User = require("../models/User");

// --------------------------------------------------------------------------------------------------------

// isAuthenticated : verifier que le token est le meme pour le next si cest le même

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      req.user = user;
      // On crée une clé "user" dans req. La route dans laquelle le middleware est appelé     pourra avoir accès à req.user
      return next();
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
