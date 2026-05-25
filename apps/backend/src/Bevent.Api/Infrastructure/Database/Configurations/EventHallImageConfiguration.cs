using Bevent.Api.Domain.EventHallImages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

internal sealed class EventHallImageConfiguration : EntityConfiguration<EventHallImage>
{
    protected override void ConfigureEntity(EntityTypeBuilder<EventHallImage> builder)
    {
        // Unique indexes
        builder.HasIndex(x => x.ImagePublicId).IsUnique();

        // Search indexes
        builder.HasIndex(x => x.EventHallId);

        // Properties configuration
        builder.Property(x => x.ImagePublicId).HasMaxLength(255);
        builder.Property(x => x.Description).HasMaxLength(500);
        builder
            .Property(x => x.ImageUrl)
            .HasMaxLength(2048)
            .HasConversion(v => v.ToString(), v => new Uri(v));

        // Relationships
        // Cascade: Al eliminar un salón, sus imágenes se eliminan automáticamente
        builder
            .HasOne(x => x.EventHall)
            .WithMany(x => x.EventHallImages)
            .HasForeignKey(x => x.EventHallId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}
