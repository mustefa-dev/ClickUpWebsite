using TicketSystem.Api.Common.Extensions;
using FastEndpoints;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Auth.FindUser;

public class FindUserEndpoint : EndpointWithoutRequest<UserResponse>
{
    private readonly BuildifyDbContext _context;
    private readonly AutoMapper.IMapper _mapper;

    public FindUserEndpoint(BuildifyDbContext context, AutoMapper.IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public override void Configure()
    {
        Get("users/{id}");
        Roles(nameof(Role.Admin));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var id = Route<string>("id");
        if (!Ulid.TryParse(id, out var userId))
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(new Error("IdNotValid", "company id not valid")));
            return;
        }

        var user = await _context.Users.FindAsync(userId);
        if (user is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var response = _mapper.Map<UserResponse>(user);
        await SendOkAsync(response, ct);
    }
}
