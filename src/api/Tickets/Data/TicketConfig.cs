using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;

namespace TicketSystem.Api.Tickets.Data
{
    public class TicketConfig : IEntityTypeConfiguration<Ticket>
    {
        public void Configure(EntityTypeBuilder<Ticket> builder)
        {
            // Primary key configuration
            builder.HasKey(x => x.Id);

            // Property configurations
            builder.Property(x => x.TicketTitle)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(x => x.CurrentStatus).IsRequired();
            builder.Property(x => x.LastUpdated).IsRequired();
            builder.Property(x => x.TicketNumber).IsRequired();

            // Value converter for Ulid
            var ulidConverter = new UlidConverter();
            builder.Property(x => x.Id).HasConversion(ulidConverter).IsRequired();
            builder.Property(x => x.CreatorId).HasConversion(ulidConverter).IsRequired();

            // Configure the value conversion for the List<Ulid> (AssignedUserIds)
            builder.Property(x => x.AssignedUserIds)
                .HasConversion(new ValueConverter<List<Ulid>, string>(
                    v => string.Join(',', v), // Convert List<Ulid> to a comma-separated string
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(Ulid.Parse).ToList())) // Convert back from a string to List<Ulid>
                .HasColumnType("text"); // Define the database column type, e.g., text

            // Relationship configurations
            builder.HasOne(x => x.Creator)
                .WithMany(u => u.CreatedTickets)
                .HasForeignKey(x => x.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.AssignedUsers)
                .WithMany(x => x.AssignedTickets)
                .UsingEntity<Dictionary<string, object>>(
                    "TicketAssignedUser",
                    j => j.HasOne<User>().WithMany().HasForeignKey("AssignedUserId"),
                    j => j.HasOne<Ticket>().WithMany().HasForeignKey("TicketId"));

            // IsDeleted configuration
            builder.Property(x => x.IsDeleted).IsRequired();
        }
    }


}