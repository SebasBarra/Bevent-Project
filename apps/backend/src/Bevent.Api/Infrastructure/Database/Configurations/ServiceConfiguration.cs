using Bevent.Api.Domain.Reservations;
using Bevent.Api.Domain.ReservationServices;
using Bevent.Api.Domain.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

internal sealed class ServiceConfiguration : EntityConfiguration<Service>
{
    protected override void ConfigureEntity(EntityTypeBuilder<Service> builder)
    {
        // Properties configuration
        builder.Property(b => b.AdditionalCost).HasPrecision(10, 2);
        builder.Property(x => x.Name).HasMaxLength(150);
        builder.Property(x => x.Description).HasMaxLength(1000);

        // Search indexes
        builder.HasIndex(x => x.Name);
        builder.HasIndex(x => x.EventHallId);

        // Relationships
        // Cascade: Al eliminar un salón, sus servicios se eliminan automáticamente
        builder
            .HasOne(x => x.EventHall)
            .WithMany(x => x.Services)
            .HasForeignKey(x => x.EventHallId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder
            .HasMany(o => o.Reservations)
            .WithMany(p => p.Services)
            .UsingEntity<ReservationService>(
                // Cascade: Al eliminar una reservación, los servicios asociados se eliminan
                r =>
                    r.HasOne<Reservation>(e => e.Reservation)
                        .WithMany(e => e.ReservationServices)
                        .HasForeignKey(e => e.ReservationId)
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired(),
                // Restrict: No se puede eliminar un servicio si está asociado a reservaciones
                l =>
                    l.HasOne<Service>(e => e.Service)
                        .WithMany(e => e.ReservationServices)
                        .HasForeignKey(e => e.ServiceId)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
            );
    }
}
