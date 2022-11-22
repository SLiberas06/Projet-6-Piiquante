const express = require("express");
const router = express.Router();

//Importation des controllers et middlewares
const saucesControl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//Parcours des routes sauces
router.post("/", auth, multer, saucesControl.createSauce);
router.get("/", auth, saucesControl.getAllSauces);
router.get("/:id", auth, saucesControl.getOneSauce);
router.put("/:id", auth, multer, saucesControl.modifySauce);
router.delete("/:id", auth, multer, saucesControl.deleteSauce);
router.post("/:id/like", auth, saucesControl.likeSauce);

module.exports = router;
