// src/components/TaskDetailsCard.tsx
import React from 'react';
import { Task } from '@/types/types';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
const TaskDetailsCard: React.FC<{ task: Task }> = ({ task }) => {
  return (
      <div className="py-4 border-b rounded grid gap-5">
          <div className="grid ">
              <p className="text-sm text-gray-600">اسم المهمه :</p>
              <p className="font-medium">{task.name}</p>
          </div>
          <div className="grid ">
              <p className="text-sm text-gray-600">الوصف :</p>
              <p className="font-medium">{task.description}</p>
          </div>
          <div className="grid">
              <p className="text-sm text-gray-600">الحالة :</p>
              <p className="font-medium">{task.status.status}</p>
          </div>
          <div className="grid gap-2">
              <p className="text-sm text-gray-600">المنشئ :</p>
              <div className="flex items-center gap-1">
                  {task.creator.profilePicture ? (
                      <img
                          src={task.creator.profilePicture || ''}
                          alt={task.creator.username}
                          className="w-6 h-6 rounded-full"
                      />
                  ) : <AccountCircleOutlinedIcon class="w-6 h-6"/>}
                  <span className="ml-2">{task.creator.username}</span>
              </div>
          </div>
          <div className="mt-2">
              <p className="text-sm text-gray-600">المكلفين :</p>
              <div className="flex flex-wrap mt-1">
                  {task.assignees.map(assignee => (
                      <div className="flex items-center gap-1">
                          {assignee.profilePicture ? (
                              <img
                                  src={assignee.profilePicture || ''}
                                  alt={assignee.username}
                                  className="w-6 h-6 rounded-full"
                              />

                          ) : <AccountCircleOutlinedIcon class="w-6 h-6"/>}
                          <span className="ml-4">{assignee.username}</span>
                      </div>

                  ))}
              </div>
          </div>
      </div>
  );
};

export default TaskDetailsCard;