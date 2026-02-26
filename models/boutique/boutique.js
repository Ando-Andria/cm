const mongoose = require("mongoose");

const responsableSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    contact: { type: String, required: true },
    cin: { type: String, required: true }
}, { _id: false });

const boutiqueSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
},
    responsable: responsableSchema,

    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model("Boutique", boutiqueSchema);