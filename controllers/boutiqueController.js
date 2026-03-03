const Boutique = require("../models/admin/boutique/boutique");
const Utilisateur = require("../models/admin/utilisateur/utilisateur"); 
const crypto = require("crypto");

exports.createBoutique = async (req, res) => {
    try {
        const { nom, email, categorie, responsable } = req.body;

        // 🔐 Générer mot de passe
        const generatedPassword = crypto.randomBytes(4).toString("hex");

        // ✅ Création boutique
        const boutique = new Boutique({
            nom,
            email,
            categorie,
            responsable
        });

        await boutique.save();

        // ✅ Création user lié à la boutique
        const user = new Utilisateur({
            nom: responsable.nom,
            prenom: responsable.prenom,
            email: email,
            password: generatedPassword,
            role: "BOUTIQUE",
            boutiqueId: boutique._id
        });

        await user.save();

        res.status(201).json({
            message: "Boutique et utilisateur créés avec succès",
            boutique,
            user: {
                email: user.email,
                password: generatedPassword
            }
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ UPDATE
exports.updateBoutique = async (req, res) => {
    try {
        const boutique = await Boutique.findOneAndUpdate(
            { _id: req.params.id, deletedAt: null },
            req.body,
            { new: true }
        );

        if (!boutique) {
            return res.status(404).json({ message: "Boutique non trouvée" });
        }

        res.json(boutique);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ GET ALL (sans supprimées)
exports.getBoutiques = async (req, res) => {
    try {
        const boutiques = await Boutique.find({ deletedAt: null })
            .populate("categorie"); // 🔥 récupère les infos Category

        res.status(200).json(boutiques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ HISTORIQUE (toutes, même supprimées)
exports.getHistoriqueBoutiques = async (req, res) => {
    try {
        const boutiques = await Boutique.find();
           // .populate("categorie");

        res.status(200).json(boutiques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET BY ID
exports.getBoutiqueById = async (req, res) => {
    try {
        const boutique = await Boutique.findOne({
            _id: req.params.id,
            deletedAt: null
        }).populate("categorie");

        if (!boutique) {
            return res.status(404).json({ message: "Boutique non trouvée" });
        }

        res.status(200).json(boutique);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ✅ SOFT DELETE
exports.deleteBoutique = async (req, res) => {
    try {
        const boutique = await Boutique.findByIdAndUpdate(
            req.params.id,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!boutique) {
            return res.status(404).json({ message: "Boutique non trouvée" });
        }

        res.status(200).json({ message: "Boutique supprimée (soft delete)" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};