namespace TicketSystem.Api.Comments.Shared;

public class AddCommentRequest
{
    public string Content { get; set; } = string.Empty;
    public Ulid TicketId { get; set; }
    public string? ImageUrl { get; set; }
    public string? Lat { get; set; }
    public string? Lng { get; set; }
}

