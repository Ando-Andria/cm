const Notification = require('../models/general/Notification');

// Ajouter une notification
const addNotification = async ({ type, message, referenceId, shopId, date }) => {
  const notif = new Notification({
    type,
    message,
    referenceId,
    shopId,
    date: date || new Date()
  });
  await notif.save();
  console.log('🔔 Nouvelle notification :', notif);
  return notif;
};

// Récupérer les notifications d’une boutique
const getNotificationsByShop = async (shopId) => {
  return await Notification.find({ shopId }).sort({ date: -1 });
};

// Marquer notification comme lue
const markAsRead = async (id) => {
  const notif = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
  return notif;
};

module.exports = { addNotification, getNotificationsByShop, markAsRead };
