// src/components/TaskCard.tsx
import React from 'react';
import { Task } from '@/types/types';
import { useAuthStore } from '@/utils/authStore';

type TaskCardProps = {
    task: Task;
    onTap: (task: Task) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onTap }) => {
    const { updateTaskStatus } = useAuthStore();

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        updateTaskStatus(task.id, newStatus);
    };

    const renderContent = (index: number) => {
        switch (index) {
            case 0:
                return (
                    <div className="flex flex-wrap">
                        {task.tags?.map((tag, idx) => (
                            <div key={idx} className="flex-1">
                                <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">
                                    {tag.name}
                                </span>
                            </div>
                        )) || <span>لا توجد علامات</span>}
                    </div>
                );

            case 2:
                return (
                    <div className="text-right">
                        <span className="text-sm font-medium">{task.name}</span>
                    </div>
                );
            case 3:
                return (
                    <select
                        value={['لم يبدأ', 'قيد التقدم', 'مكتمل'].includes(task.status.status) ? task.status.status : ''}
                        onChange={handleStatusChange}
                        className="w-full p-1 border rounded text-sm"
                    >
                        <option value="" disabled>اختر الحالة</option>
                        <option value="لم يبدأ">لم يبدأ</option>
                        <option value="قيد التقدم">قيد التقدم</option>
                        <option value="مكتمل">مكتمل</option>
                    </select>
                );
            case 6:
                return (
                    <div className="flex items-center">
                        <img
                            src={task.creator.profilePicture || ''}
                            alt={task.creator.username}
                            className="w-8 h-8 rounded-full"
                        />
                        {!task.creator.profilePicture && (
                            <span className="ml-1 text-sm">{task.creator.username[0]}</span>
                        )}
                    </div>
                );
            case 8:
                return (
                    <div className="text-center">
                        <span className="text-sm">{task.name}</span>
                    </div>
                );
            default:
                return <div className="hidden"></div>;
        }
    };

    return (
        <div onClick={() => onTap(task)} className="m-2 p-2 border rounded shadow-md">
            <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="col-span-1">
                        {renderContent(index)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskCard;