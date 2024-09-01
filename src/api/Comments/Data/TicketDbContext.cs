using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Comments.Data;

namespace TicketSystem.Api.Data;

public partial class TicketDbContext 
{
    public DbSet<Comment> Comments => Set<Comment>();
}