import React from 'react';
import { Task } from '@/types/types';
import { useAuthStore } from '@/utils/authStore';

type TaskCardProps = {
    task: Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const { accessToken } = useAuthStore();

    const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        const payload = {
            taskId: task.id,
            newStatus: newStatus,
            accessToken: accessToken
        };

        try {
            const response = await fetch(`http://localhost:5272/api/ClickUp/UpdateTaskStatus?taskId=${task.id}&newStatus=${newStatus}&accessToken=${accessToken}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to update task status: ${response.statusText}`);
            }

            console.log('Task status updated successfully');
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">{task.name}</h3>
            <p className="text-gray-500">Status:
                <select
                    value={task.status.status}
                    onChange={handleStatusChange}
                    className="ml-2 p-1 border rounded"
                >
                    <option value="To Do">To Do</option>
                    <option value="need attention">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </p>
        </div>
    );
};

export default TaskCard;