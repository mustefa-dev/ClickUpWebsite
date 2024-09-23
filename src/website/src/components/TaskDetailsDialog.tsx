import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';
import TaskDetailsCard from './TaskDetailsCard';
import CommentCard from './CommentCard';
import { Task } from '@/types/types';
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
  const [attachment, setAttachment] = useState<File | null>(null); // State for the attachment
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] }>({});

  if (!task) return null;

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (newCommentText.trim()) {
      try {
        const response = await CommentService.addComment(task.id, newCommentText, attachment); // Pass the attachment
        if (response.validationErrors) {
          setValidationErrors(response.validationErrors);
        } else {
          let updatedCommentText = newCommentText;
          if (attachment && response.attachmentUrl) {
            updatedCommentText += `\n\nAttachment: ${response.attachmentUrl}`;
          }
          onAddComment(updatedCommentText);
          setNewCommentText('');
          setAttachment(null);
          setValidationErrors({});
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
      <Dialog open={open} onClose={onClose} fullScreen>
        <DialogTitle  className="border-b flex px-6 py-4">
          كافة المعلومات
          <button className="text-primary    mr-auto" onClick={onClose}>رجوع</button>
        </DialogTitle>
        <DialogContent className="grid gap-10 mr-2">
          <TaskDetailsCard task={task} />
          <Box display="flex" flexDirection="column" gap={2}>
            <p className="text-xl mb-2">التعليقات</p>
            {/* Comment Input Field */}
            <Box display="flex" flexDirection="column" gap={2} mb={2}>
              <TextField
                  label="أضف تعليق"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  error={!!validationErrors.CommentText}
                  helperText={validationErrors.CommentText ? validationErrors.CommentText.join(', ') : ''}
              />
              <Button
                  variant="contained"
                  component="label"
              >
                إرفاق ملف
                <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                />
              </Button>
              {validationErrors.attachment && (
                  <Typography color="error">{validationErrors.attachment.join(', ')}</Typography>
              )}
              <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddComment}
                  disabled={!newCommentText.trim()} // Disable button if no text is entered
              >
                إضافة تعليق
              </Button>
            </Box>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))
            ) : (
                <Typography>لم يتم العثور على تعليقات.</Typography>
            )}
          </Box>

        </DialogContent>
      </Dialog>
  );
};

export default TaskDetailsDialog;