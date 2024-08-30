using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Data;
using TicketSystem.Api.Tickets.Shared;
using IMapper = AutoMapper.IMapper;

namespace TicketSystem.Api.Tickets.FindTicket;

public class FindTicketEndpoint : EndpointWithoutRequest<TicketResponse>
{
    private readonly TicketDbContext _context;
    private readonly IMapper _mapper;

    public FindTicketEndpoint(TicketDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public override void Configure()
    {
        Get("tickets/{id}");
        Roles(nameof(Role.User), nameof(Role.Admin));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var id = Route<string>("id");
        if (!Ulid.TryParse(id, out var ticketId))
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(new Error("IdNotValid", "Ticket id is not valid")));
            return;
        }

        var ticket = await _context.Tickets
            .AsNoTracking()
            .Where(t => t.Id == ticketId)
            .FirstOrDefaultAsync(ct);

        if (ticket is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var response = _mapper.Map<TicketResponse>(ticket);
        await SendOkAsync(response, ct);
    }
}