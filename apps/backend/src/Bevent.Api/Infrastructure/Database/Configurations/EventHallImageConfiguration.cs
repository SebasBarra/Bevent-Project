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
        builder.Property(x => x.ImagePublicId)
            .HasMaxLength(255)
            .HasDefaultValue("DefaultImage_pbb47u");
        builder.Property(x => x.Description)
            .HasMaxLength(500)
            .HasDefaultValue(string.Empty);
        builder
            .Property(x => x.ImageUrl)
            .HasMaxLength(2048)
            .HasConversion(v => v.ToString(), v => new Uri(v))
            .HasDefaultValue(new Uri("https://res.cloudinary.com/dhbpvtom7/image/upload/v1779945310/DefaultImage_pbb47u.jpg"));

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
