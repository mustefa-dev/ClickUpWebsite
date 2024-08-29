using FastEndpoints;
using FluentValidation;
using TicketSystem.Api.Auth.Shared;

namespace TicketSystem.Api.Auth.AddUser;
public class AddUserRequestValidator : Validator<AddUserRequest>
{
    public AddUserRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty()
            .WithErrorCode(UserErrors.UsernameIsInvalid.Code)
            .WithMessage(UserErrors.UsernameIsInvalid.Description);
        RuleFor(x => x.Password).NotEmpty()
            .WithErrorCode(UserErrors.PasswordIsInvalid.Code)
            .WithMessage(UserErrors.PasswordIsInvalid.Description);
    }
}