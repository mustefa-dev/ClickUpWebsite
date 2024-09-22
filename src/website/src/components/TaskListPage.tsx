// src/components/TaskListPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskService from '@/services/taskService';
import CommentService from '@/services/commentService';
import TaskCard from '@/components/TaskCard';
import TaskDetailsDialog from '@/components/TaskDetailsDialog';
import { useAuthStore } from '@/utils/authStore';
import { IconButton, Button, Box } from '@mui/material';
import { Logout } from '@mui/icons-material';
import {BASE_URL} from "../../../config";

const TaskListPage: React.FC = () => {
    const { tasks, clearAuth, setTasks } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showLogout, setShowLogout] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (selectedTask) {
            const fetchComments = async () => {
                try {
                    const comments = await CommentService.fetchComments(selectedTask.id);
                    setComments(comments);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }
            };

            fetchComments();
        }
    }, [selectedTask]);

    const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === '' || task.status.status === statusFilter)
    );

    const handleLogout = () => {
        clearAuth();
        window.location.href = '/';
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedTask(null);
        setComments([]);
    };

    const handleRefresh = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Access token not found');
            const fetchedTasks = await TaskService.fetchTasks(accessToken);
            setTasks(fetchedTasks);
        } catch (error) {
            console.error('Error refreshing tasks:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <h2 className="text-2xl font-semibold mb-4">Task List</h2>
                <Box>
                    <IconButton onClick={() => setShowLogout(!showLogout)}>
                        <Logout />
                    </IconButton>
                    <Button variant="contained" color="primary" onClick={handleRefresh}>
                        Refresh
                    </Button>
                </Box>
            </Box>
            {showLogout && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            )}
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
                </select>
            </div>
            <div className="flex flex-col gap-6">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} onTap={handleTaskClick} />
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
            </div>
            <TaskDetailsDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                task={selectedTask}
                comments={comments}
            />
        </div>
    );
};

export default TaskListPage;