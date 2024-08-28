using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketSystem.Api.Auth.Data;

namespace TicketSystem.Api.MediaFiles.Data;

public sealed class MediaConfig : IEntityTypeConfiguration<Media>
{
    public void Configure(EntityTypeBuilder<Media> builder)
    {
        builder.Property(x => x.Id)
            .HasMaxLength(26)
            .HasConversion(x => x.ToString(), x => Ulid.Parse(x));

        builder.Property(x => x.UploaderId)
            .HasMaxLength(26)
            .HasConversion(x => x == null ? null : x.ToString(), x => x == null ? null : Ulid.Parse(x));

        builder.HasIndex(x => x.UploaderId);
    }
}
