using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Tickets.Data;
using TicketSystem.Api.Tickets.Shared;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace TicketSystem.Api.Tickets.AddTickets;

public class AddTicketEndpoint : Endpoint<AddTicketRequest, TicketResponse>
{
    private readonly TicketDbContext _context;
    private readonly AutoMapper.IMapper _mapper;
    private readonly WebSocketServerConnectionManager _webSocketManager;
    private readonly ILogger<AddTicketEndpoint> _logger;

    public AddTicketEndpoint(AutoMapper.IMapper mapper, TicketDbContext context, WebSocketServerConnectionManager webSocketManager, ILogger<AddTicketEndpoint> logger)
    {
        _mapper = mapper;
        _context = context;
        _webSocketManager = webSocketManager;
        _logger = logger;
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
        
        // Send notification to the assignee
        var notification = JsonSerializer.Serialize(new { title = "New Ticket Assigned", message = $"You have been assigned a new ticket: {request.TicketTitle}" });
        await _webSocketManager.BroadcastAsync(notification, ct);
        _logger.LogInformation("Notification sent to assignee: {Assignee}", request.AssignedUserId);

        await SendAsync(response, StatusCodes.Status201Created, ct);
    }
}