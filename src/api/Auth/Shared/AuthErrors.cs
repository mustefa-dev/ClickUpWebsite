using TicketSystem.Api.Common;

namespace TicketSystem.Api.Auth.Shared;
public abstract class AuthErrors
{
    public static Error InvalidCredentials => new(nameof(InvalidCredentials), "Invalid credentials");
    public static Error FirebaseAuthNotInitialized => new(nameof(FirebaseAuthNotInitialized), "Firebase auth not initialized");
    public static Error ExternalTokenIsInvalid => new(nameof(ExternalTokenIsInvalid), "External token is invalid");
    public static Error InvalidRefreshToken => new(nameof(InvalidRefreshToken), "Invalid refresh token");
}