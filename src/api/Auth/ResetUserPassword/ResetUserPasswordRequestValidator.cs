using FastEndpoints;
using FluentValidation;
using TicketSystem.Api.Auth.Shared;

namespace TicketSystem.Api.Auth.ResetUserPassword;

public class ResetUserPasswordRequestValidator : Validator<ResetUserPasswordRequest>
{
    public ResetUserPasswordRequestValidator()
    {
        RuleFor(x => x.OldPassword)
            .NotEmpty()
            .WithErrorCode(UserErrors.OldPasswordIsInvalid.Code)
            .WithMessage(UserErrors.OldPasswordIsInvalid.Description);
        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .WithErrorCode(UserErrors.NewPasswordIsInvalid.Code)
            .WithMessage(UserErrors.NewPasswordIsInvalid.Description);
        RuleFor(x => x.NewPasswordConfirmation)
            .NotEmpty()
            .WithErrorCode(UserErrors.NewPasswordConfirmationIsInvalid.Code)
            .WithMessage(UserErrors.NewPasswordConfirmationIsInvalid.Description);
        RuleFor(x => x.OldPassword)
            .Equal(x => x.NewPasswordConfirmation)
            .WithErrorCode(UserErrors.PasswordAndConfirmationIsNotMatched.Code)
            .WithMessage(UserErrors.PasswordAndConfirmationIsNotMatched.Description);
    }
}
