// --------------------------------------------------------------------------------------------------------
// J'importe mes packages + express router

const express = require("express");
const formidableMiddleware = require("express-formidable");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// --------------------------------------------------------------------------------------------------------
// J'importe mon modèle

const User = require("../models/User");

// --------------------------------------------------------------------------------------------------------
// READ : if user is registered

router.post("/user/login", async (req, res) => {
  console.log("route : /user/login");
  console.log(req.fields);

  try {
    if (!(await User.findOne({ email: req.fields.email }))) {
      res.status(400).json({
        error: "email inexistant dans la base",
      });
    } else {
      const emailCheck = await User.findOne({ email: req.fields.email });
      // const tokenCheck = await User.find({ token: token });
      if (req.fields.email !== emailCheck.email) {
        res.status(400).json({
          error: "Mauvais email",
        });
      } else {
        // je prends le salt, je reconstitue le hash et je compare pour afficher ou non les infos

        // if egal psw
        passwordCheck = req.fields.password;

        const hashSaved = emailCheck.hash;

        const hashToCheck = SHA256(passwordCheck + emailCheck.salt).toString(
          encBase64
        );
        console.log(hashSaved);
        console.log(hashToCheck);
        if (hashSaved !== hashToCheck) {
          res.status(400).json({
            error: "mauvais username ou mdp",
          });
        } else {
          res.status(200).json({
            token: emailCheck.token,
            account: { username: emailCheck.account.username },
          });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --------------------------------------------------------------------------------------------------------
// J'exporte ma route

module.exports = router;
