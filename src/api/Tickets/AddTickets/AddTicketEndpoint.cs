using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Tickets.Data;
using TicketSystem.Api.Tickets.Shared;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using TicketSystem.Api.OneSignal;

namespace TicketSystem.Api.Tickets.AddTickets;

public class AddTicketEndpoint : Endpoint<AddTicketRequest, TicketResponse>
{
    private readonly TicketDbContext _context;
    private readonly AutoMapper.IMapper _mapper;
    private readonly ILogger<AddTicketEndpoint> _logger;
    private readonly OneSignalNotificationService _oneSignalNotificationService;

    public AddTicketEndpoint(AutoMapper.IMapper mapper, TicketDbContext context, ILogger<AddTicketEndpoint> logger, OneSignalNotificationService oneSignalNotificationService)
    {
        _mapper = mapper;
        _context = context;
        _logger = logger;
        _oneSignalNotificationService = oneSignalNotificationService;
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

        var assignedUserIds = request.AssignedUserIds;

        var result = await _context.Tickets.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);

        if (assignedUserIds != null && assignedUserIds.Any())
        {
            var assignedUsers = await _context.Users
                .Where(u => assignedUserIds.Contains(u.Id))
                .ToListAsync(ct);

            entity.AssignedUsers ??= new List<User>();
            entity.AssignedUsers.AddRange(assignedUsers);
            await _context.SaveChangesAsync(ct);

            _logger.LogInformation("Assigned users: {AssignedUsers}", string.Join(", ", assignedUsers.Select(u => u.Username)));

            var response = _mapper.Map<TicketResponse>(entity);

            await _oneSignalNotificationService.SendNotificationToUsersByUlidAsync(
                ticketTitle: entity.TicketTitle,
                ticketNumber: entity.TicketNumber.ToString(),
                userUlids: assignedUserIds
            );

            await SendAsync(response, StatusCodes.Status201Created, ct);
        }
    }


}
