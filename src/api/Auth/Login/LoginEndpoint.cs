using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Services;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Auth.Login;

public sealed class LoginEndpoint(BuildifyDbContext context, IHasher hasher,AutoMapper.IMapper mapper, JwtService jwtService) : Endpoint<LoginRequest, LoginResponse>
{
    public override void Configure()
    {
        Post("auth/login");
        AllowAnonymous(Http.POST);
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        try
        {
            User? user;
            var result = await GetLocalUserAsync(req, ct);
            if (result.IsFailure)
            {
                await SendResultAsync(Results.Extensions.FriendlyProblem(result.Error));
                return;
            }
            user = result.Data;
        

            var userResponse = mapper.Map<UserResponse>(user);
            var loginResponse = jwtService.GenerateTokens(userResponse);
            await SendOkAsync(loginResponse, ct);
        }
        catch (Exception )
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(AuthErrors.InvalidCredentials));
        }
    }

    private async Task<Result<User>> GetLocalUserAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Result<User>.Failure(AuthErrors.InvalidCredentials);
        }

        var user = await context.Users.FirstOrDefaultAsync(x => x.Username == request.Username && x.IsDeleted == false, cancellationToken);

        if (user is null)
        {
            return Result<User>.Failure(AuthErrors.InvalidCredentials);
        }
        if (!hasher.Matches(user.Password, request.Password))
            return Result<User>.Failure(AuthErrors.InvalidCredentials);
        return Result<User>.Success(user);
    }
}
