namespace Bevent.Api.Application.Services.EventHalls.Dtos;

public sealed class UpdateEventHallDto
{
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required int MaxCapacity { get; init; }
    public required decimal BasePrice { get; init; }
    public required string Location { get; init; }
    public List<UpdateServiceDto> Services { get; init; } = [];
    public List<UpdateAvailableScheduleDto> AvailableSchedules { get; init; } = [];
}

public sealed class UpdateServiceDto
{
    public Guid? Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required decimal AdditionalCost { get; init; }
}

public sealed class UpdateAvailableScheduleDto
{
    public Guid? Id { get; init; }
    public required int DayOfWeek { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
}

