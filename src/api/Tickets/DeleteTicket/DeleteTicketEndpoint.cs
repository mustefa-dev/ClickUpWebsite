using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Tickets.DeleteTicket;

public class DeleteTicketEndpoint : EndpointWithoutRequest
{
    private readonly TicketDbContext _context;

    public DeleteTicketEndpoint(TicketDbContext context)
    {
        _context = context;
    }

    public override void Configure()
    {
        Delete("tickets/{id}");
        Roles(nameof(Role.Admin));
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
            .Where(t => t.Id == ticketId)
            .FirstOrDefaultAsync(ct);

        if (ticket is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var user = (User)HttpContext.Items["User"]!;
        if (user.Role != Role.Admin && ticket.AssignedUserId != user.Id)
        {
            await SendForbiddenAsync(ct);
            return;
        }

        ticket.IsDeleted = true;
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync(ct);

        await SendOkAsync(ct);
    }
}