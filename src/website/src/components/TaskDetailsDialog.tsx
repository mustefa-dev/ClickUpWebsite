import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import TaskDetailsCard from './TaskDetailsCard';
import CommentCard from './CommentCard';
import { Task } from '@/types/types';
import { Box, Typography } from '@mui/material';

interface Comment {
  text: string;
}

interface User {
  id: number;
  username: string;
  initials: string | null;
  email: string | null;
  color: string;
  profilePicture: string | null;
}

interface CommentData {
  id: string;
  comment: Comment[];
  commentText: string | null;
  user: User;
  resolved: boolean;
  assignee: User | null;
  assignedBy: User | null;
  reactions: any[];
  date: string;
  replyCount: number | null;
}

interface TaskDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  comments: CommentData[];
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({ open, onClose, task, comments }) => {
  if (!task) return null;

  return (
      <Dialog open={open} onClose={onClose} fullScreen>
        <DialogTitle>تفاصيل المهمة</DialogTitle>
        <DialogContent>
          <TaskDetailsCard task={task} />
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            التعليقات
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))
            ) : (
                <Typography>لم يتم العثور على تعليقات.</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">إغلاق</Button>
        </DialogActions>
      </Dialog>
  );
};

export default TaskDetailsDialog;
