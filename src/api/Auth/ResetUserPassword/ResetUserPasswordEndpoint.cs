using System.Configuration;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Extensions;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Services;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Auth.ResetUserPassword;

public class ResetUserPasswordEndpoint : Endpoint<ResetUserPasswordRequest, UserResponse>
{
    private readonly TicketDbContext _context;
    private readonly AutoMapper.IMapper _mapper;
    private readonly IHasher _hasher;

    public ResetUserPasswordEndpoint(AutoMapper.IMapper mapper, TicketDbContext context, IHasher hasher)
    {
        _mapper = mapper;
        _context = context;
        _hasher = hasher;
    }

    public override void Configure()
    {
        Patch("users/{id}/resetpassword");
    }

    public override async Task HandleAsync(ResetUserPasswordRequest req, CancellationToken ct)
    {
        var id = Route<string>("id");
        var userId = ((User)HttpContext.Items["User"]!).Id;
        if (id != userId.ToString() && User.IsUser())
        {
            await SendForbiddenAsync(ct);
            return;
        }

        var user = await _context.Users
            .Where(x => x.Id == userId)
            .FirstOrDefaultAsync(ct);
        
        if (user == null)
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(UserErrors.UserNotFound));
            return;
        }

        if (!_hasher.Matches(req.OldPassword, user.Password))
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(UserErrors.OldPasswordIsInvalid));
            return;
        }

        user.Password = _hasher.Hash(req.NewPassword);
        _context.Users.Update(user);
        await _context.SaveChangesAsync(ct);
        var response = _mapper.Map<UserResponse>(user);
        await SendOkAsync(response, ct);
    }
}
