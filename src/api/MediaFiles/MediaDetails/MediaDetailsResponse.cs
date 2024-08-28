using TicketSystem.Api.MediaFiles.Shared;

namespace TicketSystem.Api.MediaFiles.MediaDetails;

public class MediaDetailsResponse
{
    public Ulid FileId { get; set; } 
    public string Filename { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public FileType FileType { get; set; } 
    public string FileExtension { get; set; } = string.Empty;
    public required long FileSize { get; init; }
}
