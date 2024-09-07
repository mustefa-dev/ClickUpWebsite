namespace TicketSystem.Api.Tickets.Shared;

public class NotificationResponse
{
    public string TicketTitle { get; set; }
    public string TicketNumber { get; set; }
    public List<string> Assignees { get; set; }
}
