using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Tickets.Data;

public class UserConfig : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(x => x.Id)
            .HasMaxLength(26)
            .HasConversion(x => x.ToString(), x => Ulid.Parse(x));
        builder.Property(x => x.Username).HasMaxLength(64);
        builder.Property(x => x.Password).HasMaxLength(128);
        builder.Property(x => x.FirstName).HasMaxLength(128);
        builder.Property(x => x.PhoneNumber).HasMaxLength(24);
        builder.Property(x => x.Email).HasMaxLength(64);

        builder.HasIndex(x => x.Role);
        builder.HasIndex(x => x.Username);

        builder.HasMany(x => x.CreatedTickets)
            .WithOne(x => x.Creator)
            .HasForeignKey(x => x.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.AssignedTickets)
            .WithMany(x => x.AssignedUsers)
            .UsingEntity<Dictionary<string, object>>(
                "TicketAssignedUser",
                j => j.HasOne<Ticket>().WithMany().HasForeignKey("TicketId"),
                j => j.HasOne<User>().WithMany().HasForeignKey("AssignedUserId"));
    }
}