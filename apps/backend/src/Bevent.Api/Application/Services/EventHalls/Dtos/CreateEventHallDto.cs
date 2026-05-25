namespace Bevent.Api.Application.Services.EventHalls.Dtos;

public sealed class CreateEventHallDto
{
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required int MaxCapacity { get; init; }
    public required decimal BasePrice { get; init; }
    public required string Location { get; init; }
    public List<ServiceDto> Services { get; init; } = [];
    public List<AvailableScheduleDto> AvailableSchedules { get; init; } = [];
}

