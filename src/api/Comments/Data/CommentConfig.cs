using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketSystem.Api.Common;

namespace TicketSystem.Api.Comments.Data
{
    public class CommentConfig : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Content)
                .IsRequired();

            builder.Property(x => x.CreatedDate)
                .IsRequired();

            builder.Property(x => x.IsDeleted)
                .IsRequired();

            var ulidConverter = new UlidConverter();

            builder.Property(x => x.Id)
                .HasConversion(ulidConverter)
                .IsRequired();

            builder.Property(x => x.CreatorId)
                .HasConversion(ulidConverter)
                .IsRequired();

            builder.Property(x => x.TicketId)
                .HasConversion(ulidConverter)
                .IsRequired();

            builder.HasOne(x => x.Creator)
                .WithMany()
                .HasForeignKey(x => x.CreatorId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Ticket)
                .WithMany()
                .HasForeignKey(x => x.TicketId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}