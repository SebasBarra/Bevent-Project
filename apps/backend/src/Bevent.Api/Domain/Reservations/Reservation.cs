using Bevent.Api.Domain.EventHalls;
using Bevent.Api.Domain.ReservationServices;
using Bevent.Api.Domain.ReservationTasks;
using Bevent.Api.Domain.Services;
using Bevent.Api.Domain.Users;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.Reservations;

public sealed class Reservation : Entity
{
    public required DateTime ReservationDate { get; set; }
    public required TimeOnly StartTime { get; set; }
    public required TimeOnly EndTime { get; set; }
    public required decimal TotalCost { get; set; }
    public required ReservationStatus Status { get; set; }
    public required string Notes { get; set; }

    public Guid ClientId { get; set; }
    public User Client { get; set; } = null!;

    public Guid EventHallId { get; set; }
    public EventHall EventHall { get; set; } = null!;

    public List<ReservationTask> ReservationTasks { get; set; } = [];

    public List<Service> Services { get; set; } = [];
    public List<ReservationService> ReservationServices { get; set; } = [];
}
