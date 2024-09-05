using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Data;
using TicketSystem.Api.Tickets.Shared;
using IMapper = AutoMapper.IMapper;

namespace TicketSystem.Api.Tickets.UpdateTicketStatus;

public class UpdateTicketStatusEndpoint : Endpoint<UpdateTicketStatusRequest, TicketResponse>
{
    private readonly TicketDbContext _context;
    private readonly IMapper _mapper;

    public UpdateTicketStatusEndpoint(TicketDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public override void Configure()
    {
        Patch("tickets/status/{id}");
        Roles(nameof(Role.User), nameof(Role.Admin));
    }

    public override async Task HandleAsync(UpdateTicketStatusRequest request, CancellationToken ct)
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

        var user = (User)HttpContext.Items["User"]!;
        if (user.Role != Role.Admin && ticket.AssignedUsers.All(u => u.Id != user.Id))
        {
            await SendForbiddenAsync(ct);
            return;
        }

        ticket.CurrentStatus = request.NewStatus;
        ticket.LastUpdated = DateTime.UtcNow;

        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync(ct);

        var response = _mapper.Map<TicketResponse>(ticket);
        await SendOkAsync(response, ct);
    }
}