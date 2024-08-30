import User from "./user";

export const TicketStatusList = ["Open", "InProgress", "Closed", "OnHold"] as const;
export type TicketStatus = (typeof TicketStatusList)[number];
export const TicketStatusTranslate = {
    "Open": "مفتوح",
    "InProgress": "قيد التنفيذ",
    "Closed": "مغلق",
    "OnHold": "معلق"
};

export interface Ticket {
    id: string;
    ticketTitle: string;
    currentStatus: TicketStatus;
    creatorId: string;
    imageGallery: string[];
    assignedUserId: string;
    lastUpdated: string;
    ticketNumber: number;
    creator: User;
    assignedUser: User;
    creationDate: string;
}