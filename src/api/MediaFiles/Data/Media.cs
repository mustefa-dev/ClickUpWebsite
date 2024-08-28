
namespace TicketSystem.Api.MediaFiles.Data;

public class Media
{
    public required Ulid Id { get; set; }
    public required string Name { get; init; }
    public required string Extension { get; init; }
    public required string Path { get; init; }
    public required long Size { get; init; }
    public Ulid? UploaderId { get; init; }
}