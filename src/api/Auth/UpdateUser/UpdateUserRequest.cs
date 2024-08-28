using TicketSystem.Api.Auth.Data;

namespace TicketSystem.Api.Auth.UpdateUser;

public class UpdateUserRequest
{
    public string? Username { get; set; } = string.Empty;
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? Password { get; set; }
    public Role? Role { get; set; }
}
