const mongoose = require("mongoose");

const contratSchema = new mongoose.Schema({
    boutiqueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Boutique",
        required: true
    },
    lotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lot",
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },
    datePaiement: {
        type: Number,
        default: null
    },
    dateEnvoie: {
        type: Number,
        default: null
    },
    loyerMensuel: {
        type: Number,
        required: true
    },
    statut: {
        type: String,
        enum: ["ACTIF", "EXPIRE", "RESILIE"],
        default: "ACTIF"
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model("Contrat", contratSchema);