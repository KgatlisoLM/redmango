import { SD_Status } from "../Utility/SD"

export default interface OrderHeaderModel {
    orderHeaderId?: number,
    pickupName?: string,
    pickupPhoneNumber?: string,
    pickupEmail?: string,
    appUserId?: string,
    appUser?: any,
    orderTotal?: number,
    orderDate?: string,
    stripePaymentIntentId?: string,
    status?: SD_Status,
    totalItems?: number,
  }