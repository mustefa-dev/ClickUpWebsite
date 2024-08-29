using AutoMapper.QueryableExtensions;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Auth.Login;
using TicketSystem.Api.Auth.Services;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Auth.RefreshToken;

public sealed class RefreshTokenEndpoint(TicketDbContext context, JwtService jwtService, AutoMapper.IMapper mapper) : Endpoint<RefreshTokensRequest, LoginResponse>
{
    public override void Configure()
    {
        Post("auth/refresh");
        AllowAnonymous(Http.POST);
    }
    public override async Task HandleAsync(RefreshTokensRequest req, CancellationToken ct)
    {
        try
        {
            var id = jwtService.GetUserId(req.RefreshToken);
            if (!id.HasValue)
            {
                await SendResultAsync(Results.Extensions.FriendlyProblem(AuthErrors.InvalidRefreshToken));
                return;
            }

            var userResponse = await context.Users
                .Where(x => x.Id == id)
                .ProjectTo<UserResponse>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(ct);

            if (userResponse is null)
            {
                await SendResultAsync(Results.Extensions.FriendlyProblem(AuthErrors.InvalidRefreshToken));
                return;
            }

            var response = jwtService.GenerateTokens(userResponse);
            await SendOkAsync(response, ct);
        }
        catch (Exception)
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(AuthErrors.InvalidRefreshToken));
        }
    }
}