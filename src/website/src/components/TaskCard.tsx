import React, { useState } from 'react';
import { Task } from '@/types/types';
import { useAuthStore } from '@/utils/authStore';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, MenuItem } from "@mui/material";
import Card from '@mui/material/Card';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

type TaskCardProps = {
    task: Task;
    onTap: (task: Task) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onTap }) => {
    const { updateTaskStatus } = useAuthStore();
    const [changeStatus, setChangeStatus] = useState('');

    const handleStatusChange = (event: SelectChangeEvent<unknown>, child: React.ReactNode) => {
        const newStatus = event.target.value as string;
        updateTaskStatus(task.id, newStatus);
        setChangeStatus(newStatus);
        event.stopPropagation();
    };

    return (
        <Card onClick={() => onTap(task)} variant={"none"} className={"grid gap-4 p-6"}>
            <div className="grid gap-2">
                <span className="text-sm">{task.name}</span>
                <div className="flex flex-wrap">
                    {task.tags?.map((tag, idx) => (
                        <div key={idx} className="flex-1">
                        <span
                            className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">
                            {tag.name}
                        </span>
                        </div>
                    )) || <span>لا توجد علامات</span>}
                </div>
            </div>
            <Box sx={{minWidth: 300}}>
                <FormControl sx={{ m: 1, width: 300 }} size="small">
                    <InputLabel id="demo-simple-select-">فلترة</InputLabel>
                    <Select
                        value={['لم يبدأ', 'قيد التقدم', 'مكتمل'].includes(task.status.status) ? task.status.status : changeStatus}
                        label="All Statuses"
                        onChange={handleStatusChange}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MenuItem value={"لم يبدأ"}>لم يبدأ</MenuItem>
                        <MenuItem value={"قيد التقدم"}>قيد التقدم</MenuItem>
                        <MenuItem value={"مكتمل"}>مكتمل</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <div className="flex items-center gap-1">
                {task.creator.profilePicture ? (
                    <img
                        src={task.creator.profilePicture || ''}
                        alt={task.creator.username}
                        className="w-8 h-8 rounded-full"
                    />
                ) : <AccountCircleOutlinedIcon className="w-8 h-8" />}

                {!task.creator.profilePicture && (
                    <span className="ml-1 text-sm">{task.creator.username}</span>
                )}
            </div>
        </Card>
    );
};

export default TaskCard;