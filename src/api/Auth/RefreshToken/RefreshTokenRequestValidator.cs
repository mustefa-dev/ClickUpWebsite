using FastEndpoints;
using FluentValidation;
using TicketSystem.Api.Auth.Shared;

namespace TicketSystem.Api.Auth.RefreshToken;
public class RefreshTokenRequestValidator :Validator<RefreshTokensRequest>
{
    public RefreshTokenRequestValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty()
            .WithMessage(AuthErrors.InvalidRefreshToken.Description)
            .WithErrorCode(AuthErrors.InvalidRefreshToken.Code);
    }
}