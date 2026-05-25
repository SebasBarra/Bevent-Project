namespace Bevent.Api.Application.Services.Reservations.Dtos;

public sealed class CreateReservationDto
{
    public required Guid EventHallId { get; init; }
    public required DateTime ReservationDate { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
    public required string Notes { get; init; }
    public List<Guid> ServiceIds { get; init; } = [];
    public List<CreateReservationTaskDto> Tasks { get; init; } = [];
}

public sealed class CreateReservationTaskDto
{
    public required string Description { get; init; }
}
