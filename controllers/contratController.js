const Contrat = require("../models/contrat/contrat");
const Boutique = require("../models/boutique/boutique");
const Lot = require("../models/lot/lot");

// CREATE
exports.createContrat = async (req, res) => {
    try {
        const { boutiqueId, lotId, dateDebut, dateFin } = req.body;

        // Vérifier que la boutique existe
        const boutique = await Boutique.findById(boutiqueId);
        if (!boutique) return res.status(400).json({ message: "Boutique invalide" });

        // Vérifier que le lot existe
        const lot = await Lot.findById(lotId);
        if (!lot) return res.status(400).json({ message: "Lot invalide" });

        // 🔹 Loyer mensuel = prix du lot
        const loyerMensuel = lot.prix;

        // Créer le contrat
        const contrat = new Contrat({ boutiqueId, lotId, dateDebut, dateFin, loyerMensuel });
        await contrat.save();

        res.status(201).json(contrat);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// GET ALL (non supprimés)
exports.getContrats = async (req, res) => {
    try {
        const contrats = await Contrat.find({ deletedAt: null })
            .populate("boutiqueId")
            .populate("lotId");
        res.status(200).json(contrats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ACTIFS
exports.getContratsActifs = async (req, res) => {
    try {
        const contrats = await Contrat.find({
            statut: "ACTIF",
            deletedAt: null
        }).populate("boutiqueId").populate("lotId");

        res.status(200).json(contrats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET BY ID
exports.getContratById = async (req, res) => {
    try {
        const contrat = await Contrat.findOne({ _id: req.params.id, deletedAt: null })
            .populate("boutiqueId")
            .populate("lotId");

        if (!contrat) return res.status(404).json({ message: "Contrat non trouvé" });

        res.status(200).json(contrat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE
exports.updateContrat = async (req, res) => {
    try {
        const contrat = await Contrat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contrat) return res.status(404).json({ message: "Contrat non trouvé" });
        res.status(200).json(contrat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE (soft delete)
exports.deleteContrat = async (req, res) => {
    try {
        const contrat = await Contrat.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
        if (!contrat) return res.status(404).json({ message: "Contrat non trouvé" });
        res.status(200).json({ message: "Contrat supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};