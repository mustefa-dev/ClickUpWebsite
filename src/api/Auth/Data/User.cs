using System.Text.Json.Serialization;
using TicketSystem.Api.Section.Data;

namespace TicketSystem.Api.Auth.Data;

public class User
{
    public Ulid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? FirstName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public Role Role { get; set; } = Role.User;
    public bool IsDeleted { get; set; } = false;
    public Ulid? SectionId { get; set; }

    public Sections? Section { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Role
{
    User,
    Admin
}