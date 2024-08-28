using System.Text.Json.Serialization;


namespace TicketSystem.Api.Auth.Data;

public class User
{
    public Ulid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? ExternalId { get; set; }
    public string Password { get; set; } = string.Empty;
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public Role Role { get; set; } = Role.User;
    public bool IsDeleted { get; set; } = false;
    
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Role
{
    User,
    Admin
}
