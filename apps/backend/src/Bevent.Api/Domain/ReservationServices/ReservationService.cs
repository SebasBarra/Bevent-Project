using Bevent.Api.Domain.Reservations;
using Bevent.Api.Domain.Services;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.ReservationServices;

public sealed class ReservationService : Register
{
    public Guid ReservationId { get; set; }
    public Reservation Reservation { get; set; } = null!;

    public Guid ServiceId { get; set; }
    public Service Service { get; set; } = null!;

    public required decimal PriceAtReservation { get; set; }
}
