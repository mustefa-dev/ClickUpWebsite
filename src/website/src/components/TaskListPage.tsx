import React, { useState, useEffect, useRef } from 'react';
import TaskService from '@/services/taskService';
import CommentService from '@/services/commentService';
import TaskCard from '@/components/TaskCard';
import TaskDetailsDialog from '@/components/TaskDetailsDialog';
import { useAuthStore } from '@/utils/authStore';
import { Button, Box, Menu, MenuItem } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const TaskListPage: React.FC = () => {
    const { tasks, clearAuth, setTasks } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setAnchorEl(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

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

    const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccountClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="mx-auto p-8 grid gap-4">
            <div className="flex bg-white p-4 justify-between items-center">
                <p className="text-sm sm:text-lg font-semibold ">قائمة المهام</p>
                <div>
                    <Button variant="text" onClick={handleAccountClick}>
                        الحساب
                    </Button>
                    <div ref={menuRef}>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleAccountClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleLogout}> <ExitToAppIcon  /> تسجيل الخروج  </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
            <div className=" mt-4 sm:mt-10 flex gap-4 flex-wrap">
                <TextField
                    size={"small"}
                    variant="outlined"
                    value={searchTerm}
                    placeholder="بحث..."
                    onChange={e => setSearchTerm(e.target.value)}
                    className="border w-full sm:w-[300px] p-2 rounded"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box                             className=" w-full sm:w-[300px] "
                >
                    <FormControl size={"small"} fullWidth>
                        <InputLabel id="demo-simple-select-">فلترة</InputLabel>
                        <Select
                            value={statusFilter}
                            label="جميع الحالات"
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value={""}>جميع الحالات</MenuItem>
                            <MenuItem value={"open"}>مفتوح</MenuItem>
                            <MenuItem value={"in-progress"}>قيد التنفيذ</MenuItem>
                            <MenuItem value={"completed"}>مكتمل</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <div className="flex flex-col gap-6">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} onTap={handleTaskClick} />
                    ))
                ) : (
                    <p>لم يتم العثور على مهام.</p>
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