using TicketSystem.Api.Common;
using TicketSystem.Api.Tickets.Data;

namespace TicketSystem.Api.Tickets.GetTickets;

public class GetTicketsQuery : BaseListQuery
{
    public Ticket.TicketStatus? CurrentStatus { get; set; }
}