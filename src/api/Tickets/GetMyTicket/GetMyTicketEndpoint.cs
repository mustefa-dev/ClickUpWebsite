using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Tickets.Data;
using TicketSystem.Api.Tickets.Shared;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Tickets.GetMyTicket;

public class GetMyTicketEndpoint : EndpointWithoutRequest<List<TicketResponse>>
{
    private readonly TicketDbContext _context;
    private readonly AutoMapper.IMapper _mapper;

    public GetMyTicketEndpoint(AutoMapper.IMapper mapper, TicketDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public override void Configure()
    {
        Get("tickets/my");
        Roles(nameof(Role.User), nameof(Role.Admin));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var user = (User)HttpContext.Items["User"]!;
        var tickets = _context.Tickets
            .Where(t => t.AssignedUsers.Any(u => u.Id == user.Id));

        var response = _mapper.Map<List<TicketResponse>>(tickets);
        await SendAsync(response, StatusCodes.Status200OK, ct);
    }
}