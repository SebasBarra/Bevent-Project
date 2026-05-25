using Bevent.Api.Domain.EventHalls;
using Bevent.Api.Domain.Reservations;
using Bevent.Api.Domain.ReservationServices;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.Services;

public sealed class Service : Entity
{
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required decimal AdditionalCost { get; init; }

    public Guid EventHallId { get; set; }
    public EventHall EventHall { get; set; } = null!;

    public List<Reservation> Reservations { get; set; } = [];
    public List<ReservationService> ReservationServices { get; set; } = [];
}
