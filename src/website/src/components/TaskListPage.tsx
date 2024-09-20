// src/website/src/components/TaskListPage.tsx
import React from 'react';
import { useAuthStore } from '@/utils/authStore';
import TaskCard from '@/components/TaskCard';

const TaskListPage: React.FC = () => {
    const { tasks } = useAuthStore();

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Task List</h2>
            <div className="flex flex-col gap-6">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))
                ) : (
                    <p>No tasks available.</p>
                )}
            </div>
        </div>
    );
};

export default TaskListPage;