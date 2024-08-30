using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketSystem.Api.Common;

namespace TicketSystem.Api.Tickets.Data
{
    public class TicketConfig : IEntityTypeConfiguration<Ticket>
    {
        public void Configure(EntityTypeBuilder<Ticket> builder)
        {
            // Configure the primary key
            builder.HasKey(x => x.Id);

            // Configure properties
            builder.Property(x => x.TicketTitle)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(x => x.CurrentStatus)
                .IsRequired();

            builder.Property(x => x.LastUpdated)
                .IsRequired();

            builder.Property(x => x.TicketNumber)
                .IsRequired();

            // Apply the value converter for Ulid
            var ulidConverter = new UlidConverter();

            builder.Property(x => x.Id)
                .HasConversion(ulidConverter)
                .IsRequired();

            builder.Property(x => x.CreatorId)
                .HasConversion(ulidConverter)
                .IsRequired();

            builder.Property(x => x.AssignedUserId)
                .HasConversion(ulidConverter);
            
            builder.HasOne(x => x.Creator)
                .WithMany()
                .HasForeignKey(x => x.CreatorId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.AssignedUser)
                .WithMany()
                .HasForeignKey(x => x.AssignedUserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure the IsDeleted property
            builder.Property(x => x.IsDeleted)
                .IsRequired();
        }
    }
}