using Microsoft.EntityFrameworkCore;


namespace TicketSystem.Api.Data;

public partial class TicketDbContext : DbContext
{
    public TicketDbContext(DbContextOptions options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TicketDbContext).Assembly);
    }
}
