using FastEndpoints;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Auth.DeleteUser;

public class DeleteUserEndpoint : EndpointWithoutRequest
{
    private readonly BuildifyDbContext _context;

    public DeleteUserEndpoint(BuildifyDbContext context)
    {
        _context = context;
    }

    public override void Configure()
    {
        Delete("users/{id}");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var id = Route<string>("id");
        var currentUser = (User)HttpContext.Items["User"]!;
        if (!Ulid.TryParse(id, out var userId))
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(UserErrors.UserIdInvalid));
            return;
        }

        var isAdmin = User.IsInRole(nameof(Role.Admin));
        if (currentUser.Id != userId && !isAdmin)
        {
            await SendForbiddenAsync(ct);
            return;
        }

        var user = await _context.Users.FindAsync([userId], ct);
        if (user == null)
        {
            await SendNoContentAsync(ct);
            return;
        }

        if (user.Role == Role.Admin && !isAdmin)
        {
            await SendForbiddenAsync(ct);
            return;
        }

        user.IsDeleted = true;
        _context.Users.Update(user);

        await _context.SaveChangesAsync(ct);
        await SendNoContentAsync(ct);
    }
}

