type User = {
    id: number;
    username: string;
    email: string;
    initials: string | null;
    color: string;
    profilePicture: string;
};

type TaskStatus = {
    status: string;
    id: string;
    color: string;
    type: string;
    orderIndex: number;
};

export type Task = {
    id: string;
    name: string;
    description: string;
    status: TaskStatus;
    assignees: User[];
    creator: User;
    dateCreated: number;
    dateUpdated: number;
    dateClosed: number | null;
    dateDone: number | null;
    customId: string | null;
    customItemId: string | null;
    url: string;
    orderIndex: string;
    archived: boolean;
    tags: Array<Record<string, any>>;
    watchers: User[];
};
