using Bevent.Api.Domain.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

internal sealed class ReservationConfiguration : EntityConfiguration<Reservation>
{
    protected override void ConfigureEntity(EntityTypeBuilder<Reservation> builder)
    {
        // DateTime UTC conversion
        builder
            .Property(r => r.ReservationDate)
            .HasConversion(
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

        // Properties configuration
        builder.Property(b => b.TotalCost).HasPrecision(10, 2);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.Notes).HasMaxLength(1000);

        // Indexes for search optimization
        builder.HasIndex(x => x.ReservationDate);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.ClientId);
        builder.HasIndex(x => x.EventHallId);
        builder.HasIndex(x => new { x.EventHallId, x.ReservationDate }); // Composite index for hall availability queries

        // Relationships
        // Restrict: No se puede eliminar un usuario si tiene reservaciones (historial importante)
        builder
            .HasOne(x => x.Client)
            .WithMany(x => x.Reservations)
            .HasForeignKey(x => x.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired();

        // Restrict: No se puede eliminar un salón si tiene reservaciones
        builder
            .HasOne(x => x.EventHall)
            .WithMany(x => x.Reservations)
            .HasForeignKey(x => x.EventHallId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired();
    }
}
