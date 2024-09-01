namespace TicketSystem.Api.Comments.Data.Shared;

public class CommentResponse
{
    public Ulid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public Ulid CreatorId { get; set; }
    public Ulid TicketId { get; set; }
    public DateTime CreatedDate { get; set; }
    public string? ImageUrl { get; set; }
    public string? Lat { get; set; }
    public string? Lan { get; set; }
}