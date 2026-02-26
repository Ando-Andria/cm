const express = require("express");
const router = express.Router();
const boutiqueController = require("../controllers/boutiqueController");

router.post("/", boutiqueController.createBoutique);

router.put("/:id", boutiqueController.updateBoutique);
router.get("/", boutiqueController.getBoutiques);
router.get('/historique', boutiqueController.getHistoriqueBoutiques);   
router.get("/:id", boutiqueController.getBoutiqueById);
router.delete("/:id", boutiqueController.deleteBoutique);
module.exports = router;