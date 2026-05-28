namespace Bevent.Api.Application.Services.EventHalls.Dtos;

public sealed class EventHallResponseDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required int MaxCapacity { get; init; }
    public required decimal BasePrice { get; init; }
    public required string Location { get; init; }
    public required DateTime CreatedOnUtc { get; init; }
    public DateTime? UpdatedOnUtc { get; init; }
    public List<ServiceResponseDto> Services { get; init; } = [];
    public List<AvailableScheduleResponseDto> AvailableSchedules { get; init; } = [];
    public List<EventHallImageDto> EventHallImages { get; init; } = [];
}

