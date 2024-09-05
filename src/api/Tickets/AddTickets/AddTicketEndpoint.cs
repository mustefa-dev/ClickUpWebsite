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
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace TicketSystem.Api.Tickets.AddTickets;
    public class AddTicketEndpoint : Endpoint<AddTicketRequest, TicketResponse>
    {
        private readonly TicketDbContext _context;
        private readonly AutoMapper.IMapper _mapper;
        private readonly ILogger<AddTicketEndpoint> _logger;
        private readonly IHubContext<TicketHub> _hubContext;

        public AddTicketEndpoint(AutoMapper.IMapper mapper, TicketDbContext context, ILogger<AddTicketEndpoint> logger, IHubContext<TicketHub> hubContext)
        {
            _mapper = mapper;
            _context = context;
            _logger = logger;
            _hubContext = hubContext;
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

            var assignedUserIds = entity.AssignedUserIds;

            var result = await _context.Tickets.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);
            var response = _mapper.Map<TicketResponse>(entity);

            if (assignedUserIds != null)
            {
                foreach (var assignedUserId in assignedUserIds)
                {
                    await _hubContext.Clients.Group(assignedUserId.ToString()).SendAsync("NewTicket", result.Entity);
                }
            }

            await SendAsync(response, StatusCodes.Status201Created, ct);
        }
    }


