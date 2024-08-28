using TicketSystem.Api.Common;

namespace TicketSystem.Api.Auth.Shared;

public abstract class UserErrors
{
    public static Error UsernameAlreadyExists => new(nameof(UsernameAlreadyExists), "Username already exists", StatusCodes.Status409Conflict);
    public static Error UsernameIsInvalid => new(nameof(UsernameIsInvalid), "Username is invalid");
    public static Error PasswordIsInvalid => new(nameof(PasswordIsInvalid), "Password is invalid");
    public static Error PasswordConfirmationIsInvalid => new(nameof(PasswordConfirmationIsInvalid), "Password confirmation is invalid");
    public static Error PasswordAndConfirmationIsNotMatched => new(nameof(PasswordAndConfirmationIsNotMatched), "Password and confirmation are not matched");
    public static Error FirstNameIsInvalid => new(nameof(FirstNameIsInvalid), "First name is invalid");
    public static Error LastNameIsInvalid => new(nameof(LastNameIsInvalid), "Last name is invalid");
    public static Error UserNotFound => new(nameof(UserNotFound), "User not found", StatusCodes.Status404NotFound);
    public static Error OldPasswordIsInvalid => new(nameof(OldPasswordIsInvalid), "Old password is invalid");
    public static Error NewPasswordIsInvalid => new(nameof(NewPasswordIsInvalid), "New password is invalid");
    public static Error NewPasswordConfirmationIsInvalid => new(nameof(NewPasswordConfirmationIsInvalid), "New Password confirmation is invalid");
    public static Error UserIdInvalid => new(nameof(UserIdInvalid), "User id is invalid");
    public static Error CashAccountNotFound => new(nameof(CashAccountNotFound), "Cash account not found", StatusCodes.Status404NotFound);
}

