using TicketSystem.Api.Auth.Data;

namespace TicketSystem.Api.Auth.AddUser;

public class AddUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PasswordConfirmation { get; set; } = string.Empty;
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public Role Role { get; set; } = Role.User;
    public Ulid SectionId { get; set; }

}