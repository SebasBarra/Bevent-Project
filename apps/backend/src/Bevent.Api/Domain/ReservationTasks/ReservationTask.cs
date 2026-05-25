using Bevent.Api.Domain.Reservations;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.ReservationTasks;

public sealed class ReservationTask : Entity
{
    public required string Description { get; set; }
    public required bool IsCompleted { get; set; }

    public Guid ReservationId { get; set; }
    public Reservation Reservation { get; set; } = null!;
}
