namespace Bevent.Api.Application.Services.Reservations.Dtos;

public sealed class ReservationSummaryDto
{
    public required Guid Id { get; init; }
    public required DateTime ReservationDate { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
    public required string Status { get; init; }
    public required string ClientName { get; init; }
    public required string ClientEmail { get; init; }
    public required string ClientPhone { get; init; }
    public required string EventHallName { get; init; }
}

