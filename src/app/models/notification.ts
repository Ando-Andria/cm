export interface NotificationModel {
  _id: string;
  type: string;
  message: string;
  shopId: string;
  read: boolean;
  createdAt: Date;
}


