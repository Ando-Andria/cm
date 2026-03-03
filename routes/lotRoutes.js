const express = require("express");
const router = express.Router();
const lotController = require("../controllers/lotController");

router.post("/", lotController.createLot);
router.get("/", lotController.getLots);
router.get("/libres", lotController.getLotsLibres);
router.get("/:id", lotController.getLotById);
router.put("/:id", lotController.updateLot);
router.delete("/:id", lotController.deleteLot);

module.exports = router;
