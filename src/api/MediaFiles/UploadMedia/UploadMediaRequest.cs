namespace TicketSystem.Api.MediaFiles.UploadMedia;

public class UploadMediaRequest
{
    public required List<IFormFile> Files { get; set; }
}
