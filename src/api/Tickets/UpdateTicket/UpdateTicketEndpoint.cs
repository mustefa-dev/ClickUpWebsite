using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Data;
using TicketSystem.Api.Tickets.Shared;
using IMapper = AutoMapper.IMapper;

namespace TicketSystem.Api.Tickets.UpdateTicket;

public class UpdateTicketEndpoint : Endpoint<UpdateTicketRequest, TicketResponse>
{
    private readonly TicketDbContext _context;
    private readonly IMapper _mapper;

    public UpdateTicketEndpoint(TicketDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public override void Configure()
    {
        Patch("tickets/{id}");
        Roles(nameof(Role.User), nameof(Role.Admin));
    }

    public override async Task HandleAsync(UpdateTicketRequest request, CancellationToken ct)
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
        if (user.Role != Role.Admin && ticket.AssignedUserId != user.Id)
        {
            await SendForbiddenAsync(ct);
            return;
        }

        if (!string.IsNullOrWhiteSpace(request.TicketTitle))
        {
            ticket.TicketTitle = request.TicketTitle;
        }

        if (request.ImageGallery != null && request.ImageGallery.Any())
        {
            ticket.ImageGallery = request.ImageGallery;
        }

        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync(ct);

        var response = _mapper.Map<TicketResponse>(ticket);
        await SendOkAsync(response, ct);
    }
}