import React, { useState } from 'react';
import { useAuthStore } from '@/utils/authStore';
import TaskCard from '@/components/TaskCard';

const TaskListPage: React.FC = () => {
    const { tasks } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === '' || task.status.status === statusFilter)
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Task List</h2>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by task name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="border p-2 w-full rounded"
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="border p-2 w-full rounded"
                >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    {/* Add more status options as needed */}
                </select>
            </div>
            <div className="flex flex-col gap-6">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
            </div>
        </div>
    );
};

export default TaskListPage;