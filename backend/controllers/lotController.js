const Lot = require("../models/lot/lot");

exports.createLot = async (req, res) => {
    try {
        const lot = new Lot(req.body);
        await lot.save();
        res.status(201).json(lot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getLots = async (req, res) => {
    try {
        const lots = await Lot.find();
        res.json(lots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLotById = async (req, res) => {
    try {
        const lot = await Lot.findById(req.params.id);
        if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
        res.json(lot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLot = async (req, res) => {
    try {
        const lot = await Lot.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
        res.json(lot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLot = async (req, res) => {
    try {
        const lot = await Lot.findByIdAndDelete(req.params.id);
        if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
        res.json({ message: "Lot supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};