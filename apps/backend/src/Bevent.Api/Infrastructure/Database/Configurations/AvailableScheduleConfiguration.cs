using Bevent.Api.Domain.AvailableSchedules;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

internal sealed class AvailableScheduleConfiguration : EntityConfiguration<AvailableSchedule>
{
    protected override void ConfigureEntity(EntityTypeBuilder<AvailableSchedule> builder)
    {
        // Search indexes
        builder.HasIndex(x => x.EventHallId);
        builder.HasIndex(x => x.DayOfWeek);
        builder.HasIndex(x => new { x.EventHallId, x.DayOfWeek }); // Composite index for schedule queries

        builder
            .HasOne(x => x.EventHall)
            .WithMany(x => x.AvailableSchedules)
            .HasForeignKey(x => x.EventHallId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}
