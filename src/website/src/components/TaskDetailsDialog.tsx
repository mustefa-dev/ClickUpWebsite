import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import TaskDetailsCard from './TaskDetailsCard';
import CommentCard from './CommentCard';
import { Task } from '@/types/types';
import { Box, Typography } from '@mui/material';
import CommentService from '@/services/commentService';

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
  onAddComment: (newCommentText: string) => void; // callback for comment submission
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({ open, onClose, task, comments, onAddComment }) => {
  const [newCommentText, setNewCommentText] = useState('');

  if (!task) return null;

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (newCommentText.trim()) {
      try {
        await CommentService.addComment(task.id, newCommentText);
        onAddComment(newCommentText);
        setNewCommentText('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

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

          {/* Comment Input Field */}
          <Box display="flex" flexDirection="column" gap={2} mt={4}>
            <TextField
                label="أضف تعليق"
                variant="outlined"
                fullWidth
                multiline
                minRows={3}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddComment}
                disabled={!newCommentText.trim()} // Disable button if no text is entered
            >
              إضافة تعليق
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">إغلاق</Button>
        </DialogActions>
      </Dialog>
  );
};

export default TaskDetailsDialog;