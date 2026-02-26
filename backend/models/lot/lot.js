const mongoose = require("mongoose");

const lotSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true
    },
    surface: {
        type: Number,
        required: true
    },
    zone: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        enum: ["LIBRE", "OCCUPE", "FERME"],
        default: "LIBRE"
    },
    prix: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Lot", lotSchema);