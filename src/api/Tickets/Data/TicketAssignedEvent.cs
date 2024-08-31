namespace TicketSystem.Api.Tickets.Data;

public class TicketAssignedEvent
{
    public string AssignedUserId { get; set; }
    public string TicketTitle { get; set; }
}