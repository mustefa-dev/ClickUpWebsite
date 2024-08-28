using TicketSystem.Api.Auth.Data;

namespace TicketSystem.Api.Auth.Shared;

public class UserResponse
{
    public Ulid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? ExternalId { get; set; }
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool? IsDeleted { get; set; }
    public Role Role { get; set; } = Role.User;
}