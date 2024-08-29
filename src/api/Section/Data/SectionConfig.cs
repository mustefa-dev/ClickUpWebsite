using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TicketSystem.Api.Auth.Data;

namespace TicketSystem.Api.Section.Data;

public class SectionConfig : IEntityTypeConfiguration<Sections>
{
    public void Configure(EntityTypeBuilder<Sections> builder)
    {
        var ulidConverter = new ValueConverter<Ulid, string>(
            v => v.ToString(),
            v => Ulid.Parse(v));

        builder.ToTable("Sections");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasConversion(ulidConverter);
        builder.Property(x => x.Name).IsRequired();
        builder.Property(x => x.UserId).HasConversion(ulidConverter); 
        builder.Property(x => x.CreatedBy).IsRequired().HasConversion(ulidConverter);
        builder.Property(x => x.IsDeleted).IsRequired();
        builder.HasOne<User>(x => x.CreatedByUser).WithMany().HasForeignKey(x => x.CreatedBy);
        builder.HasMany<User>(x => x.Users).WithOne(u => u.Section).HasForeignKey(u => u.SectionId);
    }
}