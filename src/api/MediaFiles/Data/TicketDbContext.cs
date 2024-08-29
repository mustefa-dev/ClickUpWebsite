using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.MediaFiles.Data;

namespace TicketSystem.Api.Data;

public partial class TicketDbContext
{
    public DbSet<Media> Medias => Set<Media>();
}
