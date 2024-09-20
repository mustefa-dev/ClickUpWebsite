// TaskListPage.tsx
import React from 'react';
import { useAuthStore } from '@/utils/authStore';

const TaskListPage: React.FC = () => {
    const { accessToken, tasks } = useAuthStore();

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Task List</h2>
            <p className="mb-6">Your access token: <span className="font-mono text-blue-600">{accessToken}</span></p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task.id} className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-2">{task.name}</h3>
                            <p className="text-gray-600 mb-4">{task.description || "No description available."}</p>
                            <p className="text-gray-500">Status: <span className="font-semibold">{task.status.status}</span></p>
                        </div>
                    ))
                ) : (
                    <p>No tasks available.</p>
                )}
            </div>
        </div>
    );
};

export default TaskListPage;

