using System;

namespace Bevent.Api.Application.Services.EventHalls.Dtos;

public sealed class EventHallImageDto
{
    public required Guid Id { get; init; }
    public required string ImageUrl { get; init; }
    public required string ImagePublicId { get; init; }
    public required string Description { get; init; }
}
