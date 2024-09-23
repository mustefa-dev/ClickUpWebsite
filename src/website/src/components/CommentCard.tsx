import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

// List of image file extensions
const imageExtensions = [
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'tif', 'ico', 'heic', 'heif', 'jfif', 'pjpeg', 'pjp',
    'avif', 'apng', 'raw', 'cr2', 'nef', 'orf', 'sr2', 'arw', 'dng', 'rw2', 'raf', 'eps', 'ai', 'indd', 'psd', 'cpt',
    'exr', 'hdr', 'jxr', 'wdp', 'qoi', 'pict', 'dds', 'emf', 'wmf', 'xpm', 'tga', 'vst', 'pic'
];

// Utility function to detect URLs and image extensions
const parseCommentText = (text: string) => {
    const parts = text.split(' ');

    return parts.map((part, index) => {
        // Check if the part contains a URL
        let url = part;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url; // Add https if missing
        }

        try {
            // Check if the part ends with an image extension and it's a valid URL
            const fileExtension = url.split('.').pop()?.toLowerCase();
            const isImage = fileExtension && imageExtensions.includes(fileExtension);
            const isValidUrl = new URL(url); // This will throw if URL is invalid

            if (isImage) {
                return (
                    <img
                        key={index}
                        src={url}
                        alt="comment image"
                        className="inline-block w-20 h-20 object-cover rounded-md"
                    />
                );
            }
        } catch (e) {
            // Ignore if it's not a valid URL
        }

        // Return a clickable link if it's a valid URL
        if (url.startsWith('https://') || url.startsWith('http://')) {
            return (
                <a href={url} key={index} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {part}
                </a>
            );
        }

        // Otherwise, return the part as plain text
        return <span key={index}>{part} </span>;
    });
};

const CommentCard: React.FC<{ comment: CommentData }> = ({ comment }) => {
    const { user, commentText, date, reactions, replyCount } = comment;

    return (
        <div className="grid mb-8 ">
            <div className="grid gap-2">
                <div className="flex items-top gap-2">
                    {user.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-8 h-8 object-cover rounded-full"
                        />
                    ) : (
                        <AccountCircleIcon className="w-8 h-8" />
                    )}
                    <div>
                        <p className="font-medium text-sm">{user.username}</p>
                        <div className="text-sm text-gray-600">
                            {comment.comment.map((c) => parseCommentText(c.text))}
                        </div>
                    </div>
                </div>
                <div className="flex mr-8 gap-4 items-center">
                    <div className="text-sm text-gray-500">
                        ردود ({replyCount || 0})
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date(parseInt(date)).toLocaleString('ar-EG')}
                    </div>
                    <div className="flex gap-2">
                        {reactions.map((reaction, index) => (
                            <span key={index} className="text-sm text-gray-500">{reaction}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
