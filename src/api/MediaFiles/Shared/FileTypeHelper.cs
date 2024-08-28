namespace TicketSystem.Api.MediaFiles.Shared;


public enum FileType
{
    Image,
    Video,
    Audio,
    Document,
    Archive,
    Unknown
}

public class FileTypeHelper
{
    private static readonly Dictionary<string, FileType> FileTypeMappings = new Dictionary<string, FileType>(StringComparer.OrdinalIgnoreCase)
    {
        // Image file extensions
        { ".jpg", FileType.Image },
        { ".jpeg", FileType.Image },
        { ".png", FileType.Image },
        { ".gif", FileType.Image },
        { ".bmp", FileType.Image },
        { ".tiff", FileType.Image },
        { ".ico", FileType.Image },
        { ".svg", FileType.Image},
        { ".webp", FileType.Image },
        
        // Video file extensions
        { ".mp4", FileType.Video },
        { ".avi", FileType.Video },
        { ".mov", FileType.Video },
        { ".mkv", FileType.Video },
        { ".wmv", FileType.Video },
        { ".flv", FileType.Video },
        { ".webm", FileType.Video },
        
        // Audio file extensions
        { ".mp3", FileType.Audio },
        { ".wav", FileType.Audio },
        { ".aac", FileType.Audio },
        { ".ogg", FileType.Audio },
        { ".flac", FileType.Audio },
        
        // Document file extensions
        { ".pdf", FileType.Document },
        { ".doc", FileType.Document },
        { ".docx", FileType.Document },
        { ".xls", FileType.Document },
        { ".xlsx", FileType.Document },
        { ".ppt", FileType.Document },
        { ".pptx", FileType.Document },
        { ".txt", FileType.Document },
        
        // Archive file extensions
        { ".zip", FileType.Archive },
        { ".rar", FileType.Archive },
        { ".7z", FileType.Archive },
        { ".tar", FileType.Archive },
        { ".gz", FileType.Archive },

    };

    public static FileType GetFileType(string fileExtension)
    {
        if (string.IsNullOrWhiteSpace(fileExtension))
        {
            return FileType.Unknown;
        }

        if (!fileExtension.StartsWith("."))
        {
            fileExtension = "." + fileExtension;
        }

        return FileTypeMappings.TryGetValue(fileExtension, out var fileType) ? fileType : FileType.Unknown;
    }
}