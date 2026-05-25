namespace Bevent.Api.Application.Services.EventHalls.Dtos;

public sealed class AvailableScheduleDto
{
    public required int DayOfWeek { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
}

public sealed class AvailableScheduleResponseDto
{
    public required Guid Id { get; init; }
    public required int DayOfWeek { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
}

