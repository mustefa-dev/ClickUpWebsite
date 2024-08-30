using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Section.Data;
using TicketSystem.Api.Tickets.Data;

namespace TicketSystem.Api.Data;

public partial class TicketDbContext 
{
    public DbSet<Ticket> Tickets => Set<Ticket>();
}