// --------------------------------------------------------------------------------------------------------
// J'importe mes packages + express router

const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
// --------------------------------------------------------------------------------------------------------
// J'importe mon modèle

const User = require("../models/User");

// --------------------------------------------------------------------------------------------------------
// CREATE : a new user

router.post("/user/signup", async (req, res) => {
  console.log("route : /user/signup");
  console.log(req.fields);

  try {
    const password = req.fields.password;
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);

    let emailCheck = await User.findOne({ email: req.fields.email });
    if (!req.fields.username) {
      res.status(400).json({
        error: "Username manquant, veuillez donner un username poru continuer.",
      });
    } else {
      if (emailCheck) {
        res.status(400).json({ error: "Email déjà utilisé" });
      } else {
        const newUser = new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
          },
          newsletter: req.fields.newletter,
          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();
        res.status(200).json({ token: token, username: req.fields.username });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --------------------------------------------------------------------------------------------------------
// J'exporte ma route

module.exports = router;
