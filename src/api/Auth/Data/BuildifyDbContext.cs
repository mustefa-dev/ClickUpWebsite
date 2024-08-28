using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;

namespace TicketSystem.Api.Data;

public partial class BuildifyDbContext 
{
    public DbSet<User> Users => Set<User>();
}
