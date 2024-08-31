using Microsoft.AspNetCore.SignalR;
using TicketSystem.Api.Tickets.Data;

namespace TicketSystem.Api.Hubs;

public class NotificationsHub : Hub
{
    private readonly TicketAssignedEventHandler _ticketAssignedEventHandler;

    public NotificationsHub(TicketAssignedEventHandler ticketAssignedEventHandler)
    {
        _ticketAssignedEventHandler = ticketAssignedEventHandler;
    }

    public async Task TicketAssigned(TicketAssignedEvent ticketAssignedEvent)
    {
        await _ticketAssignedEventHandler.Handle(ticketAssignedEvent, CancellationToken.None);
    }
}