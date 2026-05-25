namespace Bevent.Api.Application.Services.Reservations.Dtos;

public sealed class ReservationDetailDto
{
    public required Guid Id { get; init; }
    public required DateTime ReservationDate { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
    public required decimal TotalCost { get; init; }
    public required string Status { get; init; }
    public required string Notes { get; init; }
    public required DateTime CreatedOnUtc { get; init; }
    public DateTime? UpdatedOnUtc { get; init; }
    public required ReservationClientDto Client { get; init; }
    public required ReservationEventHallDto EventHall { get; init; }
    public List<ReservationServiceDto> Services { get; init; } = [];
    public List<ReservationTaskDto> Tasks { get; init; } = [];
}

public sealed class ReservationClientDto
{
    public required Guid Id { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }
    public required string PhoneNumber { get; init; }
}

public sealed class ReservationEventHallDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Location { get; init; }
    public required decimal BasePrice { get; init; }
}

public sealed class ReservationServiceDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required decimal PriceAtReservation { get; init; }
}

public sealed class ReservationTaskDto
{
    public required Guid Id { get; init; }
    public required string Description { get; init; }
    public required bool IsCompleted { get; init; }
}

