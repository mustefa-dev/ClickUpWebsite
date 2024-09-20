// types.ts
export interface Task {
    id: string;
    name: string;
    description: string;
    status: {
        status: string;
    };
}
