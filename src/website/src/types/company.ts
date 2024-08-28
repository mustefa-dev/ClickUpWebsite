import User from "./user"
export const SubscriptionStatusList = ["Active", "Expired", "Disabled", "NotActiveYet"] as const;
export type SubscriptionStatus = (typeof SubscriptionStatusList)[number]
export const SubscriptionStatusTranslate = {
  "Active": "فعال",
  "Expired": "منتهي",
  "Disabled": "معطل",
  "NotActiveYet": "لم يتم تفعيله بعد"
}

export const PaymentMethodList = ["Cash", "ZainCash", "Tabadul"] as const;
export type PaymentMethod = (typeof PaymentMethodList)[number];
export const PaymentMethodTranslation = {
  "Cash": "نقد",
  "ZainCash": "زين كاش",
  "Tabadul": "تبادل"
}


export interface Company {
  id: string
  name: string
  subDomain: string
  subscriptionInfo: SubscriptionInfo
  userId: string
  user: User
  creationDate: string
  isDisabled: boolean
  hasBlog: boolean
  activatedById: string
  activatedBy: User
}

export interface SubscriptionInfo {
  subscriptionStartDate: string
  subscriptionEndDate: string
  paymentMethod: PaymentMethod
  note: string
  price: number
  status: SubscriptionStatus
}