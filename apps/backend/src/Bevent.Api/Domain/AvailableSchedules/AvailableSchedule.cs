using Bevent.Api.Domain.EventHalls;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.AvailableSchedules;

public sealed class AvailableSchedule : Entity
{
    public required int DayOfWeek { get; set; }
    public required TimeOnly StartTime { get; set; }
    public required TimeOnly EndTime { get; set; }

    public Guid EventHallId { get; set; }
    public EventHall EventHall { get; set; } = null!;
}
