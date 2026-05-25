using Bevent.Api.Domain.ReservationServices;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

internal sealed class ReservationServiceConfiguration : RegisterConfiguration<ReservationService>
{
    protected override void ConfigureEntity(EntityTypeBuilder<ReservationService> builder)
    {
        builder.Property(b => b.PriceAtReservation).HasPrecision(10, 2);
    }
}
