namespace Bevent.Api.Application.Services.Reservations.Dtos;

public sealed class UpdateReservationDto
{
    public required DateTime ReservationDate { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
    public required string Notes { get; init; }
    public List<Guid> ServiceIds { get; init; } = [];
    public List<UpdateReservationTaskDto> Tasks { get; init; } = [];
}

public sealed class UpdateReservationTaskDto
{
    public Guid? Id { get; init; }
    public required string Description { get; init; }
    public required bool IsCompleted { get; init; }
}

