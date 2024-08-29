using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Section.Data;

namespace TicketSystem.Api.Data;

public partial class TicketDbContext 
{
    public DbSet<Sections> Sections => Set<Sections>();
}