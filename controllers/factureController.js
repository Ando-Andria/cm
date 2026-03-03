const Facture = require('../models/admin/facture/facture');
const Contrat = require('../models/admin/contrat/contrat');

// ================= CREATE FACTURES =================
exports.createFacturesMensuelles = async (req, res) => {
  try {
    const { periode } = req.body;

    if (!periode) {
      return res.status(400).json({ message: "La période est obligatoire" });
    }

    // 🔥 1️⃣ Récupérer contrats ACTIF
    const contratsActifs = await Contrat
      .find({ statut: "ACTIF" })
      .populate("boutiqueId");

    if (!contratsActifs.length) {
      return res.status(404).json({ message: "Aucun contrat actif trouvé" });
    }

    const facturesCreees = [];

    // ================= LOOP =================
    for (let contrat of contratsActifs) {

      // Vérifier montant
      if (!contrat.loyerMensuel) {
        console.log("Contrat sans loyerMensuel :", contrat._id);
        continue;
      }

      // Vérifier si déjà existante
      const exist = await Facture.findOne({
        contratId: contrat._id,
        periode
      });

      if (exist) continue;

      // 🔥 2️⃣ Création facture dans la DB uniquement
      const facture = await Facture.create({
        contratId: contrat._id,
        periode,
        montantTotal: contrat.loyerMensuel,
        dateEmission: new Date()
      });

      facturesCreees.push(facture);
    }

    return res.status(201).json({
      message: "Factures créées avec succès",
      facturesCreees
    });

  } catch (error) {
    console.error("Erreur génération factures:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};