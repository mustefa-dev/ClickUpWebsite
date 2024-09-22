// src/components/TaskDetailsCard.tsx
import React from 'react';
import { Task } from '@/types/types';

const TaskDetailsCard: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Status:</strong> {task.status.status}</p>
      <div className="flex items-center mt-2">
        <img
          src={task.creator.profilePicture || ''}
          alt={task.creator.username}
          className="w-8 h-8 rounded-full"
        />
        <span className="ml-2">{task.creator.username}</span>
      </div>
      <div className="mt-2">
        <strong>Assignees:</strong>
        <div className="flex flex-wrap mt-1">
          {task.assignees.map(assignee => (
            <div key={assignee.id} className="flex items-center mr-2 mb-2">
              <img
                src={assignee.profilePicture || ''}
                alt={assignee.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="ml-2">{assignee.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsCard;