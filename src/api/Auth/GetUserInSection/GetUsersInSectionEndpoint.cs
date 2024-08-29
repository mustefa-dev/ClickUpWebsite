// GetUsersInSectionEndpoint.cs
using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Data;
using TicketSystem.Api.Section.Shared;
using IMapper = AutoMapper.IMapper;

namespace TicketSystem.Api.Section.GetUsersInSection;

public class GetUsersInSectionEndpoint : EndpointWithoutRequest<List<UserResponse>>
{
    private readonly TicketDbContext _context;
    private readonly IMapper _mapper;

    public GetUsersInSectionEndpoint(TicketDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public override void Configure()
    {
        Get("sections/{id}/users");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var sectionId = Route<Ulid>("id");
        var users = await _context.Users
            .Where(u => u.SectionId == sectionId)
            .ToListAsync(ct);

        var response = _mapper.Map<List<UserResponse>>(users);
        await SendOkAsync(response, ct);
    }
}