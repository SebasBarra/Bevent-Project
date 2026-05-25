using Bevent.Api.Domain.EventHalls;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.EventHallImages;

public sealed class EventHallImage : Entity
{
    public required Uri ImageUrl { get; set; }
    public required string ImagePublicId { get; set; }
    public required string Description { get; set; }

    public Guid EventHallId { get; set; }
    public EventHall EventHall { get; set; } = null!;
}
