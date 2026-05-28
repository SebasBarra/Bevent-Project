using System;
using Bevent.Api.Domain.EventHalls;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.EventHallImages;

public sealed class EventHallImage : Entity
{
    public Uri ImageUrl { get; set; } = new Uri("https://res.cloudinary.com/dhbpvtom7/image/upload/v1779945310/DefaultImage_pbb47u.jpg");
    public string ImagePublicId { get; set; } = "DefaultImage_pbb47u";
    public string Description { get; set; } = string.Empty;

    public Guid EventHallId { get; set; }
    public EventHall EventHall { get; set; } = null!;
}
