using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.MediaFiles.Data;

namespace TicketSystem.Api.Data;

public partial class BuildifyDbContext
{
    public DbSet<Media> Medias => Set<Media>();
}
