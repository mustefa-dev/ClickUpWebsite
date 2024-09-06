using AutoMapper;
using TicketSystem.Api.Tickets.AddTickets;
using TicketSystem.Api.Tickets.Shared;

namespace TicketSystem.Api.Tickets.Data;

public class TicketProfile : Profile
{
    public TicketProfile()
    {
        CreateMap<Ticket, TicketResponse>()
            .ForMember(dest => dest.CreatorUsername, opt => opt.MapFrom(src => src.Creator.Username))
            .ForMember(dest => dest.AssignedUsernames, opt => opt.MapFrom(src => src.AssignedUsers.Select(u => u.Username)));

        CreateMap<AddTicketRequest, Ticket>()
            .ForMember(dest => dest.AssignedUserIds, opt => opt.MapFrom(src => src.AssignedUserIds));
    }
}