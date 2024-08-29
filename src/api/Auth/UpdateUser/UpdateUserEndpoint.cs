using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Services;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Auth.UpdateUser;

public class UpdateUserEndpoint : Endpoint<UpdateUserRequest, UserResponse>
{
    private readonly TicketDbContext _context;
    private readonly AutoMapper.IMapper _mapper;
    private readonly IHasher _hasher;

    public UpdateUserEndpoint(TicketDbContext context, AutoMapper.IMapper mapper, IHasher hasher)
    {
        _context = context;
        _mapper = mapper;
        _hasher = hasher;
    }

    public override void Configure()
    {
        Patch("users/{id}");
        Roles(nameof(Role.Admin));
    }

    public override async Task HandleAsync(UpdateUserRequest request, CancellationToken ct)
    {
        var id = Route<string>("id");
        if (!Ulid.TryParse(id, out var userId))
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(new Error("UserIdNotValid", "userId not valid")));
            return;
        }


        var entity = await _context.Users
                                .AsNoTracking()
                                .Where(x => x.Id == userId)
                                .FirstOrDefaultAsync(ct);

        if (entity is null)
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(new Error("UserDoesNotExists", "user with this id does not exists", StatusCodes.Status404NotFound)));
            return;
        }

        var user = (User)HttpContext.Items["User"]!;

        if (user.Role != Role.Admin && user.Id != entity.Id)
        {
            await SendForbiddenAsync(ct);
            return;
        }


        if (!string.IsNullOrEmpty(request.Username))
        {
            if (request.Username != entity.Username)
            {
                if (await _context.Users.AnyAsync(x => x.Username == request.Username))
                {
                    await SendResultAsync(Results.Extensions.FriendlyProblem(new Error("UsernameAlreadyTaken", "username already taken")));
                    return;
                }
            }
        }


        _mapper.Map(request, entity);

        if (!string.IsNullOrEmpty(request.Password))
        {
            entity.Password = _hasher.Hash(user.Password);
        }

        _context.Users.Update(entity);
        await _context.SaveChangesAsync(ct);
        var response = _mapper.Map<UserResponse>(entity);
        await SendOkAsync(response, ct);
    }
}
