// --------------------------------------------------------------------------------------------------------
// J'importe mes packages + express router

const express = require("express");
const formidableMiddleWare = require("express-formidable");
const mongoose = require("mongoose");
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
// Connexion à la BDD
mongoose.connect("mongodb://localhost:27017/Vinted");

// --------------------------------------------------------------------------------------------------------
// GET : Pagination, tri et filtrage des pages

router.get("/offers", async (req, res) => {
  try {
    const filtersObject = {};

    // gestion du title
    if (req.query.title) {
      filtersObject.product_name = new RegExp(req.query.title, "i");
    }
    // gestion du title
    if (req.query.priceMin) {
      filtersObject.product_price = { $gte: req.query.priceMin };
    }

    // si j'ai déjà une clé product_price dans mon object filter
    if (req.query.priceMax) {
      if (filtersObject.product_price) {
        filtersObject.product_price.$lte = req.query.priceMax;
      } else {
        filtersObject.product_price = { $lte: req.query.priceMax };
      }
    }

    // gestion du tri avec un objet
    const sortObject = {};

    if (req.query.sort === "price-desc") {
      sortObject.product_price = "desc";
    } else if (req.query.sort === "price-asc") {
      sortObject.product_price = "asc";
    }
    // gestion de la pagination
    let limit = 3;
    if (req.query.limit) {
      limit = req.query.limit;
    }
    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }

    // On cherche via find l'objet Offer en mettant les filtres et tris
    const offers = await Offer.find(filtersObject)
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("product_name product_price");

    // on affiche les résultats de la requête client
    const count = await Offer.countDocuments(filtersObject);

    res.status(200).json({ count: count, offers: offers });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// --------------------------------------------------------------------------------------------------------
// GET : Récupérer les détails d'une annonce selon son id => fiche produit

router.get("/offers/:id", async (req, res) => {
  try {
    let offersbyID = await Offer.findById({ _id: req.params.id }).populate({
      path: "owner",
      // dans le select, pour enlever une cle on ajoute ' - ' avant comme ci dessous pour id
      select: "account.username email -_id",
    });

    res.status(200).json(offersbyID);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// --------------------------------------------------------------------------------------------------------
// J'exporte ma route

module.exports = router;
