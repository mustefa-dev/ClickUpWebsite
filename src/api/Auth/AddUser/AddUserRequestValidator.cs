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
        RuleFor(x => x.PasswordConfirmation).NotEmpty()
            .WithErrorCode(UserErrors.PasswordConfirmationIsInvalid.Code)
            .WithMessage(UserErrors.PasswordConfirmationIsInvalid.Description);
        RuleFor(x => x.Password).Equal(x => x.PasswordConfirmation)
            .WithErrorCode(UserErrors.PasswordAndConfirmationIsNotMatched.Code)
            .WithMessage(UserErrors.PasswordAndConfirmationIsNotMatched.Description);
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithErrorCode(UserErrors.FirstNameIsInvalid.Code)
            .WithMessage(UserErrors.FirstNameIsInvalid.Description);
        RuleFor(x => x.LastName).NotEmpty()
            .WithErrorCode(UserErrors.LastNameIsInvalid.Code)
            .WithMessage(UserErrors.LastNameIsInvalid.Description);
    }
}