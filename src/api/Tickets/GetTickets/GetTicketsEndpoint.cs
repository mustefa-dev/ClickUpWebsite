using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Tickets.Data;
using TicketSystem.Api.Tickets.Shared;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Tickets.GetTickets;

public class GetTicketsEndpoint : Endpoint<GetTicketsQuery, List<TicketResponse>>
{
    private readonly TicketDbContext _context;
    private readonly AutoMapper.IMapper _mapper;

    public GetTicketsEndpoint(AutoMapper.IMapper mapper, TicketDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public override void Configure()
    {
        Get("tickets");
        Roles(nameof(Role.Admin));
    }

    public override async Task HandleAsync(GetTicketsQuery query, CancellationToken ct)
    {
        var ticketsQuery = _context.Tickets
            .Where(t => !t.IsDeleted)
            .Include(t => t.Creator)
            .Include(t => t.AssignedUsers)
            .AsQueryable();

        if (query.CurrentStatus.HasValue)
        {
            ticketsQuery = ticketsQuery.Where(t => t.CurrentStatus == query.CurrentStatus.Value);
        }

        var tickets = await ticketsQuery.ToListAsync(ct);
        var response = _mapper.Map<List<TicketResponse>>(tickets);
        await SendAsync(response, StatusCodes.Status200OK, ct);
    }

}