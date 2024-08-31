using Microsoft.AspNetCore.SignalR;
using TicketSystem.Api.Hubs;
using TicketSystem.Api.Tickets.Data;

public class TicketAssignedEventHandler
{
    private readonly IHubContext<NotificationsHub> _hubContext;

    public TicketAssignedEventHandler(IHubContext<NotificationsHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task Handle(TicketAssignedEvent ticketAssignedEvent, CancellationToken ct)
    {
        var notification = new
        {
            title = "New Ticket Assigned",
            message = $"You have been assigned a new ticket: {ticketAssignedEvent.TicketTitle}"
        };

        await _hubContext.Clients.User(ticketAssignedEvent.AssignedUserId).SendAsync("ReceiveNotification", notification, ct);
    }
}