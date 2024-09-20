import React from 'react';
import { Task } from '@/types/types';

type TaskCardProps = {
    task: Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">{task.name}</h3>
            <p className="text-gray-500">Status: <span className="font-semibold">{task.status.status}</span></p>
        </div>
    );
};

export default TaskCard;