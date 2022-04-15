// --------------------------------------------------------------------------------------------------------
// J'importe mes packages + express router

const express = require("express");
const formidableMiddleWare = require("express-formidable");
const { appendFile } = require("fs");
const mongoose = require("mongoose");
const { CLIENT_RENEG_WINDOW } = require("tls");
const router = express.Router();

// Import de cloudinary v2
const cloudinary = require("cloudinary").v2;

// --------------------------------------------------------------------------------------------------------
// Données à remplacer avec vos credentials :

cloudinary.config({
  cloud_name: "dskrnrcct",
  api_key: "669744172887151",
  api_secret: "4CW175irlMZTjOfNVsj6ppvAj3M",
});

// --------------------------------------------------------------------------------------------------------
// J'importe mon modèle

const Offer = require("../models/Offer");

const User = require("../models/User");

// --------------------------------------------------------------------------------------------------------
// J'importe mon middleware

const isAuthenticated = require("../middlewares/isAuthenticated");

// --------------------------------------------------------------------------------------------------------
// Connexion à la BDD
mongoose.connect("mongodb://localhost:27017/Vinted");

// --------------------------------------------------------------------------------------------------------
// POST : Création de l'offre avec le middleware isAuthenticated pour vérifier que la personne est connectée

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  //   // on log les fichiers reçus
  //   console.log(req.files); // { file1: ..., file2: ... }
  // ...
  try {
    let pictureToUpload = req.files.picture.path;
    // let objectID = toString(newOffer.id);
    // console.log(req.fields.id);
    let pathtoUploadFolder = "vinted/offers/";

    const result = await cloudinary.uploader.upload(pictureToUpload, {
      folder: pathtoUploadFolder,
      public_id: req.fields.id,
    });

    const newOffer = new Offer({
      product_name: req.fields.title,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: [
        { MARQUE: req.fields.brand },
        { TAILLE: req.fields.brand },
        { ETAT: req.fields.condition },
        { COULEUR: req.fields.color },
        { EMPLACEMENT: req.fields.city },
      ],

      product_image: result.secure_url,
      owner: req.user,
    });
    // console.log(result);

    await newOffer.save();
    res.status(200).json({ newOffer });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// --------------------------------------------------------------------------------------------------------
// PUT : modification  de l'offre publié par l'user

router.put("/offer/edit", isAuthenticated, async (req, res) => {
  try {
    const offerToFind = await Offer.findOne({ id: req.fields.id });
    console.log(offerToFind);
    if (offerToFind) {
      offerToFind.product_description = req.fields.description;
      offerToFind.product_price = req.fields.price;
      offerToFind.product_details[0].MARQUE = req.fields.brand;
      offerToFind.product_details[1].TAILLE = req.fields.size;
      offerToFind.product_details[2].ETAT = req.fields.condition;
      offerToFind.product_details[3].COULEUR = req.fields.color;
      offerToFind.product_details[4].EMPLACEMENT = req.fields.city;
      offerToFind.product_image = req.fields.product_image;

      // console.log(offerToFind.product_details[0].MARQUE);
      offerToFind.owner = req.user;

      await offerToFind.save();
      res.status(200).json(offerToFind);
      // } else {
      //   res.status(400).json({ message: "L'offre n'existe pas" });
      // }
    } else {
      res.status(400).json({ message: "Veuillez vous connecter" });
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// --------------------------------------------------------------------------------------------------------
// DELETE : suppression d'offres

router.delete("/offer/delete/:id", isAuthenticated, async (req, res) => {
  try {
    // Je retourner l'objet via req.fields.id qui correspond à l'id de l'offre
    let offerToDelete = await Offer.findById(req.fields.id);
    console.log("offerToDelete");
    // const userAuthorized = req.user;
    if (offerToDelete) {
      offerToDelete = offerToDelete.remove();

      res.status(200).json({ message: "Offer Deleted" });
    } else {
      res.status(400).json({ message: "Wrong" });
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// --------------------------------------------------------------------------------------------------------
// J'exporte ma route

module.exports = router;
