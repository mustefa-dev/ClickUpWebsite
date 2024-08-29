export const RoleList = ["User", "Admin"] as const;
export type Role = (typeof RoleList)[number];
export const RoleTranslate = {
    "Admin": "أدمن",
    "User": "مستخدم"
}

export default interface User {
    id: string;
    username: string;
    externalId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    isDeleted: boolean;
    role: Role;
    sectionId: string;
}