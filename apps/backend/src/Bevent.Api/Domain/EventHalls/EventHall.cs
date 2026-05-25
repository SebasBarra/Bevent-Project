using Bevent.Api.Domain.AvailableSchedules;
using Bevent.Api.Domain.EventHallImages;
using Bevent.Api.Domain.Reservations;
using Bevent.Api.Domain.Services;
using Bevent.Api.Domain.Users;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.EventHalls;

public sealed class EventHall : Entity
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required int MaxCapacity { get; set; }
    public required decimal BasePrice { get; set; }
    public required string Location { get; set; }

    public Guid AdminId { get; set; }
    public User Admin { get; set; } = null!;

    public List<Service> Services { get; set; } = [];
    public List<AvailableSchedule> AvailableSchedules { get; set; } = [];
    public List<EventHallImage> EventHallImages { get; set; } = [];
    public List<Reservation> Reservations { get; set; } = [];
}
