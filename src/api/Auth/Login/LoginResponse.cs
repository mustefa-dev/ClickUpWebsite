using TicketSystem.Api.Auth.Shared;

namespace TicketSystem.Api.Auth.Login;

public class LoginResponse : UserResponse
{
    public string? AccessToken { get; set; } 
    public string? RefreshToken { get; set; }
}
