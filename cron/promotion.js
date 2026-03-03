const cron = require('node-cron');
const Promotion = require('../models/boutique/Promotion');

// Cron toutes les minutes (ou toutes les heures selon ton besoin)
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    // Mettre à jour toutes les promos expirées
    const result = await Promotion.updateMany(
      { endDate: { $lt: now }, status: 'active' },
      { status: 'expired' }
    );

    if (result.modifiedCount > 0) {
      console.log(`🔔 ${result.modifiedCount} promotions expirées mises à jour`);
    }
  } catch (err) {
    console.error('Erreur cron promotions:', err);
  }
});
