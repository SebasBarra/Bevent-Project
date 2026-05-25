using Bevent.Api.Domain.EventHalls;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

internal sealed class EventHallConfiguration : EntityConfiguration<EventHall>
{
    protected override void ConfigureEntity(EntityTypeBuilder<EventHall> builder)
    {
        // Properties configuration
        builder.Property(b => b.BasePrice).HasPrecision(10, 2);
        builder.Property(x => x.Name).HasMaxLength(150);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.Location).HasMaxLength(500);

        // Search indexes
        builder.HasIndex(x => x.Name);
        builder.HasIndex(x => x.MaxCapacity);
        builder.HasIndex(x => x.BasePrice);
    }
}
