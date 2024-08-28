using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Extensions;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Services;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;
using IMapper = AutoMapper.IMapper;
namespace TicketSystem.Api.Auth.AddUser;
public class AddUserEndpoint(BuildifyDbContext context, IMapper mapper, IHasher hasher) : Endpoint<AddUserRequest, UserResponse>
{
    public override void Configure()
    {
        Post("users");
        Roles(nameof(Role.Admin));
    }

    public override async Task HandleAsync(AddUserRequest req, CancellationToken ct)
    {
        if (req.Role != Role.User && User.IsUser())
        {
            await SendForbiddenAsync(ct);
            return;
        }

        var user = mapper.Map<User>(req);
        if (await context.Users.AnyAsync(u => u.Username == user.Username, ct))
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(UserErrors.UsernameAlreadyExists));
            return;
        }
        user.Id = Ulid.NewUlid();
        user.Password = hasher.Hash(user.Password);
        await context.Users.AddAsync(user, ct);
        await context.SaveChangesAsync(ct);
        var response = mapper.Map<UserResponse>(user);
        await SendAsync(response, (int)StatusCode.Created, ct);
    }
}
