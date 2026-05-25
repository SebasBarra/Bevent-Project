using Bevent.Api.Domain.ReservationTasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

internal sealed class ReservationTaskConfiguration : EntityConfiguration<ReservationTask>
{
    protected override void ConfigureEntity(EntityTypeBuilder<ReservationTask> builder)
    {
        // Properties configuration
        builder.Property(x => x.Description).HasMaxLength(500);

        // Search indexes
        builder.HasIndex(x => x.ReservationId);
        builder.HasIndex(x => x.IsCompleted);

        // Relationships
        // Cascade: Al eliminar una reservación, sus tareas se eliminan automáticamente
        builder
            .HasOne(x => x.Reservation)
            .WithMany(x => x.ReservationTasks)
            .HasForeignKey(x => x.ReservationId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}
