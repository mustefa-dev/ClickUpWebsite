using System.Security.Claims;
using FastEndpoints;
using TicketSystem.Api.Data;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Shared;

namespace TicketSystem.Api.Auth.FindMe;

public sealed class FindMeEndpoint(AutoMapper.IMapper mapper) : EndpointWithoutRequest<UserResponse>
{
    public override void Configure()
    {
        Get("users/me");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        User? user = (User?)HttpContext.Items["User"];
        var response = mapper.Map<UserResponse>(user);
        await SendOkAsync(response, ct);
        // var userId = businessUserInfo.UserId;
        // var user = await context.Users.Where(x => x.Id == userId).FirstOrDefaultAsync(ct);
        // if (user == null || user.DeletedAt.HasValue)
        // {
        //     await SendForbiddenAsync(ct);
        //     return;
        // }
        // var response = mapper.Map<UserResponse>(user);
        // await SendOkAsync(response, ct);
    }
}

