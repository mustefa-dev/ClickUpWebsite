using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;

namespace TicketSystem.Api.Section.Data;

public class Sections : BaseEntity<Ulid>
{
    public string? Name { get; set; }
    public Ulid? UserId { get; set; }
    public List<User>? Users { get; set; }
    public Ulid? CreatedBy { get; set; }
    public User? CreatedByUser { get; set; }
    public bool? IsDeleted { get; set; }
}