const express = require('express');
const router = express.Router();
const { getNotificationsByShop } = require('../controllers/NotificationController');
const { markAsRead } = require('../controllers/NotificationController');


router.get('/shop/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const notifs = await getNotificationsByShop(shopId);
    res.status(200).json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    const notif = await markAsRead(id);

    if (!notif) return res.status(404).json({ message: 'Notification non trouvée' });

    res.status(200).json(notif);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
