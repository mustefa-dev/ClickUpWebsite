using AutoMapper;
using TicketSystem.Api.Tickets.AddTickets;
using TicketSystem.Api.Tickets.Shared;

namespace TicketSystem.Api.Tickets.Data;

public class TicketProfile  :  Profile
{
    public TicketProfile()
    {
        CreateMap<Ticket, TicketResponse>();
        CreateMap<AddTicketRequest, Ticket>();
        // CreateMap<UpdateTicketRequest, Ticket>();
    }
}