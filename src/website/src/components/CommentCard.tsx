import React from 'react';
import { Card, CardHeader, CardContent, Avatar, Typography, Box } from '@mui/material';

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

const CommentCard: React.FC<{ comment: CommentData }> = ({ comment }) => {
    const { user, commentText, date, reactions, replyCount } = comment;

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
            <CardHeader
                avatar={
                    <Avatar
                        alt={user.username}
                        src={user.profilePicture || ''}
                        sx={{ backgroundColor: user.color }}
                    >
                        {!user.profilePicture && user.initials}
                    </Avatar>
                }
                title={user.username}
                subheader={new Date(parseInt(date)).toLocaleString('ar-EG')}
            />
            <CardContent>
                <Typography variant="body2">
                    {comment.comment.map((c) => c.text).join(' ')}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Box>
                        <Typography variant="caption">{`ردود (${replyCount || 0})`}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        {reactions.map((reaction, index) => (
                            <Typography key={index} variant="caption">{reaction}</Typography>
                        ))}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CommentCard;
