using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Tickets.Data;
using TicketSystem.Api.Tickets.Shared;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Tickets.AddTickets;

public class AddTicketEndpoint : Endpoint<AddTicketRequest, TicketResponse>
{
    private readonly TicketDbContext _context;
    private readonly AutoMapper.IMapper _mapper;

    public AddTicketEndpoint(AutoMapper.IMapper mapper, TicketDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public override void Configure()
    {
        Post("tickets");
        Roles(nameof(Role.Admin));
    }

    public override async Task HandleAsync(AddTicketRequest request, CancellationToken ct)
    {
        var user = (User)HttpContext.Items["User"]!;
        var entity = _mapper.Map<Ticket>(request);
        entity.Id = Ulid.NewUlid();
        entity.IsDeleted = false;
        entity.CreatorId = user.Id;
        entity.TicketNumber = await TicketIdGenerator.GenerateTicketId(_context);
        entity.CurrentStatus = Ticket.TicketStatus.InProgress;
        
        await _context.Tickets.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);
        var response = _mapper.Map<TicketResponse>(entity);
        await SendAsync(response, StatusCodes.Status201Created, ct);
    }
}